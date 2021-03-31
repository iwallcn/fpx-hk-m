<template>
  <div class="appointment-wrapper">
    <tab v-model="appointTabIndex"
      :line-width=2
      :scroll-threshold=5>
      <tab-item v-for="(tab, index) in links"
        @on-item-click="onItemClick"
        :key="index">
        {{tab.label}}
      </tab-item>
    </tab>

    <!-- 预约列表 -->
    <appoint-list :appointTabIndex="appointTabIndex"
      @handlerSelectData="handlerSelectData"></appoint-list>
  </div>
</template>

<script>
import { Tab, TabItem } from 'vux'
import appointList from './list'
const links = [
  {
    label: '待预约',
    link: 0
  },
  {
    label: '我的预约',
    link: 1
  }
]

export default {
  name: 'appointment',
  data () {
    return {
      links: links,
      appointTabIndex: 0,
      selectData: []
    }
  },
  methods: {
    // 未預約中選擇包裹
    handlerSelectData (selectData, appointTabIndex) {
      this.selectData = selectData
      this.$emit('handlerAppointData', selectData, appointTabIndex)
    },
    onItemClick (index) {
      this.$emit('handlerAppointData', this.selectData, index)
    }
  },
  components: {
    Tab,
    TabItem,
    appointList
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .icon-check {
    color: @primary;
  }
  .appointment-wrapper {
    margin: 0.2rem 0.18rem;
    background: #fff;
    font-size: 0.24rem;
    .thead {
      display: flex;
      font-size: 0.28rem;
      align-items: center;
      height: 1rem;
      background-color: #fff;
      .th {
        &:nth-child(1) {
          width: 10%;
          height: 100%;
          align-items: center;
          display: flex;
          justify-content: center;
        }
        &:nth-child(2) {
          width: 28%;
        }
        &:nth-child(3) {
          width: 24%;
          text-align: right;
        }
        &:nth-child(4) {
          width: 40%;
          .vux-cell-box {
            position: relative;
            display: flex;
            justify-content: center;
            margin: 0 auto;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            align-items: center;
            padding: 0.2rem 0;
            &:after {
              content: " ";
              display: inline-block;
              height: 6px;
              width: 6px;
              border-width: 2px 2px 0 0;
              border-color: #c8c8cd;
              border-style: solid;
              position: relative;
              transform: rotate(134deg);
              margin-bottom: 4px;
              margin-left: 6px;
            }
          }
        }
      }
    }
    .tbody {
      .tr {
        display: flex;
        font-size: 0.28rem;
        align-items: center;
        height: 1.1rem;
        &:nth-child(2n + 1) {
          background-color: #f2f2f2;
        }
        &:nth-child(2n) {
          background-color: #fff;
        }
        .td {
          &:nth-child(1) {
            width: 10%;
            height: 100%;
            align-items: center;
            display: flex;
            justify-content: center;
          }
          &:nth-child(2) {
            width: 42%;
          }
          &:nth-child(3) {
            width: 9%;
            text-align: center;
          }
          &:nth-child(4) {
            width: 40%;
            text-align: center;
            color: @primary;
          }
          &.infos {
            p {
              margin-bottom: 0.1rem;
            }
            span {
              font-size: 0.24rem;
            }
          }
        }
      }
    }
  }
  .agree {
    color: #666;
    display: flex;
    font-size: 0.24rem;
    align-items: center;
    margin-top: 0.16rem;
  }
</style>
<style lang="less" scoped>
  .picker {
    .weui-cell {
      padding: 0.16rem 0 !important;
      .vux-popup-picker-select {
        max-width: 2.2rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .weui-cell__ft:after {
        display: none !important;
      }
    }
  }
  .mypackage .appointment-wrapper .vux-tab-wrap {
    position: relative;
    padding-top: 0;
    top: 0;
    z-index: 200;
  }
</style>
