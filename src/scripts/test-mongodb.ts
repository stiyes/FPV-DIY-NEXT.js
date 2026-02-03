#!/usr/bin/env ts-node
import connectDB from '../lib/db/mongoose';

async function testConnection() {
  try {
    console.log('正在连接 MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/fpv_database');
    
    const connection = await connectDB();
    
    if (connection) {
      console.log('✅ MongoDB 连接成功！');
      console.log('数据库名称:', connection.connection.db?.databaseName);
      console.log('连接状态:', connection.connection.readyState === 1 ? '已连接' : '未连接');
      
      // 列出所有集合
      const collections = await connection.connection.db?.listCollections().toArray();
      if (collections && collections.length > 0) {
        console.log('\n📁 数据库集合:');
        collections.forEach(col => {
          console.log(`  - ${col.name}`);
        });
      } else {
        console.log('\n📁 数据库集合: (空)');
      }
      
      process.exit(0);
    }
  } catch (error: any) {
    console.error('❌ MongoDB 连接失败:');
    console.error('错误信息:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 提示: MongoDB 服务可能未启动');
      console.error('   请先启动 MongoDB 服务:');
      console.error('   - macOS (Homebrew): brew services start mongodb-community');
      console.error('   - 或直接运行: mongod --dbpath /path/to/data');
    } else if (error.message.includes('authentication failed')) {
      console.error('\n💡 提示: MongoDB 认证失败，请检查用户名和密码');
    } else {
      console.error('\n💡 请检查:');
      console.error('   1. MongoDB 是否已安装');
      console.error('   2. MongoDB 服务是否正在运行');
      console.error('   3. MONGODB_URI 环境变量是否正确');
    }
    
    process.exit(1);
  }
}

testConnection();
