<template>
    <div>
        <SkynetNavigatorTree
                title="组织架构"
                :hierachyData="organizations"
                :loadData="loadData"
                :operationMenuTitle="organizationMenuTitle"
                @selectNode="onNodeSelected"
                :defaultId="organizationId"
                @loadDataCompeleted="onLoadDataCompleted"
                @operateNode="operateOrganization"/>
        <SkynetOrganizationOperationModal
                :operationName="operationName"
                :organization="currentOperationOrganization"
                :success="loadData"
                :organizationsCodes="organizationsCodes"
                :hierarchyOptions="hierarchyOptions"
                @resetOperation="resetOperationName"/>
    </div>
</template>

<script>
import { isEmpty } from "lodash";
import { mapActions, mapGetters, mapState } from "vuex";
import SkynetNavigatorTree from "@/components/NavigatorTree.vue";
import SkynetOrganizationOperationModal from "@/components/OrgAndUser/OrganizationOperationModal.vue";
import {
  GET_ORGANIZATONS,
  GET_ORGANIZATONS_CODES
} from "@/store/OrgAndUser/organization.module";
import { GET_HIERACHY } from "@/store/hierarchies.module";
import {
  OPERATION_MENU_OPTIONS,
  ORGANIZATION_MENU_TITLE
} from "@/utils/constant";
import { deleteOrganization } from "@/service/OrgAndUser/organization.service";
import formValidation from "@/mixins/formValidation";
const getHierarchyById = (hierarchy, id) => {
  let foundHierarchy = {};

  const findHierarchy = (nodeTree, nodeId) => {
    if (isEmpty(nodeTree)) {
      return;
    }
    // eslint-disable-next-line
            nodeTree.forEach((node) => {
      if (node.id === nodeId) {
        foundHierarchy = node;
        return false;
      } else if (!isEmpty(node.children)) {
        findHierarchy(node.children, nodeId);
      }
    });
  };
  findHierarchy(hierarchy, id);

  return foundHierarchy;
};

export default {
  name: "SkynetOrganizationPanel",
  props: ["organizationId"],
  components: {
    SkynetNavigatorTree,
    SkynetOrganizationOperationModal
  },
  mixins: [formValidation],
  data() {
    return {
      currentOperationOrganization: {},
      operationName: "",
      organizationMenuTitle: ORGANIZATION_MENU_TITLE,
      hierarchyOptions: []
    };
  },
  computed: {
    ...mapState({
      hierachy: state => state.hierachy.hierachy,
      organizationsCodes: state => state.organizations.organizationsCodes
    }),
    ...mapGetters({
      organizations: "organizations"
    })
  },
  methods: {
    ...mapActions({
      getOrganizations: GET_ORGANIZATONS,
      getOrganizationsCodes: GET_ORGANIZATONS_CODES,
      getHierarchy: GET_HIERACHY
    }),
    onNodeSelected(node) {
      this.$emit("selectNode", node);
    },
    onLoadDataCompleted() {
      this.$emit("loadDataCompeleted");
    },
    operateOrganization({ type, node }) {
      if (type === OPERATION_MENU_OPTIONS.ADD) {
        this.hierarchyOptions =
          getHierarchyById(this.hierachy, node.hierarchyId).children || [];
      }
      if (type === OPERATION_MENU_OPTIONS.EDIT) {
        this.hierarchyOptions = [
          { id: node.hierarchyId, name: node.hierachyName }
        ];
      }
      if (type === OPERATION_MENU_OPTIONS.DELETE) {
        this.showDeleteConfirm(node);
        return;
      }
      this.currentOperationOrganization = node;
      this.operationName = type;
    },
    resetOperationName() {
      this.operationName = "";
      this.hierarchyOptions = [];
    },
    hideAddMenu(node) {
      return isEmpty(
        getHierarchyById(this.hierachy, node.hierarchyId).children
      );
    },
    loadData() {
      return Promise.all([
        this.getHierarchy(),
        this.getOrganizationsCodes(),
        this.getOrganizations()
      ]).then();
    },
    showDeleteConfirm(organization) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "确定删除本组织吗？",
        onOk: () => {
          deleteOrganization(organization.id)
            .then(() => {
              this.getOrganizations();
            })
            .catch(error => {
              if (error.success !== undefined && error.errorMessage) {
                this.showGlobalError(error.errorMessage);
              } else {
                this.showGlobalError();
              }
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
