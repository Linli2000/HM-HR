import { setToken, getToken } from '@/utils/auth.js'

import { getUserInfo, login } from '@/api/user.js'
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
  },
  async getUserInfo({ commit }) {
    const res = await getUserInfo()
    commit('setUserInfo', res)
    // 作为数据的获取来说, 上面两部已经完成了
    // 这里有一个后面会用到的数据返回
    return res
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
