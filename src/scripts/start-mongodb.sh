#!/bin/bash

# MongoDB 启动脚本

echo "🔍 检查 MongoDB 安装..."

# 检查 mongod 是否可用
if command -v mongod &> /dev/null; then
    echo "✅ 找到 MongoDB"
    MONGOD=$(which mongod)
elif [ -f "/opt/homebrew/bin/mongod" ]; then
    echo "✅ 找到 MongoDB (Homebrew)"
    MONGOD="/opt/homebrew/bin/mongod"
elif [ -f "/usr/local/bin/mongod" ]; then
    echo "✅ 找到 MongoDB (Homebrew)"
    MONGOD="/usr/local/bin/mongod"
else
    echo "❌ 未找到 MongoDB"
    echo ""
    echo "请先安装 MongoDB:"
    echo "  brew tap mongodb/brew"
    echo "  brew install mongodb-community"
    exit 1
fi

# 检查是否已经在运行
if pgrep -f mongod > /dev/null; then
    echo "✅ MongoDB 已经在运行中"
    echo "   进程 ID: $(pgrep -f mongod)"
    exit 0
fi

# 创建数据目录（如果不存在）
DATA_DIR="$HOME/mongodb-data"
if [ ! -d "$DATA_DIR" ]; then
    echo "📁 创建数据目录: $DATA_DIR"
    mkdir -p "$DATA_DIR"
fi

# 尝试使用 Homebrew 服务启动
if command -v brew &> /dev/null; then
    echo "🚀 尝试使用 Homebrew 服务启动 MongoDB..."
    brew services start mongodb-community 2>/dev/null && {
        echo "✅ MongoDB 已通过 Homebrew 服务启动"
        sleep 2
        if pgrep -f mongod > /dev/null; then
            echo "✅ MongoDB 运行正常"
            exit 0
        fi
    }
fi

# 手动启动 MongoDB
echo "🚀 手动启动 MongoDB..."
echo "   数据目录: $DATA_DIR"
echo "   端口: 27017"
echo ""
echo "按 Ctrl+C 停止 MongoDB"
echo ""

$MONGOD --dbpath "$DATA_DIR" --port 27017
