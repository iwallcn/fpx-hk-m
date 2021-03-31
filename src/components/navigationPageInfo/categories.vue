<!--  -->
<template>
  <div class='navigationPageInfo'>
    <p class="title"
      v-if="title">{{title}}</p>
    <div class="content"
      v-html="note">
    </div>
  </div>
</template>

<script>
import { getBannerPageInfo } from '@/api/banners'
export default {
  components: {},
  data () {
    return {
      title: '',
      note: '',
      id: ''
    }
  },
  created () {
    this.id = this.$route.params.type // 获取动态路由参数
    this.fetchData() // 根据type调后台接口
  },
  watch: {
    // 由于是动态路由参数，会导致组件被复用，组件的生命周期失效，故这里采用监听路由，一旦路由有变化，则会执行fetchData函数
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      getBannerPageInfo(this.id).then(res => {
        if (res.code === this.GLOBAL.code && res.data) {
          this.note = res.data.note
        } else {
          this.$vux.toast.text('請檢查是否已配置了該路由')
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
