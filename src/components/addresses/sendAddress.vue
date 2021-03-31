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
          v-if="$route.query.from === 'order'"
          @click="handleSelectAddress(item, items)">
          <i :class="['iconfont', item._checked ? 'icon-check': 'icon-nocheck']"></i>
        </div>
        <!-- $route.name === 'order' || $route.name === 'receiveclaim' ? '' : 'normal' -->
        <div :class="['infos', $route.query.from === 'order' ? '' : 'normal']">
          <div class="rows">
            <div class="col"><span>{{item.firstName}}</span></div>
            <div class="col2">{{item.areaCode}}-{{item.phone}}</div>
          </div>
          <p>
            <span
            v-if="item.deliveryAddressType"
            style="padding: 0.06rem 0.12rem;background-color: #ccdef8;color: #005adc;border-radius: 0.04rem;display: inline-block;margin-right: 0.15rem;margin-bottom: 0.1rem;"
           >{{item.deliveryAddressType == 1 ? '工商' : '住宅'}}</span>
           {{item.country}}，{{item.province}}，{{item.city}}，{{item.district}}，{{item.detailAddress}}</p>
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

    <!-- 提示完善工商、住宅信息 -->
    <div v-transfer-dom>
      <confirm v-model="showAlert"
        @on-confirm="handlerEdit(editItem, 'edit')"
        confirm-text="確定"
        title="溫馨提示">
        <p style="text-align:center;">根據最新寄件要求，請您編輯派送地址，完善工商、住宅信息。</p>
      </confirm>
    </div>

    <footer class="footer-fixed"
      v-if="$route.name === 'addresses'">
      <button class="btn-ml"
        @click="handlerEdit('', 'add')">新增地址</button>
    </footer>
  </Scroll>
</template>

<script>
import * as API from '@/api/myAddress'
import { mapMutations } from 'vuex'
import Scroll from '@/common/scroll/scroll'
import { Confirm, XSwitch } from 'vux'

export default {
  name: 'sendAddress',
  data () {
    return {
      editItem: null,
      showAlert: false,
      items: [],
      currentId: '',
      page: {
        pageNum: 1,
        pageSize: 10
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
            let id = this.$store.state.orderAddress.id || this.$store.state.orderAddress.userAddressId
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
        if (!item.deliveryAddressType) {
          item.deliveryAddressType = 0
        }
        this.SET_CURRENTUSERADDRESS(item)
      }
      if (this.$route.query && this.$route.query.from === 'order') { // 标记是从下单那里跳转过来的
        this.$router.push({ name: 'sendEdit', query: { editAdd: flag, from: 'order', packageAttribute: this.$route.query.packageAttribute } })
      } else {
        this.$router.push({ name: 'sendEdit', query: { editAdd: flag, packageAttribute: this.$route.query.packageAttribute } })
      }
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
      if (!item.deliveryAddressType) {
        item.deliveryAddressType = 0
        this.editItem = item
        this.showAlert = true
        return
      }
      for (let v of items) v._checked = false
      this.$emit('choose', item)
    },
    ...mapMutations(['SET_CURRENTUSERADDRESS'])
  },
  components: {
    Scroll,
    Confirm,
    XSwitch
  }
}
</script>
