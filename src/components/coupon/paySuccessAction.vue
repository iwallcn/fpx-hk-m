<template>
  <div style="font-size:0.28rem;">正在跳轉，請稍後……</div>
</template>

<script>
/**
 * 支付寶等支付方式支付成功後跳轉到該頁面，用以處理成功後重定向到支付前頁面
 * **/
export default {
  created () {
    const data = window.localStorage.getItem('card-payment')
    window.localStorage.removeItem('card-payment')
    if (!data) {
      this.$router.push({path: '/account/paymentend'})
      return
    }
    const route = JSON.parse(data)
    if (!route) {
      this.$router.push({path: '/account/paymentend'})
      return
    }
    this.$router.push({
      ...route,
      query: {
        ...route.query || {},
        isSuccess: true
      }
    })
  }
}
</script>
