<template>
  <div v-if="hasNotify || hasPopup"
    class="wrapper">
    <!-- 如果该页面有通知栏，则显示通知栏 -->
    <Notify :info="info"
      v-if="info && hasNotify"
      @closeNotify="closeNotify"></Notify>

    <!-- 如果该页面有弹窗，则显示弹窗 -->
    <div v-transfer-dom
      v-if="infoPopup">
      <x-dialog v-model="hasPopup"
        class="xdialog"
        @on-hide="handlerClosePopup"
        hide-on-blur>
        <p>
          <a :href="infoPopup.link">
            <img :src="infoPopup.picUrl || ''"
              :alt="infoPopup.promotionTitle">
          </a>
          <x-icon type="ios-close-outline"
            @click.native="handlerClosePopup"></x-icon>
        </p>
      </x-dialog>
    </div>
    <router-view />
  </div>
  <router-view v-else />
</template>

<script>
import { XDialog } from 'vux'
import { dictionary } from '@/api/dictionary'
import { setToken, setLocalStorage, getLocalStorage } from '@/utils/config'
import { bannerQuery } from '@/api/banners'
import { mapMutations } from 'vuex'
import Notify from '@/common/notify'
export default {
  name: 'App',
  mounted () {
    // this.getDictData()
    this.setAdQuery()
  },
  data () {
    return {
      info: '', // 通知栏
      infoPopup: '', // 弹窗
      hasNotify: false, // 是否有通知栏
      hasPopup: false, // 是否有弹出框
      obj: {
        category: ''
      },
      popups: [] // 全局弹窗
    }
  },
  created () {
  },
  methods: {
    // 获取首页弹窗，通知栏相关信息
    getData () {
      this.info = ''
      this.infoPopup = ''
      bannerQuery({ category: this.obj.category }).then(res => {
        if (res.code === this.GLOBAL.code) {
          if (!res.data) {
            return
          }
          for (let v of res.data) {
            if (v.type === 'notificationbar') { // 通知栏
              this.info = v
            }
            if (v.type === 'popup') { // 弹窗
              this.infoPopup = v
            }
          }
        }
      })
    },
    // 关闭通知栏
    closeNotify () {
      this.hasNotify = false
      // 关闭通知栏时，并记录下该通知栏关闭时间，保存在缓存中
      setLocalStorage(this.$route.name)
    },
    // 关闭弹窗
    handlerClosePopup () {
      this.hasPopup = false
      setLocalStorage('globalPopup')
    },
    // 字典数据
    getDictData () {
      if (sessionStorage.getItem('dictData')) {
        return
      }
      dictionary().then(res => {
        if (res.code === this.GLOBAL.code) {
          this.SET_DICTDATA(res.data.zh_tw)
        } else {
        }
      })
    },
    setAdQuery () {
      /*
      全局广告参数存储，时效为30天
      utm_source：标识为您的媒体资源带来流量的广告客户、网站、出版物等，例如：google、newsletter4、billboard。
      utm_medium：广告媒介或营销媒介，例如：每次点击费用、横幅广告和电子邮件简报。
      utm_campaign：产品的具体广告系列名称、标语、促销代码等。
      utm_term：标识付费搜索关键字。如果您采用人工方式标记付费关键字广告系列，那么您还应使用 utm_term 来指定相应关键字。
      utm_content：用于区分相似内容或同一广告内的链接。例如，如果您在同一封电子邮件中使用了两个号召性用语链接，就可以使用 utm_content 并为每个链接设置不同的值，以便判断哪个版本的效果更好。
      */
      let adQueryList = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content'
      ]
      for (let v of adQueryList) {
        if (this.getQueryVariable(v)) {
          setToken(v, this.getQueryVariable(v), 30)
        }
      }
    },
    getQueryVariable (variable) {
      let query = window.location.search.substring(1)
      let vars = query.split('&')
      for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=')
        if (pair[0] === variable) { return pair[1] }
      }
      return ''
    },
    ...mapMutations(['SET_DICTDATA'])
  },
  watch: {
    '$route.name': {
      handler () {
        /**
         * 需要配置的页面有：
         * 首页（单独配置），个人中心，活动中心（M端暂无），服务与价格，自提点页面，活动列表（M端暂无），确认支付页面
         */
        let obj = {
          'account': 'PERSON', // 个人中心
          'event': 'EVENT', // 活动中心
          'pricing': 'PRODUCT', // 产品与服务
          'pickup-centers': 'ZITI', // 自提点页面
          'home': 'SHOU' // 首页
        }
        let name = this.$route.name
        if (!obj.hasOwnProperty(name)) { // 不需要通知的页面
          this.hasNotify = false
          return
        }
        this.obj.category = obj[name]
        // 查看是否过期，如果有返回，则表示需要重新显示
        this.hasNotify = getLocalStorage(name) // 通知栏
        this.hasPopup = getLocalStorage('globalPopup')
        // 如果当前路由是首页，则不需要请求，会在首页中请求这个数据
        if (name === 'home') {
          return
        }
        setTimeout(() => {
          this.getData()
        })
      },
      immediate: true
    }
  },
  components: {
    Notify,
    XDialog
  }
}
</script>
<style lang="less" scoped>
  .wrapper {
    width: 100%;
    height: 100vh;
  }
</style>
<style lang="less">
  .xdialog {
    .weui-dialog {
      max-width: 100%;
      width: 100%;
      height: 50%;
      background-color: transparent;
    }
    p {
      color: #fff;
      text-align: center;
      img {
        max-width: 90%;
      }
      svg {
        fill: #fff;
        width: 36px;
        height: 36px;
      }
    }
  }
</style>
