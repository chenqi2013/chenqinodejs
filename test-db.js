#!/usr/bin/env node

/**
 * 数据库连接测试脚本
 * 使用方法: node test-db.js
 */

const { Client } = require('pg');
require('dotenv').config();

async function testDatabaseConnection() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'chenqinodejs_db',
  });

  try {
    console.log('🔌 正在连接数据库...');
    await client.connect();
    console.log('✅ 数据库连接成功！');

    // 测试查询
    const result = await client.query('SELECT NOW() as current_time');
    console.log('📅 当前时间:', result.rows[0].current_time);

    // 检查表是否存在
    const tableResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'roles'
    `);
    
    if (tableResult.rows.length > 0) {
      console.log('✅ roles 表已存在');
    } else {
      console.log('⚠️  roles 表不存在，需要运行迁移');
    }

  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    console.log('\n🔧 请检查以下配置:');
    console.log('- 数据库是否运行');
    console.log('- 连接参数是否正确');
    console.log('- 用户权限是否足够');
    console.log('\n📖 详细设置请参考: DATABASE_SETUP.md');
  } finally {
    await client.end();
  }
}

testDatabaseConnection();
