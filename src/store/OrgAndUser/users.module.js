import { onRequest, onSuccess, onFailed, createAsynAction } from "../helper";
// import { baseUrl } from "@/utils/baseUrl";
export const GET_USERS = "GET_USERS";

const convertUserToTableData = user => {
  const result = {
    ...user,
    roleNames: user.roles.map(role => role.name).join("、"),
    materialNames: user.allMaterial
      ? "所管辖的全部物料"
      : user.materials
          .map(material => `${material.name}(${material.code})`)
          .join("、")
  };
  return result;
};

export default {
  state: {
    data: []
  },
  getters: {
    users: ({ data }) => data.map(convertUserToTableData)
  },
  mutations: {
    [onRequest(GET_USERS)]: () => {},
    [onSuccess(GET_USERS)]: (state, { data }) => {
      state.data = data;
    },
    [onFailed(GET_USERS)]: () => {}
  },
  actions: {
    [GET_USERS]: (store, organizationId) =>
      createAsynAction(store, GET_USERS, {
        url: `/api/users?organizationId=${organizationId}`
      })
  }
};
