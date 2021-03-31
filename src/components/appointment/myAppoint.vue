<template>
  <Scroll ref="scroll"
    class="scroll"
    :data="items"
    pullup
    @scrollToEnd="scrollToEnd">
    <div class="mainland">
      <div class="thead vux-1px-b">
        <div class="th">預約碼</div>
        <div class="th">預約提貨時間</div>
        <div class="th">提貨人</div>
      </div>
      <div class="tbody">
        <div class="tr vux-1px-b"
          v-for="(item, index) in items"
          :key="index"
          @click="handlerDetail(item.appointId)">
          <div class="td">{{item.shipperCode}}</div>
          <div class="td">{{calcAppointTime(item.shipperEndTime)}}</div>
          <div class="td">{{item.userName}}</div>
        </div>
      </div>
    </div>
    <div class="nodata"
      v-if="items.length == 0">
      <i class="iconfont icon-nodata"></i>
      <p>暂无数据哦</p>
    </div>
    <div class="hold"
      v-if="isOver">--- 我也是有底线的 ---</div>
  </Scroll>
</template>

<script>
import Scroll from '@/common/scroll/scroll'
import { formatDate } from '@/utils/common'
import { getMyAppointList } from '@/api/appointment'

export default {
  name: 'myAppoint',
  data () {
    return {
      items: [],
      obj: {
        pageNum: 1,
        pageSize: 5
      },
      totalPages: '',
      isOver: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 加载我的预约列表
    getData () {
      getMyAppointList(this.obj).then(res => {
        if (res.code === this.GLOBAL.code) {
          if (res.result.length === 0) {
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
    // 计算提货时间
    calcAppointTime (end) {
      return formatDate(end)
    },
    // 根据预约id查询预约详情
    handlerDetail (id) {
      this.$router.push({ name: 'appointDetail', params: { appointId: id } })
    }
  },
  components: {
    Scroll
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .mainland {
    background: #fff;
    .thead {
      display: flex;
      font-size: 0.3rem;
      align-items: center;
      height: 1rem;
      justify-content: center;
      .th {
        flex: 0.33 0 auto;
        text-align: center;
      }
    }
    .tbody {
      .tr .td:last-child:after {
        position: absolute;
        content: ">";
        right: 0.2rem;
        color: #999;
      }
      .tr {
        display: flex;
        font-size: 0.28rem;
        align-items: center;
        height: 1rem;
        justify-content: center;
        width: 100%;
        position: relative;
        .td {
          &:nth-child(1) {
            width: 25%;
          }
          &:nth-child(2) {
            width: 50%;
          }
          &:nth-child(3) {
            width: 25%;
          }
          flex: 1 0 auto;
          text-align: center;
        }
      }
    }
  }
</style>
