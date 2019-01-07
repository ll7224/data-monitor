<template>
  <div>
    <Row class="title-container">
      <span class="content-title">{{title}}</span>
    </Row>
    <Row class="tree-container">
      <div class="loading-container">
        <SkynetLoading v-show="isLoading" class="loading"/>
      </div>
      <div class="tree-selector-container" v-show="!isLoading">
        <Tree :data="hierachyData" :render="renderContent" empty-text=""></Tree>
      </div>
    </Row>
  </div>
</template>
<script>
import HierachyDropdown from "./HierachyDropdown";
import SkynetLoading from "./SkynetLoading";
import { isEmpty } from "lodash";
import { getNodeById } from "@/utils/util";

export default {
  props: {
    defaultId: {},
    title: {
      type: String,
      required: true
    },
    hierachyData: {
      type: Array,
      required: true
    },
    operationMenuTitle: {
      type: Object,
      required: true
    },
    loadData: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      currentSelectedNode: {},
      isLoading: true
    };
  },
  components: {
    SkynetLoading
  },
  methods: {
    rebuildTree(children, parentNode) {
      if (!children) return;
      children.forEach(node => {
        const child = node;
        child.getParentNode = () => parentNode;
        this.rebuildTree(child.children, child);
        child.isLeafNode = () => isEmpty(child.children);
        child.getPath = () => this.getNodePath(child);
      });
    },
    getNodePath(node) {
      const nodePaths = [];
      let parent = node.getParentNode();
      while (parent) {
        nodePaths.unshift(parent);
        parent = parent.getParentNode();
      }
      return nodePaths.map(nodePath => nodePath.name).join(">");
    },
    onClickTreeNode(nodeData) {
      this.currentSelectedNode = nodeData;
      // this.$emit("getHierachyId", nodeData.id);
      this.$emit("selectNode", nodeData);
    },
    operateNode({ type, data }) {
      this.$emit("operateNode", { type, node: data });
    },
    renderContent(h, { data }) {
      const nodeClassName = "tree-node ivu-tree-title";
      const selectedClassName =
        this.currentSelectedNode.id === data.id
          ? "ivue-tree-node-selected"
          : "";
      return (
        <span class={nodeClassName}>
          <span
            class={`ivu-tree-node ${selectedClassName}`}
            onClick={() => this.onClickTreeNode(data)}
          >
            {data.name}
          </span>
          <HierachyDropdown
            onOperateNode={this.operateNode}
            node={data}
            operationMenuTitle={this.operationMenuTitle}
          />
        </span>
      );
    }
  },
  created() {
    this.loadData()
      .then(() => {
        if (!isEmpty(this.hierachyData)) {
          // this.rebuildTree(this.hierachyData);
          const defaultNode =
            this.defaultId && getNodeById(this.hierachyData, this.defaultId);
          // const defaultSelectedNode = this.hierachyData[0];
          this.currentSelectedNode = isEmpty(defaultNode)
            ? this.hierachyData[0]
            : defaultNode;
          this.$emit("selectNode", this.currentSelectedNode);
          // console.log(defaultNode);
        }
        this.isLoading = false;
        this.$emit("loadDataCompeleted");
      })
      .catch(error => {
        this.$emit("loadError", error.data.errorMessage);
      });
  }
};
</script>
<style lang="stylus">
@import "../assets/styles/tree";
</style>
<style lang="stylus" scoped>
@import "../assets/styles/varibles";
.content-title 
  font-size 16px
  font-weight: bold
  color: #4a4f5d
  vertical-align middle
  &:before
    content: ""
    display inline-block
    height: 1em
    width 4px;
    vertical-align middle
    background: rgb(57,119,252)
    margin-right: 13px
.tree-selector-container
  padding 0 0 22px 29px
  max-height: 100%;
.title-container
  font-size 16px
  padding 22px 16px 32px 16px
.tree-container
   overflow auto;
   height: $horizontal-section-height - 100px;
.loading
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%)  !important
</style>
