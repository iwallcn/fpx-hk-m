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
  name: 'about',
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
      getNavigationPageInfo('關於我們').then(res => {
        if (res.code === this.GLOBAL.code) {
          this.note = res.data.note
        }
      })
    }
  }
}
</script>

<style lang="less">
  @import "../../assets/less/navigationPageInfo.less";
</style>
