import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  // 这里用来管理公共的路由配置
  routes: constantRoutes
}
const mutations = {
  // 修改当前路由 state 的方法
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = { filterRoutes(context, roles) {
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
  console.log('将筛选路由的过程封装在 vuex 里面')
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
} }

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
