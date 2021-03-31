import http from '@/utils/http'

// 获取首页banner
export const bannerInfo = (data) => {
  return http.post('/bannerInfo/query', data).then(res => res.data)
}

// 获取单页配置信息
export const getBannerPageInfo = (id) => {
  return http.get(`/navigationPageInfo/getId?id=${id}`).then(res => res.data)
}

// 获取vip单页配置信息
export const getNavigationPageInfo = (code) => {
  return http.get(`/navigationPageInfo/get?navigationCode=${code}`).then(res => res.data)
}

// 获取新闻详情
export const getNewsDetailInfo = (id) => {
  return http.get(`/newsWebsite/getNewsDetailInfo?newsId=${id}`).then(res => res.data)
}

// 后台广告位列表查询
export const bannerQuery = (data) => {
  return http.post('/managerAdvertisingSpace/query', data).then(res => res.data)
}
