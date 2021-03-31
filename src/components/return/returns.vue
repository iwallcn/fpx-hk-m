<!--  -->
<template>
  <div class="returns">
    <div class="returns-search">
      <div class="search">
        <input type="text"
          v-model="obj.packageNo"
          placeholder="推薦碼查詢">
        <button @click="handleShipperCodeSearch">查詢</button>
      </div>
      <!-- <div class="select">
        <popup-radio :options="payStatusList"
          v-model="obj.freightPayFlag"
          @on-hide="payStatusChange"
          placeholder="placeholder"></popup-radio>
      </div> -->
      <div class="select">
        <popup-radio :options="pageStatusList"
          v-model="packageStatus"
          @on-hide="packageStatusChange"
          placeholder="placeholder"></popup-radio>
      </div>
    </div>

    <div class="returns-wrapper">
      <div class="returns-thead">
        <div class="th">退件碼</div>
        <div class="th">末端快遞號</div>
        <div class="th">攬收門店</div>
      </div>
    </div>
    <Scroll ref="scroll"
      class="scroll"
      :data="items"
      :pullup="pullup"
      @scrollToEnd="scrollToEnd">
      <div class="returns-tbody scroll-item"
        ref="scrollItem">
        <div class="tr"
          v-for="(item, index) in items"
          :key="index">
          <div class="tr1">
            <div class="td">{{item.shipperCode || '暂无'}}</div>
            <div class="td">{{item.terminalDeliveryNo || '暂无'}}-{{item.terminalDeliveryCo || '暂无'}}</div>
            <div class="td">{{item.pudoName || '暂无'}}</div>
          </div>
          <div class="tr2">
            <div class="td">
              <span>{{item.packageAddressDTO.userName || '暂无'}}</span>
              <span>{{item.packageAddressDTO.areaCode || '暂无'}}</span>
              <span>{{item.packageAddressDTO.mobile || '暂无'}}</span>
            </div>
            <!-- <div class="td">{{calcPackageStatus(item.statusFlag, item.freightPayFlag)}}</div> -->
          </div>

          <!--
            statusFlag < 50 ，一般来说是30（申请退件）   packageStatus ==30
            packageStatus == 30 && freightPayFlag == 30（已支付）
            statusFlag >= 50 （已揽收）  packageStatus == 80
            statusFlag > 80 （运输中）    packageStatus == 90
            statusFlag == 100（签收）     packageStatus ==100
          -->

          <!-- 申請退件 -->
          <template v-if="item.statusFlag < 50 && item.freightPayFlag != 30">
            <flow class="flow-wrapper">
              <flow-state state="1"
                title="申請退件"
                is-done></flow-state>
              <flow-line></flow-line>
              <flow-state state="2"
                title="已支付">
              </flow-state>
              <flow-line></flow-line>
              <flow-state state="3"
                title="已攬收"></flow-state>
              <flow-line></flow-line>
              <flow-state state="3"
                title="運輸中"></flow-state>
              <flow-line></flow-line>
              <flow-state state="4"
                title="完成"></flow-state>
            </flow>
          </template>

          <!-- 已支付 -->
          <template v-if="item.statusFlag < 50 && item.freightPayFlag == 30">
            <flow class="flow-wrapper">
              <flow-state state="1"
                title="申請退件"
                is-done></flow-state>
              <flow-line is-done></flow-line>
              <flow-state state="2"
                title="已支付"
                is-done>
              </flow-state>
              <flow-line></flow-line>
              <flow-state state="3"
                title="已攬收"></flow-state>
              <flow-line></flow-line>
              <flow-state state="3"
                title="運輸中"></flow-state>
              <flow-line></flow-line>
              <flow-state state="4"
                title="完成"></flow-state>
            </flow>
          </template>

          <!-- 已攬收 -->
          <template v-if="item.statusFlag >= 50 && item.statusFlag <= 80">
            <flow class="flow-wrapper">
              <flow-state state="1"
                title="申請退件"
                is-done></flow-state>
              <flow-line is-done></flow-line>
              <flow-state state="2"
                title="已支付"
                is-done>
              </flow-state>
              <flow-line is-done></flow-line>
              <flow-state state="3"
                title="已攬收"
                is-done></flow-state>
              <flow-line></flow-line>
              <flow-state state="3"
                title="運輸中"></flow-state>
              <flow-line></flow-line>
              <flow-state state="4"
                title="完成"></flow-state>
            </flow>
          </template>

          <!-- 運輸中 -->
          <template v-if="item.statusFlag > 80 && item.statusFlag < 100">
            <flow class="flow-wrapper">
              <flow-state state="1"
                title="申請退件"
                is-done></flow-state>
              <flow-line is-done></flow-line>
              <flow-state state="2"
                title="已支付"
                is-done>
              </flow-state>
              <flow-line is-done></flow-line>
              <flow-state state="3"
                title="已攬收"
                is-done></flow-state>
              <flow-line is-done></flow-line>
              <flow-state state="3"
                title="運輸中"
                is-done></flow-state>
              <flow-line></flow-line>
              <flow-state state="4"
                title="完成"></flow-state>
            </flow>
          </template>

          <!-- 完成 -->
          <template v-if="item.statusFlag == 100">
            <flow class="flow-wrapper">
              <flow-state state="1"
                title="申請退件"
                is-done></flow-state>
              <flow-line is-done></flow-line>
              <flow-state state="2"
                title="已支付"
                is-done>
              </flow-state>
              <flow-line is-done></flow-line>
              <flow-state state="3"
                title="已攬收"
                is-done></flow-state>
              <flow-line is-done></flow-line>
              <flow-state state="3"
                title="運輸中"
                is-done></flow-state>
              <flow-line is-done></flow-line>
              <flow-state state="4"
                title="完成"
                is-done></flow-state>
            </flow>
          </template>

          <!-- 已支付的包裹不能编辑但可以取消 -->
          <div class="tr3">
            <div class="col"
              v-if="item.freightPayFlag != 30">
              <button class="btn-ml sm"
                @click="handleReturnEdit(item.fpxOrderId)">編輯退件</button>
            </div>
            <div class="col"
              v-if="item.freightPayFlag != 30">
              <button class="btn-ml sm"
                @click="handleReturnPay(item.fpxOrderId)">去支付</button>
            </div>
            <div class="col">
              <button class="btn-ml sm"
                @click="handleReturnDetail(item.fpxOrderId, item.operateStatus)">退件詳情</button>
            </div>
            <div class="col">
              <button class="btn-ml sm"
                @click="handleReturnTrack(item.fpxOrderId)">物流軌跡</button>
            </div>
          </div>
        </div>
        <div class="nodata"
          v-if="items.length == 0">
          <i class="iconfont icon-nodata"></i>
          <p>{{itemDataInfo}}</p>
        </div>
      </div>
    </Scroll>
    <div class="submit-bar">
      <span class="agreement-box-link"
        @click="showReturnRemark">查看退件說明</span>
      <div class="btn-box"
        @click="handleSubmit">新增退件</div>
    </div>
  </div>
</template>

<script>
import Scroll from '@/common/scroll/scroll'
import { PopupRadio, Flexbox, FlexboxItem, Flow, FlowState, FlowLine } from 'vux'
import { getPackageList } from '@/api/return'
export default {
  components: { Scroll, PopupRadio, Flexbox, FlexboxItem, Flow, FlowState, FlowLine },
  data () {
    return {
      payStatusList: [{
        key: '',
        value: '支付状态'
      }, {
        key: '20',
        value: '待支付'
      }, {
        key: '30',
        value: '已支付'
      }],
      pageStatusList: [{
        key: '0',
        value: '全部包裹狀態'
      }, {
        key: '10',
        value: '申請退件'
      }, {
        key: '30',
        value: '已支付'
      }, {
        key: '80',
        value: '已攬收'
      }, {
        key: '90',
        value: '運輸中'
      }, {
        key: '100',
        value: '已完成'
      }, {
        key: '3',
        value: '已取消'
      }],
      obj: {
        pageNum: 1,
        pageSize: 10,
        packageStatus: '0', // 包裹状态，默认是全部
        packageNo: '', // 包裹号
        freightPayFlag: '' // 支付状态查询
      },
      packageStatus: '0',
      totalPages: '',
      items: [],
      pullup: true,
      isOver: false,
      itemDataInfo: ''
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.itemDataInfo = '正在加載中...'
      getPackageList(this.obj).then(res => {
        if (res.code === this.GLOBAL.code) {
          if (!res.result || res.result.length === 0) {
            this.itemDataInfo = '暫無數據哦'
            return
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
    // 退件码查询
    handleShipperCodeSearch () {
      // if (!this.obj.packageNo.trim()) {
      //   this.$vux.toast.text('請輸入推薦碼')
      //   return
      // }
      // this.obj.packageStatus = '0'
      this.obj.freightPayFlag = ''
      this.items = []
      this.getData()
    },
    showReturnRemark () {
      window.location.href = 'https://m-hk.4px.com/page/singlePage?id=174'
    },
    handleSubmit () {
      this.$router.push({ name: 'returnAdd' })
    },
    // 编辑退件
    handleReturnEdit (fpxOrderId) {
      this.$router.push({ name: 'returnEdit', query: { fpxOrderId } })
    },
    // 去支付
    handleReturnPay (fpxOrderId) {
      // this.$router.push({ name: 'returnPay', query: { fpxOrderId } })
      this.$router.push({ name: 'payment', query: { fpxOrderId, type: 'returns' } })
    },
    // 包裹详情
    handleReturnDetail (fpxOrderId, operateStatus) {
      this.$router.push({ name: 'returnDetail', query: { fpxOrderId, operateStatus } })
    },
    // 物流轨迹
    handleReturnTrack (fpxOrderId) {
      this.$router.push({ name: 'tracking', query: { fpxOrderId } })
    },
    // 支付状态改变
    payStatusChange () {
      // if (this.obj.freightPayFlag === '30') { // 已支付
      //   this.obj.packageStatus = '30'
      // } else { // 未支付
      //   this.obj.packageStatus = '' // 这里写啥呢？
      // }
      this.obj.packageStatus = '0'
      this.obj.packageNo = ''
      this.items = []
      this.getData()
    },
    // 包裹状态改变
    packageStatusChange () {
      // statusFlag < 50 ，一般来说是30（申请退件）   packageStatus ==30
      // packageStatus == 30 && freightPayFlag == 30（已支付）
      // 由于已支付和申请退件packageStatus=30，只是已支付
      if (this.packageStatus === '10') { // 申请退件由于和已支付都是30，所以需要做下区分
        this.obj.packageStatus = '30'
        this.obj.freightPayFlag = ''
      } else if (this.packageStatus === '30') { // 如果是已支付，还需要设置freightPayFlag=30
        this.obj.freightPayFlag = '30'
      } else {
        this.obj.freightPayFlag = ''
        this.obj.packageStatus = this.packageStatus
      }
      this.obj.packageNo = ''
      this.items = []
      this.getData()
    },
    // 计算当前包裹走到哪个节点
    calcPackageStatus (statusFlag, freightPayFlag) {
      // item.statusFlag < 50 && item.freightPayFlag != 30
      if (statusFlag < 50 && freightPayFlag !== 30) {
        return '申請退件'
      } else if (statusFlag < 50 && freightPayFlag === 30) {
        return '已支付'
      } else if (statusFlag >= 50 && statusFlag <= 80) {
        return '已攬收'
      } else if (statusFlag > 80 && statusFlag < 100) {
        return '運輸中'
      } else if (statusFlag === 100) {
        return '完成'
      } else {
        return '其他'
      }
    }
  }
}
</script>
<style lang='less' scoped>
  @import "../../assets/less/variable.less";
  * {
    touch-action: pan-y;
  }
  .returns {
    font-size: 0.28rem;
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    overflow: hidden;
    .scroll {
      height: calc(100% - 3.2rem);
      overflow: hidden;
    }
    &-search {
      margin: 0.2rem 0;
      background: #fff;
      display: flex;
      .search {
        flex: 1;
        display: flex;
        input {
          width: 60%;
          padding: 0.2rem 0.1rem;
        }
        button {
          width: 40%;
          border: none;
          background: @primary;
          color: #fff;
        }
      }
      .select {
        width: 35%;
      }
    }
    &-wrapper {
      margin-top: 0.2rem;
      background: #fff;
      .returns-thead {
        width: 96%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        ::after {
          content: " ";
          position: absolute;
          left: 0;
          bottom: 0;
          right: 0;
          height: 1px;
          border-bottom: 1px solid #d9d9d9;
          color: #d9d9d9;
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
          -webkit-transform: scaleY(0.5);
          transform: scaleY(0.5);
        }
        .th {
          font-size: 0.3rem;
          color: #666;
          text-align: center;
          padding: 0.3rem 0;
        }
      }
    }
    .returns-tbody {
      .tr {
        padding: 0.4rem 2%;
        margin: 0 auto;
        font-size: 0.24rem;
        position: relative;
        .tr1 {
          display: flex;
          justify-content: space-between;
          .td {
            color: #666;
            &:last-child {
              color: @primary;
            }
          }
        }
        .tr2 {
          display: flex;
          margin-top: 0.16rem;
          justify-content: space-between;
          .td {
            color: #666;
            span {
              padding-right: 4px;
            }
          }
        }
        .tr3 {
          display: flex;
          justify-content: space-between;
          margin-top: 0.3rem;
          .col {
            flex: 1 0 auto;
            margin: 0 0.05rem;
            // &:nth-child(2) {
            //   margin-left: 0.1rem;
            // }
          }
        }
        &:nth-child(even) {
          background: #fff;
        }
        &:nth-child(odd) {
          background: #f5f5f5;
        }
      }
    }
    .submit-bar {
      width: 100%;
      height: 1rem;
      position: fixed;
      left: 0;
      bottom: 0;
      right: 0;
      margin: 0 auto;
      display: flex;
      align-items: center;
      background: #fff;
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
      .agreement-box-link {
        font-size: 0.28rem;
        flex: 1;
        color: #6699ff;
        padding-left: 0.2rem;
      }
      .btn-box {
        width: 28%;
        height: 100%;
        font-size: 0.3rem;
        color: #fff;
        background: #ff6400;
        text-align: center;
        line-height: 1rem;
      }
    }
  }
</style>
<style lang='less'>
  .returns {
    .weui-cell {
      justify-content: center;
      .vux-cell-primary {
        flex: 0;
      }
    }
    .weui-cell_access .weui-cell__ft:after {
      content: " ";
      display: inline-block;
      height: 6px;
      width: 6px;
      border-width: 0 2px 2px 0 !important;
      border-color: #c8c8cd;
      border-style: solid;
      -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
      transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
      position: absolute;
      top: 34%;
      right: 10% !important;
    }
  }
  .weui-check__label {
    text-align: center;
    font-size: 0.3rem;
  }
  .vux-popup-dialog {
    .weui-icon-checked {
      position: absolute;
      right: 0.3rem;
    }
  }
  .flow-wrapper {
    padding: 0.3rem 0.4rem !important;
    [class^="weui-wepay-flow__info-"],
    .weui-wepay-flow__process,
    .weui-wepay-flow__li_done .weui-wepay-flow__state {
      background-color: @primary;
    }
    .weui-wepay-flow,
    .weui-wepay-flow-auto {
      padding: 0;
      .weui-wepay-flow__title-bottom {
        // white-space: normal;
        font-size: 0.24rem !important;
      }
    }
    [class^="weui-wepay-flow__title-"],
    [class*=" weui-wepay-flow__title-"] {
      font-size: 0.24rem !important;
    }
  }
  .vux-popup-dialog .weui-icon-checked {
    position: absolute;
    right: 0.3rem;
    top: 0.2rem;
  }
</style>
