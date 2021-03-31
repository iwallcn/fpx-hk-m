import http from '@/utils/http'

// 禁运品查询
export const getContraBands = (data) => {
  return http.post('/goodsContraBand/getContraBands', data).then(res => res.data)
}

// 禁运品搜索匹配
export const getNameList = (param) => {
  return http.get(`/goodsContraBand/getNameList?contraBandName=${param}`).then(res => res.data)
}
