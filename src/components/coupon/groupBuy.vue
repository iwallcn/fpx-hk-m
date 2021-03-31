<!--  -->
<template>
  <div class='groupBuy'
    :style="{background: 'url(' + bannerObj.backgroundPicUrl + ') center center / 100% 100%'}">
    <div class="banner">
      <!-- <img src="@/assets/image/temp_group1.png"> -->
      <img :src="bannerObj.bannerPicUrl">
    </div>
    <div class="items-wrapper">
      <h2><img src="@/assets/image/group.png"><span>團購推薦商品</span><img src="@/assets/image/group.png"></h2>
      <div class="items"
        v-if="items.length">
        <div :class="item.status ? 'item done' : 'item'"
          v-for="item in items"
          :key="item.goodsNo"
          @click="handlerDetail(item)">
          <div class="item-col1">
            <img :src="item.picture">
            <span class="free"
              v-if="item.orderType==='GROUP_PURCHASE'">包郵</span>
            <img src="@/assets/image/stop.png"
              class="stop"
              v-if="item.status">
          </div>
          <div class="item-col2">
            <div class="m-height">
              <p class="title">{{item.title}}</p>
              <p class="sub mb">已售 {{item.sellNum}} 個</p>
            </div>
            <p class="sub">距離結束<span class="small">{{item.dd}}</span>天<span class="small">{{item.hh}}</span>時<span class="small">{{item.mm}}</span>分<span class="small">{{item.ss}}</span>秒</p>
            <!-- <p class="sub"
              v-html="calcTime(item.endTime)"></p> -->
            <div class="buy">
              <div class="buy-col1">
                <span>HK$</span>
                <span class="price">{{item.price}}</span>
              </div>
              <div class="buy-col2">
                <span>HK${{item.originalPrice}}</span>
                <span>立即購買</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="noitems"
        v-else>{{infos}}</div>
      <h2><img src="@/assets/image/group.png"><span>活動流程如下</span><img src="@/assets/image/group.png"></h2>
      <ul class="flows">
        <li class="flow">
          <div class="num">1</div>
          <div class="info">
            <h4>選擇團購商品</h4>
            <p></p>
          </div>
        </li>
        <li class="flow">
          <div class="num">2</div>
          <div class="info">
            <h4>支付商品訂單</h4>
            <p>(不支持合箱)</p>
          </div>
        </li>
        <li class="flow">
          <div class="num">3</div>
          <div class="info">
            <h4>選擇團購商品收貨自提點</h4>
            <p></p>
          </div>
        </li>
        <li class="flow">
          <div class="num">4</div>
          <div class="info">
            <h4>坐等收貨</h4>
            <p>(團購結束後預計7個工作日送達自提點)</p>
          </div>
        </li>
      </ul>
      <h2><img src="@/assets/image/group.png"><span>活動細則</span><img src="@/assets/image/group.png"></h2>
      <!-- <ul class="rules">
        <li v-for="(rule, index) of rules"
          :key="index">{{rule}}</li>
      </ul> -->
      <div v-html="bannerObj.explanation"
        class="explanation"></div>
    </div>
  </div>
</template>

<script>
import { groupBanner, groupList } from '@/api/myCoupon'
export default {
  components: {},
  data () {
    return {
      items: [],
      code: '', // 路由code
      bannerObj: {}, // 商城活动配置
      infos: '正在加載中...',
      rules: [
        '每個商品僅在團購活動有效期間可供購買，報價為包郵一口價;',
        '所有團購訂單均為包郵商品，用戶支付商品費用後，無需在4PX官網再次支付集運費用。每個用戶每次只能購買一個商品，團購商品訂單不支持合箱;',
        '針對團購訂單客戶必須親臨所選自提地點取貨，支付後不得更改， 自提點營業時間請查看4PX官網;',
        '團購訂單為特價服務，因此不支持退換貨服務和退款。若出現商品破損;',
        '如有任何爭議， 4PX和西速團隊將保留更改此優惠之權利而毋須作事前通知及保留行使此優惠之最終決定權;',
        '資料及圖片由商戶提供，只供參考，一切以實物為準;',
        '如有疑問，歡迎聯繫4PX在線客服。'
      ] // 规则
    }
  },
  created () {
    this.code = this.$route.params.type
    // 获取商品banner和底部图片
    this.getBanner()
    // 獲取團購商品列表
    this.getList()
  },
  computed: {},
  watch: {},
  methods: {
    // 获取商品banner和底部图片
    getBanner () {
      groupBanner(this.code).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.bannerObj = res.data
        }
      })
    },
    // 获取商品列表
    getList () {
      groupList().then(res => {
        if (res.code === this.GLOBAL.code && res.data.length) {
          for (let val of res.data) {
            val.endDate = val.remainingTime + new Date().getTime()
            val.status = 0
          }
          this.items = res.data
          this.getTimeList()
        } else {
          this.infos = '暫無數據哦'
        }
      })
    },
    getTimeList () {
      let _this = this
      setInterval(function () {
        for (let val of _this.items) {
          let rightTime = val.endDate - new Date().getTime()
          if (rightTime > 0) {
            let dd = Math.floor(rightTime / 1000 / 60 / 60 / 24)
            let hh = Math.floor((rightTime / 1000 / 60 / 60) % 24)
            let mm = Math.floor((rightTime / 1000 / 60) % 60)
            let ss = Math.floor(rightTime / 1000 % 60)
            _this.$set(val, 'dd', dd)
            _this.$set(val, 'hh', hh)
            _this.$set(val, 'mm', mm)
            _this.$set(val, 'ss', ss)
          } else {
            _this.$set(val, 'dd', 0)
            _this.$set(val, 'hh', 0)
            _this.$set(val, 'mm', 0)
            _this.$set(val, 'ss', 0)
            _this.$set(val, 'status', 1)
          }
        }
      }, 1000)
    },
    // 点击商品，跳转到第三方商品详情
    handlerDetail (item) {
      if (item.status) { // 已截团的不能点击
        return
      }
      location.href = item.detailUrl
    }
  }
}
</script>
<style lang='less'>
  @import "../../assets/less/variable.less";
  .groupBuy {
    font-size: 0.28rem;
    .banner {
      font-size: 0;
    }
    img {
      max-width: 100%;
    }
    .items-wrapper {
      height: 100%;
      width: 100%;
      background-size: cover;
      h2 {
        font-size: 0.36rem;
        color: #fff;
        padding: 0.3rem;
        text-align: center;
        font-weight: bold;
        span {
          padding: 0 0.3rem;
        }
        img {
          width: 0.6rem;
        }
      }
      .noitems {
        color: #fff;
        text-align: center;
        padding: 1rem;
      }
      .items {
        margin-bottom: 0.4rem;
        .item {
          background: #fff;
          width: 94%;
          margin: 0.3rem auto;
          border-radius: 14px;
          display: flex;
          &.done {
            opacity: 0.8;
          }
          .item-col1 {
            width: 44%;
            position: relative;
            text-align: center;
            display: flex;
            align-items: center;
            img {
              border-radius: 14px 0 0 14px;
            }
            span {
              position: absolute;
              top: -0.1rem;
              left: 0;
              color: #fff;
              font-size: 0.36rem;
              font-weight: bold;
              padding: 0.16rem 0.24rem;
              border-radius: 0 0 16px 0;
              &.free {
                background: #1e56eb;
              }
            }
            .stop {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 60%;
              z-index: 6;
            }
          }
          .item-col2 {
            width: 56%;
            padding: 0.2rem 0.14rem;
            box-sizing: border-box;
            .title {
              font-size: 0.34rem;
              color: #333;
              font-weight: bold;
              margin: 0.2rem 0;
              line-height: 0.42rem;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              /*! autoprefixer: off */
              -webkit-box-orient: vertical;
              /*! autoprefixer: on */
              overflow: hidden;
            }
            .m-height {
              height: 1.74rem;
            }
            .sub {
              color: #999;
              font-size: 0.28rem;
              margin: 0.16rem 0;
              &.mb {
                margin-bottom: 0.4rem;
              }
            }
            .small {
              color: @primary;
              padding: 0 0.02rem;
              font-weight: bold;
            }
            .buy {
              background-color: @primary;
              color: #fff;
              border-radius: 0 0.4rem 0.4rem 0;
              display: flex;
              padding: 0.16rem 0;
              align-content: center;
              font-size: 0.28rem;
              .buy-col1 {
                flex: 1;
                display: flex;
                align-items: flex-end;
                justify-content: center;
                .price {
                  font-size: 0.56rem;
                  padding-left: 0.04rem;
                }
              }
              .buy-col2 {
                flex: 1;
                text-align: center;
                span {
                  display: block;
                  &:first-child {
                    text-decoration: line-through;
                  }
                  &:last-child {
                    font-weight: bold;
                  }
                }
              }
            }
          }
        }
      }
      .explanation {
        ul,
        ol {
          width: 94%;
          margin: 0 auto;
          padding-bottom: 0.3rem;
          list-style: none;
          li {
            font-size: 0.24rem;
            color: #fff !important;
            line-height: 0.34rem;
            margin-top: 0.16rem;
            position: relative;
            padding-left: 0.24rem;
            span {
              color: #fff !important;
            }
            &::before {
              position: absolute;
              content: "·";
              width: 0.14rem;
              height: 0.14rem;
              background: #fff;
              left: 0;
              top: 0.1rem;
              border-radius: 100%;
              color: transparent;
            }
          }
        }
      }
      .flows {
        display: flex;
        width: 94%;
        margin: 0 auto;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-bottom: 0.4rem;
        .flow {
          display: flex;
          width: 49%;
          text-align: center;
          border-radius: 6px;
          margin-top: 0.2rem;
          box-sizing: border-box;
          padding: 0.08rem;
          border: 2px solid #fff;
          border-radius: 50px;
          align-items: center;
          .num {
            color: #fff;
            font-size: 0.48rem;
            background-color: @primary;
            border-radius: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 3px solid #fff;
            padding: 0.14rem 0.26rem;
            margin-right: 0.1rem;
            font-weight: bold;
          }
          .info {
            display: flex;
            flex-flow: column;
            justify-content: left;
            h4 {
              font-size: 0.28rem;
              font-weight: bold;
              color: #fff;
              text-align: left;
            }
            p {
              font-size: 0.18rem;
              color: rgba(255, 255, 255, 0.7);
              text-align: left;
            }
          }
        }
      }
    }
  }
</style>
