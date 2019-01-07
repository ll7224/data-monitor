import {
  onRequest,
  onSuccess,
  createBasicAsyncMutation,
  createAsynAction
} from "../helper";
import { isEmpty } from "lodash";
// import { baseUrl } from "@/utils/baseUrl";
import { rebuildTree } from "@/utils/util";
export const GET_ORGANIZATONS = "GET_ORGANIZATONS";
export const GET_ORGANIZATONS_CODES = "GET_ORGANIZATONS_CODES";
export const GET_MATERIAL_GROUPS_BY_ID = "GET_MATERIAL_GROUPS_BY_ID";

const buildOrganizationNode = nodeData => {
  const node = {
    ...nodeData,
    expand: true,
    organizationName: nodeData.name,
    name: `${nodeData.name} - ${nodeData.hierarchyName}`,
    children: !isEmpty(nodeData.children)
      ? nodeData.children.map(buildOrganizationNode)
      : []
  };
  return node;
};

const buildMaterialGroups = materialGroupsInfo => {
  if (materialGroupsInfo.data.hasAllMaterialGroups) {
    return "全部物料组";
  } else if (isEmpty(materialGroupsInfo.data.materialGroups)) {
    return "";
  }
  return materialGroupsInfo.data.materialGroups
    .map(group => `${group.name}(${group.code})`)
    .join("、");
};

export default {
  state: {
    data: [],
    organizationsCodes: [],
    materialGroupsInfo: {
      data: {},
      isLoading: false
    }
  },
  getters: {
    organizations: ({ data }) => rebuildTree(data.map(buildOrganizationNode)),
    materialGroupsInfo: ({ materialGroupsInfo }) => ({
      ...materialGroupsInfo,
      text: buildMaterialGroups(materialGroupsInfo)
    })
  },
  mutations: {
    ...createBasicAsyncMutation(GET_ORGANIZATONS),
    [onSuccess(GET_ORGANIZATONS)]: (state, { data }) => {
      state.data = data;
    },
    ...createBasicAsyncMutation(GET_ORGANIZATONS_CODES),
    [onSuccess(GET_ORGANIZATONS_CODES)]: (state, { data }) => {
      state.organizationsCodes = data;
    },
    [onRequest(GET_MATERIAL_GROUPS_BY_ID)]: state => {
      state.materialGroupsInfo = { isLoading: true, data: {} };
    },
    [onSuccess(GET_MATERIAL_GROUPS_BY_ID)]: (state, { data }) => {
      state.materialGroupsInfo = { isLoading: false, data };
    }
  },
  actions: {
    [GET_ORGANIZATONS]: store =>
      createAsynAction(store, GET_ORGANIZATONS, {
        url: "/api/organizations"
      }),
    [GET_ORGANIZATONS_CODES]: store =>
      createAsynAction(store, GET_ORGANIZATONS_CODES, {
        url: "/api/organizations/organization-mappings"
      }),
    [GET_MATERIAL_GROUPS_BY_ID]: (store, id) =>
      createAsynAction(store, GET_MATERIAL_GROUPS_BY_ID, {
        url: `/api/organizations/${id}/material-groups`
      })
  }
};
