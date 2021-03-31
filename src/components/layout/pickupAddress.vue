<template>
  <div class="mainland">
    <img v-lazy="imgUrl">
    <tab v-model="appointTabIndex"
      :line-width=2
      :scroll-threshold=5>
      <tab-item v-for="(tab, index) in links"
        :key="index"
        @on-item-click="onItemClick">
        {{tab.label}}
      </tab-item>
    </tab>
    <group class="mt">
      <search v-model="obj.searchKey"
        position="relative"
        top="0.96rem"
        placeholder="根據自提點名稱/智能柜名稱模糊查詢"
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
          label-width="2rem"
          :key="index">
          <cell :title="calcTitle"
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
import { Group, Cell, Tab, TabItem, Search } from 'vux'
import Scroll from '@/common/scroll/scroll'
import { getHkSimsInfoPage } from '@/api/myAddress'

const links = [
  {
    label: '自提點',
    link: 0
  },
  {
    label: '智能柜',
    link: 1
  }
]

export default {
  name: 'pickupAddress',
  data () {
    return {
      imgUrl: require('@/assets/image/loc2-banner1.jpg'),
      links: links,
      appointTabIndex: 0,
      results: [], // 搜索結果面板
      obj: {
        pageNum: 1,
        pageSize: 10,
        deliveryType: 1,
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
      getHkSimsInfoPage(this.obj).then(res => {
        if (res.code === this.GLOBAL.code) {
          if (!res.result || res.result.length === 0) {
            this.itemDataInfo = '暫無數據哦'
            return
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
    onItemClick (index) {
      this.deliveryType = index + 1
    },
    // 搜索点击取消,清空搜索重新加载所有列表
    cancelSearch () {
      this.items = []
      this.results = []
      this.obj.deliveryType = this.appointTabIndex + 1
      this.obj.searchKey = ''
      this.getData()
    },
    // 自提點搜索結果面板中點擊任意一項
    resultClick (item) {
      console.log(9999)
      this.obj.searchKey = item.title
      this.items = []
      this.results = []
      this.getData()
    },
    getResult () {
      this.results = []
      this.obj.deliveryType = ''
      if (this.obj.searchKey) {
        getHkSimsInfoPage(this.obj).then(res => {
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
    }
  },
  computed: {
    calcTitle () {
      return this.obj.deliveryType === 1 ? '自提點名稱' : '智能柜名稱'
    }
  },
  watch: {
    appointTabIndex (val) {
      this.obj.deliveryType = val + 1
      this.items = []
      this.getData()
    }
  },
  components: {
    Group,
    Cell,
    Tab,
    TabItem,
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
      height: calc(100% - 4.69rem);
      overflow: hidden;
      .hold {
        font-size: 0.24rem;
        color: #999;
        text-align: center;
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
  // .vux-search-box {
  //   .weui-search-bar__box .weui-search-bar__input {
  //     padding: 0.2rem 0 !important;
  //   }
  // }
</style>
