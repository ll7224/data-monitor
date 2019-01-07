import ajax from "../ajax";
// import { baseUrl } from "@/utils/baseUrl";
// eslint-disable-next-line
export const getMaterialGroup = materialGroupCode => ajax.get(`/api/material-groups/${materialGroupCode}`);
