import request from '@/utils/axios'

// 获取分类列表
export const getCategoryList = () => {
  return request({
    url: '/category/list',
    method: 'get'
  })
}
