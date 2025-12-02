import request from '@/utils/axios'

// 获取商品列表
export const getProductList = (params) => {
  return request({
    url: '/product/list',
    method: 'get',
    params
  })
}

// 获取商品详情
export const getProductDetail = (id) => {
  return request({
    url: `/product/${id}`,
    method: 'get'
  })
}

// 搜索商品
export const searchProduct = (params) => {
  return request({
    url: '/product/search',
    method: 'get',
    params
  })
}
