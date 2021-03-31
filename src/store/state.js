const state = {
  dictData: sessionStorage.getItem('dictData') || null,
  packageTabIndex: parseInt(localStorage.getItem('packageTabIndex')) || 3,
  countryCode: '',
  warehouseId: '',
  provinceData: localStorage.getItem('provinceData') || null,
  cityData: localStorage.getItem('cityData') || null,
  districtData: localStorage.getItem('districtData') || null,
  currentUserAddress: localStorage.getItem('currentUserAddress') || null,
  addressTabIndex: parseInt(localStorage.getItem('addressTabIndex')) || 0,
  contrabandCategory: {}, // 設置當前選中的違禁品
  contrabandDetail: {}, // 設置當前選中的違禁品詳情
  /**
   * 预报
   */
  userBaseInfo: sessionStorage.getItem('userBaseInfo') || {
    firstName: '',
    gradeName: '',
    memberCode: ''
  },
  orderBaseData: {
    orderType: 0, // 0预报 1修改 2认领 3合箱 4合箱轉單票
    fpxOrderId: ''
  },
  orderGoodsList: [],
  orderAddress: {},
  returnPickupAddress: {}, // 退件門店地址
  returnAddress: sessionStorage.getItem('returnAddress') || {}, // 退件地址
  referOrderIds: [],
  isEncrypted: '', // 认领中判断该订单是从淘宝数据下达，还是货物直接到仓
  referOrderId: '' // 认领中订单商家物流号
}

export default state
