<template>
  <div class="search-page">
    <van-nav-bar left-arrow @click-left="goBack">
      <template #title>
        <van-search
          v-model="keyword"
          placeholder="搜索商品"
          @search="handleSearch"
          autofocus
        />
      </template>
    </van-nav-bar>

    <!-- 搜索历史 -->
    <div v-if="!keyword && searchHistory.length > 0" class="search-history">
      <div class="history-header">
        <span>搜索历史</span>
        <van-icon name="delete-o" @click="clearHistory" />
      </div>
      <div class="history-list">
        <div
          v-for="(item, index) in searchHistory"
          :key="index"
          class="history-item"
          @click="selectHistory(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div v-if="searched" class="search-result">
      <div v-if="products.length === 0" class="empty">
        <van-empty description="没有找到相关商品" />
      </div>
      <div v-else class="product-list">
        <ProductListItem
          v-for="product in products"
          :key="product.id"
          :product="product"
          :show-description="false"
          @click="goProductDetail"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { searchProduct } from '@/api/product'
import { showConfirmDialog } from 'vant'
import ProductListItem from '@/components/ProductListItem.vue'

const router = useRouter()
const keyword = ref('')
const searched = ref(false)
const products = ref([])
const searchHistory = ref(JSON.parse(localStorage.getItem('searchHistory') || '[]'))

const handleSearch = async () => {
  if (!keyword.value.trim()) return
  
  searched.value = true
  
  try {
    const data = await searchProduct({ keyword: keyword.value })
    products.value = data.list
    
    // 保存搜索历史
    if (!searchHistory.value.includes(keyword.value)) {
      searchHistory.value.unshift(keyword.value)
      if (searchHistory.value.length > 10) {
        searchHistory.value = searchHistory.value.slice(0, 10)
      }
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
    }
  } catch (error) {
    console.error('搜索失败', error)
  }
}

const selectHistory = (item) => {
  keyword.value = item
  handleSearch()
}

const clearHistory = async () => {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确定要清空搜索历史吗？'
    })
    searchHistory.value = []
    localStorage.removeItem('searchHistory')
  } catch (error) {
    // 用户取消
  }
}

const goBack = () => {
  router.back()
}

const goProductDetail = (id) => {
  router.push(`/product/${id}`)
}

</script>

<style scoped lang="less">
.search-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.search-history {
  background: white;
  padding: 15px;
  
  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    font-size: 14px;
    color: #333;
  }
  
  .history-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    
    .history-item {
      padding: 8px 16px;
      background: #f5f5f5;
      border-radius: 20px;
      font-size: 13px;
      color: #666;
    }
  }
}

.search-result {
  .empty {
    padding: 50px 0;
  }
  
  .product-list {
    padding: 10px;
    
    :deep(.product-item) {
      .product-image {
        width: 80px;
        height: 80px;
      }
    }
  }
}
</style>
