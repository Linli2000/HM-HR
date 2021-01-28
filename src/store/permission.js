import { constantRoutes } from '@/router'
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
const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
