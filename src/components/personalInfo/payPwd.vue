<template>
  <div class="pay-psd">
    <div v-if="isEdit"
      class="pay-tool-content"
      @click="handleOldPsd">
      <p class="pay-tool-content-title">請輸入原始支付密碼</p>
      <div class="pay-tool-inputs">
        <div class="item"
          v-for="(i, index) in items"
          :key="index"><span class="icon_dot"
            v-if="oldPassword[i]"></span></div>
      </div>
    </div>

    <div class="pay-tool-content"
      @click="handlePsd">
      <p class="pay-tool-content-title">請輸入支付密碼</p>
      <div class="pay-tool-inputs">
        <div class="item"
          v-for="(i, index) in items"
          :key="index"><span class="icon_dot"
            v-if="password[i]"></span></div>
      </div>
    </div>

    <div class="pay-tool-content"
      @click="handleCheckPsd">
      <p class="pay-tool-content-title">請確認支付密碼</p>
      <div class="pay-tool-inputs">
        <div class="item"
          v-for="(i, index) in items"
          :key="index"><span class="icon_dot"
            v-if="checkPwd[i]"></span></div>
      </div>
    </div>

    <group>
      <x-input title="圖形碼"
        v-model="verificationCode"
        placeholder="請輸入圖形碼">
        <img slot="right"
          class="img"
          @click="getVerificationCode"
          :src="imgUrl">
      </x-input>
      <x-input title="驗證碼"
        v-model.trim="verificationKey"
        class="weui-vcode">
        <x-button slot="right"
          type="primary"
          class="btn"
          :disabled="sendFlag"
          @click.native="handlePostCode"
          mini>{{ text }}</x-button>
      </x-input>
    </group>
    <p v-show="email"
      class="pay-tool-content-title">驗證碼已發送至：{{email}}</p>
    <div class="btn-lg btn-box"
      @click="handleSubmit">
      提 交
    </div>

    <!-- 键盘弹框 -->
    <div v-transfer-dom
      class="pay-complete">
      <popup v-model="keyboardShow"
        height="6rem">
        <keyboard ref="keyboard"
          :isSet="true"
          @chooseNum="chooseNum"
          @delNum="delNum"
          @close="keyboardClose"></keyboard>
      </popup>
    </div>

  </div>
</template>

<script>
import * as API from '@/api/personalInfo'
import { Popup, XInput, Group, XButton } from 'vux'
import keyboard from '@/common/keyboard'
let CryptoJS = require('cryp-to-js').default
export default {
  name: 'payPsd',
  components: {
    keyboard,
    Popup,
    XInput,
    XButton,
    Group
  },
  data () {
    return {
      isEdit: false,
      items: [0, 1, 2, 3, 4, 5],
      oldPassword: [],
      password: [],
      checkPwd: [],
      psdType: 0,
      verificationKey: '',
      keyboardShow: false,
      email: '',
      secretKey: '',
      second: 60,
      time: 0,
      sendFlag: false,
      imgUrl: process.env.NODE_ENV === 'development' ? '/api/code/kaptcha.jpg' : '/code/kaptcha.jpg',
      verificationCode: '' // 图形码
    }
  },
  created () {
    this.isEdit = this.$route.name === 'editPayPwd'
    this.getKey(16)
  },
  computed: {
    text () {
      return this.time > 0 ? this.time + 's 后重新獲取' : '獲取驗證碼'
    }
  },
  methods: {
    // 获取图形码
    getVerificationCode () {
      let url = process.env.NODE_ENV === 'development' ? '/api/code/kaptcha.jpg' : '/code/kaptcha.jpg'
      this.imgUrl = `${url}?t=${new Date().getTime()}`
    },
    run: function () {
      this.time = this.second
      this.timer()
    },
    stop: function () {
      this.time = 0
      this.sendFlag = false
    },
    timer: function () {
      if (this.time > 0) {
        this.time--
        setTimeout(this.timer, 1000)
      } else {
        this.sendFlag = false
      }
    },
    keyboardClose () {
      this.keyboardShow = false
    },
    handleOldPsd () {
      this.psdType = -1
      this.keyboardShow = true
    },
    handlePsd () {
      this.psdType = 0
      this.keyboardShow = true
    },
    handleCheckPsd () {
      this.psdType = 1
      this.keyboardShow = true
    },
    chooseNum (text) {
      let foo = this.psdType === -1 ? this.oldPassword : this.psdType ? this.checkPwd : this.password
      if (foo.length >= 6) return
      foo.push(text)
      if (foo.length >= 6) this.keyboardShow = false
    },
    delNum () {
      let foo = this.psdType === -1 ? this.oldPassword : this.psdType ? this.checkPwd : this.password
      if (foo.length <= 0) return
      foo.shift()
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
    handlePostCode () {
      if (!this.verificationCode) {
        this.$vux.toast.text('請輸入圖形碼')
        return
      }
      this.sendFlag = true
      if (this.isEdit) {
        API.sendEditPayPasswordVerifyMessage({ verificationCode: this.verificationCode }).then(res => {
          if (res.code === '0') {
            if (res.data && res.data.code === '0') {
              // 启动倒计时
              this.run()
              this.email = res.data.phone + ' ' + res.data.message
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
      } else {
        API.sendCreatePayPasswordVerifyMessage({ verificationCode: this.verificationCode }).then(res => {
          if (res.code === '0') {
            if (res.data && res.data.code === '0') {
              // 启动倒计时
              this.run()
              this.email = res.data.phone + ' ' + res.data.message
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
      }
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
    handleSubmit () {
      if (this.isEdit && this.oldPassword.length < 6) {
        this.$vux.toast.text('請輸入原始支付密碼')
        return
      }
      if (this.password.length < 6) {
        this.$vux.toast.text('請輸入支付密碼')
        return
      }
      if (this.checkPwd.length < 6) {
        this.$vux.toast.text('請確認支付密碼')
        return
      }
      if (!this.verificationKey) {
        this.$vux.toast.text('請輸入驗證碼')
        return
      }
      let old = this.oldPassword.join(' ').replace(/\s/g, '')
      old = this.encryptedAES(old, this.secretKey)
      let pwd = this.password.join(' ').replace(/\s/g, '')
      pwd = this.encryptedAES(pwd, this.secretKey)
      let cpwd = this.checkPwd.join(' ').replace(/\s/g, '')
      cpwd = this.encryptedAES(cpwd, this.secretKey)
      let verificationKey = this.verificationKey
      if (pwd !== cpwd) {
        this.$vux.toast.text('兩次輸入不一致，請再次輸入')
        this.password = []
        this.checkPwd = []
        return
      }
      if (this.isEdit) {
        let data = {
          oldPassword: old,
          password: pwd,
          confirmPassword: cpwd,
          key: this.secretKey,
          verificationKey: verificationKey
        }
        API.updatePayPassword(data).then(res => {
          if (res.code === '0') {
            this.$vux.toast.text('修改支付密碼成功')
            this.$router.go(-1)
          }
        })
      } else {
        let data = {
          password: pwd,
          confirmPassword: cpwd,
          key: this.secretKey,
          verificationKey: verificationKey
        }
        API.createPayPassword(data).then(res => {
          if (res.code === '0') {
            this.$vux.toast.text('設置支付密碼成功')
            this.$router.go(-1)
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .pay-psd {
    font-size: 0.28rem;
    overflow: hidden;
    box-sizing: border-box;
    padding: 0 0.3rem;
    .pay-tool-content {
      margin-top: 0.3rem;
      &-title {
        margin: 0.2rem 0;
      }
      .pay-tool-inputs {
        width: 6.8rem;
        height: 1rem;
        // margin: 0.2rem auto 0;
        border: 1px solid #b9b9b9;
        border-radius: 0.1rem;
        box-shadow: 0 0 1px #e6e6e6;
        background: #fff;
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
    }
    .btn-box {
      margin-top: 0.3rem;
      text-align: center;
    }
    .btn {
      background: @primary;
    }
  }
</style>
