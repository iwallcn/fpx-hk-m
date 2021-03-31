<template>
  <div class="restrictionsPage">
    <group class="contraband">
      <search v-model="keywords"
        position="relative"
        top="0.96rem"
        placeholder="支持輸入關鍵字/簡體字 查看禁運品詳情"
        @on-change="getResult"
        @on-result-click="resultClick"
        @on-cancel="clearResult"
        @on-clear="clearResult"
        :results="results"></search>
    </group>
    <div class="data-wrapper">
      <template v-if="results">
        <div class="tips"
          v-html="message"></div>
        <h4>{{title}}</h4>
        <ul>
          <li v-for="(val, index) in results"
            :key="index">{{val.title}}</li>
        </ul>
      </template>
      <template v-else>
        <div class="tips"
          v-html="message"></div>
      </template>
    </div>

    <div class="content"
      v-html="note">
    </div>
  </div>
</template>

<script>
import { getNavigationPageInfo } from '@/api/banners'
import { Group, Search } from 'vux'
import { getContraBands, getNameList } from '@/api/contraband'
export default {
  name: 'restrictions',
  data () {
    return {
      note: '',
      keywords: '', // 輸入關鍵字
      results: [], // 搜索的所有條目
      chkItem: '', // 選中的項目
      title: '', // 標題
      message: ''
    }
  },
  created () {
    this.id = this.$route.params.type || 'contraband' // 获取动态路由参数
    this.fetchData()
  },
  watch: {
    // 由于是动态路由参数，会导致组件被复用，组件的生命周期失效，故这里采用监听路由，一旦路由有变化，则会执行fetchData函数
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      getNavigationPageInfo(this.id).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.note = res.data.note
        } else {
          this.$vux.toast.text('請檢查是否已配置了該路由')
        }
      })
    },
    // 輸入內容查詢
    getResult () {
      if (!this.keywords.trim()) {
        return
      }
      this.results = []
      this.message = ''
      this.title = ''
      getNameList(this.keywords).then(res => {
        if (res.code === this.GLOBAL.code && res.data && res.data.length) {
          res.data.forEach(val => {
            this.results.push({
              title: val.contraBandParentTypeName + ' - ' + val.contraBandName,
              name: val.contraBandName
            })
          })
        } else {
          this.message = `<i class="iconfont icon-tishi"></i> 暫時未能找到相關禁運信息</br>溫馨提示：您可換一個關鍵字繼續搜索；或者聯繫在線客服進一步確認。`
        }
      })
    },
    // 点击某一项
    resultClick (item) {
      this.results = []
      this.keywords = item.name
      getContraBands({ contraBandName: this.keywords }).then(res => {
        if (res.code === this.GLOBAL.code && res.data && Object.keys(res.data).length) {
          this.title = Object.keys(res.data)[0]
          let data = res.data[this.title]
          data.forEach(val => {
            this.results.push({
              title: val.contraBandParentTypeName + ' - ' + val.contraBandName
            })
          })
          this.message = `<i class="iconfont icon-tishi"></i> 經初步篩查，“${this.keywords}”屬於敏感品</br>溫馨提示：可能會有拒收或者退運的風險，如有疑問可聯繫在線客服進一步確認。`
        } else {
          this.message = `<i class="iconfont icon-tishi"></i> 暫時未能找到相關禁運信息</br>溫馨提示：您可換一個關鍵字繼續搜索；或者聯繫在線客服進一步確認。`
        }
      })
    },
    // 點擊x清空搜索條目和提示信息
    clearResult () {
      this.results = []
      this.message = ''
      this.title = ''
    }
  },
  components: {
    Group,
    Search
  }
}
</script>
<style lang="less">
  .restrictionsPage {
    width: 100%;
    background: #fff;
    box-sizing: border-box;
    overflow-x: hidden;
    .weui-cells {
      margin-top: 0;
      &.vux-search_show {
        position: relative !important;
      }
    }
    .contraband {
      position: fixed;
      width: 100%;
    }
    .data-wrapper {
      margin-top: 1rem;
      font-size: 0.3rem;
      h4 {
        color: @primary;
        margin: 0.3rem 0.2rem;
        font-weight: bold;
      }
      ul {
        li {
          margin: 0.2rem 0.2rem 0.2rem 0.4rem;
        }
      }
      .tips {
        text-align: center;
        color: #999;
        padding: 0 0.4rem;
        line-height: 0.5rem;
        background: #fff;
        i {
          color: @primary;
        }
      }
    }
    .title {
      font-size: 0.4rem;
      line-height: 0.4rem;
      padding: 0.2rem;
      font-weight: bold;
    }
    .content {
      font-size: 0;
      img {
        width: 100% !important;
        height: auto !important;
      }
    }
  }
</style>
