<template>
  <div class="notFound">
    <img src="@/assets/image/404.jpg">
    <button @click="goHome"
      class="gohome">點擊這里回到首頁</button>
  </div>
</template>

<script>
export default {
  name: 'notFound',
  data () {
    return {
    }
  },
  methods: {
    goHome () {
      this.$router.replace({ name: 'home' })
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .notFound {
    background-color: #fff;
    text-align: center;
    height: 100%;
    padding-top: 20%;
    img {
    }
    .gohome {
      background-color: @primary;
      color: #fff;
      font-size: 0.32rem;
      padding: 0.16rem 0 0.18rem 0;
      display: inline-block;
      border: none;
      width: 60%;
      border-radius: 0.08rem;
    }
  }
</style>
