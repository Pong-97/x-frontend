<template>
  <div class="order-detail-page">
    <van-nav-bar title="订单详情" left-arrow @click-left="goBack" fixed placeholder />

    <div class="order-status-box">
      <van-icon :name="getStatusIcon(order.status)" size="40" />
      <div class="status-text">{{ getStatusText(order.status) }}</div>
    </div>

    <div class="address-box">
      <van-icon name="location-o" class="icon" />
      <div class="address-info">
        <div class="address-header">
          <span class="name">{{ order.address?.name }}</span>
          <span class="phone">{{ order.address?.phone }}</span>
        </div>
        <div class="address-detail">{{ order.address?.detail }}</div>
      </div>
    </div>

    <div class="goods-box">
      <div
        v-for="item in order.items"
        :key="item.productId"
        class="goods-item"
      >
        <img :src="item.productImage" class="goods-image" />
        <div class="goods-info">
          <div class="goods-name">{{ item.productName }}</div>
          <div class="goods-spec" v-if="item.spec">{{ item.spec }}</div>
          <div class="goods-bottom">
            <span class="price">¥{{ item.price }}</span>
            <span class="quantity">x{{ item.quantity }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="order-info-box">
      <van-cell-group>
        <van-cell title="订单编号" :value="order.orderNo" />
        <van-cell title="创建时间" :value="order.createTime" />
        <van-cell title="支付时间" :value="order.payTime || '-'" />
        <van-cell title="商品总价" :value="`¥${order.totalAmount}`" />
        <van-cell title="运费" value="¥0.00" />
      </van-cell-group>
    </div>

    <div class="total-box">
      <span>实付款:</span>
      <span class="price">¥{{ order.totalAmount }}</span>
    </div>

    <div class="action-box">
      <van-button
        v-if="order.status === 0"
        block
        plain
        @click="cancelOrder"
      >
        取消订单
      </van-button>
      <van-button
        v-if="order.status === 0"
        block
        type="danger"
        @click="payOrder"
      >
        去支付
      </van-button>
      <van-button
        v-if="order.status === 2"
        block
        type="primary"
        @click="confirmReceive"
      >
        确认收货
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getOrderDetail, cancelOrder as cancelOrderApi, confirmOrder } from '@/api/order'
import { showConfirmDialog, showToast } from 'vant'

const router = useRouter()
const route = useRoute()

const order = ref({
  items: [],
  address: {}
})

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

const getStatusIcon = (status) => {
  const iconMap = {
    0: 'pending-payment',
    1: 'tosend',
    2: 'logistics',
    3: 'comment-o',
    4: 'checked'
  }
  return iconMap[status] || 'info-o'
}

const loadOrderDetail = async () => {
  try {
    const id = route.params.id
    const data = await getOrderDetail(id)
    order.value = data
  } catch (error) {
    console.error('加载订单详情失败', error)
  }
}

const cancelOrder = async () => {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确定要取消订单吗？'
    })
    await cancelOrderApi(order.value.id)
    showToast('订单已取消')
    await loadOrderDetail()
  } catch (error) {
    // 用户取消或失败
  }
}

const payOrder = () => {
  showToast('跳转支付页面')
  // 实际项目中跳转到支付页面
}

const confirmReceive = async () => {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确认已收到货物吗？'
    })
    await confirmOrder(order.value.id)
    showToast('确认收货成功')
    await loadOrderDetail()
  } catch (error) {
    // 用户取消或失败
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadOrderDetail()
})
</script>

<style scoped lang="less">
.order-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

.order-status-box {
  background: white;
  padding: 30px;
  text-align: center;
  margin-bottom: 10px;
  
  .status-text {
    font-size: 18px;
    font-weight: bold;
    margin-top: 10px;
  }
}

.address-box {
  background: white;
  padding: 15px;
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
  
  .icon {
    font-size: 20px;
    color: #ff4444;
    flex-shrink: 0;
  }
  
  .address-info {
    flex: 1;
    
    .address-header {
      display: flex;
      gap: 15px;
      margin-bottom: 8px;
      font-size: 14px;
      
      .name {
        font-weight: bold;
      }
    }
    
    .address-detail {
      font-size: 13px;
      color: #666;
      line-height: 1.5;
    }
  }
}

.goods-box {
  background: white;
  padding: 15px;
  margin-bottom: 10px;
  
  .goods-item {
    display: flex;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #f5f5f5;
    
    &:last-child {
      border-bottom: none;
    }
    
    .goods-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
      flex-shrink: 0;
    }
    
    .goods-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
      .goods-name {
        font-size: 14px;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      
      .goods-spec {
        font-size: 12px;
        color: #999;
      }
      
      .goods-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .price {
          font-size: 16px;
          color: #ff4444;
          font-weight: bold;
        }
        
        .quantity {
          font-size: 14px;
          color: #999;
        }
      }
    }
  }
}

.order-info-box {
  margin-bottom: 10px;
}

.total-box {
  background: white;
  padding: 15px;
  text-align: right;
  font-size: 14px;
  margin-bottom: 10px;
  
  .price {
    font-size: 20px;
    color: #ff4444;
    font-weight: bold;
    margin-left: 5px;
  }
}

.action-box {
  padding: 0 15px;
  display: flex;
  gap: 10px;
}
</style>
