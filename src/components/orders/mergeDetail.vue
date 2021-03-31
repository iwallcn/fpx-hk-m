<template>
  <div class="merge-detail">
    <div class="pop-header">
      <div class="pop-title">
        合箱確認
      </div>
      <div class="pop-close"
        @click="handleClose">
      </div>
    </div>
    <div class="pop-content pop-content-bottom">
      <group label-width="1rem"
        label-margin-right="0.3rem"
        label-align="left">
        <cell title="包裹"
          :value="mergeList.length + '個'"
          value-align="left"></cell>
        <cell title="倉庫"
          :value="warehouseName"
          value-align="left"></cell>
      </group>
      <p class="goods-title">合箱明細</p>
      <div v-for="(item, index) in mergeList"
        :key="index">
        <card class="merge-card"
          :header="{title: '包裹'+ (index+1) + ' ~ 商家物流號：' + item.referOrderId }">
          <div slot="content"
            class="merge-infos">
            <div class="thead">
              <div class="th vux-1px-r">品类</div>
              <div class="th vux-1px-r">商品名稱</div>
              <div class="th vux-1px-r">申報單價</div>
              <div class="th">商品數量</div>
            </div>
            <div class="tr"
              v-for="(good, goodIndex) in item.mergerGoodInfoDTOList"
              :key="goodIndex">
              <div class="td ">{{good.categoryName}}</div>
              <div class="td">{{good.goodsName}}</div>
              <div class="td">{{good.price}}{{good.priceCurrency}}</div>
              <div class="td">{{good.number}}</div>
            </div>
          </div>
          <div slot="content"
            class="merge-infos">
            <div class="thead">
              <div class="th vux-1px-r">重量</div>
              <div class="th vux-1px-r">體積</div>
              <div class="th vux-1px-r">體積重</div>
              <div class="th">計費重</div>
            </div>
            <div class="tr">
              <div class="td ">{{item.weight}}{{item.weightUnit | filterPackageUnit}}</div>
              <div class="td">{{item.volumeLength || '-'}}*{{item.volumeWide || '-'}}*{{item.volumeHeight || '-'}}{{item.volumeUnit || '-'}}</div>
              <div class="td">{{item.volumeWeight}}{{item.weightUnit | filterPackageUnit}}</div>
              <div class="td">{{item.chargeableWeight || '-'}}{{item.weightUnit | filterPackageUnit}}</div>
            </div>
          </div>
        </card>
        <!-- <p v-for="(good, goodIndex) in item.mergerGoodInfoDTOList"
          :key="goodIndex">
          {{good.goodsName}} {{good.categoryName}} {{good.price}} {{good.priceCurrency}} {{good.brand}} {{good.spec}}
        </p> -->
      </div>
    </div>
    <footer class="footer-fixed">
      <div class="btn-ml"
        @click="ensureMerge">確認合箱</div>
    </footer>
  </div>
</template>

<script>
import { Group, Cell, Card } from 'vux'
import { getWU } from '@/utils/cache'
export default {
  name: 'mergeDetail',
  props: {
    mergeList: {
      type: Array,
      default: () => []
    },
    referOrderIds: {
      type: Array,
      default: () => []
    },
    warehouseName: {
      type: String,
      default: ''
    }
  },
  components: {
    Group,
    Cell,
    Card
  },
  data () {
    return {
      volumeLengthMax: '', // 子包裹中取最长的
      volumeWideMax: '', // 子包裹中取最宽的
      volumeHeightMax: '' // 子包裹中取最高的
    }
  },
  created () {

  },
  filters: {
    // 包裹重量单位
    filterPackageUnit (val) {
      return getWU()[val] || ''
    }
  },
  methods: {
    handleClose () {
      this.$emit('close')
    },
    ensureMerge () {
      // 计算出子包裹中最长的，最宽的，最高的
      let length = []
      let wide = []
      let height = []
      let weight = 0
      for (let v of this.mergeList) {
        length.push(v.volumeLength ? v.volumeLength : 0)
        wide.push(v.volumeWide ? v.volumeWide : 0)
        height.push(v.volumeHeight ? v.volumeHeight : 0)
        weight += v.weight
      }
      this.$store.commit('SET_REFER_ORDERIDS', this.referOrderIds)
      this.$emit('close')
      // 到合箱頁面，需要算出子包裹最长的，最高的，最宽的，三个参数到合箱页面去过滤物流服务
      this.$router.push({ name: 'merge', query: { volumeLength: Math.max(...length), volumeWide: Math.max(...wide), volumeHeight: Math.max(...height), weight } })
    }
  }
}
</script>

<style lang="less" scoped>
  .merge-detail {
    background: #f2f2f2;
    &-contain {
      width: 100%;
      height: 100%;
    }
    .pop-header {
      width: 100%;
      height: 0.8rem;
      line-height: 0.8rem;
      background: #fff;
      text-align: right;
      overflow: hidden;
      .pop-title {
        height: 0.8rem;
        padding: 0 0.2rem;
        font-size: 0.32rem;
        float: left;
      }
      .pop-close {
        width: 0.8rem;
        height: 0.8rem;
        background: url(../../assets/image/close.png) center no-repeat;
        background-size: 0.4rem;
        float: right;
      }
      .pop-btn {
        float: right;
        font-size: 0.28rem;
        color: #3399ff;
        margin: 0.1rem 0.1rem 0 0;
        height: 0.6rem;
        line-height: 0.6rem;
        border: none;
        padding: 0 0.16rem;
        &-left {
          float: left;
          margin-left: 0.3rem;
        }
      }
    }

    .pop-content {
      height: auto;
      overflow-y: auto;
      overflow-x: hidden;
      width: 100%;
      font-size: 0.24rem;
      box-sizing: border-box;
      .weui-cells {
        margin-top: 0 !important;
      }
      &-bottom {
        min-height: 2rem;
        padding: 0 0.2rem;
        margin-bottom: 1.1rem;
      }
    }
    .goods-title {
      margin: 0.3rem 0 0.1rem 0;
    }
    p {
      font-size: 0.32rem;
      color: #333;
      padding: 0.1rem 0.3rem;
    }
    .refer {
      span {
        font-size: 0.26rem;
        color: #999;
      }
    }
    .merge-card {
      margin: 0.2rem 0;
      .merge-infos {
        margin-bottom: 0.2rem;
        .thead {
          display: flex;
          .th {
            flex: 1;
            text-align: center;
            color: #999;
            font-size: 0.26rem;
            margin: 0.16rem 0;
          }
        }
        .tr {
          display: flex;
          .td {
            flex: 1;
            text-align: center;
            color: @primary;
            font-size: 0.26rem;
            margin: 0.16rem 0;
          }
        }
      }
    }
  }
</style>
<style lang="less">
  .pop-content {
    .weui-cells {
      margin-top: 0.2rem !important;
    }
  }
</style>
