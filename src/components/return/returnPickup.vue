<template>
  <div class="mainland">
    <group class="mt">
      <search v-model="obj.searchKey"
        position="relative"
        top="0.96rem"
        placeholder="根據自提點名稱模糊查詢"
        @on-result-click="resultClick"
        @on-change="getResult"
        @on-cancel="cancelSearch"
        :results="results"></search>
    </group>

    <Scroll class="scroll"
      ref="scroll"
      :data="items"
      :pullup="pullup"
      @scrollToEnd="scrollToEnd">
      <div class="scroll-item"
        ref="scrollItem">
        <group v-for="(item, index) in items"
          class="group-row"
          label-width="1.6rem"
          :key="index">
          <div class="check-box"
            @click="handleSelectPickup(item, items)">
            <i :class="['iconfont', item._checked ? 'icon-check': 'icon-nocheck']"></i>
          </div>
          <div class="infos">
            <cell title="自提點名稱"
              value-align="left"
              :value="item.pickupName"></cell>
            <cell title="詳細電話"
              value-align="left"
              :value="item.servicesPhone"></cell>
            <cell title="營業時間"
              value-align="left"
              :value="item.openingTime"></cell>
            <cell title="詳細地址"
              value-align="left"
              :value="item.address"></cell>
          </div>
        </group>
        <div class="nodata"
          v-if="items.length == 0">
          <i class="iconfont icon-nodata"></i>
          <p>{{itemDataInfo}}</p>
        </div>
        <div class="hold"
          v-if="isOver">--- 我也是有底线的 ---</div>
      </div>
    </Scroll>
  </div>
</template>

<script>
import { Group, Cell, Search } from 'vux'
import Scroll from '@/common/scroll/scroll'
import { getAllPudo } from '@/api/myAddress'
import { mapMutations } from 'vuex'

export default {
  name: 'pickupAddress',
  data () {
    return {
      results: [], // 搜索結果面板
      obj: {
        pageNum: 1,
        pageSize: 10,
        provinceCode: '',
        cityCode: '',
        searchKey: '' // 搜索輸入框
      },
      pullup: true,
      totalPages: '',
      isOver: false,
      items: [],
      itemDataInfo: ''
    }
  },
  created () {
    this.getData() // 加载自提点柜列表数据
  },
  methods: {
    getData () {
      this.itemDataInfo = '正在加載中...'
      getAllPudo(this.obj).then(res => {
        if (res.code === this.GLOBAL.code) {
          if (!res.result || res.result.length === 0) {
            this.itemDataInfo = '暫無數據哦'
            return
          }
          for (let v of res.result) {
            let pickupCode = this.$store.state.returnPickupAddress.pickupCode
            v._checked = pickupCode === v.pickupCode
          }
          this.items = this.items.concat(res.result)
          this.totalPages = res.totalPages
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
    // 搜索点击取消,清空搜索重新加载所有列表
    cancelSearch () {
      this.items = []
      this.results = []
      this.obj.searchKey = ''
      this.getData()
    },
    // 自提點搜索結果面板中點擊任意一項
    resultClick (item) {
      this.obj.searchKey = item.title
      this.items = []
      this.results = []
      this.getData()
    },
    getResult () {
      this.results = []
      if (this.obj.searchKey) {
        getAllPudo(this.obj).then(res => {
          if (res.code === this.GLOBAL.code) {
            this.results = []
            res.result.forEach(val => {
              this.results.push({
                title: val.pickupName
              })
            })
          }
        })
      }
    },
    handleSelectPickup (item, items) {
      for (let v of items) v._checked = false
      item._checked = true
      this.SET_RETURN_PICKUPADDRESS(item)
      if (this.$route.query.fpxOrderId) { // 編輯
        this.$router.replace({ name: 'returnEdit', query: { fpxOrderId: this.$route.query.fpxOrderId } })
      } else { // 新增
        this.$router.replace({ name: 'returnAdd' })
      }
      this.$router.go(-1)
      // this.$router.push({ name: 'returnAdd', query: { fpxOrderId: this.$route.query.fpxOrderId } })
    },
    ...mapMutations(['SET_RETURN_PICKUPADDRESS'])
  },
  components: {
    Group,
    Cell,
    Search,
    Scroll
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .mainland {
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    overflow: hidden;
    .scroll {
      height: calc(100% - 44px);
      overflow: hidden;
      .hold {
        font-size: 0.24rem;
        color: #999;
        text-align: center;
      }
      .scroll-item {
        margin-top: -16px;
        .group-row {
          .weui-cells {
            display: flex;
            .check-box {
              width: 7%;
              padding-left: 0.2rem;
              margin-right: -0.2rem;
              i {
                font-size: 0.4rem;
                color: @primary;
              }
            }
            .infos {
              flex: 1;
            }
          }
        }
      }
    }
    img {
      width: 100%;
      max-height: 2.8rem;
    }
    .weui-search-bar {
      background-color: #f2f2f2 !important;
    }
  }
</style>
<style lang="less">
  .mt {
    .weui-cells {
      margin-top: 0 !important;
    }
    .weui-search-bar {
      z-index: 1;
    }
  }
  .group-row {
    .weui-cells {
      display: flex;
      align-items: center;
    }
  }
</style>
