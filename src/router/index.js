import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    meta: { title: '首页', showTabbar: true }
  },
  {
    path: '/category',
    name: 'Category',
    component: () => import('@/views/category/index.vue'),
    meta: { title: '分类', showTabbar: true }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/cart/index.vue'),
    meta: { title: '购物车', showTabbar: true, requireAuth: true }
  },
  {
    path: '/member',
    name: 'Member',
    component: () => import('@/views/user/member.vue'),
    meta: { title: '我的', showTabbar: true }
  },
  {
    path: '/product/list',
    name: 'ProductList',
    component: () => import('@/views/product/list.vue'),
    meta: { title: '商品列表' }
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('@/views/product/detail.vue'),
    meta: { title: '商品详情' }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/product/search.vue'),
    meta: { title: '搜索' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/user/login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/user/register.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/order/create',
    name: 'OrderCreate',
    component: () => import('@/views/order/create.vue'),
    meta: { title: '确认订单', requireAuth: true }
  },
  {
    path: '/order/list',
    name: 'OrderList',
    component: () => import('@/views/order/list.vue'),
    meta: { title: '我的订单', requireAuth: true }
  },
  {
    path: '/order/:id',
    name: 'OrderDetail',
    component: () => import('@/views/order/detail.vue'),
    meta: { title: '订单详情', requireAuth: true }
  },
  {
    path: '/address',
    name: 'Address',
    component: () => import('@/views/address/index.vue'),
    meta: { title: '地址管理', requireAuth: true }
  },
  {
    path: '/address/add',
    name: 'AddressAdd',
    component: () => import('@/views/address/add.vue'),
    meta: { title: '新增地址', requireAuth: true }
  },
  {
    path: '/address/edit/:id',
    name: 'AddressEdit',
    component: () => import('@/views/address/edit.vue'),
    meta: { title: '编辑地址', requireAuth: true }
  },
  {
    path: '/user/info',
    name: 'UserInfo',
    component: () => import('@/views/user/info.vue'),
    meta: { title: '个人信息', requireAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || '电商平台'
  
  // 检查是否需要登录
  if (to.meta.requireAuth) {
    const userStore = useUserStore()
    if (!userStore.isLogin()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }
  
  next()
})

export default router
