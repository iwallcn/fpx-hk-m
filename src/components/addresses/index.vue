<template>
  <div class="myAddress">
    <!-- <tab v-model="currentType"
      :line-width=2
      :scroll-threshold=5>
      <tab-item v-for="(tab, index) in links"
        @on-item-click="onItemClick"
        :key="index"
        :disabled="($route.query.packageAttribute == 1 && index != 0) || ($route.query.packageAttribute == 4 && index != 1) || ($route.query.orderType == 'GROUP_PURCHASE' && index != 1)">
        {{tab.label}}
      </tab-item>
    </tab> -->

    <tab v-model="currentType"
      :line-width=2
      :scroll-threshold=5>
      <tab-item v-for="(tab, index) in links"
        @on-item-click="onItemClick"
        :key="index"
        :disabled="calcDisabled(index)">
        {{tab.label}}
      </tab-item>
    </tab>

    <!-- 派送地址 -->
    <template v-if="currentType===0">
      <send-address @choose="onChoose"></send-address>
    </template>

    <!-- 自提点地址 -->
    <template v-if="currentType===1">
      <point-address @choose="onChoose"></point-address>
    </template>

    <!-- 智能柜地址 -->
    <template v-if="currentType===2">
      <cabinet-address @choose="onChoose"></cabinet-address>
    </template>

    <!-- <footer v-if="$route.name === 'address'"
      class="footer-fixed">
      <button class="btn-ml"
        @click="handlerEdit('', 'add')">新增地址</button>
    </footer> -->
  </div>
</template>

<script>
import { Tab, TabItem } from 'vux'
import Scroll from '@/common/scroll/scroll'
import { mapMutations } from 'vuex'
import pointAddress from './pointAddress'
import cabinetAddress from './cabinetAddress'
import sendAddress from './sendAddress'

export default {
  name: 'myAddress',
  data () {
    return {
      currentType: this.$store.state.addressTabIndex,
      links: [
        {
          label: '常用派送地址',
          link: 0
        },
        {
          label: '常用自提點',
          link: 1
        },
        {
          label: '常用智能櫃',
          link: 2
        }
      ],
      deleteConfirm: false,
      currentId: '',
      items: []
    }
  },
  created () {
    console.log(543222)
    // 一票多件只能选择派送地址
    if (Number(this.$route.query.packageAttribute) === 1) {
      this.currentType = 0
      this.SET_ADDRESSTABINDEX(0)
    }
    // 团购商城带过来的标识，只能选自提点
    if (this.$route.query.orderType === 'GROUP_PURCHASE' || Number(this.$route.query.packageAttribute) === 4) {
      this.currentType = 1
      this.SET_ADDRESSTABINDEX(1)
    }
    let pickUpIsUse = this.$route.query.pickUpIsUse // 自提点是否可用
    let lockerIsUse = this.$route.query.lockerIsUse // 自提柜是否可用
    if (pickUpIsUse !== undefined || lockerIsUse !== undefined) {
      if ((Number(localStorage.getItem('addressTabIndex')) === 1 && !pickUpIsUse) || (Number(localStorage.getItem('addressTabIndex')) === 2 && !lockerIsUse)) {
        this.currentType = 0
        this.SET_ADDRESSTABINDEX(0)
      }
    }
  },
  computed: {
    calcDisabled () {
      let that = this
      return function (index) {
        let packageAttribute = Number(this.$route.query.packageAttribute)
        let orderType = this.$route.query.orderType // 订单类型：比如团购单是GROUP_PURCHASE
        let pickUpIsUse = this.$route.query.pickUpIsUse // 自提点是否可用
        let lockerIsUse = this.$route.query.lockerIsUse // 自提柜是否可用
        /**
         * 一票多件只能选择派送地址 (packageAttribute === 1 && index !== 0)
         * 团购商城带过来的标识，只能选自提点 (packageAttribute === 4 && index !== 1) || (orderType === 'GROUP_PURCHASE' && index !== 1)
         * pickUpIsUse = false,  自提点不可用 (!pickUpIsUse && index === 1)
         * lockerIsUse = false,  自提柜不可用 (!lockerIsUse && index === 2)
         */
        if (pickUpIsUse !== undefined || lockerIsUse !== undefined) { // 表示有传这2个参数
          if (!pickUpIsUse && !lockerIsUse) {
            that.currentType = 0
            that.SET_ADDRESSTABINDEX(0)
          }
          console.log((!pickUpIsUse && index === 1), (!lockerIsUse && index === 2), pickUpIsUse, lockerIsUse)
          return (packageAttribute === 1 && index !== 0) || (packageAttribute === 4 && index !== 1) || (orderType === 'GROUP_PURCHASE' && index !== 1) || ((!pickUpIsUse || pickUpIsUse === 'false') && index === 1) || ((!lockerIsUse || lockerIsUse === 'false') && index === 2)
        } else {
          return (packageAttribute === 1 && index !== 0) || (packageAttribute === 4 && index !== 1) || (orderType === 'GROUP_PURCHASE' && index !== 1)
        }
      }
    }
  },
  methods: {
    // tab切换
    onItemClick (index) {
      this.SET_ADDRESSTABINDEX(index)
    },
    // 地址选择
    onChoose (item) {
      // 如果是一票多件，则只能选择派送地址
      // if (Number(this.$route.query.packageAttribute) === 1 && (this.currentType === 1 || this.currentType === 2)) {
      //   this.$vux.toast.text('該類型的包裹僅支持派送')
      //   return
      // }
      item._checked = true
      this.SET_ORDER_ADDRESS(item)
      this.backOrder()
    },
    backOrder () {
      let obd = this.$store.state.orderBaseData
      let fpxOrderId = obd.fpxOrderId
      if (obd.orderType === 0) {
        // 新增预报
        this.$router.push({ name: 'shipments' })
      } else if (obd.orderType === 1) {
        // 修改
        this.$router.push({ name: 'editOrder', query: { fpxOrderId: fpxOrderId } })
      } else if (obd.orderType === 2) {
        // 认领
        this.$router.push({ name: 'receiveclaim', query: { fpxOrderId: fpxOrderId, packageAttribute: this.$route.query.packageAttribute } })
      } else if (obd.orderType === 3) {
        // 合箱
        this.$router.push({ name: 'merge' })
      } else if (obd.orderType === 4) {
        // 合箱轉單票
        this.$router.push({ name: 'mergeToSingle', query: { fpxOrderId: fpxOrderId, packageAttribute: this.$route.query.packageAttribute } })
      } else if (obd.orderType === 5) {
        // 用戶自助修改
        this.$router.push({ name: 'selfOrder', query: { fpxOrderId: fpxOrderId, operateType: obd.operateType } })
      } else {
        // 默认新增预报
        this.$router.push({ name: 'order' })
      }
    },
    ...mapMutations(['SET_ADDRESSTABINDEX', 'SET_ORDER_ADDRESS'])
  },
  components: {
    Tab,
    TabItem,
    Scroll,
    pointAddress,
    cabinetAddress,
    sendAddress
  }
}
</script>

<style lang="less">
  @import "../../assets/less/variable.less";
  .myAddress {
    position: absolute;
    width: 100%;
    top: 0px;
    bottom: 0;
    overflow: hidden;
    .pb-2 {
      // padding-bottom: 104px;
      padding-bottom: 2rem;
    }
    .hold {
      font-size: 0.24rem;
      color: #999;
      text-align: center;
    }
    .scroll {
      height: 100%;
      overflow: hidden;
    }
    .nodata {
      text-align: center;
      padding: 0.5rem;
      color: #999;
      background: #fff;
      // position: absolute;
      // top: 1rem;
      // left: 2.5rem;
      i {
        font-size: 0.8rem;
        transform: rotate(30deg);
        display: block;
      }
      p {
        font-size: 0.24rem;
        padding-top: 0.2rem;
      }
    }
    .hold {
      height: 20px;
    }
    .item {
      font-size: 0.28rem;
      background: #fff;
      padding: 0.2rem;
      display: flex;
      margin-bottom: 0.2rem;
      &.offline {
        background: #eee;
      }
      .check-box {
        width: 7%;
        padding: 0.3rem 0.1rem 0.3rem 0;
        .iconfont {
          font-size: 0.4rem;
          color: @primary;
        }
      }
      .infos {
        padding-right: 1%;
        width: 57%;
        &.normal {
          width: 64%;
        }
        .rows {
          display: flex;
          padding: 0.14rem 0;
          .col {
            margin-right: 0.2rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            max-width: 2rem;
          }
          .col2 {
            color: #999;
            max-width: 3rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        p {
          color: #999;
          line-height: 0.32rem;
          font-size: 0.26rem;
        }
      }
      .btns {
        display: flex;
        align-items: center;
        width: 36%;
        i {
          font-size: 0.54rem;
          color: #666;
          padding: 0.13rem 0.1rem;
          cursor: pointer;
        }
        .icon-delete {
          color: @error;
        }
        .icon-edit {
          color: @primary;
        }
        .weui-cell {
          padding: 0 !important;
          font-size: 0 !important;
        }
      }
      .default {
        background: #ff6400;
        font-size: 0.24rem;
        padding: 0.16rem 0.24rem;
        color: #fff;
        border-radius: 24px;
        display: inline-block;
      }
    }
  }
</style>
