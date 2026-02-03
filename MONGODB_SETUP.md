# MongoDB 启动指南

## 1. 安装 MongoDB

### macOS (使用 Homebrew)
```bash
# 安装 MongoDB Community Edition
brew tap mongodb/brew
brew install mongodb-community

# 启动 MongoDB 服务
brew services start mongodb-community

# 或者手动启动（前台运行）
mongod --config /opt/homebrew/etc/mongod.conf
```

### 其他系统
请参考 [MongoDB 官方安装文档](https://www.mongodb.com/docs/manual/installation/)

## 2. 验证 MongoDB 是否运行

```bash
# 检查 MongoDB 进程
pgrep -f mongod

# 或者尝试连接
mongosh mongodb://localhost:27017
```

## 3. 测试项目中的 MongoDB 连接

```bash
# 安装 tsx（如果还没有）
npm install -D tsx

# 运行测试脚本
npm run test:mongodb
```

## 4. 配置环境变量（可选）

创建 `.env.local` 文件（如果使用自定义 MongoDB URI）：

```env
MONGODB_URI=mongodb://localhost:27017/fpv_database
```

默认情况下，项目会使用 `mongodb://localhost:27017/fpv_database`

## 5. 启动开发服务器

```bash
npm run dev
```

MongoDB 连接会在首次 API 调用时自动建立。

## 常见问题

### MongoDB 连接失败
- 确保 MongoDB 服务正在运行
- 检查端口 27017 是否被占用
- 验证 MONGODB_URI 环境变量是否正确

### 权限问题
- macOS: 确保有权限访问 `/opt/homebrew/var/mongodb` 目录
- 如果使用自定义数据目录，确保目录存在且有写权限
