<template>
  <div>
    <SkyNavigatorTree
      title="部门层级"
      :hierachyData="hierachy"
      :loadData="getHierchy"
      :operationMenuTitle="hierarchyMenuTitle"
      :defaultId="hierarchyId"
      @loadDataCompeleted="onLoadDataCompleted"
      @selectNode="onNodeSelected"
      @operateNode="operateHierarchy"
    ></SkyNavigatorTree>
    <SkynetHierarchyOperationModal
      :operationName="'DELETE_NODE'!==operationName?operationName:''"
      :hierarchy="currentOperationHierarchy"
      :success="this.getHierchy"
      @resetOperation="resetOperationName"
    />
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import { HIERARCHY_MODAL_TITLE } from "@/utils/constant";
import { GET_HIERACHY } from "@/store/hierarchies.module";
import SkyNavigatorTree from "@/components/NavigatorTree";
import SkynetHierarchyOperationModal from "@/components/hierachy/HierarchyOperationModal";
import { deleteHierarchy } from "@/service/hierarchy.service";
import formValidation from "@/mixins/formValidation";

export default {
  name: "SkynetHierarchyPanel",
  props: ["hierarchyId"],
  data() {
    return {
      currentOperationHierarchy: {},
      operationName: "",
      hierarchyMenuTitle: HIERARCHY_MODAL_TITLE
    };
  },
  mixins: [formValidation],
  components: {
    SkyNavigatorTree,
    SkynetHierarchyOperationModal
  },
  computed: {
    ...mapState({
      hierachy: state => state.hierachy.hierachy
    })
  },
  methods: {
    ...mapActions({
      getHierchy: GET_HIERACHY
    }),
    onNodeSelected(node) {
      this.$emit("selectNode", node);
    },
    onLoadDataCompleted() {
      this.$emit("loadDataCompeleted");
    },
    operateHierarchy({ type, node }) {
      if (type === "DELETE_NODE") {
        this.showDeleteConfirm(node);
      } else {
        this.operationName = type;
        this.currentOperationHierarchy = node;
      }
    },
    resetOperationName() {
      this.operationName = "";
    },
    showDeleteConfirm(hierachy) {
      this.$confirmModal.show({
        title: "确认删除",
        content: "你确定删除本层级吗？",
        action: () => deleteHierarchy(hierachy.id),
        onSuccess: this.getHierchy,
        onFail: error => {
          if (error.success !== undefined && error.errorMessage) {
            console.log(error.errorMessage);
            this.showGlobalError(error.errorMessage);
          } else {
            this.showGlobalError();
          }
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>

</style>
