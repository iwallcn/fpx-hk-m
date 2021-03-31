import {
  mapGetters,
  mapMutations
} from 'vuex'
import {
  billingUtil
} from '@/api/return'
const minxinCommon = {
  methods: {
    ...mapGetters(['returnAddress']),
    ...mapMutations(['SET_RETURN_PICKUPADDRESS', 'SET_RETURN_ADDRESS']),
    // 更新数据
    getUpdateData () {
      this.pickupAddressCheck = this.$store.state.returnPickupAddress
      this.returnAddressCheck = this.returnAddress() // 从缓存中拿退件地址
      this.returnPackageData.pudoCode = this.pickupAddressCheck.pudoCode || this.pickupAddressCheck.pickupCode
      this.returnPackageData.packagePrealertAddressId = this.returnAddressCheck.id || this.returnAddressCheck.userAddressId
    },
    // 申請退件
    handleReturnApply (item) {
      this.maxNumber = item.originalNumber
      this.returnPackageData.packagePrealertGoodsVOS = JSON.parse(JSON.stringify(item))
      this.returnPackageData.packagePrealertGoodsVOS.number = 1
      this.returnPackageData.packagePrealertGoodsVOS.sourceGoodsNo = this.returnPackageData.packagePrealertGoodsVOS.goodsNo
      // delete this.returnPackageData.packagePrealertGoodsVOS.goodsNo
      // 調用運費試算
      this.getRetrunMoney()
    },
    getRetrunMoney () {
      billingUtil(this.returnPackageData.packagePrealertGoodsVOS.number).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.expectCost = res.data
        }
      })
    },
    // 如果数量减少到0，则清空选中商品
    handleNumberChange (val) {
      if (!val) {
        this.returnPackageData.packagePrealertGoodsVOS = ''
        return
      }
      // 調用運費試算
      this.getRetrunMoney()
    },
    // 退件協議
    handleClickArgee () {
      this.isAgree = !this.isAgree
    },
    // 彈出協議
    showProtocol () {
      // TODO
      window.location.href = 'https://m-hk.4px.com/page/singlePage?id=172'
    },
    // 選擇攬收門店
    handleSelectPickup () {
      this.$router.push({
        name: 'returnPickup',
        query: {
          fpxOrderId: this.$route.query.fpxOrderId
        }
      })
    },
    // 選擇退件地址
    handleReturnAddress () {
      this.$router.push({
        name: 'returnAddress',
        query: {
          fpxOrderId: this.$route.query.fpxOrderId
        }
      })
    }
  }
}
export default minxinCommon
