import * as types from './mutation-types'

export default {
  [types.SET_DICTDATA] (state, payload) {
    state.dictData = JSON.stringify(payload)
    sessionStorage.setItem('dictData', JSON.stringify(payload))
  },
  [types.SET_PACKAGETABINDEX] (state, payload) {
    state.packageTabIndex = payload
    localStorage.setItem('packageTabIndex', payload)
  },
  [types.SET_COUNTRYCODE] (state, payload) {
    state.countryCode = payload
  },
  [types.SET_WAREHOUSEID] (state, payload) {
    state.warehouseId = payload
  },
  [types.SET_PROVINCEDATA] (state, payload) {
    state.provinceData = JSON.stringify(payload)
    localStorage.setItem('provinceData', JSON.stringify(payload))
  },
  [types.SET_CITYDATA] (state, payload) {
    state.cityData = JSON.stringify(payload)
    localStorage.setItem('cityData', JSON.stringify(payload))
  },
  [types.SET_DISTRICTDATA] (state, payload) {
    state.districtData = JSON.stringify(payload)
    localStorage.setItem('districtData', JSON.stringify(payload))
  },
  [types.SET_CURRENTUSERADDRESS] (state, payload) {
    state.currentUserAddress = JSON.stringify(payload)
    localStorage.setItem('currentUserAddress', JSON.stringify(payload))
  },
  [types.SET_ADDRESSTABINDEX] (state, payload) {
    state.addressTabIndex = payload
    localStorage.setItem('addressTabIndex', payload)
  },
  [types.SET_CONTRABANDCATEGORY] (state, payload) {
    state.contrabandCategory = payload
  },
  [types.SET_CONTRABANDDETAIL] (state, payload) {
    state.contrabandDetail = payload
  },
  /**
   * 预报
   */
  [types.SET_USER_BASE_INFO] (state, payload) {
    state.userBaseInfo = payload
    sessionStorage.setItem('userBaseInfo', JSON.stringify(payload))
  },
  [types.SET_ORDER_BASE_DATA] (state, payload) {
    state.orderBaseData = payload
  },
  [types.SET_ORDER_GOODS_LIST] (state, payload) {
    state.orderGoodsList = payload
  },
  [types.SET_ORDER_ADDRESS] (state, payload) {
    state.orderAddress = payload
  },
  [types.DELETE_ORDER_DATA] (state, payload) {
    state.orderAddress = {}
    state.orderGoodsList = []
  },
  [types.SET_REFER_ORDERIDS] (state, payload) {
    state.referOrderIds = payload
  },
  [types.SET_IS_ENCRYPTED] (state, payload) {
    state.isEncrypted = payload
  },
  [types.SET_REFER_ORDERID] (state, payload) {
    state.referOrderId = payload
  },
  /**
   * 退件
   */
  [types.SET_RETURN_PICKUPADDRESS] (state, payload) {
    state.returnPickupAddress = payload
  },
  [types.SET_RETURN_ADDRESS] (state, payload) {
    state.returnAddress = JSON.stringify(payload)
    sessionStorage.setItem('returnAddress', JSON.stringify(payload))
  }
  /**
   * 设置通知栏
   */
  // [types.SET_HOME_NOTIFY] (state, payload) {
  //   state.homeNotify = payload
  // },
  // [types.SET_ACCOUNT_NOTIFY] (state, payload) {
  //   state.accountNotify = payload
  // }
}
