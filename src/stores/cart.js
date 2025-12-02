import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCartList, addToCart as addToCartApi, updateCart as updateCartApi, deleteCart as deleteCartApi } from '@/api/cart'

export const useCartStore = defineStore('cart', () => {
  const cartList = ref([])

  // 获取购物车列表
  const getCart = async () => {
    const res = await getCartList()
    cartList.value = res
    return res
  }

  // 添加到购物车
  const addToCart = async (data) => {
    await addToCartApi(data)
    await getCart()
  }

  // 更新购物车
  const updateCart = async (data) => {
    await updateCartApi(data)
    await getCart()
  }

  // 删除购物车商品
  const deleteCart = async (id) => {
    await deleteCartApi(id)
    await getCart()
  }

  // 购物车商品数量
  const cartCount = computed(() => {
    return cartList.value.reduce((total, item) => total + item.quantity, 0)
  })

  // 选中的商品
  const checkedCart = computed(() => {
    return cartList.value.filter(item => item.checked)
  })

  // 选中商品总价
  const checkedTotal = computed(() => {
    return checkedCart.value.reduce((total, item) => {
      return total + item.product.price * item.quantity
    }, 0)
  })

  return {
    cartList,
    cartCount,
    checkedCart,
    checkedTotal,
    getCart,
    addToCart,
    updateCart,
    deleteCart
  }
})
