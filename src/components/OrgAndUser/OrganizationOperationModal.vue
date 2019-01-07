<template>
    <Modal
            v-model="showModal"
            :loading="modalLoading"
            :title="modalTitle"
            @on-visible-change="handleModalVisibleChange"
            @on-ok="submit">
        <Form ref="organizationForm" inline
              :model="organizationForm"
              :rules="ruleValidate"
              @submit.native.prevent="preventDefault">
            <FormItem ref="code" class="form-item-code" label="组织名称" prop="code" :label-width="80">
                <Input ref="input" autofocus
                       v-show="!organizationName"
                       @on-enter="showOrganizationName"
                       @on-blur="showOrganizationName"
                       v-model="organizationForm.code"
                       placeholder="输入组织ID按回车进行匹配"/>
                <span class="ivu-input ivu-input-default" v-show="organizationName" @click="resetOrganizationName">
          {{organizationName}}
        </span>
            </FormItem>
            <FormItem ref="hierarchyId" class="form-item-select">
                <Select class="hierarchy-select" v-model="organizationForm.hierarchyId" :disabled="isEdit">
                    <Option v-for="item in hierarchyOptions" :value="item.id" :key="item.id">
                        {{ item.name }}
                    </Option>
                </Select>
            </FormItem>
        </Form>
    </Modal>
</template>

<script>
import { findIndex, find } from "lodash";
import {
  addOrganization,
  editOrganization
} from "@/service/OrgAndUser/organization.service";
import { ORGANIZATION_MENU_TITLE, ERROR } from "@/utils/constant";
import formValidation from "@/mixins/formValidation.js";
import modalExtension from "@/mixins/modalExtension.js";
import { isEdit, isAdd } from "@/utils/util";

export default {
  name: "SkynetOrganizationOperationModal",
  props: {
    operationName: {
      type: String,
      required: true
    },
    organization: {
      type: Object,
      required: true
    },
    success: {
      type: Function,
      required: true
    },
    organizationsCodes: {
      type: Array,
      required: true
    },
    hierarchyOptions: {
      type: Array,
      required: true
    }
  },
  mixins: [formValidation, modalExtension],
  data() {
    const validateOrganizationCode = (rule, value, callback) => {
      if (
        value &&
        findIndex(this.organizationsCodes, item => item.code === value) === -1
      ) {
        callback(new Error(ERROR.INPUT));
      }
      callback();
    };
    return {
      organizationForm: {
        code: "",
        hierarchyId: 0
      },
      organizationName: "",
      ruleValidate: {
        code: [
          { required: true, message: ERROR.REQUIRED, trigger: "change" },
          { validator: this.checkIsAllNumber, trigger: "change" },
          { validator: validateOrganizationCode, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    isEdit() {
      return isEdit(this.operationName);
    },
    modalTitle() {
      return this.operationName
        ? ORGANIZATION_MENU_TITLE[this.operationName]
        : "";
    },
    showModal: {
      get() {
        return !!this.operationName;
      },
      set(showModal) {
        if (!showModal) {
          this.$emit("resetOperation");
        }
      }
    }
  },
  methods: {
    handleOperationClick(currentDropdownItemName) {
      if (currentDropdownItemName) {
        this[currentDropdownItemName]();
      }
    },
    showOrganizationName() {
      this.$refs.organizationForm.validateField("code", errrorMessage => {
        if (!errrorMessage) {
          const findOrganization = find(
            this.organizationsCodes,
            item => item.code === this.organizationForm.code
          );
          this.organizationName = `${findOrganization.name} (${
            findOrganization.code
          })`;
        }
      });
    },
    operateOrganization() {
      if (this.isEdit) {
        return editOrganization(
          this.organization.id,
          this.organizationForm.code
        );
      }
      return addOrganization(
        this.organization.id,
        this.organizationForm.hierarchyId,
        this.organizationForm.code
      );
    },
    resetOrganizationName() {
      this.organizationName = "";
      this.focusInput(this.$refs.input);
    },
    submit() {
      this.$refs.organizationForm.validate(valid => {
        if (valid) {
          this.operateOrganization()
            .then(() => {
              this.showModal = false;
              this.success();
            })
            .catch(error => {
              this.submitErrorHandler(error, this.organizationForm);
              this.preventModalClose();
            });
        } else {
          this.preventModalClose();
        }
      });
    },
    handleModalVisibleChange(modalVisible) {
      if (modalVisible === false) {
        this.$refs.organizationForm.resetFields();
        this.organizationName = "";
      } else {
        if (isAdd(this.operationName)) {
          this.focusInput(this.$refs.input);
        }
        if (this.isEdit) {
          this.organizationForm.code = this.organization.code;
          this.showOrganizationName();
        }
        this.$nextTick(() => {
          this.organizationForm.hierarchyId =
            this.hierarchyOptions[0] && this.hierarchyOptions[0].id;
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.form-item-code {
  width: 70%;
  padding-right: 10px;
  margin-right: 0;
}

.form-item-select {
  width: 30%;
  margin-right: 0;
  .hierarchy-select {
    width: 100%;
  }
}
</style>
