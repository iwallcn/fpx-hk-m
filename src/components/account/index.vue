<template>
  <div class="personal-center">
    <router-view />
    <group class="first-cell bg">
      <cell-box is-link
        @click.native="handlerCenter">
        <img src="@/assets/image/avatar.png"> <span>{{firstName}}</span><span class="gradeName"
          @click.stop="handlerVip">{{gradeName}}</span>
      </cell-box>
    </group>
    <group class="new-list">
      <cell-box is-link
        @click.native="$router.push({name:'newsList'})">
        <i class="iconfont icon-news"></i> 最新消息
      </cell-box>
    </group>
    <group class="other">
      <cell-box is-link
        @click.native="handlerOrder">
        <i class="iconfont icon-add"></i> 新增包裹
      </cell-box>
      <cell-box is-link
        @click.native="handlerPackage">
        <i class="iconfont icon-baoguo"></i> 我的包裹
      </cell-box>
      <cell-box is-link
        @click.native="handlerTrial">
        <i class="iconfont icon-returnadd"></i> 運費試算
      </cell-box>
      <!-- <cell-box is-link
        @click.native="handlerReturns">
        <i class="iconfont icon-returnlist"></i> 我的退件
      </cell-box> -->
      <cell-box is-link
        @click.native="handlerIssue">
        <i class="iconfont icon-gaojingxinxi"></i> 異常包裹 &nbsp;<badge :text="exceptionPkgCount"
          v-if="exceptionPkgCount"></badge>
      </cell-box>
      <cell-box is-link
        @click.native="handlerAddress">
        <i class="iconfont icon-dizhi"></i> 地址管理
      </cell-box>
    </group>
    <group class="other">
      <cell-box is-link
        @click.native="handlerBalance">
        <i class="iconfont icon-zhanghuyue"></i>我的余額
      </cell-box>
      <cell-box is-link
        @click.native="handlerCard">
        <i class="iconfont icon-pag"></i> 我的卡包
      </cell-box>
      <cell-box is-link
        @click.native="handlerCoupon">
        <i class="iconfont icon-youhuiquan"></i> 我的優惠券
      </cell-box>
      <cell-box is-link
        @click.native="handlerRebate">
        <i class="iconfont icon-fanli"></i> 推廣返利
      </cell-box>
    </group>
    <group class="other">
      <cell-box is-link
        @click.native="handlerContraband">
        <i class="iconfont icon-contraband"></i> 禁運品查詢
      </cell-box>
      <cell-box is-link
        @click.native="handlerTrack">
        <i class="iconfont icon-track"></i> 包裹軌跡查詢
      </cell-box>
      <cell-box is-link
        @click.native="handleService">
        <i class="iconfont icon-info"></i> 在綫客服
      </cell-box>
    </group>
    <group class="other">
      <cell-box is-link
        @click.native="handlerExit">
        <i class="iconfont icon-exit"></i> 退出登錄
      </cell-box>
    </group>

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

    <!-- 未绑定邮箱的用户，强制提醒 -->
    <div v-transfer-dom>
      <confirm v-model="tipDialog"
        title=""
        cancel-text="不再提醒"
        confirm-text="立即驗證"
        @on-cancel="handlerNeverTip"
        @on-confirm="handlerCheckEmail">
        <i class="iconfont icon-close email-close"
          @click="handlerCloseEmailTip"></i>
        請進行郵箱驗證<br>設置后可接收物流提醒郵件。
      </confirm>
    </div>
  </div>
</template>

<script>
import { Group, Cell, CellBox, Swiper, Confirm, Badge } from 'vux'
import { getUserInfo } from '@/api/personalInfo'
import { logout, setLocalStorage, getLocalStorage, getNeverStorage } from '@/utils/config'
import { bannerQuery } from '@/api/banners'
import { mapMutations } from 'vuex'
import Notify from '@/common/notify'
import { getPackageCount } from '@/api/order'

export default {
  name: 'account',
  data () {
    return {
      firstName: '',
      gradeName: '',
      infoRecommend: [],
      email: '',
      tipDialog: false,
      exceptionPkgCount: 0 // 異常包裹
    }
  },
  created () {
    this.getPersonInfo()
    this.fixLink()
    this.getWheelBanner() // 获取个人中心通知栏，商品推荐
    this.getCount() // 获取异常包裹数量
  },
  mounted () {
    setTimeout(() => {
      let info = this.$store.state.userBaseInfo
      if (!info) {
        return
      }
      if (typeof (info) === 'object') {
        this.gradeName = info.gradeName || 'V1'
        this.firstName = info.firstName
      } else {
        this.gradeName = JSON.parse(info).gradeName || 'V1'
        this.firstName = JSON.parse(info).firstName
      }
    }, 200)
  },
  methods: {
    // 在綫客服
    handleService () {
      window.location.href = 'https://4px.s2.udesk.cn/im_client/?web_plugin_id=8071&group_id=10387&language=zh-HK&channel=%E5%AE%98%E7%B6%B2'
    },
    getCount () {
      getPackageCount().then(res => {
        if (res.code === this.GLOBAL.code) {
          this.exceptionPkgCount = res.data
        }
      })
    },
    // 商品推荐点击
    handlerProduct (link) {
      window.location.href = link
    },
    // 购物情报
    getWheelBanner () {
      bannerQuery({ category: 'PERSON', type: 'wheelplanting' }).then(res => {
        if (res.code === this.GLOBAL.code) {
          if (res.data && res.data.length) {
            this.infoRecommend = res.data
          }
        }
      })
    },
    // 根据用户信息，查看是否已绑定邮箱，如果未绑定邮箱，则强制提醒
    getPersonInfo () {
      // 不再提醒，則一直不提醒；如果立即验证，但实际上没验证，则设置一天弹一次
      if (!getNeverStorage('neverTip')) {
        return
      }
      if (!getLocalStorage('noSetMail')) {
        return
      }
      getUserInfo().then(res => {
        if (res.code === this.GLOBAL.code) {
          this.email = res.data.email
          // this.email === '' ? this.tipDialog = true : this.tipDialog = false
          if (this.email) {
            this.tipDialog = false
          } else {
            this.tipDialog = true
          }
        }
      })
    },
    // 不再提醒
    handlerNeverTip () {
      this.tipDialog = false
      setLocalStorage('neverTip')
    },
    // 立即验证
    handlerCheckEmail () {
      this.tipDialog = false
      this.$router.push({ name: 'setemail' })
    },
    // 关闭弹窗
    handlerCloseEmailTip () {
      this.tipDialog = false
      setLocalStorage('noSetMail')
    },
    // 会员特权
    handlerVip () {
      this.$router.push({ name: 'vip' })
    },
    fixLink () {
      if ((/JSESSIONID/).test(window.location.href)) {
        window.history.pushState({}, 0, window.location.href.split(';')[0])
      }
    },
    // 我的资料
    handlerCenter () {
      this.$router.push({ name: 'profile' })
    },
    // 我的余额
    handlerBalance () {
      this.$router.push({ name: 'balance' })
    },
    // 新增包裹
    handlerOrder () {
      this.DELETE_ORDER_DATA()
      this.$router.push({ name: 'shipments' })
    },
    // 我的包裹
    handlerPackage () {
      this.$router.push({ name: 'orders' })
    },
    handlerTrial () {
      this.$router.push({ name: 'trial' })
    },
    // 異常訂單
    handlerIssue () {
      this.$router.push({ name: 'issue' })
    },
    // 新增退件
    handlerReturnAdd () {
      this.$router.push({ name: 'returnAdd' })
    },
    // 退件列表
    handlerReturns () {
      this.$router.push({ name: 'returns' })
    },
    // 我的卡包
    handlerCard () {
      this.$router.push({ name: 'card' })
    },
    // 我的优惠券
    handlerCoupon () {
      this.$router.push({ name: 'coupon' })
    },
    // 推廣返利
    handlerRebate () {
      this.$router.push({ name: 'myrebate' })
    },
    // 国内收货地址
    handlerAddress () {
      this.$router.push({ name: 'addresses' })
    },
    // 禁运品查询
    handlerContraband () {
      this.$router.push({ name: 'restrictions' })
    },
    // 包裹軌跡查詢
    handlerTrack () {
      this.$router.push({ name: 'tracking' })
    },
    // 自提预约
    handlerAppointment () {
      this.$router.push({ name: 'appointment' })
    },
    // 退出登录
    handlerExit () {
      logout()
    },
    ...mapMutations([
      'DELETE_ORDER_DATA'
    ])
  },
  components: {
    Group,
    Cell,
    CellBox,
    Swiper,
    Notify,
    Confirm,
    Badge
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .email-close {
    position: absolute;
    top: 0;
    right: 0;
    color: #999;
    padding: 0.12rem;
    font-size: 0.34rem;
  }
  .personal-center {
    .first-cell {
      .weui-cells {
        .weui-cell_access.vux-cell-box:after {
          border-color: #fff;
        }
        img {
          width: 1.2rem;
          height: auto;
          padding: 0 0.2rem;
        }
        span {
          font-size: 0.32rem;
          color: #fff;
          &.gradeName {
            font-size: 0.24rem;
            background: #ff8200;
            display: inline-block;
            padding: 0.02rem 0.16rem;
            margin-left: 0.1rem;
            border-radius: 10px;
          }
        }
        .vux-tap-active:active {
          background-color: @primary;
        }
      }
    }
    /deep/.new-list .weui-cells {
      margin-top: 0;
    }
    .new-list .weui-cells .weui-cell,
    .other .weui-cells .weui-cell {
      font-size: 0.28rem;
      i {
        color: @primary;
        font-size: 0.36rem;
        padding-right: 0.16rem;
      }
    }
    .content-title {
      font-size: 0.42rem;
      color: #333;
      margin: 0.5rem auto 0.3rem auto;
      text-align: center;
    }
    .products {
      width: 94%;
      display: flex;
      margin: 0 auto 0.4rem auto;
      flex-wrap: wrap;
      justify-content: space-between;

      .product {
        width: 49%;
        text-align: center;
        background: #fff;
        border-radius: 6px;
        margin-top: 0.2rem;
        box-sizing: border-box;
        position: relative;
        img {
          width: 100%;
          max-width: 100%;
          height: auto;
          text-align: center;
          border-radius: 6px 6px 0 0;
        }

        h6 {
          color: #4c4c4c;
          font-size: 0.26rem;
          line-height: 0.34rem;
          margin: 0.2rem;
          text-align: left;
          word-wrap: break-word;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-height: 0.34rem;
        }
      }
    }
  }
</style>
<style lang="less">
  @import "../../assets/less/variable.less";
  .personal-center {
    .first-cell.bg {
      .weui-cells {
        padding: 0.2rem 0;
        background-color: @primary;
        margin-top: 0 !important;
      }
    }
    .vux-slider {
      margin-top: 0.4rem;
      .vux-indicator {
        bottom: 0.16rem !important;
      }
    }
    .vux-indicator-right {
      bottom: 6px !important;
    }
  }
</style>
