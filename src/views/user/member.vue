<template>
  <div class="member-page">
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <div v-if="userStore.isLogin()" class="user-info">
        <img :src="userStore.userInfo?.avatar" class="avatar" />
        <div class="info">
          <div class="nickname">{{ userStore.userInfo?.nickname }}</div>
          <div class="username">{{ userStore.userInfo?.username }}</div>
        </div>
        <van-icon name="arrow" class="arrow" @click="goUserInfo" />
      </div>
      <div v-else class="login-prompt" @click="goLogin">
        <img src="https://via.placeholder.com/60" class="avatar" />
        <div class="text">点击登录</div>
      </div>
    </div>

    <!-- 订单 -->
    <div class="section">
      <div class="section-title">
        <span>我的订单</span>
        <span class="more" @click="goOrderList()">查看全部 ></span>
      </div>
      <div class="order-nav">
        <div class="order-item" @click="goOrderList(0)">
          <van-icon name="pending-payment" size="24" />
          <span>待付款</span>
        </div>
        <div class="order-item" @click="goOrderList(1)">
          <van-icon name="tosend" size="24" />
          <span>待发货</span>
        </div>
        <div class="order-item" @click="goOrderList(2)">
          <van-icon name="logistics" size="24" />
          <span>待收货</span>
        </div>
        <div class="order-item" @click="goOrderList(3)">
          <van-icon name="comment-o" size="24" />
          <span>待评价</span>
        </div>
        <div class="order-item" @click="goOrderList(4)">
          <van-icon name="after-sale" size="24" />
          <span>售后</span>
        </div>
      </div>
    </div>

    <!-- 功能列表 -->
    <div class="section">
      <van-cell-group>
        <van-cell title="收货地址" is-link @click="goAddress" icon="location-o" />
        <van-cell title="优惠券" is-link icon="coupon-o" />
        <van-cell title="我的收藏" is-link icon="star-o" />
        <van-cell title="浏览历史" is-link icon="clock-o" />
      </van-cell-group>
    </div>

    <!-- 设置 -->
    <div class="section">
      <van-cell-group>
        <van-cell title="设置" is-link icon="setting-o" />
        <van-cell title="客服" is-link icon="service-o" />
        <van-cell title="关于" is-link icon="info-o" />
      </van-cell-group>
    </div>

    <!-- 退出登录 -->
    <div v-if="userStore.isLogin()" class="logout-section">
      <van-button type="danger" block round @click="handleLogout">退出登录</van-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showConfirmDialog, showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()

const goLogin = () => {
  router.push('/login')
}

const goUserInfo = () => {
  router.push('/user/info')
}

const goOrderList = (status) => {
  if (!userStore.isLogin()) {
    goLogin()
    return
  }
  router.push({
    path: '/order/list',
    query: status !== undefined ? { status } : {}
  })
}

const goAddress = () => {
  if (!userStore.isLogin()) {
    goLogin()
    return
  }
  router.push('/address')
}

const handleLogout = async () => {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确定要退出登录吗？'
    })
    userStore.logout()
    showToast('已退出登录')
  } catch (error) {
    // 用户取消
  }
}
</script>

<style scoped lang="less">
.member-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 60px;
}

.user-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px 20px;
  color: white;
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 15px;
    
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 2px solid white;
    }
    
    .info {
      flex: 1;
      
      .nickname {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      .username {
        font-size: 14px;
        opacity: 0.8;
      }
    }
    
    .arrow {
      font-size: 20px;
    }
  }
  
  .login-prompt {
    display: flex;
    align-items: center;
    gap: 15px;
    
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 2px solid white;
    }
    
    .text {
      font-size: 16px;
    }
  }
}

.section {
  margin-top: 10px;
  background: white;
  
  .section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    font-size: 16px;
    font-weight: bold;
    
    .more {
      font-size: 12px;
      color: #999;
      font-weight: normal;
    }
  }
  
  .order-nav {
    display: flex;
    justify-content: space-around;
    padding: 15px;
    
    .order-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #666;
    }
  }
}

.logout-section {
  padding: 20px;
  margin-top: 20px;
}
</style>
