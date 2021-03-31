<template>
  <Scroll ref="scroll"
    class="scroll"
    :data="items"
    :pullup="pullup"
    @scrollToEnd="scrollToEnd">
    <div :class="['scroll-item', items.length ? 'pb-2' : '']"
      ref="scrollItem">
      <div v-for="(item, index) in items"
        :class="['item', { 'offline': item.status === 'OFFLINE' } ]"
        :key="index">
        <div class="check-box"
          v-if="$route.query.from === 'order' && (['OFFLINE', 'OUT'].indexOf(item.status) === -1)"
          @click="handleSelectAddress(item, items)">
          <i :class="['iconfont', item._checked ? 'icon-check': 'icon-nocheck']"></i>
        </div>
        <div :class="['infos', $route.query.from === 'order' ? '' : 'normal']">
          <div class="rows">
            <div style="white-space: nowrap;">
              <span v-if="item.status === 'OFFLINE'"
                style="color:red;">[已下线]</span>
              <span v-if="item.status === 'OUT'"
                style="color:red;">[超出范围]</span>
            </div>
            <div class="col">
              {{item.recipientsName}}
            </div>
            <div class="col2">{{item.areaCode}}-{{item.phoneNumber}}</div>
          </div>
          <p>{{item.pickupName}}</p>
          <!-- <p>{{item.pickUpAddress}}</p> -->
        </div>
        <div class="btns">
          <i class="iconfont icon-edit"
            v-if="['OFFLINE', 'OUT'].indexOf(item.status) === -1"
            @click="handlerEdit(item, 'edit', 1)"></i>
          <i class="iconfont icon-delete"
            @click="handlerDelete(item.recipientsId)"></i>
          <template v-if="item.defaultFlag">
            <span class="default">默認</span>
          </template>
          <template v-else>
            <x-switch title=""
              v-if="['OFFLINE', 'OUT'].indexOf(item.status) === -1"
              :disabled="item.status === 'OFFLINE'"
              v-model="item.defaultFlag"
              @on-change="switchDefault(item.recipientsId, item.deliveryType)"></x-switch>
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
      v-if="isOver">--- 我也是有底线的 ---</div>

    <!-- 删除弹出框 -->
    <div v-transfer-dom>
      <confirm v-model="deleteConfirm"
        @on-confirm="sureConfirm"
        title="提示">
        <p style="text-align:center;">您确定要删除吗？</p>
      </confirm>
    </div>

    <footer class="footer-fixed"
      v-if="$route.name === 'addresses'">
      <button class="btn-ml"
        @click="handlerEdit('', 'add', 1)">新增地址</button>
    </footer>
  </Scroll>
</template>

<script>
import * as API from '@/api/myAddress'
import { mapMutations } from 'vuex'
import Scroll from '@/common/scroll/scroll'
import minxinCommon from './minxinCommon.js'
import { Confirm, XSwitch } from 'vux'

export default {
  name: 'pointAddress',
  data () {
    return {
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
      itemDataInfo: ''
    }
  },
  created () {
    this.getPointAddress()
  },
  mixins: [minxinCommon],
  methods: {
    // 設置默認
    switchDefault (id, type) {
      API.setSelfDefaultFlag(id, type).then(res => {
        this.$vux.toast.text(res.message)
        if (res.code === this.GLOBAL.code) {
          this.items = []
          this.getPointAddress()
        }
      })
    },
    // 获取当前用户自提点列表-分页
    getPointAddress () {
      this.itemDataInfo = '正在加載中...'
      API.getPickUpRecipientsSimsPudoPage(this.page).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.totalPages = res.totalPages
          if (!res.result || res.result.length === 0) {
            this.itemDataInfo = '暫無數據哦'
            return
          }
          for (let v of res.result) {
            let id = this.$store.state.orderAddress.recipientsId || this.$store.state.orderAddress.userAddressId
            v._checked = id === v.recipientsId
          }
          this.items = this.items.concat(res.result)
          this.$refs.scroll.refresh()
        }
      })
    },
    scrollToEnd () {
      if (this.page.pageNum < this.totalPages) {
        this.page.pageNum++
        this.getPointAddress()
      } else {
        this.$refs.scroll.refresh()
      }
      if (this.page.pageNum === this.totalPages && this.$refs.scrollItem.clientHeight > document.body.clientHeight) {
        this.isOver = true
      }
    },
    // 新增编辑地址
    handlerEdit (item, flag, type) {
      if (flag === 'edit') {
        this.SET_CURRENTUSERADDRESS(item)
      }
      if (this.$route.query && this.$route.query.from === 'order') { // 标记是从下单那里跳转过来的
        this.$router.push({ name: 'pickupEdit', query: { editAdd: flag, deliveryType: type, from: 'order' } })
      } else {
        this.$router.push({ name: 'pickupEdit', query: { editAdd: flag, deliveryType: type } })
      }
    },
    // 选择地址
    handleSelectAddress (item, items) {
      for (let v of items) v._checked = false
      let info = this.$store.state.userBaseInfo
      let text = '本站自提點免倉租期已調整為3天，請及時前往自提点提貨。'
      if (info && info.memberLabelList) {
        for (let v of info.memberLabelList) {
          if (v.labelCode === 'HKCNCZ') {
            text = '為感謝您一直以來的支持，包裹到達該自提點後，可享受14天免倉租期。'
          }
        }
      } else {
        text = '本站自提點免倉租期已調整為3天，請及時前往自提点提貨。'
      }
      this.$vux.toast.text(text)
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
