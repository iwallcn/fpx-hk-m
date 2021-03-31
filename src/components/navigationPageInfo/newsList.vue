<template>
  <div ref="wrapper" class="news-list">
    <div class="refresh-tip">{{ refreshTip }}</div>
    <ul>
      <li v-for="item in newsList" :key="item.id" class="list-item">
        <cell-box is-link :link="{ path: `/news/${item.secondDirectory}` }">
          <div>
            <p>
              <span v-if="item.sortTop" class="sort-top">[置頂]&nbsp;</span
              >{{ item.title }}
            </p>
            <p class="item-time">{{ item.createTime }}</p>
          </div>
        </cell-box>
      </li>
    </ul>
    <div class="hold">
      <template v-if="loading"> --- 正在加載... --- </template>
      <template v-else-if="!hasMore"> --- 我也是有底線的 --- </template>
      <template v-else> --- 上滑加載更多 --- </template>
    </div>
  </div>
</template>

<script>
import { CellBox } from 'vux'
import { newsInfos } from '@/api/personalInfo'
import Fmover from 'finger-mover'
import simulationScrollY from 'simulation-scroll-y'

export default {
  name: 'newsList',
  data () {
    return {
      pageNum: 1,
      pageSize: 25,
      totalPages: 0,
      newsList: [],
      fm: null,
      loading: false,
      refreshTip: '下拉刷新'
    }
  },
  computed: {
    hasMore () {
      return this.pageNum < this.totalPages
    }
  },
  created () {
    this.loading = true
    this.initDataPromise = this.handleLoadMore()
    this.loading = false
  },
  mounted () {
    setTimeout(async () => {
      await this.initDataPromise
      const vm = this
      this.fm = new Fmover({
        el: this.$refs.wrapper,
        plugins: [
          simulationScrollY({
            pullDown: {
              use: true,
              distance: 30,
              onBegin: function (currentY) {
                let proportion = parseInt((currentY / 30) * 100)
                if (proportion >= 100) {
                  proportion = 100
                  vm.refreshTip = '釋放刷新'
                }
              },
              onActive: async function () {
                vm.refreshTip = '加載中...'
                try {
                  await vm.refreshData()
                } catch (error) {
                  console.error(error)
                }
                this.refresh(function () {
                  vm.refreshTip = '下拉刷新'
                })
              },
              onAfter: function (currentY) {
                if (currentY < 50) {
                  vm.refreshTip = '下拉刷新'
                }
              }
            },
            loadMore: {
              distance: 0,
              onLoadMore: async function () {
                if (vm.pageNum < vm.totalPages) {
                  vm.loading = true
                  vm.pageNum++
                  try {
                    await vm.handleLoadMore()
                  } catch (error) {
                    vm.pageNum--
                  }
                  vm.loading = false
                  this.loadEnd()
                }
              }
            }
          })
        ]
      })
    })
  },
  methods: {
    async fetchData () {
      const { pageNum, pageSize } = this
      const { code, data } = await newsInfos({ pageNum, pageSize })
      if (code === this.GLOBAL.code) {
        const {
          result = [],
          pageNum = 1,
          pageSize = this.pageSize,
          totalPages = 0
        } = data
        this.pageNum = pageNum
        this.pageSize = pageSize
        this.totalPages = totalPages
        return result
      }
      return null
    },
    async handleLoadMore () {
      const data = await this.fetchData()
      if (!data) {
        return
      }
      this.newsList = [...this.newsList, ...data]
    },
    async refreshData () {
      const pageNum = this.pageNum
      const pageSize = this.pageSize
      const totalPages = this.totalPages
      this.pageNum = 1
      this.pageSize = pageNum * pageSize
      const data = await this.fetchData()
      this.newsList = data || []
      this.pageNum = pageNum
      this.pageSize = pageSize
      this.totalPages = totalPages
    }
  },
  components: {
    CellBox
  }
}
</script>

<style lang="less" scoped>
.news-list {
  position: relative;
  font-size: 0.32rem;
  .refresh-tip {
    position: absolute;
    top: -30px;
    font-size: 0.24rem;
    color: #999;
    text-align: center;
    padding: 5px;
    left: 0;
    right: 0;
    height: 10px;
  }
  .list-item {
    background: #fff;
    border-bottom: 1px solid #f1f1f1;
    line-height: 1.4;
    .sort-top {
      color: @primary;
    }
    .item-time {
      font-size: 0.5em;
      color: #999;
    }
  }
  .hold {
    font-size: 0.24rem;
    color: #999;
    text-align: center;
    padding: 5px;
  }
}
</style>
