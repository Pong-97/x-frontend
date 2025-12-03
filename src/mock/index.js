import Mock from 'mockjs'

// 配置Mock
Mock.setup({
  timeout: '200-600'
})

const Random = Mock.Random

// 生成商品数据
const generateProducts = (count = 20) => {
  const products = []
  for (let i = 1; i <= count; i++) {
    // 先生成原价，再根据折扣生成现价，确保现价小于原价
    const originalPrice = Random.float(100, 1200, 2, 2)
    const discount = Random.float(0.5, 0.95, 2, 2) // 5折到9.5折
    const price = parseFloat((originalPrice * discount).toFixed(2))
    
    products.push({
      id: i,
      name: Random.ctitle(5, 15),
      price: price,
      originalPrice: originalPrice,
      image: Random.image('300x300', Random.color(), '#FFF', 'png', Random.word(2)),
      images: [
        Random.image('600x600', Random.color(), '#FFF', 'png', '1'),
        Random.image('600x600', Random.color(), '#FFF', 'png', '2'),
        Random.image('600x600', Random.color(), '#FFF', 'png', '3')
      ],
      description: Random.cparagraph(3, 7),
      stock: Random.integer(0, 1000),
      sales: Random.integer(0, 10000),
      categoryId: Random.integer(1, 8),
      specs: [
        { name: '颜色', values: ['红色', '蓝色', '黑色', '白色'] },
        { name: '尺寸', values: ['S', 'M', 'L', 'XL'] }
      ],
      rating: Random.float(3, 5, 1, 1)
    })
  }
  return products
}

// 生成分类数据
const categories = [
  { id: 1, name: '手机数码', icon: '📱', children: [
    { id: 11, name: '手机', parentId: 1 },
    { id: 12, name: '平板', parentId: 1 },
    { id: 13, name: '笔记本', parentId: 1 }
  ]},
  { id: 2, name: '服装鞋包', icon: '👔', children: [
    { id: 21, name: '男装', parentId: 2 },
    { id: 22, name: '女装', parentId: 2 },
    { id: 23, name: '鞋靴', parentId: 2 }
  ]},
  { id: 3, name: '家用电器', icon: '🏠', children: [
    { id: 31, name: '大家电', parentId: 3 },
    { id: 32, name: '小家电', parentId: 3 }
  ]},
  { id: 4, name: '美妆护肤', icon: '💄', children: [
    { id: 41, name: '面部护肤', parentId: 4 },
    { id: 42, name: '彩妆', parentId: 4 }
  ]},
  { id: 5, name: '食品生鲜', icon: '🍎', children: [
    { id: 51, name: '水果', parentId: 5 },
    { id: 52, name: '零食', parentId: 5 }
  ]},
  { id: 6, name: '运动户外', icon: '⚽', children: [
    { id: 61, name: '运动鞋', parentId: 6 },
    { id: 62, name: '运动服', parentId: 6 }
  ]},
  { id: 7, name: '图书文娱', icon: '📚', children: [
    { id: 71, name: '图书', parentId: 7 },
    { id: 72, name: '文具', parentId: 7 }
  ]},
  { id: 8, name: '母婴玩具', icon: '🧸', children: [
    { id: 81, name: '奶粉', parentId: 8 },
    { id: 82, name: '玩具', parentId: 8 }
  ]}
]

// 生成轮播图数据
const banners = [
  { id: 1, image: Random.image('750x400', '#FF6B6B', '#FFF', 'png', '促销1'), link: '/product/1' },
  { id: 2, image: Random.image('750x400', '#4ECDC4', '#FFF', 'png', '促销2'), link: '/product/2' },
  { id: 3, image: Random.image('750x400', '#45B7D1', '#FFF', 'png', '促销3'), link: '/product/3' }
]

const products = generateProducts(50)

// 用户登录
Mock.mock('/api/user/login', 'post', (options) => {
  const { username, password } = JSON.parse(options.body)
  if (username && password) {
    return {
      code: 200,
      message: '登录成功',
      data: {
        token: Random.guid(),
        userInfo: {
          id: 1,
          username: username,
          nickname: Random.cname(),
          avatar: Random.image('200x200', Random.color(), '#FFF', 'png', '头像'),
          phone: '138****8888',
          email: Random.email()
        }
      }
    }
  }
  return {
    code: 400,
    message: '用户名或密码错误'
  }
})

// 用户注册
Mock.mock('/api/user/register', 'post', {
  code: 200,
  message: '注册成功',
  data: {
    token: Random.guid(),
    userInfo: {
      id: Random.integer(1, 1000),
      username: '@cname',
      nickname: '@cname',
      avatar: Random.image('200x200', Random.color(), '#FFF', 'png', '头像'),
      phone: /^1[3-9]\d{9}$/,
      email: '@email'
    }
  }
})

// 获取用户信息
Mock.mock('/api/user/info', 'get', {
  code: 200,
  data: {
    id: 1,
    username: '@cname',
    nickname: '@cname',
    avatar: Random.image('200x200', Random.color(), '#FFF', 'png', '头像'),
    phone: /^1[3-9]\d{9}$/,
    email: '@email'
  }
})

// 更新用户信息
Mock.mock('/api/user/update', 'post', {
  code: 200,
  message: '更新成功',
  data: true
})

// 获取首页数据
Mock.mock('/api/home', 'get', {
  code: 200,
  data: {
    banners: banners,
    categories: categories,
    hotProducts: products.slice(0, 10),
    newProducts: products.slice(10, 20),
    recommendProducts: products.slice(20, 30)
  }
})

// 获取分类列表
Mock.mock('/api/category/list', 'get', {
  code: 200,
  data: categories
})

// 获取商品列表
Mock.mock(RegExp('/api/product/list.*'), 'get', (options) => {
  const url = new URL('http://localhost' + options.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
  const categoryId = url.searchParams.get('categoryId')
  
  let filteredProducts = products
  if (categoryId) {
    filteredProducts = products.filter(p => p.categoryId === parseInt(categoryId))
  }
  
  const start = (page - 1) * pageSize
  const end = start + pageSize
  
  return {
    code: 200,
    data: {
      list: filteredProducts.slice(start, end),
      total: filteredProducts.length,
      page,
      pageSize
    }
  }
})

// 获取商品详情
Mock.mock(RegExp('/api/product/\\d+'), 'get', (options) => {
  const id = parseInt(options.url.match(/\/api\/product\/(\d+)/)[1])
  const product = products.find(p => p.id === id) || products[0]
  return {
    code: 200,
    data: product
  }
})

// 搜索商品
Mock.mock(RegExp('/api/product/search.*'), 'get', (options) => {
  const url = new URL('http://localhost' + options.url)
  const keyword = url.searchParams.get('keyword')
  const filteredProducts = products.filter(p => p.name.includes(keyword))
  
  return {
    code: 200,
    data: {
      list: filteredProducts.slice(0, 20),
      total: filteredProducts.length
    }
  }
})

// 获取购物车
Mock.mock('/api/cart/list', 'get', {
  code: 200,
  data: [
    {
      id: 1,
      productId: 1,
      product: products[0],
      quantity: 2,
      spec: '红色 M',
      checked: true
    },
    {
      id: 2,
      productId: 2,
      product: products[1],
      quantity: 1,
      spec: '蓝色 L',
      checked: true
    }
  ]
})

// 添加到购物车
Mock.mock('/api/cart/add', 'post', {
  code: 200,
  message: '添加成功',
  data: true
})

// 更新购物车
Mock.mock('/api/cart/update', 'post', {
  code: 200,
  message: '更新成功',
  data: true
})

// 删除购物车
Mock.mock(RegExp('/api/cart/delete/\\d+'), 'delete', {
  code: 200,
  message: '删除成功',
  data: true
})

// 获取地址列表
Mock.mock('/api/address/list', 'get', {
  code: 200,
  'data|3-5': [{
    'id|+1': 1,
    name: '@cname',
    phone: /^1[3-9]\d{9}$/,
    province: '@province',
    city: '@city',
    district: '@county',
    detail: '@county(true)@ctitle(5, 10)',
    isDefault: false
  }]
})

// 添加地址
Mock.mock('/api/address/add', 'post', {
  code: 200,
  message: '添加成功',
  data: {
    id: Random.integer(1, 1000)
  }
})

// 更新地址
Mock.mock(RegExp('/api/address/update/\\d+'), 'post', {
  code: 200,
  message: '更新成功',
  data: true
})

// 删除地址
Mock.mock(RegExp('/api/address/delete/\\d+'), 'delete', {
  code: 200,
  message: '删除成功',
  data: true
})

// 设置默认地址
Mock.mock(RegExp('/api/address/setDefault/\\d+'), 'post', {
  code: 200,
  message: '设置成功',
  data: true
})

// 创建订单
Mock.mock('/api/order/create', 'post', {
  code: 200,
  message: '订单创建成功',
  data: {
    orderId: Random.integer(1, 10000),
    orderNo: /\d{18}/
  }
})

// 获取订单列表
Mock.mock(RegExp('/api/order/list.*'), 'get', (options) => {
  const url = new URL('http://localhost' + options.url)
  const status = url.searchParams.get('status')
  const page = parseInt(url.searchParams.get('page') || '1')
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
  
  // 生成订单数据
  const orderCount = Random.integer(15, 30)
  const allOrders = []
  
  for (let i = 0; i < orderCount; i++) {
    const orderStatus = status ? parseInt(status) : Random.integer(0, 4)
    const productCount = Random.integer(1, 3)
    const products = []
    
    for (let j = 0; j < productCount; j++) {
      products.push({
        productId: Random.integer(1, 50),
        name: Random.ctitle(5, 15),
        image: Random.image('100x100', Random.color(), '#FFF', 'png', 'product'),
        price: Random.float(10, 999, 2, 2),
        quantity: Random.integer(1, 5),
        spec: '红色 M'
      })
    }
    
    allOrders.push({
      id: i + 1,
      orderNo: Random.string('number', 18),
      status: orderStatus,
      totalAmount: Random.float(100, 1000, 2, 2),
      createTime: Random.datetime(),
      products: products
    })
  }
  
  const start = (page - 1) * pageSize
  const end = start + pageSize
  
  return {
    code: 200,
    data: {
      list: allOrders.slice(start, end),
      total: allOrders.length,
      page,
      pageSize
    }
  }
})

// 获取订单详情
Mock.mock(RegExp('/api/order/[^/]+$'), 'get', {
  code: 200,
  data: {
    id: 1,
    orderNo: /\d{18}/,
    status: Random.integer(0, 4),
    totalAmount: Random.float(100, 1000, 2, 2),
    createTime: Random.datetime(),
    payTime: Random.datetime(),
    address: {
      name: '@cname',
      phone: /^1[3-9]\d{9}$/,
      detail: '@province@city@county(true)@ctitle(5, 10)'
    },
    'products|2-4': [{
      productId: Random.integer(1, 50),
      name: Random.ctitle(5, 15),
      image: Random.image('100x100', Random.color(), '#FFF', 'png', 'product'),
      price: Random.float(10, 999, 2, 2),
      quantity: Random.integer(1, 5),
      spec: '红色 M'
    }]
  }
})

// 取消订单
Mock.mock(RegExp('/api/order/cancel/\\d+'), 'post', {
  code: 200,
  message: '订单已取消',
  data: true
})

// 确认收货
Mock.mock(RegExp('/api/order/confirm/\\d+'), 'post', {
  code: 200,
  message: '确认收货成功',
  data: true
})

// 删除订单
Mock.mock(RegExp('/api/order/delete/\\d+'), 'delete', {
  code: 200,
  message: '删除成功',
  data: true
})

console.log('Mock数据已加载')

export default Mock
