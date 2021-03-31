import http from '@/utils/http'

// 获取用户信息
export const getUserInfo = (params) => {
  return http.get('/userInfo/getUserInfo').then(res => res.data)
}

// 获取用户基础信息
export const getUserBasicInfo = (params) => {
  return http.get('/userInfo/getUserBasicInfo').then(res => res.data)
}

// 上传身份证正反面图
export const addIdCardInfo = (params) => {
  return http.post('/IdCardInfo/addIdCardInfo', params).then(res => res.data)
}

// 新增实名认证key
export const addCertificateKey = (certificateKey) => {
  return http.post(`/userInfo/addCertificateKey?certificateKey=${certificateKey}`).then(res => res.data)
}

// 更新实名认证key
export const updateCertificateKey = (certificateKey) => {
  return http.post(`/userInfo/updateCertificateKey?certificateKey=${certificateKey}`).then(res => res.data)
}

// 根据code获取身份证信息（正反面图片）
export const getIdCardInfo = (certificateCode) => {
  return http.get(`/IdCardInfo/getIdCardInfo?certificateCode=${certificateCode}`).then(res => res.data)
}

// 獲取公告信息
export const newsInfos = (data) => {
  return http.post('/newsWebsite/newsInfos', {clientType: 1, ...data}).then(res => res.data)
}

// 获取是否开通余额支付信息
export const getOpenBalancePayInfo = () => {
  return http.get('/userInfo/getOpenBalancePayInfo').then(res => res.data)
}

// 修改支付密码
export const updatePayPassword = (data) => {
  return http.post('/payPassword/updatePayPassword', data).then(res => res.data)
}

// 创建支付密码
export const createPayPassword = (data) => {
  return http.post('/payPassword/createPayPassword', data).then(res => res.data)
}

// 发送修改密码验证码邮件
export const sendEditPayPasswordVerifyMessage = (data) => {
  return http.post('/payPassword/sendEditPayPasswordVerifyMessage', data).then(res => res.data)
}

// 发送创建密码验证码邮件
export const sendCreatePayPasswordVerifyMessage = (data) => {
  return http.post(`/payPassword/sendCreatePayPasswordVerifyMessage`, data).then(res => res.data)
}

// 修改会员信息
export const editUserInfo = (data) => {
  return http.post('/userInfo/editUserInfo', data).then(res => res.data)
}

// 设置邮箱 - 获取邮箱验证码
export const insertEmailCode = (data) => {
  return http.post('/emailSenderUsedCode/insertEmailCode', data).then(res => res.data)
}

// 设置邮箱 - 提交; 修改邮箱 - 修改邮箱 - 验证新邮箱
export const emailNewVerification = (data) => {
  return http.get(`/EmailUpdate/emailNewVerification?key=${data}`).then(res => res.data)
}

// 修改邮箱 - 验证身份 - 获取邮箱验证码
export const emailSenderUsedCode = (data) => {
  return http.post('/emailSenderUsedCode', data).then(res => res.data)
}

// 修改邮箱 - 验证身份 - 验证旧邮箱
export const emailUsedVerification = (data) => {
  return http.get(`/EmailUpdate/emailUsedVerification?key=${data}`).then(res => res.data)
}

// 修改邮箱 - 修改邮箱 - 获取新邮箱验证码
export const senderNewEmailCode = (data) => {
  return http.post(`/EmailUpdate/senderNewEmailCode`, data).then(res => res.data)
}

// 修改手机 - 验证身份 - 获取验证码
export const senderMobileCode = (data) => {
  return http.post(`/MobileUpdate/senderMobileCode`, data).then(res => res.data)
}

// 旧手机验证码验证
export const mobileUsedVerification = (data) => {
  return http.post('/MobileUpdate/mobileUsedVerification', data).then(res => res.data)
}

// 新手机验证码验证
export const mobileNewVerification = (data) => {
  return http.post('/MobileUpdate/mobileNewVerification', data).then(res => res.data)
}

// 获取SEO三要素
export const getSeo = (data) => {
  return http.post('/set/getSeo', data).then(res => res.data)
}
