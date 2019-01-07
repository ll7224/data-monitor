import Vue from "vue";
import Vuex from "vuex";
import menu from "./menus.module";
import hierachy from "./hierarchies.module";
import role from "./role.module";
import organizations from "./OrgAndUser/organization.module";
import users from "./OrgAndUser/users.module";
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    menu,
    role,
    hierachy,
    organizations,
    users
  }
});
