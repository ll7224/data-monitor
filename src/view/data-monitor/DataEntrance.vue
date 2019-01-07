<template>
  <div>
    <Menu mode="horizontal" :active-name="activeMenu">
      <MenuItem
        v-for="menuItem in menuItems"
        :key="menuItem.name"
        :name="menuItem.name"
        :to="menuItem.to">
        {{menuItem.label}}
      </MenuItem>
    </Menu>
    <router-view/>
  </div>
</template>
<script>
import { DATA_ENTRANCE_MENU_NAME, DATA_ENTRANCE_MENUS } from "@/utils/constant";

export default {
  name: "SkynetDataEntrance",
  data() {
    return {
      activeMenu: DATA_ENTRANCE_MENU_NAME.SAMPLE,
      menuItems: DATA_ENTRANCE_MENUS
    };
  }
  // beforeRouteEnter(to, from, next) {
  //   next((vm) => {
  //     vm.activeMenu = to.name;
  //   });
  // },
};
</script>
