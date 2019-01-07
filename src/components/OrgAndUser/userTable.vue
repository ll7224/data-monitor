<template>
  <div>
    <div style="height: 90px">
      <div class="mydiv4" style="margin-top: 46px;"></div>
      <div class="myspan myspan1" style="margin-top: 42px;">人员权限</div>
      <Button type="primary"  @click="handleAddUser" icon="md-add" class="mybtn1">新增用户</Button>
    </div>
    <div class="mydiv5">
  <Table  :loading="usertableloding" :columns="usercolumns" :data="users" stripe></Table>
  </div>
    <Modal
            :title="modeltitle"
            :loading="modalLoading"
            v-model="idshoweditusermode"
            @on-ok="submit"
            :loading="modalLoading"
            >
    <editUserMode
            v-if="idshoweditusermode"
            ref="userEditForm"
            :user-info="userInfoForModalForm"
            :rolesOptions="showRoles"
            @submitSuccess="handleUpdateUserSuccess"
            @submitFailed="handleUpdateUserFailed"
    />
    </Modal>
  </div>
</template>
<script>
import { isEmpty, pick } from "lodash";
import { mapActions, mapState, mapGetters } from "vuex";
import editUserMode from "@/components/OrgAndUser/editUserMode.vue";
import { GET_USERS } from "@/store/OrgAndUser/users.module";
import { GET_ROLES } from "@/store/role.module";
import {
  addUser,
  editUser,
  deleteUser
} from "@/service/OrgAndUser/user.service";
import modalExtension from "@/mixins/modalExtension";
import formValidation from "@/mixins/formValidation";
import {
  OPERATION_USER_OPTIONS,
  OPERATION_USER_MODAL_TITLE
} from "@/utils/constant";

export default {
  name: "userTable",
  components: {
    editUserMode
  },
  props: {
    organization: {
      id: {
        type: Number,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      hierarchyId: {
        type: Number,
        required: true
      }
    }
  },
  mixins: [modalExtension, formValidation],
  data() {
    return {
      userInfoForModalForm: {
        userId: 0,
        organization: {
          id: 1,
          name: ""
        },
        userEmailNum: "",
        userNameAndEmail: "",
        roles: [],
        materials: [],
        hasAllMaterials: false
      },
      modalLoading: true,
      operateType: "",
      usertableloding: true,
      idshoweditusermode: false,
      usercolumns: [
        {
          title: "所属组织",
          key: "organizationName",
          tooltip: true,
          width: "11%"
        },
        {
          title: "人员名称",
          key: "userName",
          tooltip: true,
          width: "11%"
        },
        {
          title: "物料权限",
          key: "materialNames",
          tooltip: true,
          width: "54%"
        },
        {
          title: "角色",
          key: "roleNames",
          tooltip: true,
          width: "11%"
        },
        {
          title: "操作",
          key: "action",
          width: "14%",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  on: {
                    click: () => {
                      //                      this.show(params.index);
                      this.handleOperateUser(params.row);
                    }
                  }
                },
                [
                  h("Icon", {
                    props: {
                      type: "md-create",
                      size: "23"
                    }
                  })
                ]
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style: {
                    marginLeft: "5%"
                  },
                  on: {
                    click: () => {
                      this.handleDeleteUser(params.row.id);
                    }
                  }
                },
                [
                  h("Icon", {
                    props: {
                      type: "ios-trash-outline",
                      size: "23"
                    }
                  })
                ]
              )
            ]);
          }
        }
      ]
    };
  },
  computed: {
    modeltitle() {
      return OPERATION_USER_MODAL_TITLE[this.operateType];
    },
    ...mapState({
      users: state => state.users
    }),
    ...mapGetters(["users"]),
    ...mapState({
      isOrganizationAuthorityConfigured: state =>
        !isEmpty(state.organizations.materialGroupsInfo.data.materialGroups) ||
        state.organizations.materialGroupsInfo.data.hasAllMaterialGroups
    }),
    ...mapGetters(["showRoles"])
  },
  watch: {
    "organization.id": function(newValue) {
      if (newValue) {
        this.usertableloding = true;
        this.loadUserData();
      }
    }
  },
  methods: {
    ...mapActions({
      getUsers: GET_USERS,
      getRoles: GET_ROLES
    }),
    loadUserData() {
      Promise.all(
        [this.getUsers(this.organization.id)],
        this.getRoles(this.organization.hierarchyId)
      ).then(() => {
        this.usertableloding = false;
      });
    },
    submit() {
      const submitAction = {
        [OPERATION_USER_OPTIONS.ADD]: userForm => {
          const user = {
            ...pick(userForm, [
              "organizationId",
              "userEmailNum",
              "roles",
              "hasAllMaterials"
            ]),
            materialCodes: userForm.materials.map(material => material.code)
          };
          return addUser(user);
        },
        [OPERATION_USER_OPTIONS.EDIT]: userForm => {
          const user = {
            ...pick(userForm, [
              "userId",
              "organizationId",
              "userEmailNum",
              "roles",
              "hasAllMaterials"
            ]),
            materialCodes: userForm.materials.map(material => material.code)
          };
          return editUser(user);
        }
      };
      this.$refs.userEditForm.submit(submitAction[this.operateType]);
    },
    handleUpdateUserSuccess() {
      this.idshoweditusermode = false;
      this.loadUserData();
    },
    handleUpdateUserFailed() {
      this.preventModalClose();
    },
    handleAddUser() {
      if (!this.isOrganizationAuthorityConfigured) {
        this.$Modal.error({
          title: "不能新增人员",
          content: "还未配置组织权限，无法新增人员",
          okText: "好的"
        });
      } else {
        this.resetUserInfoForForm();
        this.operateType = OPERATION_USER_OPTIONS.ADD;
        this.idshoweditusermode = true;
      }
    },
    handleOperateUser(user) {
      this.resetUserInfoForForm();
      this.userInfoForModalForm = {
        ...this.userInfoForModalForm,
        userId: user.id,
        userEmailNum: user.userEmailNum,
        userNameAndEmail: user.userNameAndEmail,
        roles: user.roles,
        materials: user.materials,
        hasAllMaterials: user.hasAllMaterials
      };
      this.operateType = OPERATION_USER_OPTIONS.EDIT;
      this.idshoweditusermode = true;
    },
    handleDeleteUser(userid) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "确定删除该人员权限吗？",
        onOk: () => {
          deleteUser(userid)
            .then(() => {
              this.loadUserData();
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
    },
    resetUserInfoForForm() {
      this.userInfoForModalForm = {
        organization: {
          id: this.organization.id,
          name: this.organization.name
        },
        userId: 0,
        roles: [],
        materials: [],
        hasAllMaterials: false
      };
    }
  },
  created() {
    if (this.organization && this.organization.id) {
      this.loadUserData();
    }
  }
};
</script>
<style>
table {
  width: 100% !important;
}
</style>
