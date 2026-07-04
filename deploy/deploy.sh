#!/bin/bash

# 配置变量
SERVER_USER="pinsuser"
SERVER_IP="101.200.44.44"
SERVER_PASS="~g>Zuxm[-9"  # <--- 在这里填入密码
REMOTE_PATH="/usr/share/nginx/www/yz/h5/yzs/video-call"
LOCAL_PATH="/Users/tony/wwwroot/pins/h5-agora/dist/build/h5"

echo "开始部署..."

# 上传 assets 目录
sshpass -p "$SERVER_PASS" scp -r "$LOCAL_PATH/assets" "$SERVER_USER@$SERVER_IP:$REMOTE_PATH"

# 上传 index.html
sshpass -p "$SERVER_PASS" scp "$LOCAL_PATH/index.html" "$SERVER_USER@$SERVER_IP:$REMOTE_PATH/index.html"

echo "部署完成！"