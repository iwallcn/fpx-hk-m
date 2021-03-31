<template>
  <div class="footer-tabbar-box">
    <div @click="routerChange('home')" class="footer-tabbar">
      <img class="footer-tabbar-img" src="@/assets/image/btn_home_selected2.png" alt="" srcset="">
      <div style="color: #ff6400;" class="footer-tabbar-text">首頁</div>
    </div>
    <div @click="routerChange('orders')" class="footer-tabbar">
      <img class="footer-tabbar-img" src="@/assets/image/btn_bag_normal2.png" alt="" srcset="">
      <div class="footer-tabbar-text">我的包裹</div>
    </div>
    <div @click="routerChange('shipments')" class="footer-tabbar">
      <img class="footer-tabbar-img center" src="@/assets/image/order.png" alt="" srcset="">
      <div class="footer-tabbar-text">在綫下單</div>
    </div>
    <div @click="routerChange('warehouse')" class="footer-tabbar">
      <img class="footer-tabbar-img" src="@/assets/image/btn_warehouse_normal2.png" alt="" srcset="">
      <div class="footer-tabbar-text">倉庫地址</div>
    </div>
    <div @click="routerChange('account')" class="footer-tabbar">
      <img class="footer-tabbar-img" src="@/assets/image/btn_user_normal2.png" alt="" srcset="">
      <div class="footer-tabbar-text">個人中心</div>
    </div>
  </div>
  <!-- <tabbar v-model="currentIndex">
    <tabbar-item link="/">
      <img slot="icon"
        src="@/assets/image/btn_home_selected2.png">
      <span slot="label">首頁</span>
    </tabbar-item>
    <tabbar-item link="/account/orders">
      <img slot="icon"
        src="@/assets/image/btn_bag_normal2.png">
      <span slot="label">我的包裹</span>
    </tabbar-item>
    <tabbar-item @on-item-click="handleService">
      <img slot="icon"
        src="@/assets/image/btn_service_normal2.png">
      <span slot="label">客服</span>
    </tabbar-item>
    <tabbar-item @on-item-click="handlerWarehouse">
      <img slot="icon"
        src="@/assets/image/btn_warehouse_normal2.png">
      <span slot="label">倉庫地址</span>
    </tabbar-item> -->

    <!-- <tabbar-item @on-item-click="handlerItemClick('appointment')">
      <i slot="icon"
        class="iconfont icon-ico-yuyue"></i>
      <span slot="label">自提預約</span>
    </tabbar-item> -->

    <!-- <tabbar-item @on-item-click="handlerAccount">
      <img slot="icon"
        src="@/assets/image/btn_user_normal2.png">
      <span slot="label">個人中心</span>
    </tabbar-item>
  </tabbar> -->
</template>

<script>
import { mapMutations } from 'vuex'
// import { Tabbar, TabbarItem } from 'vux'
export default {
  name: 'footerTabbar',
  props: {
    currentTabbar: {
      type: Number
    }
  },
  data () {
    return {
      currentIndex: this.currentTabbar
    }
  },
  created () {

  },
  methods: {
    // handleOrder () {
    //   this.DELETE_ORDER_DATA()
    //   this.$router.push({ name: 'shipments' })
    // },
    // handlerItemClick (str) {
    //   this.$router.push({ name: 'orders', params: { type: str } })
    // },
    // 客服链接
    handleService () {
      window.location.href = 'https://4px.s2.udesk.cn/im_client/?web_plugin_id=8071&group_id=10387&language=zh-HK&channel=%E5%AE%98%E7%B6%B2'
    },
    // 海外仓地址
    handlerWarehouse () {
      this.$router.push({ name: 'warehouse' })
    },
    handlerAccount () {
      this.$router.push({ name: 'account' })
    },
    routerChange (name) {
      if (name) {
        if (name === 'shipments') {
          this.DELETE_ORDER_DATA()
        }
        this.$router.push({ name })
      }
    },
    ...mapMutations([
      'DELETE_ORDER_DATA'
    ])
  },
  components: {
    // Tabbar,
    // TabbarItem
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .footer-tabbar-box{
    height: 1.9rem;
    background: url(../../assets/image/tab_bg.png) no-repeat;
    background-size: 100%;
    display: flex;
    padding-top: 0.55rem;
    box-sizing: border-box;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    .footer-tabbar{
      flex: 1;
      .footer-tabbar-img{
        margin: 0.1rem auto;
        display: block;
        width: 0.7rem;
        height: 0.7rem;
        &.center{
          position: relative;
          top: -0.2rem;
          transform: scale(1.42);
        }
      }
      .footer-tabbar-text{
        text-align: center;
        font-size: 0.2rem;
        font-weight: 500;
      }
    }
  }
</style>
<style lang="less">
  .mainland.home {
    padding-bottom: 1.35rem;
    .weui-tabbar {
      background-color: #fff;
      padding: 0 0 0.08rem 0;
      position: fixed;
      box-shadow: -1px 2px 10px rgba(237, 109, 0, 0.1);
      &::before {
        border: none;
      }
      .weui-tabbar__icon {
        height: auto !important;
        i {
          color: #fff;
          font-size: 0.4rem;
        }
      }
      .weui-tabbar__label {
        span {
          color: #4c4c4c;
          font-size: 0.26rem;
        }
      }
    }
  }
</style>
