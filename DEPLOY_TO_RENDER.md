# 🚀 部署到 Render.com 免费平台

## 为什么选择 Render？

- ✅ 完全免费（有免费套餐）
- ✅ 自动提供免费域名：`yourapp.onrender.com`
- ✅ 支持免费 PostgreSQL 数据库
- ✅ 自动 HTTPS 证书
- ✅ 从 GitHub 自动部署
- ✅ 简单易用，零配置

## 准备工作

### 1. 注册 Render 账号

访问 [https://render.com](https://render.com) 注册账号（可以用 GitHub 账号登录）

### 2. 将代码推送到 GitHub

```bash
# 初始化 git（如果还没有）
git init
git add .
git commit -m "Initial commit"

# 创建 GitHub 仓库并推送
# 在 GitHub 上创建一个新仓库，然后：
git remote add origin https://github.com/yourusername/chenqinodejs.git
git branch -M main
git push -u origin main
```

## 部署步骤

### 步骤 1：创建 PostgreSQL 数据库

1. 登录 Render Dashboard
2. 点击 **"New +"** → 选择 **"PostgreSQL"**
3. 填写信息：
   - **Name**: `chenqinodejs-db`
   - **Database**: `chenqinodejs_db`
   - **User**: `chenqi`（自动生成）
   - **Region**: 选择最近的区域（Singapore）
   - **PostgreSQL Version**: 15
   - **Plan**: **Free**（免费）
4. 点击 **"Create Database"**
5. 等待数据库创建完成（约1-2分钟）
6. 记下数据库连接信息（稍后会用到）

### 步骤 2：创建 Web Service

1. 在 Render Dashboard，点击 **"New +"** → 选择 **"Web Service"**
2. 连接 GitHub 仓库：
   - 选择 **"Connect a repository"**
   - 授权 Render 访问您的 GitHub
   - 选择 `chenqinodejs` 仓库
3. 填写服务信息：
   - **Name**: `chenqinodejs-api`
   - **Region**: 选择与数据库相同的区域
   - **Branch**: `main`
   - **Root Directory**: 留空
   - **Runtime**: **Node**
   - **Build Command**: `pnpm install && pnpm run build`
   - **Start Command**: `pnpm run start:prod`
   - **Plan**: **Free**（免费）

### 步骤 3：配置环境变量

在 **"Environment Variables"** 部分，点击 **"Add Environment Variable"**，添加以下变量：

```
NODE_ENV=production
PORT=3000
```

### 步骤 4：连接数据库

1. 滚动到 **"Environment Variables"** 部分
2. 点击 **"Add from Database"**
3. 选择刚才创建的 `chenqinodejs-db`
4. 会自动添加 `DATABASE_URL` 环境变量

### 步骤 5：手动添加数据库环境变量

由于我们的代码使用单独的数据库配置，需要手动添加：

点击 **"Add Secret File"**，创建 `.env` 文件：

```env
NODE_ENV=production
PORT=3000

# 从 Render 数据库页面复制以下信息
DB_HOST=your-database-host.render.com
DB_PORT=5432
DB_USERNAME=chenqi
DB_PASSWORD=your-database-password
DB_DATABASE=chenqinodejs_db
```

**重要**：从数据库页面获取实际的连接信息：
1. 进入您创建的数据库页面
2. 找到 **"Connections"** 部分
3. 复制 **External Database URL** 或各个参数

### 步骤 6：部署

1. 点击 **"Create Web Service"**
2. Render 会自动：
   - 克隆您的 GitHub 仓库
   - 安装依赖
   - 构建项目
   - 启动服务
3. 等待部署完成（首次约 5-10 分钟）

## 部署完成！

部署成功后，您的 API 将在以下地址可用：

```
https://chenqinodejs-api.onrender.com
```

### 测试 API

```bash
# 测试基础接口
curl https://chenqinodejs-api.onrender.com/

# 测试角色接口
curl https://chenqinodejs-api.onrender.com/api/v1/role

# 测试版本检查接口
curl "https://chenqinodejs-api.onrender.com/api/v1/version/check?currentVersion=1.0.0&platform=android"
```

## 自动部署

配置完成后，每次推送到 GitHub 的 `main` 分支，Render 都会自动重新部署！

```bash
git add .
git commit -m "Update API"
git push origin main
# Render 会自动检测并重新部署
```

## 自定义域名（可选）

如果您有自己的域名，可以在 Render 中配置：

1. 进入您的 Web Service 页面
2. 点击 **"Settings"** → **"Custom Domains"**
3. 点击 **"Add Custom Domain"**
4. 输入您的域名（如 `api.yourdomain.com`）
5. 按照指示在域名服务商处添加 CNAME 记录

## 重要注意事项

### ⚠️ 免费套餐限制

1. **自动休眠**：
   - 15分钟无请求后会自动休眠
   - 下次请求时需要 30-60 秒唤醒
   - 解决方案：使用定时任务每10分钟访问一次

2. **数据库有效期**：
   - 免费 PostgreSQL 在 90 天后会过期
   - 需要重新创建数据库并迁移数据
   - 或升级到付费套餐（$7/月）

3. **带宽限制**：
   - 每月 100GB 免费带宽
   - 对于小型项目足够使用

### 🔧 保持服务唤醒

创建一个定时任务来保持服务活跃（可选）：

**方法1：使用 Cron-job.org**

1. 注册 [https://cron-job.org](https://cron-job.org)
2. 创建新任务：
   - URL: `https://chenqinodejs-api.onrender.com/`
   - 间隔：每 10 分钟

**方法2：使用 UptimeRobot**

1. 注册 [https://uptimerobot.com](https://uptimerobot.com)
2. 添加监控：
   - Monitor Type: HTTP(s)
   - URL: `https://chenqinodejs-api.onrender.com/`
   - Monitoring Interval: 5 分钟

## 数据库管理

### 连接到 Render PostgreSQL

使用 TablePlus 或其他工具连接：

1. 从 Render 数据库页面获取连接信息
2. 在 TablePlus 中创建新连接：
   - Host: 从 Render 复制
   - Port: 5432
   - User: 从 Render 复制
   - Password: 从 Render 复制
   - Database: chenqinodejs_db
   - SSL: Enabled

### 初始化数据

部署后首次需要初始化数据：

```bash
# 连接到数据库后，应用会自动初始化角色数据
# 如需手动初始化版本数据：
curl -X POST https://chenqinodejs-api.onrender.com/api/v1/version \
  -H "Content-Type: application/json" \
  -d '{
    "version": "1.0.0",
    "platform": "android",
    "updateContent": "首次发布",
    "downloadUrl": "https://example.com/app.apk",
    "forceUpdate": false
  }'
```

## 监控和日志

### 查看日志

1. 进入 Web Service 页面
2. 点击 **"Logs"** 标签
3. 实时查看应用日志

### 查看指标

1. 点击 **"Metrics"** 标签
2. 查看 CPU、内存、请求数等指标

## 故障排除

### 问题 1：部署失败

**检查**：
- 查看 Build Logs 中的错误信息
- 确保 `package.json` 中的脚本正确
- 确保所有依赖都在 `package.json` 中

### 问题 2：数据库连接失败

**检查**：
- 环境变量是否正确配置
- 数据库是否在同一区域
- 数据库是否正常运行

### 问题 3：首次请求很慢

**原因**：免费套餐会自动休眠

**解决**：
- 使用上面提到的保持唤醒方案
- 或升级到付费套餐

## 升级到付费套餐

如果需要更稳定的服务，可以升级：

- **Starter Plan**: $7/月
  - 无休眠
  - 512MB RAM
  - 更多带宽

- **Standard Plan**: $25/月
  - 更多资源
  - 更好性能

## 其他免费替代方案

如果 Render 不满足需求，可以考虑：

### Railway.app

```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 初始化项目
railway init

# 部署
railway up
```

### Fly.io

```bash
# 安装 Fly CLI
curl -L https://fly.io/install.sh | sh

# 登录
fly auth login

# 初始化
fly launch

# 部署
fly deploy
```

## 总结

使用 Render.com 免费部署的优势：

✅ 完全免费（有限制但够用）  
✅ 自动提供域名  
✅ 自动 HTTPS  
✅ 简单易用  
✅ GitHub 自动部署  
✅ 免费数据库  

**您的免费域名将是**：
```
https://chenqinodejs-api.onrender.com
```

立即开始部署，只需 10 分钟！🚀
