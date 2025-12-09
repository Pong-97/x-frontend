<template>
  <div class="order-create-page">
    <van-nav-bar title="确认订单" left-arrow @click-left="goBack" fixed placeholder />

    <!-- 收货地址 -->
    <div class="address-box" @click="selectAddress">
      <div v-if="selectedAddress" class="address-info">
        <div class="address-header">
          <span class="name">{{ selectedAddress.name }}</span>
          <span class="phone">{{ selectedAddress.phone }}</span>
        </div>
        <div class="address-detail">
          {{ selectedAddress.province }} {{ selectedAddress.city }} {{ selectedAddress.district }} {{ selectedAddress.detail }}
        </div>
      </div>
      <div v-else class="no-address">
        <van-icon name="add-o" />
        <span>请选择收货地址</span>
      </div>
      <van-icon name="arrow" class="arrow" />
    </div>

    <!-- 商品列表 -->
    <div class="goods-box">
      <div class="goods-title">商品信息</div>
      <div v-for="item in orderItems" :key="item.id" class="goods-item">
        <img :src="item.productImage || item.product?.image" class="goods-image" />
        <div class="goods-info">
          <div class="goods-name">{{ item.productName || item.product?.name }}</div>
          <div class="goods-spec" v-if="item.spec">{{ item.spec }}</div>
          <div class="goods-bottom">
            <span class="price">¥{{ item.price || item.product?.price }}</span>
            <span class="quantity">x{{ item.quantity }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 订单信息 -->
    <div class="order-info-box">
      <van-cell-group>
        <van-cell title="商品总价" :value="`¥${totalPrice.toFixed(2)}`" />
        <van-cell title="运费" value="¥0.00" />
      </van-cell-group>
    </div>

    <!-- 备注 -->
    <div class="remark-box">
      <van-field
        v-model="remark"
        rows="2"
        autosize
        type="textarea"
        placeholder="订单备注（选填）"
      />
    </div>

    <!-- 底部提交栏 -->
    <div class="submit-bar">
      <div class="total-info">
        <span>实付款:</span>
        <span class="price">¥{{ totalPrice.toFixed(2) }}</span>
      </div>
      <van-button type="danger" round @click="handleSubmit" :loading="submitting">
        提交订单
      </van-button>
    </div>

    <!-- 地址选择弹窗 -->
    <van-popup v-model:show="showAddressPopup" position="bottom" round>
      <div class="address-popup">
        <div class="popup-header">
          <span>选择收货地址</span>
          <van-button type="primary" size="small" @click="goAddAddress">新增地址</van-button>
        </div>
        <div class="address-list">
          <div
            v-for="address in addressList"
            :key="address.id"
            :class="['address-item', { active: selectedAddress?.id === address.id }]"
            @click="chooseAddress(address)"
          >
            <div class="address-header">
              <span class="name">{{ address.name }}</span>
              <span class="phone">{{ address.phone }}</span>
              <van-tag v-if="address.isDefault" type="danger" size="small">默认</van-tag>
            </div>
            <div class="address-detail">
              {{ address.province }} {{ address.city }} {{ address.district }} {{ address.detail }}
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { getAddressList } from '@/api/address'
import { createOrder } from '@/api/order'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

const orderItems = ref([])
const selectedAddress = ref(null)
const addressList = ref([])
const showAddressPopup = ref(false)
const remark = ref('')
const submitting = ref(false)

const totalPrice = computed(() => {
  return orderItems.value.reduce((total, item) => {
    const price = item.price || item.product?.price || 0
    return total + price * item.quantity
  }, 0)
})

const loadAddressList = async () => {
  try {
    const data = await getAddressList()
    addressList.value = data
    // 默认选择默认地址
    const defaultAddress = data.find(item => item.isDefault)
    if (defaultAddress) {
      selectedAddress.value = defaultAddress
    } else if (data.length > 0) {
      selectedAddress.value = data[0]
    }
  } catch (error) {
    console.error('加载地址列表失败', error)
  }
}

const selectAddress = () => {
  showAddressPopup.value = true
}

const chooseAddress = (address) => {
  selectedAddress.value = address
  showAddressPopup.value = false
}

const goAddAddress = () => {
  router.push('/address/add')
}

const handleSubmit = async () => {
  if (!selectedAddress.value) {
    showToast('请选择收货地址')
    return
  }
  
  submitting.value = true
  try {
    const data = await createOrder({
      addressId: selectedAddress.value.id,
      cartIds: orderItems.value.map(item => item.id),
      remark: remark.value
    })
    
    showToast('订单创建成功')
    router.replace(`/order/${data.orderId}`)
  } catch (error) {
    console.error('创建订单失败', error)
  } finally {
    submitting.value = false
  }
}

const goBack = () => {
  router.back()
}

onMounted(async () => {
  await loadAddressList()
  
  // 从购物车来的订单
  if (route.query.items) {
    const itemIds = JSON.parse(route.query.items)
    await cartStore.getCart()
    orderItems.value = cartStore.cartList.filter(item => itemIds.includes(item.id))
  }
  // 立即购买的订单
  else if (route.query.productId) {
    // 这里简化处理，实际应该从商品详情获取
    orderItems.value = [{
      id: 1,
      productId: route.query.productId,
      quantity: parseInt(route.query.quantity || '1'),
      spec: route.query.spec || '',
      product: {
        id: route.query.productId,
        name: '商品名称',
        image: 'https://via.placeholder.com/100',
        price: 99.00
      }
    }]
  }
})
</script>

<style scoped lang="less">
.order-create-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 60px;
}

.address-box {
  background: white;
  padding: 15px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
  
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
  
  .no-address {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #999;
  }
  
  .arrow {
    margin-left: 10px;
  }
}

.goods-box {
  background: white;
  padding: 15px;
  margin-bottom: 10px;
  
  .goods-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  
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

.remark-box {
  background: white;
  margin-bottom: 10px;
}

.submit-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  
  .total-info {
    font-size: 14px;
    
    .price {
      font-size: 20px;
      color: #ff4444;
      font-weight: bold;
      margin-left: 5px;
    }
  }
}

.address-popup {
  max-height: 70vh;
  overflow-y: auto;
  
  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #f5f5f5;
    font-size: 16px;
    font-weight: bold;
  }
  
  .address-list {
    .address-item {
      padding: 15px;
      border-bottom: 1px solid #f5f5f5;
      
      &.active {
        background: #f5f5f5;
      }
      
      .address-header {
        display: flex;
        gap: 15px;
        align-items: center;
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
}
</style>
