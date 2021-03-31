<template>
  <div>
    <group>
      <cell title="业务单号" :value="data.businessNo"></cell>
      <cell title="支付单号" :value="data.payOrderNo"></cell>
    </group>
    <group>
      <cell title="交易时间" :value="flowDate"></cell>
      <cell title="消费类型" :value="data.feeType"></cell>
      <cell title="支付方式" :value="flowType"></cell>
    </group>
    <group>
      <cell title="收入" :value="incomeAmount"></cell>
      <cell title="支出" :value="expensesAmount"></cell>
      <cell title="账户余额(含返利)" :value="data.newBalance"></cell>
      <cell title="币种" :value="data.currency"></cell>
    </group>
    <group>
      <cell title="备注" value=" "></cell>
    </group>
  </div>
</template>

<script>
// 流水詳情
import { Group, Cell } from 'vux'
import FLOW_TYPE from './flowType'

const cacheKey = '_flowDetailData'

const cahce = window.sessionStorage.getItem(cacheKey)

export default {
  name: 'FlowDetail',
  data () {
    return {
      data: {}
    }
  },
  computed: {
    flowDate () {
      const { dateCreated } = this.data
      if (dateCreated) {
        return new Date(dateCreated).toLocaleString('zh-HK')
      }
    },
    incomeAmount () {
      const { flowType, flowAmount } = this.data
      if (flowType === '1') {
        return this.GLOBAL.fixedTwo(flowAmount)
      }
      return '-'
    },
    expensesAmount () {
      const { flowType, flowAmount } = this.data
      if (flowType !== '1') {
        return this.GLOBAL.fixedTwo(flowAmount)
      }
      return '-'
    },
    flowType () {
      return FLOW_TYPE[this.data.flowType] || this.data.flowType
    }
  },
  created () {
    const { data } = this.$route.params
    const d = data || JSON.parse(cahce)
    if (!d) {
      this.$router.push({name: 'balance'})
      return
    }
    this.data = d || {}
    window.sessionStorage.setItem(cacheKey, JSON.stringify(this.data))
  },
  components: {
    Group,
    Cell
  }
}
</script>
