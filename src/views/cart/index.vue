<template>
  <div class="cart-page">
    <van-nav-bar title="购物车" fixed placeholder />

    <div v-if="cartStore.cartList.length === 0" class="empty-cart">
      <van-empty description="购物车是空的" />
      <van-button type="primary" round block @click="goHome">去逛逛</van-button>
    </div>

    <div v-else class="cart-content">
      <van-checkbox-group v-model="checkedIds">
        <div
          v-for="item in cartStore.cartList"
          :key="item.id"
          class="cart-item"
        >
          <van-checkbox :name="item.id" />
          <img :src="item.productImage" class="product-image" @click="goProductDetail(item.productId)" />
          <div class="product-info">
            <div class="product-name">{{ item.productName || '商品' }}</div>
            <div class="product-spec" v-if="item.spec">{{ item.spec }}</div>
            <div class="product-bottom">
              <div class="price">¥{{ item.price || 0 }}</div>
              <van-stepper
                v-model="item.quantity"
                @change="updateQuantity(item)"
                min="1"
                :max="item.stock || 99"
              />
            </div>
          </div>
          <van-icon name="delete-o" class="delete-icon" @click="deleteItem(item.id)" />
        </div>
      </van-checkbox-group>
    </div>

    <!-- 底部结算栏 -->
    <div v-if="cartStore.cartList.length > 0" class="cart-footer">
      <van-checkbox v-model="checkAll" @change="onCheckAll">全选</van-checkbox>
      <div class="total-info">
        <div class="total-price">
          合计: <span class="price">¥{{ totalPrice.toFixed(2) }}</span>
        </div>
        <van-button
          type="primary"
          round
          :disabled="checkedIds.length === 0"
          @click="goCheckout"
        >
          结算({{ checkedIds.length }})
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { showConfirmDialog, showToast } from 'vant'

const router = useRouter()
const cartStore = useCartStore()
const checkedIds = ref([])

const checkAll = computed({
  get() {
    return checkedIds.value.length === cartStore.cartList.length && cartStore.cartList.length > 0
  },
  set(val) {
    if (val) {
      checkedIds.value = cartStore.cartList.map(item => item.id)
    } else {
      checkedIds.value = []
    }
  }
})

const totalPrice = computed(() => {
  return cartStore.cartList
    .filter(item => checkedIds.value.includes(item.id))
    .reduce((total, item) => total + (item.price || 0) * item.quantity, 0)
})

const onCheckAll = (checked) => {
  if (checked) {
    checkedIds.value = cartStore.cartList.map(item => item.id)
  } else {
    checkedIds.value = []
  }
}

const updateQuantity = async (item) => {
  try {
    await cartStore.updateCart({
      id: item.id,
      quantity: item.quantity
    })
  } catch (error) {
    console.error('更新数量失败', error)
  }
}

const deleteItem = async (id) => {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确定要删除该商品吗？'
    })
    await cartStore.deleteCart(id)
    showToast('删除成功')
  } catch (error) {
    // 用户取消
  }
}

const goHome = () => {
  router.push('/home')
}

const goProductDetail = (id) => {
  router.push(`/product/${id}`)
}

const goCheckout = () => {
  const selectedItems = cartStore.cartList.filter(item => 
    checkedIds.value.includes(item.id)
  )
  router.push({
    path: '/order/create',
    query: { items: JSON.stringify(selectedItems.map(item => item.id)) }
  })
}

onMounted(() => {
  cartStore.getCart()
})
</script>

<style scoped lang="less">
.cart-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 60px;
}

.empty-cart {
  padding: 100px 20px 20px;
  
  .van-button {
    margin-top: 20px;
  }
}

.cart-content {
  padding: 10px;
  
  .cart-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 15px;
    background: white;
    border-radius: 8px;
    margin-bottom: 10px;
    position: relative;
    
    .product-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
      flex-shrink: 0;
    }
    
    .product-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      
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
        background: #f5f5f5;
        padding: 4px 8px;
        border-radius: 4px;
        display: inline-block;
        align-self: flex-start;
      }
      
      .product-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .price {
          font-size: 16px;
          color: #ff4444;
          font-weight: bold;
        }
      }
    }
    
    .delete-icon {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 18px;
      color: #999;
    }
  }
}

.cart-footer {
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
  background: white;
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  
  .total-info {
    display: flex;
    align-items: center;
    gap: 15px;
    
    .total-price {
      font-size: 14px;
      color: #333;
      
      .price {
        font-size: 18px;
        color: #ff4444;
        font-weight: bold;
      }
    }
  }
}
</style>
