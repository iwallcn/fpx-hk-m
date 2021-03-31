import http from '@/utils/http'

// 获取返利收益
export const getRebateAmount = () => {
  return http.get(`/promotionRebate/getRebateAmount`).then(res => res.data)
}

// 推广注册url链接
export const getPromotionUrl = () => {
  return http.get(`/promotionRebate/getPromotionUrl`).then(res => res.data)
}

// 返利账单明细
export const getRebateFlow = () => {
  return http.post(`/promotionRebate/getRebateFlow`).then(res => res.data)
}

// 已推荐返利订单列表
export const memberRebateOrderList = () => {
  return http.post(`/promotionRebate/memberRebateOrderList`).then(res => res.data)
}

// 获取已推荐好友列表
export const getMemberRebateFriend = () => {
  return http.post(`/promotionRebate/getMemberRebateFriend`).then(res => res.data)
}
