<template>
  <div class="product-list-page">
    <van-nav-bar title="商品列表" left-arrow @click-left="goBack" fixed placeholder />

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div
        v-for="item in filters"
        :key="item.value"
        :class="['filter-item', { active: currentFilter === item.value }]"
        @click="changeFilter(item.value)"
      >
        {{ item.label }}
      </div>
    </div>

    <!-- 商品列表 -->
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div class="product-list">
        <div
          v-for="product in products"
          :key="product.id"
          class="product-item"
          @click="goProductDetail(product.id)"
        >
          <img :src="product.image" class="product-image" />
          <div class="product-info">
            <div class="product-name">{{ product.name }}</div>
            <div class="product-desc">{{ product.description }}</div>
            <div class="product-bottom">
              <div class="product-price">
                <span class="current">¥{{ product.price }}</span>
                <span class="original">¥{{ product.originalPrice }}</span>
              </div>
              <div class="product-sales">已售{{ product.sales }}</div>
            </div>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getProductList } from '@/api/product'

const router = useRouter()
const route = useRoute()

const filters = [
  { label: '综合', value: 'default' },
  { label: '销量', value: 'sales' },
  { label: '价格', value: 'price' },
  { label: '新品', value: 'new' }
]

const currentFilter = ref('default')
const products = ref([])
const loading = ref(false)
const finished = ref(false)
const page = ref(1)
const pageSize = 10

const loadProducts = async () => {
  try {
    const params = {
      page: page.value,
      pageSize,
      categoryId: route.query.categoryId
    }
    
    const data = await getProductList(params)
    
    if (page.value === 1) {
      products.value = data.list
    } else {
      products.value.push(...data.list)
    }
    
    loading.value = false
    
    if (products.value.length >= data.total) {
      finished.value = true
    }
  } catch (error) {
    console.error('加载商品列表失败', error)
    loading.value = false
  }
}

const onLoad = () => {
  page.value++
  loadProducts()
}

const changeFilter = (value) => {
  currentFilter.value = value
  page.value = 1
  finished.value = false
  products.value = []
  loadProducts()
}

const goBack = () => {
  router.back()
}

const goProductDetail = (id) => {
  router.push(`/product/${id}`)
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped lang="less">
.product-list-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.filter-bar {
  display: flex;
  background: white;
  padding: 12px 0;
  position: sticky;
  top: 46px;
  z-index: 10;
  
  .filter-item {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #666;
    
    &.active {
      color: #ff4444;
      font-weight: bold;
    }
  }
}

.product-list {
  padding: 10px;
  
  .product-item {
    display: flex;
    gap: 12px;
    background: white;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 10px;
    
    .product-image {
      width: 100px;
      height: 100px;
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
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      
      .product-desc {
        font-size: 12px;
        color: #999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .product-bottom {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        
        .product-price {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .current {
            font-size: 16px;
            color: #ff4444;
            font-weight: bold;
          }
          
          .original {
            font-size: 12px;
            color: #999;
            text-decoration: line-through;
          }
        }
        
        .product-sales {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}
</style>
