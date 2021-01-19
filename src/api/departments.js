import request from '@/utils/request'

export function getDepartments() {
  return request({
    url: '/company/department'
  })
}
// 删除部门接口
export function delDepartments(id) {
  return request({
    method: 'delete',
    url: `/company/department/${id}`
  })
}
// 新增部门接口
export function addDepartments(data) {
  return request({
    method: 'post',
    url: '/company/department',
    data
  })
}

