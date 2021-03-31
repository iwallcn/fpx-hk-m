import http from '@/utils/http'

// 查询单个轨迹
export const getPackageTrackByOrderId = (fpxOrderId) => {
  return http.get(`/packgeTrack/getPackageTrackByOrderId?fpxOrderId=${fpxOrderId}`).then(res => res.data)
}

export const getPackageTrackByServe = (data) => {
  return http.post('/packgeTrack/getPackageTrackByServe', data).then(res => res.data)
}
