// export const env = process.env.ENV_CONFIG // 这里用来设置发布各个环境的变量
let env = ''
if (location.href.indexOf('localhost') !== -1 || location.href.indexOf('uat') !== -1) {
  // UAT，本地
  env = 'uat'
} else if (location.href.indexOf('10.104.6.52') !== -1 || location.href.indexOf('test') !== -1) {
  // 测试
  env = 'test'
} else if (location.href.indexOf('127.0.0.1') !== -1 || location.href.indexOf('localhost') !== -1) {
  // 本地
  env = 'dev'
} else if (location.href.indexOf('yf') !== -1) {
  env = 'yf'
} else {
  // 生产
  env = 'prod'
}
console.log('测试 - 当前环境是：' + env)

// 登出
export function getLogoutUrl () {
  switch (env) {
    case 'test':
      return 'https://sso-c.test.4px.com/logout'
    case 'uat':
      return 'https://sso-c.uat.4px.com/logout'
    case 'prod':
      return 'https://sso-c.4px.com/logout'
    case 'yf':
      return 'https://sso-c.4px.com/logout'
    default:
      return 'https://sso-c.uat.4px.com/logout'
  }
}

// 根据环境变量获取业务系统后端服务地址
export function getSystemUrl () {
  switch (env) {
    case 'test':
      return 'http://m.hk-test.4px.com/cas'
    case 'uat':
      return 'http://m.hk-uat.4px.com/cas'
    case 'prod':
      return 'http://m-hk.4px.com/cas'
    case 'yf':
      return 'https://m-hk-yf.4px.com/cas'
    default:
      return 'http://m.hk-uat.4px.com/cas'
  }
}

// 根据环境变量获取业务系统前端首页地址
export function getIndexUrl () {
  switch (env) {
    case 'test':
      return 'http://m.hk-test.4px.com'
    case 'uat':
      return 'http://m.hk-uat.4px.com'
    case 'prod':
      return 'http://m-hk.4px.com'
    case 'yf':
      return 'https://m-hk-yf.4px.com/'
    default:
      return 'http://m.hk-uat.4px.com'
  }
}

// 登出
export function logout () {
  // 这里service是后端业务系统地址，fservice指业务前端地址，logoutUrl指登出地址
  removeToken('LoginState')
  let logoutUrl = getLogoutUrl()
  let service = `${getIndexUrl()}/logout`
  window.location.href = `${logoutUrl}?service=${service}`
}

// 获取token
export function getToken (key) {
  let name = key + '='
  let ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim()
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

// 设置token
export function setToken (key, value, expiredays) {
  var Now = new Date()
  Now.setDate(Now.getDate() + expiredays)
  document.cookie = key + '=' + escape(value) + ((expiredays === null) ? ';path=/' : ';path=/;expires=' + Now.toGMTString())
}

// 删除token
export function removeToken (name) {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getToken(name)
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}

// 设置localstorage
export function setLocalStorage (key) {
  let currentTime = new Date().getTime()
  localStorage.setItem(key, currentTime)
}

// 获取localstorage
export function getLocalStorage (key) {
  let expires = 24 * 60 * 60 * 1000 // 设置通知栏过期时间1天
  // let expires = 0.2 * 60 * 1000
  let data = localStorage.getItem(key)
  if (!data) { // 第一次打开
    return true
  }
  // 已经过期
  return new Date().getTime() - data > expires
}

// 获取localstorage，设置不再提醒
export function getNeverStorage (key) {
  let expires = 365 * 24 * 60 * 60 * 1000 // 设置不再提醒过期时间365天
  let data = localStorage.getItem(key)
  if (!data) { // 第一次打开
    return true
  }
  // 已经过期
  return new Date().getTime() - data > expires
}

// 设置title，解决微信改不了title的bug
export const setTitle = (title) => {
  document.title = title
  let userAgent = window.navigator.userAgent.toLowerCase()
  let isiOS = userAgent.indexOf('applewebkit') >= 0
  let isWechat = userAgent.indexOf('micromessenger') >= 0
  if (isiOS && isWechat) {
    let iframe = document.createElement('iframe')
    iframe.src = 'https://www.baidu.com/favicon.ico'
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    iframe.onload = function () {
      setTimeout(function () {
        iframe.remove()
      }, 0)
    }
  }
}
