<template>
  <div class="pop-wrapper pop-wrapper-contain">
    <div class="pop-header">
      <div class="pop-title"
        @click="handleClose">
        物流服務
      </div>
      <div class="pop-close"
        @click="handleClose">
      </div>
    </div>
    <div class="pop-content pop-content-right">
      <div v-for="(product, index) in productList"
        :key="index"
        class="product-item"
        @click="chooseProduct(index, productList)">
        <p class="product-name">{{product.productName}}</p>
        <p class="product-info">{{product.taxDesc}} {{product.agingDesc}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Msg, Divider, XButton } from 'vux'

export default {
  components: {
    Msg,
    Divider,
    XButton
  },
  props: {
    productList: {
      type: Array,
      default: () => []
    }
  },
  created () {
  },
  data () {
    return {
    }
  },
  methods: {
    handleClose () {
      this.$emit('close')
    },
    chooseProduct (index, rows) {
      this.$emit('choose', rows[index])
    }
  }
}
</script>

<style lang="less" scoped>
  .pop-content {
    padding: 0 0.3rem;
  }
  .title {
    float: right;
    font-size: 0.28rem;
    color: #1d87e4;
    margin-right: 0.3rem;
  }
  .product-item {
    background: #f2f2f2;
    padding: 0.2rem 0.3rem;
    font-size: 0.4rem;
    line-height: 0.6rem;
    margin-bottom: 0.2rem;
    p {
      min-height: 0.6rem;
    }
    .product-name {
      color: @primary;
      font-size: 0.32rem;
    }
    .product-info {
      color: #666;
      font-size: 0.28rem;
    }
  }
</style>
