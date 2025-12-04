# 费曼学习法：Vue Router（页面路由）

## 📚 第一步：用简单的话解释概念

### 什么是路由？

想象你在一个大型商场里：
- **商场入口** = 你的网站首页
- **不同的店铺** = 不同的页面（首页、分类、购物车、我的）
- **指示牌** = 路由配置
- **你的位置** = 当前 URL

**路由就是：根据不同的 URL 地址，显示不同的页面内容，但不需要刷新整个网页！**

传统网站：点击链接 → 整个页面刷新 → 加载新页面（慢！）
Vue Router：点击链接 → 只替换页面内容 → 不刷新（快！）

---

## 🔍 第二步：结合你的项目代码理解

### 1. 路由的三个核心部分

#### 📦 Part 1: 安装和创建路由器

```javascript
// src/router/index.js (第1-2行)
import { createRouter, createWebHistory } from 'vue-router'
```

**解释：**
- `createRouter`：创建路由器的工厂函数（就像买一个导航仪）
- `createWebHistory`：使用 HTML5 History 模式（URL 看起来像：`/home`，而不是 `/#/home`）

```javascript
// src/router/index.js (第107-110行)
const router = createRouter({
  history: createWebHistory(),
  routes
})
```

**解释：**
- 创建了一个路由器实例
- `history`：选择路由模式
- `routes`：路由配置列表（下面会详细讲）

---

#### 📋 Part 2: 配置路由表（routes）

这是最重要的部分！让我们逐个分析：

**示例 1：基础路由**
```javascript
// src/router/index.js (第10-14行)
{
  path: '/home',           // URL 路径
  name: 'Home',            // 路由名称（可选，但推荐）
  component: () => import('@/views/home/index.vue'),  // 对应的组件
  meta: { title: '首页', showTabbar: true }  // 元信息
}
```

**逐行解释：**
- `path: '/home'`：当用户访问 `http://你的网站.com/home` 时触发
- `name: 'Home'`：给这个路由起个名字，方便编程式导航
- `component: () => import(...)`：**懒加载**组件（用到时才加载，提高性能）
- `meta`：自定义数据
  - `title: '首页'`：页面标题
  - `showTabbar: true`：是否显示底部导航栏

---

**示例 2：重定向**
```javascript
// src/router/index.js (第5-8行)
{
  path: '/',
  redirect: '/home'
}
```

**解释：**
当用户访问根路径 `/` 时，自动跳转到 `/home`
就像商场入口自动把你带到一楼大厅

---

**示例 3：动态路由（带参数）**
```javascript
// src/router/index.js (第40-44行)
{
  path: '/product/:id',    // :id 是动态参数
  name: 'ProductDetail',
  component: () => import('@/views/product/detail.vue'),
  meta: { title: '商品详情' }
}
```

**解释：**
- `/product/:id`：`:id` 是占位符，可以匹配任何值
- 访问 `/product/123` → `id = 123`
- 访问 `/product/456` → `id = 456`

**在组件中获取参数：**
```javascript
import { useRoute } from 'vue-router'

const route = useRoute()
console.log(route.params.id)  // 输出：123 或 456
```

---

**示例 4：需要登录的路由**
```javascript
// src/router/index.js (第22-26行)
{
  path: '/cart',
  name: 'Cart',
  component: () => import('@/views/cart/index.vue'),
  meta: { title: '购物车', showTabbar: true, requireAuth: true }
}
```

**解释：**
- `requireAuth: true`：标记这个页面需要登录才能访问
- 配合路由守卫使用（下面会讲）

---

#### 🛡️ Part 3: 路由守卫（导航守卫）

```javascript
// src/router/index.js (第112-130行)
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || '电商平台'
  
  // 检查是否需要登录
  if (to.meta.requireAuth) {
    const userStore = useUserStore()
    if (!userStore.isLogin()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }
  
  next()
})
```

**解释：**
- `beforeEach`：**全局前置守卫**，每次路由跳转前都会执行
- `to`：即将要进入的目标路由
- `from`：当前导航正要离开的路由
- `next()`：**必须调用**，否则路由不会跳转

**流程图：**
```
用户点击"购物车" 
  ↓
触发 beforeEach
  ↓
检查 to.meta.requireAuth（是 true）
  ↓
检查用户是否登录？
  ├─ 是 → next() → 进入购物车页面
  └─ 否 → next('/login') → 跳转到登录页
```

**实际场景：**
1. 用户未登录，点击"购物车"
2. 守卫检测到需要登录
3. 自动跳转到登录页，并记录原本要去的地址（`redirect: /cart`）
4. 登录成功后，跳回购物车页面

---

### 2. 在应用中使用路由

#### 🔌 注册路由器

```javascript
// src/main.js (第4、17行)
import router from './router'
app.use(router)
```

**解释：**
把路由器安装到 Vue 应用中，这样整个应用都能使用路由功能

---

#### 📺 显示路由内容

```vue
<!-- src/App.vue (第3行) -->
<router-view />
```

**解释：**
- `<router-view />`：路由出口，匹配到的组件会渲染在这里
- 就像电视机的屏幕，不同频道（路由）显示不同内容（组件）

**示例：**
- 访问 `/home` → `<router-view />` 显示 `home/index.vue`
- 访问 `/cart` → `<router-view />` 显示 `cart/index.vue`

---

#### 🔗 路由导航

**方式 1：声明式导航（模板中）**
```vue
<!-- src/App.vue (第7-12行) -->
<van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
<van-tabbar-item to="/category" icon="apps-o">分类</van-tabbar-item>
<van-tabbar-item to="/cart" icon="shopping-cart-o">购物车</van-tabbar-item>
```

**解释：**
- `to="/home"`：点击后跳转到 `/home`
- 类似于 `<a href="/home">`，但不会刷新页面

---

**方式 2：编程式导航（JavaScript 中）**
```javascript
import { useRouter } from 'vue-router'

const router = useRouter()

// 跳转到指定路径
router.push('/home')

// 跳转到命名路由
router.push({ name: 'ProductDetail', params: { id: 123 } })

// 带查询参数
router.push({ path: '/search', query: { keyword: '手机' } })

// 后退
router.back()

// 前进
router.forward()

// 替换当前路由（不会留下历史记录）
router.replace('/login')
```

---

#### 🎯 获取路由信息

```javascript
// src/App.vue (第19、22、25-27行)
import { useRoute } from 'vue-router'

const route = useRoute()

const showTabbar = computed(() => {
  return route.meta.showTabbar
})
```

**解释：**
- `useRoute()`：获取当前路由信息
- `route.meta.showTabbar`：读取路由的元信息
- 根据当前路由决定是否显示底部导航栏

**可用属性：**
```javascript
route.path        // 当前路径：'/home'
route.params      // 动态参数：{ id: '123' }
route.query       // 查询参数：{ keyword: '手机' }
route.name        // 路由名称：'Home'
route.meta        // 元信息：{ title: '首页', showTabbar: true }
route.fullPath    // 完整路径：'/search?keyword=手机'
```

---

## 🧪 第三步：动手实验

### 实验 1：添加一个新页面

**任务：** 添加一个"关于我们"页面

1. **创建组件**（假设已有 `src/views/about/index.vue`）

2. **添加路由配置：**
```javascript
// 在 src/router/index.js 的 routes 数组中添加
{
  path: '/about',
  name: 'About',
  component: () => import('@/views/about/index.vue'),
  meta: { title: '关于我们' }
}
```

3. **添加导航链接：**
```vue
<!-- 在某个组件中 -->
<button @click="$router.push('/about')">关于我们</button>
```

---

### 实验 2：理解动态路由

**场景：** 点击不同商品，进入不同详情页

```javascript
// 商品列表页
const goToDetail = (productId) => {
  router.push(`/product/${productId}`)
  // 或者
  router.push({ name: 'ProductDetail', params: { id: productId } })
}
```

```javascript
// 商品详情页
import { useRoute } from 'vue-router'

const route = useRoute()
const productId = route.params.id  // 获取商品 ID

// 根据 ID 加载商品数据
fetchProductDetail(productId)
```

---

### 实验 3：测试路由守卫

1. **未登录状态：**
   - 点击"购物车"
   - 观察：自动跳转到登录页
   - URL 变成：`/login?redirect=/cart`

2. **登录后：**
   - 从 `redirect` 参数获取原本要去的地址
   - 跳转回购物车

```javascript
// 登录成功后
const redirect = route.query.redirect || '/home'
router.push(redirect)
```

---

## 🎓 第四步：教给别人（费曼精髓）

现在，试着用自己的话向一个完全不懂编程的朋友解释：

**"Vue Router 就像一个智能导航系统：**

1. **路由表（routes）** = 地图，告诉系统每个地址对应什么页面
2. **router-view** = 显示屏，显示当前位置的内容
3. **路由导航** = 导航按钮，点击后切换位置
4. **路由守卫** = 安检，某些地方需要权限才能进入
5. **动态路由** = 可变地址，比如每个商品有自己的详情页

**最大优势：** 切换页面不刷新，速度快，体验好！"

---

## 📊 核心概念总结表

| 概念 | 作用 | 你的项目示例 |
|------|------|-------------|
| **路由配置** | 定义 URL 和组件的映射 | `{ path: '/home', component: ... }` |
| **动态路由** | URL 中包含可变参数 | `/product/:id` |
| **路由元信息** | 存储路由相关的自定义数据 | `meta: { requireAuth: true }` |
| **路由守卫** | 控制路由跳转的权限和逻辑 | `beforeEach` 检查登录状态 |
| **懒加载** | 按需加载组件，提高性能 | `() => import('@/views/...')` |
| **router-view** | 渲染匹配到的组件 | `<router-view />` |
| **编程式导航** | 用 JS 控制路由跳转 | `router.push('/home')` |
| **声明式导航** | 用模板控制路由跳转 | `<van-tabbar-item to="/home">` |

---

## 🚀 进阶知识

### 1. 路由模式对比

| 模式 | URL 格式 | 优点 | 缺点 |
|------|---------|------|------|
| **Hash** | `/#/home` | 兼容性好，无需服务器配置 | URL 不美观 |
| **History** | `/home` | URL 美观 | 需要服务器配置（你的项目用的这个） |

### 2. 路由守卫类型

- **全局守卫：** `beforeEach`、`afterEach`（你的项目用了）
- **路由独享守卫：** 在路由配置中定义
- **组件内守卫：** `beforeRouteEnter`、`beforeRouteUpdate`、`beforeRouteLeave`

### 3. 命名视图

一个页面显示多个 `<router-view>`：
```vue
<router-view name="header" />
<router-view />  <!-- 默认 -->
<router-view name="footer" />
```

---

## ✅ 检验理解的问题

1. **为什么要用懒加载？**
   - 答：首次加载更快，只加载当前需要的页面

2. **`route` 和 `router` 的区别？**
   - `route`：当前路由信息（只读）
   - `router`：路由器实例（可以跳转）

3. **如果不调用 `next()` 会怎样？**
   - 答：路由会卡住，不会跳转

4. **动态路由 `/product/:id` 和 `/product/123` 的区别？**
   - 前者是配置（模板），后者是实际访问的 URL

---

## 🎯 实践建议

1. **打开浏览器开发者工具**
   - 切换页面时观察 URL 变化
   - 看看页面是否真的没有刷新

2. **修改路由配置**
   - 改变 `meta.title`，看页面标题是否变化
   - 添加新路由，测试是否生效

3. **调试路由守卫**
   - 在 `beforeEach` 中添加 `console.log(to, from)`
   - 观察每次跳转的路由信息

4. **阅读官方文档**
   - [Vue Router 官方文档](https://router.vuejs.org/zh/)

---

## 💡 记忆口诀

**"路由三步走，导航不用愁"**

1. **配置路由表** - 定义地图
2. **注册路由器** - 安装导航
3. **使用 router-view** - 显示内容

**"守卫三参数，跳转要记住"**
- `to` - 要去哪
- `from` - 从哪来
- `next` - 放行走

---

希望这份学习笔记能帮助你深入理解 Vue Router！
记住费曼学习法的核心：**如果你不能简单地解释它，说明你还没真正理解它。**

现在，试着向你的橡皮鸭🦆解释一遍吧！😊
