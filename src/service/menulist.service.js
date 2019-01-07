import ajax from "./ajax";
// import { baseUrl } from "../utils/baseUrl";

export const getMenuList = () => ajax.get("/api/menus");
