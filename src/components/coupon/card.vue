<template>
  <div class="my-coupon"
    ref="myCoupon">
    <tab v-model="tabIndex"
      class="tab-wrap"
      :line-width=2>
      <tab-item @on-item-click="onItemClick(index)"
        v-for="(tab, index) in tabs"
        :key="index">{{tab[index]}}
      </tab-item>
    </tab>
    <div class="list-wrap">
      <div v-for="(tab, index) in tabs"
        :key="index"
        class="list-box">
        <template v-if="index == i">
          <div :class="['item', index === 1 ? 'failureItem' : '']"
            v-for="item in cardList[index]"
            :key="item.id">
            <div class="coupon"><span>{{item.name}}</span></div>
            <div class="infos">
              <div class="row1">
                <div class="col1">{{ item.cardLable }}</div>
                <div class="col2">
                  <template v-if="index == 0"><span class="font1">仅剩{{ calcRestDay(item.cardEffectiveEndTime) }}天</span></template>
                  <template v-else><span class="font3">已失效</span></template>
                </div>
              </div>
              <div class="row2">{{ item.cardEffectiveStartTime | filterDate}} ~ {{ item.cardEffectiveEndTime | filterDate}}</div>
              <div class="row1">
                <div class="col1"
                  v-if="item.moneyDeductionLimit">剩餘：{{ item.usableAmount }}次</div>
                <div class="col3"
                  @click="handlerCardDetail(item)">查看详情<i class="iconfont icon-down"></i></div>
              </div>
            </div>
          </div>
          <div class="nodata"
            v-show="!cardList.length || !cardList[index].length">
            <i class="iconfont icon-youhuiquan"></i>
            <p>{{itemDataInfo[index]}}</p>
          </div>
        </template>
      </div>
    </div>

    <!-- 卡包详情 -->
    <div class="couponInfo"
      v-transfer-dom>
      <!-- <alert v-model="isCoupon"
        hide-on-blur
        button-text="关闭"
        title="卡券詳情">
        <div class="coupon-wrapper">
          <span v-if="cardDetail.moneyDeductionLimit">每次可优惠：{{GLOBAL.fixedTwo(cardDetail.onceMostMoneyDeduction)}}元，</span>
          <span v-if="cardDetail.moneyDeductionLimit">总共可用{{cardDetail.amount}}次，</span>
          运单金额大于{{GLOBAL.fixedTwo(cardDetail.onceMostMoneyDeduction)}}元可用，
          有效期{{getDay()}} 天。
        </div>
      </alert> -->
      <alert v-model="isCoupon"
        hide-on-blur
        button-text="关闭"
        title="卡券詳情">
        <div class="coupon-wrapper">
          <div class="cardDetailItem"
            v-for="(cardDetailItem, index) in CouponDetailList"
            :key="index">
            <p v-if="cardDetailItem.productLintMatchType === 'unrestricted'">
              优惠线路：全线路
            </p>
            <div v-if="cardDetailItem.productLintMatchType !== 'unrestricted'">
              <p>
                {{ cardDetailItem.warehouseCode | filterWH }} - {{ cardDetailItem.desCountryCode | filterWH}}
              </p>
              <p>
                {{ cardDetailItem.productCode | filterPD }}
              </p>
            </div>
            <p>可抵扣：{{ dataObj.costType | filterAS }}</p>
          </div>
        </div>
      </alert>

    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { Tab, TabItem, Swiper, Alert } from 'vux'
import Scroll from '@/common/scroll/scroll'
const tabs = [{ 0: '未使用' }, { 1: '已失效' }]
import { formatDate } from '@/utils/common'
import { list, couponRules } from '@/api/myCoupon'
import { getWH, getPD, getAS } from '@/utils/cache'

export default {
  name: 'card',
  data () {
    return {
      tabIndex: 0,
      cardList: [], // 卡包列表： 未使用，已失效
      tabs: tabs,
      dataObj: {},
      CouponDetailList: [],
      pullup: true,
      i: 0,
      isOver: false,
      itemDataInfo: ['正在加載中...', '正在加載中...'],
      cardDetail: {}, // 查看卡詳情
      isCoupon: false // 是否顯示卡詳情
    }
  },
  created () {
    this.fetchList()
  },
  methods: {
    // 计算卡券有效期多少天
    getDay () {
      let left = this.cardDetail.cardEffectiveEndTime - this.cardDetail.cardEffectiveStartTime
      return Math.floor(left / 1000 / 60 / 60 / 24)
    },
    // 卡券列表
    fetchList () {
      list().then(res => {
        if (!res.data) {
          this.itemDataInfo = ['暫無數據哦', '暫無數據哦']
          return
        }
        if (res.code === this.GLOBAL.code) {
          this.cardList.push(res.data.useAbleCard)
          this.cardList.push(res.data.invalidCard)
        }
        this.cardList.forEach((item, index) => {
          if (!item.length) {
            this.itemDataInfo[index] = '暫無數據哦'
          }
        })
      })
    },
    // 查看卡券详情
    handlerCardDetail (item) {
      this.cardDetail = item
      this.getCouponRules()
    },
    getCouponRules () {
      couponRules(this.cardDetail.cardCode).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.dataObj = res.data
          this.CouponDetailList = res.data.productList
          this.isCoupon = !this.isCoupon
        }
      })
    },
    onItemClick (index) {
      this.i = index
      this.isOver = false
      // this.$refs.scroll.scrollTo(0, 0)
    },
    calcRestDay (end) {
      let day = end - new Date().getTime()
      return parseInt(day / (1000 * 60 * 60 * 24))
    }
  },
  filters: {
    filterDate (val) {
      if (!val) {
        return '--'
      }
      return formatDate(val).split(' ')[0]
    },
    // 根据仓库id获取仓库名称
    filterWH (val) {
      if (val === 'HK' || val === 'hk') {
        return '中國香港'
      }
      let wh = getWH()
      return wh.hasOwnProperty(val) ? wh[val] : '暫無'
    },
    // 根据產品id获取產品路線
    filterPD (val) {
      let pd = getPD()
      return pd.hasOwnProperty(val) ? pd[val] : '暫無'
    },
    filterAS (val) {
      let as = getAS()
      return as.hasOwnProperty(val) ? as[val] : '暫無'
    }
  },
  components: {
    Tab,
    TabItem,
    Swiper,
    Alert,
    Scroll
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .tab-wrap {
    // position: fixed;
    position: relative;
    top: 0;
    left: 0;
    height: 44px;
    // width: 100vw;
    padding-top: 0;
  }
  .my-coupon {
    font-size: 0.28rem;
    height: 100%;
    overflow: hidden;
    .list-wrap {
      overflow-y: auto;
      padding-bottom: 2rem;
      background: #f2f2f2;
      border-radius: 4px;
      .list-box {
        margin-top: 0.16rem;
      }
      .item {
        background: #fff;
        display: flex;
        border-radius: 4px;
        margin-bottom: 0.2rem;
        .coupon {
          width: 30%;
          color: #fff;
          font-size: 0.34rem;
          text-align: center;
          border-left: dashed 0.04rem #f2f2f2;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ff5e8f;
          span {
            line-height: 0.44rem;
          }
        }
        .infos {
          flex: 1 0 auto;
          padding: 0.1rem 0.2rem;
          .row1 {
            display: flex;
            justify-content: space-between;
            height: 0.48rem;
            align-items: center;
            .col2 {
              color: #fff;
              font-size: 0.24rem;
              .font1 {
                background: @error;
                padding: 0.03rem 0.1rem;
                border-radius: 0.2rem 0 0 0.2rem;
              }
              .font2 {
                background: #fdae08;
                padding: 0.03rem 0.1rem;
                border-radius: 0.2rem 0 0 0.2rem;
              }
              .font3 {
                background: #ddd;
                padding: 0.03rem 0.1rem;
                border-radius: 0.2rem 0 0 0.2rem;
              }
            }
            .col3 {
              color: #999;
              height: 100%;
              line-height: 0.48rem;
              i {
                font-size: 0.28rem;
              }
            }
          }
          .row2 {
            color: #999;
            font-size: 0.26rem;
            border-bottom: 1px dashed #999;
            padding: 0.1rem 0 0.2rem 0;
            margin-bottom: 0.1rem;
          }
        }
      }
      .failureItem {
        .coupon {
          background: #ddd;
        }
      }
    }
  }
  .couponInfo {
    .coupon-wrapper {
      max-height: 7rem;
      overflow-y: scroll;
      line-height: 0.44rem;
      font-size: 0.28rem;
      p {
        font-size: 0.24rem;
        text-align: left;
        padding: 0.06rem 0;
      }
    }
  }
  .footer-row {
    display: flex;
    justify-content: space-between;
    .col {
      width: 48%;
    }
  }
  .cardDetailItem {
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
    padding-top: 10px;
  }
  .cardDetailItem:first-child {
    padding-top: 0;
  }
  .cardDetailItem:last-child {
    border-bottom: none;
  }
  .activeCouponBtn {
    width: 100%;
  }
</style>
<style lang="less">
  .my-coupon {
    .vux-swiper-item {
      height: 100% !important;
      overflow-y: scroll;
      overflow-x: hidden;
    }
    width: 100%;
    height: 100%;
    .list-wrap {
      height: calc(~"100% - 2rem");
      .vux-swiper {
        height: 100% !important;
      }
    }
  }
</style>
