#!/bin/bash

# 数据库可视化工具启动脚本

echo "🎨 数据库可视化工具"
echo "===================="
echo ""
echo "选择要打开的工具："
echo ""
echo "1) TablePlus（推荐）"
echo "2) pgAdmin 4"
echo "3) Postico"
echo "4) DBeaver"
echo "5) 显示连接信息"
echo ""
read -p "请选择 (1-5): " choice

case $choice in
    1)
        echo "📱 正在打开 TablePlus..."
        if [ -d "/Applications/TablePlus.app" ]; then
            open -a TablePlus
            echo ""
            echo "✅ TablePlus 已打开！"
            echo ""
            echo "📝 连接信息："
            echo "   Host: localhost"
            echo "   Port: 5432"
            echo "   User: $(whoami)"
            echo "   Password: （留空）"
            echo "   Database: chenqinodejs_db"
        else
            echo "❌ TablePlus 未安装"
            echo "安装命令: brew install --cask tableplus"
        fi
        ;;
    2)
        echo "📱 正在打开 pgAdmin 4..."
        if [ -d "/Applications/pgAdmin 4.app" ]; then
            open -a "pgAdmin 4"
            echo "✅ pgAdmin 4 已打开！"
        else
            echo "❌ pgAdmin 4 未安装"
            echo "安装命令: brew install --cask pgadmin4"
        fi
        ;;
    3)
        echo "📱 正在打开 Postico..."
        if [ -d "/Applications/Postico 2.app" ] || [ -d "/Applications/Postico.app" ]; then
            open -a Postico 2 2>/dev/null || open -a Postico 2>/dev/null
            echo "✅ Postico 已打开！"
        else
            echo "❌ Postico 未安装"
            echo "安装命令: brew install --cask postico"
        fi
        ;;
    4)
        echo "📱 正在打开 DBeaver..."
        if [ -d "/Applications/DBeaver.app" ]; then
            open -a DBeaver
            echo "✅ DBeaver 已打开！"
        else
            echo "❌ DBeaver 未安装"
            echo "安装命令: brew install --cask dbeaver-community"
        fi
        ;;
    5)
        echo ""
        echo "📊 数据库连接信息"
        echo "=================="
        echo ""
        echo "数据库类型: PostgreSQL"
        echo "主机地址: localhost"
        echo "端口: 5432"
        echo "用户名: $(whoami)"
        echo "密码: （留空，使用系统认证）"
        echo "数据库名: chenqinodejs_db"
        echo ""
        echo "📋 可用的表："
        psql chenqinodejs_db -c "\dt" 2>/dev/null || echo "⚠️  无法连接数据库，请确保 PostgreSQL 正在运行"
        echo ""
        echo "📈 角色统计："
        psql chenqinodejs_db -c "SELECT COUNT(*) as total_roles, SUM(CASE WHEN \"isActive\" = true THEN 1 ELSE 0 END) as active_roles FROM roles;" 2>/dev/null
        ;;
    *)
        echo "❌ 无效的选择"
        exit 1
        ;;
esac

echo ""
echo "📖 详细说明请查看: DATABASE_GUI_TOOLS.md"
