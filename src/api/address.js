import request from '@/utils/axios'

// 获取地址列表
export const getAddressList = () => {
  return request({
    url: '/address/list',
    method: 'get'
  })
}

// 添加地址
export const addAddress = (data) => {
  return request({
    url: '/address/add',
    method: 'post',
    data
  })
}

// 更新地址
export const updateAddress = (id, data) => {
  return request({
    url: `/address/update/${id}`,
    method: 'post',
    data
  })
}

// 删除地址
export const deleteAddress = (id) => {
  return request({
    url: `/address/delete/${id}`,
    method: 'delete'
  })
}

// 设置默认地址
export const setDefaultAddress = (id) => {
  return request({
    url: `/address/setDefault/${id}`,
    method: 'post'
  })
}
