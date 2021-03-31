<template>
  <div class="mainland">
    <group label-width="1.8rem"
      class="first-cell"
      label-margin-right="0.3rem"
      label-align="right">
      <cell title="4PX運單號"
        :value="packageDTO.fpxOrderId"
        value-align="left"></cell>
      <cell title="商家物流號"
        :value="packageDTO.referOrderId"
        value-align="left"></cell>
      <cell title="倉庫"
        :value="packageDTO.warehouseName"
        value-align="left"></cell>
      <cell title="申報時間"
        :value="packageDTO.fpxCreateTime"
        value-align="left"></cell>
    </group>

    <div @click="handleService" class="service-box">
      <img class="service-icon" src="@/assets/image/btn_service_normal2.png" alt="" srcset="">
      聯係客服
    </div>

    <group label-width="1.8rem"
      label-margin-right="0.3rem"
      label-align="right">
      <cell title="包裹狀態"
        :value="statusFlag | filterPS "
        value-align="left"></cell>
      <cell title="原因"
        v-if="exceptionInfoVOS && exceptionInfoVOS.length"
        :value="exceptionInfos"
        value-align="left"></cell>
    </group>

    <group label-width="1.8rem"
      label-margin-right="0.3rem"
      label-align="right"
      v-if="packageAddressDTO.userName">
      <cell title="收貨人"
        :value="packageAddressDTO.userName + packageAddressDTO.mobile"
        value-align="left"></cell>
      <cell :title="packageAddressDTO.deliveryType == 0 ? '派送地址' : '自提地址'" value-align="left">
        <span>
          <span
            v-if="packageAddressDTO.deliveryAddressType"
            style="padding: 0.06rem 0.12rem;background-color: #ccdef8;color: #005adc;border-radius: 0.04rem;display: inline-block;font-size: 0.22rem;margin-bottom: 0.1rem;"
           >{{packageAddressDTO.deliveryAddressType == 1 ? '工商' : '住宅'}}</span>
          {{calcSendAddress(packageAddressDTO.deliveryType, packageAddressDTO.province, packageAddressDTO.city, packageAddressDTO.address, packageAddressDTO.pickUpName)}}</span>
      </cell>
      <cell v-if="packageAddressDTO.postcode"
        title="郵編"
        :value="packageAddressDTO.postcode"
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
      <cell title="商品詳情"
        value="查看商品列表"
        is-link
        value-align="left"
        @click.native="handlerProductDetail"></cell>
      <!-- 合箱，增加重量详情 TODO -->
      <cell title="重量詳情"
        value="查看重量詳情"
        is-link
        v-if="packageVolumeDTOList.length"
        value-align="left"
        @click.native="handlerWeightDetail"></cell>
      <cell title="費用明細"
        v-if="packageAttribute !=4 && orderCostDetailDTOList.length"
        value="查看費用明細"
        is-link
        value-align="left"
        @click.native="handlerCostDetail"></cell>
    </group>

    <!-- packageAttribute=4表示团购单，则隐藏支付信息 -->
    <group label-width="1.8rem"
      label-margin-right="0.3rem"
      label-align="right"
      v-if="packageAttribute != 4 && payInfoDTO.payStatus">
      <cell title="支付狀態"
        :value="payInfoDTO.payStatus | filterPayStatus"
        value-align="left"></cell>
      <cell title="支付方式"
        v-if="payInfoDTO.payStatus >= 30"
        :value="payInfoDTO.payCode | filterPayTypes"
        value-align="left"></cell>
      <cell title="實付"
        v-if="payInfoDTO.payStatus >= 30"
        value-align="left">
        {{payInfoDTO.totalPrice - (payInfoDTO.discountPrice ? payInfoDTO.discountPrice : 0)}}{{payInfoDTO.currency}}
      </cell>
    </group>

    <group label-width="1.8rem"
      label-margin-right="0.3rem"
      label-align="right">
      <cell title="重量"
        value-align="left">
        {{packageDTO.packageWight | filterPackageWight}}
        {{packageDTO.weightUnit | filterPackageUnit}}
      </cell>
      <!-- 如果是单票，则展示包裹尺寸信息 TODO -->
      <cell title="包裹尺寸"
        v-if="!isMerge"
        value-align="left">
        <!-- 100*20*10 CM -->
        {{packageVolumeDTO.volumeLength ? packageVolumeDTO.volumeLength + '*' + packageVolumeDTO.volumeWide + '*' + packageVolumeDTO.volumeHeight +' '+ packageVolumeDTO.volumeUnit : '-'}}
      </cell>
      <cell title="材积重"
        value-align="left">
        {{packageDTO.volumeWeight || '--'}}
        {{packageDTO.weightUnit | filterPackageUnit}}
      </cell>
      <cell title="計費重量"
        value-align="left">
        {{packageDTO.chargeableWeight | filterPackageWight}}
        {{packageDTO.weightUnit | filterPackageUnit}}
      </cell>
      <cell title="運費"
        v-if="packageAttribute != 4"
        :value="calcYunfei"
        value-align="left"></cell>
      <cell title="申報價值"
        :value="packageDTO.totalPrice + ' '+packageDTO.currency"
        value-align="left"></cell>
      <cell title="產品信息"
        :value="packageDTO.productCode | filterProductCode"
        value-align="left"></cell>
      <cell title="增值服務"
        :value="computeServer"
        value-align="left"></cell>
    </group>

    <group label-width="1.8rem"
      v-if="packageDTO.packageAttribute === 1 && packageDTO.packageChildrenDTOList.length > 0"
      title="子包裹信息"
      class="first-cell"
      label-margin-right="0.3rem"
      label-align="right">
      <x-table>
        <thead>
          <tr>
            <th>商家物流號</th>
            <th>重量</th>
            <th>體積</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in packageDTO.packageChildrenDTOList"
            :key="index">
            <td>{{item.referOrderId}}</td>
            <td>{{item.packageWight}}{{item.weightUnit | filterPackageUnit}}</td>
            <td>{{item.volumeLength}} * {{item.volumeWide}} * {{item.volumeHeight}}{{item.volumeUnit}}</td>
          </tr>
        </tbody>
      </x-table>
    </group>

    <footer class="footer-fixed"
      v-if="payInfoDTO.payStatus == 20">
      <button class="btn-ml"
        @click="handlerPay(packageDTO.fpxOrderId)">立即支付</button>
    </footer>

    <!-- 商品详情 -->
    <div v-transfer-dom
      class="detailWrapper">
      <popup v-model="productDetailPopup"
        position="bottom">
        <div>
          <!-- <card class="merge-card"
            :header="{title: '包裹'+ (index+1) + ' ~ 商家物流號：' + item.referOrderId }">
            <div slot="content"
              class="merge-infos">
              <div class="thead">
                <div class="th vux-1px-r">品类</div>
                <div class="th vux-1px-r">名稱</div>
                <div class="th vux-1px-r">數量</div>
                <div class="th vux-1px-r">單價</div>
                <div class="th">總價</div>
              </div>
              <div class="tr">
                <div class="td">{{item.categoryName}}</div>
                <div class="td">{{item.goodsName}}</div>
                <div class="td">{{item.number}}</div>
                <div class="td">{{item.price}}{{item.priceCurrency}}</div>
                <div class="td">{{item.number * item.price}} {{item.priceCurrency}}</div>
              </div>
            </div>
          </card> -->
          <card class="merge-card product"
            :header="{title: '子包裹'}">
            <div slot="content"
              class="merge-infos">
              <div class="thead">
                <div class="th vux-1px-r">品类</div>
                <div class="th vux-1px-r">名稱</div>
                <div class="th vux-1px-r">數量</div>
                <div class="th vux-1px-r">單價</div>
                <div class="th">總價</div>
              </div>
              <div class="tr"
                v-for="(item, index) in packageGoodsDTOList"
                :key="index">
                <div class="td">{{item.categoryName}}</div>
                <div class="td">{{item.goodsName}}</div>
                <div class="td">{{item.number}}</div>
                <div class="td">{{item.price}} {{item.priceCurrency}}</div>
                <div class="td">{{item.number * item.price}} {{item.priceCurrency}}</div>
              </div>
            </div>
          </card>
          <div class="nodata"
            v-if="packageGoodsDTOList.length == 0">暫無明細</div>
        </div>
        <div class="popup-btn">
          <button class="btn-white"
            @click="closeProductPopup">關閉</button>
        </div>
      </popup>
    </div>

    <!-- 重量详情 TODO -->
    <div v-transfer-dom
      class="detailWrapper">
      <popup v-model="weightDetailPopup"
        position="bottom">
        <div v-for="(item, index) in packageVolumeDTOList"
          :key="index">
          <card class="merge-card"
            :header="{title: '包裹'+ (index+1) + ' ~ 商家物流號：' + item.referOrderId }">
            <div slot="content"
              class="merge-infos">
              <div class="thead">
                <div class="th vux-1px-r">重量</div>
                <div class="th vux-1px-r">體積</div>
                <div class="th vux-1px-r">體積重</div>
                <div class="th">計費重</div>
              </div>
              <div class="tr">
                <div class="td ">{{item.packageWight}}{{item.weightUnit | filterPackageUnit}}</div>
                <div class="td">{{item.volumeLength}}*{{item.volumeWide}}*{{item.volumeHeight}}{{item.volumeUnit}}</div>
                <div class="td">{{item.volumeWeight}}{{item.weightUnit | filterPackageUnit}}</div>
                <div class="td">{{item.chargeableWeight}}{{item.weightUnit | filterPackageUnit}}</div>
              </div>
            </div>
          </card>
          <div class="nodata"
            v-if="packageGoodsDTOList.length == 0">暫無明細</div>
        </div>
        <div class="popup-btn">
          <button class="btn-white"
            @click="closeWeightPopup">關閉</button>
        </div>
      </popup>
    </div>

    <!-- 费用明细 -->
    <div v-transfer-dom
      class="detailWrapper">
      <popup v-model="costDetailPopup"
        position="bottom">
        <div class="info">
          <div class="row1"
            v-for="(item, index) in orderCostDetailDTOList"
            :key="index">
            <div class="row1-col1">{{item.feeType | filterFeeType}}</div>
            <div class="row1-col2">{{item.price}} {{item.currency}}</div>
          </div>
          <div class="row1"
            v-if="payInfoDTO.discountPrice">
            <div class="row1-col1">{{cardName}} {{couponName}} {{eventName}}</div>
            <div class="row1-col2">-{{(payInfoDTO.discountPrice ? payInfoDTO.discountPrice : 0)}} {{payInfoDTO.currency}}</div>
          </div>
          <div class="row1">
            <div class="row1-col1">合計</div>
            <div class="row1-col2">{{payInfoDTO.totalPrice - (payInfoDTO.discountPrice ? payInfoDTO.discountPrice : 0)}} {{payInfoDTO.currency}}</div>
          </div>
          <div class="nodata"
            v-if="orderCostDetailDTOList.length == 0">暫無明細</div>
        </div>
        <div class="popup-btn">
          <button class="btn-white"
            @click="closeCostPopup">關閉</button>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import { Group, Cell, Popup, XTable, Card } from 'vux'
import { getTransPackageDetail } from '@/api/myPackage'
import { cardInfo, getCouponeByCouponNo, getEventById } from '@/api/myCoupon'
import { getWH, destinationCountry, getAS, getPS, getWU, getCO, getIS, getPD } from '@/utils/cache'
import { mapGetters } from 'vuex'
const status = [
  { data: 30, name: '待入库' },
  { data: 53, name: '待认领' },
  { data: 20, name: '待支付' },
  { data: 55, name: '待合箱' },
  { data: 0, name: '全部订单' }
]

export default {
  name: 'packageDetail',
  data () {
    return {
      value: 'xx',
      exceptionInfoVOS: [], // 异常原因
      exceptionInfos: '', // 异常原因从字典匹配
      packageDTO: {},
      packageAddressDTO: {},
      packageGoodsDTOList: [],
      packageAddserviceDTOList: [],
      packageVolumeDTO: {}, // 单个包裹尺寸信息
      packageVolumeDTOList: [], // 合箱子包裹信息
      payInfoDTO: {
        payOrderNo: '',
        totalPrice: '',
        payCode: '',
        payName: '',
        payStatus: '',
        payTime: '',
        currency: ''
      },
      orderCostDetailDTOList: [],
      status: status,
      productDetailPopup: false,
      weightDetailPopup: false,
      costDetailPopup: false,
      statusFlag: '',
      cardName: '', // 卡名称
      couponName: '', // 优惠券名称
      eventName: '', // 活动名称
      packageAttribute: '', // 包裹属性
      isMerge: false // 根据后端返回值判断该包裹是否是合箱，如果是合箱，则需要展示重量详情；如果是单票，则需要展示包裹尺寸
    }
  },
  created () {
    this.statusFlag = this.$route.query.statusFlag
    this.packageDetail(this.$route.query.fpxOrderId, this.statusFlag)
  },
  methods: {
    // 在綫客服
    handleService () {
      window.location.href = 'https://4px.s2.udesk.cn/im_client/?web_plugin_id=8071&group_id=10387&language=zh-HK&channel=%E5%AE%98%E7%B6%B2'
    },
    // 派送地址
    calcSendAddress (deliveryType, province, city, address, pickUpName) {
      if (deliveryType === 0) { // 派送地址
        return `${province},${city},${address}`
      } else { // 自提地址，需要加上自提點pickupName
        return `${province},${city},${address}, 【${pickUpName}】`
      }
    },
    // 卡券详情
    getCardInfo () {
      cardInfo(this.payInfoDTO.cardCode).then(res => {
        if (res.code === this.GLOBAL.code && res.data) {
          this.cardName = res.data.name
        }
      })
    },
    // 根据优惠券id获取优惠券名称
    getCouponName () {
      getCouponeByCouponNo(this.payInfoDTO.couponNo).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.couponName = res.data.couponName
        }
      })
    },
    // 根据活动id获取活动名称
    getEventName () {
      let ids = ''
      for (let val of this.payInfoDTO.eventPayDTOs) {
        ids += '&eventPlanningIds=' + val.eventPlanningId
      }
      // 锁定时设置活动id集合
      getEventById(ids.substring(1)).then(res => {
        if (res.code === this.GLOBAL.code) {
          let str = ''
          for (let val of res.data) {
            str += '，' + val.eventName
          }
          this.eventName = str.substring(1)
        }
      })
    },
    // 查看包裹详情
    packageDetail (id, flag) {
      getTransPackageDetail(id, flag).then(res => {
        if (res.code === this.GLOBAL.code) {
          if (res.data.packageDTO) {
            let dictData = this.dictData()
            res.data.packageDTO.warehouseName = dictData.WH[res.data.packageDTO.warehouseCode]
            res.data.packageDTO.productName = dictData.PD[res.data.packageDTO.productCode]
            this.packageDTO = res.data.packageDTO
            this.packageAttribute = this.packageDTO.packageAttribute
          }
          this.isMerge = !!res.data.mergeSonFpxReferOrder // 判断是否是合箱，如果是合箱则后端会返回数据mergeSonFpxReferOrder
          this.exceptionInfoVOS = res.data.exceptionInfoVOS
          if (this.exceptionInfoVOS && this.exceptionInfoVOS.length) {
            let arr = []
            for (let v of this.exceptionInfoVOS) {
              arr.push(getIS()[v.exceptionCode.trim()])
            }
            this.exceptionInfos = arr.join('，')
          }
          if (res.data.packageAddressDTO) {
            this.packageAddressDTO = res.data.packageAddressDTO
          }
          if (res.data.packageGoodsDTOList) {
            this.packageGoodsDTOList = res.data.packageGoodsDTOList
          }
          this.packageVolumeDTO = res.data.packageVolumeDTO || {}
          if (res.data.packageVolumeDTOList) { // 合箱子包裹信息
            this.packageVolumeDTOList = res.data.packageVolumeDTOList
          }
          if (res.data.packageAddserviceDTOList) {
            let flag = false // 是否已有合箱
            for (let v of res.data.packageAddserviceDTOList) {
              if (v.serviceCode !== '265') {
                this.packageAddserviceDTOList.push(v)
              } else if (!flag) {
                this.packageAddserviceDTOList.push(v)
                flag = true
              }
            }
          }
          if (res.data.payInfoDTO) {
            this.payInfoDTO = res.data.payInfoDTO
            // 通过卡券code获取卡券详情
            if (this.payInfoDTO.cardCode) {
              this.getCardInfo()
            }
            // 根据优惠券id获取优惠券名称
            if (this.payInfoDTO.couponNo) {
              this.getCouponName()
            }
            // // 根据活动id获取活动名称
            if (this.payInfoDTO.eventPayDTOs) {
              this.getEventName()
            }
          }
          if (res.data.orderCostDetailDTOList) {
            this.orderCostDetailDTOList = res.data.orderCostDetailDTOList
          }
        }
      })
    },
    // 查看商品详情
    handlerProductDetail () {
      this.productDetailPopup = true
    },
    // 查看重量详情
    handlerWeightDetail () {
      this.weightDetailPopup = true
    },
    // 查看费用明细
    handlerCostDetail () {
      this.costDetailPopup = true
    },
    // 立即支付
    handlerPay (id) {
      this.$router.push({ name: 'payment', query: { fpxOrderId: id } })
    },
    // 关闭商品详情popup
    closeProductPopup () {
      this.productDetailPopup = false
    },
    // 关闭重量详情popup
    closeWeightPopup () {
      this.weightDetailPopup = false
    },
    // 关闭费用明细popup
    closeCostPopup () {
      this.costDetailPopup = false
    },
    // 订单状态
    packageStatus () {
      return getPS()[this.statusFlag]
    },
    ...mapGetters(['dictData'])
  },
  filters: {
    // 起运仓库
    filterWH (val) {
      return getWH()[val]
    },
    // 目的国家
    filterCountry (val) {
      return destinationCountry()[val]
    },
    // 映射支付状态
    filterPayStatus (val) {
      const payStatus = { 10: '待计费', 20: '待支付', 30: '已支付' }
      return payStatus[val]
    },
    // 支付方式
    filterPayTypes (val) {
      const payTypes = { balancepay: '餘額支付', swiftpass_alipay: '支付寶', swiftpass_wechat: '微信' }
      return payTypes[val]
    },
    // 费用类型
    filterFeeType (val) {
      return getAS()[val]
    },
    // 包裹重量
    filterPackageWight (val) {
      return val === undefined ? '' : val
    },
    // 包裹重量单位
    filterPackageUnit (val) {
      return getWU()[val] || ''
    },
    // 末端派送公司
    filterCO (val) {
      const co = getCO()
      if (!co || !val) {
        return ''
      }
      return co.hasOwnProperty(val) ? co[val] : '暫無'
    },
    // 包裹状态
    filterPS (val) {
      return getPS()[val]
    },
    filterProductCode (val) {
      const pd = getPD()
      if (!pd || !val) {
        return ''
      }
      return pd.hasOwnProperty(val) ? pd[val] : '暫無'
    }
  },
  computed: {
    // 计算运费
    calcYunfei () {
      if (this.orderCostDetailDTOList.length > 0) {
        for (let val of this.orderCostDetailDTOList) {
          if (val.feeType === 234 || val.feeType === '234') {
            return val.price + ' ' + val.currency
          }
        }
      }
      return '--'
    },
    // 计算商品重量
    computeWeight () {
      let sum = 0
      for (let pk of this.packageGoodsDTOList) {
        sum += pk.number * pk.weight
      }
      return sum
    },
    // 增值服务
    computeServer () {
      let str = ''
      let AS = this.dictData().AS
      for (let server of this.packageAddserviceDTOList) {
        let name = server.serviceName || AS[server.serviceCode]
        str += name + '，'
      }
      return str.substr(0, str.length - 1)
    }
  },
  components: {
    Group,
    Cell,
    Popup,
    XTable,
    Card
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .mainland {
    padding-bottom: 1.4rem;
    overflow-y: scroll;
  }
  .detailWrapper {
    .merge-card {
      margin-bottom: 0.2rem;
      .merge-infos {
        margin-bottom: 0.2rem;
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
    .merge-card.product {
      .th:nth-child(2),
      .td:nth-child(2) {
        flex-grow: 2;
      }
    }
    .popup-btn {
      padding: 0.2rem 0.3rem;
      font-size: 0;
    }
    .info {
      background-color: #fff;
      font-size: 0.28rem;
      padding: 0.2rem 0.3rem;
      margin-bottom: 0.2rem;
      .nodata {
        height: 0.4rem;
        line-height: 0.4rem;
        text-align: center;
        color: #999;
      }
      .row1,
      .row2 {
        display: flex;
        justify-content: space-between;
        padding: 0.1rem 0;
      }
      .row1 {
        color: #666;
        font-size: 0.32rem;
      }
      .row2 {
        color: @error;
        span {
          color: #999;
          font-size: 0.24rem;
        }
      }
    }
    .package-row {
      display: flex;
      background: #fff;
      .package-key,
      .package-value {
        width: 20%;
        font-size: 0.3rem;
        text-align: center;
        padding: 0.2rem 0;
        border: 1px solid #f2f2f2;
        color: #666;
        &:nth-child(2) {
          width: 40%;
        }
      }
      .package-key {
        color: #333;
      }
    }
  }
  .service-box{
    margin: 1.17647059em 0.3rem 0rem;
    background-color: white;
    border-radius: 0.1rem;
    height: 0.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.28rem;
    .service-icon{
      width: 0.44rem;
      height: 0.44rem;
      margin-right: 0.1rem;
    }
  }
</style>
