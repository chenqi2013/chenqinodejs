# 🚀 NestJS 应用部署指南

本指南提供了多种部署 NestJS 应用的方法，您可以根据自己的需求选择合适的方案。

## 📋 部署前准备

### 系统要求
- Node.js 18+ 
- pnpm (推荐) 或 npm
- PM2 (用于进程管理)
- Docker (可选，用于容器化部署)

### 环境变量配置
复制并修改环境变量文件：
```bash
cp .env.production .env
# 根据实际情况修改 .env 文件中的配置
```

## 🎯 部署方案

### 方案一：使用 PM2 部署（推荐）

#### 1. 自动部署脚本
```bash
# 运行自动部署脚本
./deploy.sh
```

#### 2. 手动部署步骤
```bash
# 1. 安装依赖
pnpm install --frozen-lockfile

# 2. 构建应用
pnpm run build

# 3. 安装 PM2（如果未安装）
npm install -g pm2

# 4. 启动应用
pm2 start ecosystem.config.js --env production

# 5. 保存 PM2 配置
pm2 save

# 6. 设置开机自启
pm2 startup
```

#### PM2 常用命令
```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs chenqinodejs-api

# 重启应用
pm2 restart chenqinodejs-api

# 停止应用
pm2 stop chenqinodejs-api

# 删除应用
pm2 delete chenqinodejs-api

# 监控应用
pm2 monit
```

### 方案二：使用 Docker 部署

#### 1. 构建 Docker 镜像
```bash
# 构建镜像
docker build -t chenqinodejs-api .

# 运行容器
docker run -d -p 3000:3000 --name chenqinodejs-api chenqinodejs-api
```

#### 2. 使用 Docker Compose
```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 方案三：传统部署

```bash
# 1. 安装依赖
pnpm install --frozen-lockfile --prod

# 2. 构建应用
pnpm run build

# 3. 启动应用
pnpm run start:prod
```

## 🌐 反向代理配置

### 使用 Nginx

1. 安装 Nginx：
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

2. 配置 Nginx：
```bash
# 复制配置文件
sudo cp nginx.conf /etc/nginx/sites-available/chenqinodejs-api
sudo ln -s /etc/nginx/sites-available/chenqinodejs-api /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

## 🔒 安全配置

### 1. 防火墙设置
```bash
# Ubuntu/Debian
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable

# CentOS/RHEL
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 2. SSL 证书配置
使用 Let's Encrypt 获取免费 SSL 证书：
```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com
```

## 📊 监控和日志

### 1. 应用监控
- PM2 监控：`pm2 monit`
- 日志查看：`pm2 logs`
- 系统资源：`htop` 或 `top`

### 2. 日志管理
日志文件位置：
- 应用日志：`./logs/`
- PM2 日志：`~/.pm2/logs/`
- Nginx 日志：`/var/log/nginx/`

### 3. 健康检查
应用提供了健康检查端点：
```bash
curl http://localhost:3000/
```

## 🔧 故障排除

### 常见问题

1. **端口被占用**
```bash
# 查看端口占用
lsof -i :3000
# 或
netstat -tulpn | grep :3000

# 杀死进程
kill -9 <PID>
```

2. **权限问题**
```bash
# 给脚本执行权限
chmod +x deploy.sh

# 修改文件所有者
sudo chown -R $USER:$USER /path/to/app
```

3. **内存不足**
```bash
# 查看内存使用
free -h

# 增加 swap 空间（如果需要）
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## 🚀 性能优化

### 1. PM2 集群模式
已在 `ecosystem.config.js` 中配置了集群模式，会根据 CPU 核心数自动创建进程。

### 2. 缓存配置
可以添加 Redis 缓存来提高性能：
```bash
# 安装 Redis
sudo apt install redis-server

# 在应用中配置 Redis 连接
```

### 3. 数据库优化
如果使用数据库，建议：
- 配置连接池
- 添加适当的索引
- 使用查询缓存

## 📞 技术支持

如果遇到部署问题，可以：
1. 查看应用日志：`pm2 logs chenqinodejs-api`
2. 检查系统资源：`htop`
3. 验证网络连接：`curl http://localhost:3000/api/v1/role`

## 🎉 部署完成

部署成功后，您的 API 将在以下地址可用：
- 本地访问：http://localhost:3000
- 角色接口：http://localhost:3000/api/v1/role

记得将 `localhost` 替换为您的实际服务器 IP 或域名！
