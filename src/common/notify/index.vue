<!--  -->
<template>
  <div class="notify">
    <p><a :href="info.link">{{info.promotionTitle}}</a></p>
    <i class="iconfont icon-close"
      @click="closeNotify"></i>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

export default {
  props: ['info'],
  name: 'notify',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    // 这里存放数据
    return {
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    console.log(this.info)
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {

  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    // 关闭通知栏
    closeNotify () {
      this.$emit('closeNotify')
    }
  }
}
</script>
<style lang="less" scoped>
  .notify {
    background-color: #005adc;
    color: #fff;
    font-size: 14px;
    display: flex;
    align-items: center;
    position: relative;
    padding: 0.08rem 0.26rem;
    height: 0.64rem;
    z-index: 502;
    p {
      flex: 1;
      word-wrap: break-word;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      /*! autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
      line-height: 0.34rem;
      margin-right: 0.46rem;
      a {
        color: #fff;
      }
    }
    i {
      padding: 0.24rem;
      color: #fff;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
</style>
