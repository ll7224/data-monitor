<template>
  <div class="container">
   <img src="../assets/src_assets_artboard@2x.png" class="icon">
   <div class="info">抱歉，您没有权限进入该页面</div>
   <div class="info">
     <router-link class="info" to="/">进入天网首页</router-link>
   </div>   
  </div>
</template>

<style lang="stylus" scoped>
.container
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) !important;
  width: 210px;
  height: 220px;
  text-align: center;
.icon
  width: 200px;
  height: 200px;
.info
  margin-top: 20px;
  font-size: 16px;
  font-weight: 500;
</style>
