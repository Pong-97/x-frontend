import request from '@/utils/axios'

// 创建订单
export const createOrder = (data) => {
  return request({
    url: '/order/create',
    method: 'post',
    data
  })
}

// 获取订单列表
export const getOrderList = (params) => {
  return request({
    url: '/order/list',
    method: 'get',
    params
  })
}

// 获取订单详情
export const getOrderDetail = (id) => {
  return request({
    url: `/order/${id}`,
    method: 'get'
  })
}

// 取消订单
export const cancelOrder = (id) => {
  return request({
    url: `/order/cancel/${id}`,
    method: 'post'
  })
}

// 确认收货
export const confirmOrder = (id) => {
  return request({
    url: `/order/confirm/${id}`,
    method: 'post'
  })
}

// 删除订单
export const deleteOrder = (id) => {
  return request({
    url: `/order/delete/${id}`,
    method: 'delete'
  })
}
