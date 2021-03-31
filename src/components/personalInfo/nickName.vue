<template>
  <div class="mainland">
    <x-header class="layout-header">{{ title }}<a class="btn"
        @click="handlerNickName">確定</a></x-header>
    <input type="text"
      v-model="obj.firstName"
      ref="firstName"
      v-focus>
  </div>
</template>

<script>
import { XHeader } from 'vux'
import { editUserInfo } from '@/api/personalInfo'
import { mapMutations } from 'vuex'
export default {
  name: 'personalInfo',
  data () {
    return {
      title: '修改昵稱',
      obj: {
        firstName: ''
      }
    }
  },
  created () {
    this.obj.firstName = this.$route.query.name
  },
  directives: {
    focus: {
      // 指令的定义
      inserted: function (el) {
        el.focus()
      }
    }
  },
  methods: {
    // 修改昵稱
    handlerNickName () {
      if (!this.obj.firstName.trim()) {
        this.$vux.toast.text('請輸入昵稱')
        this.$refs.firstName.focus()
        return
      }
      editUserInfo(this.obj).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.$vux.toast.text('修改成功')
          // 修改缓存中的用户信息
          this.$store.state.userBaseInfo.firstName = this.obj.firstName
          this.SET_USER_BASE_INFO(this.$store.state.userBaseInfo)
          this.$router.push({ name: 'profile' })
        }
      })
    },
    ...mapMutations(['SET_USER_BASE_INFO'])
  },
  components: {
    XHeader
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .vux-header {
    background: @primary!important;
  }
  .mainland {
    input {
      font-size: 0.28rem;
      display: flex;
      width: 100%;
      padding: 0.2rem;
    }
    .btn {
      color: #fff;
      font-size: 0.3rem;
      position: absolute;
      right: 4px;
      padding: 0 0.16rem;
      cursor: pointer;
    }
  }
</style>
