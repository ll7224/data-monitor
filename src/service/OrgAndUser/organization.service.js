import ajax from "../ajax";
import { baseUrl } from "@/utils/baseUrl";
// eslint-disable-next-line
export const addOrganization = (parentId, hierarchyId, code) => ajax.post(baseUrl + '/organizations', { parentId, hierarchyId, code });
export const editOrganization = (id, code) =>
  ajax.put(`/api/organizations/${id}`, { code });
export const deleteOrganization = id => ajax.delete(`/api/organizations/${id}`);

export const updateOrganizationMaterialGroups = (
  organizationId,
  materialGroups,
  hasAllMaterialGroups
) =>
  ajax.put(`/api/organizations/${organizationId}/material-groups`, {
    organizationId,
    hasAllMaterialGroups,
    materialGroupCodes: materialGroups.map(materialGroup => materialGroup.code)
  });
export const getMaterialByOrgIdAndCode = (organizationId, code) =>
  ajax.get(`/api/organizations/${organizationId}/materials/${code}`);
export const deleteAuthority = organizationId =>
  ajax.delete(`/api/organizations/${organizationId}/material-groups`);
