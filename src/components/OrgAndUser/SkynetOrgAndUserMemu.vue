<template>
    <div>
        <orgPermission  :organization="organizationNode"/>
        <userTable    :organization="organizationNode"/>
    </div>
</template>
<script>
import { mapState } from "vuex";
import userTable from "@/components/OrgAndUser/userTable.vue";
import orgPermission from "@/components/OrgAndUser/orgPermission.vue";

export default {
  name: "SkynetOrgAndUserMemu",
  components: {
    orgPermission,
    userTable
  },
  props: {
    organizationNode: {}
  },
  computed: {
    ...mapState({
      //                  currentUserOrgId: state => state.auth.user.organizationId,
    })
    //            hasUserOperationPermission() {
    //                let node = this.organizationNode;
    //                while (node) {
    //                    if (node.id === this.currentUserOrgId) {
    //                        return true;
    //                    }
    //                    node = node.getParentNode();
    //                }
    //                return false;
    //            },
  }
};
</script>
<style>
</style>
