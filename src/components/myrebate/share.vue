<template>
  <div class="rebate-share">
    <img v-if="bgImg" class="bg-img" :src="bgImg" />
    <div class="ctc-operation-box">
      <img class="share-bg" src="@/assets/image/share-bg.png" />
      <div class="ctc-content">
        <div class="ctc-content-top flex_box fb_ai_c fb_jc_sb">
          <img class="ctc-title-box" src="@/assets/image/ctc-title.png" />
          <div catchtap="goMyPromotion" class="ctc-title-right flex_box fb_ai_c">
            <img class="ctc-icon1" src="@/assets/image/ctc-icon1.png" />
            已邀請 {{invitationInfo.invitationCount || '0'}} 人
          </div>
        </div>
        <div class="ctc-operation-list-box flex_box fb_jc_c fb_ai_c">
          <div @click="handlerShare" class="ctc-operation-list">
            <div class="ctc-operation-list-top flex_box fb_ai_c fb_column">
              <div class="ctc-list-label">鏈接分享</div>
              <img class="ctc-icon3" src="@/assets/image/ctc-icon3.png" />
            </div>
            <div class="ctc-operation-list-bottom">點擊分享</div>
          </div>
          <div @click="getPosterQRCode" class="ctc-operation-list">
            <div class="ctc-operation-list-top flex_box fb_ai_c fb_column">
              <div class="ctc-list-label">海報分享</div>
              <img class="ctc-icon2" src="@/assets/image/ctc-icon2.png" />
            </div>
            <div class="ctc-operation-list-bottom">點擊生成</div>
          </div>
          <div @click="shaveInvitationCode" class="ctc-operation-list">
            <div class="ctc-operation-list-top flex_box fb_ai_c fb_column">
              <div class="ctc-list-label">邀請碼分享</div>
              <div class="recommender-code">{{invitationInfo.invitationCode || ''}}</div>
            </div>
            <div class="ctc-operation-list-bottom">點擊複製</div>
          </div>
        </div>
        <div class="flex_box fb_jc_c ctc-profit">纍計收益(HKD)：{{invitationInfo.rebateBalance || '0.00'}}</div>
      </div>
    </div>
    <!-- 分享海报 -->
    <div :class="[ showPoster ? 'share-box show' : 'share-box']">
      <i @click="() => showPoster = false" class="iconfont icon-close"></i>
      <div class="canvas-box">
        <img style="width: 66vw;height: 60vh;display:block;" :src="posterImg" />
      </div>
      <div class="flex_box fb_jc_c">
        <div class="save-share-img">請長按圖片保存到相冊</div>
        <!-- <div @click="saveImg" class="save-share-img">保存到相冊</div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { getPosterQRCode, getInvitationInformation, getPromotionUrl, getPageConfigInfoList } from '@/api/myrebate'
export default {
  name: 'myrebateShare',
  data () {
    return {
      invitationInfo: {},
      showPoster: false,
      shareUrl: '',
      posterImg: '',
      bgImg: ''
    }
  },
  created () {
    getPromotionUrl().then(res => {
      if (res.code === this.GLOBAL.code) {
        this.shareUrl = res.data
      } else {
        this.$vux.toast.text(res.message)
      }
    })
    getPageConfigInfoList({ clientType: 2, category: 'RECOMMENED_REBATE_PAGE' }).then(res => {
      if (res.code === this.GLOBAL.code) {
        console.log(res.data.result)
        this.bgImg = res.data && res.data.result && res.data.result.length ? res.data.result[0].picUrl : ''
      } else {
        this.$vux.toast.text(res.message)
      }
    })
    getInvitationInformation().then(res => {
      if (res.code === this.GLOBAL.code) {
        this.invitationInfo = res.data
      } else {
        this.$vux.toast.text(res.message)
      }
    })
  },
  methods: {
    saveImg () {
      if (!this.posterImg) return
      let aLink = document.createElement('a')
      let blob = this.base64ToBlob(this.posterImg)
      let evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', true, true) // initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aLink.download = '海報.png'
      aLink.href = URL.createObjectURL(blob)
      aLink.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window})) // 兼容火狐
      this.$vux.toast.text('海報下載成功')
      this.showPoster = false
    },
    // base64转blob
    base64ToBlob (code) {
      let parts = code.split(';base64,')
      let contentType = parts[0].split(':')[1]
      let raw = window.atob(parts[1])
      let rawLength = raw.length
      let uInt8Array = new Uint8Array(rawLength)
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([uInt8Array], {type: contentType})
    },
    // 获取海报
    getPosterQRCode () {
      if (!this.shareUrl) {
        this.$vux.toast.text('海報生成失敗')
        return
      }
      if (this.posterImg) {
        this.showPoster = true
        return
      }
      getPosterQRCode(this.shareUrl).then(res => {
        let imgBase64 = typeof res === 'string' ? `data:image/png;base64, ${res}` : ''
        if (imgBase64) {
          this.posterImg = imgBase64
          this.showPoster = true
        } else {
          this.$vux.toast.text(res.message)
        }
      })
    },
    // 分享
    handlerShare () {
      const value = this.shareUrl
      // 模拟input
      const input = document.createElement('input')
      const str = `${value}`
      input.setAttribute('readonly', 'readonly')
      input.setAttribute('value', str)
      document.body.appendChild(input)
      input.select()
      input.setSelectionRange(0, value.length)
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$vux.toast.text('推廣鏈接復制成功，可粘貼發送給好友！')
      }
      document.body.removeChild(input)
    },
    // 复制邀请码
    shaveInvitationCode () {
      const value = this.invitationInfo.invitationCode || ''
      if (!value) return
      const input = document.createElement('input')
      const str = `${value}`
      input.setAttribute('readonly', 'readonly')
      input.setAttribute('value', str)
      document.body.appendChild(input)
      input.select()
      input.setSelectionRange(0, value.length)
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        if (this.invitationInfo.invitationContent) {
          this.$vux.confirm.show({
            title: '溫馨提示',
            content: this.invitationInfo.invitationContent,
            onCancel: () => {
              console.log('取消')
            },
            onConfirm: () => {
              console.log('确定')
            }
          })
        } else {
          this.$vux.toast.text('邀請碼接復制成功，可粘貼發送給好友！')
        }
      }
      document.body.removeChild(input)
    }
  }
}
</script>

<style lang="less" scoped>
  .rebate-share{
    background-color: white;
    min-height: 100vh;
    position: relative;
    .bg-img{
      display: block;
      width: 100vw;
    }
    .ctc-operation-box{
      width: calc(100vw - 0.6rem);
      height: 4.4rem;
      background: linear-gradient(#FFE2AD, #FFFFFF);
      position: absolute;
      top: 4.7rem;
      left: 0.3rem;
      z-index: 1001;
      border-radius: 0.12rem;
      .share-bg{
        display: block;
        width: calc(100vw - 0.6rem);
        height: 4.4rem;
      }
      .ctc-content{
        width: calc(100vw - 0.6rem);
        height: 4.4rem;
        position: relative;
        top: -4.4rem;
        z-index: 1002;
        .ctc-content-top{
          padding: 0.26rem 0.3rem 0rem 0.4rem;
          height: 0.8rem;
          .ctc-title-box{
            height: 0.82rem;
            width: 2.87rem;
            position: relative;
            top: -0.4rem;
            left: 0px;
          }
          .ctc-title-right{
            color: #93662F;
            font-size: 0.22rem;
            font-weight: 500;
            padding-bottom: 0.45rem;
            .ctc-icon1{
              width: 0.28rem;
              height: 0.28rem;
              margin-right: 0.1rem;
            }
          }
        }
        .ctc-operation-list-box {
          .ctc-operation-list{
            width: 1.77rem;
            height: 2.16rem;
            overflow: hidden;
            margin-right: 0.3rem;
            position: relative;
            .ctc-operation-list-top{
              background-color: #fffbf5;
              border-radius: 0.12rem;
              height: 1.46rem;
              border: 0.02rem solid #FDAF52;
              margin-bottom: 0.1rem;
              .ctc-list-label{
                font-size: 0.22rem;
                padding-top: 0.2rem;
                padding-bottom: 0.18rem;
                font-weight: bold;
              }
              .ctc-icon3{
                width: 0.6rem;
                height: 0.6rem;
              }
              .ctc-icon2{
                width: 0.6rem;
                height: 0.6rem;
              }
              .recommender-code{
                color: #EC605E;
                font-weight: 500;
                font-size: 0.28rem;
                margin-top: 0.16rem;
              }
            }
            .ctc-operation-list-bottom{
              height: 0.56rem;
              background: linear-gradient(#FDBC38, #DC7700);
              color: white;
              position: relative;
              text-align: center;
              overflow: hidden;
              font-size: 0.24rem;
              font-weight: 500;
              line-height: 0.56rem;
              border-radius: 0.28rem;
            }
          }
          & .ctc-operation-list:last-child {
            margin-right: 0px;
          }
        }
        .ctc-profit{
          color: #93662F;
          font-size: 0.4rem;
          padding-top: 0.24rem;
          font-weight: 500;
          text-align: center;
        }
      }
    }
  }
  .flex_box {
    display: flex;
  }
  .fb_ai_c {
    align-items: center;
  }
  .fb_column {
    flex-direction: column;
  }
  .fb_jc_sb {
    justify-content: space-between;
  }
  .fb_jc_c {
    justify-content: center;
  }
  .share-box{
    position: fixed;
    top: 0;
    left: -100vw;
    height: 100vh;
    width: 100vw;
    z-index: 10002;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: all 0.3s linear;
    &.show{
      left: 0;
    }
    .icon-close{
      display: block;
      width: 0.46rem;
      height: 0.46rem;
      border-radius: 100%;
      border: 0.02rem solid white;
      text-align: center;
      line-height: 0.46rem;
      color: white;
      margin-left: 4.7rem;
      box-sizing: border-box;
      font-size: 0.24rem;
      margin-bottom: 0.15rem;
    }
    .save-share-img{
      height: 0.6rem;
      line-height: 0.6rem;
      margin-top: 0.3rem;
      border-radius: 0.3rem;
      color: white;
      background-color: #FF6746;
      font-size: 0.28rem;
      font-weight: 500;
      padding: 0rem 0.5rem;
    }
  }
</style>
