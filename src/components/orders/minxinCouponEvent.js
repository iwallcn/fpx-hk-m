/**
 * 这里主要是选择活动和优惠券联动组合情况，设置哪些不能选择的活动和优惠券
 * 如果选择了一个减的活动，则该活动和优惠券下只能选择折，其他减都设置为不能选
 * 不能同时减和减，或者折和折
 */
import { getPlanByCondition } from '@/api/myPackage'
const minxinCouponEvent = {
  methods: {
    // 选活动，每次選擇活動之后，都要调組合接口更新活動和優惠券，设置哪些不能选择的活动和优惠券
    selectEvent (item) {
      if (item.disabled) { // 表明不可用
        this.$vux.toast.text('該活動不可用，不能同時使用減上減，或者折上折')
        return
      }
      if (item.isCheck) { // 說明取消
        let arr = []
        this.eventSelectList.forEach((val, index) => {
          val.disabled = false
          if (val.key === item.key) {
            val.isCheck = false
            item.isCheck = false
            this.eventSelectList.splice(index, 1)
          } else {
            arr.push(val.value)
          }
          this.eventNames = arr.join(',')
        })
      } else { // 說明選中
        if (this.eventSelectList.length >= 2) {
          this.$vux.toast.text('最多只能選擇2個活動')
          return
        }
        if (this.eventSelectList.length === 0) {
          item.isCheck = true
          this.eventSelectList.push(item)
        } else {
          this.eventSelectList.forEach((val, index) => {
            val.isCheck = true
            item.isCheck = true
            this.eventSelectList.push(item)
          })
        }
      }
      if (this.eventSelectList.length === 2) { // 2个活动，设置当前选择的优惠券为空
        this.coupon = ''
      }
      this.randerCouponEvent(item)
    },
    // 優惠券面板選擇優惠券, 記錄下選擇的優惠券
    selectCoupon (item) {
      if (item.disabled) { // 表明不可用
        this.$vux.toast.text('該優惠券不可用，不能同時使用減上減，或者折上折')
        return
      }
      if (this.eventSelectList.length > 1) {
        this.$vux.toast.text('只能選擇兩種活動，或者一種活動加優惠券')
        return
      }
      this.couponShow = false
      if (item.isCheck) {
        item.isCheck = false
        this.coupon = ''
      } else {
        this.couponList.forEach(val => {
          this.$set(val, 'isCheck', false)
        })
        item.isCheck = true
        this.coupon = item
        this.obj.couponNo = this.coupon.couponNo
      }
      this.randerCouponEvent('')
    },
    // 无论点击活动还是优惠券，都重新更新活动和优惠券列表, selectItem 这里主要用来标记当前选择的活动
    randerCouponEvent (selectItem) {
      /**
       * 不需要调接口情况：
       *   有1个优惠券和1个活动
       *   有2个活动
       *   既没有优惠券，也没有活动
       * 需要调接口情况：
       *   有1个优惠券
       *   有1个活动
       */
      if ((this.coupon && this.eventSelectList.length === 1) || this.eventSelectList.length === 2) { // 有1个优惠券和1个活动，有2个活动
        let indexs = []
        this.eventSelectList.forEach((val, index) => {
          this.eventList.forEach((item, index) => {
            if (item.key === val.key) {
              indexs.push(index)
            }
          })
        })
        this.eventList.forEach((item, index) => {
          if (indexs.indexOf(index) !== -1) {
            this.$set(item, 'disabled', false)
          } else {
            this.$set(item, 'disabled', true)
            item.isCheck = false
          }
        })
        return
      }
      if (!this.eventSelectList.length && !this.coupon) { // 既没有优惠券，也没有活动
        this.eventList.forEach(val => {
          val.disabled = false
        })
        this.couponList.forEach(val => {
          this.$set(val, 'disabled', false)
        })
        return
      }
      if (this.coupon && !this.eventSelectList.length) { // 有1个优惠券，则传优惠券NO
        let params = [this.obj.fpxOrderId, this.obj.payCode, '', this.coupon.couponNo, this.coupon.amount]
        this.updateEventCoupon(params, '')
      }
      if (!this.coupon && this.eventSelectList.length === 1) { // 有1个活动，则传活动ID
        setTimeout(() => {
          let weight = ''
          let eventPlanningIds = ''
          if (this.eventSelectList.length) {
            this.eventSelectList.forEach(val => {
              eventPlanningIds += `eventPlanningId=${val.key}&`
              if (val.eventType === 'weightFree') {
                this.getWFreePrice([this.obj.fpxOrderId, val.cutValue, val.weightUnit])
                weight = this.weightFreeValue // 免邮试算得到的立减金额
              }
            })
          }
          eventPlanningIds = eventPlanningIds.slice(16, -1)
          let params = [this.obj.fpxOrderId, this.obj.payCode, eventPlanningIds, '', weight]
          this.updateEventCoupon(params, selectItem)
        }, 50)
      }
    },
    // 1个活动或者1个优惠券的情况，更新活动和优惠券数据
    updateEventCoupon (params, selectItem) {
      getPlanByCondition(params).then(res => {
        if (res.code === this.GLOBAL.code) {
          if (res.data.eventList) {
            let indexs = []
            res.data.eventList.forEach(val => {
              this.eventList.forEach((item, index) => {
                let flag = selectItem ? item.key === selectItem.key : false
                if (item.key === val.eventPlanningId || flag) {
                  indexs.push(index)
                }
              })
            })
            if (this.eventSelectList.length === 1) { // 选中两个活动，取消其中一个，则要保留上一个选中的活动
              this.eventList.forEach((item, index) => {
                if (item.key === this.eventSelectList[0].key) {
                  indexs.push(index)
                }
              })
            }
            indexs = [...new Set(indexs)]
            this.eventList.forEach((item, index) => {
              if (indexs.indexOf(index) !== -1) {
                this.$set(item, 'disabled', false)
              } else {
                this.$set(item, 'disabled', true)
                item.isCheck = false
              }
            })
          }
          if (res.data.couponList) {
            let indexs = []
            if (this.couponList.length) { // 不是第一次加载优惠券
              res.data.couponList.forEach((val, index) => {
                this.couponList.forEach((item, index) => {
                  if (item.couponNo === val.couponNo) {
                    indexs.push(index)
                  }
                })
              })
            } else {
              res.data.couponList.forEach((val, index) => {
                this.couponList.push(val)
              })
            }
            this.couponList.forEach((item, index) => {
              if (indexs.indexOf(index) !== -1) {
                this.$set(item, 'disabled', false)
              } else {
                this.$set(item, 'disabled', true)
              }
            })
          }
        } else {
          this.$vux.toast.hide()
        }
      })
    }
  }
}
export default minxinCouponEvent
