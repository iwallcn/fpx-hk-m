<template>
  <div class="product-list-box">
    <div class="product-list">
        <div class="product-list-top">
        <div class="product-list-top-title">
            <div class="product-list-top-title-text">標準派送</div>
            <div class="product-list-top-title-icon">優惠</div>
        </div>
        <div class="prescription-text">1-3個工作日</div>
        </div>
        <div class="weight-range">
        <div class="weight-range-list">
            <div class="weight-range-num">0-3KG</div>
            <div class="first-weight">首重<span class="line-through">18</span> <span class="preferential-price">17/KG</span></div>
            <div class="second-weight">續重<span class="line-through">8</span> <span class="preferential-price">6/KG</span></div>
        </div>
        <div class="weight-range-list">
            <div class="weight-range-num">3-20KG</div>
            <div class="first-weight">首重<span class="line-through">34</span> <span class="preferential-price">29/3KG</span></div>
            <div class="second-weight">續重<span class="line-through">7</span> <span class="preferential-price">6.5/KG</span></div>
        </div>
        </div>
        <div class="product-list-info">住宅區派送，加收住宅附加費20</div>
        <div class="product-list-info">包裹長度超140CM（含140），加收超長附加費45</div>
    </div>
    <div class="product-list">
        <div class="product-list-top">
        <div class="product-list-top-title">
            <div class="product-list-top-title-text">重貨派送</div>
            <div class="product-list-top-title-icon">降價</div>
        </div>
        <div class="prescription-text">1-3個工作日</div>
        </div>
        <div class="weight-range">
        <div class="weight-range-list">
            <div class="weight-range-num">20-100KG</div>
            <div class="first-weight">首重<span class="line-through">167</span> <span class="preferential-price">125/KG</span></div>
            <div class="second-weight">續重<span class="preferential-price">5.5/KG</span></div>
        </div>
        <div class="weight-range-list">
            <div class="weight-range-num">100-500KG</div>
            <div class="first-weight">首重<span class="line-through">445</span> <span class="preferential-price">100/3KG</span></div>
            <div class="second-weight">續重<span class="preferential-price">4.5/KG</span></div>
        </div>
        </div>
        <div class="product-list-info">免住宅附加費，免超長附加費</div>
    </div>
    </div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

<style lang='less' scoped>
  .product-list-box{
    padding: 0.2rem 0.3rem 0.2rem;
    .product-list{
      box-shadow: 0px 0px 20px 0px rgba(0,90,220,0.1);
      margin-bottom: 0.2rem;
      padding: 0px 0.3rem 0.2rem;
      border-radius: 0.12rem;
      .product-list-top{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 0.8rem;
        .product-list-top-title{
          display: flex;
          .product-list-top-title-text{
            font-weight: 600;
            font-size: 0.32rem;
          }
          .product-list-top-title-icon{
            margin-left: 0.15rem;
            padding: 0.06rem 0.25rem 0.06rem 0.1rem;
            background-color: #ff6400;
            color: white;
            font-size: 0.22rem;
            border-radius: 0.1rem 0.26rem 0.26rem 0.1rem;
            position: relative;
            &::after{
              content: '';
              display: block;
              width: 0.06rem;
              height: 0.06rem;
              background-color: white;
              border-radius: 100%;
              margin-top: -0.03rem;
              position: absolute;
              top: 50%;
              right: 0.1rem;
            }
          }
        }
        .prescription-text{
          font-size: 0.26rem;
        }
      }
      .weight-range{
        padding-bottom: 0.1rem;
        font-size: 0.26rem;
        color: #999999;
        .weight-range-list{
          display: flex;
          align-items: center;
          margin-bottom: 0.1rem;
          .weight-range-num{
            width: 1.6rem;
          }
          .first-weight{
            width: 2.45rem;
          }
        }
      }
      .product-list-info{
        margin-bottom: 0.1rem;
        font-size: 0.26rem;
        color: #999999;
      }
      .line-through{
        text-decoration: line-through;
        color: #cccccc;
      }
      .preferential-price{
        color: #ff6400;
      }
    }
  }
</style>
