<template>
  <div class="login-page">
    <van-nav-bar title="登录" left-arrow @click-left="goBack" />

    <div class="login-content">
      <div class="logo">
        <div class="logo-text">电商平台</div>
      </div>

      <van-form @submit="handleLogin">
        <van-cell-group inset>
          <van-field
            v-model="formData.username"
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请输入用户名' }]"
          />
          <van-field
            v-model="formData.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请输入密码' }]"
          />
        </van-cell-group>

        <div class="button-group">
          <van-button round block type="primary" native-type="submit" :loading="loading">
            登录
          </van-button>
          <van-button round block plain type="primary" @click="goRegister">
            注册账号
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formData = ref({
  username: '',
  password: ''
})
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    await userStore.login(formData.value)
    showToast('登录成功')
    
    // 跳转到之前的页面或首页
    const redirect = route.query.redirect || '/home'
    router.replace(redirect)
  } catch (error) {
    console.error('登录失败', error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

const goRegister = () => {
  router.push('/register')
}
</script>

<style scoped lang="less">
.login-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.login-content {
  padding: 40px 20px;
  
  .logo {
    text-align: center;
    margin-bottom: 50px;
    
    .logo-text {
      font-size: 32px;
      font-weight: bold;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  
  .button-group {
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style>
