<template>
  <div class="mainland">
    <group label-width="1.8rem"
      class="first-cell"
      label-margin-right="0.3rem"
      label-align="right">
      <cell title="4PX運單號"
        :value="packageDTO.fpxOrderId"
        value-align="left"></cell>
      <cell title="倉庫"
        :value="packageDTO.warehouseName"
        value-align="left"></cell>
      <cell title="申報時間"
        :value="packageDTO.fpxCreateTime"
        value-align="left"></cell>
    </group>

    <group label-width="1.8rem"
      label-margin-right="0.3rem"
      label-align="right"
      v-if="packageAddressDTO.userName">
      <cell title="收貨人"
        :value="packageAddressDTO.userName + packageAddressDTO.mobile"
        value-align="left"></cell>
      <cell :title="packageAddressDTO.deliveryType == 0 ? '派送地址' : '自提地址'"
        :value="
          calcSendAddress(
            packageAddressDTO.deliveryType,
            packageAddressDTO.province,
            packageAddressDTO.city,
            packageAddressDTO.address,
            packageAddressDTO.pickUpName
          )
        "
        value-align="left"></cell>
      <cell title="產品服務"
        :value="packageDTO.productCode | filterPD"
        value-align="left"></cell>
    </group>

    <group label-width="1.8rem"
      label-margin-right="0.3rem"
      label-align="right">
      <cell title="末端派送单号"
        :value="packageDTO.terminalDeliveryNo || '暫無'"
        value-align="left"></cell>
      <cell title="末端派送公司"
        :value="packageDTO.terminalDeliveryCo | filterCO"
        value-align="left"></cell>
    </group>

    <group label-width="1.8rem"
      label-margin-right="0.3rem"
      label-align="right">
      <cell title="計費重"
        value-align="left">
        {{ packageDTO.chargeableWeight || "--" }}
        {{ packageDTO.weightUnit | filterPackageUnit }}
      </cell>
      <cell title="申報總價"
        :value="
          GLOBAL.fixedTwo(packageDTO.totalPrice) +
            (packageGoodsDTOList[0] && packageGoodsDTOList[0].priceCurrency)
        "
        value-align="left"></cell>
    </group>

    <!-- 如果是单票 -->
    <div class="accordion"
      v-if="packageVolumeDTO">
      <div class="accordion-tool vux-1px-b"
        @click="packageVolumeDTO.hidden = !packageVolumeDTO.hidden">
        <span>包裹1 ~ 商家物流號：{{ packageDTO.referOrderId }}</span>
        <i :class="[
            'iconfont',
            packageVolumeDTO.hidden ? 'icon-down' : 'icon-up'
          ]"></i>
      </div>
      <div :class="['merge-infos', packageVolumeDTO.hidden ? 'hidden' : '']">
        <div class="thead">
          <div class="th vux-1px-r">名稱</div>
          <div class="th vux-1px-r">價格</div>
          <div class="th">數量</div>
        </div>
        <div class="tr"
          v-for="(good, goodIndex) in packageGoodsDTOList"
          :key="goodIndex">
          <div class="td">{{ good.goodsName }}</div>
          <div class="td">
            {{ GLOBAL.fixedTwo(good.price) }}{{ good.priceCurrency }}
          </div>
          <div class="td">{{ good.number }}</div>
        </div>
      </div>
      <div :class="['merge-infos', packageVolumeDTO.hidden ? 'hidden' : '']">
        <div class="thead">
          <div class="th vux-1px-r">重量</div>
          <div class="th vux-1px-r">體積重</div>
          <div class="th">包裹尺寸</div>
        </div>
        <div class="tr">
          <div class="td ">
            {{ packageVolumeDTO.packageWight
            }}{{ packageVolumeDTO.weightUnit | filterPackageUnit }}
          </div>
          <div class="td">
            {{ packageVolumeDTO.volumeWeight
            }}{{ packageVolumeDTO.weightUnit | filterPackageUnit }}
          </div>
          <div class="td">
            {{
              packageVolumeDTO.volumeLength
                ? packageVolumeDTO.volumeLength +
                  "*" +
                  packageVolumeDTO.volumeWide +
                  "*" +
                  packageVolumeDTO.volumeHeight +
                  packageVolumeDTO.volumeUnit
                : "-"
            }}
          </div>
        </div>
      </div>
    </div>

    <!-- 如果是合箱 -->
    <template v-if="packageVolumeDTOList && packageVolumeDTOList.length">
      <div class="accordion"
        v-for="(pk, index) in packageVolumeDTOList"
        :key="index">
        <div class="accordion-tool vux-1px-b"
          @click="pk.hidden = !pk.hidden">
          <span>包裹{{ index + 1 }} ~ 商家物流號：{{ pk.referOrderId }}</span>
          <i :class="['iconfont', pk.hidden ? 'icon-down' : 'icon-up']"></i>
        </div>
        <div :class="['merge-infos', pk.hidden ? 'hidden' : '']">
          <div class="thead">
            <div class="th vux-1px-r">名稱</div>
            <div class="th vux-1px-r">價格</div>
            <div class="th">數量</div>
          </div>
          <div class="tr"
            v-for="(good, goodIndex) in pk.mergePackageGoodsDTOList"
            :key="goodIndex">
            <div class="td ">{{ good.goodsName }}</div>
            <div class="td">
              {{ GLOBAL.fixedTwo(good.price) }}{{ good.priceCurrency }}
            </div>
            <div class="td">{{ good.number }}</div>
          </div>
        </div>
        <div :class="['merge-infos', pk.hidden ? 'hidden' : '']">
          <div class="thead">
            <div class="th vux-1px-r">重量</div>
            <div class="th vux-1px-r">體積重</div>
            <div class="th">包裹尺寸</div>
          </div>
          <div class="tr">
            <div class="td ">
              {{ pk.packageWight }}{{ pk.weightUnit | filterPackageUnit }}
            </div>
            <div class="td">
              {{ pk.volumeWeight }}{{ pk.weightUnit | filterPackageUnit }}
            </div>
            <div class="td">
              {{ pk.volumeLength || "-" }}*{{ pk.volumeWide || "-" }}*{{
                pk.volumeHeight || "-"
              }}{{ pk.volumeUnit || "-" }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <!-- <card class="merge-card"
      :header="{title: '商品詳情：' + packageGoodsDTOList.length + '件' }">
      <div slot="content"
        class="merge-infos">
        <div class="thead">
          <div class="th vux-1px-r">名稱</div>
          <div class="th vux-1px-r">價格</div>
          <div class="th vux-1px-r">數量</div>
          <div class="th">包裹尺寸</div>
        </div>
        <div class="tr"
          v-for="(good, goodIndex) in packageGoodsDTOList"
          :key="goodIndex">
          <div class="td ">{{good.goodsName}}</div>
          <div class="td">{{GLOBAL.fixedTwo(good.price)}}{{good.priceCurrency}}</div>
          <div class="td">{{good.number}}</div>
          <div class="td">
            {{ calcPackageVolume(goodIndex) }}
          </div>
        </div>
      </div>
    </card> -->

    <!-- 要么选择次卡，要么选择两个活动，要么选择一个活动+一个优惠券，三种情况互斥 -->
    <group title="優惠活動只能抵扣運費"
      label-width="1.8rem">
      <cell title="次卡"
        is-link
        :value="cardText"
        @click.native="handlerCardShow"
        value-align="right"></cell>
      <cell title="優惠活動"
        is-link
        :value="eventText"
        @click.native="handlerEventShow"
        value-align="right"></cell>
      <cell title="優惠券"
        is-link
        :value="coupon.couponName ? coupon.couponName : couponText"
        @click.native="handlerCouponShow"
        value-align="right"></cell>
    </group>

    <group title="费用明细">
      <div class="panel">
        <div class="row small"
          v-for="(item, index) in orderCostDetailDTOList"
          :key="index">
          <div class="col">
            {{ item.feeType | filterFeeType }} {{ item.currency }}
          </div>
          <div class="col">
            <span class="discount"
              v-show="item.disPrice > 0">立減：-{{ GLOBAL.fixedTwo(item.disPrice) }}</span>
            <span class="money">+{{ GLOBAL.fixedTwo(item.price) }}</span>
          </div>
        </div>
        <div class="row border">
          <div class="col"></div>
          <div class="col">
            <span class="youhui"
              v-if="computeDiscount > 0">已優惠：{{ computeDiscount }}</span>
            <span>總額：<span>{{ GLOBAL.fixedTwo(chargesTotal) }}</span></span>
          </div>
        </div>
      </div>
    </group>

    <group title="支付方式">
      <div class="paymethod-row vux-1px-b"
        v-for="(item, index) in PAYMETHOD"
        :key="index"
        @click="selectPayMethod(item)">
        <i :class="item.icon"
          class="iconfont"></i>
        <div class="desc"
          v-if="item.payCode === 'balancepay'">
          <h3>{{ item.payName }}</h3>
          <p>
            当前余额: <span class="money">{{ myBalance }}元</span>
            <!-- <span class="recharge" onclick="gotoRecharge">去充值</span> -->
          </p>
        </div>
        <div class="desc"
          v-else>
          <h3>{{ item.payName }}</h3>
        </div>
        <i :class="['iconfont', item.isCheck ? 'icon-rad-on' : 'icon-rad-off']"></i>
      </div>
    </group>

    <footer class="footer">
      <div class="col2">
        合計：<span>{{ GLOBAL.fixedTwo(calcTotalValue) }}{{ payInfoDTO.currency }}</span>
      </div>
      <!-- 未锁定的订单，取消支付隐藏；锁定的订单的支付方式如果在移动端不支持，则立即支付隐藏  -->
      <template v-if="!isLock">
        <div class="col4">
          <button @click="handlerPay">立即支付</button>
        </div>
      </template>
      <template v-else>
        <div class="col4">
          <button @click="handlerPay"
            v-show="!isCancalPay">立即支付</button>
        </div>
        <div class="col3">
          <button @click.stop="handlerCancelPay"
            class="cancel"
            v-show="!timeShow">
            取消支付
          </button>
          <button class="cancel"
            v-show="timeShow">
            {{ timeCount }}s 后自动取消
          </button>
        </div>
      </template>
    </footer>

    <!-- 次卡列表 -->
    <div v-transfer-dom>
      <popup v-model="cardShow"
        position="bottom"
        max-height="70%"
        width="100%"
        class="coupon-popup">
        <h3>次卡</h3>
        <div class="coupon-wrapper">
          <div class="coupon-row"
            v-for="item in cardList"
            :key="item.cardNo"
            @click="selectCard(item)">
            <div class="col1">{{ calcCardMoney(item) }}</div>
            <div class="col2">
              <h6>
                <span class="type">{{ item.cardType | filterCardType }}</span><span :class="[item.disabled ? 'lineThrough' : '']">{{
                  item.cardName
                }}</span>
              </h6>
              <p>
                {{
                  calcCardValid(
                    item.cardEffectiveStartTime,
                    item.cardEffectiveEndTime
                  )
                }}
              </p>
              <p>
                {{
                  item.moneyDeductionLimit
                    ? `剩餘次數：${item.usableAmount} 次`
                    : "--"
                }}
              </p>
            </div>
            <div class="col3">
              <i :class="[
                  'iconfont',
                  item.isCheck ? 'icon-rad-on' : 'icon-rad-off'
                ]"></i>
            </div>
          </div>
        </div>
      </popup>
    </div>

    <!-- 优惠券列表 -->
    <div v-transfer-dom>
      <popup v-model="couponShow"
        position="bottom"
        max-height="70%"
        width="100%"
        class="coupon-popup">
        <h3>優惠券</h3>
        <div class="coupon-wrapper">
          <div class="coupon-row"
            v-for="item in couponList"
            :key="item.couponNo"
            @click="selectCoupon(item)">
            <div class="col1">
              {{
                item.couponType === "FP"
                  ? "免邮券"
                  : calcCouponMoney(
                      item.couponType,
                      item.amount,
                      item.currencyCode
                    )
              }}
            </div>
            <div class="col2">
              <h6>
                <span class="type">
                  {{ item.costType | filterFeeType }}
                  券
                </span>
                <span :class="[item.disabled ? 'lineThrough' : '']">
                  {{ item.couponName }}
                </span>
              </h6>
              <span v-if="item.optimalFlag === 1"
                class="optimal-flag">
                优
              </span>
              <!-- <p>適用于：'運費' - 減20.00HKD</p> -->
              <p>{{ calcCouponValid(item.dateEffect, item.dateInvalid) }}</p>
            </div>
            <div class="col3">
              <i :class="[
                  'iconfont',
                  item.isCheck ? 'icon-rad-on' : 'icon-rad-off'
                ]"></i>
            </div>
          </div>
        </div>
      </popup>
    </div>

    <!-- 优惠活动列表 -->
    <div v-transfer-dom>
      <popup v-model="eventShow"
        class="event-popup">
        <h3>活動只能用來抵扣運費，且最多只能選擇兩個活動</h3>
        <div class="event-wrapper">
          <div class="event-row"
            v-for="item in eventList"
            :key="item.eventPlanningId"
            @click="selectEvent(item)">
            <div class="col1">
              <i :class="[
                  'iconfont',
                  item.isCheck ? 'icon-check' : 'icon-nocheck'
                ]"></i>
            </div>
            <div :class="['col2', item.disabled ? 'lineThrough' : '']">
              <div class="name">
                {{ item.value }}
                <span v-if="item.optimalFlag === 1"
                  class="optimal-flag">优</span>
              </div>
              <div class="discount">{{ item.discountInfo }}</div>
            </div>
          </div>
        </div>
      </popup>
    </div>

    <!-- 键盘弹框 -->
    <div v-transfer-dom
      class="pay-complete">
      <popup v-model="keyboardShow"
        height="8rem">
        <Keyboard ref="keyboard"
          @close="keyboardClose"
          @backFn="passwordBackFn"></Keyboard>
      </popup>
    </div>

    <!-- 余额支付成功弹窗 -->
    <div v-transfer-dom>
      <confirm v-model="submitBalancePayConfirm"
        :show-cancel-button="false"
        title="溫馨提示"
        @on-confirm="onSubmitBalancePayConfirm">
        <p style="text-align:center;">支付成功</p>
      </confirm>
    </div>

    <!-- 未設置支付密碼提示框 -->
    <div v-transfer-dom>
      <confirm v-model="setPasswordDialog"
        title="溫馨提示"
        @on-confirm="setPasswordConfirm">
        <p style="text-align:center;">您未設置支付密碼，點擊確定前往設置。</p>
      </confirm>
    </div>

    <!-- 在支付之前，如果有可用的优惠券或者可用的优惠活动没有用，则提示用户 -->
    <div v-transfer-dom>
      <confirm v-model="tipDialog"
        title="溫馨提示"
        confirm-text="去使用"
        @on-confirm="setPasswordConfirm">
        <p v-html="tipInfos"></p>
      </confirm>
    </div>
  </div>
</template>

<script>
/**
 * 确认支付注意事项（其中订单分為2种状态：锁定，未锁定；支付方式暂时只支持余额支付）
 * 一、已锁定的订单
 *     如果是已锁定的订单，则优惠活动，优惠券，支付方式都不能修改，如果该订单的支付方式在移动端不支持，则显示取消订单
 * 二、未锁定的订单
 *   a: 优惠活动，优惠券组合情况：最多2种优惠活动或者一种活动+一种优惠券，无论选择优惠活动还是优惠券，都需要调组合接口重新更新优惠活动和优惠券数据
 *   b: 无论第一次先选活动还是优惠券，第二次选择的都不再调组合接口，并且把其他的禁用
 *   c: 优惠活动只能抵扣运费，优惠活动分為三种情况：立减/立折，会员折扣，重量免邮；
 *   d: 优惠活动判断依据：
 *     （eventType='discountOrCut', discountCutType='VO'） ==》 立减
 *     （eventType='discountOrCut', discountCutType='DI'） ==》 立折
 *     （eventType='memberDiscount'） ==》 会员折扣
 *     （eventType='weightFree'） ==》 重量免邮，如果是重量免邮，则需要调重量免邮接口(getWeightFreePrice)入参為：fpxOrderId，reduceWeight，reduceWeightUnit，接口得到试算优惠价钱
 *   e: 优惠券则可以优惠任一项，根据优惠costType费用项字段来判断
 *   f：已优惠 = (运费-立减-免邮)*立折 + (其他费用明细-立减)*立折，如果优惠的价格比实际费用高，则优惠=实际费用
 *   g: 合计 = 总额 - 已优惠  (合计》=0)
 */

/*
  // 目前移动端支持支付方式为四种：
  [{
    payCode: 'payment_asia',
    payName: '香港支付寶支付',
    icon: 'icon-pay-zfb',
    isCheck: false
  },
  {
    payCode: 'balancepay',
    payName: '余額支付',
    icon: 'icon-pay-yue',
    isCheck: false
  }, {
    payCode: 'octopus_mobile',
    payName: '八達通',
    icon: 'icon-pay-octopus',
    isCheck: false
  }, {
    payCode: 'swiftpass_alipay',
    payName: '支付寶支付',
    icon: 'icon-pay-zfb',
    isCheck: false
  }]

  // 现有支付方式对应code
  payCodeMap = [
  { balancepay: '餘額支付' },
  { swiftpass_alipay: '支付宝支付' },
  { payment_asia: '香港支付宝支付' },
  { ipaylinks_master: 'Mastercard支付' },
  { octopus_mobile: '八達通支付' },
  { swiftpass_wechat: '微信支付' },
  { swiftpass_m_wechat: '手机微信支付' },
  { offline: '线下支付' },
  { ipaylinks_visa: 'VISA支付' }
]
*/
import { Cell, Group, Actionsheet, Popup, Checklist, Confirm, Card } from 'vux'
import {
  getPayDetailByFpxOrdeId,
  submitPay,
  getWeightFreePrice,
  getPlanByCondition,
  cancleOrderByFpxOrderId,
  submitBalancePay
} from '@/api/myPackage'
import {
  getEventById,
  getCouponeByCouponNo,
  validCouponAndEvent
} from '@/api/myCoupon'
import { getWH, getPD, getAS, getCO, getWU } from '@/utils/cache'
import {
  queryTotal,
  queryOpenBalancePayInfo,
  getPayChannels
} from '@/api/myBalance'
import { getApiToken } from '@/api/token'
// import { fmtDate } from '@/utils/common'
import Keyboard from '@/common/keyboard'
import minxinCalc from './minxinCalc.js'
let CryptoJS = require('cryp-to-js').default
const payIconMap = {
  payment_asia: 'icon-pay-zfb',
  balancepay: 'icon-pay-yue',
  octopus_mobile: 'icon-pay-octopus',
  swiftpass_alipay: 'icon-pay-zfb',
  payment_asia_wechat: 'icon-weixinzhifu'
}
export default {
  name: 'payDetail',
  data () {
    return {
      isMerge: false, // 判断是否是合箱
      isOpenPayPassword: 0,
      setPasswordDialog: false,
      submitBalancePayConfirm: false, // 支付成功弹窗提示
      keyboardShow: false, // 余额支付输入密码
      isLock: false, //  是否是锁定订单
      isPayFree: false, //  是否抵消支付为 0 ，只能用余额支付
      cardShow: false, // 次卡彈層
      eventShow: false,
      couponShow: false,
      packageDTO: {
        referOrderId: '',
        fpxOrderId: '',
        warehouseCode: '',
        productCode: '',
        packageWight: '',
        weightUnit: '',
        totalPrice: ''
      },
      packageAddressDTO: '',
      packageGoodsDTOList: '',
      packageAddserviceDTOList: '',
      orderCostDetailDTOList: '',
      payInfoDTO: '',
      payMethod: {},
      coupon: '',
      couponList: [], // 优惠券列表
      event: '',
      eventList: [], // 活动列表
      eventSelectList: [],
      cardList: [], // 次卡列表
      cardSelect: '', // 选择的次卡
      chargesTotal: 0,
      myBalance: 0,
      obj: {
        fpxOrderId: '', // 必填
        payCurrency: 'HKD', // 必填
        feeType: '', // 必填
        payAmount: null,
        payCode: '', // 必填两种支付方式 payment_asia：支付宝支付，balancepay：余额支付
        couponNo: null,
        eventPlanningIds: [],
        destinationCountry: ''
      },
      wxObj: {},
      yunfei: 0,
      qitafei: 0,
      yf_less: 0,
      qt_less: 0,
      weightFreeValue: 0,
      calcTotalValue: 0, // 总价
      freeCutValue: 0,
      isCancalPay: false, // 是否取消订单
      PAYMETHOD: null,
      cardText: '', // 選擇的次卡名稱
      eventText: '', // 所有選擇的活動名稱
      secretKey: '',
      couponFeeWeight: 0, // 优惠券免邮的情况
      timer: null, // 定时器
      timeShow: false, // 是否倒计时
      timeCount: '', // 倒计时时间
      couponText: '', // 优惠券文案
      tipDialog: false, // 是否有可用的优惠券或者活动待使用
      packageVolumeDTOList: null, // 合箱包裹材积信息
      packageVolumeDTO: null // 单票包裹材积信息
    }
  },
  created () {
    // 设置请求token
    this.getQequestToken()
    this.obj.fpxOrderId = this.$route.query.fpxOrderId
    // 获取支付渠道，回调中获取支付信息
    this.getPayChannels()
    // 设置秘钥
    this.getKey(16)
    //  查询是否开通支付
    this.queryOpenBalancePayInfo()
  },
  activated () {
    // 设置请求token
    this.getQequestToken()
  },
  mixins: [minxinCalc], // 主要是计算优惠
  methods: {
    // 从后台拿token
    getQequestToken () {
      getApiToken().then(res => {
        if (res.code === this.GLOBAL.code) {
          sessionStorage.setItem('token', res.data)
        }
      })
    },
    // 查询是否开通支付
    queryOpenBalancePayInfo () {
      queryOpenBalancePayInfo().then(res => {
        if (res.code === this.GLOBAL.code) {
          this.isOpenPayPassword = res.data.isOpenPayPassword
            ? res.data.isOpenPayPassword
            : 0
        }
      })
    },
    // 获取支付渠道
    getPayChannels () {
      getPayChannels().then(res => {
        if (res.code === this.GLOBAL.code) {
          for (let v of res.data) {
            v.isCheck = false
            v.icon = payIconMap[v.payCode] || ''
          }
          this.PAYMETHOD = res.data || []
        }
        // 获取支付信息
        this.getPayInfos()
      })
    },
    // 设置支付密码
    setPasswordConfirm () {
      this.$router.push({ name: 'payPwd' })
    },
    // 顯示次卡面板
    handlerCardShow () {
      if (this.isLock) {
        this.cardShow = false
        this.$vux.toast.text('該訂單已鎖定，不能再次修改')
      } else {
        this.cardShow = true
      }
    },
    // 显示活动面板，如果是锁定订单，则不让选择
    handlerEventShow () {
      if (this.isLock) {
        this.eventShow = false
        this.$vux.toast.text('該訂單已鎖定，不能再次修改')
      } else {
        this.eventShow = true
      }
    },
    // 显示优惠券面板，如果是锁定订单，则不让选择
    handlerCouponShow () {
      if (this.isLock) {
        this.couponShow = false
        this.$vux.toast.text('該訂單已鎖定，不能再次修改')
      } else {
        this.couponShow = true
      }
    },
    // 选择次卡
    selectCard (item) {
      // 只要选择了任意的活动或者优惠券
      if (this.eventSelectList.length || this.coupon) {
        this.$vux.toast.text('次卡不可與活動或者優惠券同時使用')
        return
      }
      if (item.isCheck) {
        item.isCheck = false
        this.cardSelect = ''
        this.cardText = '您還有未選擇的次卡'
        this.couponText = '您還有未選擇的優惠券'
        this.eventText = '您還有未選擇的優惠活動'
      } else {
        this.cardList.forEach(val => {
          this.$set(val, 'isCheck', false)
        })
        item.isCheck = true
        this.cardSelect = item
        this.cardText = item.cardName
        this.couponText = '次卡不可與活動或者優惠券同時使用'
        this.eventText = '次卡不可與活動或者優惠券同時使用'
      }
      this.cardShow = false
    },
    // 计算次卡优惠
    calcCardMoney (item) {
      // 卡类型(储值卡/礼品卡：depositCard，折扣卡：discountCard，计次卡：meteringCard，综合卡：synthesizeCard)
      switch (item.cardType) {
        case 'depositCard':
          return `減${item.amount}${item.currencyType}`
        case 'discountCard':
          return `${item.discount * 10}折`
        case 'meteringCard':
          return `减${item.onceMostMoneyDeduction}`
        default:
          return `${item.discount * 10}折`
      }
    },
    // 计算次卡，有效期
    calcCardValid (cardEffectiveStartTime, cardEffectiveEndTime) {
      // let start = fmtDate(cardEffectiveStartTime)
      // let end = fmtDate(cardEffectiveEndTime)
      const start = (cardEffectiveStartTime || '').split(' ')[0]
      const end = (cardEffectiveEndTime || '').split(' ')[0]
      return `${start} 至 ${end}`
    },
    // 獲取優惠券計算是立减*元/*折(VO减，DI:折扣)
    calcCouponMoney (couponType, amount, currencyCode) {
      if (couponType === 'VO') {
        return `減${amount}${currencyCode}`
      } else {
        return `${amount * 10}折`
      }
    },
    // 獲取優惠券之后，計算有效期
    calcCouponValid (dateEffect, dateInvalid) {
      let start = dateEffect.split(' ')[0]
      let end = dateInvalid.split(' ')[0]
      return `${start} 至 ${end}`
    },
    // 选活动，每次選擇活動之后，都要调組合接口更新活動和優惠券，设置哪些不能选择的活动和优惠券
    selectEvent (item) {
      if (this.cardSelect) {
        this.$vux.toast.text('次卡不可與活動或者優惠券同時使用')
        return
      }
      if (item.disabled) {
        // 表明不可用
        this.$vux.toast.text('該活動不可用，不能同時使用減上減，或者折上折')
        return
      }
      if (item.isCheck) {
        // 說明取消
        let arr = []
        this.eventSelectList.forEach((val, index) => {
          val.disabled = false
          if (val.key === item.key) {
            val.isCheck = false
            item.isCheck = false
            this.eventSelectList.splice(index, 1)
          } else {
            arr.push(val.value)
          }
          this.eventText =
            arr.length > 0 ? arr.join(',') : '您還有未選擇的優惠活動'
        })
      } else {
        // 說明選中
        if (this.eventSelectList.length >= 2) {
          this.$vux.toast.text('最多只能選擇2個活動')
          return
        }
        if (this.eventSelectList.length === 0) {
          item.isCheck = true
          this.eventSelectList.push(item)
        } else {
          this.eventSelectList.forEach((val, index) => {
            val.isCheck = true
            item.isCheck = true
            this.eventSelectList.push(item)
          })
        }
      }
      if (this.eventSelectList.length === 2) {
        // 2个活动，设置当前选择的优惠券为空
        this.coupon = ''
      }
      this.randerCouponEvent(item)
    },
    // 優惠券面板選擇優惠券, 記錄下選擇的優惠券
    selectCoupon (item) {
      if (this.cardSelect) {
        this.$vux.toast.text('次卡不可與活動或者優惠券同時使用')
        return
      }
      if (item.disabled) {
        // 表明不可用
        this.$vux.toast.text('該優惠券不可用，不能同時使用減上減，或者折上折')
        return
      }
      if (this.eventSelectList.length > 1) {
        this.$vux.toast.text('只能選擇兩種活動，或者一種活動加優惠券')
        return
      }
      this.couponShow = false
      if (item.isCheck) {
        item.isCheck = false
        this.coupon = ''
      } else {
        this.couponList.forEach(val => {
          this.$set(val, 'isCheck', false)
        })
        item.isCheck = true
        this.coupon = item
        this.obj.couponNo = this.coupon.couponNo
      }
      this.couponText = this.coupon ? '' : '您還有未選擇的優惠券'
      this.randerCouponEvent('')
    },
    // 无论点击活动还是优惠券，都重新更新活动和优惠券列表, selectItem 这里主要用来标记当前选择的活动
    randerCouponEvent (selectItem) {
      /**
       * 不需要调接口情况：
       *   有1个优惠券和1个活动
       *   有2个活动
       *   既没有优惠券，也没有活动
       * 需要调接口情况：
       *   有1个优惠券
       *   有1个活动
       */
      if (
        (this.coupon && this.eventSelectList.length === 1) ||
        this.eventSelectList.length === 2
      ) {
        // 有1个优惠券和1个活动，有2个活动
        let indexs = []
        this.eventSelectList.forEach((val, index) => {
          this.eventList.forEach((item, index) => {
            if (item.key === val.key) {
              indexs.push(index)
            }
          })
        })
        this.eventList.forEach((item, index) => {
          if (indexs.indexOf(index) !== -1) {
            this.$set(item, 'disabled', false)
          } else {
            this.$set(item, 'disabled', true)
            item.isCheck = false
          }
        })
        return
      }
      if (!this.eventSelectList.length && !this.coupon) {
        // 既没有优惠券，也没有活动
        this.eventList.forEach(val => {
          val.disabled = false
        })
        this.couponList.forEach(val => {
          this.$set(val, 'disabled', false)
        })
        return
      }
      if (this.coupon && !this.eventSelectList.length) {
        // 有1个优惠券，则传优惠券NO
        let params = [
          this.obj.fpxOrderId,
          this.obj.payCode,
          '',
          this.coupon.couponNo,
          this.coupon.amount,
          '',
          this.packageDTO.destinationCountry
        ]
        this.updateEventCoupon(params, '')
      }
      if (!this.coupon && this.eventSelectList.length === 1) {
        // 有1个活动，则传活动ID
        setTimeout(() => {
          let weight = ''
          let eventPlanningIds = ''
          if (this.eventSelectList.length) {
            this.eventSelectList.forEach(val => {
              eventPlanningIds += `eventPlanningId=${val.key}&`
              if (val.eventType === 'weightFree') {
                this.getWFreePrice([
                  this.obj.fpxOrderId,
                  val.cutValue,
                  val.weightUnit
                ])
                // weight = this.weightFreeValue // 免邮试算得到的立减金额
                weight = this.yunfei - this.weightFreeValue
              }
            })
          }
          eventPlanningIds = eventPlanningIds.slice(16, -1)
          let params = [
            this.obj.fpxOrderId,
            this.obj.payCode,
            eventPlanningIds,
            '',
            weight,
            '',
            this.packageDTO.destinationCountry
          ]
          this.updateEventCoupon(params, selectItem)
        }, 50)
      }
    },
    // 1个活动或者1个优惠券的情况，更新活动和优惠券数据
    updateEventCoupon (params, selectItem) {
      getPlanByCondition(params).then(res => {
        if (res.code === this.GLOBAL.code) {
          if (res.data.eventList) {
            let indexs = []
            res.data.eventList.forEach(val => {
              this.eventList.forEach((item, index) => {
                let flag = selectItem ? item.key === selectItem.key : false
                if (item.key === val.eventPlanningId || flag) {
                  indexs.push(index)
                }
              })
            })
            if (this.eventSelectList.length === 1) {
              // 选中两个活动，取消其中一个，则要保留上一个选中的活动
              this.eventList.forEach((item, index) => {
                if (item.key === this.eventSelectList[0].key) {
                  indexs.push(index)
                }
              })
            }
            indexs = [...new Set(indexs)]
            this.eventList.forEach((item, index) => {
              if (indexs.indexOf(index) !== -1) {
                this.$set(item, 'disabled', false)
              } else {
                this.$set(item, 'disabled', true)
                item.isCheck = false
              }
            })
            // 联动的活动中如果都不可用，则设置提示为空
            if (!this.eventList.some(val => !val.disabled)) {
              this.eventText = ''
            }
          }
          if (res.data.couponList) {
            let indexs = []
            if (this.couponList.length) {
              // 不是第一次加载优惠券
              res.data.couponList.forEach((val, index) => {
                this.couponList.forEach((item, index) => {
                  if (item.couponNo === val.couponNo) {
                    indexs.push(index)
                  }
                })
              })
            } else {
              res.data.couponList.forEach((val, index) => {
                this.couponList.push(val)
              })
            }
            this.couponList.forEach((item, index) => {
              if (indexs.indexOf(index) !== -1) {
                this.$set(item, 'disabled', false)
              } else {
                this.$set(item, 'disabled', true)
              }
            })
            // 联动的优惠券中如果都不可用，则设置提示为空
            if (!this.couponList.some(val => !val.disabled)) {
              this.couponText = ''
            }
          }
        } else {
          this.$vux.toast.hide()
        }
      })
    },
    // 支付方式中余额支付，金额不够时提供充值链接，二期不支持充值
    gotoRecharge () {
      //
    },
    // 选择支付方式让其选中，并记录下来
    selectPayMethod (item) {
      if (this.calcTotalValue <= 0 && item.payCode !== 'balancepay') {
        this.$vux.toast.text('待支付的金額為0元，只允許使用餘額支付')
        return
      }
      if (this.isLock) {
        // 如果是锁定订单，则不让选择
        this.$vux.toast.text('該訂單已鎖定，不能再選擇其他支付方式')
        return
      }
      this.PAYMETHOD.forEach(val => {
        if (val.payCode === item.payCode) {
          val.isCheck = true
        } else {
          val.isCheck = false
        }
      })
      this.payMethod = item
    },
    // 派送地址
    calcSendAddress (deliveryType, province, city, address, pickUpName) {
      if (deliveryType === 0 || !pickUpName) {
        // 派送地址
        return `${province},${city},${address}`
      } else {
        // 自提地址，需要加上自提點pickupName
        return `${province},${city},${address}, 【${pickUpName}】`
      }
    },
    // 出现的支付方式在移动端不能进行支付，可以去pc端支付或者取消订单
    handlerCancelPay () {
      cancleOrderByFpxOrderId(this.obj.fpxOrderId).then(res => {
        if (res.code === this.GLOBAL.code) {
          // 取消成功
          this.$vux.toast.text('取消訂單成功')
          // 如果url中含有type=returns，则返回到我的退件列表中
          if (this.$route.query.type === 'returns') {
            this.$router.replace({ name: 'returns' })
          } else {
            this.$router.replace({ name: 'orders' })
          }
          // this.$router.push({ name: 'orders' })
          // cancleOrderByFpxOrderId(this.obj.fpxOrderId).then(res => {
          //   if (res.code === this.GLOBAL.code) {
          //     this.$vux.toast.text('取消訂單成功')
          //     this.$router.push({ name: 'orders' })
          //   } else {
          //     this.$vux.toast.text(res.message)
          //   }
          // })
        } else {
          // 从res.data开始进行倒计时
          const TIME_COUNT = res.data
          if (!this.timer) {
            this.timeCount = TIME_COUNT
            this.timeShow = true
            this.timer = setInterval(() => {
              if (this.timeCount > 1 && this.timeCount <= TIME_COUNT) {
                this.timeCount--
              } else {
                this.timeShow = false
                clearInterval(this.timer)
                this.timer = null
                // 当timeCount=1s，则调取消支付接口
                cancleOrderByFpxOrderId(this.obj.fpxOrderId).then(res => {
                  if (res.code === this.GLOBAL.code) {
                    this.$vux.toast.text('取消訂單成功')
                    // 如果url中含有type=returns，则返回到我的退件列表中
                    if (this.$route.query.type === 'returns') {
                      this.$router.replace({ name: 'returns' })
                    } else {
                      this.$router.replace({ name: 'orders' })
                    }
                    // this.$router.push({ name: 'orders' })
                  } else {
                    this.$vux.toast.text(res.message)
                  }
                })
              }
            }, 1000)
          }
        }
      })
    },
    // 获取支付详情
    getPayInfos () {
      // 先获取详情相关信息
      let detail = new Promise((resolve, reject) => {
        getPayDetailByFpxOrdeId(this.obj.fpxOrderId).then(res => {
          if (res.code === this.GLOBAL.code) {
            if (Object.keys(res.data).length !== 0) {
              this.packageVolumeDTOList = res.data.packageVolumeDTOList // 合箱
              if (
                this.packageVolumeDTOList &&
                this.packageVolumeDTOList.length
              ) {
                for (let v of this.packageVolumeDTOList) {
                  this.$set(v, 'hidden', true)
                }
              }
              this.packageVolumeDTO = res.data.packageVolumeDTO // 单票
              if (this.packageVolumeDTO) {
                this.$set(this.packageVolumeDTO, 'hidden', true)
              }
              this.packageDTO = res.data.packageDTO
              this.obj.destinationCountry = this.packageDTO.destinationCountry
              this.packageAddressDTO = res.data.packageAddressDTO
              this.packageGoodsDTOList = res.data.packageGoodsDTOList
              this.isMerge = this.packageGoodsDTOList.length > 1 // 判断是否是合箱
              this.packageAddserviceDTOList = res.data.packageAddserviceDTOList
              this.orderCostDetailDTOList = res.data.orderCostDetailDTOList
              this.payInfoDTO = res.data.payInfoDTO
              let code
              if (this.payInfoDTO) {
                code = res.data.payInfoDTO.payCode
                this.isLock = !!code
              }
              for (let item of this.orderCostDetailDTOList) {
                if (item.feeType === 234) {
                  this.yunfei = item.price
                } else {
                  this.qitafei += item.price
                }
                // 遍历明细列表，增加一个disPrice字段，表示优惠值，后面选择活动或者优惠券会相应的计算对应的优惠值
                this.$set(item, 'disPrice', 0)
                // item.disPrice = 0
                this.chargesTotal += item.price
              }
              this.calcTotalValue = this.chargesTotal
              // 查看該訂單支付方式是否在移動端支持，如果支持，則讓其選擇，反之彈出提示
              // 目前根据支付渠道接口返回列表判断是否支持
              let allowPayCodes = ['', undefined] // 移动端支持支付方式列表
              for (let v of this.PAYMETHOD) {
                allowPayCodes.push(v.payCode)
              }
              if (allowPayCodes.indexOf(code) < 0) {
                this.isCancalPay = true
                this.$vux.toast.text(
                  '移動端不支持該支付方式，請取消該訂單或者去PC端進行支付。'
                )
              } else {
                this.PAYMETHOD.forEach(val => {
                  if (val.payCode === code) {
                    val.isCheck = true
                    this.payMethod = val
                  } else {
                    val.isCheck = false
                  }
                })
              }
            }
            resolve()
          }
        })
      })
      // 获取当前账户的余额
      let balance = new Promise(resolve => {
        queryTotal().then(res => {
          if (res.code === this.GLOBAL.code) {
            this.myBalance = res.data
            resolve()
          }
        })
      })
      // 根据detail和balance这两个查询结果，设置支付code，优惠券code
      Promise.all([detail, balance]).then(() => {
        this.getCoupon() // 查优惠券和活动列表
        this.getCouponName() // 根据优惠券id获取优惠券名称
        this.getEventName() // 根据活动id获取活动名称
        this.obj.payCurrency = this.payInfoDTO ? this.payInfoDTO.currency : ''
        this.obj.feeType = 10
        if (this.payInfoDTO && this.payInfoDTO.payCode) {
          this.obj.payCode = this.payInfoDTO.payCode
        }
        this.obj.couponNo =
          this.payInfoDTO && this.payInfoDTO.couponNo
            ? this.payInfoDTO.couponNo
            : ''
      })
    },
    // 获取当前订单所有可用优惠券和活动，次卡
    getCoupon () {
      // 退件的商品不能用优惠来支付
      if (this.packageDTO.productCode === 'TDTY') {
        return
      }
      validCouponAndEvent(
        this.packageDTO.fpxOrderId,
        this.payInfoDTO.payCode,
        this.packageDTO.destinationCountry
      ).then(res => {
        if (res.code === this.GLOBAL.code) {
          if (!res.data) {
            return
          }
          this.couponList = (res.data.couponList || []).map(item => ({
            ...item,
            isCheck: false
          })) // 优惠券
          this.eventList = (res.data.eventList || []).map(item => {
            const data = {
              ...item,
              key: item.eventPlanningId,
              value: item.eventName,
              isCheck: false,
              discountInfo: ''
            }
            if (
              item.eventType === 'discountOrCut' &&
              item.discountCutType === 'VO'
            ) {
              // 立减
              data.discountInfo = `减${this.GLOBAL.fixedTwo(item.cutValue)}HKD`
            } else if (
              item.eventType === 'discountOrCut' &&
              item.discountCutType === 'DI'
            ) {
              // 立折
              data.discountInfo = `${parseFloat(this.GLOBAL.fixedTwo(item.cutValue) *
                10).toFixed(2) * 1}折`
            } else if (item.eventType === 'memberDiscount') {
              // 会员折扣
              data.discountInfo = `${parseFloat(this.GLOBAL.fixedTwo(item.cutValue) *
                10).toFixed(2) * 1}折`
            } else {
              // 重量免邮
              getWeightFreePrice([
                this.obj.fpxOrderId,
                item.cutValue,
                item.weightUnit
              ]).then(res => {
                if (res.code === this.GLOBAL.code) {
                  data.discountInfo = `减${this.GLOBAL.fixedTwo(res.data)}HKD`
                }
              })
            }
            return data
          }) // 活动

          this.cardList = []
          // 如果有支付信息，使用次卡
          if (res.data.cardList && res.data.cardList.length) {
            for (let item of res.data.cardList) {
              item.isCheck = false
              if (item.cardNo === this.payInfoDTO.cardNo) {
                this.cardSelect = item
              }
            }
            this.cardList = res.data.cardList
          }
          // 如果有优惠券和优惠活动，次卡
          if (this.cardList.length) {
            this.cardText = '您還有未選擇的次卡'
          }
          if (this.eventList.length && !this.eventSelectList.length) {
            this.eventText = '您還有未選擇的優惠活動'
          }
          if (this.couponList.length) {
            this.couponText = '您還有未選擇的優惠券'
          }
        }
      })
    },
    calcDiscountInfo (eventType, discountCutType, cutValue, weightUnit) {
      if (eventType === 'discountOrCut' && discountCutType === 'VO') {
        // 立减
        return `立减${this.GLOBAL.fixedTwo(cutValue)}`
      } else if (eventType === 'discountOrCut' && discountCutType === 'DI') {
        // 立折
        return `${this.GLOBAL.fixedTwo(cutValue) * 10}折`
      } else if (eventType === 'memberDiscount') {
        // 会员折扣
        return `${this.GLOBAL.fixedTwo(cutValue) * 10}折`
      } else {
        // 重量免邮
        getWeightFreePrice([this.obj.fpxOrderId, cutValue, weightUnit]).then(
          res => {
            if (res.code === this.GLOBAL.code) {
              // this.weightValue = res.data
              return `立减${this.GLOBAL.fixedTwo(res.data)}`
            }
          }
        )
      }
    },
    // 根据优惠券id获取优惠券名称
    getCouponName () {
      if (this.payInfoDTO && this.payInfoDTO.couponNo) {
        getCouponeByCouponNo(this.payInfoDTO.couponNo).then(res => {
          if (res.code === this.GLOBAL.code) {
            this.coupon = res.data
            this.obj.couponNo = this.coupon.couponNo // 说明此时锁定，设置优惠券ID
          }
        })
        return this.coupon.couponName
      }
      return ''
    },
    // 根据活动id获取活动名称
    getEventName () {
      if (this.payInfoDTO && this.payInfoDTO.eventPayDTOs) {
        let ids = ''
        if (this.payInfoDTO.eventPayDTOs) {
          for (let val of this.payInfoDTO.eventPayDTOs) {
            ids += '&eventPlanningIds=' + val.eventPlanningId
            this.obj.eventPlanningIds.push(val.eventPlanningId) // 说明此时锁定，设置活动ID []集合
          }
        }
        // 锁定时设置活动id集合
        let that = this
        getEventById(ids.substring(1)).then(res => {
          if (res.code === this.GLOBAL.code) {
            let str = ''
            for (let val of res.data) {
              str += '，' + val.eventName
            }
            this.eventText = str.substring(1)
            for (let item of res.data) {
              let event = that.payInfoDTO.eventPayDTOs.find(
                val => val.eventPlanningId === item.eventPlanningId
              )
              let val = {
                key: item.eventPlanningId,
                value: item.eventName,
                cutValue: event.cutValue || item.cutValue,
                discountCutType: item.discountCutType,
                eventType: item.eventType,
                weightUnit: item.weightUnit,
                isCheck: false,
                discountInfo: ''
              }
              this.eventSelectList.push(val)
            }
          }
        })
      }
    },
    // 根据支付code获取支付名称
    getPayName (code) {
      for (let pay of this.payMethods) {
        if (pay.value === code) {
          return pay.label
        }
      }
    },
    // 立即支付
    handlerPay () {
      // 如果锁定了订单，则活动，优惠券，支付方式都不能修改，锁定订单肯定有支付方式，只是看支付方式在移动端支不支持，如果不支持则出现取消订单按钮
      this.obj.payCode = this.payMethod.payCode
      if (!this.isLock) {
        if (!this.obj.payCode) {
          this.$vux.toast.text('請選擇支付方式')
        }
        this.obj.eventPlanningIds = []
        this.eventSelectList.forEach(val => {
          this.obj.eventPlanningIds.push(val.key)
        })
      }
      if (!Object.keys(this.payMethod).length) {
        this.$vux.toast.text('請選擇支付方式')
        return
      }
      let that = this
      if (this.obj.payCode === 'balancepay') {
        // 余额支付弹出键盘
        if (this.myBalance < this.calcTotalValue) {
          this.$vux.toast.text('餘額不足，請充值')
        }
        // 判断是否开通支付密码
        if (!this.isOpenPayPassword) {
          this.setPasswordDialog = true
        }
        // 有未使用的优惠券或者活动，并且余额不为0，非锁定的订单，则提示
        if (this.tipInfos && this.calcTotalValue > 0 && !this.isLock) {
          this.$vux.confirm.show({
            title: '溫馨提示',
            content: this.tipInfos,
            cancelText: '不使用',
            confirmText: '去使用',
            onCancel () {
              that.keyboardShow = true
            },
            onConfirm () { }
          })
        } else {
          that.keyboardShow = true
        }
        return
      }
      // 有未使用的优惠券或者活动，并且余额不为0，非锁定的订单，则提示
      if (this.tipInfos && this.calcTotalValue > 0 && !this.isLock) {
        this.$vux.confirm.show({
          title: '溫馨提示',
          content: this.tipInfos,
          cancelText: '不使用',
          confirmText: '去使用',
          onCancel () {
            that.payFn()
          },
          onConfirm () { }
        })
      } else {
        that.payFn()
      }
    },
    payFn () {
      if (this.cardSelect) {
        // 如果选择了次卡
        this.obj.cardCouponCode = this.cardSelect.cardCode
        this.obj.cardNo = this.cardSelect.cardNo
        this.obj.payAmount = this.calcTotalValue
        this.obj.number = 1
      } else {
        delete this.obj.cardCouponCode
        delete this.obj.cardNo
        delete this.obj.number
      }
      submitPay(this.obj).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.removeQequestToken() // 删除token
          this.wxObj = res.data
          // this.jsWX() 如果我们没有封装微信支付，则调用这个方法；现在TRS封装了支付，所以不调用这里，采用下面的方式
          let url = res.data.actionUrl
          delete res.data.actionUrl
          let form = document.createElement('form')
          form.method = 'post'
          form.action = url
          form.target = '_self'
          document.body.appendChild(form)
          for (let k in res.data) {
            let input = document.createElement('input')
            input.type = 'hidden'
            input.name = k
            input.value = res.data[k]
            form.appendChild(input)
          }
          form.submit()
          document.body.removeChild(form)
        } else {
          this.$vux.toast.text(res.message)
          this.getQequestToken()
        }
      })
    },
    // 删除token
    removeQequestToken () {
      sessionStorage.removeItem('token')
    },
    jsWX () {
      // WeixinJSBridge可能不存在
      if (typeof WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', this.wxPay(), false)
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', this.wxPay())
          document.attachEvent('onWeixinJSBridgeReady', this.wxPay())
        }
      } else {
        this.wxPay()
      }
    },
    wxPay () {
      // eslint-disable-next-line
      WeixinJSBridge.invoke("getBrandWCPayRequest", this.wxObj, res => {
        if (res.err_msg === 'get_brand_wcpay_request:ok') {
          this.$vux.toast.text('支付成功')
          this.$router.push({ name: 'myPackage' })
        } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
          this.$vux.toast.text('取消支付')
        } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
          this.$vux.toast.text('支付失败')
        }
      })
    },
    // 试算免邮
    getWFreePrice (arr, callback) {
      getWeightFreePrice(arr).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.weightFreeValue = res.data
          callback && callback()
        }
      })
    },
    // 加密 @param {String} data 明文,key 秘钥
    encryptedAES (data, key, iv) {
      CryptoJS.mode.ECB = (function () {
        var ECB = CryptoJS.lib.BlockCipherMode.extend()
        ECB.Encryptor = ECB.extend({
          processBlock: function (words, offset) {
            this._cipher.encryptBlock(words, offset)
          }
        })
        ECB.Decryptor = ECB.extend({
          processBlock: function (words, offset) {
            this._cipher.decryptBlock(words, offset)
          }
        })
        return ECB
      })()
      let srcs = CryptoJS.enc.Utf8.parse(data)
      let keydata = CryptoJS.enc.Utf8.parse(key)
      let encrypted = CryptoJS.AES.encrypt(srcs, keydata, {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      })
      return encrypted.ciphertext.toString(CryptoJS.enc.Base64)
    },
    // 支付密码弹窗
    passwordBackFn (psd) {
      psd = this.encryptedAES(psd, this.secretKey)
      let par = this.obj
      par.businessNo = this.obj.fpxOrderId
      par.key = this.secretKey
      par.password = psd
      if (this.cardSelect) {
        par.cardCouponCode = this.cardSelect.cardCode
        par.cardNo = this.cardSelect.cardNo
        par.payAmount = this.calcTotalValue
        par.number = 1
      } else {
        delete par.cardCouponCode
        delete par.cardNo
        delete par.number
      }
      submitBalancePay(par).then(res => {
        if (res.code === '0') {
          this.removeQequestToken() // 删除token
          // 发送电子商务数据至谷歌统计
          this._sendDataToGoogle(this.obj.fpxOrderId)
          this.keyboardShow = false
          this.$refs.keyboard.clearPasswordHandle()
          // this.submitBalancePayConfirm = true
          this.$router.push({ path: '/account/paymentend', query: { fpxOrderId: this.obj.fpxOrderId } })
        } else {
          this.getQequestToken()
          this.$refs.keyboard.clearPasswordHandle()
          this.$vux.toast.text(res.message)
        }
      })
    },
    onSubmitBalancePayConfirm () {
      this.$router.back(-1)
    },
    keyboardClose () {
      this.keyboardShow = false
    },
    /**
     * 生成密钥
     * @param n 生成多少位的密钥(默认8位)
     */
    getKey (n) {
      var chars = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z'
      ]
      if (n === null) {
        n = 8
      }
      var res = ''
      for (var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * 35)
        res += chars[id]
      }
      // return res
      this.secretKey = res
    },
    _sendDataToGoogle (fpxOrderId) {
      if (!fpxOrderId) return
      /* eslint-disable no-undef */
      try {
        getPayDetailByFpxOrdeId(fpxOrderId).then(res => {
          if (res.code === this.GLOBAL.code) {
            // 组装数据
            let payInfo = res.data.payInfoDTO
            let orderInfo = res.data.packageDTO
            ga('ecommerce:addTransaction', {
              id: payInfo.payOrderNo,
              affiliation: '4px-hk-m',
              revenue: Number(payInfo.totalPrice).toFixed(2),
              currency: payInfo.currency
            })
            for (let v of res.data.packageGoodsDTOList) {
              ga('ecommerce:addItem', {
                id: payInfo.payOrderNo,
                name: orderInfo.warehouseName,
                sku: fpxOrderId,
                category: v.categoryName,
                price: Number(payInfo.totalPrice).toFixed(2),
                quantity: v.number,
                currency: v.priceCurrency
              })
            }
            // 发送数据给google分析器
            ga('ecommerce:send')
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  },
  filters: {
    // 次卡类型 卡类型(储值卡/礼品卡：depositCard，折扣卡：discountCard，计次卡：meteringCard，综合卡：synthesizeCard)
    filterCardType (type) {
      let obj = {
        depositCard: '储值卡/礼品卡',
        discountCard: '折扣卡',
        meteringCard: '计次卡',
        synthesizeCard: '综合卡'
      }
      return obj[type]
    },
    // 费用类型
    filterFeeType (val) {
      const as = getAS()
      return as.hasOwnProperty(val) ? as[val] : '暫無'
    },
    // 根据仓库id获取仓库名称
    filterWH (val) {
      const wh = getWH()
      return wh.hasOwnProperty(val) ? wh[val] : '暫無'
    },
    // 根据产品id获取产品名称
    filterPD (val) {
      const pd = getPD()
      return pd.hasOwnProperty(val) ? pd[val] : '暫無'
    },
    // 末端派送公司
    filterCO (val) {
      const co = getCO()
      if (!co || !val) {
        return ''
      }
      return co.hasOwnProperty(val) ? co[val] : '暫無'
    },
    // 包裹重量
    filterPackageWight (val) {
      return val === undefined ? '' : val
    },
    // 包裹重量单位
    filterPackageUnit (val) {
      return getWU()[val] || ''
    }
  },
  computed: {
    // couponText () {
    //   if (this.coupon) {
    //     return this.coupon.couponName
    //   } else {
    //     return this.couponList.length > 0 ? '可使用' + this.couponList.length + '张優惠券' : '無可用優惠券'
    //   }
    // },
    // 已优惠
    computeDiscount () {
      if (this.calcTotalValue === 0) {
        return 0
      }
      return this.GLOBAL.fixedTwo(this.chargesTotal - this.calcTotalValue)
    },
    tipInfos () {
      // 次卡未使用情况，1: 卡，优惠券，活动选择
      // 次卡使用
      if (
        !this.cardSelect &&
        this.couponText &&
        this.eventText === '您還有未選擇的優惠活動'
      ) {
        return '您還有次卡，優惠活動以及優惠券未使用'
      }
      if (
        !this.cardSelect &&
        !this.couponText &&
        this.eventText === '您還有未選擇的優惠活動'
      ) {
        return '您還有優惠活動未使用'
      }
      if (
        !this.cardSelect &&
        this.couponText &&
        this.eventText !== '您還有未選擇的優惠活動'
      ) {
        return '您還有優惠券未使用'
      }
      return ''
      // if (this.couponText && this.eventText === '您還有未選擇的優惠活動') {
      //   return '您還有優惠活動以及優惠券未使用'
      // }
      // if (!this.couponText && this.eventText === '您還有未選擇的優惠活動') {
      //   return '您還有優惠活動未使用'
      // }
      // if (this.couponText && this.eventText !== '您還有未選擇的優惠活動') {
      //   return '您還有優惠券未使用'
      // }
      // return ''
    }
  },
  watch: {
    // 选中的活动集合
    eventSelectList (val) {
      setTimeout(() => {
        if (!val.length && !this.coupon.couponNo) {
          this.calcTotalValue = this.chargesTotal
          for (let item of this.orderCostDetailDTOList) {
            item.disPrice = 0
          }
          return
        }
        let arr = []
        val.forEach(val => {
          arr.push(val.value)
        })
        this.eventText = arr.join(',')
        this.cardText = '次卡不可與活動或者優惠券同時使用'
        this.calcTotal() // 选择活动，触发计算
      }, 200)
    },
    // 选中的券
    coupon (val, old) {
      if (val.couponNo === old.couponNo) {
        // 如果两次没变化，则不重新计算
        return
      }
      if (!val.couponNo && !this.eventSelectList.length) {
        this.calcTotalValue = this.chargesTotal
        for (let item of this.orderCostDetailDTOList) {
          item.disPrice = 0
        }
        return
      }
      this.cardText = '次卡不可與活動或者優惠券同時使用'
      this.calcTotal() // 选择优惠券，触发计算
    },
    // 选中的次卡
    cardSelect (val, old) {
      if (val && this.isLock) {
        this.cardText = val.cardName
      }
      if (val.cardCode === old.cardCode) {
        return
      }
      if (!val) {
        this.calcTotalValue = this.chargesTotal
        for (let item of this.orderCostDetailDTOList) {
          item.disPrice = 0
        }
      }
      this.calcTotal() // 选择次卡，触发计算
    },
    // 实际支付
    calcTotalValue (val, oldVal) {
      setTimeout(() => {
        console.log(8765432, val, oldVal, this.calcTotalValue)
        if (this.calcTotalValue <= 0) {
          // 如果计算出来的待支付为0，之前选择的是非余额支付，则让其取消，并给出提示，只能选用余额支付
          for (let v of this.PAYMETHOD) {
            if (v.payCode !== 'balancepay' && v.isCheck) {
              v.isCheck = false
              this.$vux.toast.text('待支付的金額為0元，只允許使用餘額支付')
            }
          }
          this.obj.payCode = 'balancepay'
          this.payInfoDTO.payCode = 'balancepay'
          this.payInfoDTO.payName = '余额支付'
          //  支付为 0 时候，必须为余额支付
          this.isPayFree = true
        } else {
          this.isPayFree = false
          this.obj.payCode = this.payMethod.payCode
          this.payInfoDTO.payCode = this.payMethod.payCode
          this.payInfoDTO.payName = this.payMethod.payName
        }
      }, 500)
    }
  },
  components: {
    Cell,
    Group,
    Actionsheet,
    Popup,
    Checklist,
    Keyboard,
    Confirm,
    Card
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .mainland {
    padding-bottom: 1.2rem;
    .paymethod-row {
      display: flex;
      padding: 0.06rem 0.24rem !important;
      align-items: center;
      i:first-child {
        font-size: 0.8rem;
        padding-right: 0.12rem;
        &.icon-pay-zfb {
          color: #00a1e9;
        }
        &.icon-pay-yue {
          color: #c40604;
        }
        &.icon-pay-octopus {
          color: #fba42b;
        }
        &.icon-weixinzhifu {
          color: rgb(36, 175, 65);
        }
      }
      i:last-child {
        font-size: 0.5rem;
        color: #999;
        &.icon-rad-on {
          color: @primary;
        }
      }
      .desc {
        flex: 1 0 auto;
        h3 {
          font-size: 0.32rem;
        }
        p {
          font-size: 0.24rem;
          color: #666;
          .money {
            color: red;
          }
          .recharge {
            color: @primary;
          }
        }
      }
    }
  }
  .event-popup {
    overflow-y: scroll;
    h3 {
      font-size: 0.32rem;
      padding: 0.2rem;
    }
    .event-wrapper {
      width: 96%;
      margin: 0 auto;
      .event-row {
        font-size: 0.28rem;
        display: flex;
        background-color: #fff;
        margin-bottom: 0.02rem;
        padding: 0.2rem;
        align-items: center;
        .col1 {
          margin-right: 0.16rem;
          i {
            font-size: 0.5rem;
            color: #999;
            &.icon-check {
              color: @primary;
            }
          }
        }
        .col2 {
          font-size: 0.32rem;
          color: #333;
          flex: 1 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          .optimal-flag {
            color: #ffeb00;
            padding: 0 2px;
            background: red;
            border-radius: 2px;
            font-size: 0.8em;
          }
          .discount {
            font-size: 0.28rem;
            color: @primary;
          }
          &.lineThrough {
            text-decoration: line-through;
          }
        }
      }
    }
  }
  .coupon-popup {
    overflow-y: scroll;
    h3 {
      font-size: 0.4rem;
      padding: 0.2rem;
    }
    .coupon-wrapper {
      width: 96%;
      margin: 0 auto;
      .coupon-row {
        font-size: 0.28rem;
        display: flex;
        background-color: #fff;
        margin-bottom: 0.2rem;
        .col1 {
          background-color: #fcaf17;
          color: #fff;
          width: 30%;
          flex: 0.3 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border-left: 3px dashed #f2f2f2;
          font-size: 0.3rem;
          font-weight: bold;
          span {
            font-size: 0.6rem;
          }
        }
        .col2 {
          flex: 0.56 0 auto;
          width: 52%;
          overflow: hidden;
          padding: 0.2rem;
          position: relative;
          h6 {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            span {
              &.type {
                background: #00c32a;
                font-size: 0.24rem;
                padding: 0.06rem 0.1rem;
                border-radius: 10px;
                display: inline-block;
                color: #fff;
                margin-right: 0.1rem;
              }
              &.lineThrough {
                text-decoration: line-through;
              }
            }
          }
          p {
            font-size: 0.28rem;
            color: #999;
            margin: 0.1rem 0;
          }
          .optimal-flag {
            color: #ffeb00;
            padding: 2px 2px;
            background: red;
            border-radius: 2px;
            font-size: 0.8em;
            position: absolute;
            right: 0px;
            top: 9px;
          }
        }
        .col3 {
          display: flex;
          width: 12%;
          flex: 0.1 0 auto;
          align-items: center;
          padding: 0.2rem;
          i {
            font-size: 0.5rem;
            color: #999;
            &.icon-rad-on {
              color: @primary;
            }
          }
        }
      }
    }
  }
  .panel {
    background: #fff;
    margin-bottom: 0.3rem;
    padding: 0.14rem 0;
    .row {
      font-size: 0.28rem;
      display: flex;
      justify-content: space-between;
      padding: 0.06rem 0.3rem;
      color: #666;
      position: relative;
      .col {
        span {
          color: @error;
          &.youhui {
            color: #888;
            font-size: 0.24rem;
            margin-right: 0.2rem;
          }
          &.discount {
            color: #888;
            margin-left: 8px;
          }
          &.money {
            width: 80px;
            display: inline-block;
            text-align: right;
            font-size: 14px;
          }
        }
        p {
          font-size: 0.24rem;
          text-align: right;
          padding: 0.01rem 0;
          span {
            color: @error;
            padding-left: 0.1rem;
          }
        }
      }
      &.border {
        padding-top: 0.16rem;
        margin-top: 0.1rem;
        display: flex;
        &:before {
          content: " ";
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          height: 1px;
          border-top: 1px solid #d9d9d9;
          color: #d9d9d9;
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
          -webkit-transform: scaleY(0.5);
          transform: scaleY(0.5);
        }
      }
      &.small {
        font-size: 0.24rem;
      }
    }
  }
  .footer {
    position: fixed;
    font-size: 0.28rem;
    right: 0;
    bottom: 0;
    left: 0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &::before {
      content: " ";
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 1px;
      border-top: 1px solid #d9d9d9;
      color: #d9d9d9;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    .col1 {
      padding-left: 0.3rem;
      color: #666;
    }
    .col2 {
      padding-left: 0.3rem;
      width: 40%;
      span {
        color: @error;
        font-size: 0.3rem;
        font-weight: bold;
      }
    }
    .col3 {
      height: 100%;
      width: 28%;
      display: flex;
      font-size: 0;
      button {
        padding: 0.33rem 0;
        width: 100%;
        flex: 1 0 auto;
        background: @primary;
        color: #fff;
        border: none;
      }
      .cancel {
        background-color: #333;
      }
    }
    .col4 {
      height: 100%;
      width: 28%;
      display: flex;
      font-size: 0;
      button {
        padding: 0.33rem 0;
        width: 100%;
        flex: 1 0 auto;
        background: @primary;
        color: #fff;
        border: none;
      }
      .cancel {
        background-color: #333;
      }
    }
  }
  .accordion {
    font-size: 0.28rem;
    background: #fff;
    margin: 0.3rem 0;
    .accordion-tool {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 0.3rem;
      span {
      }
      i {
        padding: 0.3rem;
        color: #999;
      }
    }
    .merge-infos {
      margin-bottom: 0.2rem;
      &.hidden {
        display: none;
      }
      .thead {
        display: flex;
        .th {
          flex: 1;
          text-align: center;
          color: #999;
          font-size: 0.26rem;
          margin: 0.16rem 0;
        }
      }
      .tr {
        display: flex;
        .td {
          flex: 1;
          text-align: center;
          color: @primary;
          font-size: 0.26rem;
          margin: 0.16rem 0;
        }
      }
    }
  }
</style>
<style lang="less">
  .weui-actionsheet__cell {
    font-size: 0.28rem !important;
    .myBalance-sm {
      color: @error;
      font-size: 0.24rem;
    }
  }
</style>
