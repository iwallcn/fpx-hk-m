<template>
  <div class="goods">
    <div class="item"
      v-for="(item, index) in goodsList"
      :key="index">
      <div class="infos">
        <div class="rows">
          <div class="col">{{item.goodsName}}</div>
          <div class="col2">{{item.price}}{{item.unit}}</div>
        </div>
        <p>{{item.brand}} {{item.categoryName}} {{item.originPlace}}</p>
      </div>
      <div class="btns">
        <p><i class="iconfont icon-edit"
            @click="handleEdit(index, goodsList)"></i>
          <i class="iconfont icon-delete"
            @click="handleDelete(index, goodsList)"></i></p>
        <p>
          <x-number :min="0"
            class="btns-num"
            v-model="item.number"></x-number>
        </p>
      </div>
    </div>
    <div class="nodata"
      v-show="goodsList.length == 0">
      <i class="iconfont icon-nodata"></i>
      <p>暫無數據，請添加商品</p>
    </div>
    <!-- 删除弹出框 -->
    <div v-transfer-dom>
      <confirm v-model="deleteConfirm"
        title="提示"
        @on-confirm="onConfirm">
        <p style="text-align:center;">您确定要删除吗？</p>
      </confirm>
    </div>

    <!-- 新增商品弹窗 -->
    <div v-transfer-dom>
      <x-dialog v-model="goodsDialogShow"
        class="goods-dialog">
        <div class="goods-dialog-title">
          <span>添加商品</span>
          <x-icon type="ios-close-empty"
            class="dialog-close"
            size="30"
            @click="goodsDialogShow=false"></x-icon>
        </div>
        <div class="add">
          <group gutter=".2rem"
            label-width="1.4rem"
            label-margin-right="0.2rem"
            label-align="left">
            <x-input title="*商品名稱:"
              v-model.trim="goodsData.goodsName"></x-input>
            <x-input title="*品牌:"
              v-model.trim="goodsData.brand"></x-input>
            <div class="vux-cell-box add-popup"
              @click="handleGoodsCategory"
              is-link="">
              <div class="weui-cell vux-tap-active weui-cell_access">
                <div class="weui-cell__hd"><label class="weui-label"
                    style="display: block; width: 1.4rem; text-align: left; margin-right: 0.2rem;">*品類:</label>
                </div>
                <div class="vux-cell-primary vux-popup-picker-select-box">
                  <div class="vux-popup-picker-select"
                    style="text-align: right;">
                    <span>{{goodsData.categoryName}}</span>
                  </div>
                </div>
                <div class="weui-cell__ft"></div>
              </div>
            </div>
            <popup-picker title="*產地:"
              class="add-popup"
              :data="originPlaceList"
              @on-change="onOriginPlaceChange"
              v-model="goodsData._originPlace"
              show-name
              is-link></popup-picker>
            <x-input title="*規格型號:"
              v-model.trim="goodsData.spec"></x-input>
            <x-number title="*數量:"
              class="add-number"
              v-model="goodsData.number"
              :fillable="true"
              :min="0"
              :max="100">
            </x-number>
            <x-input title="*申報單價:"
              class="weui-vcode"
              @on-blur="onPriceBlur"
              v-model.number="goodsData.price">
              <span slot="right">{{currencyUnit}}</span>
            </x-input>
            <x-input title="UPC碼:"
              ref="upcInput"
              v-model.trim="goodsData.upcNo">
            </x-input>
          </group>
          <div class="add-confirm"
            @click="handleAddGoods">保 存</div>
        </div>
      </x-dialog>
    </div>

    <!-- 商品品类弹框 -->
    <div v-transfer-dom>
      <popup v-model="categoryShow"
        class="category-popup"
        position="bottom"
        height="50%">
        <Category @close="handleCategoryClose"
          @choose="onCategoryChoose"></Category>
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
// import * as API from '@/api/myAddress'
import * as API from '@/api/order'
export default {
  name: 'goods',
  props: {
    goodsList: {
      type: Array,
      default: () => []
    },
    currencyUnit: {
      type: String,
      default: 'HKD'
    },
    originPlace: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      currentIndex: 0,
      deleteConfirm: false,
      goodsDialogShow: false,
      isGoodsEdit: false,
      categoryShow: false,
      originPlaceList: [],
      /*
        {
          brand: '苹果',
          categoryCode: 'CMS10000406',
          categoryName: '驱蚊贴',
          goodsName: '名称',
          id: '1553325373633',
          number: 1,
          originPlace: 'JP',
          price: '123',
          spec: '规格1243',
          specUnit: '',
          upcNo: ''
        }
      */
      goodsData: {
        'goodsName': '',
        'categoryName': '',
        'categoryCode': '',
        'spec': '',
        'price': 0.00,
        'brand': '',
        'originPlace': this.originPlace,
        'number': 0,
        'upcNo': '',
        'id': '',
        'specUnit': '',
        _originPlace: [this.originPlace]
      },
      currentId: ''
    }
  },
  mounted () {
    API.getOriginPlaceList().then(res => {
      if (res.code === this.GLOBAL.code) {
        for (let v of res.data) {
          v.name = v.areaName
          v.value = v.placeCode
        }
        this.originPlaceList = [res.data]
      }
    })
  },
  methods: {
    // 打开品类选择弹窗
    handleGoodsCategory () {
      this.categoryShow = true
    },
    // 原产地改变
    onOriginPlaceChange (val) {
      this.goodsData.originPlace = val[0]
    },
    // 保存
    handleAddGoods () {
      let arr = ['goodsName', 'categoryCode', 'spec', 'price', 'brand', 'originPlace', 'number']
      for (let v of arr) {
        if (this.goodsData[v] === '') {
          this.$vux.toast.text('必填项不能为空')
          return
        }
      }
      if (!/^[0-9]+([.]{1}[0-9]+){0,1}$/.test(this.goodsData.price) || this.goodsData.price <= 0) {
        this.$vux.toast.text('价格为大于0的数字')
        return
      }

      // this.orderData.packagePrealertGoodsVOS.push(this.goodsData)
      if (!this.isGoodsEdit) {
        // 确认新增商品
        let newItem = JSON.parse(JSON.stringify(this.goodsData))
        this.$emit('add', newItem)
      } else {
        // 确认修改商品
        let editItem = this.goodsList[this.currentIndex]
        editItem.goodsName = this.goodsData.goodsName
        editItem.categoryName = this.goodsData.categoryName
        editItem.categoryCode = this.goodsData.categoryCode
        editItem.spec = this.goodsData.spec
        editItem.price = this.goodsData.price
        editItem.brand = this.goodsData.brand
        editItem.originPlace = this.goodsData.originPlace
        editItem.number = this.goodsData.number
        editItem.goodsName = this.goodsData.goodsName
        editItem._originPlace = this.goodsData._originPlace
      }

      this.goodsDialogShow = false
      this.goodsData = {
        'goodsName': '',
        'categoryName': '',
        'categoryCode': '',
        'spec': '',
        'price': 0.00,
        'brand': '',
        'originPlace': this.originPlace,
        'number': 0,
        'upcNo': '',
        'id': '',
        'specUnit': '',
        _originPlace: [this.originPlace]
      }
      this.isGoodsEdit = false
    },
    // 选择品类
    onCategoryChoose (item) {
      this.goodsData.categoryName = item.categoryName
      this.goodsData.categoryCode = item.categoryCode
      this.categoryShow = false
    },
    onPriceBlur (x, $event) {
      var f = parseFloat(x)
      if (isNaN(f)) {
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
    handleCategoryClose () {
      this.categoryShow = false
    },
    // 修改商品
    handleEdit (index, rows) {
      this.currentIndex = index
      let item = rows[index]
      // this.$emit('edit', item)
      this.goodsData.goodsName = item.goodsName
      this.goodsData.categoryName = item.categoryName
      this.goodsData.categoryCode = item.categoryCode
      this.goodsData.spec = item.spec
      this.goodsData.price = item.price
      this.goodsData.brand = item.brand
      this.goodsData.originPlace = item.originPlace
      this.goodsData.number = item.number
      this.goodsData.goodsName = item.goodsName
      this.goodsData._originPlace = item._originPlace
      // this.goodsData = item
      this.isGoodsEdit = true
      this.goodsDialogShow = true
    },
    // 删除商品
    handleDelete (index) {
      this.deleteConfirm = !this.deleteConfirm
      this.currentIndex = index
    },
    // 确定删除
    onConfirm () {
      this.goodsList.splice(this.currentIndex, 1)
      this.$vux.toast.text('刪除成功')
    }
  },
  watch: {
    originPlace (val) {
      this.goodsData.originPlace = val
      this.goodsData._originPlace = [val]
    }
  },
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
    Confirm
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .goods {
    width: 100%;
    .hold {
      font-size: 0.24rem;
      color: #999;
      text-align: center;
    }
    .nodata {
      text-align: center;
      padding: 0.5rem;
      color: #999;
      background: #fff;
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
  .goods-dialog {
    &-title {
      height: 0.88rem;
      line-height: 0.88rem;
      font-size: 0.32rem;
      text-align: left;
      padding-left: 0.3rem;
      position: relative;
      .vux-close {
        color: #000;
      }
      .dialog-close {
        position: absolute;
        right: 0.2rem;
        top: 0.14rem;
      }
    }
    .add {
      font-size: 0.28rem;
      .add-confirm {
        width: 96%;
        margin: 0.2rem auto 0.1rem;
        color: #fff;
        height: 0.8rem;
        line-height: 0.8rem;
        text-align: center;
        font-size: 0.32rem;
        background: @primary;
      }
    }
  }
</style>

<style lang="less">
  .goods {
    // padding-bottom: 2rem;
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
</style>
