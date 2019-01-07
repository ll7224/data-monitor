import ajax from "../ajax";
import { baseUrl } from "@/utils/baseUrl";
// eslint-disable-next-line
export const getUser = (userEmailNum) => ajax.get(baseUrl+`/users/${userEmailNum}`);

export const addUser = ({
  organizationId,
  userEmailNum,
  roles,
  materialCodes,
  hasAllMaterials
}) =>
  ajax.post(baseUrl + "/users", {
    organizationId,
    userEmailNum,
    roles,
    materialCodes,
    hasAllMaterials
  });

export const editUser = ({
  userId,
  userEmailNum,
  roles,
  materialCodes,
  hasAllMaterials
}) =>
  ajax.put(baseUrl + `/users/${userId}`, {
    userEmailNum,
    roles,
    materialCodes,
    hasAllMaterials
  });
export const deleteUser = userId => ajax.delete(baseUrl + `/users/${userId}`);
