<template>
  <div class="navigationPageImg">
    <p class="title"
      v-if="title">{{title}}</p>
    <div class="content"
      v-html="note">
    </div>
  </div>
</template>

<script>
import { getNavigationPageInfo } from '@/api/banners'
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
    this.getData()
  },
  methods: {
    // 根据单页导航名称
    getData () {
      getNavigationPageInfo('guide').then(res => {
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
