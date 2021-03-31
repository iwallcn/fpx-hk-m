<template>
  <div class="mainland">
    <group class="other first-cell"
      label-width="1.6rem">
      <x-input v-if="type === 'edit'"
        v-model="obj.oldPassword"
        title="旧密碼"
        placeholder="請輸入旧密碼"></x-input>

      <x-input v-model="obj.password"
        title="新密碼"
        placeholder="請輸入新密碼"></x-input>

      <x-input v-model="obj.confirmPassword"
        title="重複新密碼"
        placeholder="請重複輸入新密碼"></x-input>

      <x-input v-model="obj.verificationKey"
        title="驗證碼"
        placeholder="請輸入驗證碼"></x-input>
    </group>

    <button class="btm-ml"
      @click="sendValid()"
      :disabled=sendFlag>{{ text }}</button>
    <span v-if="sendSuccess">验证码已发送至：{{ mail }},请注意查收</span>

    <footer class="footer-fixed">
      <button :class="'btn-ml'"
        @click="updatePayPassword()">确定</button>
    </footer>
  </div>
</template>

<script>
import { Group, Cell, CellBox, XInput, XButton, XHeader } from 'vux'
import * as payPwdEdit from '@/api/myBalance/payPwdEdit'

export default {
  name: 'payPwdEdit',
  data () {
    return {
      title: this.$route.query.type === 'edit' ? '修改支付密码' : '设置支付密码',
      type: this.$route.query.type,
      obj: {
        oldPassword: '',
        password: '',
        confirmPassword: '',
        verificationKey: ''
      },
      mail: '',
      sendSuccess: false,
      sendFlag: false,
      second: 60,
      time: 0
    }
  },
  computed: {
    text: function () {
      return this.time > 0 ? this.time + 's 后重获取' : '获取验证码'
    }
  },
  created () {
  },
  methods: {
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

    // 需要调用方法去发送邮箱验证码
    sendValid () {
      this.sendFlag = true
      payPwdEdit.sendEditPayPasswordVerifyMessage().then(res => {
        if (res.code === this.GLOBAL.code) {
          if (res.data && res.data.code === '0') {
            // 启动倒计时
            this.run()
            // 增加提示语  验证码已发送至：邮箱地址
            this.mail = res.data.message
            this.sendSuccess = true
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
    // 保存修改
    updatePayPassword () {
      payPwdEdit.updatePayPassword(this.obj).then(res => {
        this.$vux.toast.text(res.message)
        if (res.code === this.GLOBAL.code) {
          // 成功则返回我的余额页面
          this.$router.push({ name: 'balance' })
        }
      })
    }
  },
  filters: {

  },
  components: {
    Group,
    Cell,
    CellBox,
    XButton,
    XInput,
    XHeader,
    payPwdEdit
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";

  .mainland {
    .other {
      .weui-cells {
        .weui-cell {
          font-size: 0.28rem;
          img {
            width: 1.2rem;
            height: auto;
          }
          i {
            color: @primary;
            font-size: 0.36rem;
            padding-right: 0.16rem;
          }
        }
      }
    }
  }
</style>
<style lang="less">
  .mainland {
    .other:first-child .weui-cells {
      .weui-cell {
        justify-content: space-between;
      }
    }
    .exit {
      .weui-cells {
        text-align: center;
        span {
          padding: 0.17rem 0;
          display: block;
          color: @error;
        }
      }
    }
  }
</style>
<style scoped>
  .layout-header {
    background: @primary !important;
  }
</style>
