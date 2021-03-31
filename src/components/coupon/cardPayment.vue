<!-- 卡券支付 -->
<template>
  <div class='mainland'>
    <group label-width="1.8rem"
      class="first-cell"
      label-margin-right="0.3rem"
      label-align="right">
      <cell title="卡項名稱"
        :value="cardDetail.name"
        value-align="left"></cell>
      <cell title="卡項代碼"
        :value="cardDetail.couponCode"
        value-align="left"></cell>
      <cell title="金額"
        value-align="left">
        {{GLOBAL.fixedTwo(cardDetail.price)}} {{cardDetail.currencyCode}}
      </cell>
      <cell title="次數"
        v-if="cardDetail.moneyDeductionLimit"
        value-align="left">
        {{cardDetail.amount}}次
      </cell>
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
          <h3>{{item.payName}}</h3>
          <p>当前余额: <span class="money">{{ myBalance }}元</span>
            <!-- <span class="recharge" onclick="gotoRecharge">去充值</span> -->
          </p>
        </div>
        <div class="desc"
          v-else>
          <h3>{{item.payName}}</h3>
        </div>
        <i :class="['iconfont', item.isCheck ? 'icon-rad-on' : 'icon-rad-off']"></i>
      </div>
    </group>

    <footer class="footer">
      <div class="col2">合計：<span>{{GLOBAL.fixedTwo(cardDetail.price)}}{{cardDetail.currencyCode || 'HKD'}}</span></div>
      <!-- 未锁定的订单，取消支付隐藏；锁定的订单的支付方式如果在移动端不支持，则立即支付隐藏  -->
      <div class="col4">
        <button @click="handlerPay">立即支付</button>
      </div>
    </footer>

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

    <!-- 购买成功以后，由支付平台跳转回，显示该提示 -->
    <div v-transfer-dom>
      <confirm v-model="paySuccessConfirm"
        title="購買成功"
        cancel-text="查看詳情"
        confirm-text="再次購買"
        @on-cancel="handlerDetail"
        @on-confirm="handlerBuy"
        class="pay-success-confirm">
        <p style="text-align:center;">您可前往個人中心，“我的卡包”中查看详情</p>
      </confirm>
    </div>

    <!-- 如果调起支付平台失败，显示该提示 -->
    <div v-transfer-dom>
      <confirm v-model="payFailConfirm"
        title="支付失敗"
        confirm-text="再次購買"
        :show-cancel-button="false"
        @on-confirm="handlerBuy">
        <p style="text-align:center;">請再次提交購買</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { Cell, Group, Actionsheet, Popup, Checklist, Confirm } from 'vux'
import { getPayChannels, queryTotal, queryOpenBalancePayInfo } from '@/api/myBalance'
import { submitPay, submitBalancePay } from '@/api/myPackage'
import { cardInfo } from '@/api/myCoupon'
import { getApiToken } from '@/api/token'
import Keyboard from '@/common/keyboard'
let CryptoJS = require('cryp-to-js').default

const payIconMap = {
  payment_asia: 'icon-pay-zfb',
  balancepay: 'icon-pay-yue',
  octopus_mobile: 'icon-pay-octopus',
  swiftpass_alipay: 'icon-pay-zfb'
}
export default {
  components: {
    Cell,
    Group,
    Actionsheet,
    Popup,
    Checklist,
    Confirm,
    Keyboard
  },
  data () {
    return {
      obj: {}, // 支付对象
      cardDetail: {}, // 卡详情
      PAYMETHOD: null, // 所有支付渠道
      payMethod: '', // 当前选择的支付
      myBalance: 0, // 当前余额
      isOpenPayPassword: 0,
      setPasswordDialog: false,
      submitBalancePayConfirm: false, // 支付成功弹窗提示
      keyboardShow: false, // 余额支付输入密码
      paySuccessConfirm: false, // 购买成功弹窗
      payFailConfirm: false // 購買失敗
    }
  },
  created () {
    // 處理上次支付成功提示信息
    const {isSuccess, couponCode} = this.$route.query || {}
    if (isSuccess) {
      this.paySuccessConfirm = true
      const query = {
        ...this.$route.query
      }
      delete query.isSuccess
      this.$router.replace({
        ...this.$route,
        query
      })
    }
    this.couponCode = couponCode
    // 通过卡券code获取卡券详情
    this.getCardInfo()
    // 获取支付渠道
    this.getPayChannels()
    // 获取当前余额
    this.getMoney()
    // 设置请求token
    this.getQequestToken()
    // 设置秘钥
    this.getKey(16)
    //  查询是否开通支付
    this.queryOpenBalancePayInfo()
  },
  methods: {
    // 通过卡券code获取卡券详情
    getCardInfo () {
      cardInfo(this.couponCode).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.cardDetail = res.data
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
      })
    },
    // 选择支付方式让其选中，并记录下来
    selectPayMethod (item) {
      this.PAYMETHOD.forEach(val => {
        if (val.payCode === item.payCode) {
          val.isCheck = true
        } else {
          val.isCheck = false
        }
      })
      this.payMethod = item
    },
    // 获取当前余额
    getMoney () {
      queryTotal().then(res => {
        if (res.code === this.GLOBAL.code) {
          this.myBalance = res.data
        }
      })
    },
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
          this.isOpenPayPassword = res.data.isOpenPayPassword ? res.data.isOpenPayPassword : 0
        }
      })
    },
    // 立即支付
    handlerPay () {
      if (!Object.keys(this.payMethod).length) {
        this.$vux.toast.text('請選擇支付方式')
        return
      }
      this.obj.payCode = this.payMethod.payCode
      // 余额支付弹出键盘
      if (this.obj.payCode === 'balancepay') {
        if (this.myBalance < this.cardDetail.price) {
          this.$vux.toast.text('餘額不足，請充值')
        }
        // 判断是否开通支付密码
        if (!this.isOpenPayPassword) {
          this.setPasswordDialog = true
        }
        this.keyboardShow = true
        return
      }
      this.payFn()
    },
    payFn () {
      this.obj = {
        cardCouponCode: this.cardDetail.couponCode,
        feeType: 60, // 卡券费用
        payAmount: this.cardDetail.price,
        number: 1,
        payCode: this.payMethod.payCode,
        payCurrency: this.cardDetail.currencyCode || 'HKD'
      }
      submitPay(this.obj).then(res => {
        if (res.code === this.GLOBAL.code) {
          // eslint-disable-next-line standard/object-curly-even-spacing
          window.localStorage.setItem('card-payment', JSON.stringify({...this.$route, matched: undefined, fullPath: undefined }))// 保存當前路由信息，用以支付成功後跳回
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
      }())
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
      par.key = this.secretKey
      par.password = psd
      par.cardCouponCode = this.cardDetail.couponCode
      par.feeType = 60
      par.number = 1
      par.payAmount = this.cardDetail.price
      par.payCurrency = this.cardDetail.currencyCode || 'HKD'
      submitBalancePay(par).then(res => {
        if (res.code === '0') {
          this.removeQequestToken() // 删除token
          // 发送电子商务数据至谷歌统计
          this._sendDataToGoogle(this.obj.fpxOrderId)
          this.keyboardShow = false
          this.$refs.keyboard.clearPasswordHandle()
          // this.submitBalancePayConfirm = true
          this.paySuccessConfirm = true
        } else {
          this.getQequestToken()
          this.$refs.keyboard.clearPasswordHandle()
          this.$vux.toast.text(res.message)
        }
      })
    },
    // 设置支付密码
    setPasswordConfirm () {
      this.$router.push({ name: 'payPwd' })
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
      var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
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
              'id': payInfo.payOrderNo,
              'affiliation': '4px-hk-m',
              'revenue': Number(payInfo.totalPrice).toFixed(2),
              'currency': payInfo.currency
            })
            for (let v of res.data.packageGoodsDTOList) {
              ga('ecommerce:addItem', {
                'id': payInfo.payOrderNo,
                'name': orderInfo.warehouseName,
                'sku': fpxOrderId,
                'category': v.categoryName,
                'price': Number(payInfo.totalPrice).toFixed(2),
                'quantity': v.number,
                'currency': v.priceCurrency
              })
            }
            // 发送数据给google分析器
            ga('ecommerce:send')
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    // 立即购买
    handlerBuy () {
      this.$router.push({ name: 'card-info', query: { couponCode: this.couponCode } })
    },
    // 查看详情
    handlerDetail () {
      this.paySuccessConfirm = false
      this.$router.push({ name: 'card' })
    }
  }
}
</script>
<style lang='less' scoped>
  @import "../../assets/less/variable.less";
  .mainland {
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
      .col2 {
        padding-left: 0.3rem;
        width: 40%;
        span {
          color: @error;
          font-size: 0.3rem;
          font-weight: bold;
        }
      }
      .col4 {
        height: 100%;
        width: 28%;
        display: flex;
        font-size: 0;
        button {
          padding: 0.31rem 0;
          width: 100%;
          flex: 1 0 auto;
          background: @primary;
          color: #fff;
          border: none;
        }
      }
    }
  }
  /deep/.pay-success-confirm .weui-dialog__btn_primary {
    display: none !important;
  }
</style>
