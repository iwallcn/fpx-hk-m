import http from '@/utils/http'

// 获取地址（省市区联动）
export const getChildArea = (parentId) => {
  return http.get(`/landMarkRest/getChildArea?parentId=${parentId}`).then(res => res.data)
}

// 获取当前用户香港地址-分页
export const getUserAddressPageByUserId = (params) => {
  return http.post('/userAddress/getUserAddressPageByUserId', params).then(res => res.data)
}

// 新增收货地址
export const addUserAddress = (params) => {
  return http.post('/userAddress/addUserAddress', params).then(res => res.data)
}

// 修改收货地址
export const editUserAddress = (params) => {
  return http.post('/userAddress/editUserAddress', params).then(res => res.data)
}

// 删除派送地址
export const deleteUserAddress = (id) => {
  return http.get(`/userAddress/deleteUserAddress?id=${id}`).then(res => res.data)
}

// 設置派送默認地址
export const setDefaultFlag = (params) => {
  return http.get(`/userAddress/setDefaultFlag?id=${params}`).then(res => res.data)
}

// 获取当前用户自提点列表-分页
export const getPickUpRecipientsSimsPudoPage = (params) => {
  return http.post('/pickUpRecipients/getPickUpRecipientsSimsPudoPage', params).then(res => res.data)
}

// 获取当前用户自提柜列表-分页
export const getPickUpRecipientsSimsLockerPage = (params) => {
  return http.post('/pickUpRecipients/getPickUpRecipientsSimsLockerPage', params).then(res => res.data)
}

// 删除自提点柜地址
export const deletePickUpRecipients = (params) => {
  return http.get(`/pickUpRecipients/deletePickUpRecipients?id=${params}`).then(res => res.data)
}

// 新增自提点
export const addPickUpRecipients = (params) => {
  return http.post('/pickUpRecipients/addPickUpRecipients', params).then(res => res.data)
}

// 编辑自提点
export const editPickUpRecipients = (params) => {
  return http.post('/pickUpRecipients/editPickUpRecipients', params).then(res => res.data)
}

// 根据地址获取自提点、自提柜
export const getHkPudoOrLockerInfoList = (params) => {
  return http.get(`/pdsPickUp/getHkPudoOrLockerInfoList?provinceCode=${params[0]}&cityCode=${params[1]}&deliveryType=${params[2]}`).then(res => res.data)
}

// 获取香港自提点、自提柜列表数据-不分页
export const getHkSimsInfoList = () => {
  return http.get(`/pdsPickUp/getHkSimsInfoList`).then(res => res.data)
}

// 获取香港自提点、自提柜列表数据模糊查詢
export const getHkSimsInfoPage = (params) => {
  return http.post('/pdsPickUp/getHkSimsInfoPage', params).then(res => res.data)
}

// 获取香港所有门店信息
export const getAllPudo = (params) => {
  return http.post('/pdsPickUp/getAllPudo', params).then(res => res.data)
}

// 模糊查询自提仓（自提点）
export const getByFuzzy = (params) => {
  return http.get(`/pdsPickUp/getByFuzzy?name=${params}`).then(res => res.data)
}

// 模糊查询自提柜
export const getLockerByFuzzy = (params) => {
  return http.get(`/pdsPickUp/getLockerByFuzzy?name=${params}`).then(res => res.data)
}

// 設置自提點默認地址
export const setSelfDefaultFlag = (id, type) => {
  return http.get(`/pickUpRecipients/setDefaultFlag/${type}?id=${id}`).then(res => res.data)
}
