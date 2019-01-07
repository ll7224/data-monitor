<template>
 <div>
  <div class="header-row">
    <Row class="layout">
      <Col span="4" class="gree-logo">
        <img src="../assets/src_assets_logo@3x.png">
      </Col>
      <Col span="20" class="nav-wrap">
        <ul class="navbar">
          <li v-for="menu in businessMenus"
              :key="menu.code"
              :to="menu.route"
              is="skyneNavItem"         
          >
            {{menu.name}}
          </li>
        </ul>
        <ul class="navbar nav-right">
          <li v-for="systemMenu in systemMenus"
              :key="systemMenu.code"
              :to="systemMenu.route"
              is="skyneNavItem"
              class="menuStyle"
          >
          <Icon type="md-settings"/>
           {{systemMenu.name}}
          </li>
          <li is="skyneNavItem">
            <Dropdown>
              <a class="dropdown-button login-out" href="javascript:void(0)">
                <Icon type="md-person" />
                张伟
                <Icon type="md-arrow-dropdown"/>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem><div class="logout-item">退出</div></DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </li>
        </ul>
      </Col>
    </Row>
  </div>
  <div class="header-subrow">
    <Row class="layout">
      <Col span="4">asdasd</Col>
      <Col span="20" class="nav-wrap">
        <ul class="navbar">
          <li v-for="subMenu in currentsubMenus"
            is="skyneNavItem"
            type="submenuItem"
            :to="subMenu.route"
            :key="subMenu.code"
          >
            {{subMenu.name}}
          </li>
        </ul>
      </Col>
    </Row>
  </div>
</div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { GET_MENU } from "../store/menus.module";
import skyneNavItem from "./navbarItem";

export default {
  data() {
    return {
      selectedKey: "RISK_FOREWARNING"
    };
  },
  components: {
    skyneNavItem
  },
  computed: {
    ...mapGetters(["businessMenus", "mainMenus", "systemMenus"]),
    selectedMenu() {
      return [...this.businessMenus, ...this.systemMenus].filter(
        menu => menu.code === this.selectedKey
      )[0];
    },
    currentsubMenus() {
      if (!this.selectedMenu) {
        return [];
      } else {
        return this.selectedMenu.children;
      }
    }
  },
  methods: {
    ...mapActions({
      getMenuList: GET_MENU
    }),
    setSelectMenu(path) {
      console.log(this.mainMenus);
      const selectedMenu = this.mainMenus.filter(
        menu => path.indexOf(menu.route) !== -1
      )[0];
      if (selectedMenu) {
        this.selectedKey = selectedMenu.code;
      }
    }
  },
  created() {
    this.getMenuList().then(() => {
      this.setSelectMenu(this.$route.path);
    });
  },
  watch: {
    $route(to) {
      this.setSelectMenu(to.path);
    }
  }
};
</script>
<style lang="stylus" scoped>
@import "../assets/styles/varibles"
 .header-row
   background-color: #262c36;
   height: $header-row-height
   .gree-logo
      padding-top 15px
      img 
       max-width: 100%
       width 208px
 .nav-wrap
   padding-left 6%
   .navbar
     list-style: none
     height 100%
     float left
     margin 0
     padding 0
     .dropdown-button
       display inline-block
       line-height $header-subrow-height
       font-size 12px
       width 120px
       text-align center
       color: rgba(255, 255, 255, 0.7)
     .login-out
       line-height: $header-row-height;
       .ivu-icon-md-person
        font-size: 18px
        margin-top: -1px
        margin-right 4px
        vertical-align middle
     &.nav-right
       float right
       .menuStyle
         font-size: 12px
         .ivu-icon-md-settings
            margin-right 2px
            font-size 16px
            vertical-align middle
  .header-subrow
    background-color: #3b414d;
    height $header-subrow-height
</style>
