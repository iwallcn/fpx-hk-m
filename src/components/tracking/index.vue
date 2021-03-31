<template>
  <div class="mainland">
    <div class="query-wrapper">
      <input type="text"
        v-model="orderId"
        placeholder="請輸入物流單號">
      <button @click="handleQuery">查詢</button>
    </div>

    <div class="title">物流跟蹤信息</div>
    <div class="track-content">
      <div class="track-title">
        <div class="track-col1">發生時間[北京時間]</div>
        <div class="track-col2">軌跡内容</div>
      </div>
      <div class="track-info"
        v-if="trackList">
        <div :class="[index === 0 ? 'track-latest' : 'track-old']"
          v-for="(track, index) in trackList"
          :key="index">
          <div class="track-time">
            <h5>{{fmtDate(track.tkDate)}}</h5>
            <!-- <h5>{{track.tkTime}} <span>{{ weeks[index] ? weeks[index].w : ''}}</span></h5> -->
          </div>
          <div class="track-node">
            <span><i class="iconfont icon-xiangshang"></i></span>
            <span class="track-line"></span>
          </div>
          <div class="track-text">
            {{track.tkDesc}}
          </div>
        </div>
      </div>

      <!-- 如果有子包裹轨迹，则分别显示每个子包裹轨迹 -->
      <template v-if="subOrderDetails.length">
        <div class="track-info"
          v-for="(item, index) in subOrderDetails"
          :key="index">
          <h4 class="childPkg">包裹{{index+1}}：{{item.serverCode}}</h4>
          <div :class="[index === 0 ? 'track-latest' : 'track-old']"
            v-for="(track, index) in item.trackList"
            :key="index">
            <div class="track-time">
              <h5>{{fmtDate(track.tkDate)}}</h5>
            </div>
            <div class="track-node">
              <span><i class="iconfont icon-xiangshang"></i></span>
              <span class="track-line"></span>
            </div>
            <div class="track-text">
              {{track.tkDesc}}
            </div>
          </div>
        </div>
      </template>

      <div class="no-track"
        v-if="trackList.length===0">{{infos}}</div>
    </div>

    <!-- 轨迹翻译 -->
    <div class="translate">
      <div @click="handlerTranslate">
        <i class="iconfont icon-zh-en"></i><span>{{text}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Timeline, TimelineItem } from 'vux'
import { formatDateL } from '@/utils/common'
import * as API from '@/api/track'
export default {
  name: 'trackLine',
  data () {
    return {
      fmtDate: formatDateL,
      orderId: '',
      language: '',
      text: '',
      lastTrack: '',
      trackList: [],
      subOrderDetails: [], // 子包裹軌跡
      infos: ''
    }
  },
  created () {
    this.orderId = this.$route.query.fpxOrderId
    this.handleQuery()
  },
  methods: {
    handleQuery () {
      this.text = 'translate into English'
      this.language = 'zh-cn'
      const idReg = /^[0-9]{1,}$/
      if (!this.orderId) {
        this.infos = '物流單號爲空'
        return
      }
      if (!idReg.test(this.orderId)) {
        this.infos = '找不到該物流信息'
        return
      }
      this.getPackageTrackByServe()
    },
    getPackageTrackByServe (val) {
      API.getPackageTrackByServe({ serveCodes: [this.orderId], language: this.language }).then(res => {
        if (res.code === this.GLOBAL.code && res.data && res.data.length) {
          this.lastTrack = res.data[0].lastTrack || ''
          this.trackList = res.data[0].trackList || []
          this.subOrderDetails = res.data[0].subOrderDetails || []
          if (this.trackList.length === 0) {
            this.infos = '暫無物流軌跡'
          }
        } else {
          this.infos = '找不到該物流信息'
        }
      })
    },
    // 轨迹翻译
    handlerTranslate () {
      if (this.language === 'zh-cn') {
        this.text = '翻譯成中文'
        this.language = 'en-us'
      } else {
        this.text = 'translate into English'
        this.language = 'zh-cn'
      }
      this.getPackageTrackByServe()
    }
  },
  filters: {
    format (data) {
      return new Date(data)
    }
  },
  components: {
    Timeline,
    TimelineItem
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .mainland {
    height: 100%;
    width: 100%;
    overflow-y: hidden;
    .no-track {
      height: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fff;
      color: #f74c31;
      font-size: 0.26rem;
    }
    .query-wrapper {
      height: 0.88rem;
      width: 100%;
      display: flex;
      justify-content: center;
      border-bottom: 1px solid #e9eaec;
      box-sizing: border-box;
      position: fixed;
      top: 1.1rem;
      input {
        flex: 1;
        border: none;
        padding: 0 0.16rem;
        font-size: 0.32rem;
        outline: none;
        background: #fff;
      }
      button {
        color: #fff;
        font-size: 0.36rem;
        flex: 0 0 2rem;
        border: none;
        background-color: @primary;
      }
    }
    .title {
      padding: 0.16rem;
      font-size: 0.28rem;
      color: #999;
      position: fixed;
      top: 2rem;
    }
    .weui-cells {
      margin-top: 0;
    }
    .track-content {
      background-color: #fff;
      padding: 0.16rem;
      height: calc(100% - 4rem);
      position: relative;
      margin-top: 1.7rem;
      overflow-y: auto;
      .track-title {
        display: flex;
        color: #666;
        font-size: 0.28rem;
        padding: 0.16rem 0;
        .track-col1 {
          flex: 0 0 3rem;
          font-weight: bold;
        }
        .track-col2 {
          flex: 1;
          font-weight: bold;
        }
      }
      .track-info {
        .childPkg {
          font-size: 0.28rem;
          margin: 0.16rem;
          color: #333;
        }
        .track-latest {
          display: flex;
          height: 1.2rem;
          .track-time {
            flex: 0 0 1.6rem;
            text-align: center;
            color: @primary;
            font-size: 0.26rem;
            line-height: 0.36rem;
            text-align: right;
          }
          .track-node {
            flex: 0 0 1rem;
            text-align: center;
            margin: 0.1rem 0 0 0;
            position: relative;
            background-color: #fff;
            overflow: hidden;
            span {
              text-align: center;
            }
            i {
              border: 1px solid @primary;
              border-radius: 50%;
              color: @primary;
              padding: 0.04rem;
              display: inline-block;
              position: absolute;
              left: 50%;
              top: 0;
              z-index: 1;
              width: 4px;
              height: 4px;
              background: @primary;
              transform: translateX(-4px);
            }
            .track-line {
              width: 1px;
              background-color: #c3c3c3;
              height: 1.2rem;
              left: 50%;
              position: absolute;
            }
          }
          .track-text {
            flex: 1;
            color: @primary;
            font-size: 0.26rem;
            line-height: 0.36rem;
          }
        }
        .track-old {
          display: flex;
          height: 1.2rem;
          .track-time {
            flex: 0 0 1.6rem;
            text-align: center;
            color: #666;
            font-weight: 100;
            font-size: 0.26rem;
            line-height: 0.36rem;
            text-align: right;
            h5 {
              font-weight: 300;
            }
          }
          .track-node {
            flex: 0 0 1rem;
            text-align: center;
            position: relative;
            background-color: #fff;
            overflow: hidden;
            i {
              border: 1px solid #999;
              color: #999;
              font-size: 0.24rem;
              border-radius: 50%;
              color: #ff7800;
              padding: 0.04rem;
              display: inline-block;
              position: absolute;
              left: 50%;
              top: 0;
              z-index: 1;
              width: 4px;
              height: 4px;
              transform: translateX(-4px);
              background-color: #fff;
            }
            .track-line {
              display: block;
              border-right: 1px solid #c3c3c3;
              width: 0px;
              height: 1.2rem;
              left: 50%;
              position: absolute;
            }
          }
          .track-text {
            flex: 1;
            color: #666;
            font-size: 0.26rem;
            line-height: 0.36rem;
          }
          &:last-child {
            .track-line {
              height: 0;
            }
          }
        }
      }
    }
    .translate {
      position: fixed;
      bottom: 0;
      font-size: 0.3rem;
      height: 1.8rem;
      left: 0;
      right: 0;
      background: #fff;
      div {
        display: flex;
        align-items: center;
        padding: 0.3rem;
        i {
          font-size: 0.42rem;
          padding-right: 0.12rem;
        }
      }
    }
  }
</style>
