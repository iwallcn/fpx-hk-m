<!--  -->
<template>
  <div class='trial-wrapper'>
    <div class="country">
      <div class="country-row sp">
        <span>起運地</span>
        <span>-----</span>
        <span>目的地</span>
      </div>
      <div class="country-row">
        <span class="value-picker">
          <popup-picker :data="warehouseList"
            v-model="departureCountryLabel"
            @on-change="onWarhouseChange"
            show-name
            is-link
            placeholder="請選擇起運地"></popup-picker>
        </span>
        <span>-->--</span>
        <span class="value">
          中國香港
        </span>
      </div>
    </div>

    <group gutter=".2rem"
      label-width="2.4rem"
      label-margin-right="0.1rem"
      label-align="left">

      <popup-picker class="add-popup"
        :data="deliveryTypeList"
        @on-change="onTypeChange"
        v-model="deliveryTypeLabel"
        show-name
        is-link>
        <div slot="title"
          class="cell-label">
          <span class="cell-must">*</span>
          <span class="cell-name">派送方式</span>
        </div>
      </popup-picker>

      <cell>
        <div slot="title"
          class="cell-label">
          <span class="cell-must">*</span>
          <span class="cell-name">預估重量(kg)</span>
        </div>
        <inline-x-number style="display:block;"
          v-model="trialData.weight"
          :min=0.1
          :fillable="true"></inline-x-number>
      </cell>

      <cell :value="chargeableWeightLabel"
        @click.native="trialWeightPopup = !trialWeightPopup"
        is-link>
        <div slot="title"
          class="cell-label">
          <span class="cell-must"></span>
          <span class="cell-name">預估體積重</span>
        </div>
      </cell>

      <cell :value="categoryNameLabel"
        @click.native="popupShow = !popupShow"
        is-link>
        <div slot="title"
          class="cell-label">
          <span class="cell-must"></span>
          <span class="cell-name">包裹品類<span class="iconfont icon-close icon-clear-product"
              @click.stop="handlerClearProduct"></span></span>
        </div>
      </cell>

      <h3 class="h3">產品服務<span>以下產品服務按{{psWeight}}KG重量預估運費</span></h3>
      <template v-if="productList.length">
        <div :class="['product-item', val.hasEnabled === 'Y' ? '' : 'enabled']"
          v-for="(val, index) in productList"
          :key="index">
          <div class="left">
            <h3 class="h3"
              v-if="val.hasEnabled === 'Y'">{{val.productName}}</h3>
            <h3 class="h3"
              v-else>{{val.productName}}<span class="cause"
                @click="val.notAvailableMessage ? $vux.toast.text(val.notAvailableMessage) : '暫無原因'"><i class="iconfont icon-stop"></i>不可用原因</span></h3>
            <span>{{val.agingDesc}}</span>
          </div>
          <div class="right">
            HKD<span>{{val.amount}}</span>起
          </div>
        </div>
      </template>

      <div class="tips">
        <p>運費規則說明：</p>
        <p>一、體積重計算方法<br>
          按照國際慣例，低密度的包裹，比較其實際重量，佔用的空間通常較大，計算得出體積重量。體積重量和實際重量兩者取大者計費。<br>
          體積重量計算公式：體積重量（kg)=（長度cm X 寬度cm X 高度cm ）/ 6000</p>
        <p>二、計費重量小數點進位處理管道<br>
          國際物流續重以0.5kg為計費組織，不足時需按0.5kg計費；<br>
          例如：體積重量為1.01kg，按1.5kg計費</p>
      </div>

      <div class="btn"
        @click="$router.push({ name: 'shipments' })">去轉運</div>
    </group>

    <!-- 預估體積重彈窗 -->
    <div v-transfer-dom>
      <popup v-model="trialWeightPopup"
        class="trialWeight"
        @on-hide="trialWeightPopup = false">
        <h3>預估體積重</h3>
        <div class="tr">
          <div class="td">
            <input type="text"
              onkeyup="if(isNaN(value))execCommand('undo')"
              onafterpaste="if(isNaN(value))execCommand('undo')"
              v-model.number="trialData.length"
              placeholder="長"><span>CM</span>
          </div>
          <div class="td">
            <input type="text"
              v-model.number="trialData.width"
              onkeyup="if(isNaN(value))execCommand('undo')"
              onafterpaste="if(isNaN(value))execCommand('undo')"
              placeholder="寬"><span>CM</span>
          </div>
          <div class="td">
            <input type="text"
              v-model.number="trialData.height"
              onkeyup="if(isNaN(value))execCommand('undo')"
              onafterpaste="if(isNaN(value))execCommand('undo')"
              placeholder="高"><span>CM</span>
          </div>
        </div>
        <h3>預估體積重 =<span>{{comVolume}}</span>KG</h3>
        <div class="btn"
          @click="handlerVolume">確定</div>
      </popup>
    </div>

    <!-- 商品品类弹框 -->
    <popup-category :popupShow="popupShow"
      :firstCode="obj.firstCode"
      :secondCode="obj.secondCode"
      :thirdCode="obj.thirdCode"
      @closeAddressPopup="popupShow = false"
      @selectValue="selectValue"></popup-category>
  </div>
</template>

<script>
import { PopupPicker, Group, XInput, Cell, InlineXNumber, PopupRadio, Popup } from 'vux'
import { mapGetters } from 'vuex'
import { getWarhouseList } from '@/api/warehouse'
import { carriageTrial } from '@/api/order'
import PopupCategory from '@/common/category'
export default {
  components: { PopupPicker, Group, XInput, Cell, PopupRadio, InlineXNumber, Popup, PopupCategory },
  data () {
    return {
      warehouseList: [],
      popupShow: false,
      obj: {
        firstCode: '',
        firstName: '',
        secondCode: '',
        secondName: '',
        thirdCode: '',
        thirdName: ''
      },
      deliveryTypeList: [[{ value: '1', name: '派送' }, { value: '2', name: '自提' }]],
      trialWeightPopup: false,
      categoryNameLabel: '可提前查詢可使用哪些線路',
      chargeableWeightLabel: '輸入長寬高預估體積重',
      deliveryTypeLabel: [], // 需要是number
      departureCountryLabel: [], // 需要是string
      trialData: {
        departureCountry: '',
        destinationCountry: 'HK',
        warehouseCode: '',
        deliveryType: '',
        weight: 1,
        weightUnit: 'KGM',
        categoryCode: '',
        categoryName: '',
        volumeWeight: '',
        length: 1,
        width: 1,
        height: 1
      },
      productList: '',
      psWeight: 1
    }
  },
  created () {
    this.getData()
  },
  computed: {
    comVolume () {
      return this.GLOBAL.fixedThree(this.trialData.length * this.trialData.width * this.trialData.height / 6000)
    }
  },
  watch: {
    'trialData': { // 所有信息录入完之后开始请求产品服务接口
      handler (newVal, oldVal) {
        // 只要任何一边超过60，则产品取体积重
        if (this.trialData.length >= 60 || this.trialData.width >= 60 || this.trialData.height >= 60) {
          this.psWeight = this.comVolume > this.trialData.weight ? this.comVolume : this.trialData.weight
        } else {
          this.psWeight = this.trialData.weight
        }
        if (!this.trialData.departureCountry || !this.trialData.warehouseCode || !this.trialData.deliveryType) {
          return
        }
        this.trialData.deliveryType = this.deliveryTypeLabel[0] * 1
        carriageTrial(this.trialData).then(res => {
          if (res.code === this.GLOBAL.code) {
            this.productList = res.data
          }
        })
      },
      deep: true
    }
  },
  methods: {
    ...mapGetters(['dictData']),
    // 獲取起運倉
    getData () {
      getWarhouseList('').then(res => {
        if (res.code === this.GLOBAL.code) {
          this.warehouseList = []
          let CN = ''
          for (let v of res.data) {
            let WH = this.dictData().WH
            v.name = WH[v.warhouseId] || ''
            v.value = v.warhouseId
            if (v.departureCountry === 'CN') {
              CN = v
            } else {
              this.warehouseList.push(v)
            }
          }
          this.warehouseList.unshift(CN)
          this.warehouseList = [this.warehouseList]
        }
      })
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
      this.trialData.categoryCode = third.categoryCode || ''
      this.trialData.categoryName = third.categoryName || ''
      this.categoryNameLabel = third.categoryName || ''
    },
    handlerClearProduct () {
      this.obj.firstCode = ''
      this.obj.firstName = ''
      this.obj.secondCode = ''
      this.obj.secondeName = ''
      this.obj.thirdCode = ''
      this.obj.thirdName = ''
      this.categoryNameLabel = '可提前查詢可使用哪些線路'
      this.trialData.categoryName = ''
      this.trialData.categoryCode = ''
    },
    onTypeChange (val) {
      this.deliveryTypeLabel = val
      this.trialData.deliveryType = val[0] * 1
    },
    handlerVolume () {
      this.trialData.volumeWeight = this.comVolume
      this.chargeableWeightLabel = this.comVolume
      this.trialWeightPopup = false
    },
    // 选择仓库，获取起运仓code和国家code
    onWarhouseChange (val) {
      let obj = this.warehouseList[0].find(item => item.warhouseId === val[0])
      this.trialData.departureCountry = obj.departureCountry
      this.trialData.warehouseCode = obj.warhouseId
    }
  }
}
</script>
<style lang='less' scoped>
  @import "../../assets/less/variable.less";
  .trial-wrapper {
    font-size: 0.28rem;
    background-color: #fff;
    .country {
      .country-row.sp {
        padding-top: 0.3rem;
        span {
          color: #999;
          font-size: 0.24rem;
          &:nth-child(2n) {
            color: #fff;
            width: 10%;
          }
        }
      }
      .country-row {
        display: flex;
        justify-content: space-around;
        align-items: center;
        span {
          width: 45%;
          text-align: center;
          color: #333;
          &:nth-child(2n) {
            color: @primary;
            width: 10%;
          }
        }
      }
    }
  }
  .trialWeight {
    font-size: 0.3rem;
    background-color: #fff;
    h3 {
      font-size: 0.34rem;
      text-align: center;
      padding: 0.4rem;
      span {
        font-weight: bold;
        padding: 0 0.1rem;
      }
    }
    .tr {
      display: flex;
      background-color: #f5f5f5;
      width: 90%;
      margin: 0 auto;
      border-radius: 4px;
      .td {
        width: calc(100% / 3);
        display: flex;
        border: 1px solid #f0f0f0;
        align-items: center;
        padding: 0 0.16rem;
        input {
          width: 70%;
          background-color: #f5f5f5;
          padding: 0.3rem 0;
        }
        span {
          width: 30%;
        }
      }
    }
  }
  .icon-clear-product {
    padding: 0.08rem;
    font-size: 0.28rem;
    color: @primary;
  }
  .btn {
    width: 92%;
    border: none;
    color: #fff;
    background: #ff6400;
    padding: 0.2rem 0;
    border-radius: 4px;
    margin: 0.2rem auto;
    text-align: center;
    font-size: 0.3rem;
  }
  .h3 {
    width: 92%;
    margin: 0.3rem auto;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    span {
      font-size: 0.24rem;
      color: #999;
    }
    .cause {
      color: #74a5eb;
    }
  }
  .product-item {
    display: flex;
    width: 92%;
    margin: 0.3rem auto;
    box-shadow: 0 0 4px 1px #e8e8e8;
    border-radius: 4px;
    padding: 0.2rem;
    box-sizing: border-box;
    align-items: center;
    &.enabled {
      color: #999 !important;
      .right {
        color: #999 !important;
      }
    }
    .left {
      width: 60%;
      .h3 {
        margin: 0;
      }
      span {
        font-size: 0.24rem;
      }
    }
    .right {
      width: 40%;
      font-size: 0.24rem;
      color: @primary;
      text-align: right;
      span {
        font-size: 0.4rem;
        font-weight: bold;
        padding: 0 0.04rem;
      }
    }
  }
  .tips {
    width: 92%;
    margin: 0 auto;
    color: #999;
    font-size: 0.24rem;
    p {
      margin-bottom: 0.2rem;
      font-weight: 100;
      line-height: 0.4rem;
    }
  }
</style>
<style lang='less'>
  .trial-wrapper {
    .value-picker {
      .vux-popup-picker-select {
        text-align: center !important;
        .vux-cell-value {
          color: #333;
          font-size: 0.28rem;
        }
      }
    }
    .vux-cell-value {
      color: #333;
      font-size: 0.28rem;
    }
    .weui-cell__ft {
      font-size: 0.28rem;
      color: #333;
    }
    .cell-label {
      width: 100% !important;
      font-size: 0.28rem;
      color: #999;
    }
  }
</style>
