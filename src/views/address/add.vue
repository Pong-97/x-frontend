<template>
  <div class="address-add-page">
    <van-nav-bar title="新增地址" left-arrow @click-left="goBack" fixed placeholder />

    <van-form @submit="handleSubmit">
      <van-cell-group inset>
        <van-field
          v-model="formData.name"
          name="name"
          label="收货人"
          placeholder="请输入收货人姓名"
          :rules="[{ required: true, message: '请输入收货人姓名' }]"
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
        <van-field
          v-model="areaText"
          is-link
          readonly
          name="area"
          label="所在地区"
          placeholder="请选择省市区"
          @click="showAreaPicker = true"
          :rules="[{ required: true, message: '请选择所在地区' }]"
        />
        <van-field
          v-model="formData.detail"
          name="detail"
          label="详细地址"
          type="textarea"
          rows="3"
          placeholder="请输入详细地址"
          :rules="[{ required: true, message: '请输入详细地址' }]"
        />
        <van-field name="isDefault">
          <template #input>
            <van-checkbox v-model="formData.isDefault">设为默认地址</van-checkbox>
          </template>
        </van-field>
      </van-cell-group>

      <div class="submit-button">
        <van-button round block type="primary" native-type="submit" :loading="loading">
          保存
        </van-button>
      </div>
    </van-form>

    <!-- 地区选择器 -->
    <van-popup v-model:show="showAreaPicker" position="bottom">
      <van-area
        :area-list="areaList"
        @confirm="onAreaConfirm"
        @cancel="showAreaPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { addAddress } from '@/api/address'
import { showToast } from 'vant'
import { areaList } from '@vant/area-data'

const router = useRouter()

const formData = ref({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false
})

const showAreaPicker = ref(false)
const loading = ref(false)

const areaText = computed(() => {
  if (formData.value.province && formData.value.city && formData.value.district) {
    return `${formData.value.province} ${formData.value.city} ${formData.value.district}`
  }
  return ''
})

const onAreaConfirm = ({ selectedOptions }) => {
  formData.value.province = selectedOptions[0].text
  formData.value.city = selectedOptions[1].text
  formData.value.district = selectedOptions[2].text
  showAreaPicker.value = false
}

const handleSubmit = async () => {
  loading.value = true
  try {
    await addAddress(formData.value)
    showToast('添加成功')
    router.back()
  } catch (error) {
    console.error('添加地址失败', error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}
</script>

<style scoped lang="less">
.address-add-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.submit-button {
  padding: 20px 16px;
}
</style>
