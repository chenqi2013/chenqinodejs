# 📱 版本更新检测 API 文档

## 概述

这是一个完整的APP版本管理系统，支持Android和iOS双平台的版本更新检测、版本发布和强制更新功能。

## 核心功能

- ✅ 版本更新检测
- ✅ 双平台支持（Android / iOS）
- ✅ 强制更新标识
- ✅ 版本号智能比较
- ✅ 版本管理（CRUD）
- ✅ 更新内容描述
- ✅ 下载链接管理

## 数据表设计

### app_versions 表

```sql
CREATE TABLE app_versions (
  id SERIAL PRIMARY KEY,
  version VARCHAR(20) NOT NULL COMMENT '版本号，如 1.0.0',
  platform VARCHAR(20) NOT NULL COMMENT '平台: android 或 ios',
  update_content TEXT NOT NULL COMMENT '更新内容描述',
  download_url VARCHAR(500) NOT NULL COMMENT '下载URL',
  force_update BOOLEAN DEFAULT false COMMENT '是否强制更新',
  version_code INT DEFAULT 0 COMMENT '版本号数值，用于比较',
  is_active BOOLEAN DEFAULT true COMMENT '是否启用',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(version, platform)
);

CREATE INDEX idx_version_platform ON app_versions(platform, version_code DESC);
```

## 版本号规则

### 版本号格式
版本号采用 **x.y.z** 格式，例如：`1.0.0`, `2.3.5`

### 版本号转换规则
为了便于比较，版本号会转换为数字：

```
1.0.0  → 10000  (1 * 10000 + 0 * 100 + 0)
1.2.0  → 10200  (1 * 10000 + 2 * 100 + 0)
1.2.3  → 10203  (1 * 10000 + 2 * 100 + 3)
2.0.0  → 20000  (2 * 10000 + 0 * 100 + 0)
```

### 限制
- 每部分不能超过 99
- 必须是三段式版本号

## API 接口

### 基础 URL
```
http://localhost:3000/api/v1/version
```

## 版本检测接口

### 1. 检查版本更新 ⭐️

**接口**: `GET /version/check`

**描述**: 客户端检查是否有新版本可用

**查询参数**:
- `currentVersion` (string, 必需): 当前版本号，如 "1.0.0"
- `platform` (string, 必需): 平台，"android" 或 "ios"

**请求示例**:
```bash
curl "http://localhost:3000/api/v1/version/check?currentVersion=1.0.0&platform=android"
```

**响应（有更新）**:
```json
{
  "code": 200,
  "message": "发现新版本",
  "data": {
    "hasUpdate": true,
    "latestVersion": "2.0.0",
    "currentVersion": "1.0.0",
    "updateContent": "1. 全新UI设计\n2. 性能大幅提升\n3. 安全性增强",
    "downloadUrl": "https://example.com/app-2.0.0.apk",
    "forceUpdate": true,
    "versionCode": 20000
  },
  "timestamp": 1759220099
}
```

**响应（已是最新）**:
```json
{
  "code": 200,
  "message": "已是最新版本",
  "data": {
    "hasUpdate": false,
    "latestVersion": "2.0.0",
    "currentVersion": "2.0.0",
    "updateContent": "...",
    "downloadUrl": "...",
    "forceUpdate": true,
    "versionCode": 20000
  },
  "timestamp": 1759220099
}
```

**响应（暂无版本信息）**:
```json
{
  "code": 200,
  "message": "暂无版本信息",
  "data": {
    "hasUpdate": false,
    "latestVersion": "1.0.0",
    "currentVersion": "1.0.0",
    "updateContent": "",
    "downloadUrl": "",
    "forceUpdate": false,
    "versionCode": 10000
  },
  "timestamp": 1759220099
}
```

## 版本管理接口

### 2. 创建新版本

**接口**: `POST /version`

**描述**: 发布新版本

**请求体**:
```json
{
  "version": "2.0.0",
  "platform": "android",
  "updateContent": "1. 全新UI设计\n2. 性能大幅提升\n3. 安全性增强",
  "downloadUrl": "https://example.com/app-2.0.0.apk",
  "forceUpdate": true
}
```

**响应**:
```json
{
  "code": 201,
  "message": "版本创建成功",
  "data": {
    "id": 1,
    "version": "2.0.0",
    "platform": "android",
    "updateContent": "1. 全新UI设计\n2. 性能大幅提升\n3. 安全性增强",
    "downloadUrl": "https://example.com/app-2.0.0.apk",
    "forceUpdate": true,
    "versionCode": 20000,
    "createdAt": "2025-09-30T08:14:59.600Z"
  },
  "timestamp": 1759220099
}
```

### 3. 获取所有版本

**接口**: `GET /version`

**查询参数**:
- `platform` (string, 可选): 筛选平台，"android" 或 "ios"

**请求示例**:
```bash
# 获取所有版本
curl http://localhost:3000/api/v1/version

# 获取 Android 版本
curl "http://localhost:3000/api/v1/version?platform=android"
```

**响应**:
```json
{
  "code": 200,
  "message": "OK",
  "data": [
    {
      "id": 3,
      "version": "2.0.0",
      "platform": "android",
      "updateContent": "...",
      "downloadUrl": "...",
      "forceUpdate": true,
      "versionCode": 20000,
      "createdAt": "2025-09-30T08:14:59.600Z"
    },
    {
      "id": 2,
      "version": "1.2.0",
      "platform": "android",
      "updateContent": "...",
      "downloadUrl": "...",
      "forceUpdate": false,
      "versionCode": 10200,
      "createdAt": "2025-09-30T08:14:59.587Z"
    }
  ],
  "timestamp": 1759220099
}
```

### 4. 获取最新版本

**接口**: `GET /version/latest/:platform`

**路径参数**:
- `platform` (string): "android" 或 "ios"

**请求示例**:
```bash
curl http://localhost:3000/api/v1/version/latest/android
```

**响应**:
```json
{
  "code": 200,
  "message": "OK",
  "data": {
    "id": 3,
    "version": "2.0.0",
    "platform": "android",
    "updateContent": "...",
    "downloadUrl": "...",
    "forceUpdate": true,
    "versionCode": 20000,
    "createdAt": "2025-09-30T08:14:59.600Z"
  },
  "timestamp": 1759220099
}
```

### 5. 更新版本信息

**接口**: `PUT /version/:id`

**路径参数**:
- `id` (number): 版本ID

**请求体**:
```json
{
  "updateContent": "更新后的内容描述",
  "forceUpdate": true
}
```

**响应**:
```json
{
  "code": 200,
  "message": "版本更新成功",
  "data": {
    "id": 1,
    "version": "2.0.0",
    "platform": "android",
    "updateContent": "更新后的内容描述",
    "downloadUrl": "...",
    "forceUpdate": true,
    "versionCode": 20000,
    "createdAt": "2025-09-30T08:14:59.600Z"
  },
  "timestamp": 1759220099
}
```

### 6. 删除版本（软删除）

**接口**: `DELETE /version/:id`

**路径参数**:
- `id` (number): 版本ID

**请求示例**:
```bash
curl -X DELETE http://localhost:3000/api/v1/version/1
```

**响应**:
```json
{
  "code": 200,
  "message": "版本删除成功",
  "data": null,
  "timestamp": 1759220099
}
```

## 使用场景

### 场景1：APP启动时检查更新

```javascript
// 客户端代码示例
async function checkAppUpdate() {
  const currentVersion = "1.0.0";
  const platform = "android"; // 或 "ios"
  
  const response = await fetch(
    `https://api.example.com/api/v1/version/check?currentVersion=${currentVersion}&platform=${platform}`
  );
  
  const result = await response.json();
  
  if (result.data.hasUpdate) {
    if (result.data.forceUpdate) {
      // 强制更新：必须更新才能继续使用
      showForceUpdateDialog({
        version: result.data.latestVersion,
        content: result.data.updateContent,
        downloadUrl: result.data.downloadUrl
      });
    } else {
      // 可选更新：用户可以选择稍后更新
      showOptionalUpdateDialog({
        version: result.data.latestVersion,
        content: result.data.updateContent,
        downloadUrl: result.data.downloadUrl
      });
    }
  }
}
```

### 场景2：发布新版本

```bash
# 1. 发布 Android 新版本
curl -X POST http://localhost:3000/api/v1/version \
  -H "Content-Type: application/json" \
  -d '{
    "version": "2.1.0",
    "platform": "android",
    "updateContent": "1. 新增视频通话功能\n2. 优化电池续航\n3. 修复已知Bug",
    "downloadUrl": "https://cdn.example.com/app-2.1.0.apk",
    "forceUpdate": false
  }'

# 2. 发布 iOS 新版本
curl -X POST http://localhost:3000/api/v1/version \
  -H "Content-Type: application/json" \
  -d '{
    "version": "2.1.0",
    "platform": "ios",
    "updateContent": "1. 新增视频通话功能\n2. 优化电池续航\n3. 修复已知Bug",
    "downloadUrl": "https://apps.apple.com/app/id123456",
    "forceUpdate": false
  }'
```

### 场景3：紧急发布强制更新

```bash
# 发现严重安全漏洞，发布强制更新版本
curl -X POST http://localhost:3000/api/v1/version \
  -H "Content-Type: application/json" \
  -d '{
    "version": "2.1.1",
    "platform": "android",
    "updateContent": "⚠️ 紧急安全更新\n修复严重安全漏洞，请立即更新",
    "downloadUrl": "https://cdn.example.com/app-2.1.1.apk",
    "forceUpdate": true
  }'
```

### 场景4：灰度发布

```bash
# 先发布不强制更新的版本，观察稳定性
curl -X POST http://localhost:3000/api/v1/version \
  -H "Content-Type: application/json" \
  -d '{
    "version": "3.0.0",
    "platform": "android",
    "updateContent": "全新3.0版本，欢迎体验",
    "downloadUrl": "https://cdn.example.com/app-3.0.0.apk",
    "forceUpdate": false
  }'

# 确认稳定后，修改为强制更新
curl -X PUT http://localhost:3000/api/v1/version/5 \
  -H "Content-Type: application/json" \
  -d '{
    "forceUpdate": true
  }'
```

## 客户端集成示例

### Android (Kotlin)

```kotlin
data class VersionCheckResponse(
    val code: Int,
    val message: String,
    val data: VersionData,
    val timestamp: Long
)

data class VersionData(
    val hasUpdate: Boolean,
    val latestVersion: String,
    val currentVersion: String,
    val updateContent: String,
    val downloadUrl: String,
    val forceUpdate: Boolean,
    val versionCode: Int
)

class VersionManager {
    suspend fun checkUpdate(): VersionData {
        val currentVersion = BuildConfig.VERSION_NAME
        val url = "https://api.example.com/api/v1/version/check" +
                  "?currentVersion=$currentVersion&platform=android"
        
        val response = httpClient.get(url)
        val result = response.body<VersionCheckResponse>()
        
        return result.data
    }
    
    fun handleUpdate(versionData: VersionData) {
        if (!versionData.hasUpdate) return
        
        if (versionData.forceUpdate) {
            // 显示强制更新对话框
            showForceUpdateDialog(versionData)
        } else {
            // 显示可选更新对话框
            showOptionalUpdateDialog(versionData)
        }
    }
}
```

### iOS (Swift)

```swift
struct VersionCheckResponse: Codable {
    let code: Int
    let message: String
    let data: VersionData
    let timestamp: Int64
}

struct VersionData: Codable {
    let hasUpdate: Bool
    let latestVersion: String
    let currentVersion: String
    let updateContent: String
    let downloadUrl: String
    let forceUpdate: Bool
    let versionCode: Int
}

class VersionManager {
    func checkUpdate() async throws -> VersionData {
        let currentVersion = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0.0"
        let urlString = "https://api.example.com/api/v1/version/check?currentVersion=\(currentVersion)&platform=ios"
        
        let url = URL(string: urlString)!
        let (data, _) = try await URLSession.shared.data(from: url)
        let response = try JSONDecoder().decode(VersionCheckResponse.self, from: data)
        
        return response.data
    }
    
    func handleUpdate(_ versionData: VersionData) {
        guard versionData.hasUpdate else { return }
        
        if versionData.forceUpdate {
            // 显示强制更新对话框
            showForceUpdateAlert(versionData)
        } else {
            // 显示可选更新对话框
            showOptionalUpdateAlert(versionData)
        }
    }
}
```

## 数据库查询示例

### 查看所有版本

```sql
SELECT 
  id,
  version,
  platform,
  version_code,
  force_update,
  created_at
FROM app_versions
WHERE is_active = true
ORDER BY platform, version_code DESC;
```

### 查看各平台最新版本

```sql
SELECT DISTINCT ON (platform)
  platform,
  version,
  version_code,
  force_update,
  created_at
FROM app_versions
WHERE is_active = true
ORDER BY platform, version_code DESC;
```

### 统计版本信息

```sql
SELECT 
  platform,
  COUNT(*) as total_versions,
  MAX(version) as latest_version,
  SUM(CASE WHEN force_update THEN 1 ELSE 0 END) as force_update_count
FROM app_versions
WHERE is_active = true
GROUP BY platform;
```

## 错误码说明

| HTTP状态码 | 业务码 | 说明 |
|-----------|--------|------|
| 200 | 200 | 成功 |
| 201 | 201 | 创建成功 |
| 400 | - | 请求参数错误 |
| 400 | - | 版本号格式错误 |
| 400 | - | 平台参数错误 |
| 400 | - | 版本已存在 |
| 404 | - | 版本不存在 |
| 500 | - | 服务器错误 |

## 最佳实践

### 1. 版本号管理
- 使用语义化版本号：主版本.次版本.修订号
- 主版本：不兼容的API修改
- 次版本：向下兼容的功能性新增
- 修订号：向下兼容的问题修正

### 2. 强制更新策略
- 安全漏洞：立即强制更新
- 重大Bug：强制更新
- 新功能：可选更新
- 性能优化：可选更新

### 3. 更新内容描述
- 清晰列出主要更新点
- 使用数字编号
- 重要内容使用特殊标记（⚠️、✨、🐛）
- 控制在3-5条以内

### 4. 下载链接
- Android：提供APK直接下载链接或应用商店链接
- iOS：提供App Store链接
- 使用CDN加速下载
- 确保链接长期有效

### 5. 测试建议
- 测试不同版本号的比较逻辑
- 测试强制更新和可选更新流程
- 测试网络异常情况
- 测试下载链接的可用性

## 安全建议

1. **下载安全**
   - 使用HTTPS
   - APK签名验证
   - 下载完整性校验

2. **接口安全**
   - 版本管理接口需要管理员权限
   - 版本检查接口可以公开访问
   - 添加频率限制

3. **版本验证**
   - 客户端验证版本号格式
   - 服务端二次验证
   - 防止版本号注入攻击

## 测试脚本

运行完整测试：
```bash
./test-version.sh
```

## 相关文档

- **QUICK_START.md** - 快速开始指南
- **SCAN_API_DOCUMENTATION.md** - 扫码功能文档
- **DATABASE_SETUP.md** - 数据库配置

## 常见问题

### Q: 如何处理用户拒绝强制更新？
A: 强制更新应该阻止用户继续使用APP，直到更新完成。可以提供"稍后"按钮，但再次打开APP时仍然要求更新。

### Q: iOS如何实现强制更新？
A: iOS无法直接下载安装，需要引导用户跳转到App Store。可以在检测到强制更新时，显示对话框并提供"去更新"按钮跳转App Store。

### Q: 版本号支持四段式吗（如1.0.0.1）？
A: 当前只支持三段式。如需支持四段式，需要修改 `versionToCode` 方法。

### Q: 如何实现灰度发布？
A: 可以创建多个版本，通过其他参数（如用户ID、地区）控制返回哪个版本，或使用百分比随机返回。

## 联系支持

如有问题，请查看项目文档或提交 Issue。
