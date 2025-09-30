#!/bin/bash

echo "🧪 测试扫码功能"
echo "================================"
echo ""

BASE_URL="http://localhost:3000"

echo "📝 场景说明："
echo "- 用户1 设备ID: DEVICE_USER1"
echo "- 用户2 设备ID: DEVICE_USER2"
echo ""

echo "1️⃣  创建/获取用户1..."
curl -s -X POST $BASE_URL/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"DEVICE_USER1","nickname":"用户1"}' | jq '.'
echo ""

echo "2️⃣  创建/获取用户2..."
curl -s -X POST $BASE_URL/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"DEVICE_USER2","nickname":"用户2"}' | jq '.'
echo ""

echo "3️⃣  用户2 扫描 用户1 的二维码（第一次，应该成功，用户1次数+10）..."
curl -s -X POST $BASE_URL/api/v1/scan/qrcode \
  -H "Content-Type: application/json" \
  -d '{"scannerDeviceId":"DEVICE_USER2","scannedDeviceId":"DEVICE_USER1"}' | jq '.'
echo ""

echo "4️⃣  查看用户1的使用次数..."
curl -s $BASE_URL/api/v1/users/DEVICE_USER1 | jq '.data.usageCount'
echo ""

echo "5️⃣  用户1 扫描 用户2 的二维码（应该提示已互相扫描，无法增加）..."
curl -s -X POST $BASE_URL/api/v1/scan/qrcode \
  -H "Content-Type: application/json" \
  -d '{"scannerDeviceId":"DEVICE_USER1","scannedDeviceId":"DEVICE_USER2"}' | jq '.'
echo ""

echo "6️⃣  查看用户2的使用次数（应该还是0）..."
curl -s $BASE_URL/api/v1/users/DEVICE_USER2 | jq '.data.usageCount'
echo ""

echo "7️⃣  检查两个用户之间的扫描关系..."
curl -s "$BASE_URL/api/v1/scan/check?deviceId1=DEVICE_USER1&deviceId2=DEVICE_USER2" | jq '.'
echo ""

echo "8️⃣  查看用户2的扫描历史..."
curl -s $BASE_URL/api/v1/scan/history/DEVICE_USER2 | jq '.'
echo ""

echo "9️⃣  查看用户1收到的扫描记录..."
curl -s $BASE_URL/api/v1/scan/received/DEVICE_USER1 | jq '.'
echo ""

echo "✅ 测试完成！"
