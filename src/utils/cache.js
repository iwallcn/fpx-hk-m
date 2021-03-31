/*
 * 这里主要是获取缓存里面的各种数据
 */
// 数据字典
export const dictData = () => {
  return JSON.parse(sessionStorage.dictData)
}

// 起运仓库
export const getWH = () => {
  return dictData().WH
}

// 目的国家, TODO 暂时前端配置
export const destinationCountry = () => {
  return {
    'CN': '中国大陆',
    'HK': '中国香港'
  }
}

// 费用类型
export const getAS = () => {
  return dictData().AS
}

// 产品服务
export const getPD = () => {
  return dictData().PD
}

// 包裹状态
export const getPS = () => {
  return dictData().PS
}

// 重量单位
export const getWU = () => {
  return dictData().WU
}

// 末端派送公司映射
export const getCO = () => {
  return dictData().CO
}

// 包裹拒收异常类型
export const getIS = () => {
  return dictData().IS
}
