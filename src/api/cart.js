import request from '@/utils/axios'

// 获取购物车列表
export const getCartList = () => {
  return request({
    url: '/cart/list',
    method: 'get'
  })
}

// 添加到购物车
export const addToCart = (data) => {
  return request({
    url: '/cart/add',
    method: 'post',
    data
  })
}

// 更新购物车
export const updateCart = (data) => {
  return request({
    url: '/cart/update',
    method: 'post',
    data
  })
}

// 删除购物车商品
export const deleteCart = (id) => {
  return request({
    url: `/cart/delete/${id}`,
    method: 'delete'
  })
}
