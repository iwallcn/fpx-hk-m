import Vuex from 'vuex'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
// 持久化
import VuexPersistence from 'vuex-persist'
const Vue = require('vue')
const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage,
  reducer: (state) => ({
    // userBaseInfo: state.userBaseInfo,
    // orderBaseData: state.orderBaseData,
    // orderGoodsList: state.orderGoodsList,
    // orderAddress: state.orderAddress
    referOrderIds: state.referOrderIds,
    isEncrypted: state.isEncrypted, // 认领中判断该订单是从淘宝数据下达，还是货物直接到仓
    referOrderId: state.referOrderId // 认领中订单商家物流号
  })
})

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {},
  plugins: [vuexLocal.plugin]
})

export default store
