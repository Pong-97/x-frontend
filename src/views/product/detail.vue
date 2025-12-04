<template>
  <div class="product-detail-page">
    <van-nav-bar title="商品详情" left-arrow @click-left="goBack" fixed placeholder />

    <!-- 商品图片 -->
    <van-swipe class="product-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(image, index) in product.images" :key="index">
        <img :src="image" />
      </van-swipe-item>
    </van-swipe>

    <!-- 商品信息 -->
    <div class="product-info">
      <div class="price-box">
        <ProductPrice :price="product.price" :original-price="product.originalPrice" />
      </div>
      <div class="product-name">{{ product.name }}</div>
      <div class="product-tags">
        <van-tag type="danger">热卖</van-tag>
        <van-tag type="success">包邮</van-tag>
      </div>
      <div class="product-stats">
        <span>销量: {{ product.sales }}</span>
        <span>库存: {{ product.stock }}</span>
        <span>评分: {{ product.rating }}分</span>
      </div>
    </div>

    <!-- 规格选择 -->
    <div class="spec-box" @click="showSpecPopup = true">
      <span>选择规格</span>
      <van-icon name="arrow" />
    </div>

    <!-- 商品详情 -->
    <div class="detail-box">
      <div class="detail-title">商品详情</div>
      <div class="detail-content">{{ product.description }}</div>
    </div>

    <!-- 底部操作栏 -->
    <div class="action-bar">
      <van-icon name="chat-o" class="action-icon" />
      <van-icon name="cart-o" class="action-icon" @click="goCart" />
      <van-button type="warning" @click="handleAddCart">加入购物车</van-button>
      <van-button type="danger" @click="handleBuyNow">立即购买</van-button>
    </div>

    <!-- 规格选择弹窗 -->
    <van-popup v-model:show="showSpecPopup" position="bottom" round>
      <div class="spec-popup">
        <div class="spec-header">
          <img :src="product.image" class="spec-image" />
          <div class="spec-info">
            <div class="spec-price">¥{{ product.price }}</div>
            <div class="spec-stock">库存: {{ product.stock }}</div>
          </div>
        </div>
        
        <div class="spec-list">
          <div v-for="spec in product.specs" :key="spec.name" class="spec-item">
            <div class="spec-name">{{ spec.name }}</div>
            <div class="spec-values">
              <div
                v-for="value in spec.values"
                :key="value"
                :class="['spec-value', { active: selectedSpecs[spec.name] === value }]"
                @click="selectSpec(spec.name, value)"
              >
                {{ value }}
              </div>
            </div>
          </div>
        </div>

        <div class="spec-quantity">
          <span>数量</span>
          <van-stepper v-model="quantity" min="1" :max="product.stock" />
        </div>

        <van-button type="primary" block round @click="confirmSpec">确定</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getProductDetail } from '@/api/product'
import { useCartStore } from '@/stores/cart'
import { showToast } from 'vant'
import ProductPrice from '@/components/ProductPrice.vue'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

const product = ref({
  images: [],
  specs: []
})
const showSpecPopup = ref(false)
const selectedSpecs = ref({})
const quantity = ref(1)
const actionType = ref('') // 'cart' or 'buy'

const loadProduct = async () => {
  try {
    const id = route.params.id
    const data = await getProductDetail(id)
    product.value = data
  } catch (error) {
    console.error('加载商品详情失败', error)
  }
}

const selectSpec = (name, value) => {
  selectedSpecs.value[name] = value
}

const handleAddCart = () => {
  actionType.value = 'cart'
  showSpecPopup.value = true
}

const handleBuyNow = () => {
  actionType.value = 'buy'
  showSpecPopup.value = true
}

const confirmSpec = async () => {
  const specStr = Object.entries(selectedSpecs.value)
    .map(([key, value]) => `${value}`)
    .join(' ')
  
  if (actionType.value === 'cart') {
    try {
      await cartStore.addToCart({
        productId: product.value.id,
        quantity: quantity.value,
        spec: specStr
      })
      showToast('已加入购物车')
      showSpecPopup.value = false
    } catch (error) {
      console.error('加入购物车失败', error)
    }
  } else {
    // 立即购买，跳转到订单确认页
    router.push({
      path: '/order/create',
      query: {
        productId: product.value.id,
        quantity: quantity.value,
        spec: specStr
      }
    })
  }
}

const goBack = () => {
  router.back()
}

const goCart = () => {
  router.push('/cart')
}

onMounted(() => {
  loadProduct()
})
</script>

<style scoped lang="less">
.product-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 60px;
}

.product-swipe {
  height: 375px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.product-info {
  background: white;
  padding: 15px;
  margin-bottom: 10px;
  
  .price-box {
    margin-bottom: 10px;
    
    :deep(.product-price) {
      .current {
        font-size: 24px;
      }
      
      .original {
        font-size: 14px;
      }
      
      .discount {
        font-size: 12px;
        padding: 3px 8px;
      }
    }
  }
  
  .product-name {
    font-size: 16px;
    color: #333;
    margin-bottom: 10px;
    line-height: 1.5;
  }
  
  .product-tags {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
  }
  
  .product-stats {
    display: flex;
    gap: 20px;
    font-size: 12px;
    color: #999;
  }
}

.spec-box {
  background: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.detail-box {
  background: white;
  padding: 15px;
  
  .detail-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  
  .detail-content {
    font-size: 14px;
    color: #666;
    line-height: 1.8;
  }
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  
  .action-icon {
    font-size: 24px;
    color: #666;
  }
  
  .van-button {
    flex: 1;
  }
}

.spec-popup {
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
  
  .spec-header {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    
    .spec-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
    }
    
    .spec-info {
      flex: 1;
      
      .spec-price {
        font-size: 20px;
        color: #ff4444;
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      .spec-stock {
        font-size: 12px;
        color: #999;
      }
    }
  }
  
  .spec-list {
    margin-bottom: 20px;
    
    .spec-item {
      margin-bottom: 20px;
      
      .spec-name {
        font-size: 14px;
        color: #333;
        margin-bottom: 10px;
      }
      
      .spec-values {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        
        .spec-value {
          padding: 8px 16px;
          background: #f5f5f5;
          border-radius: 4px;
          font-size: 13px;
          color: #666;
          border: 1px solid transparent;
          
          &.active {
            background: #fff;
            color: #ff4444;
            border-color: #ff4444;
          }
        }
      }
    }
  }
  
  .spec-quantity {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    font-size: 14px;
  }
}
</style>
