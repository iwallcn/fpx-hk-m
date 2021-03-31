import http from '@/utils/http'
import axios from 'axios'

// 获取登录状态
export const isLogin = () => {
  return http.get('/login/isLogin').then(res => res.data)
}

// 退出登陆
export const loginOut = () => {
  return http.get('/logout').then(res => res)
}

// 获取用户中心地址信息
export const getCountryList = (data) => {
  return axios.post('http://components.i4px.com/component/getCountryList', data).then(res => res.data)
}

// 判断手机号码是否存在
export const checkCExist = (data) => {
  return http.post(`/userInfo/checkCExist`, data).then(res => res.data)
}

// 注册
export const userRegistration = (data) => {
  return http.post('/userInfo/userRegistration', data).then(res => res.data)
}

// 获取短信验证码
export const sendRegisterSms = (data) => {
  return http.post(`/userInfo/sendRegisterSms`, data).then(res => res.data)
}

// 对接第三方登录Facebook
export const getFaceBookLoginUrl = () => {
  return http.get('/facebook/getFaceBookLoginUrl?type=6').then(res => res.data)
}

// 对接第三方登录Google
export const getGoogleLoginUrl = () => {
  return http.get('/google/getGoogleLoginUrl?type=7').then(res => res.data)
}

// 获取facebook getOpenId
export const getFacebookOpenId = (openId) => {
  return http.get(`facebook/getOpenId?openId=${openId}`).then(res => res.data)
}

// 获取google getOpenId
export const getGoogleOpenId = (openId) => {
  return http.get(`google/getOpenId?openId=${openId}`).then(res => res.data)
}

// 綁定facebook账号
export const bindFacebookAccount = (data) => {
  return http.post(`facebook/bindAccount`, data).then(res => res.data)
}

// 绑定谷歌账号
export const bindGoogleAccount = (data) => {
  return http.post(`google/bindAccount`, data).then(res => res.data)
}

// cas接口
export const getCas = (ticket) => {
  return http.get(`cas?ticket=${ticket}`).then(res => res.data)
}
