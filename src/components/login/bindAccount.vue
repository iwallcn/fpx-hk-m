<template>
  <div class="login">
    <div class="logo-4px">
      <!-- <img src="images/4px-logo.png" alt=""> -->
    </div>
    <div class="login-form">
      <h1>請綁定已有4PX賬戶並驗證</h1>
      <div class="username">
        <span></span>
        <input type="text"
          v-model.trim="loginInfo.username"
          autocomplete="off"
          placeholder="請輸入郵箱或手機號碼"
          value="">
      </div>
      <div class="password">
        <span></span>
        <input type="password"
          v-model="loginInfo.password"
          autocomplete="off"
          placeholder="請輸入密碼"
          value="">
      </div>
      <button :class="['submit', {isActive: isActive}]"
        @click="handleSubmit">驗證</button>
      <div class="forget-add">
        <!-- 点击后根据环境变量调整 -->
        如果您未註冊，
        <a class="register"
          href="javascript:;"
          @click="handleRegister">去註冊</a>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import * as utils from './utils.js'
import { getSystemUrl } from '@/utils/config'
import axios from 'axios'
import { bindFacebookAccount, bindGoogleAccount } from '@/api/login'
import { bannerQuery } from '@/api/banners'
const defaultService = getSystemUrl()
export default {
  name: 'name',
  data () {
    return {
      loginInfo: {
        username: '',
        password: '',
        secretKey: '', // 密码加密的密钥
        thirdAccountKey: '' // openid
      },
      type: localStorage.getItem('thirdLoginType'), // 标记用户第三方登录类型
    }
  },
  computed: {
    isActive () {
      return this.loginInfo.username && this.loginInfo.password
    }
  },
  created () {
    this.loginInfo.thirdAccountKey = this.$route.query.openId
  },
  methods: {
    // 注册
    handleRegister () {
      this.$router.push({ name: 'bindRegister', query: { openId: this.loginInfo.thirdAccountKey } })
    },
    // 提交
    handleSubmit () {
      // 本地验证
      if (this.loginInfo.username === '') {
        this.$vux.toast.text('請輸入帳號')
        return
      }
      if (this.loginInfo.password === '') {
        this.$vux.toast.text('請輸入密碼')
        return
      }
      if (!utils.verifyPass(this.loginInfo.password).bool) {
        this.$vux.toast.text('密碼長度為8-20位，必須同時包含英文字母和數字')
        return
      }
      let key = utils.getKey(16)
      var pass = utils.encrypt(key, this.loginInfo.password)
      this.loginInfo.secretKey = key
      this.loginInfo.password = pass
      if (this.type === 'google') {
        // 绑定谷歌
        bindGoogleAccount(this.loginInfo).then(res => {
          this.$vux.toast.text(res.message)
          if (res.code === this.GLOBAL.code) {
            window.location.replace(window.location.origin + '/cas?' + res.data)
          }
        })
      }
      if (this.type === 'facebook') {
        // 绑定facebook
        bindFacebookAccount(this.loginInfo).then(res => {
          this.$vux.toast.text(res.message)
          if (res.code === this.GLOBAL.code) {
            window.location.replace(window.location.origin + '/cas?' + res.data)
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  /* 登录页 */
  .login {
    width: 100%;
    height: 100%;
    background: #fff;
    font-size: 0.26rem;
    color: #333;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    position: relative;
  }

  .login a {
    color: #333;
  }

  .logo-4px {
    width: 100%;
    height: 2.1rem;
    line-height: 3.7rem;
    text-align: center;
    background: url(../../assets/image/map-bg.png) center no-repeat;
    background-size: 100% 100%;
  }

  .logo-4px img {
    width: 1.5rem;
    height: 0.6rem;
  }

  .login-form {
    padding: 0.3rem 0.74rem;
    h1 {
      color: #000;
      font-size: 0.34rem;
      text-align: center;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
  }

  .username,
  .password {
    width: 6rem;
    height: 1rem;
    background-color: #eee;
    overflow: hidden;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    margin: 0 auto 0.2rem;
  }
  .username span {
    float: left;
    width: 1rem;
    height: 1rem;
    background: url(./images/user-icon.png) center center no-repeat;
    background-size: 0.3rem 0.28rem;
  }
  .password span {
    float: left;
    width: 1rem;
    height: 1rem;
    background: url(./images/pass-icon.png) center center no-repeat;
    background-size: 0.29rem 0.3rem;
  }
  .username input,
  .password input {
    float: left;
    width: 5rem;
    height: 1rem;
    border: 0;
    font-size: 0.32rem;
    background-color: #eee;
  }

  .verifycode {
    width: 6rem;
    height: 1rem;
    overflow: hidden;
    margin: 0 auto 0.2rem;
  }
  .verifycode input {
    float: left;
    width: 2.6rem;
    height: 1rem;
    border: 0;
    padding: 0 0.2rem;
    font-size: 0.32rem;
    background-color: #eee;
    border-radius: 5px;
  }
  .verifycode img {
    width: 2.8rem;
    height: 1rem;
    float: right;
  }

  .submit {
    width: 6.02rem;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    font-size: 0.36rem;
    color: #fff;
    background-color: #f0a362;
    margin: 0.4rem auto;
    border-radius: 5px;
    border: none;
    display: block;
    &.isActive {
      background-color: @primary;
    }
  }
  .succeedMsg,
  .errorMsg {
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .errorMsg {
    color: #d02222;
  }

  .forget-add {
    overflow: hidden;
    padding: 0.1rem 0;
    text-align: right;
    .register {
      color: @primary;
    }
  }

  .popup {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: none;
  }
  .mask {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
  }
  .pop-con {
    width: 5rem;
    height: 3rem;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 9999;
    margin-left: -2.5rem;
    margin-top: -1.5rem;
    border-radius: 10px;
  }
  .pop-con h3 {
    font-size: 0.36rem;
    padding: 0.6rem 0;
    font-weight: normal;
    text-align: center;
  }
  .pop-con p {
    font-size: 0.3rem;
    width: 3rem;
    height: 0.6rem;
    line-height: 0.6rem;
    margin: 0 auto;
    text-align: center;
    color: #fff;
    background-color: @primary;
    border-radius: 4px;
  }
  .pop-con span {
    font-size: 0.42rem;
    position: absolute;
    top: -28px;
    right: -28px;
    padding: 0 8px;
    border: 1px solid #fff;
    border-radius: 50%;
    color: #fff;
  }
  .loading {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.1);
  }
  .loading img {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -16px;
    margin-left: -16px;
  }
</style>
