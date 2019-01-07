<template>
  <span class="table-colum" :title="title">
    {{title}}
  </span>
</template>
<script>
export default {
  name: "SkynetColumnTip",
  props: {
    title: String
  }
};
</script>
<style lang="stylus">
.table-colum
  white-space nowrap;
</style>
