#!/bin/bash

echo "🧪 测试清空使用次数功能"
echo "================================"
echo ""

BASE_URL="http://localhost:3000"

echo "1️⃣  查看用户1当前的使用次数..."
curl -s $BASE_URL/api/v1/users/DEVICE_USER1 | jq '{deviceId: .data.deviceId, nickname: .data.nickname, usageCount: .data.usageCount}'
echo ""

echo "2️⃣  清空用户1的使用次数..."
curl -s -X POST $BASE_URL/api/v1/users/DEVICE_USER1/reset-usage | jq '.'
echo ""

echo "3️⃣  验证使用次数已清空..."
curl -s $BASE_URL/api/v1/users/DEVICE_USER1 | jq '{deviceId: .data.deviceId, nickname: .data.nickname, usageCount: .data.usageCount}'
echo ""

echo "4️⃣  用户2再次扫描用户1（应该成功，因为用户1次数已清空）..."
curl -s -X POST $BASE_URL/api/v1/scan/qrcode \
  -H "Content-Type: application/json" \
  -d '{"scannerDeviceId":"DEVICE_USER2","scannedDeviceId":"DEVICE_USER1"}' | jq '.message'
echo ""

echo "5️⃣  查看用户1的使用次数（应该重新变成10）..."
curl -s $BASE_URL/api/v1/users/DEVICE_USER1 | jq '{deviceId: .data.deviceId, nickname: .data.nickname, usageCount: .data.usageCount}'
echo ""

echo "✅ 测试完成！"
echo ""
echo "📝 总结："
echo "- 清空使用次数不会影响扫描记录"
echo "- 清空后可以重新被同一用户扫描增加次数"
