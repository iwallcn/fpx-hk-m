<template>
  <div class="add-articles">
    <div class="history">
      <span @click="loadProducts">歷史物品記錄</span>
    </div>
    <group gutter=".2rem"
      label-width="1.8rem"
      label-margin-right="0.2rem"
      label-align="left">
      <cell :value="goodsData.categoryName"
        v-if="!isEncrypted && hasData">
        <div slot="title"
          class="cell-label">
          <span class="cell-must">*</span>
          <span class="cell-name">品類</span>
        </div>
      </cell>
      <cell :value="goodsData.categoryName"
        @click.native="handleGoodsCategory"
        :is-link="goodsData.categoryCode && isList ? false : true"
        v-else>
        <div slot="title"
          class="cell-label">
          <span class="cell-must">*</span>
          <span class="cell-name">品類</span>
        </div>
      </cell>
      <template v-if="!isEncrypted && hasData">
        <cell :value="goodsData.goodsName">
          <div slot="title"
            class="cell-label">
            <span class="cell-must"> &nbsp;</span>
            <span class="cell-name">名稱</span>
          </div>
        </cell>
      </template>
      <template v-else>
        <x-input v-model.trim="goodsData.goodsName"
          placeholder="請輸入名稱">
          <div slot="label"
            class="cell-label">
            <span class="cell-must"> &nbsp;</span>
            <span class="cell-name">名稱</span>
          </div>
        </x-input>
      </template>
      <cell>
        <div slot="title"
          class="cell-label">
          <span class="cell-must">*</span>
          <span class="cell-name">數量</span>
        </div>
        <template v-if="!isEncrypted && hasData">
          {{goodsData.number}}
        </template>
        <template v-else>
          <inline-x-number style="display:block;"
            v-model="goodsData.number"
            :min="1"
            :max="100"
            :fillable="true"></inline-x-number>
        </template>
      </cell>
      <x-input class="weui-vcode"
        @on-blur="onPriceBlur"
        @on-focus="onPriceFocus"
        placeholder="請輸入實際購買的價格"
        v-model="goodsData.price">
        <div slot="label"
          class="cell-label">
          <span class="cell-must">*</span>
          <span class="cell-name">申報單價</span>
        </div>
        <span slot="right">{{currencyUnit}}</span>
      </x-input>
    </group>
    <div class="add-confirm"
      @click="handleAddGoods">保 存</div>

    <!-- 商品品类弹框 -->
    <popup-category :popupShow="popupShow"
      :firstCode="obj.firstCode"
      :secondCode="obj.secondCode"
      :thirdCode="obj.thirdCode"
      @closeAddressPopup="popupShow = false"
      @selectValue="selectValue"></popup-category>

    <!-- 历史商品数据弹框 -->
    <div v-transfer-dom>
      <popup v-model="productListShow"
        position="right"
        width="100%">
        <product-List @closeProductList="closeProductList"
          @handlerDeclare="handlerDeclare"></product-List>
      </popup>
    </div>
  </div>
</template>

<script>
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
  Confirm
} from 'vux'
import Category from './category'
import PopupCategory from '@/common/category'
import { mapMutations } from 'vuex'
import * as API from '@/api/order'
import eventBus from './eventBus.js'
import ProductList from './productList'
export default {
  name: 'addArticles',
  components: {
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
    Category,
    Confirm,
    PopupCategory,
    ProductList
  },
  data () {
    return {
      currencyUnit: 'HKD',
      originPlaceList: [],
      goodsData: {
        goodsName: '',
        categoryCode: '',
        categoryName: '',
        number: 1,
        price: ''
      },
      obj: {
        firstCode: '',
        firstName: '',
        secondCode: '',
        secondName: '',
        thirdCode: '',
        thirdName: ''
      },
      flag: false,
      popupShow: false,
      isGoodsEdit: false,
      isEncrypted: '',
      hasData: true,
      productListShow: false,
      isList: false // 是否是从列表带过来的
    }
  },
  created () {
    // 是否有数据：isEncrypted=0  hasData=false， 全部都修改  (物品：test20194444, 商品：test20191111)
    // 是否有数据：isEncrypted=0  hasData=true     只能修改价格  (物品：test20193333（OK）, 商品：test2019000)
    // 是否有数据：isEncrypted=1  hasData=true     全部都修改  test9999999d
    this.isEncrypted = this.$store.state.isEncrypted
    this.hasData = this.$route.query.hasData // 判断是否有数据
    console.log(this.isEncrypted, this.hasData)
    this.currencyUnit = this.$route.query.currencyUnit || ''
    this.goodsData.originPlace = this.$route.query.originPlace
    this.goodsData._originPlace = [this.$route.query.originPlace]
    if (this.$route.query.index !== undefined) this.isGoodsEdit = true
    this.getData()
  },
  methods: {
    // 加载历史商品数据
    loadProducts () {
      this.productListShow = true
    },
    // 关闭历史商品数据
    closeProductList () {
      this.productListShow = false
    },
    // 点击申报，这里只能添加一条记录
    handlerDeclare (data) {
      this.goodsData = {
        goodsName: data.goodsName,
        categoryCode: data.categoryCode,
        categoryName: data.categoryName,
        number: 1,
        price: data.price
      }
      console.log(this.goodsData)
      this.$vux.toast.text('添加成功1条记录')
      this.productListShow = false
    },
    getData () {
      API.getOriginPlaceList().then(res => {
        if (res.code === this.GLOBAL.code) {
          for (let v of res.data) {
            v.name = v.areaName
            v.value = v.placeCode
          }
          this.originPlaceList = [res.data]
        }
      })
      if (this.isGoodsEdit) {
        // 修改
        let index = this.$route.query.index
        let data = JSON.parse(JSON.stringify(this.$store.state.orderGoodsList[index]))
        if (data.categoryCode) {
          this.isList = true
        }
        console.log(data, 'goods')
        this.goodsData = data
      }
    },
    // 打开品类选择弹窗
    handleGoodsCategory () {
      // 品类不为空，并且是从列表带过来的，则不能修改
      if (this.goodsData.categoryCode && this.isList) {
        return
      }
      this.popupShow = true
    },
    // 选择品类 点击最后区域，获取第三級數據
    selectValue (first, second, third) {
      this.popupShow = false
      this.obj.firstCode = first.categoryCode || ''
      this.obj.firstName = first.categoryName || ''
      this.obj.secondCode = second.categoryCode || ''
      this.obj.secondeName = second.categoryName || ''
      this.obj.thirdCode = third.categoryCode || ''
      this.obj.thirdName = third.categoryName || ''
      // 只傳第三級的code+name
      this.goodsData.categoryCode = third.categoryCode || ''
      this.goodsData.categoryName = third.categoryName || ''
    },
    // 原产地改变
    onOriginPlaceChange (val) {
      this.goodsData.originPlace = val[0]
    },
    onPriceFocus (val) {
      if (val === 0 || val === '0' || val === '0.00') this.goodsData.price = ''
    },
    // 价格格式
    onPriceBlur (x, $event) {
      // 保留2位小数
      var f = parseFloat(x)
      if (isNaN(f)) {
        this.goodsData.price = 0
        return false
      }
      f = Math.round(f * 100) / 100
      var s = f.toString()
      var rs = s.indexOf('.')
      if (rs < 0) {
        rs = s.length
        s += '.'
      }
      while (s.length <= rs + 2) {
        s += '0'
      }
      this.goodsData.price = s
    },
    // 保存
    handleAddGoods () {
      let arr = ['categoryCode', 'price', 'number']
      for (let v of arr) {
        if (this.goodsData[v] === '') {
          this.$vux.toast.text('必填項不能為空')
          return
        }
      }

      if (!/^[0-9]+([.]{1}[0-9]+){0,1}$/.test(this.goodsData.price) || this.goodsData.price <= 0) {
        this.$vux.toast.text('價格為大於0的數字')
        return
      }

      // this.orderData.packagePrealertGoodsVOS.push(this.goodsData)
      if (!this.isGoodsEdit) {
        // 确认新增商品
        let newItem = JSON.parse(JSON.stringify(this.goodsData))
        console.log(newItem)
        let goodsList = this.$store.state.orderGoodsList
        goodsList.push(newItem)
        this.SET_ORDER_GOODS_LIST(goodsList)
        // this.$emit('add', newItem)
        eventBus.$emit('goodsChange')
        this.backOrder()
      } else {
        // 确认修改商品
        let data = JSON.parse(JSON.stringify(this.goodsData))
        let goodsList = this.$store.state.orderGoodsList
        goodsList[this.$route.query.index] = data
        this.SET_ORDER_GOODS_LIST(goodsList)
        // this.$router.replace({ name: 'order' })
        eventBus.$emit('goodsChange')
        this.backOrder()
      }

      this.goodsDialogShow = false
      this.goodsData = {
        goodsName: '',
        categoryCode: '',
        categoryName: '',
        number: 0,
        price: ''
      }
      this.isGoodsEdit = false
    },
    backOrder () {
      // 0预报 shipments 1修改 editOrder 2认领 receiveclaim  3合箱 merge 4合箱轉單票 mergeToSingle 5用戶自助下單 selfOrder
      let obd = this.$store.state.orderBaseData
      let fpxOrderId = obd.fpxOrderId
      console.log(obd, fpxOrderId)
      if (obd.orderType === 0) {
        // 新增预报
        this.$router.replace({ name: 'shipments' })
      } else if (obd.orderType === 1) {
        // 修改
        this.$router.replace({ name: 'editOrder', query: { fpxOrderId: fpxOrderId } })
      } else if (obd.orderType === 2) {
        // 认领
        this.$router.replace({ name: 'receiveclaim', query: { fpxOrderId: fpxOrderId } })
      } else if (obd.orderType === 3) {
        // 合箱
        this.$router.replace({ name: 'merge' })
      } else if (obd.orderType === 4) {
        // 合箱轉單票
        this.$router.replace({ name: 'mergeToSingle', query: { fpxOrderId: fpxOrderId } })
      } else {
        // 默认新增预报
        this.$router.replace({ name: 'shipments' })
      }
      // this.$router.go(-1)
    },
    ...mapMutations([
      'SET_ORDER_GOODS_LIST'
    ])
  }
}
</script>

<style lang="less" scoped>
  .add-articles {
    font-size: 0.28rem;
    .history {
      text-align: right;
      margin-top: 0.2rem;
      font-size: 0.32rem;
      color: @primary;
      span {
        padding: 0.1rem 0.3rem;
        display: inline-block;
      }
    }
    .add-confirm {
      width: 90%;
      margin: 0.3rem auto 0.1rem;
      color: #fff;
      height: 0.8rem;
      line-height: 0.8rem;
      text-align: center;
      font-size: 0.32rem;
      background: @primary;
    }
  }
</style>
