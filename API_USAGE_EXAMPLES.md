# 🔥 API 使用示例大全

## 基础 URL
```
http://localhost:3000/api/v1
```

## 用户管理 API

### 📝 创建用户

```bash
# 创建用户1
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "DEVICE_12345",
    "nickname": "张三"
  }'

# 响应
{
  "code": 200,
  "message": "用户创建成功",
  "data": {
    "id": 1,
    "deviceId": "DEVICE_12345",
    "nickname": "张三",
    "usageCount": 0,
    "createdAt": "2025-09-30T07:19:52.454Z",
    "updatedAt": "2025-09-30T07:19:52.454Z"
  },
  "timestamp": 1759216792
}
```

### 🔍 查询用户信息

```bash
# 通过设备ID查询
curl http://localhost:3000/api/v1/users/DEVICE_12345

# 响应
{
  "code": 200,
  "message": "OK",
  "data": {
    "id": 1,
    "deviceId": "DEVICE_12345",
    "nickname": "张三",
    "usageCount": 10,
    ...
  },
  "timestamp": 1759216792
}
```

### 📋 获取所有用户

```bash
curl http://localhost:3000/api/v1/users

# 响应
{
  "code": 200,
  "message": "OK",
  "data": [
    {
      "id": 1,
      "deviceId": "DEVICE_12345",
      "nickname": "张三",
      "usageCount": 10,
      ...
    },
    {
      "id": 2,
      "deviceId": "DEVICE_67890",
      "nickname": "李四",
      "usageCount": 5,
      ...
    }
  ],
  "timestamp": 1759216792
}
```

### ✏️ 更新用户信息

```bash
curl -X PUT http://localhost:3000/api/v1/users/DEVICE_12345 \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "张三丰"
  }'

# 响应
{
  "code": 200,
  "message": "用户信息更新成功",
  "data": {
    "id": 1,
    "deviceId": "DEVICE_12345",
    "nickname": "张三丰",
    "usageCount": 10,
    ...
  },
  "timestamp": 1759216792
}
```

### 🔄 清空使用次数

```bash
curl -X POST http://localhost:3000/api/v1/users/DEVICE_12345/reset-usage

# 响应
{
  "code": 200,
  "message": "使用次数已清空",
  "data": {
    "id": 1,
    "deviceId": "DEVICE_12345",
    "nickname": "张三",
    "usageCount": 0,
    ...
  },
  "timestamp": 1759218845
}
```

## 扫码功能 API

### 📷 扫描二维码

```bash
# 用户2扫描用户1的二维码
curl -X POST http://localhost:3000/api/v1/scan/qrcode \
  -H "Content-Type: application/json" \
  -d '{
    "scannerDeviceId": "DEVICE_67890",
    "scannedDeviceId": "DEVICE_12345"
  }'

# 响应（成功）
{
  "code": 200,
  "message": "扫码成功！张三 的使用次数增加了 10 次",
  "data": {
    "success": true,
    "message": "扫码成功！张三 的使用次数增加了 10 次",
    "addedCount": 10,
    "scannerUsageCount": 0,
    "scannedUsageCount": 10,
    "scannerId": 2,
    "scannedId": 1
  },
  "timestamp": 1759216792
}

# 响应（失败 - 重复扫描）
{
  "code": 200,
  "message": "您已经扫描过该用户了，无法重复扫描",
  "data": {
    "success": false,
    ...
  }
}

# 响应（失败 - 对方已扫描过您）
{
  "code": 200,
  "message": "对方已经扫描过您了，您无法再扫描对方",
  "data": {
    "success": false,
    ...
  }
}
```

### 📖 查看扫描历史（我扫描了谁）

```bash
curl http://localhost:3000/api/v1/scan/history/DEVICE_67890

# 响应
{
  "code": 200,
  "message": "OK",
  "data": [
    {
      "id": 1,
      "scannerId": 2,
      "scannedId": 1,
      "scannerNickname": "李四",
      "scannedNickname": "张三",
      "addedCount": 10,
      "createdAt": "2025-09-30T07:19:52.489Z"
    }
  ],
  "timestamp": 1759216792
}
```

### 📬 查看收到的扫描（谁扫描了我）

```bash
curl http://localhost:3000/api/v1/scan/received/DEVICE_12345

# 响应
{
  "code": 200,
  "message": "OK",
  "data": [
    {
      "id": 1,
      "scannerId": 2,
      "scannedId": 1,
      "scannerNickname": "李四",
      "scannedNickname": "张三",
      "addedCount": 10,
      "createdAt": "2025-09-30T07:19:52.489Z"
    }
  ],
  "timestamp": 1759216792
}
```

### 🔗 检查互扫状态

```bash
curl "http://localhost:3000/api/v1/scan/check?deviceId1=DEVICE_12345&deviceId2=DEVICE_67890"

# 响应
{
  "code": 200,
  "message": "OK",
  "data": {
    "user1": {
      "deviceId": "DEVICE_12345",
      "nickname": "张三",
      "hasScannedUser2": false
    },
    "user2": {
      "deviceId": "DEVICE_67890",
      "nickname": "李四",
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

## 完整业务场景示例

### 场景1：新用户首次使用

```bash
# 步骤1: 创建用户
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"NEW_USER_001","nickname":"新用户"}'

# 步骤2: 查看用户信息
curl http://localhost:3000/api/v1/users/NEW_USER_001
# usageCount 应该为 0
```

### 场景2：互相扫码流程

```bash
# 1. 创建两个用户
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"USER_A","nickname":"用户A"}'

curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"USER_B","nickname":"用户B"}'

# 2. 用户B扫描用户A（✅ 成功）
curl -X POST http://localhost:3000/api/v1/scan/qrcode \
  -H "Content-Type: application/json" \
  -d '{"scannerDeviceId":"USER_B","scannedDeviceId":"USER_A"}'
# 用户A次数: 0 → 10

# 3. 用户A尝试扫描用户B（❌ 失败）
curl -X POST http://localhost:3000/api/v1/scan/qrcode \
  -H "Content-Type: application/json" \
  -d '{"scannerDeviceId":"USER_A","scannedDeviceId":"USER_B"}'
# 返回: "对方已经扫描过您了，您无法再扫描对方"

# 4. 用户B再次扫描用户A（❌ 失败）
curl -X POST http://localhost:3000/api/v1/scan/qrcode \
  -H "Content-Type: application/json" \
  -d '{"scannerDeviceId":"USER_B","scannedDeviceId":"USER_A"}'
# 返回: "您已经扫描过该用户了，无法重复扫描"
```

### 场景3：多人扫码

```bash
# 创建三个用户
for user in USER_1 USER_2 USER_3; do
  curl -X POST http://localhost:3000/api/v1/users \
    -H "Content-Type: application/json" \
    -d "{\"deviceId\":\"$user\",\"nickname\":\"$user\"}"
done

# USER_2 扫描 USER_1（✅ 成功，USER_1 +10）
curl -X POST http://localhost:3000/api/v1/scan/qrcode \
  -H "Content-Type: application/json" \
  -d '{"scannerDeviceId":"USER_2","scannedDeviceId":"USER_1"}'

# USER_3 扫描 USER_1（✅ 成功，USER_1 +10，总共20）
curl -X POST http://localhost:3000/api/v1/scan/qrcode \
  -H "Content-Type: application/json" \
  -d '{"scannerDeviceId":"USER_3","scannedDeviceId":"USER_1"}'

# 查看 USER_1 的信息
curl http://localhost:3000/api/v1/users/USER_1
# usageCount 应该为 20

# 查看 USER_1 收到的扫描
curl http://localhost:3000/api/v1/scan/received/USER_1
# 应该有 2 条记录
```

### 场景4：清空次数后重新扫描

```bash
# 1. 查看当前次数
curl http://localhost:3000/api/v1/users/USER_A

# 2. 清空使用次数
curl -X POST http://localhost:3000/api/v1/users/USER_A/reset-usage
# usageCount: 10 → 0

# 3. 注意：清空次数不会清除扫描记录
# 用户B仍然无法再次扫描用户A
curl -X POST http://localhost:3000/api/v1/scan/qrcode \
  -H "Content-Type: application/json" \
  -d '{"scannerDeviceId":"USER_B","scannedDeviceId":"USER_A"}'
# 返回: "您已经扫描过该用户了，无法重复扫描"

# 4. 但用户C可以扫描用户A（因为C之前没扫描过A）
curl -X POST http://localhost:3000/api/v1/scan/qrcode \
  -H "Content-Type: application/json" \
  -d '{"scannerDeviceId":"USER_C","scannedDeviceId":"USER_A"}'
# ✅ 成功，用户A次数: 0 → 10
```

## 使用 jq 格式化输出

```bash
# 只显示关键信息
curl -s http://localhost:3000/api/v1/users/DEVICE_12345 | jq '{
  deviceId: .data.deviceId,
  nickname: .data.nickname,
  usageCount: .data.usageCount
}'

# 输出
{
  "deviceId": "DEVICE_12345",
  "nickname": "张三",
  "usageCount": 10
}

# 显示扫描历史的关键信息
curl -s http://localhost:3000/api/v1/scan/history/DEVICE_67890 | jq '.data[] | {
  scanner: .scannerNickname,
  scanned: .scannedNickname,
  added: .addedCount,
  time: .createdAt
}'
```

## 批量操作示例

### 批量创建用户

```bash
#!/bin/bash
for i in {1..5}; do
  curl -X POST http://localhost:3000/api/v1/users \
    -H "Content-Type: application/json" \
    -d "{\"deviceId\":\"DEVICE_$i\",\"nickname\":\"用户$i\"}"
  echo ""
done
```

### 批量查询

```bash
#!/bin/bash
for device in DEVICE_1 DEVICE_2 DEVICE_3; do
  echo "查询 $device:"
  curl -s http://localhost:3000/api/v1/users/$device | jq '.data.usageCount'
done
```

## 错误处理

### 用户不存在

```bash
curl http://localhost:3000/api/v1/users/NOT_EXISTS

# 响应
{
  "statusCode": 404,
  "message": "设备ID NOT_EXISTS 不存在",
  "error": "Not Found"
}
```

### 扫描自己

```bash
curl -X POST http://localhost:3000/api/v1/scan/qrcode \
  -H "Content-Type: application/json" \
  -d '{"scannerDeviceId":"USER_A","scannedDeviceId":"USER_A"}'

# 响应
{
  "statusCode": 400,
  "message": "不能扫描自己的二维码",
  "error": "Bad Request"
}
```

## 测试脚本

项目提供了完整的测试脚本：

```bash
# 测试扫码功能
./test-scan-feature.sh

# 测试清空使用次数
./test-reset-usage.sh
```

## Postman Collection

您可以将以下 JSON 导入 Postman：

```json
{
  "info": {
    "name": "扫码功能 API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "用户管理",
      "item": [
        {
          "name": "创建用户",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\"deviceId\":\"{{deviceId}}\",\"nickname\":\"{{nickname}}\"}"
            },
            "url": "{{baseUrl}}/users"
          }
        },
        {
          "name": "获取用户信息",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/users/{{deviceId}}"
          }
        },
        {
          "name": "清空使用次数",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/users/{{deviceId}}/reset-usage"
          }
        }
      ]
    },
    {
      "name": "扫码功能",
      "item": [
        {
          "name": "扫描二维码",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\"scannerDeviceId\":\"{{scannerDeviceId}}\",\"scannedDeviceId\":\"{{scannedDeviceId}}\"}"
            },
            "url": "{{baseUrl}}/scan/qrcode"
          }
        },
        {
          "name": "扫描历史",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/scan/history/{{deviceId}}"
          }
        }
      ]
    }
  ],
  "variable": [
    {"key": "baseUrl", "value": "http://localhost:3000/api/v1"}
  ]
}
```

## 相关文档

- **SCAN_API_DOCUMENTATION.md** - 完整API文档
- **QUICK_START.md** - 快速开始
- **DATABASE_SETUP.md** - 数据库配置

## 技术支持

如有问题，请参考项目文档或提交 Issue。
