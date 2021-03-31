<template>
  <div class="mainland">
    <group class="first-cell">
      <div class="card-wrapper">
        <div class="card-col">
          <upload type="left"
            ref="img1"
            :bgImg="imgObj.image1"
            @onImgDelete="onImgDelete"
            @onImgLoad="getLeftImg"></upload>
        </div>
        <div class="card-col">
          <upload type="right"
            ref="img2"
            :bgImg="imgObj.image2"
            @onImgDelete="onImgDelete"
            @onImgLoad="getRightImg"></upload>
        </div>
      </div>
    </group>

    <group>
      <x-input title="真实姓名"
        v-model="certificateName"
        disabled
        placeholder="上傳照片后自動識別姓名"></x-input>
      <x-input title="身份证号"
        v-model="certificateNo"
        disabled
        placeholder="上傳照片后自動識別身份證號"></x-input>
    </group>

    <template v-if="!isCertified">
      <div class="remark">
        <p>
          根据海关总署规定，入境到中国大陆的个人包裹需向海关提供收件人身份证证件等相关信息，谢谢配合！
        </p>
        <span @click="handleRemark">上传说明</span>
      </div>

      <footer class="footer-fixed">
        <button :class="[{disabled: computedImg}, 'btn-ml']"
          @click="handlerUpload"
          :disabled="computedImg">确定上传</button>
      </footer>
    </template>

    <!-- 上传说明 -->
    <div class="remark-info">
      <alert v-model="remarkInfo"
        hide-on-blur
        title="上传说明">
        <p>根据海关总署规定，入境到中国大陆的个人包裹需向海关提供收件人身份证证件等相关信息，谢谢配合！</p>
        <p>证件上传要求：</p>
        <p>1.依次上传<span>正反面、清晰、完整、勿裁剪</span></p>
        <p>2.身份证必须在有效期内，且为二代身份证</p>
        <p>3.单张图片建议不超过2M</p>
        <div class="error-imgs">
          <img src="@/assets/image/cardEp.png">
          <img src="@/assets/image/cardEp2.png">
          <img src="@/assets/image/cardEp3.png">
        </div>
      </alert>
    </div>
  </div>
</template>

<script>
import { Group, Cell, CellBox, XButton, XInput, Alert } from 'vux'
import upload from '@/common/upload'
import * as API from '@/api/personalInfo'

export default {
  name: 'certification',
  data () {
    return {
      remarkInfo: false,
      isCertified: false,
      certificateCode: '',
      certificateName: '',
      certificateNo: '',
      imgObj: {
        image1: '',
        image2: ''
      }
    }
  },
  created () {
    this.certificateCode = this.$route.query.certificateKey
    if (this.certificateCode) {
      this.getCard(this.certificateCode)
    }
  },
  methods: {
    // 上传说明
    handleRemark () {
      this.remarkInfo = !this.remarkInfo
    },
    // 根据code获取身份证信息（正反面图片）
    getCard (code) {
      API.getIdCardInfo(code).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.certificateCode = res.data.certificateCode
          this.certificateName = res.data.certificateName
          this.certificateNo = res.data.certificateNo

          this.imgObj.image1 = res.data.imageUrl1
          this.imgObj.image2 = res.data.imageUrl2

          this.$refs.img1.setBg(this.imgObj.image1)
          this.$refs.img2.setBg(this.imgObj.image2)
        } else {
          this.$vux.toast.text(res.message)
        }
      })
    },
    // 获取左边图片值
    getLeftImg (data) {
      this.imgObj.image1 = data.src
    },
    // 获取右边图片值
    getRightImg (data) {
      this.imgObj.image2 = data.src
    },
    // 上传身份证正反面图
    uploadImg () {
      API.addIdCardInfo(this.imgObj).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.certificateCode = res.data.certificateCode
          this.certificateName = res.data.certificateName
          this.certificateNo = res.data.certificateNo
        }
      })
    },
    // 确定上传 如果有code则是更新，没有则是添加
    handlerUpload () {
      if (this.certificateCode) {
        API.updateCertificateKey(this.certificateCode).then(res => {
          this.common(res)
        })
      } else {
        API.addCertificateKey(this.certificateCode).then(res => {
          this.common(res)
        })
      }
    },
    common (res) {
      if (res.code === this.GLOBAL.code) {
        this.$vux.toast.text('操作成功')
        this.$router.push({ name: 'profile' })
      } else {
        this.$vux.toast.text(res.message)
      }
    },
    onImgDelete (type) {
      if (type === 'left') {
        this.imgObj.image1 = ''
      } else {
        this.imgObj.image2 = ''
      }
      this.certificateCode = ''
      this.certificateName = ''
      this.certificateNo = ''
    }
  },
  computed: {
    computedImg () {
      if (this.imgObj.image1 && this.imgObj.image2) {
        return false
      }
      return true
    }
  },
  watch: {
    // 监听是否已经上传了2张图片
    imgObj: {
      handler (val, oldVal) {
        if (this.imgObj.image1 && this.imgObj.image2 && this.certificateCode) {
          this.uploadImg()
        }
      },
      deep: true
    }
  },
  components: {
    Group,
    Cell,
    CellBox,
    XButton,
    XInput,
    Alert,
    upload
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .mainland {
    .card-wrapper {
      display: flex;
      text-align: center;
      align-items: center;
      padding: 0.4rem 0rem;
      .card-col {
        width: 50%;
        flex: 0.5 0 auto;
        img {
          max-width: 100%;
        }
      }
    }
    .remark {
      padding: 0.2rem 0.3rem;
      line-height: 0.42rem;
      font-size: 0.26rem;
      color: #999;
      span {
        color: @primary;
      }
    }
    .remark-info {
      p {
        text-align: left;
        font-size: 0.24rem;
        line-height: 0.4rem;
        color: #999;
        span {
          color: @error;
        }
      }
      .error-imgs {
        max-height: 5.6rem;
        overflow-y: scroll;
        img {
          max-width: 100%;
          padding: 0.1rem 0;
        }
      }
    }
  }
</style>
