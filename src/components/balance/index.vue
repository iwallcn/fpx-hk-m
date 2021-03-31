<template>
  <div class="my-content">
    <div class="header">
      <div class="balance-info">
        <div class="balance-row">
          <div class="col1">當前總餘額(含返利收益) HKD: <span style="color: #ff4f4f;font-weight: 500;">{{ balance }}</span></div>
          <div class="col2"
            @click="balanceRemak">
            餘額說明<i style="margin-left: 0.05rem; position: relative;top: 0.02rem;"
              class="iconfont icon-info"></i>
          </div>
        </div>
        <div class="balance-row2">
          <div class="col1">當前返利收益 HKD: <span style="color: #ff4f4f;font-weight: 500;">{{rebateAmount}}</span></div>
          <!-- <div class="col2"
            v-if="true">申请提现<i class="iconfont icon-right"></i></div> -->
          <div class="col2"
            @click="setPayPwd">
            {{ isOpenPayPassword ? "修改支付密碼" : "設置支付密碼" }}
            <i class="iconfont icon-right"></i>
          </div>
        </div>
        <!-- 设置支付密码 -->
        <!-- <div class="balance-row">
          <a v-if="isOpenPayPassword==0"
            href="javascript:void(0);"
            @click="managePayPwd('add')">
            设置支付密码
          </a>
        </div> -->
        <!-- 修改支付密碼 -->
        <!-- <div class="balance-row">
          <a v-if="isOpenPayPassword==1"
            href="javascript:void(0);"
            @click="managePayPwd('edit')">
            修改支付密码
          </a>
        </div> -->
        <!-- 找回支付密碼 -->
        <!-- <div>
          <a href="javascript:void(0);"
            @click="regainPayPwd()">
            找回支付密码
          </a>
        </div> -->
      </div>

      <tab v-model="tabIndex"
        class="myBalanceTab">
        <tab-item @on-item-click="onItemClick(index)"
          v-for="(tab, index) in tabs"
          :key="index">{{ tab }}
        </tab-item>
      </tab>
    </div>
    <scroll ref="scroll"
      :data="flowList"
      :pullup="pullup"
      @scrollToEnd="loadListData()"
      class="scroll">
      <div class="mainland"
        ref="mainland">
        <div class="list-wrap">
          <div v-for="(tab, index) in tabs"
            :key="index">
            <template v-if="index == tabIndex">
              <div class="item"
                v-for="(flow, key) in flowList[index]"
                :key="key"
                @click="handleFlowcClick(flow)">
                <div class="item-row">
                  <div class="col1">{{ flow.fpxOrderId }}</div>
                  <div class="col2">
                    {{ flow.flowAmount }} {{flow.currency || "HKD"}}
                  </div>
                </div>
                <div class="item-row">
                  <div class="col1">
                    {{ fmtDate(flow.dateCreated, "YYYY-MM-DD hh:mm:ss") }}
                  </div>
                  <div class="col1"
                    style="text-align:right;">
                    <div>{{flow.feeType || flow.flowTypeText}}</div>
                    <div v-if="flow.flowType != 1 && flow.rebateAmountDeduct"
                      style="font-size:0.24rem;padding-top: 0.1rem;">{{'(扣款含返利收益' + (flow.currency || 'HKD') + ' ' + flow.rebateAmountDeduct +')'}}</div>
                  </div>
                </div>
              </div>
              <div class="nodata"
                v-if="flowList[index].length == 0">
                <i class="iconfont icon-qian"></i>
                <p>{{ itemDataInfo[index] }}</p>
              </div>
              <div class="hold"
                v-if="isOver">--- 我也是有底线的 ---</div>
            </template>
          </div>
        </div>
        <!-- 余额说明 -->
        <div v-transfer-dom
          class="remark-info">
          <alert v-model="balanceInfo"
            button-text="關 閉"
            title="餘額說明">
            <p>1. 系統暫不支持餘額提現功能，屆時將在公告另行通知，敬請留意。</p>
            <p>
              2.
              由於協力廠商支付平臺消息同步可能延時，如充值成功後重繪餘額沒有及時到賬，請不用擔心，稍後片刻再重繪查看。如仍未到賬可聯系客服處理。
            </p>
          </alert>
        </div>
      </div>
    </scroll>
    <footer class="footer-fixed mine">
      <button class="btn-ml"
        @click="handlerRecharge">充 值</button>
    </footer>
  </div>
</template>

<script>
import { Tab, TabItem, Swiper, SwiperItem, Alert } from 'vux'
import * as API from '@/api/myBalance'
import Scroll from '@/common/scroll/scroll'
import { mapGetters } from 'vuex'
import { formatDateL } from '@/utils/common'
// import indexVue from '../track/index.vue';
import FLOW_TYPE from './flowType'

const tabs = ['收入', '支出']
export default {
  name: 'myBalance',
  data () {
    return {
      fmtDate: formatDateL,
      tabIndex: 0,
      balanceInfo: false,
      balance: '0',
      rebateAmount: '0',
      flowList: [[], []],
      tabs: tabs,
      pullup: true,
      page: {
        pageNum: 1,
        pageSize: 35
      },
      totalPages: '',
      isOver: false,
      isOpenPayPassword: 0,
      itemDataInfo: ['正在加載中...', '正在加載中...']
    }
  },
  beforeRouteEnter (from, to, next) {
    next(vm => {
      // 查询账户总余额
      vm.queryTotal()
      // 查询账户流水
      vm.queryAccountFlow(false)
      //  查询是否开通支付
      vm.queryOpenBalancePayInfo()
    })
  },
  methods: {
    queryOpenBalancePayInfo () {
      API.queryOpenBalancePayInfo().then(res => {
        if (res.code === this.GLOBAL.code) {
          this.isOpenPayPassword = res.data.isOpenPayPassword
            ? res.data.isOpenPayPassword
            : 0
        }
      })
    },
    managePayPwd (type) {
      // 进入设置或者修改用户支付密码的页面
      this.$router.push({ name: 'payPwdEdit', query: { type: type } })
    },
    regainPayPwd () {
      // 进入找回支付密码页面
    },
    onItemClick (index) {
      this.isOver = false
      this.$refs.scroll.scrollTo(0, 0)
    },
    loadListData () {
      let { flowList, totalPages } = this
      let tol = [...flowList[0], ...flowList[1]].length
      if (tol < totalPages) {
        this.page.pageNum++
        this.queryAccountFlow(true)
      } else {
        this.$refs.scroll.refresh()
      }
      if (
        this.page.pageNum === this.totalPages &&
        this.$refs.mainland.clientHeight > document.body.clientHeight
      ) {
        this.isOver = true
      }
    },
    // 查询账户总余额
    queryTotal () {
      API.queryTotal().then(res => {
        if (res.code === this.GLOBAL.code) {
          this.balance = this.GLOBAL.fixedTwo(res.data)
        }
      })
      API.getRebateAmount().then(res => {
        if (res.code === this.GLOBAL.code) {
          this.rebateAmount = this.GLOBAL.fixedTwo(res.data)
        }
      })
    },
    // 查询账户流水
    queryAccountFlow (loadMore) {
      API.queryAccountFlow(this.page).then(res => {
        let flowList = loadMore ? [...this.flowList] : [[], []]
        if (res.code === this.GLOBAL.code) {
          this.totalPages = res.data.total
          let CM = FLOW_TYPE
          if (!res.data.result) {
            return
          }
          for (let flow of res.data.result) {
            let obj = {
              ...flow,
              flowAmount: this.GLOBAL.fixedTwo(flow.flowAmount),
              dateCreated: flow.dateCreated,
              flowTypeText: CM[flow.flowType],
              fpxOrderId: flow.fpxOrderId || '暫無'
            }
            // String 1: 余额收款 2：余额付款 OL:线上支付 OF：线下支付
            if (String(flow.flowType) === '1') {
              // 收入只有余额收款
              flowList[0].push(obj)
            } else {
              flowList[1].push(obj)
            }
          }
        }
        this.flowList = [...flowList]
        this.flowList.forEach((item, index) => {
          if (!item.length) {
            this.itemDataInfo[index] = '暫無數據哦'
          }
        })
      })
    },
    // 余额说明
    balanceRemak () {
      this.balanceInfo = !this.balanceInfo
    },
    // 充值
    handlerRecharge () {
      this.$router.push({ name: 'recharge' })
    },
    // 設置支付密碼
    setPayPwd () {
      this.isOpenPayPassword
        ? this.$router.push({ name: 'editPayPwd' })
        : this.$router.push({ name: 'payPwd' })
    },
    handleFlowcClick (data) {
      this.$router.push({ name: 'flowDetail', params: { data } })
    },
    ...mapGetters(['dictData'])
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
  .my-content {
    height: calc(100vh - 46px);
    overflow: hidden;
  }
  .scroll {
    height: calc((100vh - 2.8rem) - 90px);
  }
  .remark-info {
    p {
      text-align: left;
      margin-bottom: 0.2rem;
      margin: 0 -0.2rem 0.2rem -0.1rem;
      line-height: 0.42rem;
    }
  }

  .mainland {
    height: auto;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    .list-wrap {
      .hold {
        font-size: 0.24rem;
        color: #999;
        text-align: center;
      }
      .item {
        margin-bottom: 0.2rem;
        background: #fff;
        font-size: 0.28rem;
        .item-row {
          display: flex;
          padding: 0.2rem;
          border-bottom: 1px solid #f2f2f2;
          justify-content: space-between;
          .col1 {
            color: #666;
          }
          .col2 {
            color: @error;
          }
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
  .header {
    position: relative;
    z-index: 100;
    width: 100vw;
    background-color: #f2f2f2;
    .balance-info {
      padding: 0.2rem 0.3rem;
      font-size: 0.28rem;
      background: #fff;
      margin-bottom: 0.2rem;
      .balance-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 0.6rem;
        .col1 {
          color: #666;
        }
        .col2 {
          color: #999;
        }
      }
      .balance-row2 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 0.6rem;
        .col1 {
          color: #666;
        }
        .col2 {
          color: @primary;
        }
      }
    }
  }
  .footer-fixed.mine {
    // position: relative;
    // z-index: 100;
    .btn-ml {
      height: 0.68rem;
    }
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
      height: calc(~"100% - 158px");
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
