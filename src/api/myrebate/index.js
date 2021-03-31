import http from '@/utils/http'

// 好友明细-推荐好友列表
export const getMemberRebateFriend = (params) => {
  return http.post('/promotionRebate/getMemberRebateFriend', params).then(res => res.data)
}

// 返利明细-返利账单明细
export const getRebateFlow = (params) => {
  return http.post('/promotionRebate/getRebateFlow', params).then(res => res.data)
}

// 返券明细-返利订单列表
export const memberRebateOrderList = (params) => {
  return http.post('/promotionRebate/memberRebateOrderList', params).then(res => res.data)
}

// 获取返利收益
export const getRebateAmount = () => {
  return http.get('promotionRebate/getRebateAmount').then(res => res.data)
}

// 推广注册url链接
export const getPromotionUrl = () => {
  return http.get('/promotionRebate/getPromotionUrl').then(res => res.data)
}

// 获取海报
export const getPosterQRCode = (data) => {
  return http.get(`/poster/getPosterQRCode?url=${data}`).then(res => res.data)
}

// CMS 配置 获取分享页面背景
export const getPageConfigInfoList = (params) => {
  return http.post('/pageConfigInfo/getPageConfigInfoList', params).then(res => res.data)
}

// 邀请码分享内容查询接口
export const getInvitationInformation = () => {
  return http.get('/invitation/getInvitationInformation').then(res => res.data)
}
