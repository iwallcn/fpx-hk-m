<template>
  <div class="issue">
    <img v-lazy="imgUrl">
    <div class="issue-tips">
      溫馨提示：請登錄 https://hk.4px.com/ 使用PC端處理
    </div>
    <h3>異常包裹列表</h3>
    <Scroll ref="scroll"
      class="scroll"
      :data="items"
      :pullup="pullup"
      @scrollToEnd="scrollToEnd">
      <div class="scroll-item"
        ref="scrollItem">
        <x-table>
          <thead>
            <tr>
              <th>4PX運單號</th>
              <th>倉庫</th>
              <th>時間</th>
              <th>異常狀態</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items"
              :key="item.fpxOrderId">
              <td>{{item.fpxOrderId}}</td>
              <td>{{item.warehouseName}}</td>
              <td>{{item.time}}</td>
              <td>{{item.statusText}}</td>
            </tr>
          </tbody>
        </x-table>
        <!-- nodata -->
        <div class="nodata"
          v-if="items.length == 0">
          <i class="iconfont icon-nodata"></i>
          <p>暂无数据哦</p>
        </div>
        <div class="hold"
          v-if="isOver">--- 我也是有底线的 ---</div>
      </div>
    </Scroll>
  </div>
</template>

<script>
import { getExceptionList } from '@/api/myPackage'
import Scroll from '@/common/scroll/scroll'
import { XTable } from 'vux'
import { getWH } from '@/utils/cache'
import { fmtDate } from '@/utils/common'
const STATUS = { 0: '待處理', 10: '待支付', 20: '處理中', 30: '完成' }

export default {
  name: 'issue',
  data () {
    return {
      imgUrl: require('../../assets/image/que-banner1.jpg'),
      obj: {
        pageNum: 1,
        pageSize: 10,
        fpxOrderId: '',
        status: ''
      },
      totalPages: '',
      items: [],
      pullup: true,
      isOver: false,
      status: STATUS
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 獲取異常包裹
    getData () {
      getExceptionList(this.obj).then(res => {
        if (res.code === this.GLOBAL.code) {
          if (!res.result || res.result.length === 0) {

          }
          let wh = getWH()
          res.result.forEach(val => {
            val.statusText = this.status[val.status]
            val.warehouseName = wh[val.warehouseCode] || '暫無'
            val.time = fmtDate(val.createTime)
          })
          this.totalPages = res.totalPages
          this.items = this.items.concat(res.result)
        } else {
          this.$vux.toast.text(res.message)
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
    }
  },
  components: {
    Scroll,
    XTable
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .issue {
    background: #fff;
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    overflow: hidden;
    font-size: 0;
    .scroll {
      height: calc(100% - 3.6rem);
      overflow: hidden;
      .hold {
        font-size: 0.24rem;
        color: #999;
        text-align: center;
      }
    }
    .issue-tips {
      font-size: 0.24rem;
      background: #ffffbe;
      color: @primary;
      padding: 0.2rem 0.16rem;
    }
    h3 {
      font-size: 0.32rem;
      color: @primary;
      text-align: center;
      padding: 0.3rem;
    }
    img {
      width: 100%;
      max-height: 2.8rem;
    }
    table {
      font-size: 0.28rem;
    }
  }
</style>
