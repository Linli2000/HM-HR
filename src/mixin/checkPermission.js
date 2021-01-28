import store from '@/store'

export default {
  methods: {
    checkPermission(key) {
      // 遍历当前用户的 assignRoles.points 数组
      // 如果key存在, 就是有权限, 返回 true, 否则 false
      // 现在不在 vue 实例内, 拿不到 this
      // store 需要靠引入
      const { roles } = store.state.user.userInfo
      return roles.points.indexOf(key) > -1
    }
}