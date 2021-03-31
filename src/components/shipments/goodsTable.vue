<template>
  <div class="articles">
    <div style="padding:0 15px;">
      <x-table class="table">
        <thead>
          <tr>
            <th>名称</th>
            <th>单价</th>
            <th>数量</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in goodsList"
            :key="index">
            <td>{{item.goodsName}}</td>
            <td style="padding:0 0.2rem">
              <x-input v-model.trim="item.price"
                :max="20"></x-input>
            </td>
            <td>{{item.number}}</td>
          </tr>
        </tbody>
      </x-table>
    </div>
    <div class="nodata"
      v-show="goodsList.length == 0">
      <i class="iconfont icon-nodata"></i>
      <p>暫無數據哦</p>
    </div>
  </div>
</template>

<script>
import { Confirm, XNumber, Group, PopupPicker, XInput, XTable } from 'vux'
import * as API from '@/api/order'

export default {
  name: 'articles',
  props: {
    goodsList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      deleteConfirm: false,
      categoryList: [],
      orderInfo: {
        warhouse: [],
        fpxNo: ''
      },
      items: [
        {
          goodsName: '',
          categoryCode: '',
          categoryName: '',
          number: 0,
          price: '',
          _currentCategory: []
        }
      ],
      currentId: ''
    }
  },
  created () {
    // this.getData()
    // this.goodsList = this.items
  },
  methods: {
    getData () {
      API.getCategoryBasicList({ categoryName: '' }).then(res => {
        if (res.code === this.GLOBAL.code) {
          for (let v of res.data) {
            v.name = v.categoryName
            v.value = v.categoryCode
          }
          this.categoryList = [res.data] || []
        }
      })
    },
    onCategoryChange (item) {
      let code = item._currentCategory[0]
      if (!code) return
      for (let v of this.categoryList[0]) {
        if (v.categoryCode === code) {
          item.categoryCode = code
          item.categoryName = v.categoryName
        }
      }
    },
    handleCopy (item, rows) {
      let newItem = JSON.parse(JSON.stringify(item))
      this.$emit('add', newItem)
    },
    handleDelete (index, rows) {
      this.$emit('delete', index)
    },
    // 新增编辑地址
    handlerEdit (item, flag) {
    },
    // 删除地址
    handlerDelete (id) {
      this.deleteConfirm = !this.deleteConfirm
      this.currentId = id
    },
    // 确定删除
    sureConfirm () {
    }
  },
  components: {
    Confirm,
    XNumber,
    Group,
    PopupPicker,
    XInput,
    XTable
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .articles {
    width: 100%;
    .hold {
      font-size: 0.24rem;
      color: #999;
      text-align: center;
    }
    .scroll {
      height: 100%;
      overflow: hidden;
    }
    .nodata {
      text-align: center;
      padding: 0.5rem;
      color: #999;
      background: #fff;
      i {
        font-size: 0.8rem;
        transform: rotate(30deg);
        display: block;
      }
      p {
        font-size: 0.24rem;
        padding-top: 0.2rem;
      }
    }
    .hold {
      height: 20px;
    }
    .item {
      font-size: 0.28rem;
      background: #fff;
      padding: 0.1rem 0.3rem;
      margin-bottom: 0.2rem;
      &-toolbar {
        height: 0.6rem;
        line-height: 0.6rem;
        position: relative;
        .iconfont {
          font-size: 0.5rem;
          color: @primary;
          padding: 0.1rem;
          position: absolute;
          top: 0.1rem;
        }
        .icon-delete {
          right: 0.3rem;
        }
        .icon-copy {
          right: 1rem;
        }
      }
    }
  }
</style>

<style lang="less">
  .articles {
    .table {
      td {
        width: 33.33%;
      }
    }
  }
</style>
