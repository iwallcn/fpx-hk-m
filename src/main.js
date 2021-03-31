import 'babel-polyfill'
// import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import '@/utils/rem' // rem
import {
  global
} from '@/utils/global' // 全局变量
import '@/assets/less/index.less' // 合并less
import {
  setToken,
  getToken,
  getSystemUrl
} from '@/utils/config'
import http from '@/utils/http'
import FastClick from 'fastclick'
import VueLazyload from 'vue-lazyload'
// 注册全局指令
import {
  TransferDom,
  ToastPlugin,
  LoadingPlugin,
  ConfirmPlugin
} from 'vux'
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// const Vue = require('vue')
const Vue = require('vue')
// require('./utils/vconsole.js')
Vue.config.devtools = true
Vue.directive('transfer-dom', TransferDom)
Vue.use(ToastPlugin, {
  position: 'default',
  time: '2000'
})
Vue.use(ConfirmPlugin, {
  position: 'default',
  time: '2000'
})
Vue.use(LoadingPlugin)
Vue.config.productionTip = false
Vue.prototype.GLOBAL = global
FastClick.attach(document.body)
// 设置图片懒加载
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '../static/error.png',
  loading: '../static/loading.gif',
  attempt: 1
})

// 登录状态判断
let loginFlag = true
let loginList = [
  '/account/shipments',
  '/account/orders',
  '/account',
  '/account/warehouses',
  '/warhouseList',
  '/warehouseAddress',
  '/card-payment'
]

// 绑定登录拦截
if (loginFlag) {
  router.beforeEach((to, from, next) => {
    // 处理JSESSIONID问题
    if (to.path.indexOf('JSESSIONID') !== -1) next('/')
    let LoginState = getToken('LoginState')
    if (LoginState === 'success') {
      next()
      return
    }
    if (!loginList.includes(to.path)) {
      next()
      return
    }
    http.get('login/isLogin').then((res) => {
      if (res.data.code === global.code && res.data.data === 1) {
        setToken('LoginState', 'success', 2)
        next()
      } else {
        let service = getSystemUrl()
        next({
          name: 'login',
          query: {
            service: service,
            countryId: 460,
            serviceUrl: to.fullPath
          }
        })
      }
    })
  })
}

// window.setTitle = setTitle

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: {
    App
  },
  template: '<App/>'
})
