import request from '@/utils/request'

// 获取员工的简单列表 下拉列表中的选项

export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}