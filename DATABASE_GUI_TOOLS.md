# 🎨 数据库可视化工具指南

## ✅ 已安装的工具

### TablePlus（推荐）
- ✅ 已通过 Homebrew 安装
- 📍 位置：`/Applications/TablePlus.app`
- 🚀 启动方式：在启动台或应用程序文件夹中找到 TablePlus

## 📝 TablePlus 连接配置

### 1. 打开 TablePlus
```bash
# 通过命令行打开
open -a TablePlus
```

### 2. 创建新连接
1. 点击"Create a new connection"或按 `⌘N`
2. 选择 **PostgreSQL**

### 3. 填写连接信息
```
Name: chenqinodejs（或任意名称）
Host: localhost
Port: 5432
User: chenqi
Password: （留空）
Database: chenqinodejs_db
```

### 4. 点击"Connect"连接

### 5. 查看数据
- 左侧会显示所有表
- 点击 `roles` 表即可查看所有角色数据
- 可以直接编辑、添加、删除记录

## 🔧 其他可视化工具

### Option 1: pgAdmin（官方工具）
```bash
# 安装 pgAdmin
brew install --cask pgadmin4

# 启动
open -a pgAdmin\ 4
```

连接配置：
- Host: localhost
- Port: 5432
- Database: chenqinodejs_db
- Username: chenqi
- Password: （留空）

### Option 2: Postico（Mac 专用）
```bash
# 安装 Postico
brew install --cask postico

# 启动
open -a Postico
```

### Option 3: DBeaver（开源免费）
```bash
# 安装 DBeaver
brew install --cask dbeaver-community

# 启动
open -a DBeaver
```

## 📊 使用 TablePlus 的常见操作

### 查看数据
1. 在左侧选择 `roles` 表
2. 右侧会显示所有记录
3. 可以看到所有字段：id, name, description, image, language, isActive, createdAt, updatedAt

### 添加记录
1. 点击工具栏的 `+` 按钮或按 `⌘N`
2. 填写字段值
3. 按 `⌘S` 保存

### 编辑记录
1. 双击要编辑的单元格
2. 修改内容
3. 按 `⌘S` 保存

### 删除记录
1. 选择要删除的行
2. 按 `Delete` 键
3. 按 `⌘S` 确认

### 执行 SQL 查询
1. 按 `⌘T` 打开 SQL 编辑器
2. 输入 SQL 语句，例如：
   ```sql
   SELECT * FROM roles WHERE language = 'zh-CN';
   SELECT COUNT(*) FROM roles WHERE "isActive" = true;
   SELECT id, name, "createdAt" FROM roles ORDER BY id;
   ```
3. 按 `⌘Enter` 执行

### 查看表结构
1. 右键点击 `roles` 表
2. 选择 "Show Structure" 或按 `⌘I`
3. 可以看到所有列的详细信息：
   - 列名
   - 数据类型
   - 约束条件
   - 默认值
   - 索引

### 导出数据
1. 选择 `roles` 表
2. 点击 "Export" 按钮
3. 选择格式：CSV, JSON, SQL 等
4. 选择保存位置

### 导入数据
1. 右键点击 `roles` 表
2. 选择 "Import"
3. 选择文件（CSV, JSON 等）
4. 映射字段
5. 导入

## 🎯 快捷键速查

### TablePlus 常用快捷键
- `⌘N` - 新建连接/新增记录
- `⌘T` - 打开 SQL 编辑器
- `⌘R` - 刷新数据
- `⌘S` - 保存更改
- `⌘Z` - 撤销
- `⌘Enter` - 执行 SQL
- `⌘F` - 搜索/过滤
- `⌘I` - 查看表结构
- `Delete` - 删除记录

## 📈 实用 SQL 查询示例

### 1. 查看所有活跃角色
```sql
SELECT id, name, language 
FROM roles 
WHERE "isActive" = true 
ORDER BY id;
```

### 2. 统计不同语言的角色数量
```sql
SELECT language, COUNT(*) as count 
FROM roles 
WHERE "isActive" = true 
GROUP BY language;
```

### 3. 查看最近创建的角色
```sql
SELECT id, name, "createdAt" 
FROM roles 
ORDER BY "createdAt" DESC 
LIMIT 5;
```

### 4. 查看已删除的角色（软删除）
```sql
SELECT id, name, "updatedAt" 
FROM roles 
WHERE "isActive" = false;
```

### 5. 搜索角色名称
```sql
SELECT * 
FROM roles 
WHERE name LIKE '%测试%';
```

### 6. 查看中文角色
```sql
SELECT id, name, description 
FROM roles 
WHERE language = 'zh-CN';
```

## 💡 技巧和最佳实践

### 1. 备份数据
定期导出数据作为备份：
```bash
# 使用 pg_dump 备份
pg_dump chenqinodejs_db > backup_$(date +%Y%m%d).sql
```

### 2. 恢复数据
```bash
# 恢复备份
psql chenqinodejs_db < backup_20250930.sql
```

### 3. 使用过滤器
在 TablePlus 中，可以使用过滤器快速筛选数据：
- 按 `⌘F` 打开过滤器
- 输入条件，例如：`language = 'zh-CN'`

### 4. 查看执行计划
在 SQL 编辑器中，使用 EXPLAIN 查看查询性能：
```sql
EXPLAIN ANALYZE 
SELECT * FROM roles WHERE language = 'zh-CN';
```

## 🔍 故障排查

### 连接失败
1. 检查 PostgreSQL 是否运行：
   ```bash
   brew services list | grep postgresql
   ```

2. 如果未运行，启动它：
   ```bash
   brew services start postgresql@15
   ```

3. 测试连接：
   ```bash
   psql chenqinodejs_db -c "SELECT 1"
   ```

### 权限问题
如果遇到权限问题，在 psql 中执行：
```sql
GRANT ALL PRIVILEGES ON DATABASE chenqinodejs_db TO chenqi;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO chenqi;
```

## 🎉 快速开始

1. **打开 TablePlus**
   ```bash
   open -a TablePlus
   ```

2. **创建连接**
   - Name: chenqinodejs
   - Host: localhost
   - Port: 5432
   - User: chenqi
   - Database: chenqinodejs_db

3. **连接并浏览**
   - 点击 Connect
   - 在左侧找到 `roles` 表
   - 点击查看数据

4. **开始使用**
   - 查看 10 个初始角色
   - 尝试添加、编辑、删除记录
   - 运行 SQL 查询

现在您可以用可视化工具管理数据库了！🚀
