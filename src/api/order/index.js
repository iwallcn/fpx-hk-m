import http from '@/utils/http'

// 获取常用品类前五
export const getCommonlyCategory = () => {
  return http.get('/packagePrealert/getCommonlyCategory').then(res => res.data)
}

// 获取顶级品类列表(第一级)
export const getFirstCategoryList = () => {
  return http.get('/categoryBasicGw/getFirstCategoryList').then(res => res.data)
}

// 获取品类列表(第二级)
export const getSecondCategoryList = (data) => {
  return http.post(`/categoryBasicGw/getSecondCategoryList`, data).then(res => res.data)
}

// 获取品类列表(第三级)
export const getDeclareProductList = (data) => {
  return http.post(`/categoryBasicGw/getDeclareProductList`, data).then(res => res.data)
}

// 根据仓库和目的国获得转运方式
export const getTransferType = (data) => {
  return http.get(`/line/getTransferType?warhouseCode=${data}&destinationCountry=HK`).then(res => res.data)
}

// 获取顶级品类列表(物品模式使用)
export const getCategoryBasicList = (data) => {
  return http.post(`/categoryBasic/getCategoryBasicList`, data).then(res => res.data)
}

// 获取所有原产地信息
export const getOriginPlaceList = () => {
  return http.get(`/line/getOriginPlaceList`).then(res => res.data)
}

// 根据仓库、目的国、收货方式获取产品线路
export const getProductConfigList = (data) => {
  return http.post(`/packagePrealert/getProductConfigList`, data).then(res => res.data).then(res => {
    if (res.data) {
      const product = res.data.find(item => item.productCode === 'TIPP')
      if (product && product.channelIncrments) {
        const index = product.channelIncrments.findIndex(c => c.itemCode === '315')
        if (index !== -1) {
          product.channelIncrments.splice(index, 1)
        }
      }
    }

    return res
  })
}

// 单票预报、单票认领 (合箱、分箱拍照增值服务图片 使用方式一样)
export const setPackagePrealertSingle = (data) => {
  return http.post(`/packagePrealert/setPackagePrealertSingle`, data).then(res => res.data)
}

// 合箱预报、合箱认领
export const setPackagePrealertMerge = (data) => {
  return http.post(`/packagePrealert/setPackagePrealertMerge`, data).then(res => res.data)
}

// 获取预报信息 (认领、合箱转单票、分箱转单票、编辑包裹)
export const getPackagePrealert = (fpxOrderId) => {
  return http.get(`/packagePrealert/getPackagePrealert?fpxOrderId=${fpxOrderId}`).then(res => res.data)
}

// 验证商家物流号是否正确(认领使用)
export const verificationFeferOrderId = (data) => {
  return http.get(`/packagePrealert/VerificationFeferOrderId?fpxOrderId=${data.fpxOrderId}&referOrderId=${data.referOrderId}`).then(res => res.data)
}

// 合箱发货获取合箱包裹的商品信息
export const getApplyMergerGoodInfo = (data) => {
  return http.post(`/packagePrealert/getApplyMergerGoodInfo`, data).then(res => res.data)
}

// 取消包裹
export const setCancelOrder = (data) => {
  return http.post(`/MyPackage/setCancelOrder`, data).then(res => res.data)
}

// 删除包裹
export const changeOrderToDelete = (data) => {
  return http.get(`/MyPackage/changeOrderToDelete?fpxOrderId=${data}`).then(res => res.data)
}

// 单票修改
export const setUpdatePackagePrSingle = (data) => {
  return http.post(`/packagePrealert/setUpdatePackagePrSingle`, data).then(res => res.data)
}

// 合箱修改
export const setUpdatePackagePrMerge = (data) => {
  return http.post(`/packagePrealert/setUpdatePackagePrMerge`, data).then(res => res.data)
}

// 获取申请合箱的包裹信息
export const getApplyMergerPackageInfo = (data) => {
  return http.post(`/packagePrealert/getApplyMergerPackageInfo`, data).then(res => res.data)
}

// 合箱申请
export const setPackageMergeOrder = (data) => {
  return http.post(`/packagePrealert/setPackageMergeOrder`, data).then(res => res.data)
}

// 合箱转单票
export const changeSingleTransport = (data) => {
  return http.post(`/packagePrealert/changeSingleTransport`, data).then(res => res.data)
}

// 判断预报单商家物流号是否存在
export const getReferOrderId = (data) => {
  return http.get(`/packagePrealert/getReferOrderId?referOrderId=${data.referOrderId}&fpxOrderId=${data.fpxOrderId || ''}`).then(res => res.data)
}

// 获取用户历史商品数据
export const getHistPageByUserId = (page) => {
  return http.post('/packagePrealert/getHistPageByUserId', page).then(res => res.data)
}

// 取消合箱
export const setCancelMerge = (data) => {
  return http.post(`/packagePrealert/setCancelMerge`, data).then(res => res.data)
}

// 判断预报单商家物流号来源
export const getPackageSource = (referOrderId) => {
  return http.get(`/packagePrealert/getPackageSource?referOrderId=${referOrderId}`).then(res => res.data)
}

// 校验合箱转单票
export const checkMergeTosignl = (fpxOrderId) => {
  return http.get(`/packagePrealert/checkMergeTosignl?fpxOrderId=${fpxOrderId}`).then(res => res.data)
}

// 商品团购，根据商家物流号获取fpx单号
export const getFpxOrderId = (referOrderId) => {
  return http.get(`/packagePrealert/getFpxOrderId?referOrderId=${referOrderId}`).then(res => res.data)
}

// 获取待操作的异常包裹数
export const getPackageCount = () => {
  return http.get(`/packageException/getPackageCount`).then(res => res.data)
}

// 合箱包裹运费试算
export const getMergeTrialInquiry = (data) => {
  return http.post(`/productTrialInquiry/getMergeTrialInquiry`, data).then(res => res.data)
}

// 入库后编辑包裹
export const setUpdatePackageOrderCarriage = (data) => {
  return http.post(`/packagePrealert/setUpdatePackageOrderCarriage`, data).then(res => res.data)
}

// 下預報時，如果是合箱单，則判斷是否是禁运品
export const checkMergeByContraBandCode = (data) => {
  return http.post(`/goodsContraBand/checkMergeByContraBandCode`, data).then(res => res.data)
}

// 運費試算
export const carriageTrial = (data) => {
  return http.post(`/payOrder/carriageTrial`, data).then(res => res.data)
}

// 派送、根据仓库获取增值服务
export const getAddserviceByWarehouseCode = (warehouseCode) => {
  return http.get(`/packagePrealert/getAddserviceByWarehouseCode?warehouseCode=${warehouseCode}`).then(res => res.data)
}
