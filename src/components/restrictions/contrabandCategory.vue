<template>
  <div class="mainland">
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
      <div class="data-no"
        v-if="message"
        v-html="message"></div>
      <template v-if="chkItem">
        <p class="data-more"
          @click="$router.replace({name: 'restrictions'})">查看更多>></p>
        <div class="data-yes">{{chkItem}}</div>
      </template>
    </div>
  </div>
</template>

<script>
import { Group, Search } from 'vux'
import { getContraBands } from '@/api/contraband'
export default {
  name: 'contrabandCategory',
  data () {
    return {
      title: '禁運品查詢',
      keywords: '', // 輸入關鍵字
      results: [], // 搜索的所有條目
      chkItem: '', // 選中的項目
      message: ''
    }
  },
  created () {
  },
  methods: {
    // 輸入內容查詢
    getResult () {
      if (!this.keywords.trim()) {
        return
      }
      this.results = []
      this.message = ''
      getContraBands({ contraBandName: this.keywords }).then(res => {
        if (res.code === this.GLOBAL.code && res.data && res.data.length) {
          res.data.forEach(val => {
            this.results.push({
              title: val.contraBandParentTypeName + ' - ' + val.contraBandName
            })
          })
          this.message = `<i class="iconfont icon-tishi"></i> 經初步篩查，“${this.keywords}”屬於敏感品</br>溫馨提示：可能會有拒收或者退運的風險，如有疑問可聯繫在線客服進一步確認。`
        } else {
          this.chkItem = ''
          this.message = `<i class="iconfont icon-tishi"></i> 暫時未能找到相關禁運信息</br>溫馨提示：您可換一個關鍵字繼續搜索；或者聯繫在線客服進一步確認。`
        }
      })
    },
    resultClick (item) {
      this.chkItem = item.title
    },
    // 點擊x清空搜索條目和提示信息
    clearResult () {
      this.results = []
      this.message = ''
    }
  },
  components: {
    Group,
    Search
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .mainland {
    .contraband {
      position: fixed;
      width: 100%;
      top: 1rem;
    }
    .data-wrapper {
      margin-top: 1.2rem;
      font-size: 0.3rem;
      .data-yes {
        background: #fff;
        padding: 0.28rem;
      }
      .data-more {
        padding: 0.2rem;
        color: @primary;
        background: #fff;
        text-align: right;
        margin-bottom: 2px;
      }
      .data-no {
        text-align: center;
        color: #999;
        padding: 0.2rem 0.4rem;
        line-height: 0.5rem;
        background: #fff;
        i {
          color: @primary;
        }
      }
    }
  }
</style>
<style lang="less">
  .contraband {
    .weui-cells {
      margin-top: 0;
      &.vux-search_show {
        position: relative !important;
      }
    }
  }
</style>
