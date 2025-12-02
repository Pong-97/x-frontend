# 电商平台前端项目

基于 Vue 3 + Vite + Pinia + Vue Router + Vant UI 开发的移动端电商应用。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **Pinia** - Vue 状态管理库
- **Vue Router** - Vue 官方路由管理器
- **Vant UI** - 轻量、可靠的移动端组件库
- **Axios** - HTTP 客户端
- **Mock.js** - 模拟数据生成器
- **Less** - CSS 预处理器

## 功能模块

### 1. 用户模块
- ✅ 用户登录/注册
- ✅ 个人信息查看
- ✅ 退出登录

### 2. 商品模块
- ✅ 首页展示（轮播图、分类导航、推荐商品）
- ✅ 商品分类浏览
- ✅ 商品列表（支持分页、筛选）
- ✅ 商品详情（图片轮播、规格选择、加入购物车）
- ✅ 商品搜索（搜索历史）

### 3. 购物车模块
- ✅ 购物车列表
- ✅ 商品数量修改
- ✅ 商品删除
- ✅ 全选/反选
- ✅ 结算

### 4. 订单模块
- ✅ 创建订单
- ✅ 订单列表（支持状态筛选）
- ✅ 订单详情
- ✅ 取消订单
- ✅ 确认收货

### 5. 地址管理
- ✅ 地址列表
- ✅ 新增地址
- ✅ 编辑地址
- ✅ 删除地址
- ✅ 设置默认地址

## 项目结构

```
x-frontend/
├── public/              # 静态资源
├── src/
│   ├── api/            # API 接口
│   │   ├── user.js
│   │   ├── product.js
│   │   ├── cart.js
│   │   ├── order.js
│   │   └── address.js
│   ├── assets/         # 资源文件
│   ├── components/     # 公共组件
│   ├── mock/           # Mock 数据
│   │   └── index.js
│   ├── router/         # 路由配置
│   │   └── index.js
│   ├── stores/         # 状态管理
│   │   ├── user.js
│   │   └── cart.js
│   ├── utils/          # 工具函数
│   │   └── axios.js
│   ├── views/          # 页面组件（按模块组织）
│   │   ├── home/
│   │   │   └── index.vue
│   │   ├── category/
│   │   │   └── index.vue
│   │   ├── cart/
│   │   │   └── index.vue
│   │   ├── product/
│   │   │   ├── list.vue
│   │   │   ├── detail.vue
│   │   │   └── search.vue
│   │   ├── order/
│   │   │   ├── create.vue
│   │   │   ├── list.vue
│   │   │   └── detail.vue
│   │   ├── address/
│   │   │   ├── index.vue
│   │   │   ├── add.vue
│   │   │   └── edit.vue
│   │   └── user/
│   │       ├── login.vue
│   │       ├── register.vue
│   │       ├── member.vue
│   │       └── info.vue
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
└── vite.config.js
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

项目将在 `http://localhost:3000` 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## Mock 数据说明

项目使用 Mock.js 模拟后端接口，所有数据都是随机生成的。Mock 数据包括：

- 用户登录/注册
- 首页数据（轮播图、分类、推荐商品）
- 商品列表和详情
- 购物车数据
- 订单数据
- 地址数据

## 路由说明

- `/home` - 首页
- `/category` - 分类页
- `/cart` - 购物车
- `/member` - 个人中心
- `/login` - 登录
- `/register` - 注册
- `/product/list` - 商品列表
- `/product/:id` - 商品详情
- `/search` - 搜索
- `/order/create` - 创建订单
- `/order/list` - 订单列表
- `/order/:id` - 订单详情
- `/address` - 地址管理
- `/address/add` - 新增地址
- `/address/edit/:id` - 编辑地址
- `/user/info` - 个人信息

## 注意事项

1. 项目使用 Mock 数据，无需后端支持即可运行
2. 登录功能：输入任意用户名和密码即可登录成功
3. 所有数据都是模拟数据，刷新页面后会重置
4. 项目主要面向移动端，建议使用浏览器的移动设备模拟器查看

## 开发建议

- 使用 Chrome DevTools 的移动设备模拟器进行调试
- 推荐使用 iPhone 12 Pro 或类似尺寸的设备预览
- 可以通过修改 `src/mock/index.js` 来自定义 Mock 数据

## License

MIT
