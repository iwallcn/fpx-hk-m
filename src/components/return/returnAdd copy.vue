<!--  -->
<template>
  <div class='return-wrapper'>
    <div class="group"
      v-if="flag==='add'">
      <h3>包裹查詢</h3>
      <div class="search">
        <input type="text"
          placeholder="請輸入商家物流號/4PX運單號/淘寶物流號"
          v-model="searchCode">
        <button @click="handleSearch">查詢</button>
      </div>
    </div>

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

    <!-- 包裹查询先验证 -->
    <div v-transfer-dom>
      <confirm v-model="dialogCheckTel"
        title=""
        class="dialog"
        cancel-text="取消"
        confirm-text="提交"
        :close-on-confirm="false"
        @on-cancel="handleCancel"
        @on-confirm="handleCheck">
        <p>系統檢測到物流單號[ <span>{{searchCode}}</span> ]的包裹非本帳號/收件人包裹。</p>
        <p>如需申請退件，請驗證該包裹收件人手機號</p>
        <p>收件人手機號：<span>{{checkObj.phone}}</span></p>
        <p>
          驗證手機：
          <input type="text"
            placeholder="輸入手機號（不含區號）"
            v-model="phone">
        </p>
      </confirm>
    </div>

    <!-- 包裹查询不到 -->
    <div v-transfer-dom>
      <confirm v-model="dialogNoSearch"
        title=""
        class="dialog"
        :show-cancel-button="false"
        confirm-text="試試其它包裹"
        @on-confirm="handleTry">
        <p>系统查询不到物流单号[ <span>{{searchCode}}</span> ]的包裹信息。可能原因如下：</p>
        <p>①此包裹非递四方承运；</p>
        <p>②此包裹非中国大陆寄出（目前仅支持退回中国大陆地区）；</p>
        <p>如以上情况均不附，请联系客服处理。</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { Cell, Group, XNumber, Flexbox, FlexboxItem, Confirm, Popover } from 'vux'
import { queryPgk, setReturnPackagePrealert, getPackagePrealertDetail, setUpdateReturnPackagePrealert, billingUtil } from '@/api/return'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: { Cell, Group, XNumber, Flexbox, FlexboxItem, Confirm, Popover },
  data () {
    return {
      flag: 'add', // 表示新增
      isAgree: false, // 退件協議
      searchCode: '', // 查询单号
      dialogCheckTel: false, // 包裹查询先验证
      dialogNoSearch: false, // 包裹查询不到
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
    // 刷新页面之后，清空掉缓存中的退件地址
    this.SET_RETURN_ADDRESS({})
  },
  activated () {
    if (this.$route.query.fpxOrderId === this.fpxOrderId) { // 表示多次进入，此时更新数据
      this.flag = 'edit'
      this.fpxOrderId = this.$route.query.fpxOrderId
      this.getUpdateData() // 更新数据
    } else if (this.$route.query.fpxOrderId && this.$route.query.fpxOrderId !== this.fpxOrderId) { // 表示第一次从我的退件点击编辑过来
      this.flag = 'edit'
      this.fpxOrderId = this.$route.query.fpxOrderId
      this.getReturnPackageDetail() // 获取包裹详情
    } else {
      this.flag = 'add'
      this.getUpdateData() // 更新数据
    }
  },
  methods: {
    ...mapGetters(['returnAddress']),
    ...mapMutations(['SET_RETURN_PICKUPADDRESS', 'SET_RETURN_ADDRESS']),
    // 更新数据
    getUpdateData () {
      this.pickupAddressCheck = this.$store.state.returnPickupAddress
      this.returnAddressCheck = this.returnAddress() // 从缓存中拿退件地址
      this.returnPackageData.pudoCode = this.pickupAddressCheck.pudoCode || this.pickupAddressCheck.pickupCode
      this.returnPackageData.packagePrealertAddressId = this.returnAddressCheck.id
    },
    query () {
      // 查询包裹
      queryPgk({ mobile: this.phone, packageNo: this.searchCode }).then(res => {
        if (res.code === this.GLOBAL.code) { // 返回的包裹信息
          this.dialogCheckTel = false
          this.packageGoodsDTOList = res.data.packageGoodsDTOList // 商品信息
          this.returnPackageData.fpxOrderId = res.data.packageDTO.fpxOrderId
          this.returnPackageData.referenceNo = res.data.packageDTO.fpxOrderId
        } else if (res.code === '2002') { // 需要校验手机号，弹出框
          this.dialogCheckTel = true
          this.checkObj.phone = res.data
        } else if (res.code === '2003') { // 校验手机号失败，弹出框，消息提示
          this.dialogCheckTel = true
          this.$vux.toast.text(res.message)
        } else if (res.code === '2004') { // 无权操作
          this.$vux.toast.text(res.message)
        } else { // 找不到单号，弹出框
          this.dialogNoSearch = true
        }
      })
    },
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
          this.returnPackageData.packagePrealertAddressId = res.data.packageAddressDTO.id.toString()
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
    // 查询
    handleSearch () {
      if (!this.searchCode.trim()) {
        this.$vux.toast.text('請輸入商家物流號/4PX運單號/淘寶物流號')
        return
      }
      this.query()
    },
    // 试试其他包裹
    handleTry () {
      this.dialogNoSearch = false
    },
    // 取消
    handleCancel () {
      this.dialogCheckTel = false
    },
    // 驗證手機
    handleCheck () {
      if (!this.phone.trim()) {
        this.$vux.toast.text('請輸入手機號')
        return
      }
      this.query()
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
    },
    // 選擇攬收門店
    handleSelectPickup () {
      this.$router.push({ name: 'returnPickup', query: { fpxOrderId: this.$route.query.fpxOrderId } })
    },
    // 選擇退件地址
    handleReturnAddress () {
      this.$router.push({ name: 'returnAddress', query: { fpxOrderId: this.$route.query.fpxOrderId } })
    },
    // 提交
    handleSubmit () {
      if (!this.isAgree) {
        return
      }
      let { ...data } = this.returnPackageData
      data.packagePrealertGoodsVOS = [data.packagePrealertGoodsVOS]
      if (this.flag === 'edit') { // 编辑
        setUpdateReturnPackagePrealert(data).then(res => {
          this.$vux.toast.text(res.message)
          if (res.code === this.GLOBAL.code) {
            this.$router.push({ name: 'returnDetail', query: { fpxOrderId: res.data } })
          }
        })
      } else { // 新增
        setReturnPackagePrealert(data).then(res => {
          this.$vux.toast.text(res.message)
          if (res.code === this.GLOBAL.code) {
            this.$router.push({ name: 'returnDetail', query: { fpxOrderId: res.data } })
          }
        })
      }
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
