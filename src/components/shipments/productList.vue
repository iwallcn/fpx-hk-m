<!--  -->
<template>
  <div class='productList'>
    <i class="iconfont icon-close"
      @click="handlerClose"></i>
    <Scroll ref="scroll"
      class="scroll"
      :data="items"
      :pullup="pullup"
      @scrollToEnd="scrollToEnd">
      <div class="scroll-item"
        ref="scrollItem">
        <div class="item"
          v-for="(item, index) in items"
          :key="index">
          <div class="row vux-1px-b">
            <span>{{item.goodsName}}</span>
            <a @click="handlerDeclare(item)">再次申报</a>
          </div>
          <div class="content">
            <div class="thead">
              <div class="th">品类</div>
              <div class="th">品牌</div>
              <div class="th">規格</div>
            </div>
            <div class="tbody">
              <div class="td">{{item.categoryName}}</div>
              <div class="td">{{item.brand}}</div>
              <div class="td">{{item.spec}}</div>
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
    </Scroll>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import Scroll from '@/common/scroll/scroll'
import { getHistPageByUserId } from '@/api/order'
export default {
  name: 'productList',
  // import引入的组件需要注入到对象中才能使用
  components: { Scroll },
  data () {
    // 这里存放数据
    return {
      obj: {
        pageNum: 1,
        pageSize: 10
      },
      totalPages: '',
      items: [],
      pullup: true,
      isOver: false,
      itemDataInfo: ''
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.getData()
  },
  // 方法集合
  methods: {
    getData () {
      this.itemDataInfo = '正在加載中...'
      getHistPageByUserId(this.obj).then(res => {
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
    // 关闭历史数据页面
    handlerClose () {
      this.$emit('closeProductList')
    },
    // 再次申报
    handlerDeclare (data) {
      this.$emit('handlerDeclare', data)
    }
  }
}
</script>
<style lang='less' scoped>
  .productList {
    height: 100%;
    overflow: hidden;
    .icon-close {
      position: fixed;
      right: 0;
      padding: 0.1rem;
      cursor: pointer;
      z-index: 4;
      color: @primary;
      border: 1px solid @primary;
      border-radius: 100%;
    }
    .scroll {
      height: 100%;
      overflow: hidden;
      .scroll-item {
        padding-bottom: 0.4rem;
      }
    }
    .hold {
      height: 30px;
      font-size: 0.24rem;
      color: #999;
      text-align: center;
    }
    .item {
      background: #e4e4e4;
      margin: 0.3rem 0.2rem 0 0.2rem;
      border-radius: 2px;
      padding: 0.16rem;
      .row {
        display: flex;
        justify-content: space-between;
        font-size: 0.34rem;
        padding-bottom: 0.2rem;
        align-items: center;
        span {
        }
        a {
          background-color: @primary;
          color: #fff;
          border: none;
          border-radius: 2px;
          padding: 0.1rem 0.2rem;
          font-size: 0.28rem;
        }
      }
      .content {
        .thead {
          display: flex;
          .th {
            font-size: 0.28rem;
            color: #999;
            flex: 1;
            text-align: center;
            margin-top: 0.2rem;
          }
        }
        .tbody {
          display: flex;
          .td {
            font-size: 0.28rem;
            color: #666;
            flex: 1;
            text-align: center;
            margin-top: 0.2rem;
          }
        }
      }
    }
  }
</style>
