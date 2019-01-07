<template>
  <li :class="classlist">
    <router-link v-if="to" class="link" :to="to">
      <slot/>
    </router-link>
      <slot v-else/>
  </li>
</template>
<script>
export default {
  props: {
    to: {
      type: String
    },
    type: {
      type: String,
      default: "normal",
      validator(value) {
        return ["normal", "submenuItem"].indexOf(value) !== -1;
      }
    }
  },
  computed: {
    classlist() {
      return ["nav-item", { "-submenuItem": this.type === "submenuItem" }];
    }
  }
};
</script>
<style lang="stylus" scoped>
@import "../assets/styles/varibles";
.nav-item
  float left
  font-size 14px
  text-align center
  > .link
      display block
      width 150px
      line-height $header-row-height
      padding 0 15px
      text-decoration none 
      color: rgba(255,255,255,0.7)
      overflow hidden
  > .router-link-active
      color: #fff
      background: #3b414d;
&.-submenuItem
  > .link
     color: rgba(255, 255, 255, 0.7);
     height: $header-subrow-height
     line-height: $header-subrow-height
  > .router-link-exact-active
     color: #fff
     position relative
     &:after
      content: ''
      position absolute
      bottom 0
      right: 35px
      height 3px
      width: 80px
      background $primary-color
</style>
