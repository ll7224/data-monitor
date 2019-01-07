<template>
  <Layout >
    <SkynetHeader/>
    <Content class="main-container">
      <div class="layout main-content">
        <router-view></router-view>
      </div>
    </Content>
  </Layout>
</template>
<script>
import SkynetHeader from "@/Layout/Header";
export default {
  components: {
    SkynetHeader
  }
};
</script>
<style lang="stylus" scoped>
@import "../assets/styles/varibles";
 .main-container
   padding-top 20px;
   padding-bottom: 190px;
   background: $background-color-base url("../assets/src_assets_footer-logo@3x.png") no-repeat;
   background-size: 216px 28px
   background-position: center bottom 106px
   .main-content
      background: #fff;
      min-height: 660px;
      box-shadow 0 0 20px #cccccc
</style>
