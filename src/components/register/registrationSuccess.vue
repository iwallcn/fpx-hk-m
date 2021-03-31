<template>
  <div class="complete">
    <msg :title="title"
      :description="description"
      :buttons="buttons"
      :icon="icon">
    </msg>
    <div class="bannerImg">
      <a :href="banner.link">
        <img :src="banner.picUrl"
          :alt="banner.picName"
          @click="handlerBanner(banner.link)" />
      </a>
    </div>
  </div>
</template>

<script>
import { Msg } from 'vux'
import { bannerInfo } from '@/api/banners'

export default {
  components: {
    Msg
  },
  props: {
    time: {
      type: Number,
      default: 30000000000
    }
  },
  created () {
    // 获取banner
    this.getBanner()
  },
  data () {
    return {
      title: '<span style="font-size:0.44rem;color: #ff6400;">恭喜您</span>',
      description: `<span style="font-size:0.44rem;color: #ff6400;margin: 0.2rem 0;display: block;margin-bottom: -0.5rem;">注冊 m-hk.4px.com 成功！</span>`,
      icon: '',
      buttons: [{
        type: 'primary',
        text: '回到首頁',
        onClick: this.goToHome
      }],
      banner: {
        picUrl: '',
        picName: '',
        link: ''
      }
    }
  },
  methods: {
    goToHome () {
      this.$router.replace({ name: 'home' })
    },
    // 获取banner图片
    getBanner () {
      bannerInfo({ category: 'REGISTER_SUCCESS', device: 2 }).then(res => {
        if (res.code === this.GLOBAL.code) {
          if (res.data.result.length) {
            this.banner = res.data.result[0]
          }
        }
      })
    },
    handlerBanner (link) {
      location.href = link
    }
  },
  watch: {
    time (val) {
      document.querySelector('#time').innerHTML = val
    }
  }
}
</script>

<style lang="less" scoped>
  .complete {
    /deep/ .weui-btn_primary {
      background-color: @primary;
      &:not(.weui-btn_disabled):active {
        background-color: #f0a362;
      }
    }
    /deep/ .weui-icon-success {
      color: @primary;
    }
    .bannerImg {
      width: 91%;
      margin: 0 auto;
      text-align: center;
      img {
        max-width: 100%;
      }
    }
  }
</style>
