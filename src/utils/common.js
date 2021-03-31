// 时间戳转换为YYYY-MM-DD 上午
export const formatDate = (end) => {
  let now = new Date(end)
  let year = now.getFullYear()
  let month = now.getMonth() + 1
  let date = lessTen(now.getDate())
  let m = now.getHours() >= 12 ? '下午' : '上午'
  return `${year}年${month}月${date}日 ${m}`
}

// 时间戳转换为YYYY-MM-DD
export const fmtDate = obj => {
  var date = new Date(obj)
  var y = 1900 + date.getYear()
  var m = '0' + (date.getMonth() + 1)
  var d = '0' + date.getDate()
  return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
}

// 时间戳转换为YYYY-MM-DD hh:mm:ss
export const formatDateL = (needTime, type) => {
  let time = needTime ? new Date(needTime) : new Date()
  let Y = time.getFullYear()
  let M = time.getMonth() + 1
  let D = time.getDate()
  let h = time.getHours()
  let m = time.getMinutes()
  let s = time.getSeconds()
  let lessTen = (m) => {
    return m < 10 ? '0' + m : m
  }
  if (type === 'YYYY-MM-DD') {
    return Y ? `${Y}-${lessTen(M)}-${lessTen(D)}` : ''
  }
  return Y ? `${Y}-${lessTen(M)}-${lessTen(D)} ${lessTen(h)}:${lessTen(m)}:${lessTen(s)}` : ''
}

export const lessTen = (num) => {
  return num < 10 ? '0' + num : num
}
