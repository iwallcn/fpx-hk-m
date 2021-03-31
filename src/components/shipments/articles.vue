<template>
  <div class="articles">
    <div class="item"
      v-for="(item, index) in goodsList"
      :key="index">
      <div class="item-toolbar">
        <i class="iconfont icon-copy"
          @click="handleCopy(item, items)"></i>
        <i class="iconfont icon-delete"
          @click="handleDelete(index, items)"></i>
      </div>
      <group gutter=".2rem"
        label-width="1.4rem"
        label-margin-right="0.2rem"
        label-align="left">
        <!-- <popup-picker title="*物品品類:"
          :data="categoryList"
          v-model="item._currentCategory"
          @on-change="onCategoryChange(item)"
          show-name
          is-link></popup-picker> -->
        <cell is-link
          title="*物品品類"
          class="category-select"
          @click.native="handlerGoodClick(item)"
          value-align="left"
          :value="item.categoryName">
        </cell>
        <x-input title="物品名稱"
          v-model.trim="item.goodsName"
          :max="20"></x-input>
        <x-input required
          title="*申報單價"
          v-model.trim="item.price"
          :max="20">
          <span slot="right">{{currencyUnit}}</span>
        </x-input>
        <x-number class="number-input"
          title="*數量"
          v-model="item.number"
          :fillable="true"
          :min="0"
          :max="100">
        </x-number>
      </group>
    </div>
    <div class="nodata"
      v-show="goodsList.length == 0">
      <i class="iconfont icon-nodata"></i>
      <p>暫無數據哦</p>
    </div>
    <!-- 删除弹出框 -->
    <div v-transfer-dom>
      <confirm v-model="deleteConfirm"
        title="提示"
        @on-confirm="sureConfirm">
        <p style="text-align:center;">您确定要删除吗？</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { Confirm, XNumber, Group, PopupPicker, XInput, Cell } from 'vux'
import * as API from '@/api/order'
import popupCategory from '@/common/category'
const Vue = require('vue')

export default {
  name: 'articles',
  props: {
    goodsList: {
      type: Array,
      default: () => []
    },
    currencyUnit: {
      type: String,
      default: 'HKD'
    }
  },
  data () {
    return {
      deleteConfirm: false,
      categoryList: [],
      orderInfo: {
        warhouse: [],
        fpxNo: ''
      },
      items: [
        {
          goodsName: '',
          categoryCode: '',
          categoryName: '',
          number: 0,
          price: '',
          _currentCategory: []
        }
      ],
      currentId: '',
      obj: {
        firstCode: '',
        firstName: '',
        secondCode: '',
        secondName: '',
        thirdCode: '',
        thirdName: ''
      },
      flag: false,
      item: null,
      popupCategory: null
    }
  },
  created () {
    this.getData()
    // this.goodsList = this.items
    const PopupCategory = Vue.extend(popupCategory)
    this.popupCategory = new PopupCategory({
      propsData: {
        popupShow: this.flag,
        firstCode: this.obj.firstCode,
        secondCode: this.obj.secondCode,
        thirdCode: this.obj.thirdCode
      }
    })
    this.popupCategory.$on('selectValue', this.selectValue)
    this.popupCategory.$on('closeAddressPopup', () => {
      this.popupCategory.popupShow = false
    })
  },
  mounted () {
    const div = document.createElement('div')
    document.body.appendChild(div)
    this.popupCategory.$mount(div)
  },
  methods: {
    getData () {
      API.getCategoryBasicList({ categoryName: '' }).then(res => {
        if (res.code === this.GLOBAL.code) {
          for (let v of res.data) {
            v.name = v.categoryName
            v.value = v.categoryCode
          }
          this.categoryList = [res.data] || []
        }
      })
    },
    onCategoryChange (item) {
      let code = item._currentCategory[0]
      if (!code) return
      for (let v of this.categoryList[0]) {
        if (v.categoryCode === code) {
          item.categoryCode = code
          item.categoryName = v.categoryName
        }
      }
    },
    handleCopy (item, rows) {
      let newItem = JSON.parse(JSON.stringify(item))
      this.$emit('add', newItem)
    },
    handleDelete (index, rows) {
      this.$emit('delete', index)
    },
    // 新增编辑地址
    handlerEdit (item, flag) {
    },
    // 删除地址
    handlerDelete (id) {
      this.deleteConfirm = !this.deleteConfirm
      this.currentId = id
    },
    // 确定删除
    sureConfirm () {
    },
    // 点击最后区域，获取第三級數據
    selectValue (first, second, third) {
      this.popupCategory.popupShow = false
      this.obj.firstCode = first.categoryCode || ''
      this.obj.firstName = first.categoryName || ''
      this.obj.secondCode = second.categoryCode || ''
      this.obj.secondeName = second.categoryName || ''
      this.obj.thirdCode = third.categoryCode || ''
      this.obj.thirdName = third.categoryName || ''
      // 只傳第三級的code+name
      this.item.categoryCode = third.categoryCode || ''
      this.item.categoryName = third.categoryName || ''
      this.item = null
    },
    // 點擊物品品類彈出三級聯動
    handlerGoodClick (item) {
      this.popupCategory.popupShow = true
      this.item = item
    }
  },
  components: {
    Confirm,
    XNumber,
    Group,
    PopupPicker,
    XInput,
    Cell
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .articles {
    width: 100%;
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
      padding: 0.1rem 0.3rem;
      margin-bottom: 0.2rem;
      &-toolbar {
        height: 0.6rem;
        line-height: 0.6rem;
        position: relative;
        .iconfont {
          font-size: 0.5rem;
          color: @primary;
          padding: 0.1rem;
          position: absolute;
          top: 0.1rem;
        }
        .icon-delete {
          right: 0.3rem;
        }
        .icon-copy {
          right: 1rem;
        }
      }
    }
  }
</style>

<style lang="less">
  .articles {
    .number-input {
      font-size: 0.26rem;
    }
    .category-select {
      font-size: 0.26rem;
    }
  }
</style>
