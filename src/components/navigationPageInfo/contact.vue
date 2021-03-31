<template>
  <div class="navigationPageImg">
    <div class="content"
      v-html="note">
    </div>
  </div>
</template>

<script>
import { getNavigationPageInfo } from '@/api/banners'
export default {
  name: 'contact',
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
      getNavigationPageInfo('聯系我們').then(res => {
        if (res.code === this.GLOBAL.code) {
          this.note = res.data.note
        }
      })
    }
  }
}
</script>
<style lang="less">
  @import "../../assets/less/navigationPageImg.less";
</style>
