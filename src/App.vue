<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: "app"
};
</script>
<style lang="stylus">
@import "./assets/styles/form";
@import "./assets/styles/modal";
.layout {
  width: 85%;
  display: block;
  min-width: 1248px;
  max-width: 1440px;
  margin: 0 auto !important;
}
</style>
