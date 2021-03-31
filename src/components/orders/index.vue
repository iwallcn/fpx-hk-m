<template>
  <div class="mainland-pack mypackage">
    <tab v-model="packageTabIndex"
      :line-width=2
      :scroll-threshold=5>
      <tab-item v-for="(tab, index) in links"
        @on-item-click="onItemClick"
        :badge-label="calcBadgeCount(tab.count, index)"
        :key="index">
        {{tab.label}}
        <i class="iconfont icon-search"
          @click.stop="switchSearch"
          v-if="index === links.length-1"></i>
      </tab-item>
    </tab>
    <div class="search-panel"
      v-if="isSearch">
      <input type="text"
        ref="inputVal"
        placeholder="請輸入商家物流號/4PX運單號查詢"
        v-model="keywords">
      <i class="iconfont icon-close"
        v-if="isClear"
        @click="clearInput"></i>
      <i class="iconfont icon-search"
        @click="searchPackage"></i>
    </div>
    <package-list ref="packageList"
      :listType="currentType"
      @goMerge="onGoMerge"></package-list>
  </div>
</template>

<script>
import { Tab, TabItem } from 'vux'
import { mapMutations } from 'vuex'
import minxinCommon from './minxinCommon.js'
import packageList from './list'
import { getPackageCountList } from '@/api/myPackage'
// 0 全部包裹 53 待认领 30 待入库 20 待支付 55 待合箱 65 待分箱 80 待出库 83 待预约 85 已预约 90 已出库 100 已签收
// tab流程： 30 待入库， 53 待认领， 55 待合箱， 20 待支付， 0 全部订单 -old
// tab流程： 53 待认领， 55 待合箱， 20 待支付， 83 自提预约， 0 全部订单 -new
// flow流程：30 待入库， 80 待出库， 90 已出库， 100 已签收
const links = [
  {
    label: '待认领',
    link: 53,
    count: 0
  },
  {
    label: '待合箱',
    link: 55,
    count: 0
  },
  {
    label: '待支付',
    link: 20,
    count: 0
  },
  // {
  //   label: '自提预约',
  //   link: 83,
  // count: 0
  // },
  {
    label: '全部',
    link: 0,
    count: 0
  }
]

export default {
  name: 'myPackage',
  data () {
    return {
      isSearch: false, // 是否搜索
      isClear: false, // 是否清空
      keywords: '', // 搜索关键字
      packageTabIndex: this.$store.state.packageTabIndex,
      links: links,
      currentType: 30,
      counts: {}
    }
  },
  mixins: [minxinCommon],
  created () {
    // 根据底部菜单设置不同的tabindex选中
    this.setTabIndex()
    // 获取包裹列表合箱分箱待支付等对应的统计数量
    this.packageCountList()
  },
  watch: {
    'keywords': {
      handler: function (newV, oldV) {
        this.isClear = !!this.keywords.trim()
      }
    }
  },
  methods: {
    clearInput () {
      this.keywords = ''
      this.isClear = false
      this.$nextTick(() => {
        this.$refs.inputVal.focus()
      })
    },
    switchSearch () {
      this.keywords = ''
      this.isSearch = !this.isSearch
      if (!this.isSearch) {
        return
      }
      this.$nextTick(() => {
        this.$refs.inputVal.focus()
      })
    },
    calcBadgeCount (count, index) {
      count = count || 0
      if (index === 3) {
        return ''
      } else {
        return count.toString()
      }
    },
    // 根据底部菜单设置不同的tabindex选中
    setTabIndex () {
      let type = this.$route.params.type
      if (type === 'appointment') { // 底部菜单点击自提预约
        this.currentType = 83
        this.packageTabIndex = 3
        this.SET_PACKAGETABINDEX(3)
      } else {
        // 此处是从缓存中取值，然后让tab跟着跳转
        this.currentType = links[this.packageTabIndex].link
      }
      if (Number(this.$route.query.index) === 0) {
        this.packageTabIndex = 3
        this.currentType = 0
      }
    },
    // 获取包裹列表合箱分箱待支付等对应的统计数量
    packageCountList () {
      getPackageCountList().then(res => {
        if (res.code === this.GLOBAL.code) {
          let allCount = 0 // 全部訂單數量累加
          let nopayCount = 0 // 待支付累加：当包裹状态大于等于80的时候，如果freightPayFlag=20或者taxPayFlag=20就是待支付的包裹
          res.data.forEach(val => {
            if (val.statusFlag === 53) {
              this.counts[53] = val.count
            } else if (val.statusFlag === 55) {
              this.counts[55] = val.count
            } else if (val.statusFlag >= 80 && (val.freightPayFlag === 20 || val.taxPayFlag === 20)) {
              nopayCount += val.count
            }
            allCount += val.count
          })
          this.counts[20] = nopayCount
          this.counts[0] = allCount
          this.links.forEach(val => {
            if (val.link === 53) {
              val.count = this.counts[53]
            } else if (val.link === 55) {
              val.count = this.counts[55]
            } else if (val.link === 20) {
              val.count = this.counts[20]
            } else {
              val.count = 0
            }
          })
        }
      })
    },
    onGoMerge () {
      this.packageTabIndex = 1
      this.SET_PACKAGETABINDEX(1)
      this.currentType = links[1].link
    },
    // 输入搜索
    searchPackage () {
      this.$refs.packageList.obj.packageNo = this.keywords.trim()
      this.$refs.packageList.obj.pageNum = 1
      this.$refs.packageList.items = []
      this.$refs.packageList.getData()
    },
    onItemClick (index) {
      this.SET_PACKAGETABINDEX(index)
      this.currentType = links[index].link
      this.$refs.packageList.obj.packageNo = this.keywords.trim()
      this.$refs.packageList.obj.pageNum = 1
      this.$refs.packageList.obj.packageStatus = this.currentType
      this.$refs.packageList.items = []
      this.$refs.packageList.getData()
    },
    ...mapMutations(['SET_PACKAGETABINDEX'])
  },
  components: {
    Tab,
    TabItem,
    packageList
  }
}
</script>

<style lang="less">
  @import "../../assets/less/variable.less";
  .mainland-pack {
    position: absolute;
    width: 100%;
    top: 0px;
    bottom: 0px;
    overflow: hidden;
    .icon-search,
    .icon-close {
      font-size: 0.32rem;
      font-weight: 600;
      padding: 0.16rem;
      margin-right: -0.3rem;
      color: #999;
    }
    .search-panel {
      font-size: 0.28rem;
      background: #fff;
      position: absolute;
      top: 0.88rem;
      z-index: 99;
      height: 0.8rem;
      display: flex;
      padding: 0 0.24rem;
      align-items: center;
      left: 0;
      right: 0;
      input {
        flex: 1;
      }
      .icon-close {
        margin-right: 0;
      }
      .icon-search {
        margin-right: 0;
      }
    }
    .scroll {
      height: 100%;
      overflow: hidden;
      .scroll-item {
        padding-bottom: 2rem;
        .item {
          margin: 0.2rem 0.18rem;
          background: #fff;
          font-size: 0.24rem;
          .signflag-div {
            color: #666;
            padding-left: 0.18rem;
            padding-top: 0.04rem;
          }
          .item-row {
            display: flex;
            padding: 0.2rem;
            border-bottom: 1px solid #f2f2f2;
            justify-content: space-between;
            line-height: 0.4rem;
            .col1 {
              color: #666;
            }
          }
          .item-btn {
            padding: 0.1rem 0.2rem;
            display: flex;
            justify-content: space-between;
            .col {
              flex: 1 0 auto;
              margin: 0 0.05rem;
              // &:nth-child(2) {
              //   margin-left: 0.1rem;
              // }
            }
          }
          .flow-wrapper {
            display: flex;
            padding: 0.36rem 0 0.4rem 0;
            text-align: center;
            border-bottom: 1px solid #f2f2f2;
            margin-bottom: 0.1rem;
            position: relative;
            .start,
            .end {
              width: 26%;
              margin: 0.2rem 0 0.1rem 0;
              p {
              }
            }
            .start {
              padding-right: 0.3rem;
              box-sizing: border-box;
            }
            .end {
              padding-left: 0.3rem;
              box-sizing: border-box;
            }
            .flow-line {
              flex: 1 0 auto;
            }
          }
        }
        .hold {
          height: 30px;
          font-size: 0.24rem;
          color: #999;
          text-align: center;
        }
      }
    }
    .tips {
      color: @error;
      padding: 0.2rem 0;
      background: @warning;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
<style lang="less">
  .flow-wrapper {
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
        font-size: 0.24rem;
      }
    }
  }

  .mypackage .vux-tab-wrap {
    position: fixed;
    width: 100%;
    height: 44px;
    left: 0;
    z-index: 100;
    padding-top: 0;
  }
</style>
