<template>
  <div class="layout">
    <x-header class="layout-header"
      @on-click-back="handlerBack"
      :left-options="{preventGoBack: true}">
      {{$route.meta.title}}
      <a slot="right">
        <i :class="['iconfont', menuShow ? 'icon-close' : 'icon-menu']"
          @click="menuShow=!menuShow"></i>
      </a>
    </x-header>
    <!-- rourer-view 作为默认插槽内容 -->
    <article class="layout-main">
      <!-- <keep-alive :include="['order']">
        <router-view />
      </keep-alive> -->
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </article>

    <!--頭部菜單-->
    <div v-transfer-dom>
      <popup v-model="menuShow"
        class="menuPopup"
        height="calc(100% - 0.92rem)">
        <div class="menu"
          @click="handlerHome"><span>首頁</span><i class="iconfont icon-right"></i></div>
        <div class="menu"
          @click="handlerOrder"><span>新增包裹</span><i class="iconfont icon-right"></i></div>
        <div class="menu"
          @click="handlerPackage"><span>我的包裹</span><i class="iconfont icon-right"></i></div>
        <div class="menu"
          @click="handlerTrial"><span>運費試算</span><i class="iconfont icon-right"></i></div>
        <!-- <div class="menu"
          @click="handlerAppoint"><span>自提預約</span><i class="iconfont icon-right"></i></div> -->
        <div class="menu"
          @click="handlerCenter"><span>個人中心</span><i class="iconfont icon-right"></i></div>
        <div class="menu"
          @click="handleBlog"><span>折扣商品</span><i class="iconfont icon-right"></i></div>
        <!-- <div class="menu"
          @click="handlerPrice"><span>服務與價格</span><i class="iconfont icon-right"></i></div> -->
        <div class="menu"
          @click="handlerIssue"><span>問題件處理</span><i class="iconfont icon-right"></i></div>
        <div class="menu"
          @click="handlerGuide"><span>新手教程</span><i class="iconfont icon-right"></i></div>
        <div class="menu"
          @click="handleService"><span>在綫客服</span><i class="iconfont icon-right"></i></div>
        <div class="menu"
          @click="handlerFaq"><span>常見問題</span><i class="iconfont icon-right"></i></div>
        <div class="menu"
          @click="handlerInsurance"><span>保險與理賠</span><i class="iconfont icon-right"></i></div>
        <div class="menu"
          @click="handlerVip"><span>會員特權</span><i class="iconfont icon-right"></i></div>
      </popup>
    </div>
  </div>
</template>

<script>
import { Drawer, XHeader, Popup } from 'vux'
export default {
  name: 'layout',
  data () {
    return {
      drawerShow: false,
      showMore: false,
      menuShow: false,
      isNotify: false // 是否有通知栏信息
    }
  },
  created () {
  },
  methods: {
    handlerBack () {
      // 如果是預約詳情，則直接跳轉到我的預約頁面
      if (this.$route.name === 'appointDetail') {
        this.$router.push({ name: 'orders', params: { type: 'appointment' } })
        return
      }
      if (this.$route.name === 'package') {
        this.$router.push({ name: 'home' })
        return
      }
      // 如果是确认支付页面，返回则直接返回到列表页面
      if (this.$route.name === 'payment') {
        if (this.$route.query.type === 'returns') {
          this.$router.replace({ name: 'returns' })
          return
        } else {
          this.$router.replace({ name: 'orders' })
          return
        }
      }
      // 方案一：
      // window.history.go(-1)
      // return false
      (this.to === undefined) ? this.$router.go(-1) : this.$router.push({ path: this.to })
    },
    handlerHome () {
      this.menuShow = false
      this.$router.push({ name: 'home' })
    },
    handlerOrder () {
      this.menuShow = false
      this.$router.push({ name: 'shipments' })
    },
    handlerPackage () {
      this.menuShow = false
      this.$router.push({ name: 'orders', params: { type: 'package' } })
    },
    handlerTrial () {
      this.menuShow = false
      this.$router.push({ name: 'trial' })
    },
    handlerAppoint () {
      this.menuShow = false
      this.$router.push({ name: 'orders', params: { type: 'appointment' } })
    },
    handlerCenter () {
      this.menuShow = false
      this.$router.push({ name: 'account' })
    },
    // 折扣信息
    handleBlog () {
      this.menuShow = false
      window.location = 'https://hk.4px.com/blog/'
    },
    // 新手教程
    handlerGuide () {
      this.menuShow = false
      this.$router.push({ name: 'tutorial' })
    },
    // 在綫客服
    handleService () {
      this.menuShow = false
      window.location.href = 'https://4px.s2.udesk.cn/im_client/?web_plugin_id=8071&group_id=10387&language=zh-HK&channel=%E5%AE%98%E7%B6%B2'
    },
    // 常見問題
    handlerFaq () {
      this.menuShow = false
      this.$router.push({ name: 'faq' })
    },
    // 保險與理賠
    handlerInsurance () {
      this.menuShow = false
      this.$router.push({ name: 'insurance' })
    },
    // 會員特權
    handlerVip () {
      this.menuShow = false
      this.$router.push({ name: 'vip' })
    },
    // 服务与价格
    handlerPrice () {
      this.menuShow = false
      this.$router.push({ name: 'pricing' })
    },
    // 問題件處理
    handlerIssue () {
      this.menuShow = false
      this.$router.push({ name: 'issue' })
    }
  },
  components: {
    Drawer,
    XHeader,
    Popup
  }
}
</script>

<style lang="less">
  .layout {
    width: 100%;
    height: 100%;
    &-header {
      z-index: 999;
      position: relative;
      background: @primary !important;
    }
    &-main {
      position: relative;
      width: 100%;
      height: calc(~"100% - 46px");
      overflow-y: auto;
    }
    .vux-header .vux-header-right {
      right: 0;
      i {
        font-size: 0.4rem;
        padding: 0.2rem;
      }
    }
  }
  .menuPopup {
    background: rgba(51, 51, 51, 0.9) !important;
    .menu {
      font-size: 0.32rem;
      color: rgba(255, 255, 255, 0.8);
      border-bottom: rgba(255, 255, 255, 0.12) 1px solid;
      padding: 0.34rem 0.32rem;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      i {
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
  .vux-popup-dialog {
    z-index: 1000 !important;
  }
</style>
