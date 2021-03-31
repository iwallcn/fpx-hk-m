<template>
  <scroll ref="scroll"
    :data="flowList"
    :pullup="pullup"
    @scrollToEnd="scrollToEnd()"
    class="scroll">
    <div class="mainland"
      ref="mainland">
      <div class="list-wrap">
        <template v-if="tabIndex === 0">
          <div class="thead">
            <div class="col">注冊賬號</div>
            <div class="col">注冊日期</div>
            <div class="col">返現訂單數量</div>
          </div>
          <div class="row"
            v-for="(item, index) in flowList[0]"
            :key="index">
            <div class="title">
              <div class="col">{{item.mobile}}</div>
              <div class="col">{{item.registTime | filterTime}}</div>
              <div class="col">{{item.rebateCashNum}}</div>
            </div>
            <div class="detail">
              <div class="col">返優惠券訂單數：{{item.rebateCouponNum}}</div>
              <div class="col">會員賬號：{{item.memberCode}}</div>
            </div>
          </div>
          <div class="nodata"
            v-if="flowList[0].length===0">
            <i class="iconfont icon-qian"></i>
            <p>{{itemDataInfoOne}}</p>
          </div>
          <div class="hold"
            v-if="isOver">--- 我也是有底线的 ---</div>
        </template>

        <!-- 返利明細 -->
        <template v-if="tabIndex === 1">
          <div class="thead">
            <div class="col">項目</div>
            <div class="col">返利金額</div>
            <div class="col">返利日期</div>
          </div>
          <div class="row"
            v-for="(item, index) in flowList[1]"
            :key="index">
            <div class="title">
              <div class="col">{{item.rebateType | filterRebateType}}</div>
              <div class="col">{{GLOBAL.fixedTwo(item.amount)}}{{item.currencyCode}}</div>
              <div class="col">{{item.dateCreated | filterTime}}</div>
            </div>
            <div class="detail">
              <div class="col">包裹號/訂單號：--</div>
              <div class="col">備注：{{item.remark}}</div>
            </div>
          </div>
          <div class="nodata"
            v-if="flowList[1].length===0">
            <i class="iconfont icon-qian"></i>
            <p>{{itemDataInfoTwo}}</p>
          </div>
          <div class="hold"
            v-if="isOver">--- 我也是有底线的 ---</div>
        </template>

        <!-- 返券明細 -->
        <template v-if="tabIndex === 2">
          <div class="thead">
            <div class="col">項目</div>
            <div class="col">優惠券類型</div>
            <div class="col">優惠券張數</div>
          </div>
          <div class="row"
            v-for="(item, index) in flowList[2]"
            :key="index">
            <div class="title">
              <div class="col">{{item.detailType | filterDetailType}}</div>
              <div class="col">{{item.couponType | filterCouponType}}</div>
              <div class="col">{{item.couponNum || '--'}}</div>
            </div>
            <div class="detail">
              <div class="col">返利時間：{{item.rebateTime | filterTime}}</div>
            </div>
          </div>
          <div class="nodata"
            v-if="flowList[2].length===0">
            <i class="iconfont icon-qian"></i>
            <p>{{itemDataInfoThree}}</p>
          </div>
          <div class="hold"
            v-if="isOver">--- 我也是有底线的 ---</div>
        </template>
        <!-- </div> -->
      </div>
      <!-- 余额说明 -->
      <div v-transfer-dom
        class="remark-info">
        <alert v-model="remarks"
          button-text="關 閉"
          title="返利規則">
          <div class="remark-scroll">
            <h3>返利說明：</h3>
            <p>1、活動時間內，邀請朋友通過您的海報、鏈接、邀請碼等資訊完成註冊；</p>
            <p>2、每邀請1位朋友完成註冊，您將獲得1次HK$5現金返利；朋友第一單支付成功，您將獲得1張HK$15現金券（適用於全線路到香港派送服務，有效期從啟動優惠日起30天，且滿HK$30可用）；</p>
            <p>3、返利金額可累計疊加，上不封頂，且不支持提現，您可用於支付運費和增值服務費；</p>
            <p>4、每個客戶在4PX遞四方（香港）僅且只可擁有一個帳號，如發現用戶利用惡性手段推廣獲利，對於此類用戶，4PX遞四方（香港）將採取凍結帳戶、取消返利等措施；</p>
            <p>5、本活動最終解釋權歸4PX遞四方（香港）所有。</p>
          </div>
        </alert>
      </div>
    </div>
    <div class="header">
      <div class="balance-info">
        <div class="balance-row">
          <div class="col1">推廣返利</div>
          <div class="col2"
            @click="handlerInfo">返利規則 <i class="iconfont icon-info"></i></div>
        </div>
        <div class="balance-row1">
          <div class="col"><span class="first">{{rebateAmount}} 元</span><span class="second">推薦收益</span></div>
          <div class="col"><span class="first">{{otherTotal}} 張</span><span class="second">推薦優惠券收益</span></div>
        </div>
        <div class="balance-row2">
          <div class="col">已推薦好友<span>{{friendTotal}}</span>名</div>
          <div class="col">已推薦返利訂單<span>{{orderTotal}}</span>單</div>
        </div>
      </div>

      <tab v-model="tabIndex"
        class="myBalanceTab">
        <tab-item @on-item-click="onItemClick(index)"
          v-for="(tab, index) in tabs"
          :key="index">{{tab}}
        </tab-item>
      </tab>
      <!-- <div>
        <textarea>
          <b>首單免運費</b><p>注冊4PX遞四方全球至香港<p><a href="">sfsfs</a>
        </textarea>
      </div> -->
    </div>
    <footer class="footer-fixed">
      <a class="btn-ml"
        style="display:block"
        @click="handlerShare()">去推廣</a>
    </footer>
  </scroll>
</template>

<script>
import { Tab, TabItem, Swiper, SwiperItem, Alert } from 'vux'
import * as Rebate from '@/api/myrebate'
import Scroll from '@/common/scroll/scroll'
import { fmtDate } from '@/utils/common'
export default {
  name: 'myrebate',
  data () {
    return {
      tabIndex: 0,
      remarks: false, // 返利规则明细
      flowList: [[], [], []], // 好友明细, 返利明细, 返券明细
      tabs: ['好友明細', '返利明細', '返券明細'],
      pullup: true,
      isOver: false,
      onePage: {
        pageNum: 1,
        pageSize: 10
      },
      twoPage: {
        pageNum: 1,
        pageSize: 10
      },
      threePage: {
        pageNum: 1,
        pageSize: 10
      },
      onePageTotal: 0, // 第一个列表总页数
      twoPageTotal: 0, // 第二个列表总页数
      threePageToal: 0, // 第三个列表总页数
      friendTotal: 0, // 已推荐好友多少名，实际上是第一个列表总条数
      otherTotal: 0, // 返利优惠券总数
      orderTotal: 0, // 返利消费订单总数
      rebateAmount: 0, // 返利收益
      shareUrl: '', // 分享url
      itemDataInfoOne: '',
      itemDataInfoTwo: '',
      itemDataInfoThree: ''
    }
  },
  created () {
    this.getRebateAmount() // 获取返利收益
    this.getMemberRebateFriend() // 获取好友明细
    this.getRebateFlow() // 返利明细
    this.memberRebateOrderList() // 返券明细
    // this.getShareUrl() // 获取分享url
  },
  methods: {
    // 获取返利收益
    getRebateAmount () {
      Rebate.getRebateAmount().then(res => {
        if (res.code === this.GLOBAL.code) {
          this.rebateAmount = res.data
        }
      })
    },
    // 获取好友明细
    getMemberRebateFriend () {
      this.itemDataInfoOne = '正在加載中...'
      Rebate.getMemberRebateFriend(this.onePage).then(res => {
        if (res.code === this.GLOBAL.code) {
          if (!res.data.result || res.data.result.length === 0) {
            this.itemDataInfoOne = '暫無數據哦'
            return
          }
          this.friendTotal = res.data.total
          this.onePageTotal = res.data.pages
          this.flowList[0] = this.flowList[0].concat(res.data.result)
        }
      })
    },
    // 返利明细
    getRebateFlow () {
      this.itemDataInfoTwo = '正在加載中...'
      Rebate.getRebateFlow(this.twoPage).then(res => {
        if (res.code === this.GLOBAL.code) {
          if (!res.data.result || res.data.result.length === 0) {
            this.itemDataInfoTwo = '暫無數據哦'
            return
          }
          this.twoPageTotal = res.data.pages
          this.flowList[1] = this.flowList[1].concat(res.data.result)
        }
      })
    },
    // 返券明细
    memberRebateOrderList () {
      this.itemDataInfoThree = '正在加載中...'
      Rebate.memberRebateOrderList(this.threePage).then(res => {
        if (res.code === this.GLOBAL.code) {
          if (!res.data.result || res.data.result.length === 0) {
            this.itemDataInfoThree = '暫無數據哦'
            return
          }
          this.threePageToal = res.data.pages
          this.otherTotal = res.data.otherTotal || 0// 返利优惠券总数
          this.orderTotal = res.data.orderTotal || 0 // 返利消费订单总数
          this.flowList[2] = this.flowList[2].concat(res.data.result)
        }
      })
    },
    // 滚动分页
    scrollToEnd () {
      // 判断是哪个列表分页
      if (this.tabIndex === 0) { // 第一个列表好友明细
        if (this.onePage.pageNum < this.onePageTotal) {
          this.onePage.pageNum++
          this.getMemberRebateFriend()
        } else {
          this.$refs.scroll.refresh()
        }
        if (this.onePage.pageNum === this.onePageTotal) {
          this.isOver = true
        }
      } else if (this.tabIndex === 1) { // 第二个列表返利明细
        if (this.twoPage.pageNum < this.twoPageTotal) {
          this.twoPage.pageNum++
          this.getRebateFlow()
        } else {
          this.$refs.scroll.refresh()
        }
        if (this.twoPage.pageNum === this.twoPageTotal) {
          this.isOver = true
        }
      } else { // 最后一个列表返券明细
        if (this.threePage.pageNum < this.threePageToal) {
          this.threePage.pageNum++
          this.memberRebateOrderList()
        } else {
          this.$refs.scroll.refresh()
        }
        if (this.threePage.pageNum === this.threePageToal) {
          this.isOver = true
        }
      }
    },
    onItemClick (index) {
      this.tabIndex = index
      this.isOver = false
      this.$refs.scroll.scrollTo(0, 0)
    },
    getShareUrl () {
      Rebate.getPromotionUrl().then(res => {
        if (res.code === this.GLOBAL.code) {
          this.shareUrl = res.data
        } else {
          this.$vux.toast.text(res.message)
        }
      })
    },
    // 分享
    handlerShare () {
      this.$router.push({ name: 'myrebateShare' })
      // const value = this.shareUrl
      // // 模拟input
      // const input = document.createElement('input')
      // const str = `${value}`
      // input.setAttribute('readonly', 'readonly')
      // input.setAttribute('value', str)
      // document.body.appendChild(input)
      // input.select()
      // input.setSelectionRange(0, value.length)
      // if (document.execCommand('copy')) {
      //   document.execCommand('copy')
      //   this.$vux.toast.text('推廣鏈接復制成功，可粘貼發送給好友！')
      // }
      // document.body.removeChild(input)
    },
    // 返利規則
    handlerInfo () {
      this.remarks = !this.remarks
    }
  },
  filters: {
    // 返利明细类型
    filterRebateType (key) {
      let obj = { 'regist': '注冊返利', 'consume': '消費返利' }
      console.log(key, obj)
      return obj[key] || '--'
    },
    // 处理时间为2019-05-19
    filterTime (time) {
      if (!time) {
        return '--'
      }
      return fmtDate(time)
    },
    // 返券明细中项目类型
    filterDetailType (key) {
      let obj = { 'regist': '注冊返利', 'consume': '消費返利' }
      return obj[key] || '--'
    },
    // 返券明细中优惠类型
    filterCouponType (key) {
      let obj = { 'VO': '代金券', 'DI': '折扣券', 'FP': '免郵券', 'GIFT': '禮包' }
      return obj[key] || '--'
    }
  },
  components: {
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    Alert,
    Scroll
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .scroll {
    height: 100vh;
  }
  .header {
    position: fixed;
    top: 0.92rem;
    left: 0;
    width: 100vw;
    background-color: #f2f2f2;
  }
  .remark-info {
    h3 {
      font-size: 0.28rem;
      color: @primary;
      text-align: left;
      margin-bottom: 0.16rem;
    }
    .remark-scroll {
      max-height: 8rem;
      overflow-y: auto;
    }
    p {
      text-align: left;
      font-size: 0.24rem;
      margin-bottom: 0.14rem;
      line-height: 0.4rem;
    }
  }
  .mainland {
    height: auto;
    padding-top: 4.1rem;
    padding-bottom: 60px;
    .list-wrap {
      .hold {
        font-size: 0.24rem;
        color: #999;
        text-align: center;
      }
      .thead {
        display: flex;
        background: #fff;
        font-size: 0.28rem;
        margin: 0.16rem 0.2rem;
        .col {
          padding: 0.24rem 0.06rem;
          width: 33.33%;
          text-align: center;
          color: #666;
        }
      }
      .title {
        display: flex;
        background: #fff;
        font-size: 0.26rem;
        margin: 0 0.2rem;
        .col {
          padding: 0.26rem 0.06rem 0.16rem 0.06rem;
          width: 33.33%;
          text-align: center;
          color: @primary;
        }
      }
      .detail {
        display: flex;
        background: #fff;
        font-size: 0.26rem;
        margin: 0 0.2rem 0 0.2rem;
        color: #999;
        border-bottom: 1px dashed #bdbdbd;
        .col:nth-child(odd) {
          padding: 0.1rem 0 0.26rem 0.16rem;
          width: 50%;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .col:nth-child(even) {
          padding: 0.1rem 0.16rem 0.26rem 0.06rem;
          width: 50%;
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .nodata {
      text-align: center;
      padding: 0.5rem;
      color: #999;
      background: #fff;
      i {
        font-size: 0.8rem;
        display: block;
      }
      p {
        font-size: 0.24rem;
        padding-top: 0.2rem;
      }
    }
  }
  .balance-info {
    padding: 0.2rem;
    font-size: 0.28rem;
    margin: 0.2rem;
    border-radius: 4px;
    // background: linear-gradient(left, #ff8429, #ff4a42);
    background: -webkit-linear-gradient(0deg, #ff8429 0%, #ff4a42 100%);
    background: -moz-linear-gradient(0deg, #ff8429 0%, #ff4a42 100%);
    background: -o-linear-gradient(0deg, #ff8429 0%, #ff4a42 100%);
    background: -ms-linear-gradient(0deg, #ff8429 0%, #ff4a42 100%);
    background: linear-gradient(90deg, #ff8429 0%, #ff4a42 100%);
    .balance-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: 0.1rem 0;
      color: #fff;
    }
    .balance-row1 {
      display: flex;
      justify-content: center;
      .col {
        width: 50%;
        text-align: center;
      }
      .first {
        display: block;
        color: #fff;
        padding: 0 0.06rem;
        font-size: 0.4rem;
        margin: 0.1rem 0;
      }
      .second {
        display: block;
        color: #ffe0e0;
      }
    }
    .balance-row2 {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: 0.06rem 0;
      border-top: 1px dashed #fff;
      padding-top: 0.2rem;
      margin-top: 0.3rem;
      align-items: center;
      .col {
        font-size: 0.3rem;
        color: #fff;
        width: 50%;
        text-align: center;
        border-right: 1px solid #eee;
        &:last-child {
          border-right: none;
        }
        span {
          padding: 0 0.06rem;
          font-size: 0.4rem;
        }
      }
    }
  }
  .myBalanceTab {
    margin: 0 0.2rem;
  }
</style>
<style lang="less">
  @import "../../assets/less/variable.less";
  .mainland {
    .vux-swiper-item {
      height: 100% !important;
      overflow-y: scroll;
      overflow-x: hidden;
    }
    width: 100%;
    .list-wrap {
      height: calc(~"100% - 5rem");
      overflow: scroll;
      padding-bottom: 1.6rem;
      .vux-swiper {
        height: 100% !important;
      }
    }
  }
  .myBalanceTab .vux-tab {
    background-color: #f2f2f2;
    border-top: 1px solid #fff;
    height: 0.8rem;
    .vux-tab-item {
      background: #fff;
    }
  }
</style>
