<template>
  <div class="popup-address"
    :class="popupShow ? 'popup-show': ''">
    <div class="popup-content">
      <div class="popup-title">所属地区 <i class="iconfont icon-close"
          @click="addressPanel"></i></div>
      <div class="popup-body">
        <ul class="popup-place vux-1px-b">
          <li class="area"
            :class="index === 0 ? 'active': ''"
            @click="handleProvince">{{clickPro ? clickPro.nameChinese: '請選擇'}}
          </li>

          <li class="area"
            :class="index === 1 ? 'active' : ''"
            v-show="clickPro"
            @click="handlerCity">{{clickPro && clickCity ? clickCity.nameChinese: '請選擇'}}</li>

          <li class="area"
            :class="index === 2 ? 'active' : ''"
            v-show="clickCity"
            @click="handlerDistrict">{{clickPro && clickCity && clickDist ? clickDist.nameChinese: '請選擇'}}</li>
        </ul>

        <ul class="popup-ul">
          <li v-for="(prov, provIndex) in provinceList[countryCode]"
            :key="prov.code"
            v-show="showProvince"
            @click="getProvinceInfo(prov, provIndex)"
            :class="clickPro.code === prov.code ? 'on': ''">{{prov.nameChinese}}</li>

          <li v-for="(city, cityIndex) in cityList[clickPro.code]"
            :key="city.code"
            v-show="showCity"
            @click="getCityInfo(city, cityIndex)"
            :class="clickCity.code === city.code ? 'on': ''">{{city.nameChinese}}</li>

          <li v-for="(dist, distIndex) in districtList[clickCity.code]"
            :key="dist.code"
            v-show="showDistrict"
            @click="getDistrictInfo(dist, distIndex)"
            :class="clickDist.code === dist.code ? 'on': ''">{{dist.nameChinese}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>

import { getChildArea } from '@/api/myAddress'
import { mapMutations, mapGetters } from 'vuex'
import { InlineLoading } from 'vux'
// const COUNTRYCODE = 485

export default {
  name: 'popupAddress',
  props: {
    popupShow: {
      type: Boolean,
      default: false
    },
    province: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    district: {
      type: String,
      default: ''
    },
    setCountryCode: {
      type: Number,
      default: 460 // 默认香港地址
    }
  },
  data () {
    return {
      countryCode: '', // 设置当前取哪个国家地址，比如中国香港460，中国大陆485
      index: 0,
      provinceList: {}, // 数据集合
      cityList: {},
      districtList: {},
      showProvince: false, // 用来控制显示隐藏
      showCity: false,
      showDistrict: false,
      clickPro: '', // 记录点击的省份
      clickCity: '', // 记录点击的城市
      clickDist: '' // 记录点击的区域
    }
  },
  created () {
    this.countryCode = this.setCountryCode
    // 由于有两份地址，所以每次初始化时，把缓存中的地址清空
    this.SET_PROVINCEDATA(null)
    this.SET_CITYDATA(null)
    this.SET_DISTRICTDATA(null)
    this.getProvince()
  },
  methods: {
    setClick () {
      /**
       * 针对编辑状态，则会传province，city，district对应的名字
       * 1. 先从缓存中获取一级数据，然后根据province匹配找到地址面板中对应的列，让其选中；然后从缓存中获取二级数据，如果缓存中有二级数据
       * 则根据city去匹配，找到了，则让其选中，找不到，则重新加载二级数据让其选中，三级数据以此类推。
       */
      console.log(this.province, this.city, this.district)
      let that = this
      let p = that.provinceData()
      if (that.province && p && p[this.countryCode]) {
        that.clickPro = (p[this.countryCode].filter((item) => item.nameChinese === that.province))[0]
        let pcode = that.clickPro.code
        let c = that.cityData() // 从缓存中取所有二级数据
        // 缓存中二级数据不为空，则去判断二级数据中是否存在传过的市数据；如果二级数据为空，则根据省code加载二级数据
        if (c && c[pcode]) {
          that.clickCity = c[pcode].filter((val) => val.nameChinese === that.city)[0] // 设置当前地址面板市级选中，并获取市级code
          if (that.clickCity) { // 找到了，
            that.cityList = c // 设置二级数据
            let d = that.districtData()
            let ccode = that.clickCity.code
            if (d && d[ccode]) { // 如果缓存中有三级数据，则设置三级数据选中
              that.clickDist = d[ccode].filter((val) => val.nameChinese === that.district)[0]
            }
          } else { // 没找到，重新加载
            getChildArea(pcode).then(res => {
              let that = this
              if (res.code === that.GLOBAL.code && res.data.length) {
                let d = that.cityData()
                d[pcode] = res.data
                that.cityList = d
                that.SET_CITYDATA(that.cityList)
                that.clickCity = d[pcode].filter((val) => val.nameChinese === that.city)[0]
              }
            })
          }
        } else {
          getChildArea(pcode).then(res => {
            let that = this
            if (res.code === that.GLOBAL.code && res.data.length) {
              let data = res.data
              let list = that.cityData() ? that.cityData() : that.cityList
              list[pcode] = data
              that.cityList = list
              that.SET_CITYDATA(that.cityList)
              that.clickCity = data.filter((val) => val.nameChinese === that.city)[0]
            }
          })
        }
        that.index = 1
        that.showProvince = false
        that.showCity = true
        that.showDistrict = false
      }
    },
    // 点击弹出框中的关闭按钮
    addressPanel () {
      this.$emit('closeAddressPopup')
    },
    // 获取省份
    getProvince () {
      this.showProvince = true
      if (!this.provinceData()) {
        getChildArea(this.countryCode).then(res => {
          if (res.code === this.GLOBAL.code) {
            this.provinceList[this.countryCode] = res.data
            this.SET_PROVINCEDATA(this.provinceList)
            // 如果是编辑状态，记录下对应的省份，城市，区域；
            this.setClick()
          }
        })
      } else {
        this.provinceList = this.provinceData()
        // 如果是编辑状态，记录下对应的省份，城市，区域；
        this.setClick()
      }
    },
    // 点击某一项省份
    getProvinceInfo (item, index) {
      this.clickPro = item
      this.clickCity = ''
      this.clickDist = ''
      if (!this.cityData() || !this.cityData()[item.code]) {
        getChildArea(item.code).then(res => {
          if (res.code === this.GLOBAL.code && res.data.length > 0) {
            this.index = 1
            let list = this.cityData() ? this.cityData() : this.cityList
            list[item.code] = res.data
            this.cityList = list
            this.showProvince = false
            this.showCity = true
            this.SET_CITYDATA(this.cityList)
          } else {
            this.$emit('selectValue', this.clickPro, '', '')
            this.index = 0
          }
        })
      } else {
        this.cityList = this.cityData()
        this.showProvince = false
        this.showCity = true
      }
    },
    // 点击某一项城市
    getCityInfo (item, index) {
      this.clickCity = item
      this.clickDist = ''
      if (!this.districtData() || !this.districtData()[item.code]) {
        getChildArea(item.code).then(res => {
          if (res.code === this.GLOBAL.code && res.data.length > 0) {
            this.index = 2
            let list = this.districtData() ? this.districtData() : this.districtList
            list[item.code] = res.data
            this.districtList = list
            this.showCity = false
            this.showDistrict = true
            this.SET_DISTRICTDATA(this.districtList)
          } else {
            this.$emit('selectValue', this.clickPro, this.clickCity, '')
            this.index = 1
          }
        })
      } else {
        this.districtList = this.districtData()
        this.showCity = false
        this.showDistrict = true
      }
    },
    // 点击某一项区域
    getDistrictInfo (item, index) {
      this.showProvince = false
      this.showCity = false
      this.showDistrict = true
      this.clickDist = item
      this.$emit('selectValue', this.clickPro, this.clickCity, this.clickDist)
    },
    // 点击省份选择
    handleProvince () {
      this.index = 0
      this.showProvince = true
      this.showCity = false
      this.showDistrict = false
    },
    // 点击城市选择
    handlerCity () {
      this.index = 1
      this.showProvince = false
      this.showCity = true
      this.showDistrict = false
      if (this.city && this.clickCity) {
        this.cityList[this.clickPro.code] = this.cityData()[this.clickPro.code]
      }
    },
    // 点击区域选择
    handlerDistrict () {
      this.index = 2
      this.showProvince = false
      this.showCity = false
      this.showDistrict = true
      if (this.district && this.clickPro) {
        this.districtList[this.clickCity.code] = this.districtData()[this.clickCity.code]
      }
    },
    ...mapMutations(['SET_PROVINCEDATA', 'SET_CITYDATA', 'SET_DISTRICTDATA']),
    ...mapGetters(['provinceData', 'cityData', 'districtData'])
  },
  components: {
    InlineLoading
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .popup-address {
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
