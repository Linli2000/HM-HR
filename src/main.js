import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

import Component from '@/components'
Vue.use(Component) // 注册自己的插件

// 注册全局的过滤器
import * as filters from '@/filters'
// 可以通过遍历逐个注册每个过滤器
for (const key in filters) {
  // console.log(key) 字符串的名字
  // console.log(filters[key]) 名字对应的函数
  Vue.filter(key, filters[key])
}

// 处理破图
import '@/directives'
import Print from 'vue-print-nb'
Vue.use(Print)
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
