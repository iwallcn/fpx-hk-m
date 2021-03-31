<template>
  <div class="order">
    <!--加上温馨提示-->
    <div class="issue-tips"
      v-if="mergeMode">
      温馨提示：
      <p>1、如果超过物流产品限制，将无法选择物流产品（仅做参考，最终以仓库判断为准）；</p>
      <p>2、如果合箱方案，超过物流产品限制，请在PC端“异常包裹”内取消合箱，然后重新选择合箱方案。</p>
    </div>

    <!-- 启运仓 -->
    <group v-if="!mergeMode">
      <!-- 包裹认领起始仓不能修改 -->
      <popup-picker title="啟運倉:"
        :data="warhouseList"
        v-model="orderData._warehouse"
        show-name
        @on-change="onWarhouseChange"
        :disabled="$route.name === 'receiveclaim'"
        is-link
        placeholder="請選擇啟運倉"></popup-picker>
    </group>

    <!-- 物流单号 -->
    <group v-if="!mergeMode">
      <x-input title="物流單號:"
        :disabled="$route.name === 'receiveclaim' && !isHide"
        v-model.trim="orderData.referOrderId">
        <x-button slot="right"
          class="receiveclaim-btn"
          v-if="$route.name === 'receiveclaim'"
          :disabled="$route.name === 'receiveclaim' && !isHide"
          @click.native="verificationFeferOrderId"
          mini>验证</x-button>
      </x-input>
    </group>

    <!-- 商品、物品 -->
    <template v-if="!mergeMode">
      <template v-if="orderData.warhouseCode && !isHide">
        <group v-if="!orderData.packagePrealertGoodsVOS.length">
          <cell v-if="transferData.transferType == 1"
            title="商品信息"
            @click.native="handleGoods(0)"
            value=""
            is-link></cell>
          <cell v-else
            title="物品信息"
            @click.native="handleGoods(1)"
            value=""
            is-link></cell>
        </group>

        <!-- 商品/物品列表 -->
        <group v-else
          :title="transferData.transferType  == 1 ? '商品信息' : '物品信息'">
          <div class="goods-wrapper"
            v-if="$route.name === 'receiveclaim' && orderData.packagePrealertGoodsList.length">
            <GoodsTable :goodsList="orderData.packagePrealertGoodsVOS"></GoodsTable>
          </div>
          <div class="goods-wrapper"
            v-else>
            <div class="goods-item"
              v-for="(item, index) in orderData.packagePrealertGoodsVOS"
              :key="index">
              <div class="infos">
                <div class="rows">
                  <div class="col">{{item.goodsName}}</div>
                  <div class="col2">{{item.price}}{{item.unit}}</div>
                </div>
                <div class="rows">
                  <p>{{item.brand}} {{item.categoryName}} {{item.originPlace}}</p>
                </div>
              </div>
              <div class="btns">
                <p><i class="iconfont icon-edit"
                    @click="handleGoodsEdit(index, orderData.packagePrealertGoodsVOS)"></i>
                  <i class="iconfont icon-delete"
                    @click="handleGoodsDelete(index, orderData.packagePrealertGoodsVOS)"></i>
                </p>
                <p>
                  <x-number :min="1"
                    class="btns-num"
                    @on-change="onNumberChange(orderData.packagePrealertGoodsVOS)"
                    v-model="item.number"></x-number>
                </p>
              </div>
            </div>
          </div>
          <div class="goods-btn"
            @click="transferData.transferType == 1 ? handleGoods(0) : handleGoods(1)">
            {{ transferData.transferType == 1 ? '+ 添加商品' : '+ 添加物品' }}
          </div>
        </group>
      </template>
    </template>

    <group title="轉運方式"
      v-if="!isHide && !mergeMode">
      <div class="type-wrapper">
        <flexbox justify="left">
          <div @click="handleSelectType(0)"
            :class="['type-item', isMerge ? '' : 'actived']">單票轉運</div>
          <!-- <div v-show="transferData.canMerge == 1"
            @click="handleSelectType(1)"
            :class="['type-item', isMerge ? 'actived' : '']">合箱轉運</div> -->
        </flexbox>
      </div>
    </group>

    <!-- 地址 -->
    <group v-if="mergeMode"
      @click.native="handleAddress">
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
    <group v-if="productList.length && mergeMode">
      <cell title="物流服務"
        :value="orderData.productName"
        @click.native="handleProduct"
        :is-link="!orderAddress.deliveryType && orderData.departureCountry === 'CN' ? false : true"></cell>
      <div v-if="!orderAddress.deliveryType && orderData.departureCountry === 'CN'">
        <newProductUI></newProductUI>
      </div>
    </group>

    <!-- 增值服务 -->
    <!-- 隐藏合箱、分箱、拍照增值服务 -->
    <group title="選擇增值服務"
      v-if="serviceList.length && mergeMode">
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
        <div v-for="(item, index) in orderData.packagePrealertAddserviceVOS"
          :key="index">
          <p v-if="item.feeDesc"
            class="service-tip">{{item.itemName}}：{{item.feeDesc || ''}}</p>
        </div>
      </div>
    </group>

    <!-- 提交 -->
    <div v-if="mergeMode">
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
          @click="handleSubmitMerge">提交</div>
      </div>
    </div>

    <!-- 用户条款弹框 -->
    <!-- <div v-transfer-dom>
      <popup v-model="agreementShow"
        class="content-popup"
        position="bottom"
        height="80%">
        <Agreement @close="agreementShow = false"></Agreement>
      </popup>
    </div> -->

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
  XNumber,
  InlineXNumber,
  XDialog,
  Cell,
  Popup,
  XButton,
  PopupHeader
} from 'vux'
import Address from '@/components/addresses'
import Goods from './goods'
import GoodsTable from './goodsTable'
import Articles from './articles'
import AddGoods from './addGoods'
import AddArticles from './addArticles'
import Category from './category'
import SendEdit from '@/components/addresses/sendEdit'
import PickupEdit from '@/components/addresses/pickupEdit'
import Product from './product'
import { getApiToken } from '@/api/token'
import { mapGetters, mapMutations } from 'vuex'
import newProductUI from './newProductUI'
export default {
  name: 'order',
  data () {
    return {
      fpxOrderId: '',
      orderType: 0, // 0预报 1修改 2认领 3合箱
      mergeMode: false, // 合箱预报
      isMerge: false, // 转运模式
      isHide: false,
      goodsDialogShow: false,
      isGoodsEdit: false, // 商品修改
      categoryShow: false,
      agreementShow: false,
      isAgree: false,
      referOrderIdRules: '',
      currencyUnit: 'HKD',
      warhouseList: [],
      originPlaceList: [],
      transferData: {
        canMerge: 0,
        canSplit: 1,
        transferType: 1
      },
      orderData: {
        departureCountry: '',
        destinationCountry: '',
        warhouseCode: '',
        _warehouse: [],
        packagePrealertAddressId: '',
        pickUpWithRecipientsVO: {
          pickUpCode: '',
          recipientsName: '',
          phoneNumber: '',
          deliveryType: 0,
          recipientsId: ''
        },
        packagePrealertAddserviceVOS: [],
        packagePrealertGoodsVOS: [],
        packagePrealertGoodsList: [],
        productCode: '',
        productName: '',
        referOrderId: '',
        fpxOrderId: '',
        isClaim: 0,
        customsMode: '',
        parcelMode: ''
      },
      productList: [],
      serviceList: [],
      serviceTip: '',
      addressAddType: this.$store.state.addressTabIndex,
      reFresh: true, // 地址组件刷新变量
      goodsShow: false,
      transferTypeShow: false,
      noLogistics: false, // 暂无物流服务
      productShow: false,
      addServiceShow: false,
      // goodsList: [],
      orderAddress: {},
      mergeData: null,
      volumeLength: null,
      volumeWide: null,
      volumeHeight: null,
      weight: null
    }
  },
  created () {
    this.volumeLength = this.$route.query.volumeLength
    this.volumeWide = this.$route.query.volumeWide
    this.volumeHeight = this.$route.query.volumeHeight
    this.weight = this.$route.query.weight
    // 设置请求token
    this.getQequestToken()
    this.resetOrderData()
    // let data = {
    //   orderType: 3, // 0预报 1修改 2认领 3合箱 4合箱轉單票
    //   fpxOrderId: ''
    // }
    // this.mergeMode = true
    // this.SET_ORDER_BASE_DATA(data)
    // this.getData()
    // this.getApplyMergerPackageInfo()
  },
  activated () {
    // 设置请求token
    this.getQequestToken()
    let data = {
      orderType: 3, // 0预报 1修改 2认领 3合箱 4合箱轉單票
      fpxOrderId: ''
    }
    this.mergeMode = true
    this.SET_ORDER_BASE_DATA(data)
    this.getApplyMergerPackageInfo()
  },
  methods: {
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
      let orderType = this.GLOBAL.getOrdertypeByRouter[this.$route.name]
      let data = {
        orderType,
        fpxOrderId: ''
      }
      this.mergeMode = true
      this.SET_ORDER_BASE_DATA(data)
    },
    getData () {
      // 获取起运仓
      API.getWarhouseList('').then(res => {
        if (res.code === this.GLOBAL.code) {
          for (let v of res.data) {
            let WH = this.dictData().WH
            v.name = WH[v.warhouseId] || ''
            v.value = v.warhouseId
          }
          this.warhouseList = [res.data] || []
        }
      }).then(() => {
        this.getUpdateData()
      })
    },
    getApplyMergerPackageInfo () {
      let referOrderIds = this.$store.state.referOrderIds
      oAPI.getApplyMergerPackageInfo({ referOrderIds: referOrderIds }).then(res => {
        if (res.code === this.GLOBAL.code) {
          if (res.data.length) {
            let data = res.data[0]
            this.orderData.currency = data.currency
            this.currencyUnit = data.currency
            this.orderData.departureCountry = data.departureCountry
            this.orderData.destinationCountry = data.destinationCountry
            this.orderData.warehouseCode = data.warehouseCode
            this.orderData.warhouseCode = data.warehouseCode
            this.mergeData = res.data
          }
        }
      }).then(() => {
        this.getUpdateData()
      })
    },
    getUpdateData () {
      this.getGoods()
      this.getAddress()
    },
    getGoods () {
      // this.goodsList = JSON.parse(JSON.stringify(this.$store.state.orderGoodsList))
      let goods = JSON.parse(JSON.stringify(this.$store.state.orderGoodsList))
      this.orderData.packagePrealertGoodsVOS = goods
    },
    // getAddress () {
    //   let item = this.$store.state.orderAddress
    //   if (item.province) {
    //     this.orderAddress = JSON.parse(JSON.stringify(item))
    //     if (item.id) {
    //       // 派送
    //       this.orderData.packagePrealertAddressId = item.id
    //     } else {
    //       // 自提点、自提柜
    //       this.orderData.pickUpWithRecipientsVO.deliveryType = item.deliveryType
    //       this.orderData.pickUpWithRecipientsVO.recipientsName = item.recipientsName
    //       this.orderData.pickUpWithRecipientsVO.pickUpCode = item.pickUpCode
    //       this.orderData.pickUpWithRecipientsVO.phoneNumber = item.phoneNumber
    //       this.orderData.pickUpWithRecipientsVO.recipientsId = item.recipientsId
    //     }
    //     this.getProductConfigList(item.deliveryType)
    //   }
    // },
    getAddress () {
      let item = this.$store.state.orderAddress
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
          console.log(id, oldId, 'addressChange')
          this.getProductConfigList(item.deliveryType)
        }
      }
    },
    onWarhouseChange (val) {
      console.log(val, 'onWarhouseChange')
      if (!val[0]) return
      // 重新渲染地址组件
      this.reFresh = false
      this.$nextTick(() => {
        this.reFresh = true
      })
      for (let v of this.warhouseList[0]) {
        if (v.warhouseId === val[0]) {
          this.orderData.warhouseCode = val[0]
          this.currencyUnit = v.departureCurrency
          this.orderData.departureCountry = v.departureCountry
        }
      }
      oAPI.getTransferType(val).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.transferData = res.data
        }
      })
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
        } else {
          // 认领隐藏拍照、分箱、合箱、清点
          if (v.itemCode !== '210' && v.itemCode !== '211' && v.itemCode !== '238' && v.itemCode !== '239') {
            v._show = true
          } else {
            v._show = false
          }
        }
      }
      this.orderData.packagePrealertAddserviceVOS = []
      this.serviceList = data.channelIncrments
      for (let v of this.serviceList) v.checked = false
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
      this.orderData.packagePrealertAddserviceVOS = arr
    },
    handleClickArgee () {
      this.isAgree = !this.isAgree
    },
    handleSubmitMerge () {
      if (!this.orderData.packagePrealertAddressId && !this.orderData.pickUpWithRecipientsVO.pickUpCode) {
        this.$vux.toast.text('請選擇收件地址信息')
        return
      }
      // let referOrderIdReg = /^[-_a-zA-Z0-9]{1,64}$/
      // if (!referOrderIdReg.test(this.orderData.referOrderId)) {
      //   this.$vux.toast.text('請輸入有效的商家物流號')
      //   return
      // }
      if (!this.orderData.productCode && (this.orderAddress.deliveryType || (!this.orderAddress.deliveryType && this.orderData.departureCountry !== 'CN'))) {
        this.$vux.toast.text('請選擇物流服務')
        return
      }
      let hasBj = false
      let hasBx = false
      for (let v of this.orderData.packagePrealertAddserviceVOS) {
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
      if (!this.isAgree) {
        this.$vux.toast.text('請閱讀并同意協議')
        return
      }
      let data = JSON.parse(JSON.stringify(this.orderData))
      delete data._warehouse
      for (let v of data.packagePrealertAddserviceVOS) {
        delete v.checked
        v.serviceCode = v.itemCode
      }
      data.fpxOrderIdS = this.$store.state.referOrderIds
      if (this.weight) data.packageWeight = this.weight
      oAPI.setPackageMergeOrder(data).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.removeQequestToken() // 删除token
          let msg = '合箱發貨成功'
          this.$vux.toast.text(msg)
          this.$store.commit('SET_REFER_ORDERIDS', [])
          this.resetOrderData()
          this.$router.push({ name: 'orders', query: { index: 0 } })
        } else {
          this.getQequestToken()
        }
      })
    },
    // 删除token
    removeQequestToken () {
      sessionStorage.removeItem('token')
    },
    onCategoryChoose (item) {
      this.goodsData.categoryName = item.categoryName
      this.goodsData.categoryCode = item.categoryCode
      this.categoryShow = false
    },
    onOriginPlaceChange (val) {
      this.goodsData.originPlace = val[0]
    },
    handleGoodsAdd (item) {
      this.orderData.packagePrealertGoodsVOS.push(item)
    },
    upcBlur () {

    },
    handleGoodsDialog () {
      this.$refs.goods.goodsDialogShow = true
    },
    handleArticlesDialog () {
      let obj = {
        goodsName: '',
        categoryCode: '',
        categoryName: '',
        number: 0,
        price: 0,
        _currentCategory: []
      }
      this.orderData.packagePrealertGoodsVOS.push(obj)
      // this.$refs.articles.addGoods()
    },
    // 获取产品和增值服务
    getProductConfigList (deliveryType) {
      console.log('getProductConfigList')
      // 重置产品类型和增值服务
      this.orderData.productName = ''
      this.orderData.productCode = ''
      this.serviceList = []
      this.orderData.packagePrealertAddserviceVOS = []
      let codeArr = []
      let number = 0
      let goodAmount = 0
      for (let v of this.mergeData) {
        for (let item of v.packagePrealertGoodsList) {
          codeArr.push(item.categoryCode)
          number += item.number
          goodAmount += Number(item.price)
        }
      }
      // 根据仓库、目的国、收货方式获取产品线路
      let data = {
        deliveryType: deliveryType === 0 ? 1 : 2, // 收货方式：1派送 2自提点
        departureCountry: this.orderData.departureCountry, // 启动运国
        destinationCountry: 'HK', // 目的国二字码
        pickType: deliveryType === 0 ? '3' : String(deliveryType), // 1 自提点 2 自提柜 3 无
        isQueryMerge: 1, // 是否获取支持合箱的产品渠道
        warehouseCode: this.orderData.warhouseCode, // 仓库code
        categoryCodeList: codeArr,
        goodAmount: goodAmount,
        number: number,
        currency: this.currencyUnit
      }
      // 传长宽高过去，来筛选哪些可用
      if (this.volumeLength || this.volumeWide || this.volumeHeight || this.weight) {
        data.volumeLength = this.volumeLength
        data.volumeWide = this.volumeWide
        data.volumeHeight = this.volumeHeight
        data.weight = this.weight
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
          }
          this.productList = res.data
          if (!this.orderAddress.deliveryType && this.orderData.departureCountry === 'CN') {
            this.orderData.productCode = res.data.length ? res.data[0].productCode : ''
            // 派送、根据仓库获取增值服务
            this.getService(this.orderData.warhouseCode)
          }
        }
      })
    },
    // 派送、根据仓库获取增值服务
    getService (warehouseCode) {
      oAPI.getAddserviceByWarehouseCode(warehouseCode).then(res => {
        if (res && Array.isArray(res)) {
          this.serviceList = res.map(v => {
            if (this.$route.name === 'shipments') {
              // 新增隐藏拍照、分箱、合箱
              if (v.itemCode !== '210' && v.itemCode !== '211' && v.itemCode !== '238') {
                v._show = true
              } else {
                v._show = false
              }
            } else {
              // 隐藏拍照、分箱、合箱、清点
              if (v.itemCode !== '210' && v.itemCode !== '211' && v.itemCode !== '238' && v.itemCode !== '239') {
                v._show = true
              } else {
                v._show = false
              }
            }
            return v
          })
        }
      })
    },
    // 认领验证物流号
    verificationFeferOrderId () {
      if (this.$route.name !== 'receiveclaim') return
      if (!this.orderData.referOrderId) {
        this.$vux.toast.text('請輸入商家物流號')
        return
      }
      // 验证物流单号
      let data = {
        referOrderId: this.orderData.referOrderId,
        fpxOrderId: this.$route.query.fpxOrderId
      }
      oAPI.verificationFeferOrderId(data).then(res => {
        if (res.code === this.GLOBAL.code) {
          if (res.data === 0) {
            this.$vux.toast.text('商家物流號輸入有誤')
          } else {
            // 显示下面所有内容 商家物流号不能修改
            this.isHide = false
          }
        }
      })
    },
    handleAddress () {
      this.$router.push({ name: 'addresses', query: { from: 'order' } })
    },
    // 选择物流产品
    handleProduct () {
      if (!this.orderAddress.deliveryType && this.orderData.departureCountry === 'CN') return // 派送的时候不用选择产品
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
    },
    // 选择商品
    handleGoods (type) {
      // type 0 商品模式 1 物品模式
      if (type) {
        // 物品模式
        this.$router.push({ name: 'addArticles', query: { currencyUnit: this.currencyUnit } })
      } else {
        // 商品模式
        this.$router.push({ name: 'addGoods', query: { currencyUnit: this.currencyUnit, originPlace: this.orderData.departureCountry } })
      }
      // this.goodsShow = true
    },
    // 清空商品信息
    resetGoodsData (type) {
      // this.goodsList = []
      this.orderData.packagePrealertGoodsVOS = []
      this.SET_ORDER_GOODS_LIST([])
    },
    // 重置预报信息
    resetOrderData () {
      this.orderData = {
        departureCountry: '',
        destinationCountry: '',
        warhouseCode: '',
        _warehouse: [],
        packagePrealertAddressId: '',
        pickUpWithRecipientsVO: {
          pickUpCode: '',
          recipientsName: '',
          phoneNumber: '',
          deliveryType: 0,
          recipientsId: ''
        },
        packagePrealertAddserviceVOS: [],
        packagePrealertGoodsVOS: [],
        packagePrealertGoodsList: [],
        productCode: '',
        productName: '',
        referOrderId: '',
        fpxOrderId: '',
        isClaim: 0,
        customsMode: '',
        parcelMode: ''
      }
      this.serviceList = []
      this.DELETE_ORDER_DATA()
    },
    handleGoodsDelete (index, rows) {
      console.log(index, rows)
      rows.splice(index, 1)
      this.SET_ORDER_GOODS_LIST(JSON.parse(JSON.stringify(rows)))
    },
    handleGoodsEdit (index, rows) {
      console.log(index, rows)
      if (Number(this.transferData.transferType) === 1) {
        this.$router.push({ name: 'editGoods', query: { index: index, currencyUnit: this.currencyUnit, originPlace: this.orderData.departureCountry } })
      } else {
        this.$router.push({ name: 'editArticles', query: { index: index, currencyUnit: this.currencyUnit } })
      }
    },
    onNumberChange (rows) {
      this.SET_ORDER_GOODS_LIST(JSON.parse(JSON.stringify(rows)))
      this.onGoodsChange()
    },
    ...mapGetters(['dictData']),
    ...mapMutations([
      'DELETE_ORDER_DATA',
      'SET_ORDER_BASE_DATA',
      'SET_ORDER_GOODS_LIST'
    ])
  },
  computed: {
    whPlaceholder () {
      let msg = `請輸入商家物流號${this.referOrderIdRules} `
      return msg
    }
  },
  watch: {
    'orderData.warhouseCode' (val, oVal) {
      if (oVal) this.DELETE_ORDER_DATA()
    }
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
    XNumber,
    InlineXNumber,
    Goods,
    XDialog,
    Cell,
    Popup,
    XButton,
    Category,
    Articles,
    Agreement,
    GoodsTable,
    SendEdit,
    PickupEdit,
    PopupHeader,
    AddArticles,
    AddGoods,
    Product,
    newProductUI
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .order {
    margin-bottom: 1.6rem;
    font-size: 0.24rem;
    .issue-tips {
      font-size: 0.24rem;
      background: #ffffbe;
      color: @primary;
      padding: 0.2rem 0.16rem;
      p {
        text-indent: 2em;
        margin: 0.06rem 0;
        line-height: 0.33rem;
      }
    }
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
      font-size: 0.36rem;
      color: #333;
    }
    .vux-label {
      font-size: 0.36rem;
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
