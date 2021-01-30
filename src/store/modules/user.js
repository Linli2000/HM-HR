import { setToken, getToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
const state = {
  // 2. 页面刷新初始化时, 尝试恢复
  token: getToken(),
  userInfo: {}
}

const mutations = {
  setToken(state, data) {
    // 这里只是对 vuex 数据的处理
    // 但是没有持久化
    // 持久化的两个步骤
    // 1. 数据发生变化时, 存放起来
    setToken(data)

    state.token = data
  },
  removeToken(state) {
    state.token = ''
    removeToken()
  },
  setUserInfo(state, data) {
    state.userInfo = { ...data }
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}

const actions = {
  async login({ commit }, data) {
    const res = await login(data)
    // res.data.data 就是 token
    console.log('将登录页的逻辑移动到 vuex 里面')
    commit('setToken', res)
    setTimeStamp()
  },
  // login({ commit }, data) {
  //   login(data).then(res => {
  //     if (!res.data.success) {
  //       alert('用户名或密码错误')
  //     } else {
  //       console.log('将登录页的逻辑移动到 vuex 里面')
  //       commit('setToken', res.data.data)
  //     }
  //     // 这里需要处理连接本身没有问题, 但是用户数据出错的情况
  //   }).catch(err => {
  //     console.log(err)
  //   })
  // res.data.data 就是 token
  // }
  async getUserInfo({ commit }) {
    const simpleInfo = await getUserInfo()
    // 上一个接口问题在于数据太过简陋, 缺少了图片
    // 唯一的好处就是带有用户 id
    // 接下来需要利用这个id继续获取当前用户的其他资料
    const detailInfo = await getUserDetailById(simpleInfo.userId)

    const totalInfo = {
      ...simpleInfo,
      ...detailInfo
    }

    commit('setUserInfo', totalInfo)
    // 作为数据的获取来说, 上面两部已经完成了
    // 这里有一个后面会用到的数据返回
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
