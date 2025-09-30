# 🚀 快速开始指南

## ✅ 已完成的配置

### 数据库安装（PostgreSQL 15）
- ✅ 已通过 Homebrew 安装 PostgreSQL 15
- ✅ PostgreSQL 服务已启动并设置为开机自启
- ✅ 已创建数据库：`chenqinodejs_db`
- ✅ 数据库连接已测试通过

### 应用配置
- ✅ 已安装所有依赖包
- ✅ 已配置环境变量（`.env` 文件）
- ✅ TypeORM 已集成并正常工作
- ✅ 数据库表自动创建（roles 表）
- ✅ 初始数据已加载（10 个角色）

## 🎯 可用的 API 接口

### 1. 获取所有角色
```bash
curl http://localhost:3000/api/v1/role
```

### 2. 获取单个角色
```bash
curl http://localhost:3000/api/v1/role/1
```

### 3. 创建新角色
```bash
curl -X POST http://localhost:3000/api/v1/role \
  -H "Content-Type: application/json" \
  -d '{
    "name": "新角色名称",
    "description": "角色描述",
    "image": "https://example.com/image.jpg",
    "language": "zh-CN"
  }'
```

### 4. 更新角色
```bash
curl -X PUT http://localhost:3000/api/v1/role/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "更新的名称",
    "description": "更新的描述"
  }'
```

### 5. 删除角色
```bash
curl -X DELETE http://localhost:3000/api/v1/role/1
```

## 🔧 常用命令

### 应用管理
```bash
# 启动开发服务器
pnpm run start:dev

# 构建应用
pnpm run build

# 生产模式启动
pnpm run start:prod

# 运行测试
pnpm run test
```

### 数据库管理
```bash
# 测试数据库连接
node test-db.js

# 启动 PostgreSQL
brew services start postgresql@15

# 停止 PostgreSQL
brew services stop postgresql@15

# 重启 PostgreSQL
brew services restart postgresql@15

# 查看 PostgreSQL 状态
brew services list | grep postgresql

# 连接到数据库
psql chenqinodejs_db

# 在 psql 中查看所有表
\dt

# 查看 roles 表结构
\d roles

# 查询所有角色
SELECT * FROM roles;

# 退出 psql
\q
```

### PM2 进程管理（生产环境）
```bash
# 使用 PM2 启动
pnpm run pm2:start

# 停止应用
pnpm run pm2:stop

# 重启应用
pnpm run pm2:restart

# 查看日志
pnpm run pm2:logs

# 查看状态
pm2 status
```

### Docker 部署
```bash
# 构建 Docker 镜像
pnpm run docker:build

# 运行 Docker 容器
pnpm run docker:run

# 使用 Docker Compose
pnpm run docker:compose
```

## 📊 数据库信息

- **数据库名称**：chenqinodejs_db
- **主机**：localhost
- **端口**：5432
- **用户名**：chenqi（当前系统用户）
- **密码**：（无，使用系统认证）

## 🎨 测试场景

### 场景 1：创建、更新、删除角色
```bash
# 1. 创建新角色
curl -X POST http://localhost:3000/api/v1/role \
  -H "Content-Type: application/json" \
  -d '{"name":"测试","description":"测试描述","image":"https://example.com/test.jpg","language":"zh-CN"}'

# 2. 假设返回 ID 为 11，更新它
curl -X PUT http://localhost:3000/api/v1/role/11 \
  -H "Content-Type: application/json" \
  -d '{"name":"更新测试"}'

# 3. 删除它
curl -X DELETE http://localhost:3000/api/v1/role/11

# 4. 验证已删除（应返回 404）
curl http://localhost:3000/api/v1/role/11
```

### 场景 2：查看数据库中的数据
```bash
# 连接数据库
psql chenqinodejs_db

# 查询所有角色
SELECT id, name, language, "isActive", "createdAt" FROM roles ORDER BY id;

# 查询已删除的角色（软删除）
SELECT id, name, "isActive" FROM roles WHERE "isActive" = false;
```

## 🔍 故障排查

### 问题：数据库连接失败
```bash
# 检查 PostgreSQL 是否运行
brew services list | grep postgresql

# 如果未运行，启动它
brew services start postgresql@15

# 测试连接
node test-db.js
```

### 问题：端口 3000 被占用
```bash
# 查找占用端口的进程
lsof -i :3000

# 杀死进程
kill -9 <PID>
```

### 问题：数据库表不存在
```bash
# TypeORM 会在开发环境自动创建表（synchronize: true）
# 如果没有，手动运行迁移
pnpm run db:migrate
```

## 📖 相关文档

- **DATABASE_SETUP.md** - 详细的数据库设置指南
- **DEPLOYMENT.md** - 部署到服务器的完整指南
- **.env** - 环境变量配置文件

## 🎉 当前状态

✅ PostgreSQL 数据库已安装并运行  
✅ 应用已启动在 http://localhost:3000  
✅ 所有 CRUD API 正常工作  
✅ 数据库中已有 10 个初始角色  
✅ 软删除功能正常  

现在您可以开始开发了！🚀
