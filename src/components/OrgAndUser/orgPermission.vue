<template>
<div>
  <div class="Line-6"></div>
  <div style="height: 60px">
    <div class="mydiv4" style="margin-top: 26px;"></div>
    <div class="myspan myspan1" style="margin-top: 22px;">组织权限</div>
  </div>
  <div class="Rectangle-11">
    <div style="padding-top: 28px">
      <div v-if="organization" class="myspan myspan2">{{ organization.name }}</div>
      <div v-if="organizationPathText" class="myspan myspan3" style="padding-left:2%;" :title="organizationPathText">{{ organizationPathText }}</div>
    </div>
    <div style="height: 20px;margin-top: 20px"></div>
    <template  v-if="!materialGroupsInfo.isLoading && !materialGroupsText">
      <Button type="text"  icon="md-add" class="mybtn2" @click="onEditClick">配置本组织权限</Button>
    </template>
    <template v-if="!materialGroupsInfo.isLoading && materialGroupsText">
      <div class="myspan myspan4" style="padding-left: 5%;margin-top: 2px;" :title="materialGroupsText">{{materialGroupsText}}
        <div class="mydiv1">
          <Button type="text"  @click.native="onEditClick"><Icon type="ios-create-outline" style="font-size: 20px;"/></Button>
          <Button type="text"  @click.native="onDeleteClick"><Icon type="ios-trash-outline" style="font-size: 20px"/></Button>
        </div>
      </div>
      <div class="myspan myspan4" style="padding-left: 5%;margin-top: 15px;padding-bottom: 17px">基地权限：</div>
    </template>
  </div>
  <Modal
          v-model="isshoweditorgmode"
          :loading="modalLoading"
          :title="modeltitle"
          @on-ok="submit"
          >
  <editOrgMode
          v-if="isshoweditorgmode"
          ref="organizationEditForm"
          :organization="organization"
          :materialGroupsInfo="materialGroupsInfo"
          @submitSuccess="handleUpdateOrganizationSuccess"
          @submitFailed="handleUpdateOrganizationFailed"
  />
  </Modal>
</div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import editOrgMode from "@/components/OrgAndUser/editOrgMode.vue";
import { OPERATION_ORGANIZATION_MODAL_TITLE } from "@/utils/constant";
import { GET_MATERIAL_GROUPS_BY_ID } from "@/store/OrgAndUser/organization.module";
import modalExtension from "@/mixins/modalExtension";
import formValidation from "@/mixins/formValidation";
import {
  updateOrganizationMaterialGroups,
  deleteAuthority
} from "@/service/OrgAndUser/organization.service";
export default {
  name: "orgPermission",
  props: {
    organization: {
      getPath: Function
    }
  },
  data() {
    return {
      isshoweditorgmode: false,
      modeltitle: OPERATION_ORGANIZATION_MODAL_TITLE
    };
  },
  components: {
    editOrgMode
  },
  mixins: [modalExtension, formValidation],
  computed: {
    ...mapGetters({
      materialGroupsInfo: "materialGroupsInfo"
    }),
    materialGroupsText() {
      return this.materialGroupsInfo.text
        ? `物料组权限：${this.materialGroupsInfo.text}`
        : "";
    },
    organizationPathText() {
      if (this.organization && this.organization.getPath()) {
        return `所属组织:${this.organization.getPath()}`;
      }
      return "";
    }
  },
  watch: {
    "organization.id": function getMaterialGroups(newValue) {
      if (newValue) {
        Promise.all([this.getMaterialGroupsById(newValue)]).then(() => {});
      }
    }
  },
  methods: {
    ...mapActions({
      getMaterialGroupsById: GET_MATERIAL_GROUPS_BY_ID
    }),
    onEditClick() {
      this.isshoweditorgmode = true;
    },
    onDeleteClick() {
      this.$Modal.confirm({
        title: "确认删除",
        content: "确定删除本组织权限吗？",
        onOk: () => {
          deleteAuthority(this.organization.id)
            .then(() => {
              this.getMaterialGroupsById(this.organization.id);
            })
            .catch(error => {
              if (error.data) {
                this.showGlobalError(`不能删除，${error.data.id}`);
              } else {
                this.showGlobalError(error.errorMessage);
              }
            });
        }
      });
    },
    submit() {
      this.$refs.organizationEditForm.submit(organizationForm =>
        updateOrganizationMaterialGroups(
          organizationForm.organizationId,
          organizationForm.materialGroups,
          organizationForm.hasAllMaterialGroups
        )
      );
    },
    handleUpdateOrganizationSuccess() {
      this.isshoweditorgmode = false;
      this.getMaterialGroupsById(this.organization.id);
    },
    handleUpdateOrganizationFailed() {
      this.preventModalClose();
    }
  }
};
</script>
<style>
@import "../../assets/styles/organduser.css";
</style>
