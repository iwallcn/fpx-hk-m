<template>
  <div class="mainland">
    <group class="first-cell"
      label-width="1.7rem"
      label-align="left">
      <search v-model="selfValue"
        position="relative"
        top="0.96rem"
        placeholder="搜索自提地址"
        @on-result-click="resultClick"
        @on-change="getResult"
        :results="results"></search>
      <x-input v-model="obj.recipientsName"
        title="姓名"
        placeholder="請輸入姓名"></x-input>
      <popup-picker :data="areaList"
        title="電話區號"
        :columns="3"
        class="picker"
        v-model="areaCode"
        value-text-align="left"
        show-name></popup-picker>
      <x-input title="請輸入電話"
        v-model="obj.phoneNumber"
        placeholder="電話" />
      <cell is-link
        title="收件地址"
        class="require"
        @click.native="addressPanel"
        value-align="left">
        <p>
          {{obj.pickAddressInfo.province === '' ? "請選擇" : calcAddress}}
        </p>
      </cell>
      <popup-picker :data="pickupList"
        :title="this.obj.deliveryType === 1 ? '選擇自提點' : '選擇智能柜'"
        :columns="3"
        class="picker"
        v-model="pickUpCode"
        @on-show="handlerPickupShow"
        :show.sync="showPopupPicker"
        value-text-align="left"
        show-name></popup-picker>
    </group>

    <group>
      <x-switch title="設為默認地址"
        v-model="obj.defaultFlag"
        @on-click="switchDefault"></x-switch>
    </group>
    <div class="hold"></div>

    <footer class="footer-fixed">
      <button :class="[{disabled: disabled}, 'btn-ml']"
        :disabled="disabled"
        @click="handlerSave">保 存</button>
    </footer>

    <!-- 地址选择,popupShow是否显示，省份数据 陕西省 西安市 新城区-->
    <popup-address :popupShow="flag"
      :province="obj.pickAddressInfo.province"
      :city="obj.pickAddressInfo.city"
      :district="obj.pickAddressInfo.district"
      @selectValue="selectValue"
      @closeAddressPopup="addressPanel"></popup-address>
  </div>
</template>

<script>
import { Group, Cell, CellBox, XInput, Alert, XSwitch, PopupPicker, Search } from 'vux'
import upload from '@/common/upload'
import PopupAddress from '@/common/address'
import * as API from '@/api/myAddress'
import { mapGetters, mapMutations } from 'vuex'
const HKCODE = 460

export default {
  name: 'sendEdit',
  data () {
    return {
      obj: {
        defaultFlag: false,
        phoneNumber: '',
        pickUpCode: '',
        recipientsId: '',
        recipientsName: '',
        areaCode: '',
        pickAddressInfo: {
          country: '中國香港',
          province: '',
          city: '',
          district: '',
          street: '',
          address: ''
        },
        deliveryType: 1 // 2 自提柜 1-自提点
      },
      flag: false,
      editAdd: '', // 編輯還是新增類型
      disabled: true,
      areaList: [{ name: '中國大陸+86', value: '+86' }, { name: '中國香港+852', value: '+852' }],
      pickupList: [],
      pickUpCode: [],
      areaCode: ['+852'],
      provinceCode: '', // 省份code
      cityCode: '', // 城市code
      showPopupPicker: false,
      selfValue: '', // 自提仓搜索
      results: [],
      searchSelect: null // 搜索自提倉地址選擇某一項記錄
    }
  },
  created () {
    this.obj.deliveryType = this.$route.query.deliveryType
    this.editAdd = this.$route.query.editAdd
    // 獲取從編輯頁面過來的用戶信息
    this.getData()
  },
  mounted () {
    // if (this.obj.deliveryType === 1) {
    //   this.$route.meta.title = '常用自提點'
    // } else {
    //   this.$route.meta.title = '常用智能柜'
    // }
    // setTimeout(() => {
    //   this.$forceUpdate()
    // })
  },
  computed: {
    calcAddress () {
      let p = this.obj.pickAddressInfo.province || ''
      let c = this.obj.pickAddressInfo.city || ''
      let d = this.obj.pickAddressInfo.district || ''
      return `${p} ${c} ${d}`
    }
  },
  methods: {
    // 模糊查詢自提點
    getResult () {
      if (this.obj.deliveryType === 1) {
        API.getByFuzzy(this.selfValue).then(res => {
          this.results = []
          if (res.code === this.GLOBAL.code) {
            if (!res.data || !res.data.length) {
              return
            }
            res.data.forEach(val => {
              this.results.push({
                address: val.address,
                city: val.city,
                deliveryType: val.deliveryType,
                district: val.district,
                openingTime: val.openingTime,
                pickupCode: val.pickupCode,
                pickupName: val.pickupName,
                province: val.province,
                pudoCode: val.pudoCode,
                title: val.pickupName
              })
            })
          }
        })
      } else {
        API.getLockerByFuzzy(this.selfValue).then(res => {
          this.results = []
          if (res.code === this.GLOBAL.code) {
            if (!res.data || !res.data.length) {
              return
            }
            res.data.forEach(val => {
              this.results.push({
                address: val.address,
                city: val.city,
                deliveryType: val.deliveryType,
                district: val.district,
                openingTime: val.openingTime,
                pickupCode: val.pickupCode,
                pickupName: val.pickupName,
                province: val.province,
                pudoCode: val.pudoCode,
                title: val.pickupName
              })
            })
          }
        })
      }
    },
    // 自提點搜索結果面板中點擊任意一項
    resultClick (item) {
      this.selfValue = item.title
      this.searchSelect = item
      // 選中列表自提點之后，設置省市自提點
      this.obj.pickAddressInfo.province = item.province
      this.obj.pickAddressInfo.city = item.city
      this.pickupList = []
      this.pickupList.push({
        name: item.pickupName,
        value: item.pudoCode
      })
      this.pickUpCode = [item.pudoCode]
    },
    getData () {
      if (this.editAdd === 'edit') {
        this.areaCode = [this.currentUserAddress().areaCode]
        this.pickUpCode = [this.currentUserAddress().pickUpCode]
        let active = this.currentUserAddress()
        this.obj = {
          defaultFlag: active.defaultFlag,
          phoneNumber: active.phoneNumber,
          pickUpCode: active.pickUpCode,
          recipientsId: active.recipientsId,
          recipientsName: active.recipientsName,
          areaCode: active.areaCode,
          pickAddressInfo: {
            country: HKCODE, // TODO
            province: active.province,
            city: active.city,
            district: '',
            // street: active.,
            address: active.pickUpAddress
          },
          deliveryType: this.obj.deliveryType
        }
      }
    },
    // 设置默认地址
    switchDefault (newVal, oldVal) {
    },
    // 点击所在地区，弹出地址选择面板，并加载省份数据这里默认是加载香港，所以传香港460
    addressPanel () {
      this.flag = !this.flag
    },
    // 点击最后区域，获取省市区
    selectValue (pro, city, dis) {
      this.flag = !this.flag
      this.obj.pickAddressInfo.province = pro.nameChinese || ''
      this.obj.pickAddressInfo.city = city.nameChinese || ''
      this.obj.pickAddressInfo.district = dis.nameChinese || ''
      // 保存選擇的省市code
      this.provinceCode = pro.code
      this.cityCode = city.code
      this.getHkPudoOrLockerInfoList()
    },
    // 编辑新增地址
    handlerSave () {
      // let _this = this
      this.obj.areaCode = this.areaCode[0]
      this.obj.pickUpCode = this.pickUpCode[0]
      if (!this.obj.recipientsName.trim()) {
        this.$vux.toast.text('請輸入姓名')
        return
      }
      if (!this.obj.phoneNumber) {
        this.$vux.toast.text('请输入手機號碼')
        return
      }
      if (!this.obj.pickAddressInfo.province) {
        this.$vux.toast.text('收件地址不能為空')
        return
      }
      if (!this.pickUpCode.length) {
        this.$vux.toast.text('自提點信息不能為空')
        return
      }
      // 如果是新增，則判斷格式是否正確大陸11位，香港8位；如果是編輯，則要做脫敏，前三后四中間是星號
      if (this.editAdd === 'edit') {
        if (this.areaCode[0] === '+852' && !(/^(\d{3})([*]{1})(\d{4})$/.test(this.obj.phoneNumber) || /^\d{8}$/.test(this.obj.phoneNumber))) { // 香港8位脫敏校验
          this.$vux.toast.text('手機號碼不對')
          return
        }
        if (this.areaCode[0] === '+86' && !(/^(\d{3})([*]{4})(\d{4})$/.test(this.obj.phoneNumber) || /^((1[0-9]{1})+\d{9})$/.test(this.obj.phoneNumber))) { // 大陸11位脫敏校验
          this.$vux.toast.text('手機號碼不對')
          return
        }
        delete this.obj.pickAddressInfo
        API.editPickUpRecipients(this.obj).then(res => {
          this.$vux.toast.text(res.message)
          if (res.code === this.GLOBAL.code) {
            // this.$router.push({ name: 'addresses' })
            if (this.$route.query.from === 'order') {
              this.$router.push({ name: 'addresses', query: { from: 'order' } })
            } else {
              this.$router.push({ name: 'addresses' })
            }
          }
        })
      } else {
        if (this.areaCode[0] === '+852' && !/^\d{8}$/.test(this.obj.phoneNumber)) { // 香港号码校验
          this.$vux.toast.text('手機號碼不對')
          return
        }
        if (this.areaCode[0] === '+86' && !/^((1[0-9]{1})+\d{9})$/.test(this.obj.phoneNumber)) { // 大陆号码校验
          this.$vux.toast.text('手機號碼不對')
          return
        }
        delete this.obj.pickAddressInfo
        API.addPickUpRecipients(this.obj).then(res => {
          this.$vux.toast.text(res.message)
          if (res.code === this.GLOBAL.code) {
            if (this.$route.query.from === 'order') {
              this.$router.push({ name: 'addresses', query: { from: 'order' } })
            } else {
              this.$router.push({ name: 'addresses' })
            }
            // TODO
            // if (this.$route.name !== 'order') {
            //   this.$router.push({ name: 'addresses' })
            // } else {
            //   this.$emit('update', this.obj.deliveryType)
            // }
          }
        })
      }
    },
    // 根据地址获取自提点、自提柜
    getHkPudoOrLockerInfoList () {
      let arr = [this.obj.pickAddressInfo.province, this.obj.pickAddressInfo.city, this.obj.deliveryType]
      API.getHkPudoOrLockerInfoList(arr).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.pickupList = []
          res.data.forEach(val => {
            let obj = {
              name: val.pickupName,
              value: val.pudoCode
            }
            this.pickupList.push(obj)
          })
        }
      })
    },
    // 自提点弹出框显示时，判断是否已经选择了省市，如果没有选，则提示要先选择省市
    handlerPickupShow () {
      if (!this.obj.pickAddressInfo.province || !this.obj.pickAddressInfo.city) {
        this.$vux.toast.text('請先選擇地址')
        this.showPopupPicker = false
        return
      }
      this.showPopupPicker = true
    },
    isNull () {
      if (this.obj.recipientsName.trim() && this.obj.phoneNumber.trim() && this.obj.pickAddressInfo.province && this.pickUpCode.length) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    ...mapMutations(['SET_CITYDATA']),
    ...mapGetters(['currentUserAddress', 'provinceData', 'cityData', 'districtData'])
  },
  watch: {
    // 如果是編輯，則監聽該編輯信息，根據省市名稱獲取code
    // obj () {
    //   let province = this.obj.pickAddressInfo.province
    //   let city = this.obj.pickAddressInfo.city
    //   let that = this
    //   let p = that.provinceData()
    //   if (province && p && p[HKCODE]) {
    //     that.provinceCode = ((p[HKCODE].filter((item) => item.nameChinese === province))[0]).code
    //   }
    //   let c = that.cityData() || {}
    //   if (city) {
    //     if (c && c[that.provinceCode]) {
    //       that.cityCode = ((c[that.provinceCode].filter(item => item.nameChinese === city))[0]).code
    //     } else { // 如果緩存中沒有該城市，則需要請求接口
    //       API.getChildArea(that.provinceCode).then(res => {
    //         if (res.code === that.GLOBAL.code) {
    //           c[that.provinceCode] = res.data
    //           that.SET_CITYDATA(c)
    //           let data = that.cityData()
    //           that.cityCode = ((data[that.provinceCode].filter(item => item.nameChinese === city))[0]).code
    //         }
    //       })
    //     }
    //   }
    // },
    // 如果獲取到城市code，則根據省市code加載自提點列表信息
    cityCode () {
      this.getHkPudoOrLockerInfoList()
      setTimeout(() => {
        if (this.obj.pickUpCode) {
          this.pickUpCode = [this.obj.pickUpCode]
        }
      }, 100)
    },
    'obj.recipientsName' () {
      this.isNull()
    },
    'obj.phoneNumber' () {
      this.isNull()
    },
    'obj.pickAddressInfo.province' () {
      this.isNull()
    },
    'pickUpCode' () {
      console.log(this.pickUpCode, 444)
      this.isNull()
    }
  },
  components: {
    Group,
    Cell,
    CellBox,
    XInput,
    Alert,
    XSwitch,
    PopupAddress,
    upload,
    PopupPicker,
    Search
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .mainland {
    .hold {
      height: 1.6rem;
    }
    .infos {
      padding: 0.2rem 0.3rem !important;
      display: flex;
      justify-content: space-between;
      div {
        &.font1 {
          span {
            font-size: 0.24rem;
            color: #999;
          }
        }
        &.font3 {
          color: @primary;
        }
      }
    }
    .card-wrapper {
      display: flex;
      text-align: center;
      align-items: center;
      padding: 0.2rem 0rem 0.4rem 0;
      .card-col {
        width: 50%;
        flex: 0.5 0 auto;
        img {
          max-width: 100%;
        }
      }
    }
  }
  .remark-info {
    p {
      text-align: left;
      font-size: 0.24rem;
      line-height: 0.4rem;
      color: #999;
      span {
        color: @error;
      }
    }
    .error-imgs {
      max-height: 5.6rem;
      overflow-y: scroll;
      img {
        max-width: 100%;
        padding: 0.1rem 0;
      }
    }
  }
</style>
