import { setToken, getToken, removeToken, setTimeStamp } from '@/utils/auth.js'

import { getUserDetailById, getUserInfo, login } from '@/api/user.js'
import { resetRouter } from '@/router'
const state = {
  // 页面刷新获取默认值,如果没有则为空
  token: getToken(),
  userInfo: {}
}

const mutations = {
  setToken(state, data) {
    // 这里只是对 vuex 数据的处理
    // 但是没有持久化
    // 持久化的两个步骤
    // 1. 数据发生变化时, 存放起来
    state.token = data
    // 2.数据变化时存放到本地存储
    setToken(data)
  },
  removeToken(state) {
    // 删除token信息
    state.token = ''
    removeToken()
  },
  setUserInfo(state, data) {
    // 存储用户信息
    state.userInfo = { ...data }
  },
  removeUserInfo(state) {
    // 删除用户信息
    state.userInfo = {}
  }
}

const actions = {
  async login({ commit }, data) {
    const res = await login(data)
    commit('setToken', res)
    setTimeStamp()
  },
  async getUserInfo({ commit }) {
    const simpleInfo = await getUserInfo()
    // 上一个接口问题在于数据太过简陋, 缺少了图片
    // 唯一的好处就是带有用户 id
    // 接下来需要利用这个id继续获取当前用户的其他资料
    const detailInfo = await getUserDetailById(simpleInfo.userId)
    // 将两个接口结果合并
    const totalInfo = {
      ...simpleInfo,
      ...detailInfo
    }
    // 作为数据的获取来说, 上面两部已经完成了
    // 这里有一个后面会用到的数据返回
    commit('setUserInfo', totalInfo)
    return totalInfo
  },
  logout({ commit }) {
    // 清理token
    commit('removeToken')
    // 清理用户数据
    commit('removeUserInfo')
    // 登出时需要清理路由数据
    // router实例重置
    resetRouter()
    // vuex permission 模块里面的 state 应该重置
    // 这里需要调用兄弟模块的mutation, commit时
    // 多添加一个参数作为配置对象, 里面添加属性 root: true
    commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
