// 移动端适配方案：以750px设计稿为基准，1rem = 100px。eg：font-size: .32rem;(设计稿字体大小为32px)。
(function (document, window) {
  let designWidth = 750 // 定义一个设计稿宽度750px
  document.documentElement.style.fontSize =
    ((document.documentElement.clientWidth > 750 ? 750 : document.documentElement.clientWidth) / designWidth) * 100 + 'px'
  window.onresize = function () {
    document.documentElement.style.fontSize = ((document.documentElement.clientWidth > 750 ? 750 : document.documentElement.clientWidth) / designWidth) * 100 + 'px'
  }
})(document, window)
