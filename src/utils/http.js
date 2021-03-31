/**
 * 配置一个实例axios
 * 配置包含内容（超时时间，baseURL，拦截请求和响应，状态码的错误范围）
 */
import axios from 'axios'
import {
  getSystemUrl
} from '@/utils/config'
import router from '../router'
// import Vue from 'vue'
const Vue = require('vue')

let service = getSystemUrl()
let baseURL = '/'
if (process.env.NODE_ENV === 'development') {
  // 开发环境
  baseURL = '/api'
}
const http = axios.create({
  baseURL: baseURL,
  timeout: 60000, // 1分钟
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// 添加拦截请求
http.interceptors.request.use(config => {
  // 在发送请求之前做些什么, 之前token
  if (sessionStorage.getItem('token')) {
    config.headers['token'] = sessionStorage.getItem('token')
  }
  Vue.$vux.loading.show({
    text: 'Loading'
  })
  return config
}, err => {
  // 对请求错误做些什么
  Vue.$vux.loading.hide()
  return Promise.reject(err)
})

// 添加拦截响应
http.interceptors.response.use(res => {
  Vue.$vux.loading.hide()
  if (res.data.code !== '0') {
    if (res.data && res.data.message && res.data.message !== '没有满足条件的地址信息' && res.data.code !== '302') {
      if (res.data.message !== '系統會話超時！') {
        Vue.$vux.toast.text(res.data.message)
      }
    }
    // 未登录或登录失效
    if (res.data && res.data.code === '302') {
      // location.href = `${global.envUrl.login}/clogin?service=${global.envUrl.cas}&fservice=${global.envUrl.current}&countryId=383`
      // window.location.href = `${login}?service=${service}&countryId=460`
      router.replace({
        name: 'login',
        query: {
          service: service,
          countryId: 460
        }
      })
    }
  }
  return res
}, err => {
  // 对响应错误做点什么
  Vue.$vux.loading.hide()
  if (err && err.response) {
    switch (err.response.code) {
      case 400:
        err.message = '错误请求'
        break
      case 401:
        err.message = '未授权，请重新登录'
        break
      case 403:
        err.message = '拒绝访问'
        break
      case 404:
        err.message = '请求错误，未找到该资源'
        break
      case 405:
        err.message = '请求方法未允许'
        break
      case 408:
        err.message = '请求超时'
        break
      case 500:
        err.message = '服务器端出错'
        break
      case 501:
        err.message = '网络未实现'
        break
      case 502:
        err.message = '网络错误'
        break
      case 503:
        err.message = '服务不可用'
        break
      case 504:
        err.message = '网络超时'
        break
      case 505:
        err.message = 'http版本不支持该请求'
        break
      default:
        err.message = `连接错误`
    }
  } else {
    err.message = '连接到服务器失败'
  }
  Vue.$vux.toast.text(err.message)
  return Promise.reject(err)
})

// 状态码的错误范围

export default http
