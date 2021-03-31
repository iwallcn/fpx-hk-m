<template>
  <div class="mainland">
    <p>應付金額<span>{{money}}</span>HKD</p>
    <checklist label-position="left"
      :max="1"
      required
      :options="commonList"
      v-model="checklist"></checklist>
    <footer class="footer-fixed">
      <button class="btn-ml"
        @click="handlerRecharge">立即充值</button>
    </footer>
  </div>
</template>

<script>
import { Group, Checklist } from 'vux'
import { submitPay } from '@/api/myPackage'
import { getPayChannels } from '@/api/myBalance'
import { getApiToken } from '@/api/token'

export default {
  name: 'rechargeType',
  data () {
    return {
      commonList: ['微信支付'],
      checklist: [],
      money: this.$route.query.money || 0,
      wxObj: {}
    }
  },
  created () {
    // 获取支付渠道
    this.getPayChannels()
    // 设置请求token
    this.getQequestToken()
  },
  activated () {
    // 设置请求token
    this.getQequestToken()
  },
  methods: {
    // 从后台拿token
    getQequestToken () {
      getApiToken().then(res => {
        if (res.code === this.GLOBAL.code) {
          sessionStorage.setItem('token', res.data)
        }
      })
    },
    // 获取支付渠道
    getPayChannels () {
      getPayChannels().then(res => {
        if (res.code === this.GLOBAL.code) {
          // for (let i in res.data) {
          //   let v = res.data[i]
          //   if (v.payCode === 'balancepay') {
          //     res.data.splice(i, 1)
          //     break
          //   }
          //   v.key = v.payCode || ''
          //   v.value = v.payName || ''
          // }
          this.commonList = (res.data || [])
            .filter(item => item.payCode !== 'balancepay' && item.payCode !== 'payment_asia')
            .map(item => {
              item.key = item.payCode || ''
              item.value = item.payName || ''
              return item
            })
        }
      })
    },
    // 立即充值
    handlerRecharge () {
      let payCode = this.checklist[0]
      if (!payCode) {
        this.$vux.toast.text('請選擇支付方式')
        return
      }
      let obj = {
        fpxOrderId: '0',
        payCurrency: 'HKD',
        feeType: '30',
        payAmount: this.money,
        payCode: payCode
      }
      if (this.$route.query.eventPlanningId) {
        obj.eventPlanningIds = [this.$route.query.eventPlanningId]
      }
      submitPay(obj).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.removeQequestToken() // 删除token
          this.wxObj = res.data
          let url = res.data.actionUrl
          delete res.data.actionUrl
          let form = document.createElement('form')
          form.method = 'post'
          form.action = url
          form.target = '_self'
          document.body.appendChild(form)
          for (let k in res.data) {
            let input = document.createElement('input')
            input.type = 'hidden'
            input.name = k
            input.value = res.data[k]
            form.appendChild(input)
          }
          form.submit()
          document.body.removeChild(form)
        } else {
          this.getQequestToken()
        }
      })
    },
    // 删除token
    removeQequestToken () {
      sessionStorage.removeItem('token')
    }
  },
  components: {
    Group,
    Checklist
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .mainland {
    p {
      font-size: 0.28rem;
      padding: 0.3rem;
      text-align: center;
      span {
        color: @error;
        padding: 0 0.06rem;
      }
    }
  }
</style>
