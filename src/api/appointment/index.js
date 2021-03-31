import http from '@/utils/http'

// 待预约
export const getPackageList = (params) => {
  return http.post('/MyPackage/getPackageList', params).then(res => res.data)
}

// 我的预约
export const getMyAppointList = (params) => {
  return http.post('/appointment/getAppointmentList', params).then(res => res.data)
}

// 校验用户预约信息是否一致
export const judgeAppointment = (params) => {
  return http.post('/appointment/judgeAppointment', params).then(res => res.data)
}

// 查询预约详情信息
export const getAppointmentDetail = (params) => {
  return http.get(`/appointment/getAppointmentDetail?appointId=${params}`).then(res => res.data)
}

// 提交预约
export const submitShipper = (params) => {
  return http.post('/appointment/submitShipper', params).then(res => res.data)
}

// 待预约包裹所分布的门店列表
export const getPudoNameList = (params) => {
  return http.get('/MyPackage/getPudoNameList').then(res => res.data)
}

// 自提点详情
export const pickUpDetail = (params) => {
  return http.post(`/pickUpDetail/pickUpDetail?pickupCode=${params}`).then(res => res.data)
}

// 在预约列表中勾选数据之后保存预约数据
export const getAppointmentInfo = (params) => {
  return http.post('/appointment/getAppointmentInfo', params).then(res => res.data)
}

// 查看包裹自提码
export const getPackagePickUpCode = (params) => {
  return http.get(`/MyPackage/getPackagePickUpCode?fpxOrderId=${params}`).then(res => res.data)
}
