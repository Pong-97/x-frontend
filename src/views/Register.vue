<template>
  <div class="register-page">
    <van-nav-bar title="注册" left-arrow @click-left="goBack" />

    <div class="register-content">
      <van-form @submit="handleRegister">
        <van-cell-group inset>
          <van-field
            v-model="formData.username"
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            :rules="[
              { required: true, message: '请输入用户名' },
              { pattern: /^[a-zA-Z0-9_]{4,16}$/, message: '用户名为4-16位字母数字下划线' }
            ]"
          />
          <van-field
            v-model="formData.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[
              { required: true, message: '请输入密码' },
              { pattern: /^.{6,20}$/, message: '密码长度为6-20位' }
            ]"
          />
          <van-field
            v-model="formData.confirmPassword"
            type="password"
            name="confirmPassword"
            label="确认密码"
            placeholder="请再次输入密码"
            :rules="[
              { required: true, message: '请再次输入密码' },
              { validator: validatePassword, message: '两次密码不一致' }
            ]"
          />
          <van-field
            v-model="formData.phone"
            name="phone"
            label="手机号"
            placeholder="请输入手机号"
            :rules="[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
            ]"
          />
        </van-cell-group>

        <div class="button-group">
          <van-button round block type="primary" native-type="submit" :loading="loading">
            注册
          </van-button>
          <div class="login-link">
            已有账号？<span @click="goLogin">立即登录</span>
          </div>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api/user'
import { showToast } from 'vant'

const router = useRouter()

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  phone: ''
})
const loading = ref(false)

const validatePassword = () => {
  return formData.value.password === formData.value.confirmPassword
}

const handleRegister = async () => {
  loading.value = true
  try {
    await register(formData.value)
    showToast('注册成功')
    router.replace('/login')
  } catch (error) {
    console.error('注册失败', error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

const goLogin = () => {
  router.replace('/login')
}
</script>

<style scoped lang="less">
.register-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.register-content {
  padding: 20px;
  
  .button-group {
    padding: 20px 16px;
    
    .login-link {
      text-align: center;
      margin-top: 15px;
      font-size: 14px;
      color: #666;
      
      span {
        color: #1989fa;
      }
    }
  }
}
</style>
