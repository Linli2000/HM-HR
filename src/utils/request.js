import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { getTimeStamp } from '@/utils/auth'
import { Message } from 'element-ui' // 导入element弹窗

const timeout = 60 * 60 * 1000

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
// 就像响应拦截器一样, 这个请求拦截器, 也可以有两个参数
// 一个处理成功, 一个处理失败
// 虽然我们现在没什么失败的可能性, 但是还是可以写一个回调做保险
service.interceptors.request.use(async config => {
  // 统一实现请求 token 注入
  // 1. 判断有登陆过
  // 2. 是否已经带有 token
  if (store.getters.token && !config.headers.Authorization) {
    // config.headers.Authorization = `Bearer ${store.getters.token}`
    // 以上判断出是有有 token
    // 现在要多加一个处理逻辑,判断是否过期
    // 会封装一个函数检查是否过期, 如果返回 true 则是过期, 否则一切正常
    if (checkTimeout()) {
      // 过期
      // 1. 执行退出逻辑清理数据
      await store.dispatch('user/logout')
      // 2. 跳转到登录页
      router.push('/login')
      // 3. 拦截住剩下的请求
      Message.error('token 已超时')
      return Promise.reject('token 已超时')
    } else {
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
  }
  // 拦截判断成功后需要返回
  return config
}, err => {
  debugger
  Message.error('请求失败')
  return Promise.reject(err)
})

// response interceptor
// 响应
service.interceptors.response.use(res => {
  // 解构 res 得到 success / data / message
  const { success, data, message } = res.data
  // console.log(message)
  // 判断success
  if (success) {
    // 如果 success 为真, 正常返回
    // 另外 因为成功与否已经做过判断
    // 所以这里可以考虑把data数据的外壳给解构掉
    // 直接将最核心的数据响应会到调用代码中即可
    return data
  } else {
    // 数据错误提示
    Message.error(message || '系统错误')
    // 这里 reject 是为了使用的时候继续可以链式调用
    return Promise.reject(new Error(message))
  }
}, async err => {
  if (err.response && err.response.data && err.response.data.code === 10002) {
    // 有一种特殊情况, 如果 code === 10002
    // 那么就是 token 错误, 应该执行登出逻辑
    await store.dispatch('user/logout')
    router.push('/login')
    Message.error('登录失效')
  } else {
    console.dir(err)
    // 提示错误
    Message.error(err.message)
  }
  // reject
  return Promise.reject(err)
})

export default service

// 是否超时
// 超时逻辑 已经有token多久了 是不是大于我们设定的时间 (当前时间  - 缓存中的时间 已经存在的时间) 是否大于 时间差
const checkTimeout = () => {
  const loginTimeStamp = getTimeStamp()
  const nowTimeStamp = Date.now()
  return nowTimeStamp - loginTimeStamp > timeout
}
