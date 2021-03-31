export default {
  dictData (state) {
    return JSON.parse(state.dictData)
  },
  provinceData (state) {
    return JSON.parse(state.provinceData)
  },
  cityData (state) {
    return JSON.parse(state.cityData)
  },
  districtData (state) {
    return JSON.parse(state.districtData)
  },
  currentUserAddress (state) {
    return JSON.parse(state.currentUserAddress)
  },
  returnAddress (state) {
    return JSON.parse(state.returnAddress)
  },
  orderAddress (state) {
    return JSON.parse(state.orderAddress)
  }
}
