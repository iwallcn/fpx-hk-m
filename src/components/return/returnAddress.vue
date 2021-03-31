<template>
  <Scroll ref="scroll"
    class="scroll"
    :data="items"
    :pullup="pullup"
    @scrollToEnd="scrollToEnd">
    <div :class="['scroll-item', items.length ? 'pb-2' : '']"
      ref="scrollItem">
      <div class="item"
        v-for="(item, index) in items"
        :key="index">
        <div class="check-box"
          @click="handleSelectAddress(item, items)">
          <i :class="['iconfont', item._checked ? 'icon-check': 'icon-nocheck']"></i>
        </div>
        <div class="infos">
          <div class="rows">
            <div class="col"><span>{{item.firstName}}</span></div>
            <div class="col2">{{item.areaCode}}-{{item.phone}}</div>
          </div>
          <p>{{item.country}}，{{item.province}}，{{item.city}}，{{item.district}}，{{item.detailAddress}}</p>
        </div>
        <div class="btns">
          <i class="iconfont icon-edit"
            @click="handlerEdit(item, 'edit')"></i>
          <i class="iconfont icon-delete"
            @click="handlerDelete(item.id)"></i>
          <template v-if="item.defaultFlag">
            <span class="default">默認</span>
          </template>
          <template v-else>
            <x-switch title=""
              v-model="item.defaultFlag"
              @on-change="switchDefault(item.id)"></x-switch>
          </template>
        </div>
      </div>
    </div>
    <!-- 无数据 -->
    <div class="nodata"
      v-show="items.length == 0">
      <i class="iconfont icon-nodata"></i>
      <p>{{itemDataInfo}}</p>
    </div>
    <div class="hold"
      v-if="isOver">--- 我也是有底線的 ---</div>

    <!-- 删除弹出框 -->
    <div v-transfer-dom>
      <confirm v-model="deleteConfirm"
        @on-confirm="sureConfirm"
        title="提示">
        <p style="text-align:center;">您确定要删除吗？</p>
      </confirm>
    </div>

    <footer class="footer-fixed">
      <button class="btn-ml"
        @click="handlerEdit('', 'add')">新增地址</button>
    </footer>
  </Scroll>
</template>

<script>
import * as API from '@/api/myAddress'
import { mapMutations, mapGetters } from 'vuex'
import Scroll from '@/common/scroll/scroll'
import { Confirm, XSwitch } from 'vux'

export default {
  name: 'sendAddress',
  data () {
    return {
      items: [],
      currentId: '',
      page: {
        pageNum: 1,
        pageSize: 10,
        classifyType: 1
      },
      pullup: true,
      totalPages: '',
      isOver: false,
      deleteConfirm: false,
      defaultFlag: false, // 是否設置為默認
      itemDataInfo: ''
    }
  },
  created () {
    this.getUserAddressPageByUserId()
  },
  methods: {
    ...mapGetters(['returnAddress']),
    // 設置默認
    switchDefault (id) {
      API.setDefaultFlag(id).then(res => {
        this.$vux.toast.text(res.message)
        if (res.code === this.GLOBAL.code) {
          this.items = []
          this.getUserAddressPageByUserId()
        }
      })
    },
    // 获取地址列表
    getUserAddressPageByUserId () {
      this.itemDataInfo = '正在加載中...'
      API.getUserAddressPageByUserId(this.page).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.totalPages = res.totalPages
          if (!res.result || res.result.length === 0) {
            this.itemDataInfo = '暫無數據哦'
            return
          }
          for (let v of res.result) {
            let id = this.returnAddress().id
            v._checked = id === v.id
          }
          this.items = this.items.concat(res.result)
          this.$refs.scroll.refresh()
        }
      })
    },
    scrollToEnd () {
      if (this.page.pageNum < this.totalPages) {
        this.page.pageNum++
        this.getUserAddressPageByUserId()
      } else {
        this.$refs.scroll.refresh()
      }
      if (this.page.pageNum === this.totalPages && this.$refs.scrollItem.clientHeight > document.body.clientHeight) {
        this.isOver = true
      }
    },
    // 新增编辑地址
    handlerEdit (item, flag) {
      if (flag === 'edit') {
        this.SET_RETURN_ADDRESS(item)
      }
      this.$router.push({ name: 'returnAddressAdd', query: { editAdd: flag } })
      // if (this.$route.query && this.$route.query.from === 'order') { // 标记是从下单那里跳转过来的
      //   this.$router.push({ name: 'sendEdit', query: { editAdd: flag, from: 'order', packageAttribute: this.$route.query.packageAttribute } })
      // } else {
      //   this.$router.push({ name: 'sendEdit', query: { editAdd: flag, packageAttribute: this.$route.query.packageAttribute } })
      // }
    },
    // 删除地址
    handlerDelete (id) {
      this.deleteConfirm = !this.deleteConfirm
      this.currentId = id
    },
    // 确定删除
    sureConfirm () {
      API.deleteUserAddress(this.currentId).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.$vux.toast.text('操作成功')
          this.items = this.items.filter((item, index) => item.id !== this.currentId)
        } else {
          this.$vux.toast.text(res.message)
        }
      })
    },
    // 选择地址
    handleSelectAddress (item, items) {
      for (let v of items) v._checked = false
      item._checked = true
      this.SET_RETURN_ADDRESS(item)
      if (this.$route.query.fpxOrderId) { // 編輯
        this.$router.replace({ name: 'returnEdit', query: { fpxOrderId: this.$route.query.fpxOrderId } })
      } else { // 新增
        this.$router.replace({ name: 'returnAdd' })
      }
      this.$router.go(-1)
      // this.$router.push({ name: 'returnAdd', query: { fpxOrderId: this.$route.query.fpxOrderId } })
    },
    ...mapMutations(['SET_RETURN_ADDRESS'])
  },
  components: {
    Scroll,
    Confirm,
    XSwitch
  }
}
</script>
<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .scroll {
    position: absolute;
    width: 100%;
    top: 0px;
    bottom: 0;
    overflow: hidden;
    .pb-2 {
      padding-bottom: 2rem;
    }
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
      // position: absolute;
      // top: 1rem;
      // left: 2.5rem;
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
      padding: 0.2rem;
      display: flex;
      margin-bottom: 0.2rem;
      &.offline {
        background: #eee;
      }
      .check-box {
        width: 7%;
        padding: 0.3rem 0.1rem 0.3rem 0;
        .iconfont {
          font-size: 0.4rem;
          color: @primary;
        }
      }
      .infos {
        padding-right: 1%;
        width: 57%;
        &.normal {
          width: 64%;
        }
        .rows {
          display: flex;
          padding: 0.14rem 0;
          .col {
            margin-right: 0.2rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            max-width: 2rem;
          }
          .col2 {
            color: #999;
            max-width: 3rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        p {
          color: #999;
          line-height: 0.32rem;
          font-size: 0.26rem;
        }
      }
      .btns {
        display: flex;
        align-items: center;
        width: 36%;
        i {
          font-size: 0.54rem;
          color: #666;
          padding: 0.13rem 0.1rem;
          cursor: pointer;
        }
        .icon-delete {
          color: @error;
        }
        .icon-edit {
          color: @primary;
        }
        .weui-cell {
          padding: 0 !important;
          font-size: 0 !important;
        }
      }
      .default {
        background: #ff6400;
        font-size: 0.24rem;
        padding: 0.16rem 0.24rem;
        color: #fff;
        border-radius: 24px;
        display: inline-block;
      }
    }
  }
</style>
