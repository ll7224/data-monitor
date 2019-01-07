<template>
  <div class="role-list">
    <Row class="title-container">
      <span class="model-title">
        角色配置
      </span>
      <Button size="large" type="primary" class="add-role-button" @click="handleAddRole">
        <Icon type="ios-add" class="add-role-button-icon"></Icon>
        新增角色
      </Button>
    </Row>
    <SkynetLoading v-if="isLoading" class="loading"/>
    <Table stripe :columns="columns" :data="showRoles" v-else size="large" no-data-text="" />
    <Modal
      v-model="showAddRoleModal"
      :loading="modalLoading"
      :title="modalTitle"
      @on-ok="submit"
    >
      <SkynetRoleEditForm
        v-if="showAddRoleModal"
        :role-info="roleInfoForModalForm"
        ref="roleEditForm"
        @submitSuccess="handleUpdateRoleSuccess"
        @submitFailed="handleUpdateRoleFailed"
      />
    </Modal>
  </div>
</template>
<script>
import SkynetRoleEditForm from "@/components/role/RoleEditForm";
import SkynetLoading from "@/components/SkynetLoading.vue";
import SkynetRoleColumn from "@/components/role/RoleOperationColumn";
import { GET_ROLES } from "@/store/role.module";
import { mapActions, mapGetters, mapState } from "vuex";
import {
  OPERATION_ROLE_OPTIONS,
  OPERATION_ROLE_MODAL_TITLE
} from "@/utils/constant";
import { addRole, editRole, deleteRole } from "@/service/role.service.js";
import modalExtension from "@/mixins/modalExtension";
import tableExtension from "@/mixins/tableExtension";
import formValidation from "@/mixins/formValidation";

export default {
  props: {
    hierarchy: {
      type: Object,
      required: true
    }
  },
  mixins: [modalExtension, tableExtension, formValidation],
  data() {
    return {
      roleInfoForModalForm: {
        hierarchy: {
          id: 1,
          name: ""
        },
        name: "",
        authorityIds: []
      },
      isLoading: true,
      showAddRoleModal: false,
      modalLoading: true,
      operateType: "",
      columns: [
        {
          title: "所属层级",
          key: "hierachyName",
          width: "11%",
          render: this.renderColumn
        },
        {
          title: "角色名称",
          key: "roleName",
          width: "11%",
          render: this.renderColumn
        },
        {
          title: "菜单权限",
          key: "menuName",
          width: "65%",
          render: this.renderColumn
        },
        {
          title: "操作",
          key: "action",
          width: "13%",
          render: this.renderOperateRole
        }
      ]
    };
  },
  watch: {
    "hierarchy.id"(newValue) {
      if (newValue) {
        this.isLoading = true;
        this.getRoleList(newValue);
      }
    }
  },
  computed: {
    ...mapState({
      role: state => state.roles
    }),
    ...mapGetters(["showRoles"]),
    modalTitle() {
      return OPERATION_ROLE_MODAL_TITLE[this.operateType];
    }
  },
  methods: {
    ...mapActions({
      getRoles: GET_ROLES
    }),
    getRoleList(hierarchyId) {
      this.getRoles(hierarchyId).then(() => {
        this.isLoading = false;
      });
    },
    handleAddRole() {
      this.resetRoleInfoForForm();
      this.operateType = OPERATION_ROLE_OPTIONS.ADD;
      this.showAddRoleModal = true;
    },
    submit() {
      const submitAction = {
        [OPERATION_ROLE_OPTIONS.ADD]: roleForm =>
          addRole(roleForm.hierarchy.id, roleForm.name, roleForm.authorityIds),
        [OPERATION_ROLE_OPTIONS.EDIT]: roleForm =>
          editRole(roleForm.id, roleForm.name, roleForm.authorityIds)
      };
      this.$refs.roleEditForm.submit(submitAction[this.operateType]);
    },
    resetRoleInfoForForm() {
      this.roleInfoForModalForm = {
        hierarchy: {
          id: this.hierarchy.id,
          name: this.hierarchy.name
        },
        id: 0,
        name: "",
        authorityIds: []
      };
    },
    handleUpdateRoleSuccess() {
      this.showAddRoleModal = false;
      this.getRoleList(this.hierarchy.id);
    },
    handleUpdateRoleFailed() {
      this.preventModalClose();
    },
    handleOperateRole(type, role) {
      if (type === OPERATION_ROLE_OPTIONS.DELETE) {
        this.showDeleteConfirm(role);
        return;
      }
      this.resetRoleInfoForForm();
      this.roleInfoForModalForm = {
        ...this.roleInfoForModalForm,
        id: role.roleId,
        name: role.roleName,
        authorityIds: role.authorities.map(auth => auth.id)
      };
      this.operateType = type;
      this.showAddRoleModal = true;
    },
    showDeleteConfirm(role) {
      this.$confirmModal.show({
        title: "确认删除",
        content: "确认删除本角色吗",
        action: () => deleteRole(role.roleId),
        onSuccess: () => this.getRoleList(this.hierarchy.id),
        onFail: error => {
          if (error.success === false && error.errorMessage) {
            this.showGlobalError(error.errorMessage);
          } else {
            this.showGlobalError();
          }
        }
      });
    },
    renderOperateRole(h, { row }) {
      return (
        <SkynetRoleColumn
          onOperateRole={({ type }) => {
            this.handleOperateRole(type, row);
          }}
        />
      );
    }
  },
  components: {
    SkynetLoading,
    SkynetRoleEditForm
  },
  created() {
    if (this.hierarchy.id) {
      this.getRoleList(this.hierarchy.id);
    }
  },
  mounted() {}
};
</script>
<style lang="stylus">
.ivu-table-header,
.ivu-table-body {
  & > table {
    width: 100% !important;
  }
}

tr.ivu-table-row-hover td {
  background-color: #ebf7ff !important;
}
.ivu-table-large th {
  height: 62px;
}
.ivu-table-large th:not(:first-child):before {
  content: '';
  display: inline-block;
  height: 1em;
  vertical-align: middle;
  border: solid 0.7px #c3ccd8;
}
.ivu-table-body {
  height: calc(100% - 62px);
}


</style>

<style lang="stylus" scoped>
@import "../../assets/styles/varibles";
.role-list{
  height: 100%;
}
.add-role-button {
  float: right;
  margin-right: 15px;
  letter-spacing: 2px;
  font-weight: 500;
  .add-role-button-icon {
    margin: -3px;
    font-size: 20px;
    font-weight: 800;
    vertical-align: sub;
  }
}
.ivu-table-wrapper {
  // height: calc(100% - 80px);
  margin: 0 29px 0 29px;
  position: relative;
  border-bottom: 0;
  border-right: 0;
}
.form-item-menu {
  margin-bottom: 0px;
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// .model-title {
//   font-size: 16px;
//   color: #4a4f5d;
//   vertical-align: middle;
// }

.title-container {
  font-size: 16px;
  padding: 22px 16px;
}

.title-container:before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 1em;
  vertical-align: middle;
  background-color: $default-primary-color;
  margin-right: 13px;
}
.ivu-table-large th {
  height: 62px;
}

.loading {
  width: 100%;
  top: 50%;
  margin: 0 auto;
  position: absolute;
}
</style>
