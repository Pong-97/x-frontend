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
        <ProductListItem
          v-for="product in products"
          :key="product.id"
          :product="product"
          show-sales
          @click="goProductDetail"
        />
      </div>
    </van-list>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getProductList } from '@/api/product'
import ProductListItem from '@/components/ProductListItem.vue'

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
}
</style>
