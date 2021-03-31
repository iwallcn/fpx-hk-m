<template>
  <div class="register">
    <div class="wrapper">
      <div class="infos">
        <h3>親愛的用戶：</h3>
        <p>恭喜您成功註冊4PX遞四方（香港）官網！</p>
        <p>{{areaCode === '+852' ? '全線路首單2磅免運費優惠已到賬，點此開啟您的海淘之旅吧！' : '全線路無門檻3單5折優惠已到賬，點此開啟您的海淘之旅吧！'}}</p>
        <a class="button"
          href="https://m-hk.4px.com/">點此開啟</a>
      </div>
    </div>
    <!-- <img src="../../assets/image/yellow_ok.jpg"> -->
  </div>
</template>

<script>
export default {
  name: 'activityOK',
  data () {
    return {
      areaCode: '' // 用来判断注冊用戶類型
    }
  },
  created () {
    this.areaCode = this.$route.query.areaCode || '+852'
    this.setTimer()
  },
  methods: {
    setTimer () {
      setTimeout(() => {
        window.location.href = 'https://m-hk.4px.com/'
      }, 10000)
    }
  }
}
</script>

<style lang="less" scoped>
  .register {
    background: url("../../assets/image/yellow_ok.jpg") top center no-repeat;
    height: 100%;
    width: 100%;
    background-size: cover;
    .infos {
      width: 84%;
      position: absolute;
      top: 46%;
      left: 50%;
      transform: translate(-50%, -50%);
      h3 {
        font-size: 0.4rem;
        color: #fff;
        font-weight: bold;
        text-shadow: 2px 2px 2px #3c5fcf;
        letter-spacing: 0.1rem;
        margin-bottom: 0.4rem;
      }
      p {
        text-indent: 1rem;
        font-size: 0.34rem;
        color: #fff;
        text-shadow: 2px 2px 2px #fd6300;
        letter-spacing: 0.05rem;
        line-height: 0.5rem;
        margin-bottom: 0.2rem;
      }
      .button {
        color: #ff3100;
        width: 100%;
        font-size: 0.34rem;
        font-weight: bold;
        padding: 0.23rem 0;
        border: none;
        background: #fff;
        border-radius: 6px;
        display: block;
        text-align: center;
        margin-top: 0.4rem;
      }
    }
    img {
      max-width: 100%;
      height: auto;
    }
  }
</style>
