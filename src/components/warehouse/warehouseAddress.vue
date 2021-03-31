<template>
  <div class="warehouse-address">
    <p class="infos"
      v-if="$route.query.warehouseId === 'CNDGMB'">申報流程簡化升級：1.淘寶發貨后，可免填申報信息，直接認領包裹。此功能僅限淘寶使用，其他電商平台仍需申报商品信息。2.拼多多平臺收件人姓名限制為8位，如使用拼多多，收件人姓名填自己姓名即可。</p>
    <p class="infos"
      v-if="$route.query.warehouseId === 'GBLONA'">申報流程簡化升級：日本至香港集运包裹，只需填寫商家物流號和商品金額，即可認領包裹！</p>
    <p class="infos"
      v-if="$route.query.warehouseId === 'JPOSAA'">
      温馨提示：因日本亞馬遜派送方式調整，請您在日本Amazon網購落單時，選擇【建物內受付/管理人】，不要選玄關（否則無法派達）。<a href="https://hk.4px.com/news/amazon-orders-20200">详情请见公告></a>
    </p>
    <group class="first-cell other">
      <cell-box>
        <div class="warHouseBox">
          <span>選擇倉庫</span>
          <span>{{ WarehouseDetail.warehouseName }}</span>
        </div>
      </cell-box>
    </group>
    <group class="other">
      <cell-box>
        倉庫地址
      </cell-box>
    </group>
    <div class="detailDes">
      <template v-if="departureCountry === 'CN'">
        <div class="item">
          <span class="item-title">Name:</span> <span class="item-content">{{ WarehouseDetail.memberCode }}</span>
        </div>
      </template>
      <template v-else>
        <div class="item">
          <span class="item-title">FirstName:</span><span class="item-content">{{ WarehouseDetail.firstName }}</span>
        </div>
        <div class="item">
          <span class="item-title">LastName:</span> <span class="item-content">{{ WarehouseDetail.memberCode }}</span>
        </div>
      </template>
      <div class="item">
        <span class="item-title">Address:</span>
        <span class="item-content">
          {{addressRowOne}} <i class="iconfont icon-copy"
            @click="copyDetailAddress(addressRowOne)"></i>
        </span>
      </div>
      <div v-if="addressRowTwo"
        class="item">
        <span class="item-title"></span>
        <span class="item-content">
          {{addressRowTwo}} <i class="iconfont icon-copy"
            @click="copyDetailAddress(addressRowTwo)"></i>
        </span>
      </div>
      <div class="item">
        <span class="item-title">County:</span><span class="item-content"> {{ WarehouseDetail.areaName }}</span>
      </div>
      <div class="item">
        <span class="item-title">City:</span><span class="item-content"> {{ WarehouseDetail.cityName }}</span>
      </div>
      <div class="item">
        <span class="item-title">State:</span> <span class="item-content">{{ WarehouseDetail.provinceName }}</span>
      </div>
      <div class="item">
        <span class="item-title">Country:</span> <span class="item-content">{{ WarehouseDetail.countryName }}</span>
      </div>
      <div class="item">
        <span class="item-title">ZipCode:</span><span class="item-content"> {{ WarehouseDetail.postCode }}</span>
      </div>
      <div class="item">
        <span class="item-title">Tel:</span> <span class="item-content">{{ WarehouseDetail.principalTel }}</span>
      </div>
    </div>
    <div class="btn-wrap">
      <button class="btn-ml"
        @click="copyAddress">一鍵複製倉庫地址</button>
    </div>
    <div class="tips">
      <div class="tips-title">注：</div>
      <p>1、First name與Last name為用戶身份重要標識，請在購物網站填寫收貨人時務必將First name與Last name填寫完整，并用空格分開，如：zhangsan ABCDEF (First name為用戶完整個人賬戶信息后將自動生成，Last name為系統自動生成)。
        <span v-if="$route.query.warehouseId === 'CNDGMB'">如果部分平台姓名无法填写，填写自己姓名即可。</span>
      </p>
      <p>2、您在購物網站上收貨地址如有兩行，請嚴格按照上方格式填寫；您在購物網站上收貨地址如只有一行，請將上述兩行地址合并為一行，中間以空格隔開。</p>
      <p>3、如果您正在購物的網站提示zipcode或tel填寫錯誤，請刪除數字中間'-'試試，如果zipcode刪除'-'依然不可以下單，請直接填寫前
        <span v-if="$route.query.warehouseId === 'USPDXA'">九位</span><span v-else>五位</span>郵編碼。
      </p>
    </div>
  </div>
</template>

<script>
import { Group, Cell, CellBox } from 'vux'
import * as API from '@/api/warehouse'
import { mapGetters } from 'vuex'
import copy from 'copy-to-clipboard'

export default {
  name: 'warehouseAddress',
  data () {
    return {
      WarehouseDetail: {},
      departureCountry: ''
    }
  },
  computed: {
    addressRowOne () {
      const { warehouseCode, address = '' } = this.WarehouseDetail || {}
      if (warehouseCode === 'JPOSAA') {
        return address.split(' ')[0]
      }
      return address
    },
    addressRowTwo () {
      const { warehouseCode, address = '', memberCode = '' } = this.WarehouseDetail || {}
      if (warehouseCode === 'JPOSAA') {
        const adr = address.split(' ')
        adr.shift()
        return `${adr.join(' ') || ''}#${memberCode}#`
      }
      return ''
    }
  },
  created () {
    this.getWarehouseDetail()
  },
  methods: {
    getWarehouseDetail () {
      let warehouseId = this.$route.query.warehouseId
      this.departureCountry = this.$route.query.departureCountry
      API.getWarehouseDetail(warehouseId).then(res => {
        if (res.code === this.GLOBAL.code) {
          let WH = this.dictData().WH
          res.data.warehouseName = WH[res.data.warehouseCode] || res.data.warehouseName
          this.WarehouseDetail = res.data
        }
      })
    },
    copyAddress () {
      let address = this.WarehouseDetail.provinceName + ' ' + this.WarehouseDetail.cityName + ' ' + this.addressRowOne + ' ' + this.addressRowTwo
      let str = `收件人：${this.WarehouseDetail.memberCode} \n地址：${address} \n郵編：${this.WarehouseDetail.postCode} \n電話：${this.WarehouseDetail.principalTel}`
      copy(str)
      this.$vux.confirm.show({
        title: '溫馨提示',
        content: '複製成功，如果使用一鍵複製地址到手機淘寶APP智能填寫，若地址欄只顯示“中国大陆西大坦启盈国际快件中心15递四方Z集运仓”，則需要單獨再複製一次地址粘貼到淘寶詳細欄，因為淘寶智能填寫會過濾掉地址中的#號以及後面的客戶代碼。',
        hideOnBlur: true,
        showCancelButton: false,
        confirmText: '關閉'
      })
      // Vue.$vux.toast.text('複製成功！')
    },
    // 单独复制详细地址
    copyDetailAddress (val) {
      copy(val)
      this.$vux.toast.text('複製成功！')
    },
    ...mapGetters(['dictData'])
  },
  components: {
    Group,
    Cell,
    CellBox
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/less/variable.less";
  .warehouse-address {
    .icon-copy {
      color: @primary;
      padding: 0.1rem;
    }
    .infos {
      line-height: 0.34rem;
      font-size: 0.28rem;
      color: #999;
      padding: 0 0.2rem;
      margin: 0.2rem 0 -0.2rem 0;
    }
    .first-cell {
      .weui-cells {
        span {
          font-size: 0.28rem;
        }
      }
    }
    .other .weui-cells .weui-cell {
      font-size: 0.28rem;
    }
    .warHouseBox {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
    .detailDes {
      font-size: 0.28rem;
      color: #666;
      .item {
        margin-top: 12px;
        display: flex;
        justify-content: start;
        line-height: 0.4rem;
        span:nth-of-type(1) {
          display: inline-block;
          width: 25%;
          text-align: right;
          margin-right: 4px;
        }
        span:nth-of-type(2) {
          width: 70%;
        }
      }
    }
    .tips {
      font-size: 0.24rem;
      color: #999;
      padding: 20px 10px 10px 10px;
      .tips-title {
        color: @error;
        font-size: 0.32rem;
        padding-bottom: 10px;
      }
      p {
        margin-bottom: 10px;
        line-height: 18px;
      }
    }
    .btn-wrap {
      padding: 0 20px;
    }
  }
</style>
<style lang="less">
  .weui-dialog__bd div {
    line-height: 0.5rem;
    font-weight: 300;
    color: #666;
    font-size: 0.28rem;
  }
</style>
