import request from '@/utils/axios'

// 获取首页数据
export const getHomeData = () => {
  return request({
    url: '/home',
    method: 'get'
  })
}
