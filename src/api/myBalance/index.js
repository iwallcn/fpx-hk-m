import http from '@/utils/http'

// 查询账户总余额
export const queryTotal = () => {
  return http.get('/accountBalance/queryTotal').then(res => res.data)
}

// 查询账户流水
export const queryAccountFlow = (page) => {
  return http.post('/accountBalance/queryAccountFlow', page).then(res => res.data)
}

// 查询單條账户流水
export const queryOneAccountFlow = (data) => {
  return http.post('/accountBalance/queryOneAccountFlow', data).then(res => res.data)
}

// 查询是否开通支付
export const queryOpenBalancePayInfo = () => {
  return http.get('/userInfo/getOpenBalancePayInfo').then(res => res.data)
}

// 获取支付渠道
export const getPayChannels = () => {
  return http.get('/payChanel/getPayChannels').then(res => res.data)
}

// 会员可选充值活动
export const memberChargeList = () => {
  return http.get('/coupon/memberChargeList').then(res => res.data)
}

// 获取返利收益
export const getRebateAmount = () => {
  return http.get('promotionRebate/getRebateAmount').then(res => res.data)
}
