import { onRequest, onSuccess, onFailed, createAsynAction } from "./helper";
import { isEmpty, groupBy, reduce, forEach } from "lodash";
// import { baseUrl } from "@/utils/baseUrl";

export const GET_ROLES = "GET_ROLES";

const getAuthorityName = authorities => {
  let reduceName = "";
  if (authorities.length === 1) {
    reduceName = authorities[0].name;
  } else {
    reduceName = reduce(
      authorities.map(auth => auth.name),
      (x, y) => `${x}&${y}`
    );
  }
  return reduceName;
};

const getAuthoritiesAndSubMenuName = menus => {
  let authorityAndSubMenuName = "";
  forEach(menus, value => {
    value.forEach(v => {
      if (!isEmpty(v.authorities)) {
        const reduceName = getAuthorityName(v.authorities);
        if (authorityAndSubMenuName) {
          authorityAndSubMenuName += "、";
        }
        authorityAndSubMenuName += `${v.name} (${reduceName})`;
      }
    });
  });
  return authorityAndSubMenuName;
};

const getAuthoritiesAndAllMenuName = firstMenus => {
  let authorityAndAllMenuName = "";
  firstMenus.forEach(element => {
    const parentMenuName = element.name;
    const subMenus = element.children;
    const menus = groupBy(subMenus, menu => menu.parentId);
    const authorityAndSubMenuName = getAuthoritiesAndSubMenuName(menus);
    if (authorityAndSubMenuName) {
      if (authorityAndAllMenuName) {
        authorityAndAllMenuName += "; ";
      }
      authorityAndAllMenuName += `${parentMenuName}: ${authorityAndSubMenuName}`;
    }
  });
  return authorityAndAllMenuName;
};
const getAuthorities = rawRoleData => {
  let auths = [];
  if (isEmpty(rawRoleData)) return [];
  rawRoleData.forEach(roleData => {
    auths = auths.concat(
      roleData.authorities,
      getAuthorities(roleData.children)
    );
  });
  return auths;
};

const converRoleToTableData = role => {
  const result = {
    hierachyName: role.hierarchyName,
    roleName: role.name,
    roleId: role.id,
    menuName: "",
    authorities: getAuthorities(role.menuAuthorities)
  };
  if (role.hasAllAuthorities) {
    result.menuName = "全部菜单权限";
  } else {
    result.menuName = getAuthoritiesAndAllMenuName(role.menuAuthorities);
  }
  return result;
};
export default {
  state: {
    roles: []
  },
  getters: {
    showRoles: ({ roles }) => roles.map(converRoleToTableData)
  },
  mutations: {
    [onRequest(GET_ROLES)]: () => {},
    [onSuccess(GET_ROLES)]: (state, { data }) => {
      state.roles = data;
    },
    [onFailed(GET_ROLES)]: () => {}
  },
  actions: {
    [GET_ROLES]: (store, hierarchyId) =>
      createAsynAction(store, GET_ROLES, {
        url: `/api/roles?hierarchyId=${hierarchyId}`
      })
  }
};
