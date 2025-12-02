<template>
  <div class="address-page">
    <van-nav-bar title="地址管理" left-arrow @click-left="goBack" fixed placeholder />

    <div class="address-list">
      <div v-for="address in addressList" :key="address.id" class="address-item">
        <div class="address-content" @click="selectAddress(address)">
          <div class="address-header">
            <span class="name">{{ address.name }}</span>
            <span class="phone">{{ address.phone }}</span>
            <van-tag v-if="address.isDefault" type="danger" size="small">默认</van-tag>
          </div>
          <div class="address-detail">
            {{ address.province }} {{ address.city }} {{ address.district }} {{ address.detail }}
          </div>
        </div>
        <div class="address-actions">
          <van-button
            size="small"
            @click="setDefault(address.id)"
            v-if="!address.isDefault"
          >
            设为默认
          </van-button>
          <van-button size="small" @click="editAddress(address.id)">编辑</van-button>
          <van-button size="small" type="danger" @click="deleteAddress(address.id)">
            删除
          </van-button>
        </div>
      </div>
    </div>

    <van-empty v-if="addressList.length === 0" description="暂无地址" />

    <div class="add-button">
      <van-button type="primary" block round @click="addAddress">
        新增地址
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  getAddressList,
  deleteAddress as deleteAddressApi,
  setDefaultAddress
} from '@/api/address'
import { showConfirmDialog, showToast } from 'vant'

const router = useRouter()
const addressList = ref([])

const loadAddressList = async () => {
  try {
    const data = await getAddressList()
    addressList.value = data
  } catch (error) {
    console.error('加载地址列表失败', error)
  }
}

const selectAddress = (address) => {
  // 如果是从订单页面跳转过来的，选择地址后返回
  if (router.options.history.state.back?.includes('order')) {
    router.back()
  }
}

const setDefault = async (id) => {
  try {
    await setDefaultAddress(id)
    showToast('设置成功')
    await loadAddressList()
  } catch (error) {
    console.error('设置默认地址失败', error)
  }
}

const editAddress = (id) => {
  router.push(`/address/edit/${id}`)
}

const deleteAddress = async (id) => {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确定要删除该地址吗？'
    })
    await deleteAddressApi(id)
    showToast('删除成功')
    await loadAddressList()
  } catch (error) {
    // 用户取消或失败
  }
}

const addAddress = () => {
  router.push('/address/add')
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadAddressList()
})
</script>

<style scoped lang="less">
.address-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

.address-list {
  padding: 10px;
  
  .address-item {
    background: white;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;
    
    .address-content {
      margin-bottom: 12px;
      
      .address-header {
        display: flex;
        gap: 15px;
        align-items: center;
        margin-bottom: 8px;
        font-size: 14px;
        
        .name {
          font-weight: bold;
        }
      }
      
      .address-detail {
        font-size: 13px;
        color: #666;
        line-height: 1.5;
      }
    }
    
    .address-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
  }
}

.add-button {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}
</style>
