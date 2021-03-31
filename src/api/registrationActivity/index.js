import http from '@/utils/http'

// 判断手机号码是否存在
export const checkCExist = (data) => {
  return http.post(`/userInfo/checkCExist`, data).then(res => res.data)
}

// 获取图片验证码
export const sendRegisterSms = (data) => {
  return http.post(`/userInfo/sendRegisterSms`, data).then(res => res.data)
}

// 获取短信验证码
export const senderMobileCode = (data) => {
  return http.post(`/MobileUpdate/senderMobileCode`, data).then(res => res.data)
}

// 注册接口
export const userRegistrationActivity = (data) => {
  return http.post('/userInfo/userRegistrationActivity', data).then(res => res.data)
}

// 推广单页配置查询
export const backgroundImgQuery = (data) => {
  return http.post('/managerPopularize/query', data).then(res => res.data)
}
