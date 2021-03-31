import {
  getWH,
  destinationCountry
} from '@/utils/cache'
const minxinCommon = {
  methods: {
    // 查看订单详情
    viewOrder (id, flag) {
      this.$router.push({
        name: 'receivedetail',
        query: {
          fpxOrderId: id,
          statusFlag: flag
        }
      })
    },
    // 立即支付
    handlerPay (id) {
      this.$router.push({
        name: 'payment',
        query: {
          fpxOrderId: id
        }
      })
    }
  },
  filters: {
    // 流程路线取一个唯一key
    filterKey (val) {
      return Math.random(val)
    },
    // 起运仓库
    filterWH (val) {
      const wh = getWH()
      return wh.hasOwnProperty(val) ? wh[val] : '暫無'
    },
    // 目的国家
    filterCountry (val) {
      const dc = destinationCountry()
      return dc.hasOwnProperty(val) ? dc[val] : '暫無'
    },
    filterFlow (val) {
      if (val <= 30 || (val > 30 && val <= 80) || (val === 90) || (val === 100)) {
        return true
      } else {
        return false
      }
    }
  }
}
export default minxinCommon
