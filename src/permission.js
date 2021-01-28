// 这里需要一个路由守卫, 控制页面的访问权限
import router from '@/router'
import { asyncRoutes } from '@/router'
// 引入 vuex 实例, 查看数据
import store from '@/store'
// 引入一份进度条插件
import NProgress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'

const whiteList = ['/login', '/404']

// 全局前置路由守卫
router.beforeEach(async(to, from, next) => {
  // 开启进度条
  NProgress.start()
  // 根据逻辑流程进行判断
  // 有 token ?
  if (store.getters.token) {
    if (to.path === '/login') {
      // 登录页? -> 首页
      next('/')
    } else {
      // 这里面就已经确认了, 有token 而且不是登录页
      // 可以放行, 之后的页面一定都会需要用到用用户信息
      // 没必要等到页面内部逐一编写, 可以在这里就进行处理
      // 不是 -> 通行
      if (!store.getters.userId) {
        // 除了触发获取信息 action 内部会存入 vuex 以外
        // 还需要返回出来, 这里准备进行路由的筛选
        const { roles } = await store.dispatch('user/getUserInfo')
        await store.dispatch('permission/filterRoutes', roles)
      }
      next()
    }
  } else {
    // 没 token ?
    // 目标是否在白名单? -> 通行
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      // 不在 -> 登录页
      next('/login')
    }
  }
  // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
  NProgress.done()
})

// 全局后置路由守卫
router.afterEach(() => {
  // 关闭进度条
  NProgress.done()
})
