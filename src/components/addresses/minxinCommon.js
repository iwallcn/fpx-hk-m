import * as API from '@/api/myAddress'
const minxinCommon = {
  methods: {
    // 确定删除
    sureConfirm () {
      API.deletePickUpRecipients(this.currentId).then(res => {
        if (res.code === this.GLOBAL.code) {
          this.$vux.toast.text('操作成功')
          this.items = this.items.filter((item, index) => item.recipientsId !== this.currentId)
        } else {
          this.$vux.toast.text(res.message)
        }
      })
    },
    // 点击删除
    handlerDelete (id) {
      this.deleteConfirm = !this.deleteConfirm
      this.currentId = id
    }
  }
}
export default minxinCommon
