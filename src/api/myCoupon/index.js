import http from '@/utils/http'

// 优惠券列表
export const fetchList = () => {
  return http.get('/coupon/list').then(res => res.data)
}

// 优惠券列表
export const fetchTypesList = (type, pageNum, pageSize) => {
  return http.get(`/coupon/list?type=${type}&pageNum=${pageNum}&pageSize=${pageSize}`).then(res => res.data)
}

// 优惠券规则
export const couponRules = (couponCode) => {
  return http.get('/coupon/getCouponRule?couponCode=' + couponCode).then(res => res.data)
}

// 获取优惠券（单个）
export const getCouponeByCouponNo = (couponCode) => {
  return http.get(`/coupon/getCouponeByCouponNo?couponNo=${couponCode}`).then(res => res.data)
}

// 根据活动id获取活动名称
export const getEventById = (eventPlanningId) => {
  return http.get(`/coupon/getEventByIds?${eventPlanningId}`).then(res => res.data)
}

// 获取当前订单所有可用优惠券和活动
export const validCouponAndEvent = (fpxOrderId, payCode, destinationCountry) => {
  return http.get(`/coupon/validCouponAndEvent`, {
    params: {
      fpxOrderId,
      payCode,
      destinationCountry
    }
  }).then(res => res.data)
}

// 激活优惠券
export const activeCoupon = (couponCode) => {
  return http.get('/coupon/active?couponCode=' + couponCode).then(res => res.data)
}

// 通过卡券code获取卡券详情
export const cardInfo = (couponCode) => {
  return http.get(`/card/detail?couponCode=${couponCode}`).then(res => res.data)
}

// 获取用户卡券列表
export const list = () => {
  return http.get(`/card/list`).then(res => res.data)
}

// 团购商城背景图配置
export const groupBanner = (data) => {
  return http.get(`/activity/query?urlSuffix=${data}`).then(res => res.data)
}

// 团购列表商品
export const groupList = () => {
  return http.get(`/groupBuy/listGoods`).then(res => res.data)
}
