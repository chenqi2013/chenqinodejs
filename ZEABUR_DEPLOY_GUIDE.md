# 🚀 Zeabur 完整部署指南

## 📋 目录
1. [前提条件](#前提条件)
2. [步骤 1：创建项目](#步骤-1创建项目)
3. [步骤 2：部署应用](#步骤-2部署应用)
4. [步骤 3：添加 PostgreSQL 数据库](#步骤-3添加-postgresql-数据库)
5. [步骤 4：配置环境变量](#步骤-4配置环境变量)
6. [步骤 5：获取域名](#步骤-5获取域名)
7. [故障排查](#故障排查)

---

## 前提条件

✅ GitHub 账号  
✅ 项目已推送到 GitHub  
✅ Zeabur 账号（使用 GitHub 登录）

---

## 步骤 1：创建项目

### 1.1 登录 Zeabur

1. 访问 [https://zeabur.com](https://zeabur.com)
2. 点击 **"Sign in with GitHub"**
3. 授权 Zeabur 访问您的 GitHub 账号

### 1.2 创建新项目

1. 点击 **"New Project"** 或 **"创建项目"**
2. 输入项目名称：`chenqinodejs`
3. 选择区域：**Hong Kong (hkg1)** 或 **Tokyo (tyo1)**（国内访问快）
4. 点击 **"Create"**

---

## 步骤 2：部署应用

### 2.1 添加 Git 服务

1. 在项目页面，点击 **"Add Service"** 或 **"添加服务"**
2. 选择 **"Git"**
3. 选择 **GitHub**
4. 找到并选择您的仓库：`chenqi2013/chenqinodejs`
5. 点击 **"Deploy"** 或 **"部署"**

### 2.2 等待初次部署

⚠️ **注意**：初次部署会失败，因为还没有配置数据库！这是正常的。

您会看到类似这样的错误：
```
[TypeOrmModule] Unable to connect to the database. Retrying...
AggregateError [ECONNREFUSED]
```

**不用担心**，我们接下来会添加数据库。

---

## 步骤 3：添加 PostgreSQL 数据库

### 3.1 添加数据库服务

1. 在项目页面，再次点击 **"Add Service"**
2. 选择 **"Marketplace"** 或 **"服务市场"**
3. 找到 **"PostgreSQL"**
4. 点击 **"Deploy"** 或 **"部署"**

### 3.2 等待数据库启动

数据库通常需要 1-2 分钟启动完成。

---

## 步骤 4：配置环境变量

### 4.1 查看数据库连接信息

1. 点击 **PostgreSQL 服务**
2. 进入 **"Variables"** 或 **"变量"** 标签
3. 您会看到这些环境变量：
   - `POSTGRES_HOST`
   - `POSTGRES_PORT`
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

### 4.2 配置应用环境变量

1. 返回到您的 **应用服务**（chenqinodejs）
2. 进入 **"Variables"** 或 **"变量"** 标签
3. 点击 **"Add Variable"** 或 **"添加变量"**

添加以下环境变量：

#### 方法 A：使用 Zeabur 模板引用（推荐）

```env
NODE_ENV=production
PORT=3000

# 引用 PostgreSQL 的环境变量
DB_HOST=${POSTGRES_HOST}
DB_PORT=${POSTGRES_PORT}
DB_USERNAME=${POSTGRES_USER}
DB_PASSWORD=${POSTGRES_PASSWORD}
DB_DATABASE=${POSTGRES_DATABASE}
```

#### 方法 B：直接复制粘贴（如果方法 A 不工作）

```env
NODE_ENV=production
PORT=3000

# 从 PostgreSQL 服务复制实际值
DB_HOST=<PostgreSQL 的 Host>
DB_PORT=5432
DB_USERNAME=<PostgreSQL 的 User>
DB_PASSWORD=<PostgreSQL 的 Password>
DB_DATABASE=<PostgreSQL 的 Database>
```

### 4.3 保存并重新部署

1. 点击 **"Save"** 或 **"保存"**
2. 点击 **"Redeploy"** 或 **"重新部署"**

---

## 步骤 5：获取域名

### 5.1 自动分配的域名

部署成功后：

1. 点击您的应用服务
2. 进入 **"Networking"** 或 **"网络"** 标签
3. 您会看到自动分配的域名，类似：
   ```
   https://your-app-xxxx.zeabur.app
   ```

### 5.2 绑定自定义域名（可选）

如果您有自己的域名：

1. 在 **"Networking"** 标签点击 **"Add Domain"**
2. 输入您的域名：`api.yourdomain.com`
3. 在 DNS 服务商添加 CNAME 记录：
   ```
   CNAME: api.yourdomain.com -> your-app.zeabur.app
   ```
4. 等待 DNS 生效（通常 5-10 分钟）

⚠️ **注意**：使用 Zeabur 香港节点的域名**不需要备案**！

---

## 步骤 6：测试部署

### 6.1 检查应用状态

在应用服务页面，查看 **"Logs"** 或 **"日志"**：

成功的日志应该类似：
```
[Nest] 1  - LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized
[Nest] 1  - LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 1  - LOG [RoutesResolver] AppController {/}
[Nest] 1  - LOG [RouterExplorer] Mapped {/, GET} route
✅ 数据库初始化完成
[Nest] 1  - LOG [NestApplication] Nest application successfully started
```

### 6.2 测试 API

使用您的域名测试：

```bash
# 替换为您的实际域名
export API_URL="https://your-app.zeabur.app"

# 测试基础接口
curl $API_URL/

# 测试角色接口
curl $API_URL/api/v1/role

# 测试用户创建
curl -X POST $API_URL/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"deviceId": "test-device-001", "nickname": "测试用户"}'

# 测试版本检查
curl "$API_URL/api/v1/version/check?currentVersion=1.0.0&platform=android"
```

---

## 🎉 部署成功！

您的 API 现在已经部署到 Zeabur 了！

**您的 API 地址**：`https://your-app.zeabur.app`

### 功能特点

✅ **自动 HTTPS**  
✅ **国内访问快**（香港节点）  
✅ **不需要备案**  
✅ **自动重启**（代码更新后）  
✅ **免费 $5/月 额度**  
✅ **PostgreSQL 数据库**  

---

## 故障排查

### 问题 1：应用一直重启

**症状**：日志显示 `Unable to connect to the database`

**解决方案**：
1. 检查 PostgreSQL 服务是否正在运行
2. 检查环境变量是否正确配置
3. 确保 `DB_HOST`、`DB_PORT` 等变量已设置

### 问题 2：数据库连接超时

**症状**：`Connection timeout` 或 `ETIMEDOUT`

**解决方案**：
1. 确保应用和数据库在同一个项目中
2. 使用 Zeabur 的内部网络连接（变量引用）
3. 检查数据库是否已启动完成

### 问题 3：端口冲突

**症状**：`EADDRINUSE: address already in use`

**解决方案**：
1. 确保 `PORT` 环境变量设置为 `3000`
2. Zeabur 会自动处理端口映射

### 问题 4：构建失败

**症状**：`nest: not found` 或 `pnpm: command not found`

**解决方案**：
1. 确保 Dockerfile 已更新（使用 Node.js 20）
2. 确保 `pnpm install` 不使用 `--prod` 标志
3. 检查 GitHub 仓库是否有最新代码

### 问题 5：环境变量不生效

**症状**：应用使用默认值而不是配置的值

**解决方案**：
1. 保存环境变量后，点击 **"Redeploy"**
2. 检查变量名是否正确（区分大小写）
3. 使用 `${VARIABLE_NAME}` 格式引用其他服务的变量

---

## 查看日志

### 实时日志

1. 点击应用服务
2. 进入 **"Logs"** 标签
3. 查看实时日志输出

### 数据库日志

1. 点击 PostgreSQL 服务
2. 进入 **"Logs"** 标签
3. 查看数据库启动和连接日志

---

## 更新部署

### 自动部署

Zeabur 默认启用了 Git 自动部署：

1. 推送代码到 GitHub：
   ```bash
   git add .
   git commit -m "update: 更新功能"
   git push origin main
   ```

2. Zeabur 会自动检测并重新部署

### 手动部署

1. 在应用服务页面
2. 点击右上角的 **"Redeploy"**
3. 选择要部署的分支或提交

---

## 成本估算

### 免费额度

- **$5/月** 免费额度
- 包含：
  - 应用运行时间
  - 数据库存储
  - 网络流量（100GB）

### 超出后

- **按量付费**
- 应用：约 $5/月
- PostgreSQL：约 $5/月
- 总计：约 $10/月（约 70 元人民币）

---

## 性能优化建议

### 1. 启用连接池

已在 `src/config/database.config.ts` 中配置：
```typescript
extra: {
  max: 10,
  min: 2,
  idleTimeoutMillis: 30000
}
```

### 2. 使用 Redis 缓存（可选）

如果需要缓存，可以在 Zeabur 添加 Redis 服务。

### 3. 监控和日志

- 定期查看 Zeabur Logs
- 使用 Zeabur 提供的性能监控

---

## 安全建议

### 1. 环境变量

- ✅ 使用 Zeabur 的环境变量功能
- ❌ 不要在代码中硬编码密码
- ❌ 不要提交 `.env` 文件到 Git

### 2. 数据库

- ✅ 使用 Zeabur 内部网络连接
- ✅ 使用强密码
- ❌ 不要暴露数据库端口到公网

### 3. API 安全

建议添加：
- API 密钥认证
- 请求速率限制
- CORS 配置

---

## 相关文档

- **[README.md](README.md)** - 项目主文档
- **[QUICK_START.md](QUICK_START.md)** - 快速开始指南
- **[API_USAGE_EXAMPLES.md](API_USAGE_EXAMPLES.md)** - API 使用示例
- **[DEPLOY_TO_CHINA.md](DEPLOY_TO_CHINA.md)** - 中国平台部署对比

---

## 技术支持

### Zeabur 官方

- **官网**：[https://zeabur.com](https://zeabur.com)
- **文档**：[https://zeabur.com/docs](https://zeabur.com/docs)
- **Discord**：[https://discord.gg/zeabur](https://discord.gg/zeabur)

### 项目问题

如果遇到项目相关问题，请检查：
1. GitHub Issues
2. 项目文档
3. API 文档

---

**祝您部署成功！** 🎊

如有问题，请参考 [故障排查](#故障排查) 部分。
