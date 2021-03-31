<template>
  <div class="upload">
    <div :class="['img-wrap', type === 'left' ? 'bg1' : 'bg2']"
      ref="imgWrap">
      <img v-show="!btnShow"
        :src="src">
      <input ref="fileInput"
        type="file"
        class="file-input"
        accept="image/*"
        @change="onFileChange">
      <a href="javascript:;"
        class="btn"
        v-show="btnShow"></a>
      <p class="desc"
        v-show="btnShow">{{desc}}</p>
      <div class="img-delete"
        v-show="!btnShow"
        @click.stop="onDelete">
        <i class="iconfont icon-delete"></i>
      </div>
    </div>
  </div>
</template>

<script>
// import { imgCompress } from '@/assets/utils'
export default {
  name: 'upload',
  props: {
    bgImg: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: '上传图片'
    },
    type: {
      type: String,
      default: 'left'
    }
  },
  data () {
    return {
      btnShow: true,
      src: ''
    }
  },
  methods: {
    setBg (src) {
      this.btnShow = false
      this.src = src
    },
    onFileChange (e) {
      let file = e.target.files[0]
      if (!file) return
      let typeArr = ['image/png', 'image/jpg', 'image/jpeg', 'image/bmp']
      if (!typeArr.includes(file.type)) {
        this.$vux.toast.text('格式错误，只能上传jpg/png/bmp/jpeg格式的图片')
        this.$refs.fileInput.value = ''
        return
      }
      // 图片不能大于2M
      /* if (file.size / 1024 > 50) {
        this.$vux.toast.text('图片过大，只能上传小于2M的图片')
        this.$refs.fileInput.value = ''
        return
      } */

      let r = new FileReader()
      r.readAsDataURL(file)
      r.onload = (e) => {
        let isCompress = true // 是否压缩
        if (!isCompress) {
          this.src = e.target.result
          this.onSet(e.target.result)
          return
        }
        let img = new Image()
        let _this = this
        let canvas = document.createElement('canvas')
        let context = canvas.getContext('2d')
        img.src = e.target.result
        this.src = e.target.result
        img.onload = function (url) {
          // 图片原始尺寸
          let originWidth = this.width
          let originHeight = this.height
          // 最大尺寸限制
          let maxWidth = 1200
          let maxHeight = 900

          // 目标尺寸
          let targetWidth = originWidth
          let targetHeight = originHeight
          // 图片尺寸超过限制
          if (originWidth > maxWidth || originHeight > maxHeight) {
            if (originWidth / originHeight > maxWidth / maxHeight) {
              // 更宽，按照宽度限定尺寸
              targetWidth = maxWidth
              targetHeight = Math.round(maxWidth * (originHeight / originWidth))
            } else {
              targetHeight = maxHeight
              targetWidth = Math.round(maxHeight * (originWidth / originHeight))
            }
          }
          // canvas对图片进行缩放
          canvas.width = targetWidth
          canvas.height = targetHeight
          // 清除画布
          context.clearRect(0, 0, targetWidth, targetHeight)
          // 图片压缩
          context.drawImage(img, 0, 0, targetWidth, targetHeight)
          let newUrl = canvas.toDataURL('image/jpeg')
          _this.onSet(newUrl)
        }
      }
    },
    onSet (url) {
      this.btnShow = false
      this.src = url
      let data = {
        src: url.split(',')[1],
        type: this.type
      }
      this.$emit('onImgLoad', data)
    },
    onDelete () {
      this.btnShow = true
      this.$refs.fileInput.value = ''
      this.$emit('onImgDelete', this.type)
      this.src = ''
    }
  }
}
</script>

<style lang='less' scoped>
  .img-wrap {
    position: relative;
    text-align: center;
    width: 3.2rem;
    height: 2rem;
    margin: 0 auto;
    border-radius: 0.12rem;
    box-shadow: 0 0 0 1px #ccc;
    position: relative;
    .file-input {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      outline: none;
      background-color: transparent;
      filter: alpha(opacity=0);
      -moz-opacity: 0;
      -khtml-opacity: 0;
      opacity: 0;
    }
    img {
      width: 100%;
      height: 100%;
      border: none;
    }
    &.bg1 {
      background: url("../../assets/image/icon_card.png") center center / cover
        no-repeat;
    }
    &.bg2 {
      background: url("../../assets/image/icon_card2.png") center center / cover
        no-repeat;
    }
  }
  .btn {
    box-shadow: 0.02rem 0 2px rgba(0, 0, 0, 0.2);
    background: #108ee9 url(../../assets/image/icon_carm.png) center no-repeat;
    background-size: 0.37rem 0.32rem;
    display: inline-block;
    width: 0.73rem;
    height: 0.73rem;
    margin-top: 0.46rem;
    border-radius: 0.73rem;
    cursor: pointer;
  }
  .desc {
    font-size: 0.22rem;
    color: #252525;
    text-align: center;
  }
  .img-delete {
    position: absolute;
    top: -0.12rem;
    right: -0.12rem;
    width: 24px;
    height: 24px;
    text-align: center;
    line-height: 24px;
    border-radius: 24px;
    background: #999999;
    color: #fff;
    .iconfont {
      color: #fff;
    }
  }
</style>
