<template>
  <div class="navigationPageInfo">
    <p class="title"
      v-if="title">{{title}}</p>
    <div class="content"
      v-html="note">
    </div>
  </div>
</template>

<script>
/**
 * 这里放置兼容一些老的连接，比如：
 * http://localhost:8080/news/detail?id=27
   http://localhost:8080/page/singlePage?id=87
 */
import { getBannerPageInfo, getNewsDetailInfo } from '@/api/banners'
export default {
  name: 'tutorial',
  data () {
    return {
      title: '',
      note: '',
      id: ''
    }
  },
  created () {
    this.id = this.$route.query.id
    if (this.$route.name === 'page/singlePage') {
      this.getSinglePageInfo()
    } else {
      this.getNewsDetailInfo()
    }
  },
  methods: {
    // 根据动态id获取内容
    getSinglePageInfo () {
      getBannerPageInfo(this.id).then(res => {
        if (res.code === this.GLOBAL.code && res.data) {
          this.note = res.data.note
        }
      }).then(() => {
        this.setImgSize()
      })
    },
    // 根据动态id获取新闻详情
    getNewsDetailInfo () {
      getNewsDetailInfo(this.id).then(res => {
        if (res.code === this.GLOBAL.code && res.data) {
          this.title = res.data.title
          this.note = res.data.content
        }
      }).then(() => {
        this.setImgSize()
      })
    },
    setImgSize () {
      this.$nextTick(() => {
        document.querySelectorAll('img').forEach((v, i) => {
          if (v.width > 750) {
            v.style.height = '100%'
            v.style.width = '100%'
          } else {
            v.style.height = v.height / 110 + 'rem'
            v.style.width = v.width / 110 + 'rem'
          }
        })
      })
    }
  }
}
</script>
<style lang="less">
  @import "../../assets/less/navigationPageInfo.less";
</style>
