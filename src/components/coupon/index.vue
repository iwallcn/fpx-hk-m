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
          <div :class="['item', index === 2 ? 'failureItem' : '']"
            v-for="item in couponList[index]"
            :key="item.id">
            <div class="coupon DIcoupon"
              v-if="item.couponType === 'DI'"><span>{{ item.amount*10 }}折</span></div>
            <div class="coupon VOcoupon"
              v-if="item.couponType === 'VO'">立减{{ item.amount }}元</div>
            <div class="coupon FPcoupon"
              v-if="item.couponType === 'FP'">{{item.amount}}{{item.unit}}免郵券</div>
            <div class="infos">
              <div class="row1">
                <div class="col1">{{ item.couponLabel }}</div>
                <div class="col2">
                  <template v-if="index == 0"><span class="font1">僅剩{{ calcRestDay(item.dateEffect, item.dateInvalid) }}天</span></template>
                  <template v-else-if="index == 1"><span class="font2">已使用</span></template>
                  <template v-else><span class="font3">已失效</span></template>
                </div>
              </div>
              <div class="row2">{{ item.dateEffect | filterDate}} ~ {{ item.dateInvalid | filterDate}}</div>
              <div class="row1">
                <div class="col1">{{ item.quantity }} 張</div>
                <div class="col3"
                  @click="couponDetail(item.couponCode)">查看詳情<i class="iconfont icon-down"></i></div>
              </div>
            </div>
          </div>
          <div class="nodata"
            v-show="!couponList.length || !couponList[index].length">
            <i class="iconfont icon-youhuiquan"></i>
            <p>{{itemDataInfo[index]}}</p>
          </div>
        </template>
      </div>
    </div>

    <!-- 优惠券详情 -->
    <div class="couponInfo"
      v-transfer-dom>
      <alert v-model="isCoupon"
        hide-on-blur
        button-text="關 閉"
        title="優惠券詳情">
        <div class="coupon-wrapper">
          <div class="couponDetailItem"
            v-for="(couponDetailItem, index) in CouponDetailList"
            :key="index">
            <p v-if="couponDetailItem.productLintMatchType === 'unrestricted'">
              優惠綫路：全綫路
            </p>
            <div v-if="couponDetailItem.productLintMatchType !== 'unrestricted'">
              <p>
                {{ couponDetailItem.warehouseCode | filterWH }} - {{ couponDetailItem.desCountryCode | filterWH}}
              </p>
              <p>
                {{ couponDetailItem.productCode | filterPD }}
              </p>
            </div>
            <p>可抵扣：{{ dataObj.costType | filterAS }}</p>
          </div>
        </div>
      </alert>
    </div>
    <footer class="footer-fixed">
      <div class="footer-row">
        <div class="activeCouponBtn">
          <button class="btn-lg"
            @click="handlerCoupon">激活優惠券</button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
/* eslint-disable */
import { Tab, TabItem, Swiper, Alert } from 'vux'
import Scroll from '@/common/scroll/scroll'
import * as API from '@/api/myCoupon'
import { mapGetters } from 'vuex'
import { appendFileSync } from 'fs';
const tabs = [{ 0: '未使用' }, { 1: '已使用' }, { 2: '已失效' }]
import { getWH, getPD, getAS } from '@/utils/cache'
import { formatDate } from '@/utils/common'

export default {
  name: 'myCoupon',
  data () {
    return {
      tabIndex: 0,
      isCoupon: false,
      couponList: [], // 优惠券列表： 未使用，已使用，已失效
      tabs: tabs,
      dataObj: {},
      CouponDetailList: [],
      pullup: true,
      i: 0,
      isOver: false,
      itemDataInfo: ['正在加載中...', '正在加載中...', '正在加載中...']
    }
  },
  created () {
    this.fetchList()
  },
  methods: {
    // 优惠券列表
    fetchList () {
      // 0:可用
      API.fetchList().then(res => {
        if (!res.data) {
          this.itemDataInfo = ['暫無數據哦', '暫無數據哦', '暫無數據哦']
          return
        }
        if (res.code === this.GLOBAL.code) {
          // this.$set(this.couponList, this.couponList[0], res.data.usableCouponList)
          this.couponList.push(res.data.usableCouponList)
          this.couponList.push(res.data.usedCouponList)
          this.couponList.push(res.data.invalidCouponList)
          // this.couponList[0] = res.data.usableCouponList // 未使用
          // this.couponList[1] = res.data.usedCouponList // 已使用
          // this.couponList[2] = res.data.invalidCouponList // 已失效
          // for (let item of res.data.couponList) {
          //   // 0:未使用，1:已失效，2:已使用
          //   if (item.type === 0) {
          //     this.couponList[0].push(item)
          //   } else if (item.type === 1) {
          //     this.couponList[2].push(item)
          //   } else {
          //     this.couponList[1].push(item)
          //   }
          // }
        }
        this.couponList.forEach((item, index) => {
          if (!item.length) {
            this.itemDataInfo[index] = '暫無數據哦'
          }
        })
        console.log(this.itemDataInfo)
      })
    },
    // 激活优惠券
    handlerCoupon () {
      this.$router.push({ name: 'activateCoupon' })
    },
    // 查看优惠券详情
    couponDetail (couponCode) {
      API.couponRules(couponCode).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.dataObj = res.data
          this.CouponDetailList = res.data.productList
          this.isCoupon = !this.isCoupon
        } else {
        }
      })
    },
    onItemClick (index) {
      this.i = index
      this.isOver = false
      // this.$refs.scroll.scrollTo(0, 0)
    },
    calcRestDay (start, end) {
      // let day = new Date(end.replace(/\-/g, '/')).getTime() - new Date(start.replace(/\-/g, '/')).getTime()
      let day = end - new Date().getTime()
      return parseInt(day / (1000 * 60 * 60 * 24))
    },
    ...mapGetters(['dictData'])
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
          span {
            line-height: 0.44rem;
          }
        }
        .VOcoupon {
          background-color: #ffba00;
        }
        .DIcoupon {
          background-color: #80d9e3;
        }
        .FPcoupon {
          background-color: #ff5e8f;
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
  .couponDetailItem {
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
    padding-top: 10px;
  }
  .couponDetailItem:first-child {
    padding-top: 0;
  }
  .couponDetailItem:last-child {
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
