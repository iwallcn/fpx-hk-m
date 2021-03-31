<template>
  <div class="mainland">
    <group class="first-cell"
      label-width="1.7rem"
      label-align="left">
      <cell
        title="住址類型"
        value-align="left">
        <div class="house-type-box">
          <div @click="obj.deliveryAddressType = 1" class="house-type"><i :class="[obj.deliveryAddressType && obj.deliveryAddressType == 1 ? 'iconfont icon-rad-on' : 'iconfont icon-rad-off']"></i> 工商</div>
          <div @click="obj.deliveryAddressType = 2" class="house-type"><i :class="[obj.deliveryAddressType && obj.deliveryAddressType == 2 ? 'iconfont icon-rad-on' : 'iconfont icon-rad-off']"></i> 住宅</div>
        </div>
      </cell>
      <x-input v-model="obj.firstName"
        title="姓名"
        placeholder="請輸入姓名"></x-input>
      <popup-picker :data="areaList"
        title="電話區號"
        :columns="3"
        class="picker important"
        v-model="areaCode"
        value-text-align="left"
        show-name></popup-picker>
      <x-input title="電話"
        v-model="obj.phone"
        placeholder="請輸入電話" />
      <cell is-link
        title="收件地址"
        class="require"
        @click.native="addressPanel"
        value-align="left">
        <p>
          {{obj.province === '' ? "请选择" : obj.province + '' + obj.city + '' + obj.district}}
        </p>
      </cell>
      <x-input title=""
        v-model="obj.detailAddress"
        placeholder="請輸入詳細收件地址"></x-input>
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
      :province="obj.province"
      :city="obj.city"
      :district="obj.district"
      @selectValue="selectValue"
      @closeAddressPopup="addressPanel"></popup-address>
  </div>
</template>

<script>
import { Group, Cell, CellBox, XInput, Alert, XSwitch, PopupPicker } from 'vux'
import upload from '@/common/upload'
import PopupAddress from '@//common/address'
import * as API from '@/api/myAddress'
import { mapGetters } from 'vuex'

export default {
  name: 'sendEdit',
  data () {
    return {
      obj: {
        deliveryAddressType: 0,
        areaCode: '',
        city: '',
        detailAddress: '',
        district: '',
        firstName: '',
        phone: '',
        // country: '中國香港',
        province: '',
        defaultFlag: false
      },
      flag: false,
      editAdd: '',
      disabled: true,
      areaList: [{ name: '中國大陸+86', value: '+86' }, { name: '中國香港+852', value: '+852' }],
      areaCode: ['+852']
    }
  },
  created () {
    this.editAdd = this.$route.query.editAdd
    if (this.editAdd === 'edit') {
      this.areaCode = [this.currentUserAddress().areaCode]
      this.obj = this.currentUserAddress()
    }
  },
  methods: {
    // 上传说明
    handleRemark () {
      this.remarkInfo = !this.remarkInfo
    },
    // 设置默认地址
    switchDefault (newVal, oldVal) {
    },
    // 点击所在地区，弹出地址选择面板，并加载省份数据这里默认是加载中国，所以传中国code485
    addressPanel () {
      this.flag = !this.flag
    },
    // 点击最后区域，获取省市区
    selectValue (pro, city, dis) {
      this.flag = !this.flag
      this.obj.province = pro.nameChinese || ''
      this.obj.city = city.nameChinese || ''
      this.obj.district = dis.nameChinese || ''
    },
    // 编辑新增地址
    handlerSave () {
      console.log(22)
      let _this = this
      this.obj.areaCode = this.areaCode[0]
      if (!this.obj.deliveryAddressType) {
        this.$vux.toast.text('請完善住址類型信息')
        return
      }
      if (!this.obj.firstName.trim()) {
        this.$vux.toast.text('請輸入姓名')
        return
      }
      if (!this.obj.phone) {
        this.$vux.toast.text('请输入手機號碼')
        return
      }
      if (!this.obj.province) {
        this.$vux.toast.text('收件地址不能為空')
        return
      }
      if (!this.obj.detailAddress) {
        this.$vux.toast.text('詳細地址不能為空')
        return
      }
      // 如果是新增，則判斷格式是否正確大陸11位，香港8位；如果是編輯，則要做脫敏，前三后四中間是星號
      if (this.editAdd === 'edit') {
        if (this.areaCode[0] === '+852' && !(/^(\d{3})([*]{1})(\d{4})$/.test(this.obj.phone) || /^\d{8}$/.test(this.obj.phone))) { // 香港8位脫敏校验
          this.$vux.toast.text('手機號碼不對')
          return
        }
        if (this.areaCode[0] === '+86' && !(/^(\d{3})([*]{4})(\d{4})$/.test(this.obj.phone) || /^((1[0-9]{1})+\d{9})$/.test(this.obj.phone))) { // 大陸11位脫敏校验
          this.$vux.toast.text('手機號碼不對')
          return
        }
        API.editUserAddress(this.obj).then(res => {
          this.$vux.toast.text(res.message)
          if (res.code === this.GLOBAL.code) {
            // this.$router.push({ name: 'addresses' })
            if (_this.$route.query.from === 'order') { // 说明是从下单那里跳转到地址列表，然后再新增
              _this.$router.push({ name: 'addresses', query: { from: 'order', packageAttribute: this.$route.query.packageAttribute } })
            } else {
              _this.$router.push({ name: 'addresses', packageAttribute: this.$route.query.packageAttribute })
            }
          }
        })
      } else {
        if (this.areaCode[0] === '+852' && !/^\d{8}$/.test(this.obj.phone)) { // 香港8位格式校验
          this.$vux.toast.text('手機號碼不對')
          return
        }
        if (this.areaCode[0] === '+86' && !/^((1[0-9]{1})+\d{9})$/.test(this.obj.phone)) { // 大陸11位格式校验
          this.$vux.toast.text('手機號碼不對')
          return
        }
        API.addUserAddress(_this.obj).then(res => {
          _this.$vux.toast.text(res.message)
          if (res.code === _this.GLOBAL.code) {
            // 如果是参数中带有order，说明是从下单过来的，新增之后，把order再带过去，为了显示勾选框
            if (_this.$route.query.from === 'order') { // 说明是从下单那里跳转到地址列表，然后再新增
              _this.$router.push({ name: 'addresses', query: { from: 'order', packageAttribute: this.$route.query.packageAttribute } })
            } else {
              _this.$router.push({ name: 'addresses', packageAttribute: this.$route.query.packageAttribute })
            }
            // TODO派送地址没有这个deliveryType属性，下面的emit是做什么的
            // if (_this.$route.name !== 'order') {
            //   _this.$router.push({ name: 'addresses' })
            // } else {
            //   _this.$emit('update', this.obj.deliveryType)
            // }
          }
        })
      }
    },
    isNull () {
      if (this.obj.firstName.trim() && this.obj.phone.trim() && this.obj.province && this.obj.detailAddress && this.obj.deliveryAddressType) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    ...mapGetters(['currentUserAddress'])
  },
  watch: {
    'obj.firstName' () {
      this.isNull()
    },
    'obj.phone' () {
      this.isNull()
    },
    'obj.province' () {
      this.isNull()
    },
    'obj.detailAddress' () {
      this.isNull()
    },
    'obj.deliveryAddressType' () {
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
    PopupPicker
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
  .house-type-box{
    display: flex;
    align-items: center;
    .house-type{
      margin-right: 0.3rem;
      padding: 0.1rem 0rem;
      .icon-rad-on{
        color: #ff6400;
      }
    }
  }
</style>
