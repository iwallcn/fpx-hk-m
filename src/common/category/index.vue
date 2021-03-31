<template>
  <div class="popup-category"
    :class="popupShow ? 'popup-show': ''">
    <div class="popup-content">
      <div class="popup-title">所属品类 <i class="iconfont icon-close"
          @click="addressPanel"></i></div>
      <div class="popup-body">
        <ul class="popup-place vux-1px-b">
          <li class="area"
            :class="index === 0 ? 'active': ''"
            @click="handleFirst">{{clickFirst ? clickFirst.categoryName: '請選擇'}}
          </li>

          <li class="area"
            :class="index === 1 ? 'active' : ''"
            v-show="clickFirst"
            @click="handleSecond">{{clickFirst && clickSecond ? clickSecond.categoryName: '請選擇'}}</li>

          <li class="area"
            :class="index === 2 ? 'active' : ''"
            v-show="clickSecond"
            @click="handleThird">{{clickFirst && clickSecond && clickThird ? clickThird.categoryName: '請選擇'}}</li>
        </ul>

        <ul class="popup-ul">
          <li v-for="(item, firstIndex) in firstList"
            :key="item.categoryCode"
            v-show="showFirst"
            @click="getFirstInfo(item, firstIndex)"
            :class="clickFirst.categoryCode === item.categoryCode ? 'on': ''">{{item.categoryName}}</li>

          <li v-for="(item, secondIndex) in secondList"
            :key="item.categoryCode"
            v-show="showSecond"
            @click="getSecondInfo(item, secondIndex)"
            :class="clickSecond.categoryCode === item.categoryCode ? 'on': ''">{{item.categoryName}}</li>

          <li v-for="(item, thirdIndex) in thirdList"
            :key="item.categoryCode"
            v-show="showThird"
            @click="getThirdInfo(item, thirdIndex)"
            :class="clickThird.categoryCode === item.categoryCode ? 'on': ''">{{item.categoryName}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getFirstCategoryList, getSecondCategoryList, getDeclareProductList } from '@/api/order'
import { InlineLoading } from 'vux'
export default {
  name: 'popupCategory',
  props: {
    popupShow: {
      type: Boolean,
      default: false
    },
    firstCode: {
      type: String,
      default: ''
    },
    secondCode: {
      type: String,
      default: ''
    },
    thirdCode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      index: 0,
      firstList: [], // 数据集合
      secondList: [],
      thirdList: [],
      showFirst: false, // 用来控制显示隐藏
      showSecond: false,
      showThird: false,
      clickFirst: '', // 记录点击的一级
      clickSecond: '',
      clickThird: ''
    }
  },
  created () {
    this.getFirstData()
  },
  methods: {
    // 点击弹出框中的关闭按钮
    addressPanel () {
      this.$emit('closeAddressPopup')
    },
    getFirstData () {
      this.showFirst = true
      getFirstCategoryList().then(res => {
        if (res.code === this.GLOBAL.code) {
          this.firstList = res.data
          // 如果是编辑状态，记录下对应的省份，城市，区域；
          // this.setClick()
        }
      })
    },
    // 点击一级数据
    getFirstInfo (item, index) {
      this.clickFirst = item
      this.clickSecond = ''
      this.clickThird = ''
      getSecondCategoryList({categoryCode: item.categoryCode}).then(res => {
        if (res.code === this.GLOBAL.code && res.data.length) {
          this.index = 1
          this.secondList = res.data
          this.showFirst = false
          this.showSecond = true
        } else {
          this.$emit('selectValue', this.clickFirst, '', '')
          this.index = 0
        }
      })
    },
    // 点击二级数据
    getSecondInfo (item, index) {
      this.clickSecond = item
      this.clickThird = ''
      getDeclareProductList({categoryCode: item.categoryCode}).then(res => {
        if (res.code === this.GLOBAL.code && res.data.length) {
          this.index = 2
          this.thirdList = res.data
          this.showSecond = false
          this.showThird = true
        } else {
          this.$emit('selectValue', this.clickFirst, this.clickSecond, '')
          this.index = 1
        }
      })
    },
    // 点击某一项区域
    getThirdInfo (item, index) {
      this.showFirst = false
      this.showSecond = false
      this.showThird = true
      this.clickThird = item
      console.log(item, 44444)
      this.$emit('selectValue', this.clickFirst, this.clickSecond, this.clickThird)
    },
    // 点击省份选择
    handleFirst () {
      this.index = 0
      this.showFirst = true
      this.showSecond = false
      this.showThird = false
    },
    // 点击城市选择
    handleSecond () {
      this.index = 1
      this.showFirst = false
      this.showSecond = true
      this.showThird = false
      // if (this.city && this.clickSecond) {
      //   this.secondList[this.clickFirst.code] = this.cityData()[this.clickFirst.code]
      // }
    },
    // 点击区域选择
    handleThird () {
      this.index = 2
      this.showFirst = false
      this.showSecond = false
      this.showThird = true
      // if (this.district && this.clickFirst) {
      //   this.thirdList[this.clickSecond.code] = this.districtData()[this.clickSecond.code]
      // }
    }
  },
  components: {
    InlineLoading
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .popup-category {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    &.popup-show {
      opacity: 1;
      z-index: 110;
      transition: all 0.3s;
    }
    .popup-content {
      bottom: 0;
      width: 100%;
      background-color: #fff;
      position: absolute;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
      height: 60%;
      font-size: 0.28rem;
      .popup-title {
        position: relative;
        height: 12%;
        align-items: center;
        background-color: #f2f2f2;
        padding-left: 0.2rem;
        display: flex;
        justify-content: space-between;
        i {
          color: @error;
          padding: 0 0.2rem;
        }
      }
      .popup-body {
        height: 88%;
        .popup-place {
          overflow: hidden;
          padding: 0 10px;
          position: relative;
          height: 13.65%;
          line-height: 13.65%;
          background: #fff;
          li.area {
            float: left;
            margin-right: 0.2rem;
            height: 98%;
            max-width: 2rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;
            align-items: center;
            &.active {
              color: @error;
              border-bottom: 1px solid @error;
            }
          }
        }
        .popup-ul {
          background-color: #fff;
          padding: 0.1rem 0.2rem;
          height: 86.35%;
          overflow-y: auto;
          li {
            position: relative;
            padding: 0.2rem 0;
            font-size: 0.28rem;
            &:last-child {
              padding-bottom: 0.4rem;
            }
            &.on {
              color: @error;
              &:after {
                content: "√";
                position: absolute;
                padding-left: 0.1rem;
                font-weight: bold;
              }
            }
          }
        }
      }
    }
  }
</style>
