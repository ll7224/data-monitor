<template>
    <Form :label-width="82" ref="organizationForm" :model="organizationForm" :rules="ruleValidate">
        <FormItem label="所属组织" prop="name">
            <Input  placeholder="输入组织名称" v-model="organizationForm.organizationName" disabled/>
        </FormItem>
        <FormItem label="物料组权限">
            <Select
                    @on-change="handleAllMaterialGroupsSelectorChange"
                    v-model="organizationForm.hasAllMaterialGroupsFlag">
                <Option value="part">部分物料组</Option>
                <Option value="all">全部物料组</Option>
            </Select>
        </FormItem>
        <FormItem class="form-item-menu">
            <SkynetTagInput
                    ref="materialGroupsInput"
                    v-model="organizationForm.materialGroups"
                    :error-map="materialGroupsInputErrorMap"
                    :disabled="organizationForm.hasAllMaterialGroups"
                    :placeholder="placeholder"
                    :description="description"
                    :validateInput="validateTagsInput"/>
        </FormItem>
        <FormItem ref="materialGroups" prop="materialGroups">
            <Input :value="materialGroupsForInput" style="display: none;"/>
        </FormItem>
    </Form>
</template>

<script type="text/jsx">
import formValidation from "@/mixins/formValidation";
import SkynetTagInput from "@/components/SkynetTagInput.vue";
import { getMaterialGroup } from "@/service/OrgAndUser/material.service";
import { ERROR } from "@/utils/constant";

export default {
  name: "SkynetOrganizationEditForm",
  components: {
    SkynetTagInput
  },
  props: {
    organization: {
      id: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      }
    },
    materialGroupsInfo: {
      data: {
        hasAllMaterialGroups: Boolean,
        materialGroups: Array
      }
    }
  },
  mixins: [formValidation],
  data() {
    return {
      organizationForm: {
        ...this.materialGroupsInfo.data,
        organizationName: this.organization.name,
        hasAllMaterialGroupsFlag: this.materialGroupsInfo.data
          .hasAllMaterialGroups
          ? "all"
          : "part",
        cachedMaterialGroups: this.materialGroupsInfo.data.materialGroups
      },
      materialGroupsInputErrorMap: {
        duplicated: "不能与输入框已有物料组相同"
      },
      ruleValidate: {
        materialGroups: [
          { validator: this.validateMaterialGroups, trigger: "change" }
        ]
      }
    };
  },
  computed: {
    materialGroupsForInput() {
      return this.organizationForm.hasAllMaterialGroups
        ? "all"
        : JSON.stringify(this.organizationForm.materialGroups);
    },
    placeholder() {
      return this.organizationForm.hasAllMaterialGroups
        ? ""
        : "输入物料组ID，回车进行匹配";
    },
    description() {
      return this.organizationForm.hasAllMaterialGroups
        ? "数据库中的全部物料组，与数据库同步更新"
        : "";
    }
  },
  methods: {
    submit(action) {
      this.$refs.organizationForm.validate(valid => {
        if (valid) {
          action({
            ...this.organizationForm,
            materialGroups: this.$refs.materialGroupsInput.tags,
            organizationId: this.organization.id
          })
            .then(() => {
              this.$emit("submitSuccess");
            })
            .catch(error => {
              let errorMaterGroupCode;
              if (error.data.notExistMaterialGroup) {
                errorMaterGroupCode = error.data.notExistMaterialGroup;
                this.$refs.materialGroupsInput.markTagIsWrong(
                  errorMaterGroupCode
                );
              }
              if (error.data.missedMaterialGroups) {
                this.markInvalidField(
                  "materialGroups",
                  "物料组权限没有包含全部人员物料权限"
                );
              }
              if (error.data.materialGroups) {
                this.markInvalidField(
                  "materialGroups",
                  error.data.materialGroups
                );
              }
              this.$emit("submitFailed");
            });
        } else {
          this.$emit("submitFailed");
        }
      });
    },
    validateMaterialGroups(rule, value, callback) {
      if (!this.organizationForm.hasAllMaterialGroups) {
        if (value.length === 0) {
          return callback(new Error(ERROR.REQUIRED));
        }
        return this.validateTagInput(rule, value, callback);
      }
      return callback();
    },
    validateTagsInput(tagCode) {
      return getMaterialGroup(tagCode).catch(error => {
        if (error.status === 500) {
          return Promise.reject(new Error(ERROR.NETWORK));
        }

        return Promise.reject(error);
      });
    },
    handleAllMaterialGroupsSelectorChange(value) {
      this.organizationForm.hasAllMaterialGroups = value === "all";
      if (this.organizationForm.hasAllMaterialGroups) {
        this.organizationForm.cachedMaterialGroups = this.organizationForm.materialGroups;
        this.organizationForm.materialGroups = [];
      } else {
        this.organizationForm.materialGroups = this.organizationForm.cachedMaterialGroups;
      }
    }
  },
  mounted() {
    this.focusInput(this.$refs.materialGroupsInput);
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/var";
.form-item-menu {
  margin-bottom: 0px;
}

.tag-input-container {
  height: 220px;
}
</style>
