<template>
  <div class="order-list-page">
    <van-nav-bar title="我的订单" left-arrow @click-left="goBack" fixed placeholder />

    <!-- 订单状态标签 -->
    <van-tabs v-model:active="activeTab" @change="changeTab">
      <van-tab title="全部" name="all" />
      <van-tab title="待付款" name="0" />
      <van-tab title="待发货" name="1" />
      <van-tab title="待收货" name="2" />
      <van-tab title="待评价" name="3" />
    </van-tabs>

    <!-- 订单列表 -->
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div class="order-list">
        <div v-for="order in orders" :key="order.id" class="order-item">
          <div class="order-header">
            <span class="order-no">订单号: {{ order.orderNo }}</span>
            <span :class="['order-status', `status-${order.status}`]">
              {{ getStatusText(order.status) }}
            </span>
          </div>

          <div class="order-products">
            <div
              v-for="product in order.products"
              :key="product.productId"
              class="product-item"
              @click="goOrderDetail(order.id)"
            >
              <img :src="product.image" class="product-image" />
              <div class="product-info">
                <div class="product-name">{{ product.name }}</div>
                <div class="product-spec">{{ product.spec }}</div>
                <div class="product-bottom">
                  <span class="price">¥{{ product.price }}</span>
                  <span class="quantity">x{{ product.quantity }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="order-footer">
            <div class="total-price">
              合计: <span class="price">¥{{ order.totalAmount }}</span>
            </div>
            <div class="order-actions">
              <van-button
                v-if="order.status === 0"
                size="small"
                @click="cancelOrder(order.id)"
              >
                取消订单
              </van-button>
              <van-button
                v-if="order.status === 0"
                size="small"
                type="danger"
                @click="payOrder(order.id)"
              >
                去支付
              </van-button>
              <van-button
                v-if="order.status === 2"
                size="small"
                type="primary"
                @click="confirmReceive(order.id)"
              >
                确认收货
              </van-button>
              <van-button
                v-if="order.status === 3"
                size="small"
                type="primary"
              >
                去评价
              </van-button>
            </div>
          </div>
        </div>
      </div>
    </van-list>

    <van-empty v-if="!loading && orders.length === 0" description="暂无订单" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getOrderList, cancelOrder as cancelOrderApi, confirmOrder } from '@/api/order'
import { showConfirmDialog, showToast } from 'vant'

const router = useRouter()
const route = useRoute()

const activeTab = ref('all')
const orders = ref([])
const loading = ref(false)
const finished = ref(false)
const page = ref(1)

const statusMap = {
  0: '待付款',
  1: '待发货',
  2: '待收货',
  3: '待评价',
  4: '已完成'
}

const getStatusText = (status) => {
  return statusMap[status] || '未知'
}

const loadOrders = async () => {
  try {
    const params = {
      page: page.value,
      pageSize: 10
    }
    
    if (activeTab.value !== 'all') {
      params.status = activeTab.value
    }
    
    const data = await getOrderList(params)
    
    if (page.value === 1) {
      orders.value = data.list
    } else {
      orders.value.push(...data.list)
    }
    
    loading.value = false
    
    if (data.list.length < 10) {
      finished.value = true
    }
  } catch (error) {
    console.error('加载订单列表失败', error)
    loading.value = false
  }
}

const onLoad = () => {
  page.value++
  loadOrders()
}

const changeTab = () => {
  page.value = 1
  finished.value = false
  orders.value = []
  loadOrders()
}

const goBack = () => {
  router.back()
}

const goOrderDetail = (id) => {
  router.push(`/order/${id}`)
}

const cancelOrder = async (id) => {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确定要取消订单吗？'
    })
    await cancelOrderApi(id)
    showToast('订单已取消')
    changeTab()
  } catch (error) {
    // 用户取消或失败
  }
}

const payOrder = (id) => {
  showToast('跳转支付页面')
  // 实际项目中跳转到支付页面
}

const confirmReceive = async (id) => {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确认已收到货物吗？'
    })
    await confirmOrder(id)
    showToast('确认收货成功')
    changeTab()
  } catch (error) {
    // 用户取消或失败
  }
}

onMounted(() => {
  // 从路由参数获取初始状态
  if (route.query.status !== undefined) {
    activeTab.value = route.query.status
  }
  loadOrders()
})
</script>

<style scoped lang="less">
.order-list-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.order-list {
  padding: 10px;
  
  .order-item {
    background: white;
    border-radius: 8px;
    margin-bottom: 10px;
    overflow: hidden;
    
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 15px;
      background: #f5f5f5;
      font-size: 12px;
      
      .order-no {
        color: #666;
      }
      
      .order-status {
        font-weight: bold;
        
        &.status-0 {
          color: #ff9800;
        }
        
        &.status-1 {
          color: #2196f3;
        }
        
        &.status-2 {
          color: #4caf50;
        }
        
        &.status-3 {
          color: #9c27b0;
        }
        
        &.status-4 {
          color: #999;
        }
      }
    }
    
    .order-products {
      .product-item {
        display: flex;
        gap: 12px;
        padding: 12px 15px;
        border-bottom: 1px solid #f5f5f5;
        
        &:last-child {
          border-bottom: none;
        }
        
        .product-image {
          width: 70px;
          height: 70px;
          object-fit: cover;
          border-radius: 8px;
          flex-shrink: 0;
        }
        
        .product-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          
          .product-name {
            font-size: 14px;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          
          .product-spec {
            font-size: 12px;
            color: #999;
          }
          
          .product-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .price {
              font-size: 14px;
              color: #333;
            }
            
            .quantity {
              font-size: 12px;
              color: #999;
            }
          }
        }
      }
    }
    
    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 15px;
      
      .total-price {
        font-size: 14px;
        
        .price {
          font-size: 16px;
          color: #ff4444;
          font-weight: bold;
        }
      }
      
      .order-actions {
        display: flex;
        gap: 8px;
      }
    }
  }
}
</style>
