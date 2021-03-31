<template>
  <div class="login">
    <div class="logo-4px">
      <!-- <img src="images/4px-logo.png" alt=""> -->
    </div>
    <div class="login-form">
      <div class="username">
        <span></span>
        <input type="text"
          v-model.trim="loginInfo.account"
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
      <div v-show="flagCode"
        class="verifycode">
        <input type="text"
          v-model="loginInfo.verifycode"
          autocomplete="off"
          placeholder="請輸入驗證碼">
        <!-- <img src="https://sso.uat.4px.com/captchacode?date=1528765941807" alt=""> -->
        <img ref="verifycode"
          @click="changeVerifycode"
          src="./images/captchacode.jpg"
          alt="">
      </div>
      <button :class="['submit', {isActive: isActive}]"
        @click="handleSubmit">登錄</button>
      <div class="forget-add">
        <!-- 点击后根据环境变量调整 -->
        <a class="forget"
          href="javascript:;"
          @click="handleForget">忘記密碼？</a>
        <a class="register"
          href="javascript:;"
          @click="handleRegister">立即註冊</a>
      </div>
    </div>
    <!-- <div class="other-login">
      <div class="title"><span></span>
        <h6>第三方登錄</h6><span></span>
      </div>
      <div class="icon">
        <img src="../../assets/image/facebook.png"
          @click="handlerFacebook">
        <img src="../../assets/image/google.png"
          @click="handlerGoogle">
      </div>
    </div> -->
    <div class="loading"
      v-show="loadingShow"><img src="./images/loading1.gif"
        alt=""></div>
  </div>
</template>

<script>
/* eslint-disable */
import * as utils from './utils.js'
import { getSystemUrl, setToken } from '@/utils/config'
import axios from 'axios'
import { getFaceBookLoginUrl, getGoogleLoginUrl } from '@/api/login'
import { mapMutations } from 'vuex'

const defaultService = getSystemUrl()
export default {
  name: 'name',
  data () {
    return {
      loadingShow: false,
      flagCode: false,
      loginInfo: {
        account: '',
        password: '',
        verifycode: ''
      },
      serviceUrl: '', // 登录之后重定向到指定的页面
      redirectUrl: '', // 重定向拼接url
      returnUrl: '' // 商品团购，登录标识，传给后端
    }
  },
  computed: {
    isActive () {
      return this.loginInfo.account && this.loginInfo.password
    }
  },
  created () {
    this.serviceUrl = this.$route.query.serviceUrl
    // 这里redirectUrl是登录之后用来跳转到指定的页面路由
    this.redirectUrl = this.serviceUrl ? '&serviceUrl=' + location.origin + this.serviceUrl : ''
    this.returnUrl = this.$route.query.returnUrl ? '&returnUrl=' + window.encodeURIComponent(this.$route.query.returnUrl) : ''
    console.log(this.serviceUrl, "-", this.redirectUrl, 888)
    this.getTgc()
  },
  methods: {
    // 标记登录类型
    setLocal (val) {
      localStorage.setItem('thirdLoginType', val)
    },
    // facebook登录
    handlerFacebook () {
      getFaceBookLoginUrl().then(res => {
        if (res.code === this.GLOBAL.code) {
          this.setLocal('facebook')
          location.href = res.data
        }
      })
    },
    // google登录
    handlerGoogle () {
      getGoogleLoginUrl().then(res => {
        if (res.code === this.GLOBAL.code) {
          this.setLocal('google')
          location.href = res.data
        }
      })
    },
    getTgc () {
      let fservice = this.$route.query.fservice
      let tgc = utils.getCookie('TGC') || utils.getStorage('TGC')
      let service = this.$route.query.service || defaultService
      let _this = this
      if (!tgc || !service) {
        console.log("tgc不存在，或者service不存在");
      } else {
        axios.get(utils.getApiUrl() + '/mobileTerminalLogin/getTicketST?service=' + service, { // 获取票据
          timeout: 100000,
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then(function (res) {
          // console.log(res)
          var tkVal = res.data.data
          if (tkVal) {
            // alert('跳转地址: '+fservice+'&'+tkVal)
            if (fservice) {
              // window.location.href = fservice+'&'+tkVal+'&_='+new Date().getTime()
              if (fservice.indexOf('?') !== -1) {
                window.location.replace(fservice + '&' + tkVal + '&_=' + new Date().getTime() + _this.redirectUrl + _this.returnUrl);
              } else {
                window.location.replace(fservice + '?' + tkVal + '&_=' + new Date().getTime() + _this.redirectUrl + _this.returnUrl);
              }
            } else {
              // window.location.href = service+'&'+tkVal+'&_='+new Date().getTime()
              if (service.indexOf('?') !== -1) {
                window.location.replace(service + '&' + tkVal + '&_=' + new Date().getTime() + _this.redirectUrl + _this.returnUrl);
              } else {
                window.location.replace(service + '?' + tkVal + '&_=' + new Date().getTime() + _this.redirectUrl + _this.returnUrl);
              }
            }
          } else {
            utils.rmCookie('TGC');
            window.localStorage.removeItem("TGC");
            // alert('获取数据失败');
          }
        })
      }
    },
    // 去激活
    handleActive () {
      window.location.href = utils.getLinkUrl() + 'addUser/verifyemail?userId=' + this.loginInfo.account + '&fromURL=' + utils.loginURL + '&_=' + new Date().getTime();
    },
    // 忘记密码
    handleForget () {
      window.location.href = utils.getLinkUrl() + 'findBack?countryId=' + utils.countryId + '&fromURL=' + utils.loginURL + '&_=' + new Date().getTime();
    },
    // 注册
    handleRegister () {
      this.$router.push({ name: 'register' })
    },
    // 提交
    handleSubmit () {
      console.log('submit')
      let _this = this
      // 本地验证
      if (this.loginInfo.account == '') {
        this.$vux.toast.text('請輸入帳號')
        return
      } else if (this.loginInfo.password == '') {
        this.$vux.toast.text('請輸入密碼')
        return
      } else if (this.flagCode && this.loginInfo.verifycode == '') {
        this.$vux.toast.text('請輸入驗證碼')
        return
      }
      if (!utils.verifyAccount(this.loginInfo.account).bool) {
        this.$vux.toast.text(utils.verifyAccount(this.loginInfo.account).msg)
        return
      } else if (!utils.verifyPass(this.loginInfo.password).bool) {
        this.$vux.toast.text('密碼長度為8-20位，必須同時包含英文字母和數字')
        return
      }
      if (this.flagCode) {
        var codeNum = this.loginInfo.verifycode
      } else {
        var codeNum = null
      }
      let service = this.$route.query.service || defaultService
      let countryId = this.$route.query.countryId || '460'
      if (!countryId) {
        this.$vux.toast.text('缺少countryId，不能發起登入請求')
        return
      }
      var key = utils.getKey(16)
      var pass = utils.encrypt(key, this.loginInfo.password)
      var data = {
        username: utils.cutStrings(this.loginInfo.account),
        password: pass,
        verificationCode: codeNum,
        key: key,
        service: service,
        userType: 1,
        countryId: countryId
      }

      this.loadingShow = true
      axios.post(utils.getApiUrl() + '/mobileTerminalLogin/mlogin', data, { // 正常
        timeout: 100000,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then((res) => {
        _this.loadingShow = false
        if (res.data.errCode == 40001) {
          _this.$vux.toast.text('驗證碼錯誤')
          _this.sendGaEvent(0, '验证码错误')
        }
        if (res.data.errCode == 40002) {
          _this.$vux.toast.text('輸入密碼錯誤次數過多，此帳號暫時被鎖定')
          _this.sendGaEvent(0, '输入密码错误次数过多，此账号暂时被锁定')
        }
        if (res.data.errCode == 40003) {
          if (res.data.msg.indexOf('Non-existent') !== -1) {
            _this.$vux.toast.text('賬號不存在，請重新輸入')
            _this.sendGaEvent(0, '账号不存在')
          } else {
            _this.$vux.toast.text('密碼錯誤，請重新輸入')
            _this.sendGaEvent(0, '密码错误')
          }
          if (res.data.data && res.data.data.errorTimes && res.data.data.errorTimes >= 3) {
            _this.flagCode = true
            _this.$refs.verifycode.src = utils.getApiUrl() + '/captchacode?date=' + new Date().getTime()
          }
        }
        if (res.data.errCode == 40007) {
          _this.sendGaEvent(0, '账号未激活')
          _this.$vux.confirm.show({
            title: '温馨提示',
            content: '此帳號未啟動！',
            confirmText: '去啟動',
            onConfirm: () => {
              this.handleActive()
            }
          })
        }
        if (res.data.errCode == 40008 || res.data.errCode == 40009) {
          _this.$vux.toast.text('賬號異常，請聯繫客服人員')
          _this.sendGaEvent(0, '账号异常，请联系客服人员')
        }
        if (res.data.errCode == null) {
          if (!res.data.data) {
            _this.$vux.toast.text(res.data.msg)
            _this.sendGaEvent(0, res.data.msg)
            return
          }
          let tkVal = res.data.data.ticket
          if (!tkVal) {
            _this.$vux.toast.text('生產票據失敗')
            _this.sendGaEvent(0, '生产票据失败')
            return
          }
          utils.setCookie('TGC', res.data.data.TGC, 8)
          utils.setStorage('TGC', res.data.data.TGC)
          _this.sendGaEvent(1, '登录成功')
          let fservice = _this.$route.query.fservice
          // utils.setCookie('LoginState', 'success', 8)
          // utils.setStorage('LoginState', res.data.data.TGC)
          setToken('LoginState', 'success', 2)
          if (fservice) {
            if (fservice.indexOf('?') !== -1) {
              window.location.replace(fservice + '&' + tkVal + '&_=' + new Date().getTime() + _this.redirectUrl + _this.returnUrl)
            } else {
              window.location.replace(fservice + '?' + tkVal + '&_=' + new Date().getTime() + _this.redirectUrl + _this.returnUrl)
            }
          } else {
            if (service.indexOf('?') !== -1) {
              window.location.replace(service + '&' + tkVal + '&_=' + new Date().getTime() + _this.redirectUrl + _this.returnUrl)
            } else {
              window.location.replace(service + '?' + tkVal + '&_=' + new Date().getTime() + _this.redirectUrl + _this.returnUrl)
            }
          }
        }
      }).catch((err) => {
        _this.loadingShow = false
      })
    },
    changeVerifycode () {
      this.$refs.verifycode.src = utils.getApiUrl() + '/captchacode?date=' + new Date().getTime()
    },
    sendGaEvent (flag = true, msg = '') {
      try {
        ga('send', {
          hitType: 'event',
          eventCategory: '登录',
          eventAction: flag ? '登录成功' : '登录失败',
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
  .other-login {
    margin-top: 1rem;
    .icon {
      display: flex;
      justify-content: center;
      img {
        height: 0.5rem;
        width: 0.5rem;
        padding: 0.16rem;
        margin-top: 0.14rem;
      }
      i {
        font-size: 0.48rem;
        padding: 0.2rem;
        margin-top: 0.2rem;
        cursor: pointer;
        &.icon-facebook {
          color: #3b5998;
        }
        &.icon-google {
          color: #eb4132;
        }
      }
    }
    .title {
      text-align: center;
      font-size: 0.32rem;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        display: inline-block;
        width: 100px;
        height: 1px;
        background: #e3e3e3;
        position: relative;
      }
      h6 {
        display: inline-block;
        padding: 0 0.2rem;
      }
    }
  }
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
  }
  .forget {
    float: left;
  }
  .register {
    float: right;
  }

  /* 其他登录方式 */
  // .other-login {
  //     padding: 1rem 0 0.5rem;
  //     overflow: hidden;
  // }
  // .other-login h3 {
  //     font-size: 0.26rem;
  //     font-weight: normal;
  //     text-align: center;
  //     color: #666;
  // }
  // .other-login span {
  //     float: left;
  //     width: 1rem;
  //     height: 1rem;
  //     border-radius: 50%;
  //     border: 1px solid #D2D2D2D2;
  //     margin: 0.5rem 0 0 1.13rem;
  // }
  // .other-login .zfb {
  //     background: #E6E6E6 url(./images/zfb-icon.png) center center no-repeat;
  //     background-size: 0.61rem 0.47rem;
  // }
  // .other-login .wx {
  //     background: #E6E6E6 url(./images/wx-icon.png) center center no-repeat;
  //     background-size: 0.58rem 0.46rem;
  // }
  // .other-login .qq {
  //     background: #E6E6E6 url(./images/qq-icon.png) center center no-repeat;
  //     background-size: 0.43rem 0.48rem;
  // }

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
