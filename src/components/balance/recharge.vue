<template>
  <div class="mainland">
    <group class="first-cell">
      <p>請選擇充值金額：</p>
      <checker v-model="rechargeMoney"
        selected-item-class="money-item-selected">
        <checker-item v-for="i in [100, 200, 300, 400]"
          :key="i"
          :value="i">{{i}}HKD</checker-item>
      </checker>
      <p style="color: #999;">充值不支持提現，可用於支付包裹費用和增值服務費，可叠加優惠券使用。</p>
    </group>
    <group>
      <x-input title="充值金額"
        v-model.number="money"
        placeholder="請輸入充值金額（HKD）"
        @on-click-clear-icon="clearInput"></x-input>
      <checklist ref="demoObject"
        :options="objectList"
        v-model="objectListValue"
        :max=1></checklist>
    </group>
    <group>
       <cell title="淘寶店鋪付款（選擇儲值活動類型，拍下寶貝並付款，收貨地址為4PX東莞倉地址。預計1-3個工作日到賬。）" is-link link="https://item.taobao.com/item.htm?spm=a1z10.5-c-s.w4002-23027543229.13.15a7b122l9GJhp&id=632219941504"></cell>
    </group>
    <footer class="footer-fixed">
      <button :class="[{disabled: disabled}, 'btn-ml']"
        @click="handlerRecharge"
        :disabled="disabled">進行充值</button>
    </footer>
  </div>
</template>

<script>
import { Group, Cell, CellBox, XInput, Checker, CheckerItem, Checklist } from 'vux'
import * as API from '@/api/myBalance'
export default {
  name: 'recharge',
  data () {
    return {
      rechargeMoney: null,
      money: null,
      disabled: false,
      objectList: [],
      objectListValue: []
    }
  },
  created () {
    // 获取会员可选充值活动
    this.getMemberChargeList()
  },
  methods: {
    // 获取会员可选充值活动
    getMemberChargeList () {
      API.memberChargeList().then(res => {
        if (res.code === this.GLOBAL.code && res.data) {
          this.objectList = []
          for (let val of res.data) {
            let obj = {
              key: val.eventPlanningId,
              value: val.eventName
            }
            this.objectList.push(obj)
          }
        }
      })
    },
    // 进行充值
    handlerRecharge () {
      if (this.rechargeMoney > 0 && (!this.money || !this.money.toString().trim())) {
        this.$router.push({ name: 'rechargeType', query: { money: this.rechargeMoney, eventPlanningId: this.objectListValue[0] } })
        return
      }
      if (!/^(\d|[1-9]\d+)(\.\d+)?$/.test(this.money)) {
        this.$vux.toast.text('請輸入正確的充值金額')
        return
      }
      this.money = this.money.toFixed(2)
      this.$router.push({ name: 'rechargeType', query: { money: this.money, eventPlanningId: this.objectListValue[0] } })
    },
    // 清除输入框內容
    clearInput () {
      this.money = ''
    }
  },
  watch: {
    rechargeMoney () {
      if (this.rechargeMoney > 0) {
        this.disabled = false
      }
    },
    money () {
      if (this.money) {
        this.disabled = false
      }
    }
  },
  components: {
    Group,
    Cell,
    CellBox,
    XInput,
    Checker,
    CheckerItem,
    Checklist
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .mainland {
    p {
      font-size: 0.28rem;
      padding: 0.2rem 0.3rem;
    }
    .vux-checker-box {
      display: flex;
      flex-wrap: wrap;
      padding: 0 0.3rem;
      margin-bottom: 0.2rem;
      .vux-checker-item {
        position: relative;
        flex: 0.5 0 auto;
        background: #f2f2f2;
        padding: 0.24rem 0;
        width: 46.8%;
        margin: 1.6%;
        text-align: center;
        font-size: 0.28rem;
        border: 1px solid @minor;
        box-sizing: border-box;
        &.money-item-selected {
          border: 1px solid @primary;
          &:after {
            content: "√";
            position: absolute;
            bottom: 0.04rem;
            right: 0.06rem;
            font-weight: bold;
            font-size: 0.32rem;
            color: @primary;
            // display: block;
            // width: 0;
            // height: 0;
            // border-width: 20px 20px 0px 0;
            // border-style: solid;
            // border-color: transparent #00a0ea transparent transparent;
            // position: absolute;
            // right: 0px;
            // bottom: 0px;
            // color: #fff;
          }
        }
      }
    }
  }
</style>
