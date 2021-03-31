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
  name: 'pricing',
  data () {
    return {
      note: '',
      id: ''
    }
  },
  created () {
    this.id = this.$route.params.type || 'service_price' // 获取动态路由参数
    this.fetchData()
  },
  watch: {
    // 由于是动态路由参数，会导致组件被复用，组件的生命周期失效，故这里采用监听路由，一旦路由有变化，则会执行fetchData函数
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      getNavigationPageInfo(this.id).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.note = res.data.note
        } else {
          this.$vux.toast.text('請檢查是否已配置了該路由')
        }
      }).then(() => {
        // this.setImgSize()
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
  @import "../../assets/less/navigationPageImg.less";
</style>
