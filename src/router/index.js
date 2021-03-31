// import Router from 'vue-router'
import Store from '@/store'
import {
  getUserBasicInfo,
  getSeo
} from '@/api/personalInfo'
import { dictionary } from '@/api/dictionary'
import {
  getFacebookOpenId,
  getGoogleOpenId
} from '@/api/login'
const Router = require('vue-router')
const Vue = require('vue')

const account = () => import(/* webpackChunkName: "account" */ '@/components/account') // 个人中心
// const profile = () => import(/* webpackChunkName: "profile" */ '@/components/personalInfo') // 我的资料
// const nickName = () => import(/* webpackChunkName: "nickName" */ '@/components/personalInfo/nickName') // 我的资料 - 修改昵称
// const payPwd = () => import(/* webpackChunkName: "payPwd" */ '@/components/personalInfo/payPwd') // 支付密碼
// const certification = () => import(/* webpackChunkName: "certification" */ '@/components/personalInfo/certification') // 实名认证
// const setemail = () => import(/* webpackChunkName: "setemail" */ '@/components/personalInfo/setemail') // 设置邮箱
// const updateemail = () => import(/* webpackChunkName: "updateemail" */ '@/components/personalInfo/updateemail') // 修改邮箱
// const settel = () => import(/* webpackChunkName: "settel" */ '@/components/personalInfo/settel') // 设置手机
// const updatetel = () => import(/* webpackChunkName: "updatetel" */ '@/components/personalInfo/updatetel') // 修改手机
// const balance = () => import(/* webpackChunkName: "balance" */ '@/components/balance') // 我的余额
// const flowDetail = () => import(/* webpackChunkName: "flowDetail" */ '@/components/balance/flowDetail') // 我的余额
// const recharge = () => import(/* webpackChunkName: "recharge" */ '@/components/balance/recharge') // 我的余额 -- 充值
const rechargeType = () => import(/* webpackChunkName: "rechargeType" */ '@/components/balance/rechargeType') // 我的余额 -- 充值 - 选择充值方式
const orders = () => import(/* webpackChunkName: "orders" */ '@/components/orders') // 我的包裹
const trial = () => import(/* webpackChunkName: "trial" */ '@/components/trial') // 運費試算
const receivedetail = () => import(/* webpackChunkName: "receivedetail" */ '@/components/orders/receivedetail') // 我的包裹 -- 订单详情
// const payment = () => import(/* webpackChunkName: "payment" */ '@/components/orders/payment') // 我的包裹 -- 支付详情
const coupon = () => import(/* webpackChunkName: "coupon" */ '@/components/coupon') // 我的优惠券
const card = () => import(/* webpackChunkName: "card" */ '@/components/coupon/card') // 我的卡包
const cardInfo = () => import(/* webpackChunkName: "cardInfo" */ '@/components/coupon/cardInfo') // 卡券詳情s
const cardPayment = () => import(/* webpackChunkName: "cardPayment" */ '@/components/coupon/cardPayment') // 卡券支付
const paySuccessAction = () => import(/* webpackChunkName: "paySuccessAction" */ '@/components/coupon/paySuccessAction') // 第三方支付成功處理頁面
const myrebate = () => import(/* webpackChunkName: "myrebate" */ '@/components/myrebate') // 推廣返利
const myrebateShare = resolve => require.ensure([], () => resolve(require('@/components/myrebate/share')), 'myrebateShare') // 推廣返利
const activateCoupon = () => import(/* webpackChunkName: "activateCoupon" */ '@/components/coupon/activateCoupon') // 我的优惠券 -- 激活优惠券
const tracking = () => import(/* webpackChunkName: "tracking" */ '@/components/tracking') // 查看物流轨迹
const warehouse = () => import(/* webpackChunkName: "warehouse" */ '@/components/warehouse') // 国外仓库地址
const addresses = () => import(/* webpackChunkName: "addresses" */ '@/components/addresses') // 国内收货地址
const sendEdit = () => import(/* webpackChunkName: "sendEdit" */ '@/components/addresses/sendEdit') // 收货地址 -- 新增，编辑地址
const pickupEdit = () => import(/* webpackChunkName: "pickupEdit" */ '@/components/addresses/pickupEdit') // 自提点柜收货地址 -- 新增，编辑地址
const warehouseList = () => import(/* webpackChunkName: "warehouseList" */ '@/components/warehouse/warehouseList') // 国外仓库地址 -- 仓库列表
const warehouseAddress = () => import(/* webpackChunkName: "warehouseAddress" */ '@/components/warehouse/warehouseAddress') // 国外仓库地址 -- 仓库列表
const contrabandCategory = () => import(/* webpackChunkName: "contrabandCategory" */ '@/components/restrictions/contrabandCategory') // 违禁品查询
const contrabandDetail = () => import(/* webpackChunkName: "contrabandDetail" */ '@/components/restrictions/contrabandDetail') // 违禁品查询
const layout = () => import(/* webpackChunkName: "layout" */ '@/components/layout') // laoyut
// const shipments = () => import(/* webpackChunkName: "shipments" */ '@/components/shipments') // 新增包裹
// const editOrder = () => import(/* webpackChunkName: "editOrder" */ '@/components/shipments/editOrder') // 修改包裹
const receiveclaim = () => import(/* webpackChunkName: "order" */ '@/components/shipments/receiveclaim') // 认领包裹
const merge = () => import(/* webpackChunkName: "shipments" */ '@/components/shipments/merge') // 合箱
const mergeToSingle = () => import(/* webpackChunkName: "shipments" */ '@/components/shipments/mergeToSingle') // 合箱转单票
const addGoods = () => import(/* webpackChunkName: "shipments" */ '@/components/shipments/addGoods') // 新增商品
const addArticles = () => import(/* webpackChunkName: "shipments" */ '@/components/shipments/addArticles') // 新增物品
// const notFound = () => import(/* webpackChunkName: "404" */ '@/components/errorPage/404') // 404
// const home = () => import(/* webpackChunkName: "home" */ '@/components/layout/home') // 首页
const issue = () => import(/* webpackChunkName: "issue" */ '@/components/layout/issue') // 問題件處理
const vip = () => import(/* webpackChunkName: "vip" */ '@/components/navigationPageInfo/vip') // vip
const contact = () => import(/* webpackChunkName: "contact" */ '@/components/navigationPageInfo/contact') // 聯繫我們
const about = () => import(/* webpackChunkName: "about" */ '@/components/navigationPageInfo/about') // 關於我們
const terms = () => import(/* webpackChunkName: "terms" */ '@/components/navigationPageInfo/terms') // 用戶條款
const privacy = () => import(/* webpackChunkName: "privacy" */ '@/components/navigationPageInfo/privacy') // 隱私政策
const tutorial = () => import(/* webpackChunkName: "tutorial" */ '@/components/navigationPageInfo/tutorial') // 新手教程
const categories = () => import(/* webpackChunkName: "categories" */ '@/components/navigationPageInfo/categories') // 单页配置-服务于价格，活动，新闻之类
const news = () => import(/* webpackChunkName: "news" */ '@/components/navigationPageInfo/news') // 但也配置-新闻页面
const newsList = () => import(/* webpackChunkName: "newsList" */ '@/components/navigationPageInfo/newsList') // 公告列表
const faq = () => import(/* webpackChunkName: "faq" */ '@/components/navigationPageInfo/faq') // 常見問題
const insurance = () => import(/* webpackChunkName: "insurance" */ '@/components/navigationPageInfo/insurance') // 保險與理賠
const restrictions = () => import(/* webpackChunkName: "restrictions" */ '@/components/navigationPageInfo/restrictions') // 违禁品查询
const pricing = () => import(/* webpackChunkName: "pricing" */ '@/components/navigationPageInfo/pricing') // 全球到香港
const singlePage = () => import(/* webpackChunkName: "singlePage" */ '@/components/navigationPageInfo/singlePage') // singlePage
const pickupAddress = () => import(/* webpackChunkName: "pickupAddress" */ '@/components/layout/pickupAddress') // 自提點地址
// const registrationActivity = () => import(/* webpackChunkName: "registrationActivity" */ '@/components/registrationActivity') // 全球到香港注册
// const registrationInland = () => import(/* webpackChunkName: "registrationInland" */ '@/components/registrationActivity/inland') // 大陆到香港注册
// const userRegistrationGlobal = () => import(/* webpackChunkName: "userRegistrationGlobal" */ '@/components/registrationActivity/global') // 大陆到香港注册
// const registrationActivityShare = () => import(/* webpackChunkName: "registrationActivityShare" */ '@/components/registrationActivity/share') // 蓝色注册
const userRegistration = () => import(/* webpackChunkName: "userRegistration" */ '@/components/registrationActivity/userRegistration') // 橙色活动页面
const activityOK = () => import(/* webpackChunkName: "activity" */ '@/components/registrationActivity/activityOK') // 注册1-ok
const shareOK = () => import(/* webpackChunkName: "share" */ '@/components/registrationActivity/shareOK') // 注册2-ok
// const login = () => import(/* webpackChunkName: "login" */ '@/components/login') // 登錄
// const bindAccount = () => import(/* webpackChunkName: "bindAccount" */ '@/components/login/bindAccount') // 4px登錄
// const register = () => import(/* webpackChunkName: "register" */ '@/components/register') // 註冊
const bindRegister = () => import(/* webpackChunkName: "bindRegister" */ '@/components/register/bindRegister') // 註冊并绑定
const registrationSuccess = () => import(/* webpackChunkName: "register" */ '@/components/register/registrationSuccess') // 註冊
const appointment = () => import(/* webpackChunkName: "appointment" */ '@/components/appointment') // 预约
const appointTime = () => import(/* webpackChunkName: "appointTime" */ '@/components/appointment/appointTime') // 预约提货
const appointDetail = () => import(/* webpackChunkName: "appointDetail" */ '@/components/appointment/appointDetail') // 预约完成
const myAppoint = () => import(/* webpackChunkName: "myAppoint" */ '@/components/appointment/myAppoint') // 我的预约
const productList = () => import(/* webpackChunkName: "productList" */ '@/components/shipments/productList') // 历史商品数据
// const groupBuy = () => import(/* webpackChunkName: "groupBuy" */ '@/components/coupon/groupBuy') // 商品团购
// const receiveclaim = () => import(/* webpackChunkName: "shipments" */'@/components/shipments/receiveclaim') // 认领包裹
const returnAdd = () => import(/* webpackChunkName: "returnAdd" */ '@/components/return/returnAdd') // 新增退件
const returnEdit = () => import(/* webpackChunkName: "returnEdit" */ '@/components/return/returnEdit') // 編輯退件
const returns = () => import(/* webpackChunkName: "returns" */ '@/components/return/returns') // 退件列表
const returnPickup = () => import(/* webpackChunkName: "returnPickup" */ '@/components/return/returnPickup') // 退件门店
const returnAddress = () => import(/* webpackChunkName: "returnAddress" */ '@/components/return/returnAddress') // 退件地址
const returnAddressAdd = () => import(/* webpackChunkName: "returnAddressAdd" */ '@/components/return/returnAddressAdd') // 退件地址新增
const returnDetail = () => import(/* webpackChunkName: "returnDetail" */ '@/components/return/returnDetail') // 退件详情
const returnPay = () => import(/* webpackChunkName: "returnPay" */ '@/components/return/returnPay') // 退件支付
const paymentEnd = () => import(/* webpackChunkName: "paymentEnd" */ '@/components/paymentEnd') // 支付完成页
const selfOrder = () => import(/* webpackChunkName: "selfOrder" */ '@/components/shipments/selfOrder') // 用户自助下单

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'home',
    component: resolve => require(['@/components/layout/home'], resolve),
    meta: {
      title: '遞四方香港'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: resolve => require(['@/components/login'], resolve),
    meta: {
      title: '登錄'
    }
  },
  {
    path: '/bindAccount',
    name: 'bindAccount',
    component: resolve => require(['@/components/login/bindAccount'], resolve),
    meta: {
      title: '4PX賬號登錄驗證'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: resolve => require(['@/components/register'], resolve),
    meta: {
      title: '註冊'
    }
  },
  {
    path: '/bindRegister',
    name: 'bindRegister',
    component: bindRegister,
    meta: {
      title: '註冊並綁定'
    }
  },
  {
    path: '/registrationSuccess',
    name: 'registrationSuccess',
    component: registrationSuccess,
    meta: {
      title: '註冊成功'
    }
  },
  {
    path: 'layout',
    name: 'layout',
    component: layout,
    children: [{
      path: '/account/shipments',
      name: 'shipments',
      component: resolve => require(['@/components/shipments'], resolve),
      meta: {
        title: '新增包裹',
        keepAlive: true
      }
    },
    {
      path: '/account/merge',
      name: 'merge',
      component: merge,
      meta: {
        title: '合箱發貨',
        keepAlive: true
      }
    },
    {
      path: '/account/receiveclaim',
      name: 'receiveclaim',
      component: receiveclaim,
      meta: {
        title: '認領包裹',
        keepAlive: true
      }
    },
    {
      path: '/editOrder',
      name: 'editOrder',
      component: resolve => require(['@/components/shipments/editOrder'], resolve),
      meta: {
        title: '編輯包裹',
        keepAlive: true
      }
    },
    {
      path: '/account/mergeToSingle',
      name: 'mergeToSingle',
      component: mergeToSingle,
      meta: {
        title: '合箱轉單票',
        keepAlive: true
      }
    },
    {
      path: '/addGoods',
      name: 'addGoods',
      component: addGoods,
      meta: {
        title: '添加商品'
      }
    },
    {
      path: '/addArticles',
      name: 'addArticles',
      component: addArticles,
      meta: {
        title: '添加物品'
      }
    },
    {
      path: '/editGoods',
      name: 'editGoods',
      component: addGoods,
      meta: {
        title: '修改商品'
      }
    },
    {
      path: '/editArticles',
      name: 'editArticles',
      component: addArticles,
      meta: {
        title: '修改物品'
      }
    },
    {
      path: '/account/orders',
      name: 'orders',
      component: orders,
      meta: {
        title: '我的包裹'
      }
    },
    {
      path: '/trial',
      name: 'trial',
      component: trial,
      meta: {
        title: '運費試算'
      }
    },
    {
      path: '/account/issue',
      name: 'issue',
      component: issue,
      meta: {
        title: '異常包裹'
      }
    },
    {
      path: '/account/addresses',
      name: 'addresses',
      component: addresses,
      meta: {
        title: '地址管理'
      }
    },
    {
      path: '/account/addresses/sendEdit',
      name: 'sendEdit',
      component: sendEdit,
      meta: {
        title: '常用派送地址'
      }
    },
    {
      path: '/account/addresses/pickupEdit',
      name: 'pickupEdit',
      component: pickupEdit,
      meta: {
        title: '常用自提點/柜'
      }
    },
    {
      path: '/appointment',
      name: 'appointment',
      component: appointment,
      meta: {
        title: '待預約'
      }
    },
    {
      path: '/appointTime',
      name: 'appointTime',
      component: appointTime,
      meta: {
        title: '預約提貨'
      }
    },
    {
      path: '/appointDetail',
      name: 'appointDetail',
      component: appointDetail,
      meta: {
        title: '預約完成'
      }
    },
    {
      path: '/myAppoint',
      name: 'myAppoint',
      component: myAppoint,
      meta: {
        title: '我的預約'
      }
    },
    {
      path: '/account/warehouses',
      name: 'warehouse',
      component: warehouse,
      meta: {
        title: '海外倉地址'
      }
    },
    {
      path: '/account/balance',
      name: 'balance',
      component: resolve => require(['@/components/balance'], resolve),
      meta: {
        title: '我的余額',
        keepAlive: true
      }
    },
    {
      path: '/account/flowDetail',
      name: 'flowDetail',
      component: resolve => require(['@/components/balance/flowDetail'], resolve),
      meta: {
        title: '交易詳情'
      }
    },
    {
      path: '/account/recharge',
      name: 'recharge',
      component: resolve => require(['@/components/balance/recharge'], resolve),
      meta: {
        title: '余額充值'
      }
    },
    {
      path: '/account/rechargeType',
      name: 'rechargeType',
      component: rechargeType,
      meta: {
        title: '充值金額'
      }
    },
    {
      path: '/account/coupon',
      name: 'coupon',
      component: coupon,
      meta: {
        title: '我的優惠券'
      }
    },
    {
      path: '/account/activateCoupon',
      name: 'activateCoupon',
      component: activateCoupon,
      meta: {
        title: '激活優惠券'
      }
    },
    {
      path: '/account/paymentend',
      name: 'paymentend',
      component: paymentEnd,
      meta: {
        title: '支付结果'
      }
    },
    {
      path: '/selfOrder',
      name: 'selfOrder',
      component: selfOrder,
      meta: {
        title: '用戶自助修改',
        keepAlive: true
      }
    },
    {
      path: '/account/myrebate',
      name: 'myrebate',
      component: myrebate,
      meta: {
        title: '推廣返利'
      }
    },
    {
      path: '/account/myrebateShare',
      name: 'myrebateShare',
      component: myrebateShare,
      meta: {
        title: '推廣返利'
      }
    },
    {
      path: '/tracking',
      name: 'tracking',
      component: tracking,
      meta: {
        title: '軌跡查詢'
      }
    },
    {
      path: '/warehouseList',
      name: 'warehouseList',
      component: warehouseList,
      meta: {
        title: '倉庫列表'
      }
    },
    {
      path: '/warehouseAddress',
      name: 'warehouseAddress',
      component: warehouseAddress,
      meta: {
        title: '倉庫詳情'
      }
    },
    {
      path: '/restrictions/:type?',
      name: 'restrictions',
      component: restrictions,
      meta: {
        title: '違禁品查詢'
      }
    },
    {
      path: '/restrictions/contrabandCategory',
      name: 'contrabandCategory',
      component: contrabandCategory,
      meta: {
        title: '違禁品查詢'
      }
    },
    {
      path: '/restrictions/contrabandDetail',
      name: 'contrabandDetail',
      component: contrabandDetail,
      meta: {
        title: '違禁品查詢詳情'
      }
    },
    {
      path: '/pricing/:type?',
      name: 'pricing',
      component: pricing,
      meta: {
        title: '服務與價格'
      }
    },
    {
      path: '/pickup-centers',
      name: 'pickup-centers',
      component: pickupAddress,
      meta: {
        title: '自提點查詢'
      }
    },
    {
      path: '/account/receivedetail',
      name: 'receivedetail',
      component: receivedetail,
      meta: {
        title: '包裹詳情'
      }
    },
    {
      path: '/account/payment',
      name: 'payment',
      component: resolve => require(['@/components/orders/payment'], resolve),
      meta: {
        title: '確認支付'
      }
    },
    {
      path: '/payPwd',
      name: 'payPwd',
      component: resolve => require(['@/components/personalInfo/payPwd'], resolve),
      meta: {
        title: '設置支付密碼'
      }
    },
    {
      path: '/editPayPwd',
      name: 'editPayPwd',
      component: resolve => require(['@/components/personalInfo/payPwd'], resolve),
      meta: {
        title: '修改支付密碼'
      }
    },
    {
      path: '/tutorial',
      name: 'tutorial',
      component: tutorial,
      meta: {
        title: '新手教程'
      }
    },
    {
      path: '/page/singlePage',
      name: 'page/singlePage',
      component: singlePage,
      meta: {
        title: '活動詳情'
      }
    },
    {
      path: '/news/detail',
      name: 'newsDetail',
      component: singlePage,
      meta: {
        title: '新闻詳情'
      }
    },
    {
      path: '/categories/:type?',
      name: 'categories',
      component: categories,
      meta: {
        title: '活動詳情'
      }
    },
    {
      path: '/news',
      name: 'newsList',
      component: newsList,
      meta: {
        title: '最新消息',
        keepAlive: true
      }
    },
    {
      path: '/news/:type?',
      name: 'news',
      component: news,
      meta: {
        title: '消息詳情'
      }
    },
    {
      path: '/vip',
      name: 'vip',
      component: vip,
      meta: {
        title: '會員特權介紹'
      }
    },
    {
      path: '/contact',
      name: 'contact',
      component: contact,
      meta: {
        title: '聯繫我們'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: about,
      meta: {
        title: '關於我們'
      }
    },
    {
      path: '/terms',
      name: 'terms',
      component: terms,
      meta: {
        title: '用戶條款'
      }
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: privacy,
      meta: {
        title: '隱私政策'
      }
    },
    {
      path: '/faq',
      name: 'faq',
      component: faq,
      meta: {
        title: '常見問題'
      }
    },
    {
      path: '/insurance',
      name: 'insurance',
      component: insurance,
      meta: {
        title: '保險與理賠'
      }
    },
    {
      path: '/pass/setemail',
      name: 'setemail',
      component: resolve => require(['@/components/personalInfo/setemail'], resolve),
      meta: {
        title: '設置郵箱'
      }
    },
    {
      path: '/pass/updateemail',
      name: 'updateemail',
      component: resolve => require(['@/components/personalInfo/updateemail'], resolve),
      meta: {
        title: '修改郵箱'
      }
    },
    {
      path: '/pass/settel',
      name: 'settel',
      component: resolve => require(['@/components/personalInfo/settel'], resolve),
      meta: {
        title: '设置手機'
      }
    },
    {
      path: '/pass/updatetel',
      name: 'updatetel',
      component: resolve => require(['@/components/personalInfo/updatetel'], resolve),
      meta: {
        title: '修改手機'
      }
    },
    {
      path: '/account/card',
      name: 'card',
      component: card,
      meta: {
        title: '我的卡包'
      }
    },
    {
      path: '/card-info',
      name: 'card-info',
      component: cardInfo,
      meta: {
        title: '卡券詳情'
      }
    },
    {
      path: '/card-payment',
      name: 'card-payment',
      component: cardPayment,
      meta: {
        title: '確認支付'
      }
    },
    {
      path: '/pay-success-action',
      name: 'pay-success-action',
      component: paySuccessAction,
      meta: {
        title: '正在跳轉，請稍後……'
      }
    },
    {
      path: '/account',
      name: 'account',
      component: account,
      meta: {
        title: '個人中心'
      }
    },
    {
      path: '/account/returnAdd',
      name: 'returnAdd',
      component: returnAdd,
      meta: {
        keepAlive: true,
        title: '新增退件'
      }
    },
    {
      path: '/account/returnEdit',
      name: 'returnEdit',
      component: returnEdit,
      meta: {
        keepAlive: true,
        title: '編輯退件'
      }
    },
    {
      path: '/account/returns',
      name: 'returns',
      component: returns,
      meta: {
        title: '我的退件'
      }
    },
    {
      path: '/account/returnPickup',
      name: 'returnPickup',
      component: returnPickup,
      meta: {
        title: '攬收門店'
      }
    },
    {
      path: '/account/returnAddress',
      name: 'returnAddress',
      component: returnAddress,
      meta: {
        title: '退件地址'
      }
    },
    {
      path: '/account/returnAddressAdd',
      name: 'returnAddressAdd',
      component: returnAddressAdd,
      meta: {
        title: '新增退件地址'
      }
    },
    {
      path: '/account/returnDetail',
      name: 'returnDetail',
      component: returnDetail,
      meta: {
        title: '退件詳情'
      }
    },
    {
      path: '/account/returnPay',
      name: 'returnPay',
      component: returnPay,
      meta: {
        title: '支付詳情'
      }
    }
    ]
  },
  {
    path: '/account/profile',
    name: 'profile',
    component: resolve => require(['@/components/personalInfo'], resolve),
    meta: {
      title: '我的資料'
    }
  },
  {
    path: '/account/nickName',
    name: 'nickName',
    component: resolve => require(['@/components/personalInfo/nickName'], resolve),
    meta: {
      title: '我的昵稱'
    }
  },
  {
    path: '/certification',
    name: 'certification',
    component: resolve => require(['@/components/personalInfo/certification'], resolve),
    meta: {
      title: '身份認證'
    }
  },
  {
    path: '/register/:type?',
    name: 'userRegistration',
    component: userRegistration,
    meta: {
      title: '橙色活動頁面'
    }
  },
  // {
  //   path: '/register/userRegistrationActivity',
  //   name: 'userRegistrationActivity',
  //   component: registrationActivity,
  //   meta: {
  //     title: '全球到港首單免運費'
  //   }
  // },
  // {
  //   path: '/register/userRegistrationInland',
  //   name: 'userRegistrationInland',
  //   component: registrationInland,
  //   meta: {
  //     title: '大陸到香港集運'
  //   }
  // },
  // {
  //   path: '/register/userRegistrationGlobal',
  //   name: 'userRegistrationGlobal',
  //   component: userRegistrationGlobal,
  //   meta: {
  //     title: '全球到香港集運'
  //   }
  // },
  // {
  //   path: '/register/userRegistrationTicket',
  //   name: 'userRegistrationTicket',
  //   component: registrationActivityShare,
  //   meta: {
  //     title: '一張免運費券等你拎'
  //   }
  // },
  {
    path: '/register/userRegistrationActivity/activityOK',
    name: 'activityOK',
    component: activityOK,
    meta: {
      title: '全球到港首單免運費'
    }
  },
  {
    path: '/register/userRegistrationTicket/shareOK',
    name: 'shareOK',
    component: shareOK,
    meta: {
      title: '一張免運費券等你拎'
    }
  },
  {
    path: '/productList',
    name: 'productList',
    component: productList,
    meta: {
      title: '历史商品数据'
    }
  },
  {
    path: '/group-buy/:type',
    name: 'group-buy',
    component: resolve => require(['@/components/coupon/groupBuy'], resolve),
    meta: {
      title: '團購推薦商品'
    }
  },
  {
    path: '/*',
    component: resolve => require(['@/components/layout/home'], resolve),
    meta: {
      title: '遞四方香港'
    }
  }
  ]
})

/**
 * 路由跳转之前拦截包含如下内容：
 * 退件新增编辑title区分；
 * 非首页调用：SEO三要素接口、字典数据、基础用户信息；
 * 第三方账号绑定。
 */
router.beforeEach((to, from, next) => {
  let path = to.path === '/' ? 'index' : to.path.substr(1)
  // 退件中，新增和编辑共用一个页面，通过type来区分是新增还是编辑，设置相应的title
  if (to.name === 'returnAddressAdd' && to.query.editAdd === 'edit') {
    to.meta.title = '編輯退件地址'
  }
  if (to.name !== 'home') {
    // 获取SEO三要素接口
    getSeo({
      url: path
    }).then(res => {
      if (res.code === '0' && res.data) {
        document.title = res.data.title
        document.querySelector('meta[name="keywords"]').setAttribute('content', res.data.keywords)
        document.querySelector('meta[name="description"]').setAttribute('content', res.data.description)
      }
    })
    // 获取字典数据，如果缓存中有字典，则不需要请求接口
    if (!sessionStorage.getItem('dictData')) {
      dictionary().then(res => {
        if (res.code === '0') {
          Store.commit('SET_DICTDATA', res.data.zh_tw)
        }
      })
    }
    // 判断是否存在基础用户信息
    let memberCode = Store.state.userBaseInfo && Store.state.userBaseInfo.memberCode
    if (!memberCode) {
      getUserBasicInfo().then(res => {
        if (res.code === '0') {
          Store.commit('SET_USER_BASE_INFO', res.data)
        }
      })
    }
  }
  // 如果当前页面是绑定账号，分为google登录和facebook登录
  if (to.name === 'bindAccount') {
    let openid = window.encodeURIComponent(to.query.openId)
    if (!openid || openid === 'undefined') {
      Vue.$vux.toast.text('未能獲取授權，請重新嘗試')
      next('login')
      return
    }
    if (localStorage.getItem('thirdLoginType') === 'google') { // google 登录情况
      if (to.query.flag === 'google') {
        next()
      } else {
        getGoogleOpenId(openid).then(res => {
          if (res.code === 1 || res.code === '1') { // 已绑定，直接跳转到cas，后台会拦截跳转到首页
            window.location.href = window.location.origin + '/cas?' + res.data
          } else {
            next({
              name: 'bindAccount',
              query: {
                openId: res.data,
                flag: 'google'
              }
            })
          }
        })
      }
    }
    if (localStorage.getItem('thirdLoginType') === 'facebook') { // facebook登录情况
      if (to.query.flag === 'facebook') {
        next()
      } else {
        getFacebookOpenId(openid).then(res => {
          if (res.code === 1 || res.code === '1') { // 已绑定，直接跳转到cas，后台会拦截跳转到首页
            window.location.href = window.location.origin + '/cas?' + res.data
          } else {
            next({
              name: 'bindAccount',
              query: {
                openId: res.data,
                flag: 'facebook'
              }
            })
          }
        })
      }
    }
  } else {
    next()
  }
})

router.afterEach(function (to) {
  // GA统计
  /* eslint-disable no-undef */
  try {
    window.ga('send', 'pageview', to.fullPath)
  } catch (error) {
    console.log(error)
  }
})

export default router
