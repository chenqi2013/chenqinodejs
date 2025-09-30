# 📱 扫码功能 API 文档

## 概述

这是一个互扫二维码增加使用次数的功能，实现了以下规则：
- 用户可以通过扫描其他用户的二维码（设备ID）来增加对方的使用次数
- 每次扫码成功增加 10 次使用次数
- **关键限制**：如果用户2给用户1扫过增加次数后，用户1无法再扫描用户2（防止互刷）
- 同一用户不能重复扫描同一个用户

## 数据表设计

### users 表（用户表）
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  device_id VARCHAR(100) UNIQUE NOT NULL COMMENT '设备唯一编号/二维码ID',
  nickname VARCHAR(100) COMMENT '用户昵称',
  usage_count INT DEFAULT 0 COMMENT '使用次数',
  is_active BOOLEAN DEFAULT true COMMENT '是否激活',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间'
);
```

### scan_records 表（扫码记录表）
```sql
CREATE TABLE scan_records (
  id SERIAL PRIMARY KEY,
  scanner_id INT NOT NULL COMMENT '扫描者用户ID',
  scanned_id INT NOT NULL COMMENT '被扫描者用户ID',
  added_count INT DEFAULT 10 COMMENT '增加的次数',
  scan_type VARCHAR(50) COMMENT '扫描类型',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '扫描时间',
  FOREIGN KEY (scanner_id) REFERENCES users(id),
  FOREIGN KEY (scanned_id) REFERENCES users(id)
);

CREATE INDEX idx_scan_records_scanner_scanned ON scan_records(scanner_id, scanned_id);
```

## API 接口

### 基础 URL
```
http://localhost:3000/api/v1
```

## 用户管理接口

### 1. 创建或获取用户
**接口**: `POST /users`

**请求体**:
```json
{
  "deviceId": "DEVICE_USER1",
  "nickname": "用户昵称"
}
```

**响应**:
```json
{
  "code": 200,
  "message": "用户创建成功",
  "data": {
    "id": 1,
    "deviceId": "DEVICE_USER1",
    "nickname": "用户昵称",
    "usageCount": 0,
    "createdAt": "2025-09-30T07:19:52.454Z",
    "updatedAt": "2025-09-30T07:19:52.454Z"
  },
  "timestamp": 1759216792
}
```

### 2. 获取用户信息
**接口**: `GET /users/:deviceId`

**响应**:
```json
{
  "code": 200,
  "message": "OK",
  "data": {
    "id": 1,
    "deviceId": "DEVICE_USER1",
    "nickname": "用户1",
    "usageCount": 10,
    "createdAt": "2025-09-30T07:19:52.454Z",
    "updatedAt": "2025-09-30T07:19:52.454Z"
  },
  "timestamp": 1759216792
}
```

### 3. 获取所有用户
**接口**: `GET /users`

**响应**:
```json
{
  "code": 200,
  "message": "OK",
  "data": [
    {
      "id": 1,
      "deviceId": "DEVICE_USER1",
      "nickname": "用户1",
      "usageCount": 10,
      ...
    }
  ],
  "timestamp": 1759216792
}
```

### 4. 更新用户信息
**接口**: `PUT /users/:deviceId`

**请求体**:
```json
{
  "nickname": "新昵称"
}
```

### 5. 清空使用次数 🆕
**接口**: `POST /users/:deviceId/reset-usage`

**描述**: 将指定用户的使用次数清空为 0

**请求**: 无需请求体

**响应**:
```json
{
  "code": 200,
  "message": "使用次数已清空",
  "data": {
    "id": 1,
    "deviceId": "DEVICE_USER1",
    "nickname": "用户1",
    "usageCount": 0,
    "createdAt": "2025-09-30T07:19:52.454Z",
    "updatedAt": "2025-09-30T07:54:05.453Z"
  },
  "timestamp": 1759218845
}
```

## 扫码功能接口

### 1. 扫描二维码 ⭐️
**接口**: `POST /scan/qrcode`

**描述**: 核心功能，用于扫描其他用户的二维码增加使用次数

**请求体**:
```json
{
  "scannerDeviceId": "DEVICE_USER2",
  "scannedDeviceId": "DEVICE_USER1"
}
```

**场景 1：首次扫描成功**
```json
{
  "code": 200,
  "message": "扫码成功！用户1 的使用次数增加了 10 次",
  "data": {
    "success": true,
    "message": "扫码成功！用户1 的使用次数增加了 10 次",
    "addedCount": 10,
    "scannerUsageCount": 0,
    "scannedUsageCount": 10,
    "scannerId": 2,
    "scannedId": 1
  },
  "timestamp": 1759216792
}
```

**场景 2：重复扫描**
```json
{
  "code": 200,
  "message": "您已经扫描过该用户了，无法重复扫描",
  "data": {
    "success": false,
    "message": "您已经扫描过该用户了，无法重复扫描",
    "addedCount": 0,
    ...
  }
}
```

**场景 3：对方已扫描过您（防止互刷）**
```json
{
  "code": 200,
  "message": "对方已经扫描过您了，您无法再扫描对方",
  "data": {
    "success": false,
    "message": "对方已经扫描过您了，您无法再扫描对方",
    "addedCount": 0,
    ...
  }
}
```

**场景 4：扫描自己**
```json
{
  "statusCode": 400,
  "message": "不能扫描自己的二维码",
  "error": "Bad Request"
}
```

### 2. 获取扫描历史（我扫描了谁）
**接口**: `GET /scan/history/:deviceId`

**响应**:
```json
{
  "code": 200,
  "message": "OK",
  "data": [
    {
      "id": 1,
      "scannerId": 2,
      "scannedId": 1,
      "scannerNickname": "用户2",
      "scannedNickname": "用户1",
      "addedCount": 10,
      "createdAt": "2025-09-30T07:19:52.489Z"
    }
  ],
  "timestamp": 1759216792
}
```

### 3. 获取收到的扫描（谁扫描了我）
**接口**: `GET /scan/received/:deviceId`

**响应**:
```json
{
  "code": 200,
  "message": "OK",
  "data": [
    {
      "id": 1,
      "scannerId": 2,
      "scannedId": 1,
      "scannerNickname": "用户2",
      "scannedNickname": "用户1",
      "addedCount": 10,
      "createdAt": "2025-09-30T07:19:52.489Z"
    }
  ],
  "timestamp": 1759216792
}
```

### 4. 检查互扫状态
**接口**: `GET /scan/check?deviceId1=xxx&deviceId2=yyy`

**描述**: 检查两个用户之间的扫描关系，判断是否可以继续扫描

**响应**:
```json
{
  "code": 200,
  "message": "OK",
  "data": {
    "user1": {
      "deviceId": "DEVICE_USER1",
      "nickname": "用户1",
      "hasScannedUser2": false
    },
    "user2": {
      "deviceId": "DEVICE_USER2",
      "nickname": "用户2",
      "hasScannedUser1": true
    },
    "canScan": {
      "user1CanScanUser2": false,
      "user2CanScanUser1": false
    }
  },
  "timestamp": 1759216792
}
```

## 业务逻辑说明

### 扫码规则

1. **首次扫描**: ✅ 用户2扫描用户1 → 用户1次数 +10
2. **重复扫描**: ❌ 用户2再次扫描用户1 → 提示"已经扫描过"
3. **反向限制**: ❌ 用户2扫描用户1后，用户1扫描用户2 → 提示"对方已扫描过您"
4. **自我扫描**: ❌ 用户1扫描用户1 → 提示"不能扫描自己"

### 流程图

```
用户2扫描用户1的二维码
    ↓
检查：是否扫描自己？
    ├─ 是 → 返回错误
    └─ 否 → 继续
        ↓
检查：用户2是否已扫描过用户1？
    ├─ 是 → 返回"已扫描过"
    └─ 否 → 继续
        ↓
检查：用户1是否已扫描过用户2？
    ├─ 是 → 返回"对方已扫描过您"
    └─ 否 → 继续
        ↓
    创建扫描记录
    用户1的使用次数 +10
    返回成功
```

## 测试场景

### 完整测试脚本
运行测试脚本：
```bash
./test-scan-feature.sh
```

### 手动测试步骤

#### 场景1：正常扫码流程
```bash
# 1. 创建用户1
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"USER1","nickname":"张三"}'

# 2. 创建用户2
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"USER2","nickname":"李四"}'

# 3. 用户2扫描用户1（应该成功）
curl -X POST http://localhost:3000/api/v1/scan/qrcode \
  -H "Content-Type: application/json" \
  -d '{"scannerDeviceId":"USER2","scannedDeviceId":"USER1"}'

# 4. 查看用户1的使用次数（应该是10）
curl http://localhost:3000/api/v1/users/USER1
```

#### 场景2：防止互刷
```bash
# 用户1尝试扫描用户2（应该失败）
curl -X POST http://localhost:3000/api/v1/scan/qrcode \
  -H "Content-Type: application/json" \
  -d '{"scannerDeviceId":"USER1","scannedDeviceId":"USER2"}'

# 返回："对方已经扫描过您了，您无法再扫描对方"
```

#### 场景3：重复扫描
```bash
# 用户2再次扫描用户1（应该失败）
curl -X POST http://localhost:3000/api/v1/scan/qrcode \
  -H "Content-Type: application/json" \
  -d '{"scannerDeviceId":"USER2","scannedDeviceId":"USER1"}'

# 返回："您已经扫描过该用户了，无法重复扫描"
```

#### 场景4：清空使用次数
```bash
# 查看用户1当前使用次数
curl http://localhost:3000/api/v1/users/USER1

# 清空用户1的使用次数
curl -X POST http://localhost:3000/api/v1/users/USER1/reset-usage

# 再次查看（应该为0）
curl http://localhost:3000/api/v1/users/USER1
```

## 在 TablePlus 中查看数据

### 查看用户表
```sql
SELECT id, device_id, nickname, usage_count, created_at 
FROM users 
ORDER BY id;
```

### 查看扫码记录
```sql
SELECT 
  sr.id,
  u1.nickname AS scanner_nickname,
  u2.nickname AS scanned_nickname,
  sr.added_count,
  sr.created_at
FROM scan_records sr
JOIN users u1 ON sr.scanner_id = u1.id
JOIN users u2 ON sr.scanned_id = u2.id
ORDER BY sr.created_at DESC;
```

### 查看用户的收益统计
```sql
SELECT 
  u.device_id,
  u.nickname,
  u.usage_count AS total_usage,
  COUNT(sr.id) AS times_scanned,
  SUM(sr.added_count) AS total_added
FROM users u
LEFT JOIN scan_records sr ON u.id = sr.scanned_id
GROUP BY u.id, u.device_id, u.nickname, u.usage_count
ORDER BY u.usage_count DESC;
```

## 错误码说明

| HTTP状态码 | 业务码 | 说明 |
|-----------|--------|------|
| 200 | 200 | 成功 |
| 200 | 200 | 扫码失败（业务逻辑限制），data.success = false |
| 400 | - | 请求参数错误 |
| 404 | - | 用户不存在 |
| 500 | - | 服务器错误 |

## 性能优化建议

1. **索引**: 已在 `scan_records` 表的 `(scanner_id, scanned_id)` 上创建索引
2. **缓存**: 可以考虑缓存用户信息减少数据库查询
3. **异步**: 扫码记录创建可以异步处理
4. **分页**: 扫描历史接口建议添加分页

## 安全建议

1. **设备ID验证**: 应该验证设备ID的合法性和唯一性
2. **频率限制**: 添加扫码频率限制防止刷单
3. **签名验证**: 二维码应该包含签名防止伪造
4. **用户认证**: 生产环境应该添加用户认证机制

## 扩展功能建议

1. **扫码次数限制**: 每天/每周扫码次数上限
2. **动态奖励**: 不同用户等级给予不同的次数奖励
3. **扫码排行榜**: 统计谁被扫描最多
4. **好友系统**: 只允许扫描好友的二维码
5. **二维码过期**: 二维码定时刷新防止截图传播

## 常见问题 FAQ

### Q: 如何生成二维码？
A: 二维码内容就是用户的 `deviceId`，前端可以使用 `qrcode.js` 等库生成。

### Q: 设备ID如何获取？
A: 移动端可以使用设备的唯一标识符（UUID、IMEI等），或应用生成的唯一ID。

### Q: 如何防止截图扫码？
A: 可以在二维码中添加时间戳和签名，服务端验证有效期。

### Q: 如果要解除互扫限制怎么办？
A: 删除对应的扫描记录即可，或添加管理接口允许重置。

## 联系支持

如有问题，请查看：
- 主文档: QUICK_START.md
- 数据库文档: DATABASE_SETUP.md
- 部署文档: DEPLOYMENT.md
