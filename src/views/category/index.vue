<template>
  <div class="category-page">
    <div class="category-container">
      <!-- 左侧分类 -->
      <div class="category-left">
        <div
          v-for="category in categories"
          :key="category.id"
          :class="['category-item', { active: activeCategory === category.id }]"
          @click="selectCategory(category)"
        >
          <span class="icon">{{ category.icon }}</span>
          <span class="name">{{ category.name }}</span>
        </div>
      </div>

      <!-- 右侧子分类和商品 -->
      <div class="category-right">
        <div class="sub-categories">
          <div
            v-for="sub in currentCategory?.children"
            :key="sub.id"
            class="sub-item"
            @click="goProductList(sub.id)"
          >
            {{ sub.name }}
          </div>
        </div>

        <div class="product-list">
          <ProductListItem
            v-for="product in products"
            :key="product.id"
            :product="product"
            @click="goProductDetail"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getCategoryList } from '@/api/category'
import { getProductList } from '@/api/product'
import ProductListItem from '@/components/ProductListItem.vue'

const router = useRouter()
const categories = ref([])
const activeCategory = ref(null)
const products = ref([])

const currentCategory = computed(() => {
  return categories.value.find(c => c.id === activeCategory.value)
})

const loadCategories = async () => {
  try {
    const data = await getCategoryList()
    categories.value = data
    if (data.length > 0) {
      selectCategory(data[0])
    }
  } catch (error) {
    console.error('加载分类失败', error)
  }
}

const selectCategory = async (category) => {
  activeCategory.value = category.id
  await loadProducts(category.id)
}

const loadProducts = async (categoryId) => {
  try {
    const data = await getProductList({ categoryId, page: 1, pageSize: 20 })
    products.value = data.list
  } catch (error) {
    console.error('加载商品失败', error)
  }
}

const goProductList = (categoryId) => {
  router.push(`/product/list?categoryId=${categoryId}`)
}

const goProductDetail = (id) => {
  router.push(`/product/${id}`)
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped lang="less">
.category-page {
  height: 100vh;
  background: #f5f5f5;
  padding-bottom: 50px;
  box-sizing: border-box;
}

.category-container {
  display: flex;
  height: 100%;
}

.category-left {
  width: 90px;
  background: #f5f5f5;
  overflow-y: auto;
  flex-shrink: 0;
  
  .category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80px;
    background: white;
    margin-bottom: 1px;
    
    .icon {
      font-size: 24px;
      margin-bottom: 5px;
    }
    
    .name {
      font-size: 12px;
      color: #666;
    }
    
    &.active {
      background: #f5f5f5;
      
      .name {
        color: #ff4444;
        font-weight: bold;
      }
    }
  }
}

.category-right {
  flex: 1;
  background: white;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 15px;
  min-width: 0;
  
  .sub-categories {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
    
    .sub-item {
      padding: 8px 16px;
      background: #f5f5f5;
      border-radius: 20px;
      font-size: 13px;
      color: #666;
      white-space: nowrap;
    }
  }
  
  .product-list {
    :deep(.product-item) {
      padding: 12px 0;
      border-bottom: 1px solid #f5f5f5;
      border-radius: 0;
      margin-bottom: 0;
    }
  }
}
</style>
