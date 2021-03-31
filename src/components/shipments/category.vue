<template>
  <div class="category">
    <div class="pop-title">
      <x-icon type="ios-close-empty"
        class="pop-title-close"
        size="30"
        @click="handleClose"></x-icon>
      选择品类
    </div>
    <div class="pop-content">
      <div class="category-commonly">
        <p class="category-commonly-title">最近使用</p>
        <span v-for="item in commonlyList"
          class="category-commonly-item"
          :key="item.categoryCode"
          @click="handleCommonlyItem(item)">
          {{item.categoryName}}
        </span>
      </div>
      <div class="pop-list-wrapper">
        <div class="pop-list-item"
          v-for="(category, categoryIndex) in categoryList"
          :key="categoryIndex"
          @click="onClickCategory(category)">
          {{category.categoryName}}
        </div>
      </div>
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
  XButton
} from 'vux'
import * as API from '@/api/order'
export default {
  name: 'category',
  props: {
    departureCountry: {
      type: String,
      default: ''
    },
    warhouseCode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      currentLevel: 0,
      commonlyList: [],
      searchVal: '',
      categoryList: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.getCommonly()
      this.getCategory()
    },
    getCommonly () {
      API.getCommonlyCategory().then(res => {
        if (res.code === this.GLOBAL.code) {
          this.commonlyList = res.data
        }
      })
    },
    getCategory () {
      API.getFirstCategoryList().then(res => {
        if (res.code === this.GLOBAL.code) {
          this.categoryList = res.data
        }
      })
    },
    onClickCategory (item) {
      if (this.currentLevel < 2) {
        this.getNextLevel(item)
      } else {
        this.handleChoose(item)
      }
    },
    getNextLevel (item) {
      if (this.currentLevel === 0) {
        let data = {
          categoryCode: item.categoryCode
        }
        API.getSecondCategoryList(data).then(res => {
          if (res.code === this.GLOBAL.code) {
            this.currentLevel = 1
            this.categoryList = res.data
          }
        })
      } else {
        let data = {
          categoryCode: item.categoryCode,
          departureCountry: this.departureCountry,
          destinationCountry: '',
          warhouseCode: this.warhouseCode
        }
        API.getDeclareProductList(data).then(res => {
          if (res.code === this.GLOBAL.code) {
            this.currentLevel = 2
            this.categoryList = res.data
          }
        })
      }
    },
    handleCommonlyItem (item) {
      this.$emit('choose', item)
      this.currentLevel = 0
      this.getCategory()
    },
    handleChoose (item) {
      this.$emit('choose', item)
      this.currentLevel = 0
      this.getCategory()
    },
    handleClose () {
      this.$emit('close')
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
    XButton
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .category {
    height: 100%;
    font-size: 0.28rem;
    .pop-title {
      font-size: 0.32rem;
      background: #fff;
      height: 0.68rem;
      line-height: 0.68rem;
      text-align: left;
      position: relative;
      padding: 0.1rem;
      &-close {
        position: absolute;
        right: 0;
        top: 0.16rem;
      }
    }
    .pop-content {
      height: calc(~"100% - .88rem");
      overflow-y: auto;
      .category-commonly {
        min-height: 1rem;
        padding: 0.3rem;
        background: #fff;
        overflow: hidden;
        .category-commonly-title {
          height: 0.4rem;
          line-height: 0.4rem;
          margin-bottom: 0.2rem;
        }
        .category-commonly-item {
          padding: 0.1rem 0.2rem;
          background: @primary;
          margin-right: 0.2rem;
          margin-top: 0.2rem;
          color: #fff;
          display: inline-block;
        }
      }
      .pop-list-wrapper {
        .pop-list-item {
          height: 0.8rem;
          line-height: 0.8rem;
          color: @primary;
          padding-left: 0.3rem;
          & .active {
            background: #fdf0e5;
          }
        }
      }
    }
  }
</style>
