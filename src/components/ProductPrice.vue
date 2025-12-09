<template>
  <div class="product-price">
    <span class="current">¥{{ price }}</span>
    <span class="original">¥{{ originalPrice }}</span>
    <span class="discount" v-if="discountText">{{ discountText }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  price: {
    type: Number,
    default: 0
  },
  originalPrice: {
    type: Number,
    default: 0
  }
})

const discountText = computed(() => {
  if (!props.originalPrice || props.originalPrice <= 0 || props.price >= props.originalPrice) {
    return ''
  }
  const discount = (props.price / props.originalPrice * 10).toFixed(1)
  return `${discount}折`
})
</script>

<style scoped lang="less">
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
</style>
