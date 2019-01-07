import { onRequest, onSuccess, onFailed, createAsynAction } from "./helper";
import { isEmpty } from "lodash";
// import { baseUrl } from "@/utils/baseUrl";

/* eslint no-param-reassign: ["error", { "props": false }] */
const buildHierachyNode = data => {
  data.expand = true;
  if (!isEmpty(data.children)) {
    data.children.map(buildHierachyNode);
  }
  return data;
};
export const GET_HIERACHY = "GET_HIERACHY";
export default {
  state: {
    hierachy: []
  },
  getters: {
    topHierachy: ({ hierachy }) =>
      hierachy.map(h => ({ id: h.id, name: h.name }))[0]
  },
  mutations: {
    [onRequest(GET_HIERACHY)]: () => {},
    [onSuccess(GET_HIERACHY)]: (state, { data }) => {
      console.log(data);
      data.map(buildHierachyNode);
      state.hierachy = data;
    },
    [onFailed(GET_HIERACHY)]: () => {}
  },
  actions: {
    [GET_HIERACHY]: store =>
      createAsynAction(store, GET_HIERACHY, {
        url: "/api/hierarchies"
      })
  }
};
