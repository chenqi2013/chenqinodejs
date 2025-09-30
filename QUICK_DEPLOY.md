# ⚡ 快速部署指南

## 🎯 选择您的部署方式

### 🇨🇳 国内用户推荐

#### Zeabur（中国团队）- 3 分钟 ⭐⭐⭐⭐⭐

**优势**：国内访问快、不需要备案、支持中文

```bash
# 安装 CLI
npm install -g @zeabur/cli

# 登录
zeabur auth login

# 部署
zeabur
```

**完整教程**：[DEPLOY_TO_CHINA.md](DEPLOY_TO_CHINA.md)

---

### 🌍 国际平台

#### 方式 1：Railway（推荐）- 3 分钟 ⭐⭐⭐⭐⭐

**优势**：不休眠、稳定、快速

```bash
# 安装 CLI
npm install -g @railway/cli

# 登录
railway login

# 初始化项目
railway init

# 添加 PostgreSQL
railway add

# 部署
railway up

# 获取域名
railway domain
```

**完整教程**：[DEPLOY_TO_RAILWAY.md](DEPLOY_TO_RAILWAY.md)

---

### 方式 2：Render - 5 分钟 ⭐⭐⭐⭐

**优势**：完全免费、简单易用

**步骤**：
1. 访问 [render.com](https://render.com)
2. 连接 GitHub 仓库
3. 选择 `chenqinodejs`
4. 添加 PostgreSQL 数据库
5. 点击部署

**完整教程**：[DEPLOY_TO_RENDER.md](DEPLOY_TO_RENDER.md)

---

### 方式 3：自有服务器

**适合**：有 VPS/云服务器

```bash
# 使用 Docker Compose
docker-compose up -d

# 或使用 PM2
pnpm install
pnpm run build
pm2 start ecosystem.config.js
```

**完整教程**：[DEPLOYMENT.md](DEPLOYMENT.md)

---

## 📊 快速对比

| 平台 | 免费 | 休眠 | 速度 | 难度 | 备案 |
|------|------|------|------|------|------|
| Zeabur 🇨🇳 | $5/月 | ❌ | ⚡⚡⚡ | 简单 | ❌ |
| Railway | $5/月 | ❌ | ⚡⚡⚡ | 简单 | ❌ |
| Render | ✅ | ✅ 15分钟 | ⚡⚡ | 简单 | ❌ |
| 阿里云FC 🇨🇳 | 100万次 | ❌ | ⚡⚡⚡ | 中等 | ✅ |

**国内平台详细对比**：[DEPLOY_TO_CHINA.md](DEPLOY_TO_CHINA.md)  
**国外平台详细对比**：[FREE_HOSTING_COMPARISON.md](FREE_HOSTING_COMPARISON.md)

---

## 🔥 部署后测试

### 替换为您的域名

```bash
# Railway
export API_URL="https://your-app.up.railway.app"

# Render
export API_URL="https://your-app.onrender.com"
```

### 测试接口

```bash
# 1. 测试基础接口
curl $API_URL/

# 2. 测试角色接口
curl $API_URL/api/v1/role

# 3. 测试用户接口
curl -X POST $API_URL/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"TEST001","nickname":"测试用户"}'

# 4. 测试版本检查
curl "$API_URL/api/v1/version/check?currentVersion=1.0.0&platform=android"

# 5. 测试扫码功能
curl -X POST $API_URL/api/v1/scan/qrcode \
  -H "Content-Type: application/json" \
  -d '{"scannerDeviceId":"USER1","scannedDeviceId":"USER2"}'
```

---

## 🎨 前端集成示例

### JavaScript/TypeScript

```typescript
const API_URL = 'https://your-app.up.railway.app';

// 检查版本更新
async function checkUpdate() {
  const response = await fetch(
    `${API_URL}/api/v1/version/check?currentVersion=1.0.0&platform=android`
  );
  const result = await response.json();
  
  if (result.data.hasUpdate) {
    console.log('发现新版本:', result.data.latestVersion);
    if (result.data.forceUpdate) {
      alert('发现新版本，必须更新！');
    }
  }
}

// 扫描二维码
async function scanQRCode(scannerDevice, scannedDevice) {
  const response = await fetch(`${API_URL}/api/v1/scan/qrcode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      scannerDeviceId: scannerDevice,
      scannedDeviceId: scannedDevice
    })
  });
  
  const result = await response.json();
  console.log(result.message);
}
```

### React/Vue

```typescript
// 创建 API 配置文件
// src/config/api.ts
export const API_BASE_URL = 
  process.env.NODE_ENV === 'production'
    ? 'https://your-app.up.railway.app'
    : 'http://localhost:3000';

// 使用 axios
import axios from 'axios';
import { API_BASE_URL } from './config/api';

const api = axios.create({
  baseURL: API_BASE_URL + '/api/v1',
  timeout: 10000
});

// 检查版本
export const checkVersion = (currentVersion: string, platform: string) => {
  return api.get('/version/check', {
    params: { currentVersion, platform }
  });
};

// 扫码
export const scanQRCode = (scannerDeviceId: string, scannedDeviceId: string) => {
  return api.post('/scan/qrcode', {
    scannerDeviceId,
    scannedDeviceId
  });
};
```

### 小程序

```javascript
// 微信小程序
const API_URL = 'https://your-app.up.railway.app';

// 检查版本
wx.request({
  url: `${API_URL}/api/v1/version/check`,
  data: {
    currentVersion: '1.0.0',
    platform: 'android'
  },
  success: (res) => {
    if (res.data.data.hasUpdate) {
      wx.showModal({
        title: '发现新版本',
        content: res.data.data.updateContent,
        confirmText: '立即更新'
      });
    }
  }
});
```

---

## 🛠️ 环境变量配置

### 必需的环境变量

```env
NODE_ENV=production
PORT=3000

# 数据库配置
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_DATABASE=chenqinodejs_db
```

### Railway 配置

```bash
# 自动注入数据库变量
railway variables
```

### Render 配置

在 Render Dashboard 的 **Environment Variables** 中添加。

---

## 🔒 安全建议

### 1. 添加 CORS 配置

```typescript
// src/main.ts
app.enableCors({
  origin: ['https://your-frontend.com'],
  credentials: true
});
```

### 2. 添加速率限制

```bash
pnpm add @nestjs/throttler
```

```typescript
// app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
})
```

### 3. 添加请求验证

```bash
pnpm add class-validator class-transformer
```

### 4. 使用环境变量存储敏感信息

❌ 不要在代码中硬编码密钥  
✅ 使用环境变量管理

---

## 📈 监控和日志

### Railway 日志

```bash
# 实时查看日志
railway logs --follow

# 查看最近的日志
railway logs
```

### Render 日志

在 Dashboard 的 **Logs** 标签查看。

### 添加日志服务（可选）

- **LogRocket**：前端错误追踪
- **Sentry**：错误监控
- **Datadog**：全面监控

---

## 🆘 常见问题

### Q1: 部署后无法访问？

**检查**：
```bash
# 查看日志
railway logs
# 或 Render Dashboard

# 检查环境变量
railway variables

# 测试数据库连接
railway run node test-db.js
```

### Q2: 数据库连接失败？

**解决**：
1. 确认环境变量正确
2. 检查数据库是否在同一区域
3. 查看数据库日志

### Q3: API 响应很慢？

**原因**：
- Render 免费套餐自动休眠
- 首次唤醒需要时间

**解决**：
- 使用定时任务保持唤醒
- 或使用 Railway（不休眠）

### Q4: 超出免费额度怎么办？

**选择**：
1. 优化代码减少资源使用
2. 设置应用休眠时间
3. 升级到付费套餐
4. 迁移到其他平台

---

## 📚 相关文档

- **DEPLOY_TO_RAILWAY.md** - Railway 详细教程
- **DEPLOY_TO_RENDER.md** - Render 详细教程
- **FREE_HOSTING_COMPARISON.md** - 平台对比
- **DEPLOYMENT.md** - 自有服务器部署
- **VERSION_API_DOCUMENTATION.md** - 版本API文档
- **SCAN_API_DOCUMENTATION.md** - 扫码API文档

---

## 🎉 部署成功！

恭喜！您的 API 已经部署成功！

**下一步**：
1. ✅ 测试所有接口
2. ✅ 配置自定义域名（可选）
3. ✅ 设置监控告警
4. ✅ 开始开发前端应用

**需要帮助？**
- 查看详细文档
- 访问平台官方文档
- 提交 GitHub Issue

---

**享受您的免费后端 API！** 🚀
