<template>
  <div class="mainland">
    <group class="first-cell">
      <cell title="预约包裹"
        is-link
        :value="pageCount"
        @click.native="boxShow = !boxShow"
        value-align="right"></cell>
      <!-- <transition name="swtich"> -->
      <div class="tbody"
        v-show="boxShow">
        <div class="tr">
          <div class="td infos">订单号</div>
          <div class="td">订单重量 </div>
          <div class="td">订单金额</div>
        </div>
        <div class="tr"
          v-for="(val, index) in item.orderShipperPackageInfoDTOS"
          :key="index">
          <div class="td infos">{{val.fpxOrderId}}</div>
          <div class="td">{{GLOBAL.fixedTwo(val.chargeableWeight)}}{{val.weightUnit}}</div>
          <div class="td">{{GLOBAL.fixedTwo(val.freightPay)}}{{val.currency}}</div>
        </div>
      </div>
      <!-- </transition> -->
      <cell title="提貨人"
        :value="calcConsignee"
        value-align="right"></cell>
      <cell title="自提點"
        is-link
        :value="item.pickUpName"
        value-align="right"
        @click.native="handlerPickupDetail(item.pickUpCode)">
      </cell>
      <cell title="预约提貨时间"
        :value="calcAppointTime(item.shipperEndTime)"
        value-align="right"></cell>
    </group>
    <div class="code-wrapper">
      <p>預約碼</p>
      <h4>{{item.shipperCode}}</h4>
      <div class="code">
        <img :src="calcCode">
      </div>
    </div>

    <!--自提点查看详情-->
    <div v-transfer-dom>
      <popup v-model="popupShow"
        class="popupDetail">
        <group label-width="1.4rem">
          <cell title="电话"
            value-align="left"
            :value="pickup.servicesPhone"></cell>
          <cell title="地址"
            :value="calAddress"></cell>
          <cell title="工作日"
            :value="pickup.openingTime"></cell>
          <div v-html="pickup.note"
            class="note"></div>
        </group>
      </popup>
    </div>
  </div>
</template>

<script>
import { Group, Cell, PopupPicker, Popup, XInput } from 'vux'
import { formatDate } from '@/utils/common'
import { getAppointmentDetail, pickUpDetail } from '@/api/appointment'
export default {
  name: 'appointDetail',
  data () {
    return {
      item: {},
      boxShow: false,
      pageCount: 0,
      popupShow: false,
      pickup: {},
      calAddress: ''
    }
  },
  created () {
    this.getDetail()
  },
  computed: {
    // 提货人+电话
    calcConsignee () {
      return this.item.userName + ' ' + this.item.phone
    },
    calcCode () {
      return `data:image/jpeg;base64,${this.item.twoDimensionalCode}`
    }
  },
  methods: {
    // 计算预约提货时间
    calcAppointTime (end) {
      return formatDate(end)
    },
    // 获取预约详情
    getDetail () {
      let appointId = this.$route.params.appointId
      // let appointId = "666666"
      getAppointmentDetail(appointId).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.item = res.data
          this.pageCount = this.item.orderShipperPackageInfoDTOS.length
        } else {
          this.$vux.toast.text(res.message)
        }
      })
    },
    // 获取自提点详情
    handlerPickupDetail (code) {
      this.popupShow = !this.popupShow
      pickUpDetail(code).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.pickup = res.data
          this.calAddress = this.pickup.country + this.pickup.city + this.pickup.address
        }
      })
    }
  },
  components: {
    Group,
    Cell,
    PopupPicker,
    Popup,
    XInput
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .swtich-enter,
  .swtich-leave-to {
    opacity: 0;
  }
  .swtich-enter-active,
  .swtich-leave-active {
    transition: all 0.3s ease;
  }
  .swtich-enter-to,
  .swtich-leave {
    opacity: 1;
  }
  .mainland {
    overflow: scroll;
    margin-bottom: 1.2rem;
    background-color: #fff;
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
            width: 40%;
          }
          &:nth-child(2) {
            width: 30%;
          }
          &:nth-child(3) {
            width: 30%;
          }
          &.infos {
            p {
              margin-bottom: 0.1rem;
            }
            span {
              font-size: 0.24rem;
            }
          }
        }
      }
    }
    .code-wrapper {
      font-size: 0.32rem;
      text-align: center;
      margin-top: 0.4rem;
      .p {
      }
      h4 {
        padding-top: 0.3rem;
        font-size: 0.5rem;
        color: @primary;
      }
      .code {
        width: 50%;
        margin: 0 auto;
        img {
          max-width: 100%;
        }
      }
    }
  }
</style>
<style lang="less">
  .popupDetail {
    .weui-cells {
      margin-top: 0 !important;
      .weui-cell {
        font-size: 0.28rem !important;
        .weui-cell__ft {
          text-align: left !important;
        }
      }
    }
    .note {
      padding: 0.2rem 0.3rem !important;
      font-size: 0.28rem;
      color: #999;
    }
  }
</style>
