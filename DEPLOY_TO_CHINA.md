# 🇨🇳 中国免费部署平台推荐

## 国内免费平台对比

| 平台 | 免费额度 | 数据库 | 域名 | 备案 | 速度 | 推荐度 |
|------|---------|--------|------|------|------|--------|
| 阿里云函数计算 | 100万次调用/月 | ✅ | 需自备 | 需要 | ⚡⚡⚡ | ⭐⭐⭐⭐ |
| 腾讯云云函数 | 40万GB秒/月 | ✅ | 需自备 | 需要 | ⚡⚡⚡ | ⭐⭐⭐⭐ |
| 华为云函数 | 100万次调用/月 | ✅ | 需自备 | 需要 | ⚡⚡⚡ | ⭐⭐⭐ |
| Zeabur | $5/月 | ✅ | 自动 | 不需要 | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ |
| 4EVERLAND | 有限 | ❌ | 自动 | 不需要 | ⚡⚡ | ⭐⭐⭐ |
| Sealos | 有限 | ✅ | 自动 | 不需要 | ⚡⚡⚡ | ⭐⭐⭐⭐ |

---

## 1. Zeabur ⭐⭐⭐⭐⭐ 最推荐

**官网**: [https://zeabur.com](https://zeabur.com)

### 为什么推荐 Zeabur？

- ✅ **中国团队开发**，支持中文
- ✅ **不需要备案**
- ✅ **$5/月免费额度**
- ✅ **自动提供域名**（可用中国香港节点）
- ✅ **支持 PostgreSQL**
- ✅ **GitHub 自动部署**
- ✅ **国内访问速度快**
- ✅ **使用体验类似 Railway**

### 免费额度

- **$5/月** 免费额度
- **100GB** 流量
- **512MB** 内存
- **PostgreSQL** 数据库
- **自动 HTTPS**

### 快速部署

#### 方法 1：Web 部署（推荐）

1. 访问 [https://zeabur.com](https://zeabur.com)
2. 使用 GitHub 账号登录
3. 点击 **"新建项目"**
4. 选择 **"从 GitHub 导入"**
5. 选择您的 `chenqinodejs` 仓库
6. 添加 **PostgreSQL** 服务
7. 等待部署完成

#### 方法 2：CLI 部署

```bash
# 1. 安装 Zeabur CLI
npm install -g @zeabur/cli

# 2. 登录
zeabur auth login

# 3. 部署
zeabur

# 按照提示选择：
# - 创建新项目或选择已有项目
# - 添加 PostgreSQL 数据库
# - 确认部署
```

### 环境变量配置

Zeabur 会自动注入数据库环境变量，但我们需要映射：

在 Zeabur Dashboard 中添加环境变量：

```env
NODE_ENV=production
PORT=3000

# Zeabur 会自动提供 DATABASE_URL
# 我们需要映射到我们的变量名
DB_HOST=${PGHOST}
DB_PORT=${PGPORT}
DB_USERNAME=${PGUSER}
DB_PASSWORD=${PGPASSWORD}
DB_DATABASE=${PGDATABASE}
```

### 域名配置

1. 自动域名：`your-app.zeabur.app`
2. 自定义域名：
   - 在项目设置中添加域名
   - 添加 CNAME 记录到 DNS
   - **无需备案**（使用香港节点）

### 优势

- 🚀 部署速度快
- 🇨🇳 国内访问速度好
- 💰 免费额度够用
- 🎯 使用简单
- 📱 支持移动端管理

---

## 2. 阿里云函数计算（FC）⭐⭐⭐⭐

**官网**: [https://www.aliyun.com/product/fc](https://www.aliyun.com/product/fc)

### 优势

- ✅ 阿里云生态完善
- ✅ 免费额度大（100万次调用/月）
- ✅ 国内访问速度快
- ✅ 可集成阿里云数据库

### 缺点

- ❌ 需要**实名认证和备案**
- ❌ 需要将 NestJS 改造为 Serverless
- ❌ 配置相对复杂
- ❌ 需要自己准备域名

### 免费额度

- **100万次** 调用/月
- **40万GB秒** 资源使用量
- **10GB** 外网出流量

### 部署步骤

1. 注册阿里云账号并实名认证
2. 开通函数计算服务
3. 安装 Serverless Devs 工具
4. 配置 `s.yaml` 文件
5. 部署应用

### 注意事项

⚠️ **需要改造代码**：NestJS 需要适配 Serverless 模式，建议使用 `@nestjs/platform-express` 的 Serverless 适配器。

---

## 3. 腾讯云云函数（SCF）⭐⭐⭐⭐

**官网**: [https://cloud.tencent.com/product/scf](https://cloud.tencent.com/product/scf)

### 优势

- ✅ 腾讯云生态
- ✅ 免费额度（40万GB秒/月）
- ✅ 支持多种触发器
- ✅ 国内访问快

### 缺点

- ❌ 需要**实名认证**
- ❌ 域名需要**备案**
- ❌ 需要改造为 Serverless
- ❌ 配置较复杂

### 免费额度

- **40万GB秒** 资源使用量/月
- **100万次** 调用/月
- **10GB** 外网出流量

### 部署方式

1. 注册腾讯云账号
2. 开通云函数服务
3. 使用腾讯云 Serverless Framework
4. 配置并部署

---

## 4. 华为云函数工作流（FunctionGraph）⭐⭐⭐

**官网**: [https://www.huaweicloud.com/product/functiongraph.html](https://www.huaweicloud.com/product/functiongraph.html)

### 优势

- ✅ 华为云生态
- ✅ 免费额度（100万次调用/月）
- ✅ 支持容器部署

### 缺点

- ❌ 需要实名认证
- ❌ 域名需要备案
- ❌ 知名度相对较低

---

## 5. Sealos ⭐⭐⭐⭐

**官网**: [https://sealos.io](https://sealos.io)

### 优势

- ✅ 开源云操作系统
- ✅ 基于 Kubernetes
- ✅ 有免费额度
- ✅ 支持一键部署
- ✅ **不需要备案**

### 免费额度

- 新用户赠送额度
- 支持按量付费

### 快速部署

1. 访问 [https://cloud.sealos.io](https://cloud.sealos.io)
2. 注册并登录
3. 创建应用
4. 从 GitHub 导入
5. 添加数据库
6. 部署

---

## 6. 4EVERLAND ⭐⭐⭐

**官网**: [https://4everland.org](https://4everland.org)

### 优势

- ✅ Web3 去中心化平台
- ✅ 有免费额度
- ✅ 支持 IPFS
- ✅ **不需要备案**

### 缺点

- ❌ 主要面向前端
- ❌ 后端支持有限
- ❌ 不太适合 NestJS

---

## 推荐方案

### 🥇 首选：Zeabur

**原因**：
- ✅ 不需要备案
- ✅ 使用简单
- ✅ 国内访问快
- ✅ 支持完整的 NestJS
- ✅ 免费额度够用

**部署命令**：
```bash
npm install -g @zeabur/cli
zeabur auth login
zeabur
```

**域名**: `https://your-app.zeabur.app`

---

### 🥈 次选：继续使用国外平台 + CDN

如果不想备案，可以：

1. 使用 **Railway** 或 **Render** 部署
2. 使用 **Cloudflare CDN** 加速国内访问
3. 效果也不错

#### Cloudflare 配置

1. 将域名托管到 Cloudflare
2. 添加 CNAME 记录指向 Railway/Render
3. 开启 CDN 和优化功能
4. 国内访问速度会有明显提升

---

### 🥉 备选：阿里云/腾讯云（如果有备案）

如果您有备案的域名：

1. **阿里云函数计算**
   - 免费额度最大
   - 生态完善
   - 需要改造代码

2. **腾讯云云函数**
   - 腾讯云生态
   - 配置相对简单
   - 需要改造代码

---

## Zeabur 详细部署教程

### 准备工作

1. 注册 Zeabur 账号（使用 GitHub 登录）
2. 将代码推送到 GitHub
3. 准备开始部署

### 步骤 1：创建项目

1. 登录 [Zeabur Dashboard](https://dash.zeabur.com)
2. 点击 **"创建项目"**
3. 输入项目名称：`chenqinodejs`

### 步骤 2：添加服务

1. 点击 **"添加服务"**
2. 选择 **"Git"**
3. 选择您的 `chenqinodejs` 仓库
4. Zeabur 会自动检测为 Node.js 项目

### 步骤 3：添加数据库

1. 在项目中点击 **"添加服务"**
2. 选择 **"Marketplace"**
3. 选择 **"PostgreSQL"**
4. 点击部署

### 步骤 4：配置环境变量

Zeabur 会自动连接数据库，但需要映射变量：

1. 点击您的应用服务
2. 进入 **"环境变量"** 标签
3. 添加变量：

```env
NODE_ENV=production
PORT=3000

# 引用 PostgreSQL 的环境变量
DB_HOST=${POSTGRES_HOST}
DB_PORT=${POSTGRES_PORT}
DB_USERNAME=${POSTGRES_USERNAME}
DB_PASSWORD=${POSTGRES_PASSWORD}
DB_DATABASE=${POSTGRES_DATABASE}
```

### 步骤 5：配置构建

Zeabur 会自动检测，但可以自定义：

1. **构建命令**: `pnpm install && pnpm run build`
2. **启动命令**: `pnpm run start:prod`
3. **端口**: `3000`

### 步骤 6：部署

点击 **"重新部署"**，等待完成（约 2-3 分钟）。

### 步骤 7：获取域名

1. 在服务页面，点击 **"网络"**
2. 系统会自动生成域名：`your-app.zeabur.app`
3. 也可以绑定自定义域名

---

## 测试部署

```bash
# 替换为您的域名
export API_URL="https://your-app.zeabur.app"

# 测试基础接口
curl $API_URL/

# 测试角色接口
curl $API_URL/api/v1/role

# 测试版本检查
curl "$API_URL/api/v1/version/check?currentVersion=1.0.0&platform=android"
```

---

## 成本对比（人民币）

| 平台 | 免费额度 | 超出后 | 备案 |
|------|---------|--------|------|
| Zeabur | $5/月(~35元) | 按量付费 | ❌ |
| 阿里云FC | 100万次 | ¥0.133/万次 | ✅ |
| 腾讯云SCF | 40万GB秒 | ¥0.00011108/GB秒 | ✅ |
| Railway | $5/月(~35元) | 按量付费 | ❌ |
| Render | 750小时 | $7/月(~50元) | ❌ |

---

## 域名备案说明

### 什么情况需要备案？

如果使用**国内云服务商**（阿里云、腾讯云、华为云等）的服务器，并且使用**自己的域名**，就需要备案。

### 不需要备案的情况

- ✅ 使用海外服务器（Railway、Render、Zeabur 香港节点）
- ✅ 使用平台提供的域名（.zeabur.app、.up.railway.app）
- ✅ 只用 IP 访问（不推荐）

### 备案流程

如果需要备案：
1. 在云服务商处申请备案服务号
2. 准备材料（身份证、域名证书等）
3. 提交备案申请
4. 等待审核（7-20 个工作日）
5. 备案通过后才能使用

---

## 国内访问优化建议

### 1. 使用 CDN

即使部署在国外，也可以通过 CDN 加速：

- **Cloudflare**：免费，效果好
- **七牛云 CDN**：国内速度快
- **又拍云 CDN**：有免费额度

### 2. 数据库优化

- 使用缓存（Redis）减少数据库查询
- 启用 PostgreSQL 连接池
- 优化查询语句

### 3. 静态资源

- 图片等静态资源使用 OSS
- 启用压缩和缓存

---

## 总结

### 推荐排序

1. **Zeabur** ⭐⭐⭐⭐⭐
   - 不需要备案
   - 使用简单
   - 国内访问快
   - 完美支持 NestJS

2. **Railway + Cloudflare** ⭐⭐⭐⭐
   - 不需要备案
   - CDN 加速后速度可以
   - 稳定可靠

3. **阿里云/腾讯云**（有备案）⭐⭐⭐⭐
   - 需要备案
   - 免费额度大
   - 需要代码改造

### 最佳实践

**如果没有备案** → 使用 **Zeabur**

**如果有备案** → 使用 **阿里云函数计算**

**如果追求稳定** → 使用 **Railway + Cloudflare**

---

## 相关文档

- **DEPLOY_TO_RAILWAY.md** - Railway 部署教程
- **DEPLOY_TO_RENDER.md** - Render 部署教程
- **FREE_HOSTING_COMPARISON.md** - 国外平台对比
- **QUICK_DEPLOY.md** - 快速部署指南

---

**立即开始部署到 Zeabur！** 🚀

只需 5 分钟，无需备案，国内访问快！
