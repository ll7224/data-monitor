<template>
  <!-- <div>
    <Row class="role-wrap">
      <Col span="6" class="left-level">
        <SkynetHierarchyPanel @loadDataCompeleted="hierarchyLoadComplete" @selectNode="getHierachy"/>
      </Col>
      <Col span="18" class="right-role">
        <SkynetRoleList :hierarchy="hierarchy"></SkynetRoleList>
      </Col>
    </Row>
  </div> -->
  <SkynetAuthLayout>
    <SkynetHierarchyPanel
      slot="navigator"
      :hierarchyId="hierarchyId"
      @loadDataCompeleted="hierarchyLoadComplete"
      @selectNode="getHierachy"
    />
    <SkynetRoleList :hierarchy="hierarchy"/>
  </SkynetAuthLayout>
</template>
<script>
/* eslint-disable */
// import SkynetRankTreeNode from "../../components/power-setting/RankTreeNode";
import SkynetAuthLayout from "@/Layout/AuthLayout.vue";
import SkynetRoleList from "@/components/role/RoleList";
import SkynetHierarchyPanel from "@/components/hierachy/HierarchyPanel";
import { mapGetters } from 'vuex';
export default {
  props: {
    hierarchyId: {
      default: 1
    }
  },
  data() {
    return {
      hierarchy: {
        id: null,
        name: ""
      }
    };
  },
  components: {
    SkynetAuthLayout,
    SkynetRoleList,
    SkynetHierarchyPanel
  },
  methods: {
    hierarchyLoadComplete() {
//      console.log(this.topHierachy)
      this.hierarchy.id = this.topHierachy.id;
      this.hierarchy.name = this.topHierachy.name;
    },
    getHierachy(node) {
      this.hierarchy.id = node.id;
      console.log(node.id)
      this.hierarchy.name = node.name
      this.$router.push({ name: "power-role", params: { hierarchyId: node.id }})
    }
  },
  computed: {
    ...mapGetters([
        "topHierachy"
    ])
  },
};
</script>
<style lang="stylus" scoped>
@import "../../assets/styles/varibles"
.left-level
  min-height: $role-row-height
  background-color: #f9fbfd
  // overflow: scroll;
</style>
