import http from '@/utils/http'

// 获取我的包裹列表
export const getPackageList = (params) => {
  return http.post('/MyPackage/getPackageList', params).then(res => res.data)
}

// 包裹详情
export const getTransPackageDetail = (fpxOrderId, statusFlag) => {
  return http.post(`/MyPackage/getTransPackageDetail?fpxOrderId=${fpxOrderId}&statusFlag=${statusFlag}`).then(res => res.data)
}

// 获取支付渠道
export const getPayChannels = () => {
  return http.get('/payChanel/getPayChannels').then(res => res.data)
}

// 支付详情
export const getPayDetailByFpxOrdeId = (fpxOrderId) => {
  return http.get(`/payOrder/getPayDetailByFpxOrdeId?fpxOrderId=${fpxOrderId}`).then(res => {
    return res.data
  })
}

// 提交支付
export const submitPay = (params) => {
  return http.post('/payOrder/submitPay', params).then(res => res.data)
}

// 余额支付
export const submitBalancePay = (params) => {
  return http.post('/accountBalance/balancePay', params).then(res => res.data)
}

// 查询出库支付状态
export const payResultpayResultByFpxOrderId = (params) => {
  return http.get(`/payOrder/payResultpayResultByFpxOrderId?fpxOrderId=${params[0]}&feeType=${params[1]}`).then(res => res.data)
}

// 免邮试算
export const getWeightFreePrice = (params) => {
  return http.get(`/coupon/getWeightFreePrice?fpxOrderId=${params[0]}&reduceWeight=${params[1]}&reduceWeightUnit=${params[2]}`).then(res => res.data)
}

// 优惠活动组合接口
export const getPlanByCondition = (params) => {
  return http.get(`/coupon/getPlanByCondition`, { params: {
    fpxOrderId: params[0],
    payCode: params[1],
    eventPlanningId: params[2],
    couponNo: params[3],
    afterFreeAmount: params[4],
    cardNo: params[5],
    destinationCountry: params[6]
  } }).then(res => res.data)
}

// 出现的支付方式在移动端不能进行支付，要取消，feeType暂时传的是10
export const cancleOrderByFpxOrderId = (fpxOrderId) => {
  return http.get(`/payOrder/cancleOrderByFpxOrderId?fpxOrderId=${fpxOrderId}&feeType=10`).then(res => res.data)
}

// 获取异常包裹列表
export const getExceptionList = (params) => {
  return http.post('/packageException/getPackage', params).then(res => res.data)
}

// 获取包裹列表合箱分箱待支付等对应的统计数量
export const getPackageCountList = () => {
  return http.get('/MyPackage/getPackageCountList').then(res => res.data)
}

// 查询支付单创建时间
// export const getPayOrderCreateTime = (fpxOrderId, feeType) => {
//   return http.get(`/payOrder/getPayOrderCreateTime?fpxOrderId=${fpxOrderId}&feeType=${feeType}`).then(res => res.data)
// }
