<!-- 卡券详情 -->
<template>
  <div class='cardInfo'>
    <div class="card">
      <div class="card-info">
        <h1>{{obj.name}}</h1>
        <!-- moneyDeductionLimit=true，则有次数 -->
        <p class="text"
          v-if="obj.moneyDeductionLimit">
          {{GLOBAL.fixedTwo(obj.price)}}{{obj.currencyCode}} / {{obj.amount}}次
        </p>
        <p class="text"
          v-else>
          {{GLOBAL.fixedTwo(obj.price)}}{{obj.currencyCode}}
        </p>
        <p class="time"
          v-if="obj.validDay == 0">有效期：{{obj.couponEffectiveStartTime | filterTime}}~{{obj.couponEffectiveEndTime | filterTime}}</p>
        <p class="time"
          v-else>有效期：{{obj.validDay}} 天</p>
      </div>
    </div>
    <!-- <h4>我是XXX包郵卡</h4> -->
    <h6>卡詳情</h6>
    <p class="info">
      <span v-if="obj.moneyDeductionLimit">每次可优惠：{{GLOBAL.fixedTwo(obj.onceMostMoneyDeduction)}}元，</span>
      <span v-if="obj.moneyDeductionLimit">总共可用{{obj.amount}}次，</span>
      运单金额大于{{GLOBAL.fixedTwo(obj.freightStart)}}元可用，
      <span v-if="obj.validDay == 0">有效期{{getDay()}}天。</span>
      <span v-else>有效期{{obj.validDay}}天。</span>
    </p>
    <h6>說明</h6>
    <p class="info">1.購買成功，可前往【個人中心】-【我的卡包】查看詳情；</p>
    <p class="info">2.每個包裹訂單限只能使用一張優惠券，支付時，請勾選對應的優惠券；</p>
    <p class="info">3.有效期從購買日算起，請在有效期內使用，逾期將失效；</p>
    <p class="info">4.最終解釋權歸4PX遞四方（香港）所有。</p>

    <footer class="footer">
      <template v-if="obj.status == 1">
        <div class="col1">
          <span class="count">{{time}}</span>
          <p>截至搶購時間</p>
        </div>
        <div class="col2"
          v-if="leftTime > 0">
          <span class="count">{{obj.canBuyNumber}}</span>
          <p>剩余张数</p>
        </div>
        <div class="col3">
          <!-- 活動已結束 -->
          <span v-if="leftTime <= 0"
            class="over">活動已結束</span>
          <button @click="handlerBuy"
            v-else>立即購買</button>
        </div>
      </template>
      <template v-else>
        <span class="game-over">活動已結束</span>
      </template>
    </footer>
  </div>
</template>

<script>
import { Confirm } from 'vux'
import { fmtDate } from '@/utils/common'
import { cardInfo } from '@/api/myCoupon'

export default {
  components: { Confirm },
  data () {
    return {
      time: '', // 倒计时
      leftTime: 0, // 剩余时间
      endTime: '2019-10-18 18:00:00', // 截止时间
      couponCode: '',
      obj: {}
    }
  },
  created () {
    this.couponCode = this.$route.query.couponCode
    // 通过卡券code获取卡券详情
    this.getCardInfo()
  },
  filters: {
    filterTime (val) {
      if (!val) {
        return '--'
      }
      return fmtDate(val)
    }
  },
  methods: {
    // 计算卡券有效期多少天
    getDay () {
      let left = this.obj.couponEffectiveEndTime - this.obj.couponEffectiveStartTime
      return Math.floor(left / 1000 / 60 / 60 / 24)
    },
    // 抢购倒计时
    countTime () {
      this.leftTime = this.obj.effectiveActivateEndTime - new Date().getTime()
      let d, h, m, s
      if (this.leftTime > 0) {
        d = Math.floor(this.leftTime / 1000 / 60 / 60 / 24)
        h = Math.floor(this.leftTime / 1000 / 60 / 60 % 24)
        m = Math.floor(this.leftTime / 1000 / 60 % 60)
        s = Math.floor(this.leftTime / 1000 % 60)
        if (h < 10) {
          h = '0' + h
        }
        if (m < 10) {
          m = '0' + m
        }
        if (s < 10) {
          s = '0' + s
        }
        this.time = `${d}天${h}時${m}分${s}秒`
        setTimeout(() => {
          this.countTime()
        }, 1000)
      } else {
        this.time = `0天0時0分0秒`
      }
    },
    // 通过卡券code获取卡券详情
    getCardInfo () {
      // 抢购倒计时
      this.countTime()
      cardInfo(this.couponCode).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.obj = res.data
          // 抢购倒计时
          this.countTime()
        }
      })
    },
    // 立即购买
    handlerBuy () {
      this.$router.push({ name: 'card-payment', query: { couponCode: this.couponCode } })
    }
  }
}
</script>
<style lang='less' scoped>
  @import "../../assets/less/variable.less";
  .cardInfo {
    padding: 0.2rem;
    font-size: 0.28rem;
    .card {
      color: #fff;
      background: url("../../assets/image/coupon.png") center no-repeat;
      margin-bottom: 0.3rem;
      background-size: 100% auto;
      padding-top: 52.7%;
      height: 0px;
      position: relative;
      .card-info {
        position: absolute;
        top: 0.4rem;
        bottom: 0.4rem;
        left: 0.4rem;
        right: 0;
        h1 {
          color: #45370d;
          font-size: 0.4rem;
          font-weight: bold;
          margin-bottom: 0.16rem;
        }
        .text {
          color: #45370d;
        }
        .time {
          color: #a2852e;
          position: absolute;
          bottom: 0;
        }
      }
    }
    h4 {
      font-size: 0.3rem;
      font-weight: bold;
      color: @primary;
    }
    h6 {
      font-size: 0.3rem;
      font-weight: 600;
      margin: 0.32rem 0 0.16rem 0;
    }
    p.info {
      color: #666;
      line-height: 0.4rem;
      font-size: 0.28rem;
      margin-bottom: 0.16rem;
    }
    .footer {
      position: fixed;
      font-size: 0.28rem;
      right: 0;
      bottom: 0;
      left: 0;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .col1,
      .col2 {
        height: 100%;
        width: 46%;
        text-align: center;
        .count {
          padding: 0.1rem 0.4rem;
          display: inline-block;
          background: #f2f2f2;
          border-radius: 10px;
          color: #ff6400;
          font-weight: bold;
          margin-bottom: 0.04rem;
        }
        p {
          font-size: 0.24rem;
          color: #666;
        }
      }
      .col2 {
        width: 26%;
      }
      .col3 {
        height: 100%;
        width: 28%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        font-size: 0;
        button {
          padding: 0.31rem 0;
          width: 100%;
          flex: 1 0 auto;
          background: @primary;
          color: #fff;
          border: none;
        }
        .over {
          color: @primary;
          font-size: 0.3rem;
          height: 100%;
          padding: 0.31rem 0;
          display: block;
          text-align: center;
          width: 100%;
        }
      }
      .game-over {
        height: 100%;
        padding: 0.31rem 0;
        display: block;
        text-align: center;
        width: 100%;
        color: @primary;
      }
    }
  }
</style>
