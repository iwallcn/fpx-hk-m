<!--  -->
<template>
  <div class='return-wrapper'>
    <div class="group">
      <h3>商品信息<span>每個商品僅能申請退件1次</span></h3>
      <div class="noinfo"
        v-if="!packageGoodsDTOList.length">
        請先査詢您需要退件的包裹信息
      </div>
      <div class="info few"
        v-else>
        <div class="small"><span>包裹號：</span>{{returnPackageData.fpxOrderId}}</div>
        <div class="table">
          <div class="thead">
            <div class="th">商品名稱</div>
            <div class="th">品類</div>
            <div class="th">申報單價</div>
            <div class="th">數量</div>
            <div class="th">操作</div>
          </div>
          <div class="tr"
            v-for="(item, index) in packageGoodsDTOList"
            :key="index">
            <div class="td">{{item.goodsName}}</div>
            <div class="td">{{item.categoryName}}</div>
            <div class="td">{{item.price}}</div>
            <div class="td">{{item.originalNumber}}</div>
            <!-- 曾经退过货returnNumber>0，或者是衣服类canReturn=false，则不能再次申请退件 -->
            <div v-if="item.returnNumber || !item.canReturn"
              class="td">
              <!-- <popover placement="top">
                <div slot="content"
                  class="popover-tips">
                  已經申請過退件或者非衣服類的不能再次申請
                </div>
                <a class="">不可退件<i class="iconfont icon-tips"></i></a>
              </popover> -->
              申請退件
            </div>
            <div v-else
              class="td on"
              @click="handleReturnApply(item)">申請退件
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="group">
      <h3>退件商品<span>每次可申請一種商品，如需退多種請另開單申請</span></h3>
      <div class="noinfo"
        v-if="!returnPackageData.packagePrealertGoodsVOS">
        請選擇需退件的商品
      </div>
      <div class="info"
        v-else>
        <div class="info-small"><span>退件商品：</span>{{returnPackageData.packagePrealertGoodsVOS.goodsName}} </div>
        <div class="info-small">
          <span>退件數量：</span>
          <x-number :min="0"
            :max="maxNumber"
            v-model="returnPackageData.packagePrealertGoodsVOS.number"
            @on-change="handleNumberChange"></x-number>
          <span>预计费用：<span class="color">{{expectCost}} HKD</span></span>
        </div>
      </div>
    </div>

    <div class="group">
      <h3 class="group-operate">攬收門店 <button @click="handleSelectPickup">+ 選擇攬收門店</button></h3>
      <div class="noinfo"
        v-if="!Object.keys(pickupAddressCheck).length">
        請選擇退件攬收門店<br />
        申請退件後即可前往所選門店或其他就近門店完成退件攬收。<br />
        注：僅部分門店/自提點支持本業務<br />
      </div>
      <div class="info"
        v-else>
        <div class="info-row">
          <span class="name">{{pickupAddressCheck.pickupName}}</span>
          <span class="tel">{{pickupAddressCheck.servicesPhone}}</span>
        </div>
        <div class="info-row">
          地址：{{pickupAddressCheck.country}}{{pickupAddressCheck.province}}{{pickupAddressCheck.city}}{{pickupAddressCheck.district}}{{pickupAddressCheck.address}}
        </div>
        <div class="info-row">
          營業時間：{{pickupAddressCheck.openingTime}}
        </div>
      </div>
    </div>

    <div class="group">
      <h3 class="group-operate">退件地址<button @click="handleReturnAddress">+ 選擇退件地址</button></h3>
      <div class="noinfo"
        v-if="!Object.keys(returnAddressCheck).length">
        請選擇退件地址
      </div>
      <div class="info"
        v-else>
        <div class="info-row">
          <span class="name">{{returnAddressCheck.firstName || returnAddressCheck.userName}}</span>
          <span class="tel">{{returnAddressCheck.areaCode}} {{returnAddressCheck.phone || returnAddressCheck.mobile}}</span>
        </div>
        <div class="info-row">
          地址：{{returnAddressCheck.country}}{{returnAddressCheck.province}}{{returnAddressCheck.city}}{{returnAddressCheck.district}}{{returnAddressCheck.detailAddress || returnAddressCheck.address}}
        </div>
      </div>
    </div>

    <!-- 提交 -->
    <div class="submit-bar">
      <flexbox justify="center"
        align="center"
        :gutter="0"
        class="agreement-box">
        <flexbox-item :span="1/8"
          @click.native="handleClickArgee"
          class="select-box">
          <i :class="['iconfont', isAgree ? 'icon-check': 'icon-nocheck']"></i>
        </flexbox-item>
        <flexbox-item :span="7/8"
          v-if="!$route.query.type">
          <span>我已閱讀並同意</span>
          <span class="agreement-box-link"
            @click="showProtocol">《遞四方退件協議》</span>
        </flexbox-item>
      </flexbox>
      <div :class="[isAgree ? 'active' : '', 'btn-box']"
        @click="handleSubmit">提交</div>
    </div>

  </div>
</template>

<script>
import { Cell, Group, XNumber, Flexbox, FlexboxItem, Confirm, Popover } from 'vux'
import { getPackagePrealertDetail, setUpdateReturnPackagePrealert } from '@/api/return'
import minxinCommon from './minxinCommon.js'
export default {
  components: { Cell, Group, XNumber, Flexbox, FlexboxItem, Confirm, Popover },
  data () {
    return {
      isAgree: false, // 退件協議
      checkObj: {
        areaCode: '852',
        phone: '286****89' // 手機號
      },
      phone: '',
      packageGoodsDTOList: [], // 商品信息
      maxNumber: '', // 选中申请退件最大值
      pickupAddressCheck: {}, // 选中的门店
      returnAddressCheck: {}, // 选中的退件地址
      fpxOrderId: '',
      returnPackageData: { // 新增退件商品信息
        referenceNo: '', // 原包裹号
        pudoCode: '', // 自提点code
        packagePrealertAddressId: '', // 地址id
        packagePrealertGoodsVOS: '' // 选中申请退件的商品，只可能是单个
      },
      expectCost: '' // 預算費用
    }
  },
  created () {
    console.log('created')
    // 刷新页面之后，清空掉缓存中的退件地址
    this.SET_RETURN_ADDRESS({})
    this.fpxOrderId = this.$route.query.fpxOrderId
    this.getReturnPackageDetail() // 获取包裹详情
  },
  activated () {
    console.log('activated')
    this.getUpdateData() // 更新数据设置揽收门店和退件地址
  },
  beforeRouteEnter (to, form, next) { // 因为当钩子执行前，组件实例还没被创建
    if (form.name === 'returns') { // 如果是从我的退件列表过来，则不缓存该页面,重新获取数据
      to.meta.keepAlive = false
    } else {
      to.meta.keepAlive = true
    }
    next()
  },
  mixins: [minxinCommon],
  methods: {
    // 获取包裹详情
    getReturnPackageDetail () {
      getPackagePrealertDetail(this.fpxOrderId).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.pickupAddressCheck = res.data.pickUpDetailDTO
          this.returnAddressCheck = res.data.packageAddressDTO
          this.SET_RETURN_PICKUPADDRESS(this.pickupAddressCheck) // 设置门店地址
          this.SET_RETURN_ADDRESS(this.returnAddressCheck) // 设置退件地址
          this.packageGoodsDTOList = res.data.packageGoodsDTOList
          this.returnPackageData.referenceNo = res.data.packageDTO.referenceNo
          this.returnPackageData.pudoCode = res.data.pickUpDetailDTO.pickupCode
          this.returnPackageData.packagePrealertAddressId = res.data.packageAddressDTO.userAddressId.toString()
          this.returnPackageData.referOrderId = res.data.packageDTO.referOrderId
          this.returnPackageData.fpxOrderId = res.data.packageDTO.fpxOrderId
          this.returnPackageData.shipperCode = res.data.packageDTO.shipperCode
          for (let v of res.data.packageGoodsDTOList) {
            if (v.number) {
              this.returnPackageData.packagePrealertGoodsVOS = v
              this.maxNumber = v.originalNumber
              // console.log(v, this.returnPackageData.packagePrealertGoodsVOS, this.maxNumber)
            }
          }
          // 調用運費試算
          this.getRetrunMoney()
        }
      })
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
    // 提交
    handleSubmit () {
      if (!this.isAgree) {
        return
      }
      let { ...data } = this.returnPackageData
      data.packagePrealertGoodsVOS.sourceGoodsNo = data.packagePrealertGoodsVOS.goodsNo
      data.packagePrealertGoodsVOS = [data.packagePrealertGoodsVOS]
      setUpdateReturnPackagePrealert(data).then(res => {
        this.$vux.toast.text(res.message)
        if (res.code === this.GLOBAL.code) {
          this.$router.push({ name: 'returnDetail', query: { fpxOrderId: res.data } })
        }
      })
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
            color: #333;
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
            &:nth-child(4) {
              flex: 0.7;
            }
            &:nth-child(5) {
              flex: 1.3;
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
            &:nth-child(4) {
              flex: 0.7;
            }
            &:nth-child(5) {
              flex: 1.3;
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
    .select-box {
      text-align: center;
      color: @primary;
      .iconfont {
        font-size: 0.4rem;
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
        width: 72%;
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
        width: 3rem;
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
  .popover-tips {
    font-size: 0.24rem;
    padding: 0.16rem;
  }
</style>
