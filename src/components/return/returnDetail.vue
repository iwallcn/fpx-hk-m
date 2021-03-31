<!--  -->
<template>
  <div class='return-wrapper'>
    <div class="group">
      <h3>退件單詳情</h3>
      <div class="row"><span>退件碼：{{returnData.packageDTO.shipperCode}}</span></div>
      <div class="row"><span>退件包裹單號：{{returnData.packageDTO.fpxOrderId}}</span></div>
      <div class="row"><span>攬收門店：{{returnData.pickUpDetailDTO.pickupName}}</span></div>
      <div class="row"><span>退件狀態：{{returnData.packageStatusDTO.packageStatusName}}</span></div>
      <div class="row"><span>退件費：<b class="color">{{returnData.packageDTO.totalPrice}} {{returnData.packageDTO.currency}}</b></span><span>支付狀態：{{returnData.packageDTO.freightPayFlag | filterfreightPayFlag}}</span></div>
      <div class="code"
        v-if="returnData.packageDTO.twoDimensionalCode">
        <img :src="'data:image/png;base64,'+ returnData.packageDTO.twoDimensionalCode">
        <h4>{{returnData.packageDTO.shipperCode}}</h4>
      </div>
    </div>

    <div class="group">
      <h3>商品信息<span>原包裹號：{{returnData.packageDTO.referenceNo}}</span></h3>
      <div class="info few">
        <div class="small"></div>
        <div class="table">
          <div class="thead">
            <div class="th">商品名稱</div>
            <div class="th">品類</div>
            <div class="th">申報單價</div>
            <div class="th">原數量</div>
            <div class="th">退件数</div>
          </div>
          <div class="tr"
            v-for="(item, index) in returnData.packageGoodsDTOList"
            :key="index">
            <div class="td">{{item.goodsName}}</div>
            <div class="td">{{item.categoryName}}</div>
            <div class="td">{{item.price}}{{item.priceCurrency}}</div>
            <div class="td">{{item.originalNumber }}</div>
            <div class="td">{{item.number}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="group">
      <h3 class="group-operate">攬收門店</h3>
      <div class="noinfo"
        v-if="!Object.keys(returnData.pickUpDetailDTO).length">
        請選擇退件攬收門店<br />
        申請退件後即可前往所選門店或其他就近門店完成退件攬收。<br />
        注：僅部分門店/自提點支持本業務<br />
      </div>
      <div class="info"
        v-else>
        <div class="info-row">
          <span class="name">{{returnData.pickUpDetailDTO.pickupName}}</span>
          <span class="tel">{{returnData.pickUpDetailDTO.servicesPhone}}</span>
        </div>
        <div class="info-row">
          地址：{{returnData.pickUpDetailDTO.country}}{{returnData.pickUpDetailDTO.province}}{{returnData.pickUpDetailDTO.city}}{{returnData.pickUpDetailDTO.district}}{{returnData.pickUpDetailDTO.address}}
        </div>
        <div class="info-row">
          營業時間：{{returnData.pickUpDetailDTO.openingTime}}
        </div>
      </div>
    </div>

    <div class="group">
      <h3 class="group-operate">退件地址</h3>
      <div class="noinfo"
        v-if="!Object.keys(returnData.packageAddressDTO).length">
        請選擇退件地址
      </div>
      <div class="info"
        v-else>
        <div class="info-row">
          <span class="name">{{returnData.packageAddressDTO.userName}}</span>
          <span class="tel">{{returnData.packageAddressDTO.areaCode}} {{returnData.packageAddressDTO.mobile}}</span>
        </div>
        <div class="info-row">
          地址：{{returnData.packageAddressDTO.country}}{{returnData.packageAddressDTO.province}}{{returnData.packageAddressDTO.city}}{{returnData.packageAddressDTO.district}}{{returnData.packageAddressDTO.detailAddress || returnData.packageAddressDTO.address}}
        </div>
      </div>
    </div>

    <div class="submit-bar">
      <flexbox align="center"
        :gutter="0"
        class="agreement-box">
        <flexbox-item :span="returnData.packageDTO.freightPayFlag == 30 ? 6/8 : 4/8"
          class="total">
          預計費用：<span>{{returnData.packageDTO.totalPrice}} {{returnData.packageDTO.currency}}</span>
        </flexbox-item>
        <flexbox-item :span="2/8"
          v-if="returnData.packageStatusDTO.packageStatusCode < 50">
          <button :class="['cancel', operateStatus ? 'disabled': '']"
            :disabled="operateStatus ? true: false"
            @click="handleCancel"><span v-html="operateStatus ? '取消中': '取消訂單'"></span></button>
        </flexbox-item>
        <flexbox-item :span="2/8"
          v-if="returnData.packageDTO.freightPayFlag != 30">
          <button @click="handlePay">去支付</button>
        </flexbox-item>
      </flexbox>
    </div>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, Confirm } from 'vux'
import { getPackagePrealertDetail, cancelOrder } from '@/api/return'
export default {
  components: { Flexbox, FlexboxItem, Confirm },
  data () {
    return {
      pickupAddressCheck: {}, // 选中的门店
      returnAddressCheck: {}, // 选中的退件地址
      isAgree: false,
      returnData: {
        packageDTO: '', // 包裹信息
        packageAddressDTO: '', // 退件地址
        packageGoodsDTOList: '', // 原包裹列表
        packageReturnGoodsDTOList: '', // 已选择的退件包裹列表
        payInfoDTO: '', // 支付信息
        orderCostDetailDTOList: '', // 费用详情
        pickUpDetailDTO: '', // 门店信息
        packageStatusDTO: '' // 包裹状态
      }, // 退件详情信息
      fpxOrderId: ''
    }
  },
  created () {
    this.fpxOrderId = this.$route.query.fpxOrderId
    this.operateStatus = Number(this.$route.query.operateStatus)
    // this.pickupAddressCheck = this.$store.state.returnPickupAddress
    // this.returnAddressCheck = this.$store.state.returnAddress
    // 退件详情
    this.getData()
  },
  methods: {
    getData () {
      getPackagePrealertDetail(this.fpxOrderId).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.returnData = res.data
          this.returnData.packageGoodsDTOList = res.data.packageGoodsDTOList.filter(val => val.number)
        }
      })
    },
    // 取消訂單
    handleCancel () {
      cancelOrder(this.fpxOrderId).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.$vux.toast.text(res.message || '取消訂單成功')
          this.$router.push({ name: 'returns' })
        } else {
          this.$vux.toast.text(res.message || '取消訂單失敗')
        }
      })
    },
    // 去支付
    handlePay () {
      // this.$router.push({ name: 'returnPay', query: { fpxOrderId: this.$route.query.fpxOrderId } })
      this.$router.push({ name: 'payment', query: { fpxOrderId: this.$route.query.fpxOrderId, type: 'returns' } })
    }
  },
  filters: {
    filterfreightPayFlag (val) {
      let obj = { 10: '待计费', 20: '待支付', 30: '已支付' }
      return obj[val]
    }
  }
}
</script>
<style lang='less' scoped>
  @import "../../assets/less/variable.less";
  .return-wrapper {
    font-size: 0.28rem;
    margin-bottom: 1.6rem;
    .group {
      margin: 0.4rem 0 0.5rem 0;
      .row {
        padding: 0.26rem 0.34rem;
        display: flex;
        justify-content: space-between;
        span {
          color: #666;
          .color {
            color: @primary;
          }
        }
        &:nth-child(odd) {
          background: #f5f5f5;
        }
        &:nth-child(even) {
          background: #fff;
        }
      }
      .code {
        text-align: center;
        min-height: 3rem;
        padding: 0.2rem 0;
        background: #fff;
        img {
          max-width: 100%;
          width: 60%;
        }
        h4 {
          color: @primary;
          font-weight: bold;
          font-size: 0.32rem;
          margin-top: 0.16rem;
        }
      }
      .group-operate {
        margin: 0 0.2rem 0.2rem 0.2rem;
        position: relative;
        button {
          border: none;
          background: none;
          color: @primary;
          cursor: pointer;
          font-size: 0.28rem;
          position: absolute;
          top: -0.16rem;
          right: 0;
          padding: 0.12rem 0;
        }
      }
      .noinfo {
        background: #dcdcdc;
        color: #666;
        padding: 0.3rem 0.34rem;
        line-height: 0.5rem;
        font-size: 0.26rem;
      }
      .info {
        background: #dcdcdc;
        color: #666;
        padding: 0.3rem 0.34rem;
        line-height: 0.36rem;
        font-size: 0.26rem;
        &.few {
          background: none;
          padding: 0;
        }
        .info-small {
          display: flex;
          align-items: center;
          margin: 0.12rem 0;
          span {
            color: #666;
            .color {
              color: @primary;
            }
          }
          .weui-cell {
            padding: 0 !important;
            background: #fff;
            margin-right: 10px;
          }
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          line-height: 0.36rem;
          margin: 0.12rem 0;
          span {
            &:first-child {
              color: #333;
            }
            &:last-child {
              color: @primary;
            }
          }
        }
      }
      h3 {
        font-size: 0.32rem;
        margin: 0 0.2rem 0.2rem 0.2rem;
        border-left: 3px solid @primary;
        padding-left: 0.1rem;
        span {
          font-size: 0.24rem;
          color: #666;
          padding: 0 0.16rem;
        }
      }
      .small {
        margin: 0.26rem 0;
        padding-left: 0.34rem;
        span {
          color: #666;
        }
      }
      .search {
        display: flex;
        margin: 0.2rem 0.18rem;
        background: #fff;
        input {
          flex: 1;
          padding: 0 0.16rem;
          border-radius: 0;
        }
        button {
          background-color: @primary;
          color: #fff;
          border: none;
          font-size: 0.3rem;
          padding: 0.2rem 0.4rem;
          height: 100%;
        }
      }
      .table {
        margin: 0.3rem 0;
        .thead {
          display: flex;
          background: #fff;
          color: #666;
          padding: 0.3rem 0;
          .th {
            flex: 1;
            text-align: center;
            &:nth-child(1) {
              flex: 2;
            }
          }
        }
        .tr {
          display: flex;
          align-items: center;
          color: #666;
          padding: 0.3rem 0.16rem;
          .td {
            flex: 1;
            text-align: center;
            line-height: 0.36rem;
            &:nth-child(1) {
              flex: 2;
            }
            &.on {
              color: @primary;
            }
          }
          &:nth-child(even) {
            background: #f5f5f5;
          }
          &:nth-child(odd) {
            background: #fff;
          }
        }
      }
    }
    .submit-bar {
      width: 100%;
      height: 1rem;
      position: fixed;
      left: 0;
      bottom: 0;
      right: 0;
      margin: 0 auto;
      &::before {
        content: " ";
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 1px;
        border-top: 1px solid #d9d9d9;
        color: #d9d9d9;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
      .agreement-box {
        width: 100%;
        height: 100%;
        background: #fff;
        float: left;
        font-size: 0.22rem;
        overflow: hidden;
        margin-left: 0;
        &-link {
          color: #6699ff;
          display: block;
          padding-top: 4px;
          text-indent: -4px;
        }
        .total {
          display: block;
          font-size: 0.28rem;
          text-align: left;
          text-indent: 0.34rem;
          span {
            font-size: 0.32rem;
            color: @primary;
            font-weight: bold;
          }
        }
        button {
          height: 100%;
          font-size: 0.3rem;
          color: #fff;
          background: #ff6400;
          text-align: center;
          line-height: 1rem;
          width: 100%;
          border: none;
          &.cancel {
            background: #000;
          }
        }
      }
      .btn-box {
        width: 28%;
        height: 100%;
        font-size: 0.3rem;
        color: #fff;
        background: @primary;
        float: left;
        text-align: center;
        line-height: 1rem;
        opacity: 0.5;
        &.active {
          background: @primary;
          opacity: 1;
        }
      }
    }
  }
  .dialog {
    p {
      font-size: 0.28rem;
      color: #666;
      text-align: left;
      margin: 0.1rem 0;
      span {
        color: @primary;
      }
      input {
        border: 1px solid #d5d5d6;
        padding: 0.1rem;
      }
    }
  }
</style>
<style lang="less">
  .vux-number-selector-plus {
    margin-right: 0 !important;
  }
  .vux-number-input {
    font-size: 16px !important;
  }
</style>
