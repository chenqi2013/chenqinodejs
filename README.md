# 🚀 ChenqiNodeJS - 完整的后端 API 解决方案

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  基于 NestJS 构建的完整后端API系统，包含用户管理、扫码功能、版本更新等核心功能
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-v11-red" alt="NestJS"/>
  <img src="https://img.shields.io/badge/TypeScript-5.9-blue" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/PostgreSQL-15-blue" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License"/>
</p>

## ✨ 核心功能

- 🎭 **角色管理系统** - 10个预置角色，支持完整CRUD操作
- 👥 **用户管理系统** - 用户注册、信息管理、使用次数管理
- 📱 **扫码互助系统** - 二维码扫描、次数增加、防止互刷机制
- 🔄 **版本更新检测** - 支持Android/iOS双平台、强制更新、版本智能比较
- 🗄️ **PostgreSQL 数据库** - 完整的数据持久化方案
- 📚 **完整的 API 文档** - 详细的接口说明和使用示例
- 🚀 **免费部署方案** - Render、Railway 等多种免费托管选择

## 📋 目录

- [快速开始](#快速开始)
- [功能模块](#功能模块)
- [API 接口](#api-接口)
- [部署指南](#部署指南)
- [文档列表](#文档列表)
- [技术栈](#技术栈)

## 🚀 快速开始

### 前置要求

- Node.js >= 18
- PostgreSQL >= 15
- pnpm（推荐）或 npm

### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/yourusername/chenqinodejs.git
cd chenqinodejs

# 2. 安装依赖
pnpm install

# 3. 配置数据库
# 复制 .env 文件并修改数据库配置
cp .env.example .env

# 4. 启动数据库（如果还没安装）
# macOS
brew install postgresql@15
brew services start postgresql@15

# 5. 启动开发服务器
pnpm run start:dev
```

### 访问 API

```bash
# 测试基础接口
curl http://localhost:3000/

# 测试角色接口
curl http://localhost:3000/api/v1/role

# 测试版本检查
curl "http://localhost:3000/api/v1/version/check?currentVersion=1.0.0&platform=android"
```

**详细文档**: 查看 [QUICK_START.md](QUICK_START.md)

## 📦 功能模块

### 1. 角色管理系统

管理应用中的各种角色配置，包含中英文角色。

**功能**:
- ✅ 获取所有角色列表
- ✅ 根据ID获取单个角色
- ✅ 创建新角色
- ✅ 更新角色信息
- ✅ 删除角色（软删除）

**预置角色**: 秦始皇、夏笙、柳风、凤千雪、林浩、Veyra Dawnlight 等 10 个角色

### 2. 用户管理系统

管理应用用户信息和使用次数。

**功能**:
- ✅ 用户注册（通过设备ID）
- ✅ 查询用户信息
- ✅ 更新用户资料
- ✅ 清空使用次数
- ✅ 用户列表查询

### 3. 扫码互助系统 ⭐

创新的互扫二维码增加使用次数系统。

**规则**:
- 用户A扫描用户B → 用户B次数 +10
- 用户B已扫描过用户A → 用户A无法扫描用户B（防止互刷）
- 不能重复扫描同一用户
- 不能扫描自己

**功能**:
- ✅ 扫描二维码增加次数
- ✅ 查看扫描历史
- ✅ 查看收到的扫描
- ✅ 检查互扫状态

### 4. 版本更新系统 🆕

完整的APP版本管理和更新检测系统。

**功能**:
- ✅ 版本更新检测（Android/iOS）
- ✅ 强制更新标识
- ✅ 版本号智能比较（x.y.z格式）
- ✅ 版本发布管理
- ✅ 更新内容描述
- ✅ 下载链接管理

**示例**:
```bash
# 用户版本 1.0.0 检查更新
curl "http://localhost:3000/api/v1/version/check?currentVersion=1.0.0&platform=android"

# 返回: 发现新版本 2.0.0（强制更新）
```

## 🔌 API 接口

### 基础 URL
```
http://localhost:3000/api/v1
```

### 主要接口

#### 角色管理
```
GET    /api/v1/role           # 获取所有角色
GET    /api/v1/role/:id       # 获取单个角色
POST   /api/v1/role           # 创建角色
PUT    /api/v1/role/:id       # 更新角色
DELETE /api/v1/role/:id       # 删除角色
```

#### 用户管理
```
POST   /api/v1/users                      # 创建用户
GET    /api/v1/users/:deviceId            # 获取用户信息
GET    /api/v1/users                      # 获取所有用户
PUT    /api/v1/users/:deviceId            # 更新用户信息
POST   /api/v1/users/:deviceId/reset-usage # 清空使用次数
```

#### 扫码功能
```
POST   /api/v1/scan/qrcode              # 扫描二维码
GET    /api/v1/scan/history/:deviceId   # 扫描历史
GET    /api/v1/scan/received/:deviceId  # 收到的扫描
GET    /api/v1/scan/check               # 检查互扫状态
```

#### 版本管理
```
GET    /api/v1/version/check            # 检查版本更新 ⭐
POST   /api/v1/version                  # 创建新版本
GET    /api/v1/version                  # 获取所有版本
GET    /api/v1/version/latest/:platform # 获取最新版本
PUT    /api/v1/version/:id              # 更新版本信息
DELETE /api/v1/version/:id              # 删除版本
```

**详细API文档**:
- [API_USAGE_EXAMPLES.md](API_USAGE_EXAMPLES.md) - API使用示例
- [SCAN_API_DOCUMENTATION.md](SCAN_API_DOCUMENTATION.md) - 扫码功能文档
- [VERSION_API_DOCUMENTATION.md](VERSION_API_DOCUMENTATION.md) - 版本更新文档

## 🌐 部署指南

### 免费部署（推荐）

#### 🇨🇳 国内用户首选: Zeabur ⭐⭐⭐⭐⭐

**优势**: 中国团队、国内访问快、不需要备案、支持中文

```bash
# 3分钟快速部署
npm install -g @zeabur/cli
zeabur auth login
zeabur
```

**域名**: `https://your-app.zeabur.app`

**详细教程**: [DEPLOY_TO_CHINA.md](DEPLOY_TO_CHINA.md)

---

#### 🌍 国际平台选项 1: Railway.app ⭐⭐⭐⭐⭐

**优势**: 不休眠、稳定、部署快速

```bash
# 3分钟快速部署
npm install -g @railway/cli
railway login
railway init
railway up
```

**域名**: `https://your-app.up.railway.app`

**详细教程**: [DEPLOY_TO_RAILWAY.md](DEPLOY_TO_RAILWAY.md)

#### 选项 2: Render.com ⭐⭐⭐⭐

**优势**: 完全免费、简单易用、零配置

1. 访问 [render.com](https://render.com)
2. 连接 GitHub 仓库
3. 添加 PostgreSQL
4. 点击部署

**域名**: `https://your-app.onrender.com`

**详细教程**: [DEPLOY_TO_RENDER.md](DEPLOY_TO_RENDER.md)

#### 平台对比

| 平台 | 免费额度 | 休眠 | 速度 | 备案 | 推荐度 |
|------|---------|------|------|------|-------|
| Zeabur 🇨🇳 | $5/月 | ❌ | ⚡⚡⚡ | ❌ | ⭐⭐⭐⭐⭐ |
| Railway | $5/月 | ❌ | ⚡⚡⚡ | ❌ | ⭐⭐⭐⭐⭐ |
| Render | 750h/月 | ✅ | ⚡⚡ | ❌ | ⭐⭐⭐⭐ |
| 阿里云FC 🇨🇳 | 100万次 | ❌ | ⚡⚡⚡ | ✅ | ⭐⭐⭐⭐ |

**国内平台对比**: [DEPLOY_TO_CHINA.md](DEPLOY_TO_CHINA.md)  
**国外平台对比**: [FREE_HOSTING_COMPARISON.md](FREE_HOSTING_COMPARISON.md)

### 自有服务器部署

```bash
# 使用 Docker Compose
docker-compose up -d

# 使用 PM2
pnpm install
pnpm run build
pm2 start ecosystem.config.js
```

**详细教程**: [DEPLOYMENT.md](DEPLOYMENT.md)

## 📚 文档列表

### 快速入门
- **[QUICK_START.md](QUICK_START.md)** - 快速开始指南
- **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** - 快速部署指南

### API 文档
- **[API_USAGE_EXAMPLES.md](API_USAGE_EXAMPLES.md)** - 完整的API使用示例
- **[SCAN_API_DOCUMENTATION.md](SCAN_API_DOCUMENTATION.md)** - 扫码功能详细文档
- **[VERSION_API_DOCUMENTATION.md](VERSION_API_DOCUMENTATION.md)** - 版本更新详细文档

### 部署文档
- **[DEPLOY_TO_CHINA.md](DEPLOY_TO_CHINA.md)** - 🇨🇳 中国免费平台部署（Zeabur等）
- **[DEPLOY_TO_RAILWAY.md](DEPLOY_TO_RAILWAY.md)** - Railway 部署教程
- **[DEPLOY_TO_RENDER.md](DEPLOY_TO_RENDER.md)** - Render 部署教程
- **[FREE_HOSTING_COMPARISON.md](FREE_HOSTING_COMPARISON.md)** - 国外平台对比
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - 自有服务器部署

### 数据库文档
- **[DATABASE_SETUP.md](DATABASE_SETUP.md)** - 数据库配置指南
- **[DATABASE_GUI_TOOLS.md](DATABASE_GUI_TOOLS.md)** - 数据库可视化工具

### 测试脚本
- **test-scan-feature.sh** - 扫码功能测试
- **test-version.sh** - 版本更新测试
- **test-reset-usage.sh** - 清空次数测试

### 演示页面
- **version-check-demo.html** - 版本检测可视化演示

## 🛠️ 技术栈

### 后端框架
- **NestJS 11** - 渐进式 Node.js 框架
- **TypeScript 5.9** - 类型安全的 JavaScript
- **TypeORM 0.3** - ORM 框架

### 数据库
- **PostgreSQL 15** - 关系型数据库

### 开发工具
- **pnpm** - 快速的包管理器
- **ESLint** - 代码检查
- **Prettier** - 代码格式化

### 部署工具
- **Docker** - 容器化
- **PM2** - 进程管理
- **Nginx** - 反向代理

## 📊 数据库结构

### 主要数据表

1. **roles** - 角色表
   - 存储所有角色配置信息
   - 支持多语言（中文/英文）

2. **users** - 用户表
   - 设备ID、昵称、使用次数
   - 支持软删除

3. **scan_records** - 扫码记录表
   - 记录所有扫码行为
   - 用于防止互刷和重复扫描

4. **app_versions** - 版本表
   - Android/iOS 版本管理
   - 强制更新标识
   - 版本号智能比较

## 🧪 测试

### 运行测试

```bash
# 单元测试
pnpm run test

# E2E 测试
pnpm run test:e2e

# 测试覆盖率
pnpm run test:cov
```

### 功能测试

```bash
# 测试扫码功能
./test-scan-feature.sh

# 测试版本更新
./test-version.sh

# 测试清空次数
./test-reset-usage.sh
```

## 🤝 贡献

欢迎贡献代码、报告问题或提出新功能建议！

## 📄 许可证

本项目采用 MIT 许可证。

## 👨‍💻 作者

- **ChenQi** - 初始工作

## 🌟 致谢

- [NestJS](https://nestjs.com/) - 优秀的Node.js框架
- [TypeORM](https://typeorm.io/) - 强大的ORM工具
- [PostgreSQL](https://www.postgresql.org/) - 可靠的数据库

## 📮 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 [GitHub Issue](https://github.com/yourusername/chenqinodejs/issues)
- 查看项目文档

---

**享受开发！** 🚀