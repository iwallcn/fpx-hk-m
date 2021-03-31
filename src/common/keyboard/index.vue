<template>
  <div class="pay-tool">
    <div class="pay-tool-title border-bottom">
      <span class="iconfont icon-arrow-left"
        @click="backHandle"></span>
      请输入支付密码
    </div>
    <div v-if="!isSet"
      class="pay-tool-content">
      <div class="pay-tool-inputs">
        <div class="item"
          v-for="(i, index) in items"
          :key="index"><span class="icon_dot"
            v-if="password[i]"></span></div>
      </div>
      <div v-if="!isSet"
        @click="forgetPwd"
        class="pay-tool-link">
        <span>忘記密碼？</span>
      </div>
    </div>
    <div class="pay-tool-keyboard">
      <ul>
        <li @click="keyUpHandle($event)"
          v-for="(val, index) in keys"
          :key="index">
          {{ val }}
        </li>
        <li class="del"
          @click="delHandle"><span class="iconfont icon-huishan">
          </span> </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/personalInfo'
// import CryptoJS from 'cryp-to-js'
// let CryptoJS = require('cryp-to-js').default
const keys = () => [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0]
// let sendFlag = true // 防止重复发送密码
export default {
  props: {
    isSet: { // 是否设置密码
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      items: [0, 1, 2, 3, 4, 5],
      keys: keys(),
      password: []
    }
  },
  methods: {
    backHandle () {
      this.clearPasswordHandle() // 返回时清除password
      this.$emit('close') // 返回上级
    },
    keyUpHandle (e) {
      let text = e.currentTarget.innerText
      let len = this.password.length
      if (this.isSet) {
        this.$emit('chooseNum', text)
        return
      }
      if (!text || len >= 6) return
      this.password.push(text) // 这里password要加密
      this.ajaxData()
    },
    delHandle () {
      if (this.isSet) {
        this.$emit('delNum')
        return
      }
      if (this.password.length <= 0) return false
      this.password.shift()
    },
    // 加密 @param {String} data 明文,key 秘钥
    // encryptedAES (data, key, iv) {
    //   CryptoJS.mode.ECB = (function () {
    //     var ECB = CryptoJS.lib.BlockCipherMode.extend()
    //     ECB.Encryptor = ECB.extend({
    //       processBlock: function (words, offset) {
    //         this._cipher.encryptBlock(words, offset)
    //       }
    //     })
    //     ECB.Decryptor = ECB.extend({
    //       processBlock: function (words, offset) {
    //         this._cipher.decryptBlock(words, offset)
    //       }
    //     })
    //     return ECB
    //   }())
    //   let srcs = CryptoJS.enc.Utf8.parse(data)
    //   let keydata = CryptoJS.enc.Utf8.parse(key)
    //   let encrypted = CryptoJS.AES.encrypt(srcs, keydata, {
    //     iv: CryptoJS.enc.Utf8.parse(iv),
    //     mode: CryptoJS.mode.ECB,
    //     padding: CryptoJS.pad.Pkcs7
    //   })
    //   return encrypted.ciphertext.toString(CryptoJS.enc.Base64)
    // },
    ajaxData () {
      if (this.password.length >= 6) {
        let pwd = this.password.join(' ').replace(/\s/g, '')
        this.$emit('backFn', pwd)
      }
      return false
    },
    clearPasswordHandle () {
      this.password = []
    },
    forgetPwd () {
      let url = escape(location.href)
      getUserInfo().then(res => {
        if (res.code === '0') {
          res.data.email = res.data.email || ''
          if (location.href.indexOf('uat') !== -1) {
            window.location.href = `http://user-c.uat.4px.com/m/hk/payCode?service=${url}&email=${res.data.email}&timestamp=${new Date().getTime()}&countryId=460`
          } else {
            window.location.href = `http://user-c.4px.com/m/hk/payCode?service=${url}&email=${res.data.email}&timestamp=${new Date().getTime()}&countryId=460`
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .pay-tool {
    position: relative;
    height: 100%;
    background-color: #fff;
    overflow: hidden;
    &-title {
      width: 100%;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      overflow: hidden;
      font-weight: 900;
      font-size: 0.32rem;
      .iconfont {
        position: absolute;
        top: 0;
        left: 0;
        width: 1rem;
        height: 1rem;
        font-size: 0.5rem;
        font-weight: normal;
      }
    }
    &-content {
      .pay-tool-inputs {
        width: 6.8rem;
        height: 1rem;
        margin: 0.2rem auto 0;
        border: 1px solid #b9b9b9;
        border-radius: 0.1rem;
        box-shadow: 0 0 1px #e6e6e6;
        display: flex;
        .item {
          width: 16.66666666%;
          height: 1rem;
          border-right: 1px solid #b9b9b9;
          line-height: 1rem;
          text-align: center;
          &:last-child {
            border-right: none;
          }
          .icon_dot {
            display: inline-block;
            width: 1rem;
            height: 1rem;
            background: url("../../assets/image/icon_dot.png") center no-repeat;
            background-size: 50%;
          }
        }
      }
      .pay-tool-link {
        height: 0.8rem;
        line-height: 0.8rem;
        overflow: hidden;
        margin-right: 0.3rem;
        text-align: right;
        font-size: 0.3rem;
        color: #3c8cfb;
      }
    }
    .pay-tool-keyboard {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      ul {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        li {
          width: 33.3333%;
          height: 1.2rem;
          line-height: 1.2rem;
          text-align: center;
          border-right: 1px solid #aeaeae;
          border-bottom: 1px solid #aeaeae;
          font-size: 0.6rem;
          font-weight: bold;
          box-sizing: border-box;
          list-style: none;
          &:nth-child(1),
          &:nth-child(2),
          &:nth-child(3) {
            border-top: 1px solid #eee;
          }
          &:nth-child(3),
          &:nth-child(6),
          &:nth-child(9),
          &:nth-child(12) {
            border-right: none;
          }
          &:nth-child(10),
          &:nth-child(11),
          &:nth-child(12) {
            border-bottom: none;
            .iconfont {
              font-size: 0.6rem;
            }
          }
          &:nth-child(10),
          &:nth-child(12),
          &:active {
            background-color: #d1d4dd;
          }
          &:nth-child(12):active {
            background-color: #fff;
          }
        }
      }
    }
  }
</style>
