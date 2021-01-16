import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token'
const TimeKey = 'hrsaas-timestamp-key' // 设置一个独一无二的key

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
// 声明用于记录和获取时间戳 cookies 的函数
export function setTimeStamp() {
  return Cookies.set(TimeKey, Date.now())
}

// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(TimeKey)
}

