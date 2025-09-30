# 🗄️ 数据库设置指南

本指南将帮助您设置 PostgreSQL 数据库并配置 NestJS 应用。

## 📋 前置要求

- Node.js 18+
- PostgreSQL 12+
- pnpm 或 npm

## 🐘 安装 PostgreSQL

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### CentOS/RHEL
```bash
sudo yum install postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

### macOS
```bash
brew install postgresql
brew services start postgresql
```

### Windows
下载并安装 [PostgreSQL](https://www.postgresql.org/download/windows/)

## 🔧 数据库配置

### 1. 创建数据库和用户

```bash
# 切换到 postgres 用户
sudo -u postgres psql

# 在 PostgreSQL 命令行中执行：
CREATE DATABASE chenqinodejs_db;
CREATE USER chenqinodejs_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE chenqinodejs_db TO chenqinodejs_user;
\q
```

### 2. 配置环境变量

复制并修改环境变量文件：
```bash
cp .env.example .env
```

编辑 `.env` 文件：
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=chenqinodejs_user
DB_PASSWORD=your_password
DB_DATABASE=chenqinodejs_db
```

## 🚀 运行应用

### 1. 安装依赖
```bash
pnpm install
```

### 2. 构建应用
```bash
pnpm run build
```

### 3. 运行数据库迁移（可选）
```bash
pnpm run db:migrate
```

### 4. 启动应用
```bash
pnpm run start:dev
```

## 🐳 使用 Docker 运行数据库

如果您不想在本地安装 PostgreSQL，可以使用 Docker：

### 1. 启动 PostgreSQL 容器
```bash
docker run --name postgres-db \
  -e POSTGRES_DB=chenqinodejs_db \
  -e POSTGRES_USER=chenqinodejs_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:15
```

### 2. 使用 Docker Compose（推荐）
创建 `docker-compose.db.yml`：
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: chenqinodejs_db
      POSTGRES_USER: chenqinodejs_user
      POSTGRES_PASSWORD: your_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

启动数据库：
```bash
docker-compose -f docker-compose.db.yml up -d
```

## 📊 数据库管理

### 常用命令

```bash
# 连接数据库
psql -h localhost -U chenqinodejs_user -d chenqinodejs_db

# 查看所有表
\dt

# 查看表结构
\d roles

# 退出
\q
```

### 数据库迁移

```bash
# 运行迁移
pnpm run db:migrate

# 回滚迁移
pnpm run db:migrate:revert

# 生成新迁移
pnpm run db:generate src/migrations/YourMigrationName
```

## 🔍 验证设置

### 1. 检查数据库连接
应用启动后，查看控制台输出，应该看到：
```
✅ 数据库初始化完成
```

### 2. 测试 API 接口
```bash
# 获取所有角色
curl http://localhost:3000/api/v1/role

# 获取特定角色
curl http://localhost:3000/api/v1/role/1

# 创建新角色
curl -X POST http://localhost:3000/api/v1/role \
  -H "Content-Type: application/json" \
  -d '{
    "name": "测试角色",
    "description": "这是一个测试角色",
    "image": "https://example.com/image.jpg",
    "language": "zh-CN"
  }'
```

## 🛠️ 故障排除

### 常见问题

1. **连接被拒绝**
   ```bash
   # 检查 PostgreSQL 是否运行
   sudo systemctl status postgresql
   
   # 启动 PostgreSQL
   sudo systemctl start postgresql
   ```

2. **认证失败**
   ```bash
   # 检查用户权限
   sudo -u postgres psql
   \du
   ```

3. **数据库不存在**
   ```bash
   # 创建数据库
   sudo -u postgres createdb chenqinodejs_db
   ```

4. **端口被占用**
   ```bash
   # 查看端口占用
   sudo netstat -tulpn | grep 5432
   
   # 杀死进程
   sudo kill -9 <PID>
   ```

### 日志查看

```bash
# PostgreSQL 日志
sudo tail -f /var/log/postgresql/postgresql-*.log

# 应用日志
pnpm run pm2:logs
```

## 🔒 安全建议

1. **更改默认密码**
2. **限制数据库访问权限**
3. **使用 SSL 连接（生产环境）**
4. **定期备份数据库**

## 📈 性能优化

1. **创建索引**
2. **配置连接池**
3. **监控查询性能**
4. **定期清理日志**

## 🎉 完成

数据库设置完成后，您的应用将具备完整的 CRUD 功能：

- ✅ 获取所有角色：`GET /api/v1/role`
- ✅ 获取特定角色：`GET /api/v1/role/:id`
- ✅ 创建角色：`POST /api/v1/role`
- ✅ 更新角色：`PUT /api/v1/role/:id`
- ✅ 删除角色：`DELETE /api/v1/role/:id`

现在您可以开始使用数据库功能了！🚀
