import Vue from 'vue'
// 注册全局指令
Vue.directive('imgerror', {
  inserted(el, options) {
    //  当图片有地址 但是地址没有加载成功的时候 会报错 会触发图片的一个事件 => onerror
    el.onerror = function() {
      // el.src = 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2021421053,481069477&fm=26&gp=0.jpg'
      // 一旦出错就调用这个指令  当图片出现异常的时候 会将指令配置的默认图片设置为该图片的内容
      // 就将调用指令时传入的图片, 替换掉当前 src 修复图片 属性 添加 不写死类容
      // options是 指令中的变量的解释  其中有一个属性叫做 value
      el.src = options.value
    }
  }
})
