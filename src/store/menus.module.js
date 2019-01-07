import { getMenuList } from "../service/menulist.service";
import menuConfig from "../routers/menu.config";
// import { baseUrl } from "@/utils/baseUrl";
export const GET_MENU = "GET_MENU";
const GET_MENU_SUCCESS = "GET_MENU_SUCCESS";

const addRouteToMenu = menu => {
  menu.route = menuConfig[menu.code] || "/";
  if (menu.children) {
    menu.children.map(addRouteToMenu);
  }
  return menu;
};
export default {
  state: {
    menus: []
  },
  getters: {
    mainMenus: ({ menus }) => menus,
    businessMenus: ({ menus }) => menus.filter(menu => !menu.system),
    systemMenus: ({ menus }) => menus.filter(menu => menu.system === true)
  },
  mutations: {
    [GET_MENU_SUCCESS]: (state, payload) => {
      state.menus = payload.menus;
    }
  },
  actions: {
    [GET_MENU]: ({ commit }, data) =>
      new Promise(resolve => {
        // eslint-disable-line no-unused-vars
        getMenuList(data).then(response => {
          const res = response;
          const menus = res.map(addRouteToMenu);
          commit(GET_MENU_SUCCESS, { menus });
          resolve(menus);
          console.log(menus);
        });
      })
  }
};
