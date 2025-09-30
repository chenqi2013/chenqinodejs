# 🚄 部署到 Railway.app

## 为什么选择 Railway？

- ✅ 每月 $5 免费额度
- ✅ 不会自动休眠（比 Render 更好）
- ✅ 自动提供免费域名：`yourapp.up.railway.app`
- ✅ 支持 PostgreSQL
- ✅ 部署速度快
- ✅ 从 GitHub 自动部署

## 快速部署（推荐）

### 方法 1：一键部署

1. 访问 [railway.app](https://railway.app)
2. 点击 **"Start a New Project"**
3. 选择 **"Deploy from GitHub repo"**
4. 选择您的 `chenqinodejs` 仓库
5. Railway 会自动：
   - 检测为 Node.js 项目
   - 安装依赖
   - 构建项目
   - 部署服务

### 方法 2：使用 Railway CLI

```bash
# 1. 安装 Railway CLI
npm install -g @railway/cli

# 2. 登录
railway login

# 3. 在项目目录中初始化
cd /Users/chenqi/chenqinodejs
railway init

# 4. 部署
railway up

# 5. 打开浏览器查看
railway open
```

## 详细部署步骤

### 步骤 1：注册并登录

1. 访问 [https://railway.app](https://railway.app)
2. 点击 **"Login"** 或 **"Start a New Project"**
3. 使用 GitHub 账号登录

### 步骤 2：创建新项目

1. 在 Dashboard，点击 **"New Project"**
2. 选择 **"Deploy from GitHub repo"**
3. 选择 `chenqinodejs` 仓库
4. Railway 会自动开始部署

### 步骤 3：添加 PostgreSQL 数据库

1. 在项目页面，点击 **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway 会自动：
   - 创建 PostgreSQL 数据库
   - 注入环境变量到您的应用

### 步骤 4：配置环境变量

1. 点击您的服务
2. 进入 **"Variables"** 标签
3. 添加以下变量：

```env
NODE_ENV=production
PORT=3000

# Railway 会自动注入数据库变量：
# DATABASE_URL
# PGHOST
# PGPORT
# PGUSER
# PGPASSWORD
# PGDATABASE

# 但我们需要手动映射：
DB_HOST=${{PGHOST}}
DB_PORT=${{PGPORT}}
DB_USERNAME=${{PGUSER}}
DB_PASSWORD=${{PGPASSWORD}}
DB_DATABASE=${{PGDATABASE}}
```

**或者使用 Railway 的引用语法**：

点击 **"New Variable"**，然后点击 **"Add Reference"**：
- `DB_HOST` → 选择 PostgreSQL → `PGHOST`
- `DB_PORT` → 选择 PostgreSQL → `PGPORT`
- `DB_USERNAME` → 选择 PostgreSQL → `PGUSER`
- `DB_PASSWORD` → 选择 PostgreSQL → `PGPASSWORD`
- `DB_DATABASE` → 选择 PostgreSQL → `PGDATABASE`

### 步骤 5：配置构建设置

1. 进入 **"Settings"** 标签
2. 在 **"Build"** 部分：
   - **Build Command**: `pnpm install && pnpm run build`
   - **Start Command**: `pnpm run start:prod`
3. 点击 **"Deploy"** 保存并重新部署

### 步骤 6：生成公共域名

1. 进入 **"Settings"** 标签
2. 滚动到 **"Domains"** 部分
3. 点击 **"Generate Domain"**
4. 会生成类似：`chenqinodejs-production.up.railway.app`

## 部署完成！

您的 API 地址：

```
https://chenqinodejs-production.up.railway.app
```

### 测试 API

```bash
# 替换为您的实际域名
export RAILWAY_URL="https://chenqinodejs-production.up.railway.app"

# 测试基础接口
curl $RAILWAY_URL/

# 测试角色接口
curl $RAILWAY_URL/api/v1/role

# 测试版本检查
curl "$RAILWAY_URL/api/v1/version/check?currentVersion=1.0.0&platform=android"
```

## 自动部署

每次推送到 GitHub，Railway 会自动重新部署：

```bash
git add .
git commit -m "Update API"
git push origin main
# Railway 自动检测并部署
```

## Railway CLI 常用命令

```bash
# 查看日志
railway logs

# 连接到数据库
railway connect postgres

# 运行命令
railway run npm test

# 查看环境变量
railway variables

# 部署当前代码
railway up

# 查看项目信息
railway status

# 打开项目面板
railway open
```

## 数据库管理

### 通过 Railway CLI 连接

```bash
# 连接到 PostgreSQL
railway connect postgres

# 进入 psql 后可以执行 SQL
\dt  # 查看所有表
SELECT * FROM users LIMIT 5;
```

### 使用 TablePlus 连接

1. 在 Railway 项目中，点击 PostgreSQL 服务
2. 进入 **"Connect"** 标签
3. 复制连接信息或使用 **"Connection URL"**
4. 在 TablePlus 中粘贴连接 URL，或手动填写：
   - Host, Port, User, Password, Database

### 获取数据库连接 URL

```bash
# 使用 CLI
railway variables | grep DATABASE_URL

# 或在 Web Dashboard 查看
```

## 监控和日志

### 实时日志

```bash
# 使用 CLI 查看实时日志
railway logs --follow

# 或在 Web Dashboard 的 "Deployments" 标签查看
```

### 使用指标

Railway 免费套餐提供：
- CPU 使用率
- 内存使用率
- 网络流量
- 请求统计

## 自定义域名

1. 进入 **"Settings"** → **"Domains"**
2. 点击 **"Custom Domain"**
3. 输入您的域名（如 `api.yourdomain.com`）
4. 在域名服务商添加 CNAME 记录：
   ```
   CNAME  api  your-project.up.railway.app
   ```

## Railway 免费额度

- **$5/月** 的免费使用额度
- **100 GB** 出站流量
- **512 MB** RAM
- **1 GB** 磁盘空间
- **无限制**的构建时间

### 估算使用时间

假设您的应用：
- 使用 ~100 MB RAM
- 24/7 运行

那么 $5 可以支持约 **500 小时/月**（约 20 天）

如果只在工作时间使用（8小时/天），可以运行整月！

## 成本优化

### 1. 降低资源使用

```typescript
// 在 main.ts 中
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'production' 
      ? ['error', 'warn'] 
      : ['log', 'error', 'warn', 'debug'],
  });
  
  // ... 其他配置
}
```

### 2. 设置休眠策略

Railway 不会自动休眠，但您可以：

```bash
# 在不需要时手动停止服务
railway down

# 需要时重新启动
railway up
```

### 3. 监控使用情况

在 Railway Dashboard 的 **"Usage"** 标签查看：
- 当前月份使用量
- 剩余额度
- 详细的资源使用情况

## 升级到付费套餐

如果免费额度不够：

- **Hobby Plan**: $5/月基础 + 按使用付费
  - 无需信用卡即可使用 $5 免费额度
  - 超出后按使用量计费

- **Pro Plan**: $20/月起
  - 团队协作
  - 优先支持
  - 更多资源

## 与 Render 对比

| 特性 | Railway | Render Free |
|------|---------|-------------|
| 免费额度 | $5/月 | 750小时 |
| 自动休眠 | ❌ 否 | ✅ 15分钟后 |
| 数据库 | PostgreSQL | PostgreSQL (90天) |
| 部署速度 | 快 | 中等 |
| 域名 | .up.railway.app | .onrender.com |
| CLI工具 | ✅ 优秀 | ✅ 有 |

**建议**：
- 如果需要 24/7 稳定运行 → Railway
- 如果访问量小、可接受休眠 → Render

## 故障排除

### 问题 1：部署失败

```bash
# 查看详细日志
railway logs

# 检查构建日志
# 在 Web Dashboard 的 "Deployments" 查看
```

### 问题 2：数据库连接失败

```bash
# 检查环境变量
railway variables

# 确保数据库服务正在运行
# 在 Web Dashboard 查看 PostgreSQL 状态
```

### 问题 3：超出免费额度

```bash
# 查看使用情况
railway usage

# 考虑：
# 1. 优化代码减少资源使用
# 2. 设置休眠时间
# 3. 升级到付费套餐
```

## 高级配置

### railway.json 配置文件

在项目根目录创建 `railway.json`：

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm install && pnpm run build"
  },
  "deploy": {
    "startCommand": "pnpm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### nixpacks.toml 配置

```toml
[phases.setup]
nixPkgs = ["nodejs-18_x", "pnpm"]

[phases.install]
cmds = ["pnpm install"]

[phases.build]
cmds = ["pnpm run build"]

[start]
cmd = "pnpm run start:prod"
```

## 总结

Railway 是一个优秀的免费部署平台，特别适合：

✅ 需要 24/7 运行的应用  
✅ 不想处理休眠问题  
✅ 喜欢使用 CLI 工具  
✅ 需要快速部署  

**您的免费域名**：
```
https://your-project-name.up.railway.app
```

立即开始，只需 5 分钟！🚄

## 相关资源

- Railway 官方文档：https://docs.railway.app
- Railway Discord：https://discord.gg/railway
- Railway 模板市场：https://railway.app/templates
