#!/bin/bash
# RnC Voca — 79서버 배포 스크립트

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# .env에서 서버 정보 읽기
source "$PROJECT_DIR/.env.deploy"

if [ -z "$DEPLOY_HOST" ] || [ -z "$DEPLOY_USER" ] || [ -z "$DEPLOY_PATH" ]; then
  echo "❌ .env.deploy 파일에 DEPLOY_HOST, DEPLOY_USER, DEPLOY_PATH를 설정하세요."
  exit 1
fi

echo "🔨 클라이언트 빌드 중..."
cd "$PROJECT_DIR/client" && npm run build
if [ $? -ne 0 ]; then
  echo "❌ 빌드 실패"
  exit 1
fi

echo "📦 서버로 전송 중... ($DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH)"
rsync -avz --exclude='node_modules' --exclude='.git' --exclude='data' --exclude='.env.deploy' \
  "$PROJECT_DIR/" "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/"

echo "🔄 서버에서 빌드 + 재시작..."
ssh "$DEPLOY_USER@$DEPLOY_HOST" "cd $DEPLOY_PATH/client && npm install && npm run build && pm2 restart rnc-voca"

echo "✅ 배포 완료!"
echo "🌐 https://teamup.ryencatchers.com/voca/"
