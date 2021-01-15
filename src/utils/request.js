import axios from 'axios'
import { Message } from 'element-ui' // 导入element弹窗
import store from '@/store'

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
service.interceptors.request.use(config => {
  // 统一实现请求 token 注入
  // 1. 判断有登陆过
  // 2. 是否已经带有 token
  if (store.getters.token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  // 拦截判断成功后需要返回
  return config
}, err => {
  debugger
  Message.error('请求失败')
  return Promise.reject(err)
})

// response interceptor
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
}, err => {
  // 弹窗提示
  Message.error(err.massage)
  // reject
  return Promise.reject(err)
})

export default service
