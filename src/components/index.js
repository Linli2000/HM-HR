// 该文件负责所有的公共的组件的全局注册   Vue.use
import PageTools from './PageTools'
import UploadExcel from '@/components/UploadExcel'

export default {
  install(Vue) {
    //  注册全局的通用栏组件对象
    Vue.component('PageTools', PageTools)
    // 注册导入excel组件
    Vue.component('UploadExcel', UploadExcel)
  }
}
