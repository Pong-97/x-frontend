<template>
  <div class="user-info-page">
    <van-nav-bar title="个人信息" left-arrow @click-left="goBack" fixed placeholder />

    <van-cell-group>
      <van-cell title="头像" is-link>
        <template #value>
          <img :src="userStore.userInfo?.avatar" class="avatar" />
        </template>
      </van-cell>
      <van-cell title="昵称" is-link :value="userStore.userInfo?.nickname" />
      <van-cell title="用户名" :value="userStore.userInfo?.username" />
      <van-cell title="手机号" :value="userStore.userInfo?.phone" />
      <van-cell title="邮箱" :value="userStore.userInfo?.email" />
    </van-cell-group>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const goBack = () => {
  router.back()
}
</script>

<style scoped lang="less">
.user-info-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
</style>
