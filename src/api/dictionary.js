import http from '@/utils/http'

// 数据字典
export const dictionary = () => {
  return http.get('/sys/data/dictionary').then(res => res.data)
}
