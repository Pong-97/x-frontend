# API 配置说明

## 当前配置

前端项目已配置为对接后端服务器。

### 后端服务器地址
- **后端地址**: `https://lyaftwgtwyqr.sealosbja.site`
- **端口**: 3000
- **内网地址**: `http://x-backend.ns-rpjorlu:3000` (仅供参考)

## 配置文件

### 1. 环境变量配置
- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置

### 2. Axios 配置
文件位置: `/src/utils/axios.js`

配置内容:
```javascript
baseURL: import.meta.env.VITE_API_BASE_URL || 'https://lyaftwgtwyqr.sealosbja.site'
```

## 修改内容

### ✅ 已完成的修改

1. **axios 配置** (`/src/utils/axios.js`)
   - 修改 `baseURL` 为后端服务器地址
   - 使用环境变量配置，支持灵活切换

2. **Mock 数据** (`/src/main.js`)
   - 已注释掉 Mock 数据引入
   - 所有 API 请求将直接发送到后端服务器

3. **环境变量文件**
   - 创建 `.env.development` 开发环境配置
   - 创建 `.env.production` 生产环境配置

## 如何切换环境

### 方法 1: 修改环境变量文件
编辑 `.env.development` 或 `.env.production` 文件中的 `VITE_API_BASE_URL` 值。

### 方法 2: 直接修改 axios 配置
编辑 `/src/utils/axios.js` 文件中的 `baseURL` 值。

## 注意事项

1. **跨域问题**: 后端服务器需要配置 CORS 允许前端域名访问
2. **Token 认证**: 已配置 Bearer Token 认证，token 存储在 localStorage
3. **错误处理**: 已配置统一的错误处理和 Toast 提示
4. **超时设置**: 请求超时时间设置为 10 秒

## 启动项目

```bash
# 开发环境
npm run dev

# 生产构建
npm run build
```

## 测试 API 连接

启动项目后，可以通过以下方式测试 API 连接：
1. 打开浏览器开发者工具 Network 面板
2. 访问任意需要调用 API 的页面
3. 查看请求是否成功发送到后端服务器

## 恢复 Mock 数据（如需要）

如果需要恢复使用 Mock 数据进行本地开发：

1. 取消注释 `/src/main.js` 中的 Mock 引入：
   ```javascript
   import './mock'
   ```

2. 修改 axios baseURL 为本地代理：
   ```javascript
   baseURL: '/api'
   ```

3. 在 `vite.config.js` 中添加代理配置：
   ```javascript
   server: {
     proxy: {
       '/api': {
         target: 'http://localhost:3000',
         changeOrigin: true,
         rewrite: (path) => path.replace(/^\/api/, '')
       }
     }
   }
   ```
