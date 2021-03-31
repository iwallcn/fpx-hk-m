<template>
  <div class="register">
    <group label-width="1.8rem"
      label-margin-right="0.05rem"
      label-align="left">
      <popup-radio class="register-areaCode"
        title="選擇區號"
        :options="areaCodeOption"
        v-model="registerData.areaCode"></popup-radio>
      <x-input title="手機號碼"
        @on-blur="checkMobile"
        :max="11"
        v-model="registerData.mobile"
        placeholder="請輸入手機號碼">
      </x-input>
      <x-input title="圖形碼"
        v-model="verificationCode"
        placeholder="請輸入圖形碼">
        <img slot="right"
          class="img"
          @click="getVerificationCode"
          :src="imgUrl">
      </x-input>
      <x-input title="驗證碼"
        v-model="registerData.verificationKey"
        placeholder="請輸入驗證碼">
        <x-button slot="right"
          type="primary"
          class="btn"
          :max="6"
          :disabled="sendFlag"
          @click.native="getVerificationKey"
          mini>{{text}}</x-button>
      </x-input>
      <x-input title="密碼"
        v-model="registerData.password"
        :max=20
        type="password"
        placeholder="請輸入密碼">
      </x-input>
      <x-input title="確認密碼"
        v-model="registerData.confirmPwd"
        :max=20
        type="password"
        placeholder="請輸入確認密碼">
      </x-input>
    </group>
    <div class="protocol">
      <span :class="{'agree': protocol}"
        @click="handleAgree">我已閱讀並接受</span>
      <a href="javascript:;"
        @click="showProtocol">《4PX注册服務協定》</a>
    </div>
    <div class="next">
      <x-button :class="['submit', {isActive: isActive}]"
        :disabled="!isActive"
        type="primary"
        @click.native="handleSubmit">註 冊</x-button>
    </div>

    <div class="toLogin">
      <span @click="toLogin">已有帳號，去登錄</span>
    </div>

    <!-- 註冊成功弹框
    <div v-transfer-dom>
      <popup v-model="completeShow"
        height="100%">
        <registration-success :time="countDown"></registration-success>
      </popup>
    </div> -->
  </div>
</template>

<script>
import { getSystemUrl, getToken } from '@/utils/config'
import registrationSuccess from './registrationSuccess'
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
  PopupRadio,
  Confirm} from 'vux'
import * as API from '@/api/login'
const CryptoJS = require('cryp-to-js').default
const service = getSystemUrl()
export default {
  name: 'register',
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
    Confirm,
    PopupRadio,
    registrationSuccess
  },
  data () {
    return {
      second: 60,
      time: 0,
      sendFlag: false,
      secretKey: '',
      areaCodeOption: [
        '+86',
        '+852'
      ],
      protocol: false,
      imgUrl: process.env.NODE_ENV === 'development' ? '/api/code/kaptcha.jpg' : '/code/kaptcha.jpg',
      verificationCode: '', // 图形码
      btnText: '发送验证码',
      registerData: {
        areaCode: '+852',
        mobile: '',
        verificationKey: '',
        password: '',
        confirmPwd: ''
      },
      // completeShow: true,
      countDown: 3,
      bindData: {},
      openid: ''
    }
  },
  computed: {
    isActive () {
      if (!this.registerData.mobile || !this.registerData.verificationKey || !this.registerData.password || !this.registerData.confirmPwd || !this.protocol) {
        return false
      } else {
        return true
      }
    },
    text () {
      return this.time > 0 ? this.time + 's 后重新獲取' : '獲取驗證碼'
    }
  },
  created () {
    this.getKey(16)
    this.openid = window.encodeURIComponent(this.$route.query.openId)
  },
  methods: {
    changeAreaCode () {
      this.registerData.mobile = ''
    },
    checkMobile (num) {
      if (!num) return
      let data = {
        mobile: num
      }
      // axios.
      API.checkCExist(data).then(res => {
        if (res.code !== this.GLOBAL.code) {
          this.$vux.toast.text('手機號碼已存在')
          this.registerData.mobile = ''
        }
      })
    },
    run () {
      this.time = this.second
      this.timer()
    },
    stop () {
      this.time = 0
      this.sendFlag = false
    },
    timer () {
      if (this.time > 0) {
        this.time--
        setTimeout(this.timer, 1000)
      } else {
        this.sendFlag = false
      }
    },
    // 获取图形码
    getVerificationCode () {
      let url = process.env.NODE_ENV === 'development' ? '/api/code/kaptcha.jpg' : '/code/kaptcha.jpg'
      this.imgUrl = `${url}?t=${new Date().getTime()}`
    },
    // 获取短信验证码
    getVerificationKey () {
      if (!this.registerData.mobile) {
        this.$vux.toast.text('請輸入手機號碼')
        return
      }
      if (!this.verificationCode) {
        this.$vux.toast.text('請輸入圖形碼')
        return
      }
      this.sendFlag = true
      let data = {
        areaCode: this.registerData.areaCode,
        mobile: this.registerData.mobile,
        verificationCode: this.verificationCode
      }
      API.sendRegisterSms(data).then(res => {
        if (res.code === this.GLOBAL.code) {
          if (res.data && res.data.code === this.GLOBAL.code) {
            // 启动倒计时
            this.run()
          } else {
            // 停止倒计时
            this.stop()
          }
          this.$vux.toast.text(res.data.message)
        } else {
          // 停止倒计时
          this.stop()
          this.$vux.toast.text(res.message)
        }
      })
    },
    showProtocol () {
      // this.$router.push({ name: 'terms' })
      window.location.href = 'http://user.4px.com/common/protocol?locale=zh_TW'
    },
    // 同意协议
    handleAgree () {
      this.protocol = !this.protocol
    },
    handleSubmit () {
      // 本地验证
      if (!this.registerData.mobile) {
        this.$vux.toast.text('請輸入手機號碼')
        return
      }
      let regPhone = /^1[3-8]{1}\d{9}$/
      let regHKPhone = /^\d{8}$/
      if ((this.registerData.areaCode === '+86' && !regPhone.test(this.registerData.mobile)) || (this.registerData.areaCode === '+852' && !regHKPhone.test(this.registerData.mobile))) {
        this.$vux.toast.text('請輸入正確的手機號碼')
        return
      }
      if (!this.registerData.verificationKey) {
        this.$vux.toast.text('請輸入驗證碼')
        return
      }
      if (!this.registerData.password) {
        this.$vux.toast.text('請輸入密碼')
        return
      }
      let format1 = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#%&?~^*$])[\da-zA-Z!@#%&?~^*$]{8,20}$/ // 数字，字母，字符
      let format2 = /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z]{8,20}$/ // 数字，字母
      if (!format1.test(this.registerData.password) && !format2.test(this.registerData.password)) {
        this.$vux.toast.text('密碼長度為8-20比特，必須同時包含英文字母和數位，英文字母區分大小寫，可以包含！、@、#、%、&、？、~、^、*、$特殊字元')
        return
      }
      if (!this.registerData.confirmPwd) {
        this.$vux.toast.text('請確認密碼')
        return
      }
      if (this.registerData.password !== this.registerData.confirmPwd) {
        this.$vux.toast.text('兩次密碼輸入不一致')
        return
      }
      if (!this.protocol) {
        this.$vux.toast.text('請閱讀並接受《4PX注册服務協定》')
        return
      }
      let data = {
        key: this.secretKey,
        password: this.encryptedAES(this.registerData.password, this.secretKey),
        confirmPwd: this.encryptedAES(this.registerData.confirmPwd, this.secretKey),
        mobile: this.registerData.mobile,
        areaCode: this.registerData.areaCode,
        verificationKey: this.registerData.verificationKey,
        activityParamsVO: {
          recommender: this.$route.query.p || '',
          utmSource: getToken('utm_source'),
          utmMedium: getToken('utm_medium'),
          utmCampaign: getToken('utm_campaign'),
          utmTerm: getToken('utm_term'),
          utmContent: getToken('utm_content')
        }
      }
      this.bindData = {
        username: this.registerData.mobile,
        password: this.encryptedAES(this.registerData.password, this.secretKey),
        secretKey: this.secretKey,
        thirdAccountKey: this.openid// 没有openid
      }
      API.userRegistration(data).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.$vux.toast.text('註冊成功')
          this.sendGaEvent(1, '注册成功')
          // 注冊成功之後再绑定
          this.bind()
          // this.$router.push({ name: 'registrationSuccess' })
          // this.completeShow = true
        } else {
          this.sendGaEvent(0, res.message)
          this.$vux.toast.text(res.message)
        }
      })
    },
    bind () {
      let type = localStorage.getItem('thirdLoginType')
      if (type === 'google') {
        // 绑定谷歌
        API.bindGoogleAccount(this.bindData).then(res => {
          this.$vux.toast.text(res.message)
          if (res.code === this.GLOBAL.code) {
            window.location.href = window.location.origin + '/cas?' + res.data
          }
        })
      }
      if (type === 'facebook') {
        // 绑定facebook
        API.bindFacebookAccount(this.bindData).then(res => {
          this.$vux.toast.text(res.message)
          if (res.code === this.GLOBAL.code) {
            window.location.href = window.location.origin + '/cas?' + res.data
          }
        })
      }
    },
    // 已有账号去登陆
    toLogin () {
      this.$router.push({ name: 'login', query: { service: service, countryId: 460 } })
    },
    // 加密 @param {String} data 明文,key 秘钥 十六位十六进制数,iv 秘钥偏移量 十六位十六进制数
    encryptedAES (data, key, iv) {
      CryptoJS.mode.ECB = (function () {
        var ECB = CryptoJS.lib.BlockCipherMode.extend()
        ECB.Encryptor = ECB.extend({
          processBlock: function (words, offset) {
            this._cipher.encryptBlock(words, offset)
          }
        })
        ECB.Decryptor = ECB.extend({
          processBlock: function (words, offset) {
            this._cipher.decryptBlock(words, offset)
          }
        })
        return ECB
      }())
      let srcs = CryptoJS.enc.Utf8.parse(data)
      let keydata = CryptoJS.enc.Utf8.parse(key)
      let encrypted = CryptoJS.AES.encrypt(srcs, keydata, {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      })
      return encrypted.ciphertext.toString(CryptoJS.enc.Base64)
    },
    /**
    * 生成密钥
    * @param n 生成多少位的密钥(默认8位)
    */
    getKey (n) {
      var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      if (n === null) {
        n = 8
      }
      var res = ''
      for (var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * 35)
        res += chars[id]
      }
      // return res
      this.secretKey = res
    },
    sendGaEvent (flag = true, msg = '') {
      try {
        // eslint-disable-next-line
        ga('send', {
          hitType: 'event',
          eventCategory: '注册',
          eventAction: flag ? '注册成功' : '注册失败',
          eventLabel: msg
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .register {
    overflow: hidden;
    .btn {
      background: @primary;
    }
    .img {
      position: absolute;
      right: 0.3rem;
      top: 0.08rem;
      height: 0.76rem;
      width: 2rem;
    }
    .protocol {
      overflow: hidden;
      padding: 0.1rem;
      margin: 0.4rem 0.22rem 0.2rem;
      font-size: 0.26rem;
      span {
        padding-left: 0.38rem;
        background: url(./images/select.png) 0 0.05rem no-repeat;
        background-size: 0.26rem 0.26rem;
      }
      .agree {
        background: url(./images/selected.png) 0 0.05rem no-repeat;
        background-size: 0.26rem 0.26rem;
      }
      a {
        color: #478cff;
      }
    }
    .next {
      margin: 0.5rem 0 0;
      padding: 0 0.3rem;
      .submit {
        width: 6.9rem;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
        font-size: 0.36rem;
        border-radius: 5px;
        background-color: #f0a362;
        &.isActive {
          background-color: @primary;
        }
      }
    }
    .toLogin {
      text-align: right;
      padding: 0 0.3rem;
      span {
        font-size: 0.24rem;
        cursor: pointer;
        color: #f0a362;
      }
    }
  }
</style>

<style lang="less">
  .register {
    .icon-down {
      font-size: 0.16rem;
    }
  }
  .weui-check__label {
    text-align: center;
    font-size: 0.4rem;
  }
  .vux-popup-dialog {
    .weui-icon-checked {
      position: absolute;
      right: 0.3rem;
    }
  }
</style>
