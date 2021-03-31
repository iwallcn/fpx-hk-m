<template>
  <div class="mainland">
    <!-- <x-header class="layout-header">{{ title }}</x-header> -->
    <group class="first-cell">
      <cell-box v-for="(item, index) in detailData.contrabandDetail"
        :key=index>{{ item }}</cell-box>
    </group>
  </div>
</template>

<script>
import { Group, CellBox, XHeader } from 'vux'
export default {
  name: 'contrabandDetail',
  data () {
    return {
      title: '禁運品',
      detailData: {}
    }
  },
  created () {
    this.detailData = this.$store.state.contrabandDetail
    if (!Object.keys(this.detailData).length) {
      this.$router.replace({ name: 'restrictions' })
    }
  },
  methods: {
    getParams () {
      var routerParams = this.$route.query.data
      this.detailData = JSON.parse(routerParams)
    }
  },
  // watch: {
  //   '$route': 'getParams'
  // },
  components: {
    Group,
    CellBox,
    XHeader
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  h1 {
    text-align: center;
    font-size: 16px;
    height: 30px;
    line-height: 30px;
  }
  .layout-header {
    background: @primary !important;
  }
</style>
