<template>
  <div class="mainland">
    <group class="frist-cell"
      label-width="1.4rem">
      <x-input title="激活碼"
        v-model="code"
        placeholder="請輸入激活碼"
        @on-click-clear-icon="clearInput"></x-input>
    </group>
    <div class="btns">
      <button @click="activeCoupon"
        :class="[{disabled: disabled}, 'btn-ml']"
        :disabled="disabled">激活</button>
    </div>
    <!-- <div class="infos">
      <p><i class="iconfont icon-tishi"></i>温馨提示：</p>
      <p>优惠券激活码主要来源于线下派发的优惠券。</p>
      <p>线上领取的优惠券无须激活可直接使用。</p>
    </div> -->
  </div>
</template>

<script>
import { Group, XInput } from 'vux'
import * as API from '@/api/myCoupon'
export default {
  name: 'activateCoupon',
  data () {
    return {
      code: '',
      disabled: true
    }
  },
  created () {

  },
  methods: {
    // 激活优惠券
    activeCoupon () {
      var couponCode = this.code
      API.activeCoupon(couponCode).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.$vux.toast.text(res.message || '激活成功')
          this.$router.push({ name: 'coupon' })
        } else {
          this.$vux.toast.text(res.message)
        }
      })
    },
    // 清楚输入框
    clearInput () {
      this.code = ''
    }
  },
  watch: {
    code () {
      if (this.code.trim()) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    }
  },
  components: {
    Group,
    XInput
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .mainland {
    .btns {
      margin: 0 0.3rem 0.3rem 0.3rem;
    }
    .infos {
      font-size: 0.24rem;
      color: #999;
      padding: 0 0.3rem;
      p {
        padding-bottom: 0.12rem;
        text-indent: 0.3rem;
        &:first-child {
          text-indent: 0;
        }
      }
    }
  }
</style>
<style lang="less">
  .mainland {
    .frist-cell .weui-cells {
      margin-top: 0;
    }
  }
</style>
