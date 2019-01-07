<template>
    <div>
        <Row class="role-wrap">
            <Col span="6" class="left-level">
            <SkynetOrganizationPanel :organizationId="organizationId"  @selectNode="getHierachy"/>
            </Col>
            <Col span="18" class="right-role">
            <SkynetOrgAndUserMemu :organizationNode="organization"></SkynetOrgAndUserMemu>
            </Col>
        </Row>
    </div>
    <!--<SkynetAuthLayout>-->
        <!--<SkynetOrganizationPanel slot="navigator" :organizationId="organizationId"  @selectNode="getHierachy"/>-->
        <!--<SkynetOrgAndUserMemu :organizationNode="organization"/>-->
    <!--</SkynetAuthLayout>-->
</template>
<script>
//import SkynetAuthLayout from "@/Layout/AuthLayout.vue";
import SkynetOrganizationPanel from "@/components/OrgAndUser/OrganizationPanel.vue";
import SkynetOrgAndUserMemu from "@/components/OrgAndUser/SkynetOrgAndUserMemu.vue";
export default {
  props: {
    organizationId: {
      default: 1
    }
  },
  data() {
    return {
      organization: undefined
    };
  },
  components: {
    SkynetOrgAndUserMemu,
    SkynetOrganizationPanel
    //    SkynetAuthLayout
  },
  methods: {
    getHierachy(node) {
      this.organization = node;
      this.$router.push({
        name: "power-organization",
        params: { organizationId: node.id }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
    @import "../../assets/styles/varibles"
    .left-level
        min-height: $role-row-height
        background-color: #f9fbfd
    // overflow: scroll;
</style>
