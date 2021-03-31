<template>
  <div :class="['mainland home', hasNotify ? 'notify': '']">
    <div :class="['home-header', hasScroll ? 'fixed': '']">
      <img src="@/assets/image/logo.png">
      <div class="login-register">
        <i :class="['iconfont', menuShow ? 'icon-close' : 'icon-menu']"
          @click="menuShow=!menuShow"></i>
      </div>
    </div>
    <div class="news">
      <i class="iconfont icon-ico-tongzhi"></i>
      <div class="new-info">
        <marquee>
          <marquee-item v-for="(val, index) in news"
            :key="index"
            item-height="0.4rem"
            @click.native="viewNewDetail(val)"
            class="align-middle"><span v-if="val.sortTop"
              class="sort-top">[置頂]&nbsp;</span>{{val.title}}</marquee-item>
        </marquee>
      </div>
    </div>
    <div class="banner-lunbo">
      <swiper :list="swiperList"
        v-if="swiperList.length"
        loop
        auto
        dots-position="center"></swiper>
    </div>
    <div class="items">
      <div class="item"
        @click="handlerMainland">
        <i class="iconfont icon-ico-xinzeng"></i>
        <span>内地到香港</span>
      </div>
      <div class="item"
        @click="handlerCampaignGlobal">
        <i class="iconfont icon-ico-quqiudaoHK"></i>
        <span>全球到香港</span>
      </div>
      <div class="item"
        @click="handlerRestrictions">
        <i class="iconfont icon-ico-jinyun"></i>
        <span>禁運品查詢</span>
      </div>
      <div class="item"
        @click="handlerPickup">
        <i class="iconfont icon-ico-zitidizhi"></i>
        <span>自提點查詢</span>
      </div>
      <div class="item"
        @click="handlerRebate">
        <i class="iconfont icon-ico-rebate"></i>
        <span>推薦有禮</span>
      </div>
      <div class="item"
        @click="handlerCoupon">
        <i class="iconfont icon-ico-card"></i>
        <span>我的優惠</span>
      </div>
    </div>
    <!-- 服務優勢 -->
    <h2 class="content-title">服務優勢</h2>
    <div class="services">
      <div class="service">
        <i class="iconfont icon-ico-x-jiage"></i>
        <h4>全港價超平</h4>
        <p>多種集運方式、<br>讓您節省金錢。</p>
      </div>
      <div class="service">
        <i class="iconfont icon-ico-x-pinlei"></i>
        <h4>品類全覆蓋</h4>
        <p>淘寶買的、你想寄的，我們都能運~(禁止出入境物品除外)</p>
      </div>
      <div class="service">
        <i class="iconfont icon-ico-x-sudu"></i>
        <h4>快至2日達</h4>
        <p>出庫後48小時極速送達~</p>
      </div>
      <div class="service">
        <i class="iconfont icon-ico-x-ziti"></i>
        <h4>自提觸達全港</h4>
        <p>提供200+自提點或智能櫃，<br>方便取件~</p>
      </div>
    </div>

    <!-- 商品推荐 -->
    <h2 class="content-title">推薦内容</h2>

    <div class="products">
      <div class="product"
        v-for="(item, index) of infoRecommend"
        :key="index">
        <a :href="item.link">
          <img :src="item.picUrl">
          <h6>{{item.promotionTitle}}</h6>
        </a>
      </div>
    </div>

    <!-- 文本介绍 -->
    <div class="links">
      <div class="link" @click="handlerContact"><span>聯系我們</span><i class="iconfont icon-right"></i></div>
      <div class="link" @click="handlerAbout"><span>關于我們</span><i class="iconfont icon-right"></i></div>
      <div class="link" @click="handleService"><span>在綫客服</span><i class="iconfont icon-right"></i></div>
      <div class="link" @click="handlerTerms"><span>用戶條款</span><i class="iconfont icon-right"></i></div>
      <div class="link" @click="handlerPrivacy"><span>隱私政策</span><i class="iconfont icon-right"></i></div>
      <div class="copyright">
        版權所有 ©2004-2021 深圳市遞四方速遞有限公司 粵ICP備 12019163號-7
      </div>
    </div>

    <!--頭部菜單-->
    <div v-transfer-dom>
      <popup v-model="menuShow"
        class="menuPopup"
        :height="(hasNotify && !hasScroll) ? 'calc(100% - 2rem)': 'calc(100% - 1.2rem)'">
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
          @click="handlerBlog"><span>折扣商品</span><i class="iconfont icon-right"></i></div>
        <div class="menu"
          @click="handlerIssue"><span>異常包裹</span><i class="iconfont icon-right"></i></div>
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

    <footer-tabbar></footer-tabbar>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { Swiper, Popup, Marquee, MarqueeItem, XDialog } from 'vux'
import footerTabbar from '@/components/layout/footer-tabbar'
import { newsInfos } from '@/api/personalInfo'
import { bannerInfo, bannerQuery } from '@/api/banners'
import { getLocalStorage } from '@/utils/config'
import Notify from '@/common/notify'

export default {
  name: 'home',
  data () {
    return {
      fpxOrderId: '',
      swiperList: [],
      menuShow: false,
      news: [],
      scrollTop: 0,
      serviceShow: false,
      hasNotify: false, // 头部菜单css固定
      hasScroll: false, // 是否滚动
      infoRecommend: [] // 商品推荐
    }
  },
  created () {
  },
  mounted () {
    this.getNewInfo() // 获取公告信息
    this.getBaners() // 获取轮播图片信息
    this.getInfos() // 获取首页通知栏，首页弹窗，商品推荐信息
    window.addEventListener('scroll', this.getScrollTop)
  },
  methods: {
    // 如果向下滚动40PX，则设置头部菜单固定
    getScrollTop () {
      this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (this.scrollTop >= 40) {
        this.hasScroll = true
      } else {
        this.hasScroll = false
      }
    },
    // 获取首页通知栏，商品推荐信息
    getInfos () {
      bannerQuery({ category: 'SHOU' }).then(res => {
        if (res.code === this.GLOBAL.code && res.data) {
          for (let v of res.data) {
            if (v.type === 'notificationbar') { // 首页通知栏
              this.infoBar = v
            }
            if (v.type === 'wheelplanting') { // 商品推荐轮播
              this.infoRecommend.push(v)
            }
          }
          // 如果缓存中没有，则设置通知栏，弹窗
          if (getLocalStorage(this.$route.name) && this.infoBar) {
            this.hasNotify = true
          } else {
            this.hasNotify = false
          }
        }
      })
    },
    // 获取首页头部banner图片
    getBaners () {
      bannerInfo({ category: 'MAIN_PAGE', device: 2 }).then(res => {
        if (res.code === this.GLOBAL.code) {
          res.data.result.forEach(val => {
            let obj = {
              url: val.link,
              img: val.picUrl
            }
            this.swiperList.push(obj)
          })
        }
      })
    },
    // 获取公告信息
    getNewInfo () {
      newsInfos({ pageNum: 1, pageSize: 5, clientType: 1 }).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.news = res.data.result
        }
      })
    },
    // 海外仓地址
    handlerWarehouse () {
      this.$router.push({ name: 'warehouse' })
    },
    // 内地到香港
    handlerMainland () {
      // let id = ''
      // if (location.href.indexOf('m-hk') > 0) { // 线上
      //   id = 100
      // } else { // 线上id
      //   id = 87
      // }
      // this.$router.push({ name: 'page/singlePage', query: { id: id } })
      this.$router.push({ path: '/pricing/mainland' })
    },
    // 全球到香港，跳转到服务与价格页面， 删除内地到香港的部分内容
    handlerCampaignGlobal () {
      this.$router.push({ name: 'pricing' })
    },
    // 新增包裹
    handlerOrder () {
      this.DELETE_ORDER_DATA()
      this.$router.push({ name: 'shipments' })
    },
    // 违禁品查询
    handlerRestrictions () {
      this.$router.push({ name: 'restrictions' })
      // this.$router.push({ name: 'contrabandCategory' })
    },
    // 自提点查询
    handlerPickup () {
      this.$router.push({ name: 'pickup-centers' })
    },
    // 推荐有礼
    handlerRebate () {
      this.$router.push({ name: 'myrebate' })
    },
    // 我的优惠
    handlerCoupon () {
      this.$router.push({ name: 'coupon' })
    },
    // 我的包裹链接
    handlerPackage () {
      this.$router.push({ name: 'orders', params: { type: 'package' } })
    },
    handlerTrial () {
      this.$router.push({ name: 'trial' })
    },
    // 自提预约链接
    handlerAppoint () {
      this.$router.push({ name: 'orders', params: { type: 'appointment' } })
    },
    // 个人中心
    handlerCenter () {
      this.$router.push({ name: 'account' })
    },
    // 折扣信息
    handlerBlog () {
      window.location = 'https://hk.4px.com/blog/'
    },
    // 新手指引
    handlerGuide () {
      this.$router.push({ name: 'tutorial' })
    },
    // 在綫客服
    handleService () {
      window.location.href = 'https://4px.s2.udesk.cn/im_client/?web_plugin_id=8071&group_id=10387&language=zh-HK&channel=%E5%AE%98%E7%B6%B2'
    },
    // 常見問題
    handlerFaq () {
      this.$router.push({ name: 'faq' })
    },
    // 保險與理賠
    handlerInsurance () {
      this.$router.push({ name: 'insurance' })
    },
    // 會員特權
    handlerVip () {
      this.$router.push({ name: 'vip' })
    },
    viewNewDetail (val) {
      // 新闻详情
      if (!val.id) return
      // this.$router.push({ name: 'newsDetail', query: { id: val.id } })
      this.$router.push({ path: `/news/${val.secondDirectory}` })
      localStorage.setItem('newsId', val.id)
    },
    // 異常包裹
    handlerIssue () {
      this.$router.push({ name: 'issue' })
    },
    // 自提倉庫
    hanlderPickupAddress () {
      this.$router.push({ name: 'pickup-centers' })
    },
    // 联系我们
    handlerContact () {
      this.$router.push({ name: 'contact' })
    },
    // 关于我们
    handlerAbout () {
      this.$router.push({ name: 'about' })
    },
    // 用户条款
    handlerTerms () {
      this.$router.push({ name: 'terms' })
    },
    // 隐私政策
    handlerPrivacy () {
      this.$router.push({ name: 'privacy' })
    },
    ...mapMutations([
      'DELETE_ORDER_DATA'
    ])
  },
  components: {
    Swiper,
    Popup,
    footerTabbar,
    Marquee,
    MarqueeItem,
    XDialog,
    Notify
  }
}
</script>
<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  @import "./home.less";
</style>
<style lang="less">
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
  .mainland {
    .vux-slider {
      min-height: 3rem;
      margin-top: -0.8rem;
      .vux-swiper {
        height: 6rem !important;
      }
    }
  }
  .vux-slider > .vux-indicator,
  .vux-slider .vux-indicator-right {
    bottom: 0.6rem !important;
  }
  .content-popup {
    height: 100% !important;
    // overflow-y: hidden !important;
    overflow-y: auto;
  }
  .vux-marquee-box li {
    max-width: 5.6rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 0.02rem 0;
  }
  .vux-slider > .vux-indicator > a > .vux-icon-dot,
  .vux-slider .vux-indicator-right > a > .vux-icon-dot {
    width: 8px !important;
    height: 8px !important;
    border-radius: 100% !important;
    background-color: #e8eced !important;
  }
  .vux-slider > .vux-indicator > a > .vux-icon-dot.active,
  .vux-slider .vux-indicator-right > a > .vux-icon-dot.active {
    background-color: @primary!important;
  }
</style>
