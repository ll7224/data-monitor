import ajax from "./ajax";
// import { baseUrl } from "@/utils/baseUrl";

export const addHierarchy = (parentId, name) =>
  ajax.post("/api/hierarchies", { name, parentId });

export const updateHierarchyName = (id, name) =>
  ajax.put(`/api/hierarchies/${id}`, { name });

export const deleteHierarchy = id => ajax.delete(`/api/hierarchies/${id}`);
