import http from '@/utils/http'

// 查询包裹
export const queryPgk = (data) => {
  return http.post('/myPackageReturn/queryPgk', data).then(res => res.data)
}

// 查询包裹列表
export const getPackageList = (data) => {
  return http.post('/myPackageReturn/getPackageList', data).then(res => res.data)
}

// 查询包裹详情
export const getPackagePrealertDetail = (data) => {
  return http.get(`/myPackageReturn/getPackagePrealertDetail?fpxOrderId=${data}`).then(res => res.data)
}

// 新增退件包裹
export const setReturnPackagePrealert = (data) => {
  return http.post('/myPackageReturn/setReturnPackagePrealert', data).then(res => res.data)
}

// 编辑包裹
export const setUpdateReturnPackagePrealert = (data) => {
  return http.post('/myPackageReturn/setUpdateReturnPackagePrealert', data).then(res => res.data)
}

// 取消订单
export const cancelOrder = (data) => {
  return http.get(`/myPackageReturn/cancelOrder?fpxOrderId=${data}`).then(res => res.data)
}

// 退运费计算
export const billingUtil = (data) => {
  return http.get(`/myPackageReturn/billingUtil?goodsNum=${data}`).then(res => res.data)
}
