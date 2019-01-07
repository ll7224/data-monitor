<template>
  <div class="hierachy-drop">
    <Dropdown trigger="click" @on-click="handleDropClick" :transfer="true">
        <Button type="text" size="small"><Icon type="ios-more" class="ios-more"/></Button>    
        <DropdownMenu slot="list" class="hierachy-drop-menu">
            <DropdownItem name="addNode">{{operationMenuTitle[treeOperation.ADD]}}</DropdownItem>
            <DropdownItem name="editNode">{{operationMenuTitle[treeOperation.EDIT]}}</DropdownItem>
            <DropdownItem name="deleteNode">{{operationMenuTitle[treeOperation.DELETE]}}</DropdownItem>
        </DropdownMenu>
    </Dropdown>
  </div>
</template>
<script>
import { OPERATION_MENU_OPTIONS } from "@/utils/constant";

export default {
  data() {
    // const ValidDuplicated = (rule, value, callback) => {
    //   const isDuplicated = this.hierachy.children.some(
    //     child => child.name === value
    //   );
    //   if (isDuplicated) {
    //     callback(new Error("不能与本层级名称重复"));
    //   }
    //   callback();
    // };
    return {
      treeOperation: OPERATION_MENU_OPTIONS
    };
  },
  props: {
    node: {
      type: Object,
      required: true
    },
    operationMenuTitle: {
      type: Object,
      required: true
    }
  },
  // computed: {
  //   modalTitle() {
  //     return this.dropItemName ? MODAL_TITLE[this.dropItemName] : "";
  //   }
  // },
  methods: {
    handleDropClick(currentDropItemName) {
      if (currentDropItemName) {
        this[currentDropItemName]();
      }
    },
    addNode() {
      this.$emit("operateNode", {
        type: OPERATION_MENU_OPTIONS.ADD,
        data: this.node
      });
    },
    editNode() {
      this.$emit("operateNode", {
        type: OPERATION_MENU_OPTIONS.EDIT,
        data: this.node
      });
    },
    deleteNode() {
      this.$emit("operateNode", {
        type: OPERATION_MENU_OPTIONS.DELETE,
        data: this.node
      });
    }
  }
};
</script>
<style lang="stylus">
.hierachy-drop
  display inline-block
  .ivu-select-dropdown {
    box-shadow: none;
    padding: 0;
    margin: 0;
    background: transparent;
  }

</style>

<style lang="stylus" scoped>
.hierachy-drop
  display inline-block
  .ios-more
    fons-size: 22px
  .hierachy-drop-menu
    width 110px;
    padding:  5px 0;
    box-shadow: 0 1px 6px rgba(0,0,0, .2);
    background #fff;
    margin-right: 10px;
    border-radius: 4px
    > li
     margin: 0;
     padding: 7px 16px
</style>
