# 使用官方 Node.js 运行时作为基础镜像
# 使用 Node.js 20，它对 crypto 模块有更好的支持
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm

# 安装所有依赖（包括开发依赖，用于构建）
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm run build

# 删除开发依赖，只保留生产依赖
RUN pnpm prune --prod

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "dist/main"]
