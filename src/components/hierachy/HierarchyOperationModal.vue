<template>
    <Modal
        v-model="showModal"
        :loading="modalLoading"
        :title="modalTitle"
        @on-ok="submit"
        @on-visible-change="restForm">
        <Form ref="formValidate" :rules="ruleValidate" :model="hierarchyForm" :label-width="80">
          <FormItem label="层级名称" prop="name" ref="name">
            <Input v-model="hierarchyForm.name" placeholder="请输入层级名称，不超过6个字"></Input>
          </FormItem>
        </Form>
    </Modal>
</template>
<script>
import {
  OPERATION_MENU_OPTIONS,
  HIERARCHY_MODAL_TITLE
} from "@/utils/constant";
import { addHierarchy, updateHierarchyName } from "@/service/hierarchy.service";
import formValidation from "@/mixins/formValidation";
import modalExtension from "@/mixins/modalExtension";
export default {
  name: "SkynetHierarchyOperationModal",
  props: {
    operationName: {
      type: String,
      required: true
    },
    hierarchy: {
      type: Object,
      required: true
    },
    success: {
      type: Function,
      required: true
    }
  },
  mixins: [formValidation, modalExtension],
  data() {
    return {
      modalLoading: true,
      hierarchyForm: {
        name: ""
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "信息不能为空",
            trigger: "change"
          },
          {
            type: "string",
            max: 6,
            message: "层级名称不能超过6个字",
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {
    modalTitle() {
      return this.operationName
        ? HIERARCHY_MODAL_TITLE[this.operationName]
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
    handleDropClick(currentDropItemName) {
      if (currentDropItemName) {
        this[currentDropItemName]();
      }
    },
    submit() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          const operation = this.getOperationRequest();
          if (!operation) {
            return;
          }
          operation(this.hierarchy.id, this.hierarchyForm.name)
            .then(() => {
              this.showModal = false;
              this.success();
            })
            .catch(error => {
              this.submitErrorHandler(error, this.hierarchyForm);
              this.preventModalClose();
            });
        } else {
          this.preventModalClose();
        }
      });
    },
    getOperationRequest() {
      if (this.operationName === OPERATION_MENU_OPTIONS.ADD) {
        return addHierarchy;
      } else if (this.operationName === OPERATION_MENU_OPTIONS.EDIT) {
        return updateHierarchyName;
      }
      return null;
    },

    restForm(modalVisible) {
      if (modalVisible === false) {
        this.$refs.formValidate.resetFields();
      } else if (this.operationName === OPERATION_MENU_OPTIONS.EDIT) {
        this.hierarchyForm.name = this.hierarchy.name;
      }
    }
  }
};
</script>
<style lang="stylus" scoped>

</style>
