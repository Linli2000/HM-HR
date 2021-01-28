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
        // 第一种思路
        // 筛选路由的逻辑是, 拿到所有的动态路由配置
        // 遍历
        // 每个动态路由都拿出 name 属性 看看在 roles.menus 中是否存在
        // 存在就应该添加, 不存在则抛弃
        const routes = asyncRoutes.filter(item => {
          // some 方法其实是查找一个数组中是否存在满足条件的属性
          // 有则返回 true
          // 现在我们的目标想要找 menus 里面是否有跟当前路由name 相同的标记
          // 如果有则为 true
          // 方法1 索引筛选
          return roles.menus.indexOf(item.name) > -1
          // 方法2 some 筛选
          // return roles.menus.some(key => key === item.name)
        })
        console.log(routes)

        // 第二种思路
        // 创建一个空数组备用
        // 遍历 roles.menus
        // 每遍历出一个权限, 就尝试在路由配置中找到对应的配置对象
        // 放入空数组
        // 最终得到所有有权限的路由配置了
        // const routes = []
        // roles.menus.forEach(key => {
        //   routes.push(...asyncRoutes.filter(item => item.name === key))
        // })
        // console.log(routes)
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
