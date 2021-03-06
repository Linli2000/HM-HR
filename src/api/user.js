import request from '@/utils/request'

export function login(data) {
  return request({
    method: 'post',
    url: '/sys/login',
    data: data
  })
}

export function getUserInfo() {
  return request({
    method: 'post',
    url: '/sys/profile'
  })
}

export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
