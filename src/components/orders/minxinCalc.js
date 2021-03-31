/**
 * 这里是选择优惠券和活动之后，开始计算总价和各项优惠
 */
const minxinCalc = {
  methods: {
    calcTotal () {
      this.calcTotalValue = 0
      /**
       * 两种活动的情况
       * 活动分为 discountOrCut：立减/立折、memberDiscount：会员折扣、weightFree：重量免邮 三种情况
       * 合计 = (运费 - 活动立减 - 活动免邮) * 活动折扣 + 其他费用明细
       */
      let disCutValue = 0 // 立减/立折
      let disCutDI = 1 // 折扣
      let menCutValue = 1 // 折扣
      let freeCutValue = 0 // 重量免邮
      if (this.eventSelectList.length === 2) {
        // 解决异步用
        let ins = 0
        let weightFreeFlag = false
        let arr = this.eventSelectList
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].eventType === 'weightFree') {
            weightFreeFlag = true
            ins = i
          }
        }
        if (weightFreeFlag && ins === 1) {
          this.eventSelectList = arr.reverse()
        }
      }
      let promise1 = new Promise((resolve, reject) => {
        let arr = this.eventSelectList
        let flag = true // 当活动中有免邮类型，通过标记来设置异步状态
        if (arr.length) {
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].eventType === 'discountOrCut' && arr[i].discountCutType === 'VO') { // 立减
              disCutValue += arr[i].cutValue // 10
            } else if (arr[i].eventType === 'discountOrCut' && arr[i].discountCutType === 'DI') { // 立折
              disCutDI *= arr[i].cutValue
            } else if (arr[i].eventType === 'memberDiscount') {
              menCutValue *= arr[i].cutValue
            } else if (arr[i].eventType === 'weightFree') {
              flag = false
              this.getWFreePrice([this.obj.fpxOrderId, arr[i].cutValue, arr[i].weightUnit], () => {
                freeCutValue += this.weightFreeValue
                flag = true
                if (i === arr.length) {
                  resolve()
                }
              })
            }
          }
        }
        if (flag) {
          resolve()
        }
      })
      promise1.then(() => {
        console.log(freeCutValue, '有活动', disCutValue, disCutDI)
        this.calcResult(disCutValue, disCutDI, menCutValue, freeCutValue)
      })
    },
    calcResult (disCutValue, disCutDI, menCutValue, freeCutValue) {
      this.calcTotalValue = 0 // 防止多次調用，導致累加
      let that = this
      // 如果有次卡
      /**
       * 费用明细
          计次卡：
        cardType = meteringCard
        抵扣  onceMostMoneyDeduction

          储值卡/礼品卡：
        cardType = depositCard
        抵扣 usableAmount

          折扣卡和综合卡：
        cardType = discountCard
        打discount折
       */
      if (that.cardSelect) {
        that.orderCostDetailDTOList.forEach(item => {
          // 次卡抵消费用类型跟费用明细相同，则再看是折扣卡，还是抵扣金额
          if (item.feeType.toString() === that.cardSelect.costType.toString()) {
            if (that.cardSelect.cardType === 'meteringCard') { // 次卡
              freeCutValue = item.price - that.cardSelect.onceMostMoneyDeduction > 0 ? that.cardSelect.onceMostMoneyDeduction : item.price
              item.disPrice = item.price - that.cardSelect.onceMostMoneyDeduction > 0 ? that.cardSelect.onceMostMoneyDeduction : item.price
            } else if (that.cardSelect.cardType === 'depositCard') { // 储值卡/礼品卡：
              freeCutValue = that.cardSelect.usableAmount
              item.disPrice = that.cardSelect.usableAmount
            } else if (that.cardSelect.cardType === 'discountCard') {
              freeCutValue = item.price - item.price * that.cardSelect.discount
              item.disPrice = item.price * that.cardSelect.discount
            }
            that.calcTotalValue += item.price - freeCutValue
            // that.calcTotalValue += item.price - freeCutValue
          } else {
            item.disPrice = 0
            that.calcTotalValue += item.price
          }
        })
      }
      // 两种活动
      if (that.eventSelectList.length > 1) {
        that.orderCostDetailDTOList.forEach(item => {
          if (item.feeType.toString() === '234') {
            if (freeCutValue > item.price) {
              freeCutValue = item.price
              item.disPrice = item.price
            } else {
              item.disPrice = item.price - (item.price - freeCutValue - disCutValue) * menCutValue * disCutDI
            }
          } else {
            item.disPrice = 0
          }
        })
        that.calcTotalValue = (that.yunfei - freeCutValue - disCutValue) * menCutValue * disCutDI + that.qitafei
        that.calcTotalValue = that.calcTotalValue <= 0 ? 0 : that.calcTotalValue
      }
      /**
       * 一种活动+一种优惠券的情况
       * 活动分为 discountOrCut：立减/立折、memberDiscount：会员折扣、weightFree：重量免邮 三种情况
       * 其中优惠券又是针对费用明细中的某一项来优惠的
       * 合计 = (运费 - 活动立减 - 活动免邮) * 活动折扣 + 其他费用明细
       */
      if (that.eventSelectList.length === 1 || that.coupon) { // 一种活动，一种优惠券的情况
        /*
         * 遍历所有的费用明细列表，针对每个明细计算出优惠值
         * A. 当前项 = 234，优惠券 = 234，则算活动+优惠券
         * B. 当前项 = 234，优惠券 != 234，则算活动
         * C. 当前项 != 234，优惠券 = 当前项，则算优惠券
         * D. 当前项 != 234，优惠券 != 当前项，则没有优惠
         */
        // 先判断下优惠券是否是免邮券，因为优惠券是免邮券类型的话，需要异步请求接口
        let p = new Promise((resolve, reject) => {
          if (that.coupon.couponType === 'FP') {
            that.getWFreePrice([that.obj.fpxOrderId, that.coupon.amount, that.coupon.unit], () => {
              that.couponFeeWeight = this.weightFreeValue // 将接口返回的数据赋值给免邮券
              resolve()
            })
          } else {
            that.couponFeeWeight = 0
            resolve()
          }
        })
        p.then(() => {
          for (var item of that.orderCostDetailDTOList) {
            let amount = that.couponFeeWeight > 0 ? that.couponFeeWeight : that.coupon.amount
            if (item.feeType.toString() === '234') {
              if (that.coupon.costType === '234') { // A
                let yunfei = 0
                if ((disCutDI < 1 && disCutDI > 0) || (menCutValue > 0 && menCutValue < 1)) { // 活动折扣
                  // 优惠券类型可能有三种：VO减，DI:折扣, FP:重量免邮
                  if (that.coupon.couponType === 'DI') {
                    yunfei = item.price * disCutDI * menCutValue * amount
                  } else {
                    if (item.price < amount || item.price < freeCutValue) {
                      item.disPrice = item.price
                    } else {
                      yunfei = (item.price - amount) * disCutDI * menCutValue // B:优惠券立减活动折扣
                    }
                  }
                } else { // 活动免邮和立减
                  // 优惠券类型可能有三种：VO减，DI:折扣, FP:重量免邮
                  if (that.coupon.couponType === 'DI') {
                    if (item.price < freeCutValue) {
                      item.disPrice = item.price
                    } else {
                      yunfei = (item.price - freeCutValue - disCutValue) * amount // C:优惠券折扣活动立减
                    }
                  } else {
                    if (item.price < disCutValue || item.price < amount) {
                      item.disPrice = item.price
                    } else {
                      yunfei = item.price - freeCutValue - disCutValue - amount // D:优惠券活动都是立减
                      if (yunfei < 0) { // 如果两个立减加起来是负数，那么优惠就是运费
                        yunfei = 0
                      }
                    }
                  }
                }
                item.disPrice = item.price - yunfei
                console.log(item.price, amount, yunfei, 'yunfei')
                that.calcTotalValue += yunfei
              } else { // B
                let temp = 0
                if ((disCutDI < 1 && disCutDI > 0) || (menCutValue > 0 && menCutValue < 1)) { // 折扣情况
                  temp += item.price * menCutValue * disCutDI
                  item.disPrice = item.price - item.price * menCutValue * disCutDI
                } else { // 立减情况
                  if (item.price < disCutValue || item.price < freeCutValue) {
                    item.disPrice = item.price
                  } else {
                    temp += (item.price - disCutValue - freeCutValue) * menCutValue
                    item.disPrice = item.price - temp
                  }
                }
                that.calcTotalValue += temp
              }
            } else {
              if (that.coupon.costType === item.feeType.toString()) { // C
                let youhui = 0
                if (that.coupon.couponType === 'DI') { // 优惠券折扣
                  youhui = item.price * amount
                } else {
                  if (item.price < amount) {
                    item.disPrice = item.price
                  } else {
                    youhui = item.price - amount
                    item.disPrice = item.price - youhui
                  }
                }
                that.calcTotalValue += youhui
              } else { // D
                that.calcTotalValue += item.price
                item.disPrice = 0
              }
            }
          }
        })
      }
      // 由于取消卡券重新请求了卡券、活动，这时候金额重新计算，合计 赋值等于 总额
      if (!that.cardSelect && !this.eventSelectList.length && !this.coupon.couponNo) {
        this.calcTotalValue = this.chargesTotal
      }
    }
  }
}
export default minxinCalc
