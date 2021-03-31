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
          title="修改手機"></flow-state>
        <flow-line></flow-line>
        <flow-state state="3"
          title="完成"></flow-state>
      </flow>

      <group label-width="1.8rem"
        class="setemail"
        label-margin-right="0.05rem"
        label-align="left">
        <popup-radio class="register-areacode"
          title="選擇區號"
          readonly
          :options="areacodeOption"
          v-model="obj.areacode"></popup-radio>
        <x-input title="原手機號碼"
          v-model="obj.tel"
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
        <x-input title="短信驗證碼"
          v-model="obj.validateCode"
          placeholder="輸入短信驗證碼">
          <x-button slot="right"
            type="primary"
            class="btn"
            :max="6"
            :disabled="sendFlag"
            @click.native="getVerificationKey('old')"
            mini>{{text}}</x-button>
        </x-input>
      </group>

      <div class="submission">
        <button :class="{isActive: isActive}"
          :disabled="!isActive"
          @click="verifyUsedTel">提交</button>
      </div>
    </template>

    <!-- 第二步：修改手機 -->
    <template v-if="currentStep === 2">
      <flow class="flow-wrapper">
        <flow-state state="1"
          is-done
          title="驗證身份"></flow-state>
        <flow-line is-done></flow-line>
        <flow-state state="2"
          is-done
          title="修改手機"></flow-state>
        <flow-line tip="進行中"></flow-line>
        <flow-state state="3"
          title="完成"></flow-state>
      </flow>

      <group label-width="1.8rem"
        class="setemail"
        label-margin-right="0.05rem"
        label-align="left">
        <popup-radio class="register-areacode"
          title="選擇區號"
          :options="areacodeOption"
          v-model="obj.areacode"></popup-radio>
        <x-input title="新手機號碼"
          v-model="obj.tel"
          @on-blur="checkTel"
          ref="tel"
          placeholder="輸入您的手機號碼">
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
        <x-input title="短信驗證碼"
          v-model="obj.validateCode"
          ref="validateCode"
          placeholder="輸入短信驗證碼">
          <x-button slot="right"
            type="primary"
            class="btn"
            :max="6"
            :disabled="sendFlag"
            @click.native="getVerificationKey('new')"
            mini>{{text}}</x-button>
        </x-input>
      </group>

      <div class="submission">
        <button :class="{isActive: isActive}"
          :disabled="!isActive"
          @click="verifyNewTel">提交</button>
      </div>
    </template>

    <!-- 第三步：完成 -->
    <template v-if="currentStep === 3">
      <flow class="flow-wrapper">
        <flow-state state="1"
          is-done
          title="驗證身份"></flow-state>
        <flow-line is-done></flow-line>
        <flow-state state="2"
          is-done
          title="修改手機"></flow-state>
        <flow-line is-done></flow-line>
        <flow-state state="3"
          is-done
          title="完成"></flow-state>
      </flow>
      <msg title="修改手機設置成功">
      </msg>
    </template>
  </div>
</template>

<script>
import { Flow, FlowState, FlowLine, Group, XInput, XButton, PopupRadio, Msg } from 'vux'
import { senderMobileCode, mobileUsedVerification, mobileNewVerification } from '@/api/personalInfo'
export default {
  name: 'updatetel',
  components: {
    Flow,
    FlowState,
    FlowLine,
    Group,
    XInput,
    XButton,
    PopupRadio,
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
      areacodeOption: [
        '+86',
        '+852'
      ],
      currentStep: 1 // 当前处于第一步
    }
  },
  created () {
    // 初始化获取图片验证码
    this.getVerificationCode()

    // 設置郵箱
    this.obj.areacode = window.decodeURIComponent(this.$route.query.areacode)
    this.obj.tel = this.$route.query.tel
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
  watch: {},
  methods: {
    // 验证手机格式是否正确
    checkTel () {
      if (!this.obj.areacode) {
        this.$vux.toast.text('請先選擇區域')
        return
      }
      if (!this.obj.tel) {
        this.$vux.toast.text('請輸入手機號')
        this.$refs.tel.focus()
        return
      }
      let regPhone = /^1[3-8]{1}\d{9}$/
      let regHKPhone = /^\d{8}$/
      if ((this.obj.areacode === '+86' && !regPhone.test(this.obj.tel)) || (this.obj.areacode === '+852' && !regHKPhone.test(this.obj.tel))) {
        this.$vux.toast.text('請輸入正確的手機號碼')
        this.$refs.tel.focus()
      }
    },
    // 获取图片验证码
    getVerificationCode () {
      let url = process.env.NODE_ENV === 'development' ? '/api/code/kaptcha.jpg' : '/code/kaptcha.jpg'
      this.imgUrl = `${url}?t=${new Date().getTime()}`
    },
    getVerificationKey (param) {
      if (!this.obj.verificationCode) {
        this.$vux.toast.text('請輸入驗證碼')
        this.$refs.code.focus()
        return
      }
      this.sendFlag = true
      let data = {
        areacode: this.obj.areacode,
        // mobile: param === 'old' ? '' : this.obj.tel,
        mobile: this.obj.tel,
        verificationCode: this.obj.verificationCode
      }
      senderMobileCode(data).then(res => {
        // if (res.code === this.GLOBAL.code) {
        //   // 启动倒计时
        //   this.run()
        //   this.$vux.toast.text('驗證碼已發送')
        // } else {
        //   // 停止倒计时
        //   this.stop()
        // }
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
    // 验证旧手机
    verifyUsedTel () {
      mobileUsedVerification({ verificationCode: this.obj.validateCode }).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.$vux.toast.text('舊手機驗證成功')
          this.obj = {
            tel: '',
            verificationCode: '',
            validateCode: ''
          }
          this.currentStep = 2
          this.stop()
          this.getVerificationCode()
        }
      })
    },
    // 验证新手机
    verifyNewTel () {
      if (!this.obj.tel) {
        this.$vux.toast.text('請輸入手機號')
        this.$refs.tel.focus()
        return
      }
      if (!this.obj.verificationCode) {
        this.$vux.toast.text('請輸入驗證碼')
        this.$refs.code.focus()
        return
      }
      if (!this.obj.validateCode) {
        this.$vux.toast.text('請輸入短信驗證碼')
        this.$refs.validateCode.focus()
        return
      }
      let data = {
        areacode: this.obj.areacode,
        mobile: this.obj.tel,
        verificationCode: this.obj.validateCode
      }
      mobileNewVerification(data).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.$vux.toast.text('手機驗證成功')
          this.obj = {
            tel: '',
            verificationCode: '',
            validateCode: ''
          }
          this.currentStep = 3
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
  .weui-cell {
    padding: 0.2rem 0.3rem !important;
  }
  .weui-check__label {
    font-size: 0.4rem !important;
  }
</style>
