import http from '@/utils/http'

// 发送邮箱验证
export const sendEditPayPasswordVerifyMessage = () => {
  return http.get('/payPassword/sendEditPayPasswordVerifyMessage').then(res => res.data)
}

// 保存修改
export const updatePayPassword = (params) => {
  return http.post('/payPassword/updatePayPassword', params).then(res => res.data)
}
