<template>
  <div class="appointment-list">
    <!-- 未预约列表 -->
    <template v-if="appointTabIndex===0">
      <div class="thead">
        <div class="th"
          @click="handlerSelectAll()">
          <i :class="['iconfont', isAll ? 'icon-check': 'icon-nocheck']"></i>
        </div>
        <div class="th">包裹號</div>
        <div class="th">剩余有效期</div>
        <div class="th">
          <popup-picker :data="pudoNameList"
            :columns="3"
            class="picker"
            @on-change="pickerChange"
            v-model="currentPodo"
            show-name></popup-picker>
        </div>
      </div>
      <div class="tbody"
        v-if="items.length > 0">
        <div :class="['tr', item.delay ? 'opacity': '']"
          v-for="(item, index) in items"
          :key="index"
          @click="handlerSelectRow(item)"
          v-show="item.show">
          <div class="td">
            <i :class="['iconfont', item.checked ? 'icon-check': 'icon-nocheck']"></i>
          </div>
          <div class="td infos">
            <p>{{item.fpxOrderId}}</p>
            <div>
              <span>{{item.appointmentInfoDTO.username}}</span>
              <span>{{item.appointmentInfoDTO.phone}}</span>
            </div>
          </div>
          <div class="td">{{calcRestDay(item.appointmentInfoDTO.restDay)}}</div>
          <div class="td">{{item.appointmentInfoDTO.pudoName}}</div>
        </div>
      </div>
      <!-- nodata -->
      <div class="nodata"
        v-if="items.length == 0">
        <i class="iconfont icon-nodata"></i>
        <p>暂无数据哦</p>
      </div>
      <div class="hold"
        v-if="isOver">--- 我也是有底线的 ---</div>
    </template>

    <!-- 我的预约列表 -->
    <template v-if="appointTabIndex===1">
      <div class="thead myAppoint vux-1px-b">
        <div class="th">預約碼</div>
        <div class="th">預約提貨時間</div>
        <div class="th">提貨人</div>
      </div>
      <div class="tbody myAppoint"
        v-if="myAppointList.length > 0">
        <div class="tr vux-1px-b"
          v-for="(item, index) in myAppointList"
          :key="index"
          @click="handlerDetail(item.appointId)">
          <div class="td">{{item.shipperCode}}</div>
          <div class="td">{{calcAppointTime(item.shipperEndTime)}}</div>
          <div class="td">{{item.userName}}</div>
        </div>
      </div>
      <!-- nodata -->
      <div class="nodata"
        v-if="myAppointList.length == 0">
        <i class="iconfont icon-nodata"></i>
        <p>暂无数据哦</p>
      </div>
      <div class="hold"
        v-if="isOver">--- 我也是有底线的 ---</div>
    </template>

  </div>
</template>

<script>
import { PopupPicker } from 'vux'
import { getPackageList, getPudoNameList, getMyAppointList } from '@/api/appointment'
import { formatDate } from '@/utils/common'

export default {
  name: 'list',
  props: {
    appointTabIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      selectData: [],
      isAll: false,
      disabled: true,
      obj: {
        pageNum: 1,
        pageSize: 10,
        packageStatus: 83
      },
      totalPages: '',
      isOver: false,
      pudoNameList: [],
      currentPodo: [],
      items: [],
      myAppointList: []
    }
  },
  mounted () {
    // 获取门店列表
    this.getPudoName()
    // 获取待预约列表
    this.getData()
  },
  methods: {
    getPudoName () {
      getPudoNameList().then(res => {
        if (res.code === this.GLOBAL.code) {
          if (res.data.length === 0) {
            return
          }
          this.pudoNameList = []
          let initObj = {
            name: '全部',
            value: '0'
          }
          this.pudoNameList.push(initObj)
          res.data.forEach((val) => {
            let obj = {
              name: val.pudoName,
              value: val.pudoCode
            }
            this.pudoNameList.push(obj)
          })
          this.currentPodo = [(this.pudoNameList[0]).value]
        }
      })
    },
    // 待预约列表
    getData () {
      getPackageList(this.obj).then(res => {
        if (res.code === this.GLOBAL.code) {
          if (!res.result.length) {
            return
          }
          this.totalPages = res.totalPages
          let result = res.result
          result.forEach((val, index) => {
            val.checked = false
            val.show = true
            if (val.appointmentInfoDTO.restDay > 0) {
              val.delay = false
            } else {
              val.delay = true
            }
          })
          this.items = this.items.concat(result)
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
    // 加载我的预约列表
    getMyAppoint () {
      getMyAppointList(this.obj).then(res => {
        if (res.code === this.GLOBAL.code) {
          if (!res.result.length) {
            return
          }
          this.totalPages = res.totalPages
          this.myAppointList = this.myAppointList.concat(res.result)
        }
      })
    },
    // 单选
    handlerSelectRow (item) {
      if (item.delay) {
        this.$vux.toast.text('包裹已超期，不能預約')
        return
      }
      if (this.selectData.length === 0) {
        item.checked = true
        this.selectData.push(item)
      } else {
        this.selectData.forEach((val, index) => {
          if (val.fpxOrderId === item.fpxOrderId) {
            item.checked = false
            this.selectData.splice(index, 1)
          } else {
            item.checked = true
          }
        })
        if (item.checked) {
          this.selectData.push(item)
        }
      }
      if (this.selectData.length === this.items.length) {
        this.isAll = true
      } else {
        this.isAll = false
      }
      this.$emit('handlerSelectData', this.selectData, this.appointTabIndex)
    },
    // 全选
    handlerSelectAll () {
      let that = this
      that.isAll = !that.isAll
      that.selectData = []
      that.items.forEach((val, index) => {
        if (that.isAll && !val.delay && val.show) {
          val.checked = true
          that.selectData.push(val)
        } else {
          val.checked = false
        }
      })
      if (that.items.length === 1 && that.items[0].delay) {
        that.isAll = false
      }
      this.$emit('handlerSelectData', this.selectData, this.appointTabIndex)
    },
    // 根据自提点进行筛选
    pickerChange (val) {
      if (val[0] === '0') {
        this.items.forEach((item, index) => {
          item.show = true
        })
      } else {
        this.items.forEach((item, index) => {
          if (item.appointmentInfoDTO.pudoCode === val[0]) {
            item.show = true
          } else {
            item.show = false
          }
        })
      }
    },
    // 计算提货时间
    calcAppointTime (end) {
      return formatDate(end)
    },
    // 根据预约id查询预约详情
    handlerDetail (id) {
      this.$router.push({ name: 'appointDetail', params: { appointId: id } })
    },
    // 計算列表是否已超期
    calcRestDay (day) {
      if (day > 0) {
        return day + '天'
      } else {
        return '已超期'
      }
    }
  },
  watch: {
    selectData () {
      if (this.selectData.length > 0) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    appointTabIndex () {
      if (this.appointTabIndex === 1) {
        delete this.obj.packageStatus
        // 获取我的预约列表
        this.getMyAppoint()
      }
    }
  },
  components: {
    PopupPicker
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .icon-check {
    color: @primary;
  }
  .appointment-wrapper {
    margin: 0.2rem 0.18rem;
    background: #fff;
    font-size: 0.24rem;
    .thead {
      display: flex;
      font-size: 0.28rem;
      align-items: center;
      height: 1rem;
      background-color: #fff;
      .th {
        &:nth-child(1) {
          width: 10%;
          height: 100%;
          align-items: center;
          display: flex;
          justify-content: center;
        }
        &:nth-child(2) {
          width: 28%;
        }
        &:nth-child(3) {
          width: 24%;
          text-align: right;
        }
        &:nth-child(4) {
          width: 40%;
          .vux-cell-box {
            position: relative;
            display: flex;
            justify-content: center;
            margin: 0 auto;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            align-items: center;
            padding: 0.2rem 0;
            &:after {
              content: " ";
              display: inline-block;
              height: 6px;
              width: 6px;
              border-width: 2px 2px 0 0;
              border-color: #c8c8cd;
              border-style: solid;
              position: relative;
              transform: rotate(134deg);
              margin-bottom: 4px;
              margin-left: 6px;
            }
          }
        }
      }
    }
    .tbody {
      .tr {
        display: flex;
        font-size: 0.28rem;
        align-items: center;
        height: 1.1rem;
        &:nth-child(2n + 1) {
          background-color: #f2f2f2;
        }
        &:nth-child(2n) {
          background-color: #fff;
        }
        &.opacity {
          opacity: 0.3;
        }
        .td {
          &:nth-child(1) {
            width: 9%;
            height: 100%;
            align-items: center;
            display: flex;
            justify-content: center;
          }
          &:nth-child(2) {
            width: 42%;
          }
          &:nth-child(3) {
            width: 13%;
            text-align: center;
          }
          &:nth-child(4) {
            width: 38%;
            text-align: center;
            color: @primary;
          }
          &.infos {
            p {
              margin-bottom: 0.1rem;
            }
            span {
              font-size: 0.24rem;
            }
          }
        }
      }
    }
    .tbody.myAppoint .td,
    .thead.myAppoint .th {
      width: 28% !important;
      text-align: center;
    }
    .tbody.myAppoint .td:nth-child(2),
    .thead.myAppoint .th:nth-child(2) {
      width: 44% !important;
      text-align: center;
    }
    .tbody.myAppoint .tr .td:last-child:after {
      position: absolute;
      content: ">";
      right: 0.2rem;
      color: #999;
    }
  }
  .agree {
    color: #666;
    display: flex;
    font-size: 0.24rem;
    align-items: center;
    margin-top: 0.16rem;
  }
</style>
<style lang="less" scoped>
  .picker {
    .weui-cell {
      padding: 0.16rem 0 !important;
      .vux-popup-picker-select {
        max-width: 2.2rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .weui-cell__ft:after {
        display: none !important;
      }
    }
  }
  // .footer-fixed {
  //   position: fixed;
  //   bottom: auto;
  //   left: 0;
  //   right: 0;
  //   padding: 0.16rem;
  //   font-size: 0;
  //   z-index: 99;
  //   background-color: #fff;
  //   min-height: 0.68rem;
  // }
</style>
