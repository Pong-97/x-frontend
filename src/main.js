import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 引入Vant
import Vant from 'vant'
import 'vant/lib/index.css'

// 引入Mock数据 - 已禁用，使用后端API
// import './mock'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Vant)

app.mount('#app')
