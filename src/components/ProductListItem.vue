<template>
  <div class="product-item" @click="handleClick">
    <img :src="product.image" class="product-image" />
    <div class="product-info">
      <div class="product-name">{{ product.name }}</div>
      <div v-if="showDescription" class="product-desc">{{ product.description }}</div>
      <div v-if="showSales" class="product-bottom">
        <ProductPrice :price="product.price" :original-price="product.originalPrice" />
        <div class="product-sales">已售{{ product.sales }}</div>
      </div>
      <ProductPrice v-else :price="product.price" :original-price="product.originalPrice" />
    </div>
  </div>
</template>

<script setup>
import ProductPrice from './ProductPrice.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  showDescription: {
    type: Boolean,
    default: true
  },
  showSales: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click', props.product.id)
}
</script>

<style scoped lang="less">
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
    min-width: 0;
    overflow: hidden;
    
    .product-name {
      font-size: 14px;
      color: #333;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      word-break: break-all;
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
      
      .product-sales {
        font-size: 12px;
        color: #999;
      }
    }
  }
}
</style>
