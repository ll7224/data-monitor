<template>
   <Form :label-width="80" ref="roleForm" :model="roleForm" :rules="ruleValidate">
     <FormItem label="对应层级" prop="hierarchy.name">
       <Input placeholder="输入层级名称" v-model="roleForm.hierarchy.name" disabled/>
     </FormItem>
     <FormItem label="角色名称" prop="name">
       <Input placeholder="输入角色名称" ref="roleInput" v-model="roleForm.name"/>
       <div v-if="submitRoleNameErrorMessage.roleName" class="ivu-form-item-error-tip">
         {{ submitRoleNameErrorMessage.roleName }}
       </div>
     </FormItem>
     <FormItem label="菜单权限" class="form-item-menu ivu-form-item-required">
       <SkynetRoleMenuTree
         :checkedNodeIds="roleForm.authorityIds"
         ref="skynetRoleMenuTree"
         @on-checked-change="onRoleMenuTreeCheckedChange"
       />
     </FormItem>
     <FormItem prop="authorityIdForInput" class="form-item-menu">
        <Input name="authorityIdForInput" v-model="roleForm.authorityIdForInput" style="display: none"></Input>
     </FormItem>
   </Form>
</template>
<script>
import formValidation from "@/mixins/formValidation";
import SkynetRoleMenuTree from "@/components/role/RoleMenuTree";
export default {
  props: {
    roleInfo: {
      id: Number,
      name: {
        type: String,
        required: true
      },
      hierarchy: {
        id: {
          type: Number,
          required: true
        },
        name: {
          type: String,
          required: true
        }
      },
      authorityIds: Array
    }
  },
  mixins: [formValidation],
  data() {
    return {
      roleForm: {
        ...this.roleInfo,
        authorityIdForInput: ""
      },
      ruleValidate: {
        name: [{ required: true, message: "信息不能为空", trigger: "change" }],
        authorityIdForInput: [
          {
            required: true,
            message: "信息不能为空",
            trigger: "change"
          }
        ]
      },
      submitRoleNameErrorMessage: ""
    };
  },
  mounted() {
    this.focusInput(this.$refs.roleInput);
  },
  components: {
    SkynetRoleMenuTree
  },
  methods: {
    onRoleMenuTreeCheckedChange(checkedleafNodes) {
      this.roleForm.authorityIds = checkedleafNodes.map(
        authority => authority.id
      );
      this.roleForm.authorityIdForInput = this.roleForm.authorityIds.join(",");
      console.log(this.roleForm);
    },
    submit(action) {
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          action(this.roleForm)
            .then(() => {
              this.$emit("submitSuccess");
            })
            .catch(error => {
              this.submitRoleNameErrorMessage = error && error.data;
              this.$emit("submitFailed");
            });
        } else {
          this.$emit("submitFailed");
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
  .form-item-menu {
    margin-bottom: 0px;
  }
</style>
