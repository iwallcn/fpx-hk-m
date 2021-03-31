<template>
  <div class="mainland">
    <group class="first-cell">
      <cell title="預約包裹"
        is-link
        :value="appointmentPackages.length"
        @click.native="boxShow = !boxShow"
        value-align="right"></cell>
      <transition name="swtich">
        <div class="tbody"
          v-show="boxShow">
          <div class="tr">
            <div class="td">订单号</div>
            <div class="td">剩余有效期</div>
          </div>
          <div class="tr"
            v-for="(item, index) in appointmentPackages"
            :key="index">
            <div class="td">
              {{item.fpxOrderId}}
            </div>
            <div class="td">{{item.restDay}}天</div>
          </div>
        </div>
      </transition>
      <cell title="提貨人"
        :value="consignee"
        value-align="right"></cell>
      <cell title="自提點"
        :value="userPudoDTO.pudoName"
        value-align="right">
      </cell>
      <cell title="預約提貨時間"
        is-link
        :value="appTime"
        value-align="right"
        class="vux-1px-b"></cell>
    </group>
    <div class="calendar-wrapper">
      <inline-calendar ref="calendar"
        class="inline-calendar-demo"
        v-model="value"
        :start-date="startDate"
        :end-date="endDate"
        @on-select-single-date="handlerSelectDate"
        @on-view-change="viewChange">
      </inline-calendar>
      <div class="timeCell">時間：
        <checker v-model="checkerValue"
          default-item-class="checker-item"
          selected-item-class="checker-item-selected"
          @@on-item-click="checkerClick">
          <checker-item value="0"
            v-show="weekend > 0">上午</checker-item>
          <checker-item value="1">下午</checker-item>
        </checker>
      </div>
      <div class="remark">
        說明：周一至周六上午時間段10:30-12:00, 下午時間段12:00-19:30，周日及公休日下午時間段12:00-17:00
      </div>
    </div>
    <footer class="footer-fixed">
      <!-- <div class="agree"
        @click="disabled = !disabled">
        <i :class="['iconfont', disabled ? 'icon-nocheck': 'icon-check']"></i>
        我已閱讀并同意《遞四方（香港）服務協議》
      </div> -->
      <button @click="handlerSubmit"
        :class="['btn-order', value ? '' : 'disabled']"
        :disabled="!value">提交</button>
    </footer>
  </div>
</template>

<script>
import { Group, Cell, Popup, InlineCalendar, Checker, CheckerItem } from 'vux'
import { submitShipper, getAppointmentInfo } from '@/api/appointment'
export default {
  name: 'appointTime',
  data () {
    return {
      userPudoDTO: {},
      appointmentPackages: [],
      fpxOrderIds: [],
      boxShow: false,
      appTime: '',
      value: '',
      disabled: true,
      checkerValue: '1',
      weekend: 0,
      currentChangeDate: '', // 当前选择的时间
      shipperStartTime: '', // 最后选择的开始时间
      shipperEndTime: '' // 最后选择的结束时间
    }
  },
  created () {
    this.getData()
  },
  computed: {
    // 提货人+电话
    consignee () {
      return this.userPudoDTO.username + ' ' + this.userPudoDTO.phone
    },
    // 计算出预约包裹中最近快过期的包裹天数
    calcDay () {
      let arr = []
      if (this.appointmentPackages.length > 0) {
        this.appointmentPackages.forEach((val, index) => {
          arr.push(val.restDay)
        })
        return Math.min.apply(null, arr)
      }
      return 7
    },
    // 日历开始日期
    startDate () {
      let date = new Date()
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    },
    // 日历结束日期
    endDate () {
      let date = new Date()
      date.setDate(date.getDate() + this.calcDay - 1)
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }
  },
  methods: {
    // 根据订单号获取数据
    getData () {
      let arr = this.$route.params.arr
      getAppointmentInfo(arr).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.userPudoDTO = res.data.userPudoDTO
          this.appointmentPackages = res.data.appointmentPackages
          res.data.appointmentPackages.forEach(val => {
            this.fpxOrderIds.push(val.fpxOrderId)
          })
        }
      })
    },
    // 提交预约
    handlerSubmit () {
      let obj = {
        pickUpCode: this.userPudoDTO.pudoCode,
        endDay: this.calcDay,
        shipperStartTime: this.shipperStartTime,
        shipperEndTime: this.shipperEndTime,
        fpxOrderList: this.fpxOrderIds
      }
      submitShipper(obj).then(res => {
        this.$vux.toast.text(res.message)
        if (res.code === this.GLOBAL.code) {
          this.$router.push({ name: 'appointDetail', params: { appointId: res.data.appointId } })
        }
      })
    },
    // 选择时间
    handlerSelectDate (val) {
      this.currentChangeDate = val // 当前选择的时间
      this.weekend = new Date(val).getDay()
    },
    // 第一次渲染日期时，判断是否是周末
    viewChange (data, index) {
      this.weekend = new Date().getDay()
    },
    // 时间上午，下午改变时触发
    checkerClick (val) {
      this.checkerValue = val
    },
    calcDate () {
      let a = ''
      let b = ''
      let arr = ['10:30', '12:00', '17:00', '19:30']
      if (this.checkerValue > 0 && this.weekend === 0) { // 周日下午
        a = this.currentChangeDate + ' ' + arr[1]
        b = this.currentChangeDate + ' ' + arr[2]
      } else if (this.checkerValue > 0 && this.weekend > 0) { // 平时下午
        a = this.currentChangeDate + ' ' + arr[1]
        b = this.currentChangeDate + ' ' + arr[3]
      } else { // 平时上午
        a = this.currentChangeDate + ' ' + arr[0]
        b = this.currentChangeDate + ' ' + arr[1]
      }
      this.shipperStartTime = a
      this.shipperEndTime = b
    }
  },
  watch: {
    // 监听上午下午选择变化
    checkerValue () {
      this.calcDate()
    },
    currentChangeDate () {
      this.calcDate()
    }
  },
  components: {
    Group,
    Cell,
    Popup,
    InlineCalendar,
    Checker,
    CheckerItem
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .checker-item {
    border: 1px solid #d9d9d9;
    padding: 0.13rem 0.8rem;
    margin-right: 0.2rem;
    background: #fff;
  }
  .checker-item-selected {
    border: 1px solid @primary;
  }
  .swtich-enter,
  .swtich-leave-to {
    max-height: 0;
  }
  .swtich-enter-active,
  .swtich-leave-active {
    transition: all 0.3s;
  }
  .swtich-enter-to,
  .swtich-leave {
    max-height: 9999px;
  }
  .mainland {
    overflow: scroll;
    margin-bottom: 1.2rem;
    .icon-check {
      color: @primary;
    }
    .thead {
      display: flex;
      font-size: 0.28rem;
      align-items: center;
      height: 1rem;
      padding: 0 0.2rem;
      justify-content: space-between;
      .th {
        &:nth-child(2) {
        }
      }
    }
    .tbody {
      .tr {
        display: flex;
        font-size: 0.28rem;
        align-items: center;
        padding: 0.2rem 0;
        &:nth-child(2n + 1) {
          background-color: #f2f2f2;
        }
        .td {
          text-align: center;
          &:nth-child(1) {
            width: 50%;
          }
          &:nth-child(2) {
            width: 50%;
          }
        }
      }
    }
    .agree {
      color: #666;
      display: flex;
      font-size: 0.24rem;
      align-items: center;
      margin-top: 0.16rem;
    }
    .calendar-wrapper {
      width: 100%;
      margin: 0.16rem auto;
      background: #f2f2f2;
      .calender {
      }
      .timeCell {
        display: flex;
        margin: 0.2rem;
        font-size: 0.28rem;
        align-items: center;
        span {
          border: 1px solid #c7c7c7;
          margin: 0.16rem;
          padding: 0.12rem 0.6rem;
        }
      }
      .remark {
        margin: 0.2rem;
        font-size: 0.28rem;
        line-height: 0.4rem;
        color: #bbb;
      }
    }
  }
</style>
<style lang="less">
  .calendar-header > div {
    display: flex;
    justify-content: center;
    padding: 0.1rem 0;
  }
  .inline-calendar a {
    font-size: 0.32rem;
  }
  .inline-calendar th {
    font-size: 0.28rem;
  }
  .inline-calendar td {
    padding: 0.06rem 0 !important;
    font-size: 0.28rem !important;
  }
</style>
