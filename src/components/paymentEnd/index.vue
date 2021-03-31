<template>
  <div class="payment-end">
      <div class="success">
        <i class="iconfont icon-success"></i>
        <h6>恭喜你，支付成功</h6>
        <p>您的包裹正在處理中，請隨時留意郵箱，及時關注包裹動向。</p>
        <button class="btn-ml" @click="gotoOrder">查看订单</button>
        <button class="btn-ml back-center" @click="gotoCenter">返回个人中心</button>
      </div>
      <div class="banner">
        <swiper :list="swiperList"
          v-if="swiperList.length"
          loop
          auto
          dots-position="center">
        </swiper>
      </div>
  </div>
</template>

<script>
import { Swiper } from 'vux'
import { bannerInfo } from '@/api/banners'

export default {
  name: 'paymentEnd',
  data: function () {
    return {
      swiperList: []
    }
  },
  created () {
    this.getBaners()
  },
  methods: {
    getBaners () {
      bannerInfo({ category: 'PAY_RESULT', device: 2 }).then(res => {
        if (res.code === this.GLOBAL.code) {
          res.data.result.forEach(val => {
            let obj = {
              url: val.link,
              img: val.picUrl
            }
            this.swiperList.push(obj)
          })
        }
      })
    },
    gotoOrder () {
      this.$router.push({path: '/account/orders'})
    },
    gotoCenter () {
      this.$router.push({path: '/account'})
    }
  },
  components: {
    Swiper
  }
}
</script>

<style lang="less" scoped>
  .payment-end {
    font-size: 0.4rem;
    background: #ffffff;
    padding: 40px  0;
    height: calc(100% - 80px);

    .success {
      text-align: center;
      line-height: 1.8;
      padding: 0 20px;

      .iconfont {
        color: #0bb90a;
        font-size: 1.5rem;
      }

      h6 {
        font-weight: bold;
        font-size: 1.2em;
      }

      p {
        color: #757575;
        font-size: 0.8em;
      }

      button {
        margin-top: 10px;

        &.back-center {
          background-color: #fdf0e5;
          border:1px solid #ed6d00;
          color: #ed6d00;
        }
      }
    }

    .banner {
      margin-top: 60px;
    }
  }
</style>
