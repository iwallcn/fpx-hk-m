// 这里用来存放一些全局的变量
export const global = {
  code: '0',
  fixedTwo: function (num) { // 保留两位小数
    let value = Math.round(parseFloat(num) * 100) / 100
    let xsd = value.toString().split('.')
    if (xsd.length === 1) {
      value = value.toString() + '.00'
      return value
    }
    if (xsd.length > 1) {
      if (xsd[1].length < 2) {
        value = value.toString() + '0'
      }
      return value
    }
  },
  fixedThree: function (num) { // 保留三位小数
    let value = Math.round(parseFloat(num) * 1000) / 1000
    let xsd = value.toString().split('.')
    if (xsd.length === 1) {
      value = value.toString() + '.000'
      return value
    }
    if (xsd.length > 1) {
      if (xsd[1].length < 3) {
        value = value.toString() + '0'
      }
      return value
    }
  },
  // 0预报 shipments 1修改 editOrder 2认领 receiveclaim  3合箱 merge 4合箱轉單票 mergeToSingle 5用戶自助下單 selfOrder
  getOrdertypeByRouter: {
    'shipments': 0,
    'editOrder': 1,
    'receiveclaim': 2,
    'merge': 3,
    'mergeToSingle': 4,
    'selfOrder': 5
  }
}
