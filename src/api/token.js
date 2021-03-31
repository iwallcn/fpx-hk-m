import http from '@/utils/http'

// 获取token值，防止重复提交
export const getApiToken = () => {
  return http.get('/token/get').then(res => res.data)
}
