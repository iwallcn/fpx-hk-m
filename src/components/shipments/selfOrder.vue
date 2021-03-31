<template>
  <div class="order">
    <group label-width="1.8rem"
      class="first-cell"
      label-margin-right="0.3rem"
      label-align="right">
      <cell title="4PX運單號"
        :value="orderData.fpxOrderId"
        value-align="left"></cell>
      <cell title="商家物流號"
        :value="orderData.referOrderId"
        value-align="left"></cell>
      <cell title="倉庫"
        :value="orderData.warehouseCode | filterWH"
        value-align="left"></cell>
      <!-- <cell title="申報時間"
          :value="orderData.fpxCreateTime"
          value-align="left"></cell> -->
    </group>
    <group label-width="1.8rem"
      label-margin-right="0.3rem"
      label-align="right">
      <cell title="商品詳情"
        value="查看商品列表"
        is-link
        value-align="left"
        @click.native="handlerProductDetail"></cell>
    </group>

    <group title="轉運方式">
      <div class="type-wrapper">
        <flexbox justify="left">
          <div v-show="$route.query.operateType == 'single'"
            @click="handleSelectType(0)"
            :class="['type-item', isMerge ? '' : 'actived']">單票轉運</div>
          <div @click="handleSelectType(1)"
            :class="['type-item', isMerge ? 'actived' : '']">合箱轉運</div>
        </flexbox>
      </div>
    </group>

    <!-- 地址 -->
    <group @click.native="handleAddress"
      v-if="!isMerge">
      <cell title="派送|自提地址"
        is-link></cell>
      <div class=""
        v-if="orderAddress.firstName || orderAddress.recipientsName">
        <div class="address-info"
          v-if="orderAddress.deliveryType">
          <p><span class="tag">自提</span>{{orderAddress.recipientsName}} {{orderAddress.phoneNumber}}</p>
          <p>{{orderAddress.pickupName}} {{orderAddress.pickUpAddress}}</p>
        </div>
        <div class="address-info"
          v-else>
          <p>{{orderAddress.firstName}} {{orderAddress.phone}}</p>
          <p>
            <span
            v-if="orderAddress.deliveryAddressType"
            style="font-size: 0.14rem;padding: 0.06rem 0.12rem;background-color: #ccdef8;color: #005adc;border-radius: 0.04rem;display: inline-block;margin-right: 0.15rem;margin-bottom: 0.1rem;"
           >{{orderAddress.deliveryAddressType == 1 ? '工商' : '住宅'}}</span>
            {{orderAddress.country}} {{orderAddress.province}} {{orderAddress.city}} {{orderAddress.detailAddress}}</p>
        </div>
      </div>

    </group>

    <!-- 物流服务 -->
    <group v-if="!isMerge">
      <cell title="物流服務"
        :value="orderData.productName"
        @click.native="handleProduct"
        is-link></cell>
    </group>

    <!-- 增值服务 -->
    <!-- 隐藏合箱、分箱、拍照增值服务 -->
    <group title="選擇增值服務"
      v-if="serviceList.length && !isMerge">
      <div class="service-wrapper">
        <div :class="['service-item', service.checked ? 'active' : '']"
          v-for="(service, serviceIndex) in serviceList"
          v-show="service._show"
          @click="handleSelectService(serviceIndex, serviceList)"
          :key="service.itemCode">
          {{service.itemName}}
        </div>
      </div>
      <div class="service-tip-wrapper">
        <div v-for="(item, index) in orderData.packageOrderAddserviceDTOList"
          :key="index">
          <p v-if="item.feeDesc"
            class="service-tip">{{item.itemName}}：{{item.feeDesc || ''}}</p>
        </div>
      </div>
    </group>

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
        <flexbox-item :span="7/8">
          <span>我已閱讀並同意</span>
          <span class="agreement-box-link"
            @click="showProtocol">《遞四方（香港）服務協議》</span>
        </flexbox-item>
      </flexbox>
      <div :class="[isAgree ? 'active' : '', 'btn-box']"
        @click="handleSubmit">提交</div>
    </div>

    <!-- 物流服务弹框 -->
    <div v-transfer-dom>
      <popup v-model="productShow"
        position="right"
        width="100%">
        <product @choose="handleSelectProduct"
          :productList="productList"
          @close="productShow = false"></product>
      </popup>
    </div>

    <!-- 暂无物流服务弹框 -->
    <div v-transfer-dom>
      <popup v-model="noLogistics"
        class="logisticPopup">
        <div class="header"><span>暫無物流服務可選</span><i class="iconfont icon-close"
            @click="noLogistics=false"></i></div>
        <div class="info">
          <p>請您根據以下原因重新核對包裹資訊：</p>
          <p>1.您選擇的產品屬於禁運品；</p>
          <p>2.合箱包裹不能選擇智能櫃；</p>
        </div>
      </popup>
    </div>

    <!-- 商品详情 -->
    <div v-transfer-dom
      class="detailWrapper">
      <popup v-model="productDetailPopup"
        position="bottom">
        <div>
          <card class="merge-card product"
            :header="{title: '子包裹'}">
            <div slot="content"
              class="merge-infos">
              <div class="thead">
                <div class="th vux-1px-r">品类</div>
                <div class="th vux-1px-r">名稱</div>
                <div class="th vux-1px-r">數量</div>
                <div class="th vux-1px-r">單價</div>
                <div class="th">總價</div>
              </div>
              <div class="tr"
                v-for="(item, index) in orderData.packagePrealertGoodsList"
                :key="index">
                <div class="td">{{item.categoryName}}</div>
                <div class="td">{{item.goodsName}}</div>
                <div class="td">{{item.number}}</div>
                <div class="td">{{item.price}} {{item.priceCurrency}}</div>
                <div class="td">{{item.number * item.price}} {{item.priceCurrency}}</div>
              </div>
            </div>
          </card>
          <div class="nodata"
            v-if="orderData.packagePrealertGoodsList.length == 0">暫無明細</div>
        </div>
        <div class="popup-btn">
          <button class="btn-white"
            @click="productDetailPopup=false">關閉</button>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import * as API from '@/api/warehouse'
import * as oAPI from '@/api/order'
import Agreement from '@/common/agreement'
import {
  Group,
  PopupPicker,
  XInput,
  Radio,
  CheckIcon,
  Flexbox,
  FlexboxItem,
  XDialog,
  Cell,
  Popup,
  XButton,
  Card,
  PopupHeader
} from 'vux'
import Address from '@/components/addresses'
import SendEdit from '@/components/addresses/sendEdit'
import PickupEdit from '@/components/addresses/pickupEdit'
import Product from './product'
import { getApiToken } from '@/api/token'
import { mapGetters, mapMutations } from 'vuex'
import { getWH } from '@/utils/cache'
export default {
  name: 'order',
  data () {
    return {
      orderType: 5, // 0预报 1修改 2认领 3合箱
      mergeMode: false, // 合箱预报
      isMerge: false, // 转运模式
      isAgree: true,
      currencyUnit: 'HKD',
      fpxOrderId: '', // 4px单号-api
      orderData: {
        operateType: '', // 操作类型。单票还是合箱-api
        packageOrderAddserviceDTOList: [], // 增值服务-api
        packagePrealertAddressId: '', // 地址id-api
        productCode: '', // 产品渠道-api
        departureCountry: '',
        destinationCountry: '',
        warehouseCode: '',
        pickUpWithRecipientsVO: {
          pickUpCode: '',
          recipientsName: '',
          phoneNumber: '',
          deliveryType: 0,
          recipientsId: ''
        },
        packagePrealertGoodsList: [], // 商品信息
        productName: '',
        referOrderId: ''
      },
      productList: [],
      serviceList: [],
      transferTypeShow: false,
      noLogistics: false, // 暂无物流服务
      productShow: false,
      addServiceShow: false,
      orderAddress: {},
      productDetailPopup: false
    }
  },
  created () {
    // 设置请求token
    this.getQequestToken()
    this.fpxOrderId = this.$route.query.fpxOrderId
    this.orderData.operateType = this.$route.query.operateType
    // 转运模式
    if (this.orderData.operateType === 'merge') {
      this.isMerge = true
    }
    if (this.$route.query.fpxOrderId || this.$route.name === 'editOrder') this.resetOrderData()
    this.setOrderBaseData()
    this.getData()
  },
  activated () {
    this.orderData.operateType = this.$route.query.operateType
    // 转运模式
    if (this.orderData.operateType === 'merge') {
      this.isMerge = true
    }
    // 设置请求token
    this.getQequestToken()
    if (this.$route.query.fpxOrderId === this.fpxOrderId) {
      this.getUpdateData()
    } else {
      this.fpxOrderId = this.$route.query.fpxOrderId
      this.resetOrderData()
      this.setOrderBaseData()
      this.getData()
    }
  },
  beforeRouteLeave (to, form, next) {
    console.log('beforeRouteLeave', to)
    if (to.name !== 'addresses') {
      this.fpxOrderId = ''
    }
    next()
  },
  methods: {
    // 查看商品详情
    handlerProductDetail () {
      this.productDetailPopup = true
    },
    showProtocol () {
      this.$router.push({ name: 'terms' })
    },
    // 从后台拿token
    getQequestToken () {
      getApiToken().then(res => {
        if (res.code === this.GLOBAL.code) {
          sessionStorage.setItem('token', res.data)
        }
      })
    },
    setOrderBaseData () {
      // 用戶自助下單
      let orderType = this.GLOBAL.getOrdertypeByRouter[this.$route.name]
      let data = {
        orderType,
        fpxOrderId: this.$route.query.fpxOrderId,
        operateType: this.$route.query.operateType
      }
      this.SET_ORDER_BASE_DATA(data)
    },
    getData () {
      let fpxOrderId = this.$route.query.fpxOrderId
      if (!fpxOrderId) return
      oAPI.getPackagePrealert(fpxOrderId).then(res => {
        if (res.code === this.GLOBAL.code) {
          // 货币单位
          this.currencyUnit = res.data.currency
          // 商品、物品
          this.orderData.packagePrealertGoodsList = res.data.packagePrealertGoodsList || []
          this.orderData.warehouseCode = res.data.warehouseCode
          res.data.packagePrealertAddress = res.data.packagePrealertAddress || {}
          if (res.data.packagePrealertAddress.deliveryType === 0) {
            // 派送
            res.data.packagePrealertAddressId = res.data.packagePrealertAddress.userAddressId
            let data = {
              deliveryType: res.data.packagePrealertAddress.deliveryType,
              userAddressId: res.data.packagePrealertAddress.userAddressId,
              firstName: res.data.packagePrealertAddress.userName,
              phone: res.data.packagePrealertAddress.mobile,
              country: res.data.packagePrealertAddress.country,
              province: res.data.packagePrealertAddress.province,
              city: res.data.packagePrealertAddress.city,
              detailAddress: res.data.packagePrealertAddress.address
            }
            this.orderAddress = data
            this.SET_ORDER_ADDRESS(data)
          } else if (res.data.packagePrealertAddress.deliveryType === 1 || res.data.packagePrealertAddress.deliveryType === 2) {
            // 自提
            res.data.packagePrealertAddressId = ''
            this.$set(res.data, 'pickUpWithRecipientsVO', {})
            res.data.pickUpWithRecipientsVO.deliveryType = res.data.packagePrealertAddress.deliveryType
            res.data.pickUpWithRecipientsVO.recipientsName = res.data.packagePrealertAddress.userName || ''
            res.data.pickUpWithRecipientsVO.pickUpCode = res.data.packagePrealertAddress.pickUpCode || ''
            res.data.pickUpWithRecipientsVO.phoneNumber = res.data.packagePrealertAddress.mobile || ''
            res.data.pickUpWithRecipientsVO.recipientsId = res.data.packagePrealertAddress.userAddressId || ''
            let data = {
              deliveryType: res.data.packagePrealertAddress.deliveryType,
              userAddressId: res.data.packagePrealertAddress.userAddressId,
              recipientsName: res.data.packagePrealertAddress.userName,
              phoneNumber: res.data.packagePrealertAddress.mobile,
              pickupName: res.data.packagePrealertAddress.userName,
              pickUpAddress: res.data.packagePrealertAddress.address
            }
            this.orderAddress = data
            this.SET_ORDER_ADDRESS(data)
          }
          // // 转运模式
          // this.isMerge = res.data.operateType === 'merge'
          // 物流服务
          let PD = this.dictData().PD
          res.data.productName = PD[res.data.productCode] || res.data.productCode
          let deliveryType = res.data.packagePrealertAddress.deliveryType
          if (res.data.packagePrealertAddress && res.data.packagePrealertAddress.deliveryType !== undefined) {
            API.getWarhouseList('').then(res => {
              if (res.code === this.GLOBAL.code) {
                let arr = res.data.filter((val) => val.warhouseId === this.orderData.warehouseCode)
                this.orderData.departureCountry = arr[0].departureCountry
                this.getProductConfigList(deliveryType)
              }
            })
          }
          // 增值服务
          res.data.packageOrderAddserviceDTOList = res.data.packagePrealertAddserviceList || []
          this.orderData = res.data
        }
      })
    },
    getUpdateData () {
      this.getAddress()
    },
    getAddress () {
      let item = this.$store.state.orderAddress
      // let item = this.orderAddress()
      let id = ''
      if (item.deliveryType === 0) id = item.userAddressId || item.id
      if (item.deliveryType === 1 || item.deliveryType === 2) id = item.userAddressId || item.recipientsId
      let oldId = this.orderData.packagePrealertAddressId || ((this.orderData.pickUpWithRecipientsVO && this.orderData.pickUpWithRecipientsVO.recipientsId) || '')
      if (item.province) {
        this.orderAddress = JSON.parse(JSON.stringify(item))
        if (item.recipientsId) {
          // 自提点、自提柜
          this.orderData.packagePrealertAddressId = ''
          this.$set(this.orderData, 'pickUpWithRecipientsVO', {})
          this.orderData.pickUpWithRecipientsVO.deliveryType = item.deliveryType
          this.orderData.pickUpWithRecipientsVO.recipientsName = item.recipientsName
          this.orderData.pickUpWithRecipientsVO.pickUpCode = item.pickUpCode
          this.orderData.pickUpWithRecipientsVO.phoneNumber = item.phoneNumber
          this.orderData.pickUpWithRecipientsVO.recipientsId = item.recipientsId
        } else {
          // 派送
          this.orderData.packagePrealertAddressId = item.id
          this.$set(this.orderData, 'pickUpWithRecipientsVO', {})
        }
        if (id !== oldId) {
          this.getProductConfigList(item.deliveryType)
        }
      }
    },
    setAddressDetail (data) {
      this.orderAddress = JSON.parse(JSON.stringify(data))
      this.SET_ORDER_ADDRESS(data)
    },
    handleSelectProduct (data) {
      // for (let v of rows) {
      //   v.checked = false
      // }
      // let data = rows[index]
      // data.checked = true
      for (let v of data.channelIncrments) {
        if (this.$route.name === 'shipments') {
          // 新增隐藏拍照、分箱、合箱
          if (v.itemCode !== '210' && v.itemCode !== '211' && v.itemCode !== '238') {
            v._show = true
          } else {
            v._show = false
          }
        } else { // 自助下單只能選擇保險保價
          if (v.itemCode === '237' || v.itemCode === '236') {
            v._show = true
          } else {
            v._show = false
          }
        }
      }
      this.orderData.packageOrderAddserviceDTOList = []
      for (let v of this.serviceList) v.checked = false
      this.serviceList = data.channelIncrments
      this.orderData.productCode = data.productCode
      this.orderData.productName = data.productName
      this.productShow = false
    },
    // TODO
    handleSelectService (index, rows) {
      let data = rows[index]
      let hasBj = false
      let hasBx = false
      if (data.itemCode === '236') {
        hasBj = true
      }
      if (data.itemCode === '237') {
        hasBx = true
      }
      if (data.itemCode === '295') {
        data.feeDesc = '每票收9.9HKD。禮包含5張1KG優惠券（總價值57.5港幣），滿$17.5港幣可用，大陸集運自提適用，2個工作日充值到賬；每個會員限參與1次，多次購買不重複送優惠券；若多次購買，多餘付款10月31日將退回到帳戶餘額。'
      }
      // 家私組裝服務, 生产环境的code是314   UAT的是313
      if (data.itemCode === '314' || data.itemCode === '313') {
        data.feeDesc = `0-9,999千克，收200HKD；
        如顧客選用組裝服務*
        上门安装服务费按包裹实重计费。費用由两部分组成，網上支付定金200HKD，若包裹重量计费大于$200HKD，剩余费用由安裝工作人員現場收取。
        費用按該單件物品每公斤＄30HKD收費*，最低消費$200HKD。
        費用單件組裝最高為$800HKD (離島區則不設收費上限)。
        *此服務只限於一般基本組件的安裝，並不適用於廚房及浴室範圍。
        *服務時間：早上12時正至晚上10時前。
        *離島及偏遠地區須一次性加收＄100HKD附加費。
        `
      }
      for (let v of rows) {
        if (v.checked) {
          if (v.itemCode === '236') {
            hasBj = true
          }
          if (v.itemCode === '237') {
            hasBx = true
          }
        }
      }
      if (hasBj && hasBx) {
        this.$vux.toast.text('保險保價不能同時選擇')
        return
      }
      data.checked = !data.checked
      let arr = []
      for (let v of rows) {
        if (v.checked) arr.push(v)
      }
      this.orderData.packageOrderAddserviceDTOList = arr
    },
    handleClickArgee () {
      this.isAgree = !this.isAgree
    },
    handleSubmit () {
      if (!this.isMerge) {
        // 非合箱转运
        if (!this.orderData.packagePrealertAddressId && !this.orderData.pickUpWithRecipientsVO.pickUpCode) {
          this.$vux.toast.text('請選擇收件地址信息')
          return
        }
        if (!this.orderData.productCode) {
          this.$vux.toast.text('請選擇物流服務')
          return
        }
        let hasBj = false
        let hasBx = false
        for (let v of this.orderData.packageOrderAddserviceDTOList) {
          if (v.itemCode === '236') {
            hasBj = true
          }
          if (v.itemCode === '237') {
            hasBx = true
          }
        }
        if (hasBj && hasBx) {
          this.$vux.toast.text('保險保價不能同時選擇')
          return
        }
      }
      if (!this.isAgree) {
        this.$vux.toast.text('請閱讀并同意協議')
        return
      }
      let postData = {
        deliveryType: this.orderAddress.deliveryType,
        fpxOrderId: this.fpxOrderId,
        operateType: this.orderData.operateType,
        packageOrderAddserviceDTOList: this.orderData.packageOrderAddserviceDTOList,
        productCode: this.orderData.productCode
      }
      if (!postData.deliveryType) { // 派送
        postData.packagePrealertAddressId = this.orderAddress.userAddressId || this.orderAddress.id
      } else {
        postData.packagePrealertAddressId = ''
        postData.pickUpWithRecipientsVO = this.orderData.pickUpWithRecipientsVO
      }
      console.log(postData)
      oAPI.setUpdatePackageOrderCarriage(postData).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.$vux.toast.text('操作成功')
          this.$router.push({ name: 'orders' })
          this.fpxOrderId = ''
        } else {
          this.$vux.toast.text(res.message)
        }
      })
    },
    // 删除token
    removeQequestToken () {
      sessionStorage.removeItem('token')
    },
    // 获取产品和增值服务
    getProductConfigList (deliveryType) {
      // 重置产品类型和增值服务
      this.orderData.productName = ''
      this.orderData.productCode = ''
      this.serviceList = []
      this.orderData.packageOrderAddserviceDTOList = []
      let codeArr = []
      let number = 0
      let goodAmount = 0
      for (let v of this.orderData.packagePrealertGoodsList) {
        codeArr.push(v.categoryCode)
        number += v.number
        goodAmount += Number(v.price)
      }
      // 根据仓库、目的国、收货方式获取产品线路
      let data = {
        deliveryType: deliveryType === 0 ? 1 : 2, // 收货方式：1派送 2自提点
        departureCountry: this.orderData.departureCountry, // 启动运国
        destinationCountry: 'HK', // 目的国二字码
        pickType: deliveryType === 0 ? '3' : String(deliveryType), // 1 自提点 2 自提柜 3 无
        warehouseCode: this.orderData.warehouseCode, // 仓库code
        categoryCodeList: codeArr,
        goodAmount: goodAmount,
        number: number,
        currency: this.currencyUnit
      }
      oAPI.getProductConfigList(data).then(res => {
        if (res.code === this.GLOBAL.code) {
          if (!res.data.length) {
            this.noLogistics = true
          }
          for (let v of res.data) {
            v.checked = false
            for (let sv of v.channelIncrments) {
              sv.checked = false
            }
            // TODO
            if (this.orderData.productCode === v.productCode) {
              for (let sv of v.channelIncrments) {
                for (let ev of this.orderData.packagePrealertAddserviceList) {
                  if (ev.serviceCode === sv.itemCode) sv.checked = true
                }
              }
              this.handleSelectProduct(v)
            }
          }
          this.productList = res.data
        }
      })
    },
    handleAddress () {
      // 用戶自助下單
      let data = {
        orderType: 5, // 0预报 1修改 2认领 3合箱 4合箱轉單票 5用戶自助下單
        fpxOrderId: this.$route.query.fpxOrderId,
        operateType: this.$route.query.operateType
      }
      this.SET_ORDER_BASE_DATA(data)
      this.$router.push({ name: 'addresses', query: { from: 'order', pickUpIsUse: this.orderData.pickUpIsUse, lockerIsUse: this.orderData.lockerIsUse } })
    },
    // 选择物流产品
    handleProduct () {
      this.productShow = true
    },
    // 选择转运方式
    handleSelectType (type) {
      this.isMerge = !!type
      if (this.isMerge) {
        this.orderData.packagePrealertAddressId = ''
        this.orderData.pickUpWithRecipientsVO = {
          'pickUpCode': '',
          'recipientsName': '',
          'phoneNumber': '',
          'deliveryType': 0
        }
      }
      this.transferTypeShow = false
      this.orderData.operateType = type === 1 ? 'merge' : 'single'
    },
    // 重置预报信息
    resetOrderData () {
      console.log('resetOrderData')
      this.orderData = {
        departureCountry: '',
        destinationCountry: '',
        warehouseCode: '',
        _warehouse: [],
        packagePrealertAddressId: '',
        pickUpWithRecipientsVO: {
          pickUpCode: '',
          recipientsName: '',
          phoneNumber: '',
          deliveryType: 0,
          recipientsId: ''
        },
        packageOrderAddserviceDTOList: [],
        packagePrealertGoodsVOS: [],
        packagePrealertGoodsList: [],
        productCode: '',
        productName: '',
        referOrderId: '',
        fpxOrderId: ''
      }
      this.orderAddress = {}
      this.serviceList = []
      this.DELETE_ORDER_DATA()
    },
    ...mapGetters(['dictData']),
    ...mapMutations([
      'DELETE_ORDER_DATA',
      'SET_ORDER_BASE_DATA',
      'SET_ORDER_GOODS_LIST',
      'SET_ORDER_ADDRESS'
    ])
  },
  components: {
    Group,
    PopupPicker,
    XInput,
    Radio,
    CheckIcon,
    Address,
    Flexbox,
    FlexboxItem,
    XDialog,
    Cell,
    Popup,
    XButton,
    Card,
    Agreement,
    SendEdit,
    PickupEdit,
    PopupHeader,
    Product
  },
  filters: {
    // 根据仓库id获取仓库名称
    filterWH (val) {
      const wh = getWH()
      return wh.hasOwnProperty(val) ? wh[val] : '暫無'
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .detailWrapper {
    .merge-card {
      margin-bottom: 0.2rem;
      .merge-infos {
        margin-bottom: 0.2rem;
        .thead {
          display: flex;
          .th {
            flex: 1;
            text-align: center;
            color: #999;
            font-size: 0.26rem;
            margin: 0.16rem 0;
          }
        }
        .tr {
          display: flex;
          .td {
            flex: 1;
            text-align: center;
            color: @primary;
            font-size: 0.26rem;
            margin: 0.16rem 0;
          }
        }
      }
    }
    .merge-card.product {
      .th:nth-child(2),
      .td:nth-child(2) {
        flex-grow: 2;
      }
    }
    .popup-btn {
      padding: 0.2rem 0.3rem;
      font-size: 0;
    }
    .info {
      background-color: #fff;
      font-size: 0.28rem;
      padding: 0.2rem 0.3rem;
      margin-bottom: 0.2rem;
      .nodata {
        height: 0.4rem;
        line-height: 0.4rem;
        text-align: center;
        color: #999;
      }
      .row1,
      .row2 {
        display: flex;
        justify-content: space-between;
        padding: 0.1rem 0;
      }
      .row1 {
        color: #666;
        font-size: 0.32rem;
      }
      .row2 {
        color: @error;
        span {
          color: #999;
          font-size: 0.24rem;
        }
      }
    }
    .package-row {
      display: flex;
      background: #fff;
      .package-key,
      .package-value {
        width: 20%;
        font-size: 0.3rem;
        text-align: center;
        padding: 0.2rem 0;
        border: 1px solid #f2f2f2;
        color: #666;
        &:nth-child(2) {
          width: 40%;
        }
      }
      .package-key {
        color: #333;
      }
    }
  }
  .order {
    margin-bottom: 1.6rem;
    font-size: 0.24rem;
    .goods-wrapper {
      height: auto;
      position: relative;
      background: #fff;
      .goods-item {
        font-size: 0.28rem;
        background: #f2f2f2;
        padding: 0.2rem;
        display: flex;
        margin-bottom: 0.2rem;
        .infos {
          padding-right: 1%;
          width: 70%;
          .rows {
            display: flex;
            justify-content: space-between;
            padding: 0.14rem 0;
            .col2 {
              color: #999;
            }
          }
          p {
            color: #999;
            line-height: 0.32rem;
            font-size: 0.26rem;
          }
        }
        .btns {
          width: 30%;
          text-align: center;
          p {
            height: 50%;
          }
          i {
            font-size: 0.5rem;
            color: #666;
            padding: 0.04rem 0.13rem;
            cursor: pointer;
          }
          .icon-delete {
            color: @error;
          }
          .icon-edit {
            color: @primary;
          }
        }
        .btns-num {
          margin-right: 0.2rem;
        }
      }
    }
    .articles-wrapper {
      min-height: 2.8rem;
      max-height: 5rem;
      overflow-y: scroll;
      position: relative;
    }
    .goods-btn {
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      color: @primary;
      border-top: 1px solid #eee;
    }
  }

  // type
  .type-wrapper {
    height: 1.2rem;
    padding: 0.2rem;
    .type-item {
      float: left;
      width: 2.4rem;
      height: 0.8rem;
      line-height: 0.8rem;
      text-align: center;
      background: #fff;
      font-size: 0.28rem;
      border: 2px solid #999;
      margin-right: 0.4rem;
      color: #333;
      &:last-of-type {
        margin-right: 0;
      }
      &.actived {
        border: 2px solid @primary;
        color: @primary;
      }
    }
  }

  // address
  .address-wrapper {
    // height: 4rem;
    // overflow-y: auto;
    // position: relative;
    padding: 0.2rem;
    .address-item {
      float: left;
      width: 2.4rem;
      height: 0.8rem;
      line-height: 0.8rem;
      text-align: center;
      background: #fff;
      font-size: 0.28rem;
      border: 2px solid #999;
      margin-right: 0.4rem;
      color: #333;
      &:last-of-type {
        margin-right: 0;
      }
    }
  }

  .address-info {
    padding: 0.2rem 0.3rem;
    .tag {
      background: @primary;
      font-size: 0.24rem;
      padding: 0.04rem 0.1rem;
      color: #fff;
      border-radius: 3px;
      margin-right: 0.06rem;
    }
  }

  // product
  .product-wrapper {
    padding: 0.2rem 0;
    .product-item {
      font-size: 0.28rem;
    }
  }

  // service
  .service-wrapper {
    padding: 0.2rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    align-content: flex-start;
    flex-wrap: wrap;
    .service-item {
      font-size: 0.28rem;
      margin-bottom: 0.2rem;
      margin-right: 0.18rem;
      padding: 0.1rem 0.32rem;
      border: 1px solid @primary;
      background: #f2f2f2;
      color: #333;
      &.active {
        background: @primary;
        color: #fff;
      }
      // &:nth-of-type(5n) {
      //   margin-right: 0;
      // }
    }
  }
  .service-tip-wrapper {
    padding: 0 0.3rem 0.2rem;
    font-size: 0.28rem;
    color: #999;
    .service-tip {
      padding-bottom: 0.1rem;
      line-height: 0.4rem;
    }
  }
  // select-box
  .select-box {
    text-align: center;
    color: @primary;
    .iconfont {
      font-size: 0.4rem;
    }
  }
  // submit
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
      &.active {
        background: @primary;
      }
    }
  }
  .disabled {
    background: #f2f2f2 !important;
  }
  // logisticPopup
  .logisticPopup {
    font-size: 0.28rem;
    background: #fff;
    .header {
      width: 100%;
      height: 0.9rem;
      line-height: 0.9rem;
      background: #fff;
      text-align: right;
      overflow: hidden;
      padding: 0 0.2rem;
      font-size: 0.32rem;
      display: flex;
      justify-content: space-between;
      color: @primary;
      i {
        padding: 0 0.4rem 0 0.2rem;
        cursor: pointer;
      }
    }
    .info {
      background: #f2f2f2;
      padding: 0.2rem 0.3rem;
      margin: 0 0.2rem 0.2rem 0.2rem;
      p {
        margin: 0.1rem;
        color: #666;
        line-height: 0.54rem;
      }
    }
  }
</style>

<style lang="less">
  .order {
    .weui-label {
      color: #333;
    }
    .vux-label {
      color: #333;
    }
    .vux-cell-box {
      // background: #eee;
    }

    .weui-cells__title {
      background: #fff !important;
      color: #333;
      height: 0.8rem;
      margin: 0.2rem 0 0;
      font-size: 0.36rem;
      line-height: 0.8rem;
    }

    .vux-no-group-title {
      margin-top: 0.2rem;
    }

    .weui-cells:before {
      content: "";
      border: 0;
    }

    .weui-label,
    .vux-radio-label {
      // font-size: 0.26rem;
    }
    .goods-wrapper {
      .weui-cell {
        padding: 0 !important;
      }
      .vux-number-input,
      .vux-number-selector-sub,
      .vux-number-selector-plus {
        margin-right: 0;
        border-radius: 0 2px 2px 0;
        padding: 0 0.06rem !important;
        height: 0.6rem;
        background: #fff;
        svg {
          margin-top: 0.1rem;
          fill: #666 !important;
        }
      }
      .vux-number-input {
        width: 0.4rem !important;
        font-size: 0.28rem !important;
      }
      .weui-btn {
        font-size: 0.32rem;
      }
    }
  }
  .receiveclaim-btn {
    background: @primary!important;
    color: #fff !important;
  }
</style>
