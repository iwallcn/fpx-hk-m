<template>
  <div class="register">
    <div class="wrapper">
      <div class="row">
        <div class="col1">
          <popup-picker :data="areaList"
            :columns="3"
            class="picker"
            v-model="areaCode"
            value-text-align="left"></popup-picker>
        </div>
        <div class="col2">
          <input type="text"
            v-model="registerData.mobile"
            @blur="mobileBlur"
            placeholder="請輸入手機號">
        </div>
      </div>
      <div class="row2 pd">
        <div class="col1">
          <input type="text"
            v-model="verificationCode"
            placeholder="請輸入圖片驗證碼">
        </div>
        <div class="col2">
          <img class="img"
            @click="getVerificationCode"
            :src="imgUrl">
        </div>
      </div>
      <div class="row2">
        <div class="col1">
          <input type="text"
            v-model="registerData.verificationKey"
            placeholder="請輸入短信驗證碼">
        </div>
        <div class="col2">
          <span v-show="show"
            @click="getCode">點擊獲取</span>
          <span v-show="!show"
            class="count">{{count}}s 重發</span>
        </div>
      </div>
      <div class="row3">
        <div class="col1">
          <input type="password"
            v-model="registerData.password"
            placeholder="請輸入密碼">
        </div>
      </div>
      <div class="agree">
        <span class="first"
          @click="handlerAgree"><i :class="['iconfont', isAgree ? 'icon-check' : 'icon-nocheck']"></i>我已閱讀并接受</span><span @click="showProtocol">《4PX注冊服務協定》</span>
      </div>
      <div class="btn">
        <button @click="handlerRegister">注冊領取免運費</button>
      </div>
      <div class="goLogin">
        <p>已有賬號，<a @click="handlerLogin">立即登錄</a></p>
      </div>
    </div>

    <img :src="backgroundImg">

  </div>
</template>

<script>
import { PopupPicker, Popup } from 'vux'
import * as API from '@/api/registrationActivity'
import { getSystemUrl, getToken } from '@/utils/config'
const CryptoJS = require('cryp-to-js').default
const service = getSystemUrl()

export default {
  name: 'register',
  data () {
    return {
      areaList: [{ name: '+86', value: '+86' }, { name: '+852', value: '+852' }],
      areaCode: ['+852'],
      show: true,
      count: '',
      timer: null,
      isAgree: false, // 是否同意
      verificationCode: '', // 圖片驗證碼
      imgUrl: process.env.NODE_ENV === 'development' ? '/api/code/kaptcha.jpg' : '/code/kaptcha.jpg', // 圖片驗證碼路徑
      registerData: {
        areaCode: '+852', // 手机区号
        mobile: '', // 手机
        verificationKey: '', // 手机验证码
        password: '', // 密碼
        key: '', // 加密key
        recommender: '' // 推荐信息
      },
      backgroundImg: ''
    }
  },
  created () {
    this.getKey(16)
    // 获取活动背景图片
    this.getBackgroundImg()
  },
  methods: {
    // 获取活动背景图片
    getBackgroundImg () {
      API.backgroundImgQuery({ url: this.$route.path }).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.backgroundImg = res.data[0].baseMap
        }
      })
    },
    showProtocol () {
      // this.$router.push({ name: 'terms' })
      window.location.href = 'http://user.4px.com/common/protocol?locale=zh_TW'
    },
    // 跳轉到登陸
    handlerLogin () {
      // this.$router.push({ name: 'login' })
      this.$router.push({ name: 'login', query: { service: service, countryId: 460 } })
    },
    // 手機號碼輸入框失去焦點
    mobileBlur () {
      if (!this.registerData.mobile.trim()) {
        return
      }
      API.checkCExist({ mobile: this.registerData.mobile }).then(res => {
        if (res.code !== this.GLOBAL.code) {
          this.$vux.toast.text('手機號碼已存在')
          this.registerData.mobile = ''
        }
      })
    },
    // 點擊獲取圖片驗證碼
    getVerificationCode () {
      let url = process.env.NODE_ENV === 'development' ? '/api/code/kaptcha.jpg' : '/code/kaptcha.jpg'
      this.imgUrl = `${url}?t=${new Date().getTime()}`
    },
    // 點擊獲取驗證碼
    getCode () {
      if (!this.verificationCode) {
        this.$vux.toast.text('請輸入圖片驗證碼')
        return
      }
      let regPhone = /^1[3-8]{1}\d{9}$/
      let regHKPhone = /^\d{8}$/
      if ((this.areaCode[0] === '+86' && !regPhone.test(this.registerData.mobile)) || (this.areaCode[0] === '+852' && !regHKPhone.test(this.registerData.mobile))) {
        this.$vux.toast.text('請輸入正確的手機號碼')
        return
      }
      this.getSendRegisterSms()
    },
    setTimer () {
      const TIME_COUNT = 59
      if (!this.timer) {
        this.count = TIME_COUNT
        this.show = false
        this.timer = setInterval(() => {
          if (this.count > 1 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.show = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    },
    // 發送請求獲取驗證碼
    getSendRegisterSms () {
      this.registerData.areaCode = this.areaCode[0]
      let obj = {
        areaCode: this.registerData.areaCode,
        mobile: this.registerData.mobile,
        verificationCode: this.verificationCode
      }
      API.sendRegisterSms(obj).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.$vux.toast.text('驗證碼已發送')
          this.setTimer()
        }
      })
    },
    handlerAgree () {
      this.isAgree = !this.isAgree
    },
    // 點擊提交
    handlerRegister () {
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
      if (!this.isAgree) {
        this.$vux.toast.text('請閱讀並接受《4PX注册服務協定》')
        return
      }
      let data = {
        key: this.secretKey,
        password: this.encryptedAES(this.registerData.password, this.secretKey),
        mobile: this.registerData.mobile,
        recommender: this.$route.query.p || '',
        verificationKey: this.registerData.verificationKey,
        areaCode: this.registerData.areaCode,
        activityParamsVO: {
          recommender: this.$route.query.p || '',
          utmSource: getToken('utm_source'),
          utmMedium: getToken('utm_medium'),
          utmCampaign: getToken('utm_campaign'),
          utmTerm: getToken('utm_term'),
          utmContent: getToken('utm_content')
        }
      }
      API.userRegistrationActivity(data).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.$vux.toast.text('註冊成功')
          // this.$router.push({ name: 'activityOK', query: { areaCode: this.registerData.areaCode } })
          this.$router.push({ name: 'registrationSuccess' })
        } else {
          this.$vux.toast.text(res.message)
        }
      })
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
    }
  },
  components: {
    PopupPicker,
    Popup
  }
}
</script>

<style lang="less" scoped>
  .register {
    position: relative;
    width: 100%;
    font-size: 0;
    height: auto;
    .wrapper {
      width: 90%;
      position: absolute;
      top: 15%;
      left: 5%;
      font-size: 0.34rem;
      .row {
        display: flex;
        width: 100%;
        background: #fff;
        margin: 0.2rem 0;
        align-items: center;
        border-radius: 6px;
        padding: 0.06rem 0;
        .col1 {
          width: 24%;
          text-align: center;
          position: relative;
          display: flex;
          justify-content: center;
        }
        .col1:after {
          content: "";
          width: 8px;
          height: 8px;
          border-top: 2px solid #e4e4e4;
          border-right: 2px solid #e4e4e4;
          -webkit-transform: rotate(45deg);
          transform: rotate(132deg);
          position: absolute;
          right: 0.16rem;
          top: 0.22rem;
        }
        .col2 {
          flex: 1;
          padding-left: 0.2rem;
          box-sizing: border-box;
          position: relative;
          &::before {
            content: "|";
            position: absolute;
            top: 0.22rem;
            left: 0;
            color: #e4e4e4;
          }
        }
      }
      .row2 {
        display: flex;
        width: 100%;
        background: #fff;
        margin: 0.2rem 0;
        align-items: center;
        border-radius: 6px;
        box-sizing: border-box;
        padding: 0.06rem 0 0.06rem 0.3rem;
        &.pd {
          padding: 0.04rem 0 0.04rem 0.3rem;
        }
        .col1 {
          flex: 1;
        }
        .col2 {
          text-align: right;
          span {
            padding: 0.2rem 0.3rem;
            display: block;
            background-image: -webkit-gradient(
              linear,
              left 0,
              right 0,
              from(#ff6400),
              to(#ff3100)
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          img {
            border-radius: 0 6px 6px 0;
          }
        }
      }
      .row3 {
        display: flex;
        width: 100%;
        background: #fff;
        margin: 0.2rem 0 0.3rem 0;
        align-items: center;
        border-radius: 6px;
        box-sizing: border-box;
        padding: 0.06rem 0.3rem;
        .col1 {
          width: 100%;
        }
      }
      .agree {
        font-size: 0.28rem;
        span.first {
          padding: 0.2rem 0;
          i {
            padding-right: 0.06rem;
          }
          color: #fff;
        }
      }
      .btn {
        width: 100%;
        background: #fff;
        border-radius: 6px;
        margin: 0.3rem 0;
        button {
          color: #ff3100;
          width: 100%;
          font-size: 0.34rem;
          font-weight: bold;
          padding: 0.23rem 0;
          border: none;
          background: #fff;
          border-radius: 6px;
        }
      }
      .goLogin {
        font-size: 0.28rem;
        text-align: center;
        color: #fff;
        a {
          color: #ffd54f;
        }
      }
      input {
        width: 100%;
        height: 0.77rem;
        padding-bottom: 0.03rem;
        line-height: normal;
      }
      input::-webkit-input-placeholder {
        color: #c3c3c3;
        font-size: 0.32rem;
        line-height: normal;
      }
    }
    .infos {
      width: 92%;
      margin: 1rem auto;
      h3 {
        font-size: 0.4rem;
        color: #fff;
        font-weight: bold;
        text-shadow: 2px 2px 2px #3c5fcf;
        letter-spacing: 0.1rem;
        margin-bottom: 0.4rem;
      }
      p {
        text-indent: 1rem;
        font-size: 0.34rem;
        color: #fff;
        text-shadow: 2px 2px 2px #fd6300;
        letter-spacing: 0.05rem;
        line-height: 0.5rem;
        margin-bottom: 0.2rem;
        &.last {
          text-indent: 0.6rem;
        }
        a {
          color: #3c5fcf;
          padding: 0.16rem;
          letter-spacing: 0.06rem;
        }
      }
    }
    img {
      max-width: 100%;
      height: auto;
    }
  }
</style>
<style lang="less">
  .register {
    .wrapper {
      .weui-cell_access .weui-cell__ft:after {
        content: "" !important;
        border-color: #fff !important;
      }
    }
  }
</style>
