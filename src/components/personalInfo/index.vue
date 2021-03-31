<template>
  <div class="mainland">
    <x-header class="layout-header">{{ title }}</x-header>
    <group class="other first-cell"
      label-width="1.6rem">
      <!-- <cell-box>
        <span>头像</span>
        <img src="@/assets/image/avatar.png">
      </cell-box> -->
      <cell title="昵稱"
        is-link
        value-align="left"
        :value="infos.firstName"
        @click.native="handlerNickname(infos.firstName)"></cell>
      <popup-picker title="性別"
        :data="genderList"
        v-model="gender"
        show-name
        @on-hide="handlerGender"
        :columns="1"></popup-picker>
      <cell title="用戶編碼"
        value-align="left"
        :value="infos.memberCode"></cell>
      <!-- <cell title="手機號"
        value-align="left"
        :value="infos.tel"></cell> -->
      <cell title="手機號"
        is-link
        value-align="left"
        :value="infos.tel ? infos.tel : '設置手機號'"
        @click.native="handlerPhone"></cell>
      <cell title="郵箱"
        is-link
        value-align="left"
        :value="infos.email ? infos.email : '設置郵箱'"
        @click.native="handlerEmail()"></cell>
      <!-- <cell title="支付密码"
        :is-loading="payInfo.isOpenPayPassword === undefined"
        :value="payInfo.isOpenPayPassword === undefined ? '' : payInfo.isOpenPayPassword ? '修改' : '立即設置'"
        :link="payInfo.isOpenPayPassword === undefined ? '' : payInfo.isOpenPayPassword ? {name: 'editPayPwd'} : {name: 'payPwd'}"
        is-link></cell> -->
    </group>
    <!-- <group class="other">
      <cell title="实名认证"
        :value="infos.certificateKey == '' ? '未认证': '已认证'"
        is-link
        @click.native="handlerCertifica"
        value-align="right"></cell>
    </group> -->
    <!-- <group class="other">
      <cell title="手机号"
        :value="infos.tel"
        value-align="right"></cell>
      <cell title="邮箱"
        :value="infos.email"
        value-align="right"></cell>
    </group> -->
    <!-- <group class="exit">
      <span @click="handlerExit">退出并解绑</span>
    </group> -->
  </div>
</template>

<script>
import { Group, Cell, CellBox, XButton, XHeader, PopupPicker } from 'vux'
import { getUserInfo, getOpenBalancePayInfo, editUserInfo } from '@/api/personalInfo'
export default {
  name: 'personalInfo',
  data () {
    return {
      title: '个人资料',
      infos: {},
      payInfo: {},
      gender: [],
      genderList: [{
        name: '男',
        value: '0'
      }, {
        name: '女',
        value: '1'
      }]
    }
  },
  created () {
    this.getPersonInfo()
  },
  methods: {
    handlerGender (type) {
      if (!type) {
        return
      }
      let obj = {
        gender: parseInt(this.gender.join())
      }
      editUserInfo(obj).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.$vux.toast.text('修改成功')
        }
      })
    },
    // 实名认证
    handlerCertifica () {
      if (this.infos && this.infos.certificateKey) {
        this.$router.push({ name: 'certification', query: { certificateKey: this.infos.certificateKey } })
      } else {
        this.$router.push({ name: 'certification' })
      }
    },
    getPersonInfo () {
      getUserInfo().then(res => {
        if (res.code === this.GLOBAL.code) {
          this.infos = res.data
          this.gender = [this.infos.gender.toString()]
        }
      })
      getOpenBalancePayInfo().then(res => {
        if (res.code === this.GLOBAL.code) {
          this.payInfo = res.data
        }
      })
    },
    // 退出
    handlerExit () {
      // 调用退出接口
    },
    handlerNickname (name) {
      this.$router.push({ name: 'nickName', query: { name } })
    },
    // 绑定邮箱并修改邮箱
    handlerEmail () {
      if (this.infos.email) { // 修改邮箱
        this.$router.push({ name: 'updateemail', query: { email: this.infos.email } })
      } else { // 绑定邮箱
        this.$router.push({ name: 'setemail' })
      }
    },
    // 修改手机号
    handlerPhone () {
      if (this.infos.tel) { // 修改手机
        this.$router.push({ name: 'updatetel', query: { areacode: this.infos.areaCode, tel: this.infos.tel } })
      } else { // 绑定手机
        this.$router.push({ name: 'settel' })
      }
    }
  },
  filters: {
    filterGender (val) {
      return val === 0 ? '男' : '女'
    }
  },
  components: {
    Group,
    Cell,
    CellBox,
    XButton,
    XHeader,
    PopupPicker
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .vux-header {
    background: @primary!important;
  }
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
