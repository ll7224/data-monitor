import ajax from "./ajax";
// import { baseUrl } from "../utils/baseUrl";

export const addRole = (hierarchyId, roleName, authorityIds) =>
  ajax.post(`/api/roles`, { hierarchyId, roleName, authorityIds });
export const editRole = (roleId, roleName, authorityIds) =>
  ajax.put(`/api/roles/${roleId}`, { roleId, roleName, authorityIds });
export const deleteRole = roleId => ajax.delete(`/api/roles/${roleId}`);
