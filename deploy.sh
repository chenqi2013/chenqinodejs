#!/bin/bash

# 部署脚本
echo "🚀 开始部署 NestJS 应用..."

# 检查 Node.js 版本
echo "📋 检查 Node.js 版本..."
node --version

# 检查 pnpm 是否安装
if ! command -v pnpm &> /dev/null; then
    echo "📦 安装 pnpm..."
    npm install -g pnpm
fi

# 安装依赖
echo "📦 安装依赖..."
pnpm install --frozen-lockfile

# 构建应用
echo "🔨 构建应用..."
pnpm run build

# 检查 PM2 是否安装
if ! command -v pm2 &> /dev/null; then
    echo "📦 安装 PM2..."
    npm install -g pm2
fi

# 创建日志目录
mkdir -p logs

# 停止现有进程（如果存在）
echo "🛑 停止现有进程..."
pm2 stop chenqinodejs-api 2>/dev/null || true
pm2 delete chenqinodejs-api 2>/dev/null || true

# 启动应用
echo "🚀 启动应用..."
pm2 start ecosystem.config.js --env production

# 保存 PM2 配置
pm2 save

# 设置 PM2 开机自启
pm2 startup

echo "✅ 部署完成！"
echo "📊 查看应用状态: pm2 status"
echo "📝 查看日志: pm2 logs chenqinodejs-api"
echo "🌐 应用地址: http://localhost:3000"
