<template>
  <div class="navigationPageInfo">
    <div class="content"
      v-html="note">
    </div>
  </div>
</template>

<script>
import { getNavigationPageInfo } from '@/api/banners'
export default {
  name: 'privacy',
  data () {
    return {
      note: ''
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      getNavigationPageInfo('隱私政策').then(res => {
        if (res.code === this.GLOBAL.code) {
          this.note = res.data.note
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
