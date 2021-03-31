import http from '@/utils/http'

// 启始国列表
export const getDepartureCountryList = () => {
  return http.get('/line/getDepartureCountryList').then(res => res.data)
}

// 根据启始国获取仓库列表
export const getWarhouseList = (departureCountry) => {
  return http.get('/line/getWarhouseList?departureCountry=' + departureCountry).then(res => res.data)
}

// 根据仓库code获取仓库详细信息
export const getWarehouseDetail = (warehouseId) => {
  return http.get('/warehouse/getWarehouseDetail?warehouseId=' + warehouseId).then(res => res.data)
}
