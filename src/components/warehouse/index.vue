<template>
  <div class="warehouse">
    <img v-lazy="imgUrl">
    <group class="first-cell other">
      <cell-box is-link
        v-for="(item,index) in DepartureCountryList"
        :key="index"
        @click.native="goWarehouseList(item.departureCountry)">
        <i class="iconfont"
          v-bind:class="item.flag"></i> {{ item.departureCountryName }}
      </cell-box>
    </group>
  </div>
</template>

<script>
import { Group, Cell, CellBox } from 'vux'
import * as API from '@/api/warehouse'

export default {
  name: 'account',
  data () {
    return {
      imgUrl: require('@/assets/image/loc1-banner1.jpg'),
      DepartureCountryList: []
    }
  },
  created () {
    this.getDepartureCountryList()
  },
  methods: {
    getDepartureCountryList () {
      this.DepartureCountryList = []
      API.getDepartureCountryList().then(res => {
        if (res.code === this.GLOBAL.code) {
          // 需要把大陆东莞仓库提升到最前面
          let CN = ''
          for (let v of res.data) {
            if (v.departureCountry === 'CN') {
              CN = v
            } else {
              this.DepartureCountryList.push(v)
            }
          }
          if (CN) {
            this.DepartureCountryList.unshift(CN)
          }
        }
      })
    },
    // 跳转至仓库列表
    goWarehouseList (departureCountry) {
      this.$router.push({ name: 'warehouseList', query: { departureCountry: departureCountry } })
    }
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
  .warehouse {
    img {
      width: 100%;
      height: 2.8rem;
    }
    .first-cell {
      .weui-cells {
        span {
          font-size: 0.32rem;
          // color: #fff;
        }
      }
    }
    .other .weui-cells .weui-cell {
      font-size: 0.28rem;
      i {
        color: @primary;
        font-size: 0.36rem;
        padding-right: 0.16rem;
      }
    }
  }
  body .mainland .other:first-child .weui-cells .weui-cell {
    justify-content: flex-start;
  }
</style>

<style lang="less">
  .warehouse {
    .weui-cells {
      margin-top: 0 !important;
    }
  }
</style>
