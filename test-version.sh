#!/bin/bash

echo "🧪 测试版本更新检测功能"
echo "================================"
echo ""

BASE_URL="http://localhost:3000/api/v1"

echo "1️⃣  创建 Android 版本 1.0.0..."
curl -s -X POST $BASE_URL/version \
  -H "Content-Type: application/json" \
  -d '{
    "version": "1.0.0",
    "platform": "android",
    "updateContent": "1. 首次发布\n2. 基础功能上线",
    "downloadUrl": "https://example.com/app-1.0.0.apk",
    "forceUpdate": false
  }' | jq '.'
echo ""

echo "2️⃣  创建 Android 版本 1.2.0..."
curl -s -X POST $BASE_URL/version \
  -H "Content-Type: application/json" \
  -d '{
    "version": "1.2.0",
    "platform": "android",
    "updateContent": "1. 新增扫码功能\n2. 优化用户体验\n3. 修复已知问题",
    "downloadUrl": "https://example.com/app-1.2.0.apk",
    "forceUpdate": false
  }' | jq '.'
echo ""

echo "3️⃣  创建 Android 版本 2.0.0 (强制更新)..."
curl -s -X POST $BASE_URL/version \
  -H "Content-Type: application/json" \
  -d '{
    "version": "2.0.0",
    "platform": "android",
    "updateContent": "1. 全新UI设计\n2. 性能大幅提升\n3. 安全性增强\n⚠️ 此版本必须更新",
    "downloadUrl": "https://example.com/app-2.0.0.apk",
    "forceUpdate": true
  }' | jq '.'
echo ""

echo "4️⃣  创建 iOS 版本 1.0.0..."
curl -s -X POST $BASE_URL/version \
  -H "Content-Type: application/json" \
  -d '{
    "version": "1.0.0",
    "platform": "ios",
    "updateContent": "iOS首次发布",
    "downloadUrl": "https://apps.apple.com/app/id123456",
    "forceUpdate": false
  }' | jq '.'
echo ""

echo "5️⃣  用户使用 1.0.0 版本检查更新（Android）..."
curl -s "$BASE_URL/version/check?currentVersion=1.0.0&platform=android" | jq '.'
echo ""

echo "6️⃣  用户使用 1.5.0 版本检查更新（Android）..."
curl -s "$BASE_URL/version/check?currentVersion=1.5.0&platform=android" | jq '.'
echo ""

echo "7️⃣  用户使用 2.0.0 版本检查更新（Android，已是最新）..."
curl -s "$BASE_URL/version/check?currentVersion=2.0.0&platform=android" | jq '.'
echo ""

echo "8️⃣  获取 Android 平台的最新版本..."
curl -s $BASE_URL/version/latest/android | jq '.'
echo ""

echo "9️⃣  获取所有 Android 版本..."
curl -s "$BASE_URL/version?platform=android" | jq '.data | map({version, forceUpdate, versionCode})'
echo ""

echo "🔟  获取所有平台的版本..."
curl -s $BASE_URL/version | jq '.data | length'
echo " 个版本"
echo ""

echo "✅ 测试完成！"
echo ""
echo "📝 版本号比较规则："
echo "- 1.0.0 = 10000"
echo "- 1.2.0 = 10200"
echo "- 2.0.0 = 20000"
