<template>
  <div class="role-menu-tree-container">
    <div class="role-menu-tree">
      <Tree 
        ref="menusForModalTree"
        :data="menuTreeData"
        show-checkbox
        @on-check-change="onMenuCheckChange"
      />
    </div>
    <Checkbox @on-change="checkAllNode" class="check-all-menu">选择全部菜单</Checkbox>
  </div>  
</template>
<script>
/* eslint-disable */ 
import { isEmpty, xorWith, flatMap } from "lodash"
import { mapState } from "vuex";
export default {
  name: "SkynetRoleMenuTree",
  props: {
    checkedNodeIds: Array
  },
  data() {
    return {
      menuTreeData: [],
      currentCheckedLeafNodes: []
    }
  },
  computed: {
    allLeafNodes() {
      return flatMap(flatMap(this.menuTreeData.map(menu => menu.children)).map(m => m.children))
    },
    isAllChecked: {
      get() {
        return (this.allLeafNodes.length === this.currentCheckedLeafNodes.length);
      },
      set(checked) {
        this.menuTreeData.forEach((node) => {
          const el = node;
          if (node.checked !== checked) {
            el.checked = checked;
            this.$refs.menusForModalTree.handleCheck(el);
          }
        })
      }
    },
    ...mapState({
      menus: state => state.menu.menus
    })
  },
  methods: {
    buildMenus(menus, parentNode) {
      if(!menus) return undefined;
      return menus.map((menu) => {
        const node = {
          id: menu.id,
          title: menu.name,
          expand: true,
          checked: false,
          indeterminate: false,
          getParentNode: () => parentNode
        }
        node.children = this.buildMenus(isEmpty(menu.children) ? menu.authorities : menu.children, node);
        node.isLeafNode = () => isEmpty(node.children);
        return node;
      })
    },
    reset(){
      this.isAllChecked = false;
      this.currentCheckedLeafNodes = [];
      this.treeData = [];
    },
    onMenuCheckChange(checkedNodes) {
      const nextCheckedNodes = checkedNodes.filter(node => node.isLeafNode());
      const diffCheckNodes = xorWith(
        nextCheckedNodes, this.currentCheckedLeafNodes,
        (node1, node2) => node1.nodeKey === node2.nodeKey
      );
      if (!isEmpty(diffCheckNodes)) {
        this.currentCheckedLeafNodes = nextCheckedNodes;
        const currentCheckingNode = diffCheckNodes[0];
        const firstBrotherNode = currentCheckingNode.getParentNode().children[0]
       
        this.$refs.menusForModalTree.handleCheck({
          ...firstBrotherNode,
          checked: currentCheckingNode.getParentNode().children.some(node => node.checked)
        })
         console.log(firstBrotherNode)
        this.$emit("on-checked-change", this.currentCheckedLeafNodes)
        // console.log(this.currentCheckedLeafNodes)
      }
    },
    checkAllNode(checked) {
      this.isAllChecked = checked;
    },
  },
  created() {
    this.menuTreeData = this.buildMenus(this.menus)
    console.log(this.menuTreeData)
  },
  mounted() {
    this.allLeafNodes
       .filter(node => this.checkedNodeIds.indexOf(node.id) >= 0)
       .forEach(node => this.$refs.menusForModalTree.handleCheck({
         ...node,
         checked: true
       }));
  }
};
</script>
<style lang="stylus">
  .role-menu-tree-container {
    font-size: 14px;
    .role-menu-tree {
      user-select: none;
      width: 100%;
      height: 300px;
      border-radius: 3px;
      background-color: #ffffff;
      border: solid 1px #d2dce9;
      overflow-y: scroll;
      padding-left: 26px;
      .ivu-tree {
        .ivu-tree-title-selected {
          background: none;
        }
        ul {
          font-size: 14px;
        }
      }
    }
    .ivu-checkbox-wrapper {
      font-size: 14px;
    }
    .check-all-menu {
      margin-top: 10px;
    }
  }
</style>
