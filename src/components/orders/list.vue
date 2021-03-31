<template>
  <Scroll ref="scroll"
    class="scroll"
    :data="items"
    :pullup="pullup"
    @scrollToEnd="scrollToEnd">
    <div class="scroll-item mypackage"
      v-if="listType!==83"
      ref="scrollItem">
      <div class="payTip">溫馨提示：中國大陸集運至中國香港的訂單，每日12:00前支付運費，當天即可出庫。</div>
      <div class="item"
        v-for="item in items"
        :key="item.id">
        <!-- 有大货标识（largeFlag 1大货 0小货），不给用户勾选合箱，只能合箱转单票，并且给出大货的标识 -->
        <div class="signflag-div"
          v-if="item.warehouseSignStatus && listType == 0">倉庫收貨後會在8小時內入庫，請耐心等待。</div>
        <div class="item-row"
          v-if="listType === 55">
          <div class="col1">
            <div class="check-box"
              @click="handleMergeSelect(item, items)"
              v-if="!item.largeFlag">
              <i :class="['iconfont', item._checked ? 'icon-check': 'icon-nocheck']"></i>
              {{item.chargeableWeight}}{{item.weightUnit}}
            </div>
            <div v-if="item.largeFlag">
              <span class="large-tag">大货</span>
              <span class="large-text">
                大貨無法進行合箱，只支持合箱轉單票操作。
              </span>
            </div>
          </div>
          <div class="col1">
            <span class="merge-flag"
              v-show="item.operateType === 'merge'">合</span>
            <span v-show="item.packageAttribute == 1"
              class="more-flag">多</span>
            <span v-show="item.packageAttribute == 4"
              class="group-flag">团</span>
            {{item.createTime}}
          </div>
        </div>
        <div class="item-row">
          <!-- <div class="col1">下單時間：{{item.createTime}}</div> -->
          <div class="col1">
            4PX單號:{{item.fpxOrderId}}
            <span v-show="item.packageAttribute == 11 || item.packageAttribute == 12"
              class="return-flag">退</span>
            <span class="merge-flag"
              v-show="item.operateType === 'merge'">合</span>
          </div>
          <div class="col1">
            <template v-if="listType == 0">
              <span class="merge-flag"
                v-show="item.operateType === 'merge'">合</span>商家物流號:{{item.referOrderId}}
            </template>
            <!-- 合箱布局特殊一点 -->
            <template v-else>
              商家物流號:{{item.referOrderId}}
            </template>

          </div>
        </div>
        <div class="item-row" v-if="item.overdueParts && item.overdueParts > 0" style="color: red;">{{overduepartsTranslate[item.overdueParts]}}</div>
        <!-- <span class="signflag"
          v-if="!item.warehouseSignStatus">(倉庫已簽收)</span> -->

        <!--已出库，待预约，已预约，待支付，和已签收才会返回DD单号-->
        <!-- <div class="item-row">
          <div class="col1">商家物流號：{{item.referOrderId}}
            <span class="merge-flag"
              v-show="item.operateType === 'merge'">合</span>
            <span v-show="item.packageAttribute == 1"
              class="more-flag">多</span>
            <span v-show="item.packageAttribute == 4"
              class="group-flag">团</span>
          </div>
          <div class="col1">DD單號：{{item.terminalDeliveryNo || '--'}}</div>
        </div> -->
        <div class="flow-wrapper"
          v-if="listType != 55">

          <div class="start">
            <p>{{item.warehouseCode | filterWH}}</p>
          </div>
          <!--待入库-->
          <flow class="flow-line"
            v-if="listType == 30">
            <flow-state state="1"
              title="待入庫"
              is-done></flow-state>
            <flow-line></flow-line>
            <!-- <flow-line tip="進行中"></flow-line> -->
            <flow-state state="2"
              title="待出庫">
            </flow-state>
            <flow-line></flow-line>
            <flow-state state="3"
              title="已出庫"></flow-state>
            <flow-line></flow-line>
            <flow-state state="4"
              title="已簽收"></flow-state>

          </flow>

          <!--待认领，待合箱（不显示流程节点），全部订单-->
          <flow class="flow-line"
            v-if="listType != 30 && listType != 0 && listType != 20">
            <flow-state state="1"
              title="待入庫"
              is-done></flow-state>
            <flow-line is-done></flow-line>
            <flow-state state="2"
              title="待出庫"
              is-done>
            </flow-state>
            <flow-line></flow-line>
            <!-- <flow-line tip="進行中"></flow-line> -->
            <flow-state state="3"
              title="已出庫"></flow-state>
            <flow-line></flow-line>
            <flow-state state="4"
              title="已簽收"></flow-state>
          </flow>
          <!--待支付和全部订单流程, 83：待预约，85：已预约都是已出库状态-->
          <flow class="flow-line"
            v-if="listType == 20 || listType == 0">
            <span class="signflag"
              v-if="item.warehouseSignStatus && listType == 0">(倉庫已簽收)</span>
            <template v-if="(item.statusFlag === 83 || item.statusFlag === 85) && (item.packageAttribute != 11 || item.packageAttribute != 12)">
              <flow-state state="1"
                title="待入庫"
                is-done></flow-state>
              <flow-line is-done></flow-line>
              <flow-state state="2"
                title="待出庫"
                is-done>
              </flow-state>
              <flow-line is-done></flow-line>
              <flow-state state="3"
                is-done
                title="已出庫"></flow-state>
              <flow-line></flow-line>
              <!-- <flow-line tip="進行中"></flow-line> -->
              <flow-state state="4"
                title="已簽收"></flow-state>
            </template>

            <!-- 状态为拒收 TODO -->
            <template v-else-if="item.statusFlag === 40 && (item.packageAttribute != 11 || item.packageAttribute != 12)">
              <div class="rejection">
                <i class="iconfont icon-gaojingxinxi"></i><span>仓库拒收</span>
              </div>
            </template>

            <template v-else-if="item.packageAttribute == 11 || item.packageAttribute == 12">
              <flow-state title="待入库"
                is-done></flow-state>
              <flow-line is-done></flow-line>

              <flow-state title="待出库"
                is-done></flow-state>
              <flow-line is-done></flow-line>

              <flow-state title="已退件"
                :is-done="item.statusFlag==95"></flow-state>
              <!-- <flow-line :is-done="item.statusFlag==95"></flow-line> -->
            </template>

            <template v-else
              v-for="(flow, index) in flows">
              <flow-state :state="index+1"
                :title="flow.name"
                :is-done="item.statusFlag >= flow.data"
                :key="flow.data | filterKey"></flow-state>
              <flow-line :is-done="item.statusFlag > flow.data"
                v-if="flows.length !=(index+1)"
                :key="flow.data | filterKey"></flow-line>
            </template>
          </flow>

          <div class="end">
            <p v-if="item.packageAttribute != 11 || item.packageAttribute != 12">{{item.destinationCountry | filterCountry}}</p>
            <p v-else>商家</p>
          </div>
        </div>

        <div class="item-btn">
          <div class="col"
            v-if="item.overdueParts == 4">
            <button class="btn-ml sm "
              @click="handleService">聯係客服</button>
          </div>
          <div class="col"
            v-if="item.statusFlag && (item.statusFlag == 100 || item.overdueParts == 4)">
            <button class="btn-ml sm "
              @click="deletePkg(item.fpxOrderId)">刪除包裹</button>
          </div>

          <div class="col"
            v-if="item.freightPayFlag === 20 && item.statusFlag != 95 && item.statusFlag != 100 && item.overdueParts != 4">
            <button class="btn-ml sm "
              @click="handlerPay(item.fpxOrderId)">去支付</button>
          </div>

          <div class="col"
            v-if="item.freightPayFlag === 20 && item.passMergeTime && item.overdueParts != 4">
            <button class="btn-ml sm "
              @click="handleCancleMerge(item)">取消合箱</button>
          </div>
          <div class="col"
            v-if="item.statusFlag === 30 && item.operateStatus !== 2 && item.workStatus === 'wait' && item.overdueParts != 4">
            <div class="btn-ml sm "
              @click="handleCancle(item.fpxOrderId)">
              {{item.operateStatus === 1 ? '取消中...' : '取消包裹'}}
            </div>
          </div>

          <!-- 待支付页签：(单票自提和合箱的不能编辑) 编辑包裹按钮，如果是合箱的包裹则不能修改转运方式 -->
          <div class="col"
            v-if="listType == 20 && !((item.operateType =='single' && item.deliveryType) || item.operateType == 'merge') && item.warehouseCode == 'CNDGMB' && item.overdueParts != 4">
            <div class="btn-ml sm "
              @click="item.operateStatus === 2 ? '' : handleNopayEdit(item)">
              {{item.operateStatus === 2 ? '編輯中...' : '編輯包裹'}}
            </div>
          </div>

          <!-- 全部页签：编辑包裹按钮，已入库待支付的编辑按钮就跳转到自助操作，待入库的编辑按钮就跳转到正常的编辑页面 -->
          <div class="col"
            v-if="listType == 0 && item.freightPayFlag === 20 && !((item.operateType =='single' && item.deliveryType) || item.operateType == 'merge') && item.warehouseCode == 'CNDGMB' && item.overdueParts != 4">
            <div class="btn-ml sm "
              @click="item.operateStatus === 2 ? '' : handleNopayEdit(item)">
              {{item.operateStatus === 2 ? '編輯中...' : '編輯包裹'}}
            </div>
          </div>
          <div class="col"
            v-if="item.statusFlag === 30 && item.operateStatus !== 1 && item.workStatus === 'wait' && item.overdueParts != 4">
            <div class="btn-ml sm "
              @click="item.operateStatus === 2 ? '' : handleEdit(item.fpxOrderId)">
              {{item.operateStatus === 2 ? '編輯中...' : '編輯包裹'}}
            </div>
          </div>

          <div class="col"
            v-if="item.statusFlag === 53 && item.overdueParts != 4">
            <button class="btn-ml sm"
              @click="handleClaim(item.fpxOrderId, item.isEncrypted, item.referOrderId, item.packageAttribute)">去認領</button>
          </div>
          <div class="col"
            v-if="item.statusFlag == 55 && item.overdueParts != 4">
            <div class="btn-ml sm"
              @click="handleMergeToSingle(item.fpxOrderId, item.packageAttribute)">合箱轉單票</div>
          </div>
          <div class="col"
            v-if="listType !== 55 && item.statusFlag === 55 && item.overdueParts != 4">
            <div class="btn-ml sm"
              @click="handleGoMerge">去合箱</div>
          </div>
          <div class="col"
            v-if="item.statusFlag !== 53">
            <button class="btn-ml sm "
              @click="viewOrder(item.fpxOrderId, item.statusFlag)">包裹詳情</button>
          </div>
          <div class="col"
            v-if="item.statusFlag !== 53">
            <button class="btn-ml sm "
              @click="handleTrack(item.fpxOrderId)">物流軌跡</button>
          </div>
          <div class="col"
            v-if="item.statusFlag === 83 || item.statusFlag === 85">
            <a class="btn-ml sm"
              style="display:block;"
              @click.stop="handleSelfCode(item.fpxOrderId)">自提码</a>
          </div>
        </div>
      </div>
      <div class="nodata"
        v-if="items.length == 0">
        <i class="iconfont icon-nodata"></i>
        <p>{{itemDataInfo}}</p>
      </div>
      <div class="hold"
        v-if="isOver">--- 我也是有底線的 ---</div>
    </div>

    <!-- 自提预约 -->
    <div class="scroll-item"
      v-if="listType===83">
      <appointment-list @handlerAppointData="handlerAppointData"></appointment-list>
    </div>

    <footer class="footer-fixed"
      v-if="listType === 55">
      <div class="weight-detail">
        <span>總重：{{comTotalWeight}}</span>
        <div class="detail-btn"
          @click="freightDetails">運費明細<i class="iconfont icon-down"></i></div>
        <!-- <div class="detail-content"
          v-if="mergeTrialInquiryList.length">
          <div class="row"
            v-for="(val, index) in mergeTrialInquiryList"
            :key="index">
            <div class="col1">{{val.chineseNickname}} | {{val.deliveryType == 1 ? '派送' : '自提'}}</div>
            <div class="col2">{{val.amount ? val.amount : '暫無'}} CNY</div>
          </div>
        </div> -->
      </div>
      <div class="btn-ml"
        @click="handleMerge">合 箱</div>
    </footer>

    <!-- 预约 -->
    <footer class="footer-fixed"
      v-show="appointIndex===0 &&listType === 83">
      <a @click="handlerAppoint"
        :class="['btn-order', selectAppoint.length > 0 ? '' : 'disabled']">預 約</a>
    </footer>

    <!-- 合箱確認彈窗 -->
    <div v-transfer-dom>
      <popup v-model="mergeShow"
        class="content-popup"
        position="bottom"
        height="100%">
        <MergeDetail :mergeList="mergeList"
          :warehouseName="mergeWH"
          :referOrderIds="referOrderIds"
          @close="mergeShow = false"></MergeDetail>
      </popup>
    </div>

    <!-- 查看自提码 -->
    <div v-transfer-dom>
      <alert v-model="showSelfCode"
        title="查看自提码">
        <p class="pickupCode">{{packagePickUpCode}}</p>
      </alert>
    </div>

    <!-- 查看运费明细 -->
    <div v-transfer-dom>
      <popup v-model="isDetail"
        position="bottom"
        max-height="70%">
        <div class="detail-content"
          v-if="mergeTrialInquiryList.length">
          <div class="row vux-1px-b"
            v-for="(val, index) in mergeTrialInquiryList"
            :key="index">
            <div class="col1">{{val.chineseNickname}} | {{val.deliveryType == 1 ? '派送' : '自提'}}</div>
            <div class="col2">{{val.amount ? val.amount +' HKD' : '暫無'}} </div>
          </div>
        </div>
      </popup>
    </div>
  </Scroll>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import { Flow, FlowState, FlowLine, Popup, Alert } from 'vux'
import * as API from '@/api/myPackage'
import { getApplyMergerGoodInfo, setCancelOrder, setCancelMerge, checkMergeTosignl, getMergeTrialInquiry, changeOrderToDelete } from '@/api/order'
// import { getPackageTrackByOrderId } from '@/api/track'
import Scroll from '@/common/scroll/scroll'
import appointmentList from '@/components/appointment'
import minxinCommon from './minxinCommon.js'
import { judgeAppointment, getPackagePickUpCode } from '@/api/appointment'
import MergeDetail from './mergeDetail'
import eventBus from '@/components/shipments/eventBus.js'
// import { getWU } from '@/utils/cache'
// 切换页包裹状态 0 全部包裹 53 待认领 30 待入库 20 待支付 55 待合箱 65 待分箱 80 待出库 83 待预约 90 已出库 100 已签收
// const flows = [{ data: 30, name: '待入庫' }, { data: 80, name: '待出庫' }, { data: 83, name: '已出庫' }, { data: 100, name: '已簽收' }]
const flows = [{ data: 30, name: '待入庫' }, { data: 80, name: '待出庫' }, { data: 90, name: '已出庫' }, { data: 100, name: '已簽收' }]

export default {
  name: 'myPackageList',
  props: {
    listType: {
      type: Number,
      default: 30
    }
  },
  data () {
    return {
      overduepartsTranslate: {
        '1': '即將超過30天免倉儲期，請及時處理',
        '2': '已入庫超45天，超60天視爲放棄包裹，請及時處理',
        '3': '已入庫60天，超60天視爲放棄包裹，請及時處理',
        '4': '已入庫超60天，已視爲放棄包裹'
      },
      comTotalWeight: 0, // 总重
      isDetail: false, // 显示运费明细
      obj: {
        pageNum: 1,
        pageSize: 10,
        packageStatus: this.listType // 0 全部包裹 53 待认领 30 待入库 20 待支付 55 待合箱 65 待分箱 80 待出库 90 已出库 100 已签收
      },
      totalPages: '',
      items: [],
      pullup: true,
      isOver: false,
      flows: flows,
      disabled: false,
      selectAppoint: [],
      appointIndex: 0,
      mergeShow: false,
      mergeList: [],
      mergeWH: '',
      referOrderIds: [],
      checkedList: [], // 合箱已选列表
      showSelfCode: false,
      packagePickUpCode: '', // 自提码
      itemDataInfo: '',
      mergeTrialInquiryList: []
    }
  },
  mounted () {
    this.getData()
  },
  mixins: [minxinCommon],
  methods: {
    // 在綫客服
    handleService () {
      window.location.href = 'https://4px.s2.udesk.cn/im_client/?web_plugin_id=8071&group_id=10387&language=zh-HK&channel=%E5%AE%98%E7%B6%B2'
    },
    // getWU,
    // 小于20分钟才有取消合箱按钮
    isPassMergeTime (val) {
      return Math.floor(parseFloat(val) / 1000 / 60) < 20
    },
    // 獲取從子組件中選擇的包裹列表
    handlerAppointData (selectData, index) {
      this.selectAppoint = selectData
      this.appointIndex = index
    },
    // 点击预约按钮
    handlerAppoint () {
      if (this.selectAppoint.length === 0) {
        this.$vux.toast.text('请选择要预约的包裹')
        return
      }
      if (this.selectAppoint.length === 1) {
        let arr = [this.selectAppoint[0].fpxOrderId]
        this.$router.push({ name: 'appointTime', params: { arr } })
        return
      }
      this.checkAppoint().then(() => {
        let arr = []
        this.selectAppoint.forEach((val) => {
          arr.push(val.fpxOrderId)
        })
        this.$router.push({ name: 'appointTime', params: { arr } })
      })
    },
    checkAppoint () {
      let packageOrderInfoDTOs = []
      this.selectAppoint.forEach(val => {
        let obj = {
          fpxOrderId: val.fpxOrderId,
          phone: val.appointmentInfoDTO.phone,
          pickUpCode: val.appointmentInfoDTO.pudoCode,
          userName: val.appointmentInfoDTO.username
        }
        packageOrderInfoDTOs.push(obj)
      })
      return new Promise((resolve) => {
        judgeAppointment({ packageOrderInfoDTOs: packageOrderInfoDTOs }).then(res => {
          if (res.code !== this.GLOBAL.code) {
            this.$vux.toast.text(res.message)
            return
          }
          resolve()
        })
      })
    },
    getData () {
      if (this.obj.packageStatus === 83) {
        return
      }
      this.itemDataInfo = '正在加載中...'
      API.getPackageList(this.obj).then(res => {
        if (res.code === this.GLOBAL.code) {
          if (!res.result || res.result.length === 0) {
            this.itemDataInfo = '暫無數據哦'
            return
          }
          for (let v of res.result) {
            v._checked = false
          }
          this.totalPages = res.totalPages
          this.items = this.items.concat(res.result)
        }
      })
    },
    scrollToEnd () {
      if (this.obj.pageNum < this.totalPages) {
        this.obj.pageNum++
        this.getData()
      } else {
        this.$refs.scroll.refresh()
      }
      if (this.obj.pageNum === this.totalPages && this.$refs.scrollItem.clientHeight > document.body.clientHeight) {
        this.isOver = true
      }
    },
    /**
     * 包裹认领 isEncrypted：0|1， 如果是1表示是从淘宝下发的单
     * 淘宝预报的，客户可以修改商品，不是淘宝的，有商品的客户只可以修改价格，没有商品的，可以可以新增编辑商品
     */
    handleClaim (fpxOrderId, isEncrypted, referOrderId, packageAttribute) {
      // 包裹认领
      eventBus.$emit('reClaim')
      this.DELETE_ORDER_DATA()
      this.SET_IS_ENCRYPTED(isEncrypted)
      this.SET_REFER_ORDERID(referOrderId)
      this.$router.push({ name: 'receiveclaim', query: { fpxOrderId, packageAttribute } })
    },
    // 用户自助下单
    handleNopayEdit (item) {
      this.$router.push({ name: 'selfOrder', query: { fpxOrderId: item.fpxOrderId, operateType: item.operateType } })
    },
    handleEdit (fpxOrderId) {
      // 包裹編輯
      // this.DELETE_ORDER_DATA() // 打开之后 编辑一单 未提交 连续再次进去编辑同一单 会把商品 地址等数据删掉
      this.$router.push({ name: 'editOrder', query: { fpxOrderId: fpxOrderId } })
    },
    handleGoMerge () {
      this.obj.pageNum = 0
      this.$emit('goMerge')
    },
    handleMergeToSingle (fpxOrderId, packageAttribute) {
      checkMergeTosignl(fpxOrderId).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.$router.push({ name: 'mergeToSingle', query: { fpxOrderId: fpxOrderId, packageAttribute: packageAttribute } })
        } else {
          this.$vux.toast.text(res.message)
        }
      })
    },
    // 选择合箱订单
    handleMergeSelect (item, items) {
      item._checked = !item._checked
      this.checkedList = []
      for (let v of items) {
        if (v._checked) {
          this.checkedList.push(v)
        }
      }
      // item._checked = !item._checked
      // this.checkedList = []
      // for (let v of items) {
      //   if (v._checked) {
      //     if (!this.checkedList.length) {
      //       this.checkedList.push(v)
      //     } else {
      //       for (let i = 0; i < this.checkedList.length; i++) {
      //         if (v.warehouseCode !== this.checkedList[i].warehouseCode) {
      //           item._checked = false
      //           this.$vux.toast.text('要選擇相同起始倉庫訂單進行合箱操作')
      //           return
      //         } else {
      //           this.checkedList.push(v)
      //         }
      //       }
      //     }
      //   }
      // }
    },
    // 运费明细
    freightDetails () {
      this.mergeTrialInquiryList = []
      if (!this.checkedList.length) {
        return
      }
      for (let i = 0, len = this.checkedList.length; i < len; i++) {
        for (let j = 0; j < len; j++) {
          if (this.checkedList[i].warehouseCode !== this.checkedList[j].warehouseCode) {
            this.$vux.toast.text('要選擇相同起始倉庫訂單進行合箱操作')
            return
          }
        }
      }
      this.isDetail = !this.isDetail
      let totalWeight = 0
      let arr = []
      for (let i = 0; i < this.checkedList.length; i++) {
        totalWeight += this.checkedList[i].chargeableWeight
        arr.push(this.checkedList[i].fpxOrderId)
      }
      let obj = {
        'departureCountry': this.checkedList[0].departureCountry,
        'destinationCountry': this.checkedList[0].destinationCountry,
        'warehouseCode': this.checkedList[0].warehouseCode,
        'chargeableWeight': totalWeight,
        'weightUnit': this.checkedList[0].weightUnit,
        'fpxOrderIds': arr
      }
      getMergeTrialInquiry(obj).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.mergeTrialInquiryList = res.data
        }
      })
    },
    handleMerge () {
      if (this.checkedList.length < 2) {
        this.$vux.toast.text('選擇兩個和兩個以上的訂單進行合併操作')
        return
      }
      // 判断是否选择相同的起始仓库
      for (let i = 0, len = this.checkedList.length; i < len; i++) {
        for (let j = 0; j < len; j++) {
          if (this.checkedList[i].warehouseCode !== this.checkedList[j].warehouseCode) {
            this.$vux.toast.text('要選擇相同起始倉庫訂單進行合箱操作')
            return
          }
        }
      }
      if (this.checkedList[0].warehouseCode === 'CNDGMB') { // 如果第一条记录是大陆仓，则设置可以合并20条记录，反之设置5条记录
        if (this.checkedList.length > 20) {
          this.$vux.toast.text('最多只能合併20個包裹')
          return
        }
      } else {
        if (this.checkedList.length > 5) {
          this.$vux.toast.text('最多只能合併5個包裹')
          return
        }
      }
      let arr = []
      let WH = this.dictData().WH
      this.mergeWH = WH[this.checkedList[0].warehouseCode] || ''
      for (let v of this.checkedList) {
        arr.push(v.fpxOrderId)
      }
      this.referOrderIds = arr
      getApplyMergerGoodInfo({ referOrderIds: arr }).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.mergeList = res.data
          this.mergeShow = true
        }
      })
    },
    handleTrack (fpxOrderId) {
      // 查看物流軌跡
      this.$router.push({ name: 'tracking', query: { fpxOrderId: fpxOrderId } })
      // getPackageTrackByOrderId(fpxOrderId).then(res => {
      //   if (res.code === this.GLOBAL.code) {
      //     // this.lastTrack = res.data.lastTrack
      //     // this.trackList = res.data.trackList
      //     // if (this.trackList.length === 0) {
      //     //   this.infos = '无物流信息'
      //     // }
      //   }
      // })
    },
    // 自提码
    handleSelfCode (fpxOrderId) {
      this.showSelfCode = true
      getPackagePickUpCode(fpxOrderId).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.packagePickUpCode = res.message
        } else {
          this.packagePickUpCode = '暂无'
        }
      })
    },
    // 取消合箱
    handleCancleMerge (item) {
      this.$vux.confirm.show({
        title: '操作提示',
        content: '確定取消合箱？',
        onCancel: () => {
          console.log('取消')
        },
        onConfirm: () => {
          let data = {
            fpxOrderId: item.fpxOrderId,
            createTime: item.mergeTime,
            memberCode: (this.$store.state.userBaseInfo && this.$store.state.userBaseInfo.memberCode) || ''
          }
          setCancelMerge(data).then(res => {
            this.$vux.toast.text(res.message)
            if (res.code === this.GLOBAL.code) {
              this.obj.pageNum = 1
              this.items = []
              this.getData()
            }
          })
        }
      })
    },
    // 删除包裹
    deletePkg (fpxOrderId) {
      this.$vux.confirm.show({
        title: '確認刪除包裹？',
        content: '包裹刪除之後無法恢復，請謹慎操作！',
        onCancel: () => {
          console.log('取消')
        },
        onConfirm: () => {
          changeOrderToDelete(fpxOrderId).then(res => {
            if (res.code === this.GLOBAL.code) {
              this.$vux.toast.text('刪除成功')
              this.obj.pageNum = 1
              this.items = []
              this.getData()
            }
          })
        }
      })
    },
    // 取消包裹
    handleCancle (fpxOrderId) {
      this.$vux.confirm.show({
        title: '操作提示',
        content: '確定取消包裹？',
        onCancel: () => {
          console.log('取消')
        },
        onConfirm: () => {
          let data = {
            fpxOrderId: fpxOrderId,
            memberCode: (this.$store.state.userBaseInfo && this.$store.state.userBaseInfo.memberCode) || ''
          }
          setCancelOrder(data).then(res => {
            if (res.code === this.GLOBAL.code) {
              this.$vux.toast.text('取消成功')
              this.obj.pageNum = 1
              this.items = []
              this.getData()
            }
          })
        }
      })
    },
    // 判断是否是中国仓
    isCNpackage (item) {
      let code = item.warehouseCode
      if (!code) return false
      return code.substring(0, 2) === 'CN'
    },
    ...mapMutations([
      'DELETE_ORDER_DATA', 'SET_IS_ENCRYPTED', 'SET_REFER_ORDERID'
    ]),
    ...mapGetters([
      'dictData'
    ])
  },
  watch: {
    checkedList: {
      handler (newV, oldV) {
        let comTotalWeight = 0
        newV.forEach(item => {
          if (item.chargeableWeight) {
            comTotalWeight = parseFloat(comTotalWeight + item.chargeableWeight).toFixed(2) * 1
          }
        })
        this.comTotalWeight = comTotalWeight ? comTotalWeight + newV[0].weightUnit : comTotalWeight
      },
      immediate: true
    }
  },
  components: {
    Flow,
    FlowState,
    FlowLine,
    Scroll,
    appointmentList,
    MergeDetail,
    Popup,
    Alert
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  * {
    touch-action: pan-y;
  }
  .scroll-item {
    padding: 0.85rem 0 1.4rem 0;
    .signflag {
      color: #2ba72b;
      padding: 0.06rem;
      border-radius: 4px;
      // display: flex;
      // justify-content: center;
      position: absolute;
      left: 30%;
      transform: translateX(-50%);
      bottom: 3px;
    }
  }
  .payTip {
    font-size: 0.24rem;
    background: rgb(255, 255, 190);
    color: #ff6400;
    padding: 0.16rem;
  }
  .pickupCode {
    padding-top: 0.06rem;
    color: @primary;
    font-size: 0.48rem;
    font-weight: bold;
  }
  .mergeBox {
    width: 100%;
    border: none;
    color: #999;
    font-size: 0.28rem;
    background: #f2f2f2;
    padding: 0.2rem 0;
    border-radius: 4px;
    border: 1px solid #999;
    font-size: 0.24rem;
    padding: 0.16rem 0;
    text-align: center;
    position: relative;
  }
  .check-box {
    .iconfont {
      color: @primary;
    }
  }
  .large-tag {
    font-size: 0.24rem;
    padding: 0.04rem 0.1rem;
    background: @primary;
    color: #fff;
    border-radius: 4px;
  }
  .merge-flag {
    background: rgb(112, 173, 71);
    color: #fff;
    padding: 2px 3px;
    border-radius: 4px;
    margin-left: 2px;
  }
  .more-flag {
    background: #22a0d7;
    color: #fff;
    padding: 2px 3px;
    border-radius: 4px;
    margin-left: 2px;
  }
  .return-flag {
    background: #ff0000;
    color: #fff;
    padding: 2px 3px;
    border-radius: 4px;
    margin-left: 2px;
  }
  .group-flag {
    background: rgb(255, 192, 0);
    color: #fff;
    padding: 2px 3px;
    border-radius: 4px;
    margin-left: 2px;
  }
  .large-text {
    font-size: 0.24rem;
  }
  .rejection {
    text-align: center;
    width: 100%;
    margin-top: 0.1rem;
    span {
    }
    i {
      color: #ff6400;
      font-size: 0.36rem;
      padding: 0 0.1rem;
    }
  }
  .weight-detail {
    font-size: 0.28rem;
    display: flex;
    justify-content: space-between;
    padding: 0 0.16rem 0.16rem 0.16rem;
    align-items: center;
    span {
      font-weight: 600;
    }
    .detail-btn {
      box-shadow: 0 0 4px #d2d2d2;
      padding: 0.16rem 0.32rem;
      border-radius: 1rem;
      background: #fff;
      font-size: 0.24rem;
      &.showDetail {
        position: absolute;
        top: -0.36rem;
        right: 0.16rem;
      }
      i {
        font-size: 0.28rem;
        color: #999;
        padding-left: 0.08rem;
      }
    }
  }
  .detail-content {
    font-size: 0.28rem;
    padding: 0.16rem 0.28rem;
    background: #fff;
    .row {
      display: flex;
      color: #666;
      margin: 0.28rem 0;
      justify-content: space-between;
      padding-bottom: 0.16rem;
      &.error {
        color: red;
      }
      .col1 {
      }
      .col2 {
        padding-left: 0.16rem;
      }
    }
  }
</style>
<style lang="less">
  // .weui-toast {
  //   width: 2.4rem !important;
  //   min-height: 2.4rem !important;
  // }
</style>
