<!--  -->
<template>
  <div class='mainland personalInfo'>
    <!-- 第一步：验证身份 -->
    <template v-if="currentStep === 1">
      <flow class="flow-wrapper">
        <flow-state state="1"
          is-done
          title="驗證身份"></flow-state>
        <flow-line tip="進行中"></flow-line>
        <flow-state state="2"
          title="修改郵箱"></flow-state>
        <flow-line></flow-line>
        <flow-state state="3"
          title="完成"></flow-state>
      </flow>

      <group label-width="1.8rem"
        class="setemail"
        label-margin-right="0.05rem"
        label-align="left">
        <x-input title="已驗證郵箱"
          v-model="obj.email"
          disabled>
        </x-input>
        <x-input title="圖片驗證碼"
          v-model="obj.verificationCode"
          ref="code"
          placeholder="輸入驗證碼">
          <img slot="right"
            class="img"
            @click="getVerificationCode"
            :src="imgUrl">
        </x-input>
        <x-input title="郵箱驗證碼"
          v-model="obj.validateCode"
          placeholder="輸入郵箱驗證碼">
          <x-button slot="right"
            type="primary"
            class="btn"
            :max="6"
            :disabled="sendFlag"
            @click.native="getVerificationKey"
            mini>{{text}}</x-button>
        </x-input>
      </group>

      <div class="submission">
        <button :class="{isActive: isActive}"
          :disabled="!isActive"
          @click="verifyUsedEmail">驗證舊郵箱</button>
      </div>
    </template>

    <!-- 第二步：修改邮箱 -->
    <template v-else-if="currentStep === 2">
      <flow class="flow-wrapper">
        <flow-state state="1"
          is-done
          title="驗證身份"></flow-state>
        <flow-line is-done></flow-line>
        <flow-state state="2"
          is-done
          title="修改郵箱"></flow-state>
        <flow-line tip="進行中"></flow-line>
        <flow-state state="3"
          title="完成"></flow-state>
      </flow>
      <group label-width="1.8rem"
        class="setemail"
        label-margin-right="0.05rem"
        label-align="left">
        <x-input title="輸入新郵箱"
          @on-blur="checkEmail"
          v-model="obj.email"
          ref="email"
          placeholder="輸入您的電子郵箱">
        </x-input>
        <x-input title="圖片驗證碼"
          v-model="obj.verificationCode"
          ref="code"
          placeholder="輸入驗證碼">
          <img slot="right"
            class="img"
            @click="getVerificationCode"
            :src="imgUrl">
        </x-input>
        <x-input title="郵箱驗證碼"
          v-model="obj.validateCode"
          ref="validateCode"
          placeholder="輸入郵箱驗證碼">
          <x-button slot="right"
            type="primary"
            class="btn"
            :max="6"
            :disabled="sendFlag"
            @click.native="getNewEmailCode"
            mini>{{text}}</x-button>
        </x-input>
      </group>
      <div class="submission">
        <button :class="{isActive: isActive}"
          :disabled="!isActive"
          @click="setEmailSubmit">提交</button>
      </div>
    </template>

    <!-- 第三步：完成 -->
    <template v-else>
      <flow class="flow-wrapper">
        <flow-state state="1"
          is-done
          title="驗證身份"></flow-state>
        <flow-line is-done></flow-line>
        <flow-state state="2"
          is-done
          title="修改郵箱"></flow-state>
        <flow-line is-done></flow-line>
        <flow-state state="3"
          is-done
          title="完成"></flow-state>
      </flow>
      <msg title="修改郵箱設置成功">
      </msg>
    </template>

  </div>
</template>

<script>
import { Flow, FlowState, FlowLine, Group, XInput, XButton, Msg } from 'vux'
import { emailSenderUsedCode, emailUsedVerification, senderNewEmailCode, emailNewVerification } from '@/api/personalInfo'
export default {
  name: 'updateemail',
  components: {
    Flow,
    FlowState,
    FlowLine,
    Group,
    XInput,
    XButton,
    Msg
  },
  data () {
    // 这里存放数据
    return {
      second: 60,
      time: 0,
      sendFlag: false,
      obj: {},
      imgUrl: '',
      currentStep: 1, // 当前处于第一步
      key: '' // 用户第一次验证旧邮箱的key
    }
  },
  created () {
    // 初始化获取图片验证码
    this.getVerificationCode()

    // 設置郵箱
    this.obj.email = this.$route.query.email
  },
  mounted () {

  },
  computed: {
    isActive () {
      if (!this.obj.verificationCode || !this.obj.validateCode) {
        return false
      } else {
        return true
      }
    },
    text () {
      return this.time > 0 ? this.time + 's后重新獲取' : '獲取驗證碼'
    }
  },
  methods: {
    // 检查邮箱格式是否正确
    checkEmail () {
      if (!this.obj.email) {
        this.$vux.toast.text('請輸入郵箱')
        this.$refs.email.focus()
        return
      }
      // let regEmail = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/
      // let regEmail = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      let regEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      if (!regEmail.test(this.obj.email.trim())) {
        this.$vux.toast.text('電子郵箱格式錯誤')
        this.$refs.email.focus()
      }
    },
    // 获取图片验证码
    getVerificationCode () {
      let url = process.env.NODE_ENV === 'development' ? '/api/code/kaptcha.jpg' : '/code/kaptcha.jpg'
      this.imgUrl = `${url}?t=${new Date().getTime()}`
    },
    // 获取邮箱验证码
    getVerificationKey () {
      if (!this.obj.verificationCode) {
        this.$vux.toast.text('請輸入驗證碼')
        this.$refs.code.focus()
        return
      }
      this.sendFlag = true
      emailSenderUsedCode({ verificationCode: this.obj.verificationCode }).then(res => {
        if (res.code === this.GLOBAL.code) {
          // 启动倒计时
          this.run()
          this.$vux.toast.text('驗證碼已發送')
        } else {
          // 停止倒计时
          this.stop()
        }
      })
    },
    // 验证旧邮箱
    verifyUsedEmail () {
      emailUsedVerification(this.obj.validateCode).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.$vux.toast.text('舊郵箱驗證成功')
          this.key = this.obj.validateCode
          this.obj = {
            email: '',
            verificationCode: '',
            validateCode: ''
          }
          this.currentStep = 2
          this.stop()
          this.getVerificationCode()
        }
      })
    },
    // 获取新邮箱验证码
    getNewEmailCode () {
      if (!this.obj.verificationCode) {
        this.$vux.toast.text('請輸入驗證碼')
        this.$refs.code.focus()
        return
      }
      this.sendFlag = true
      let data = {
        email: this.obj.email,
        verificationKey: this.key, // 旧邮箱验证的key
        verificationCode: this.obj.verificationCode
      }
      senderNewEmailCode(data).then(res => {
        if (res.code === this.GLOBAL.code) {
          // 启动倒计时
          this.run()
          this.$vux.toast.text('驗證碼已發送')
        } else {
          // 停止倒计时
          this.stop()
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
    // 修改郵箱 - 提交
    setEmailSubmit () {
      if (!this.obj.email) {
        this.$vux.toast.text('請輸入郵箱')
        this.$refs.email.focus()
        return
      }
      if (!this.obj.verificationCode) {
        this.$vux.toast.text('請輸入驗證碼')
        this.$refs.code.focus()
        return
      }
      if (!this.obj.validateCode) {
        this.$vux.toast.text('請輸入郵箱驗證碼')
        this.$refs.validateCode.focus()
        return
      }
      emailNewVerification(this.obj.validateCode).then(res => {
        if (res.code === this.GLOBAL.code) {
          // 跳转到第三步
          this.currentStep = 3
        } else {
          this.stop()
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>
  @import "../../assets/less/variable.less";
  .setemail {
    img {
      position: absolute;
      right: 0.3rem;
      top: 0.08rem;
      height: 0.76rem;
      width: 2rem;
    }
    .btn {
      background: @primary;
      color: #fff;
      width: 2rem;
      border-radius: 4px;
      padding: 0;
    }
  }
  .submission {
    margin: 0.5rem 0 0;
    padding: 0 0.3rem;
    font-size: 0;
    button {
      background: rgba(255, 100, 0, 0.5);
      color: #fff;
      border: none;
      width: 100%;
      padding: 0.2rem;
      font-size: 0.32rem;
      border-radius: 4px;
      &.isActive {
        background: @primary;
      }
    }
  }
</style>
<style lang="less">
  .flow-wrapper {
    [class^="weui-wepay-flow__info-"],
    .weui-wepay-flow__process,
    .weui-wepay-flow__li_done .weui-wepay-flow__state {
      background-color: @primary;
    }
    .weui-wepay-flow,
    .weui-wepay-flow-auto {
      padding: 0;
      .weui-wepay-flow__title-bottom {
        font-size: 0.24rem;
      }
    }
    .weui-wepay-flow__info-top:after {
      border-color: @primary transparent transparent;
    }
  }
  .personalInfo {
    .weui-icon-success {
      color: @primary;
    }
  }
</style>
