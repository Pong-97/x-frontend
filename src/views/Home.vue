<template>
  <div class="home-page">
    <!-- 搜索栏 -->
    <van-search
      v-model="searchValue"
      shape="round"
      placeholder="搜索商品"
      @click="goSearch"
      readonly
    />

    <!-- 轮播图 -->
    <van-swipe class="banner-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="banner in homeData.banners" :key="banner.id">
        <img :src="banner.image" @click="goProduct(banner.link)" />
      </van-swipe-item>
    </van-swipe>

    <!-- 分类导航 -->
    <div class="category-nav">
      <div
        class="category-item"
        v-for="category in homeData.categories"
        :key="category.id"
        @click="goCategory(category.id)"
      >
        <div class="icon">{{ category.icon }}</div>
        <div class="name">{{ category.name }}</div>
      </div>
    </div>

    <!-- 热门商品 -->
    <div class="section">
      <div class="section-title">
        <span class="title">热门推荐</span>
        <span class="more" @click="goProductList">更多 ></span>
      </div>
      <div class="product-grid">
        <div
          class="product-item"
          v-for="product in homeData.hotProducts"
          :key="product.id"
          @click="goProductDetail(product.id)"
        >
          <img :src="product.image" class="product-image" />
          <div class="product-name">{{ product.name }}</div>
          <div class="product-price">
            <span class="current">¥{{ product.price }}</span>
            <span class="original">¥{{ product.originalPrice }}</span>
            <span class="discount">{{ calculateDiscount(product.price, product.originalPrice) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 新品推荐 -->
    <div class="section">
      <div class="section-title">
        <span class="title">新品上市</span>
        <span class="more" @click="goProductList">更多 ></span>
      </div>
      <div class="product-grid">
        <div
          class="product-item"
          v-for="product in homeData.newProducts"
          :key="product.id"
          @click="goProductDetail(product.id)"
        >
          <img :src="product.image" class="product-image" />
          <div class="product-name">{{ product.name }}</div>
          <div class="product-price">
            <span class="current">¥{{ product.price }}</span>
            <span class="original">¥{{ product.originalPrice }}</span>
            <span class="discount">{{ calculateDiscount(product.price, product.originalPrice) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getHomeData } from '@/api/home'

const router = useRouter()
const searchValue = ref('')
const homeData = ref({
  banners: [],
  categories: [],
  hotProducts: [],
  newProducts: []
})

const loadHomeData = async () => {
  try {
    const data = await getHomeData()
    homeData.value = data
  } catch (error) {
    console.error('加载首页数据失败', error)
  }
}

const goSearch = () => {
  router.push('/search')
}

const goCategory = (id) => {
  router.push(`/product/list?categoryId=${id}`)
}

const goProduct = (link) => {
  if (link) {
    router.push(link)
  }
}

const goProductList = () => {
  router.push('/product/list')
}

const goProductDetail = (id) => {
  router.push(`/product/${id}`)
}

const calculateDiscount = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= 0 || price >= originalPrice) return ''
  const discount = (price / originalPrice * 10).toFixed(1)
  return `${discount}折`
}

onMounted(() => {
  loadHomeData()
})
</script>

<style scoped lang="less">
.home-page {
  padding-bottom: 60px;
  background: #f5f5f5;
  min-height: 100vh;
}

.banner-swipe {
  height: 200px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.category-nav {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 15px;
  background: white;
  margin-bottom: 10px;
  
  .category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    
    .icon {
      font-size: 32px;
    }
    
    .name {
      font-size: 12px;
      color: #333;
    }
  }
}

.section {
  background: white;
  margin-bottom: 10px;
  padding: 15px;
  
  .section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
    
    .more {
      font-size: 12px;
      color: #999;
    }
  }
  
  .product-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    
    .product-item {
      .product-image {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 8px;
      }
      
      .product-name {
        font-size: 14px;
        color: #333;
        margin-bottom: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      
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
        
        .discount {
          font-size: 11px;
          color: #ff4444;
          background: #fff0f0;
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 4px;
        }
      }
    }
  }
}
</style>
