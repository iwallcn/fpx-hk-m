<template>
  <div class="warehouse-list">
    <group class="other"
      v-for="(item,index) in WarhouseList"
      :key="index">
      <cell-box is-link
        @click.native="goWarehouseAddress(item.warhouseId)">
        <!-- {{ item.warehouseName }} -->
        {{ item.warehouseName }}
        <!-- <i class="iconfont" v-bind:class="item.flag"></i> {{ item.departureCountryName }} -->
      </cell-box>
    </group>
  </div>
</template>

<script>
import { Group, Cell, CellBox } from 'vux'
import * as API from '@/api/warehouse'
import { mapGetters } from 'vuex'
export default {
  name: 'WarhouseList',
  data () {
    return {
      WarhouseList: [],
      departureCountry: ''
    }
  },
  created () {
    this.getWarhouseList()
  },
  methods: {
    getWarhouseList () {
      this.departureCountry = this.$route.query.departureCountry
      API.getWarhouseList(this.departureCountry).then(res => {
        if (res.code === this.GLOBAL.code && res.data && Array.isArray(res.data)) {
          let WH = this.dictData().WH
          for (let v of res.data) {
            v.warehouseName = WH[v.warhouseId] || v.warehouseName
          }
          // 2021/02/24 下架美国洛杉矶仓库USLAXA
          this.WarhouseList = res.data.filter(val => val.warhouseId !== 'USLAXA') || []
        }
      })
    },
    // 跳转至仓库地址页面
    goWarehouseAddress (warehouseId) {
      this.$router.push({ name: 'warehouseAddress', query: { departureCountry: this.departureCountry, warehouseId: warehouseId } })
    },
    ...mapGetters(['dictData'])
  },
  components: {
    Group,
    Cell,
    CellBox
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .warehouse-list {
    .other .weui-cells .weui-cell {
      font-size: 0.28rem;
    }
  }
</style>
