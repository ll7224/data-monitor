<template>
  <div>
    <Icon type="md-trash" class="role-operation-button delete-icon" @click.native="onDeleteClick" />
    <Icon type="ios-create-outline" class="role-operation-button edit-icon" @click.native="onEditClick" />
  </div>
</template>
<script>
import { OPERATION_ROLE_OPTIONS } from "@/utils/constant";

export default {
  methods: {
    onDeleteClick() {
      this.$emit("operateRole", { type: OPERATION_ROLE_OPTIONS.DELETE });
    },
    onEditClick() {
      this.$emit("operateRole", { type: OPERATION_ROLE_OPTIONS.EDIT });
    }
  },
  created() {
    console.log("12323");
  }
};
</script>
<style lang="stylus" scoped>
.role-operation-button
  cursor: pointer;
  color: #3977fc
.edit-icon
  margin-left: 15px;
  font-size: 22px;
.delete-icon
  font-size: 22px;
  opacity: 0.4
</style>
