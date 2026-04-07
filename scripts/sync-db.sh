#!/bin/bash
# RnC Voca — 로컬 DB를 79서버로 동기화

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

source "$PROJECT_DIR/.env.deploy"

if [ -z "$DEPLOY_HOST" ] || [ -z "$DEPLOY_USER" ] || [ -z "$DEPLOY_PASS" ] || [ -z "$DEPLOY_PATH" ]; then
  echo "❌ .env.deploy 설정을 확인하세요."
  exit 1
fi

export SSHPASS="$DEPLOY_PASS"
LOCAL_DB="$PROJECT_DIR/data/study.db"

if [ ! -f "$LOCAL_DB" ]; then
  echo "❌ 로컬 DB가 없습니다: $LOCAL_DB"
  exit 1
fi

echo "🔄 로컬 WAL 병합 중..."
pkill -f "tsx" 2>/dev/null
sleep 1
sqlite3 "$LOCAL_DB" ".backup $PROJECT_DIR/data/study_merged.db"
mv "$PROJECT_DIR/data/study_merged.db" "$LOCAL_DB"
rm -f "$PROJECT_DIR/data/study.db-shm" "$PROJECT_DIR/data/study.db-wal"

echo "⏸️  서버 중지..."
sshpass -e ssh -o StrictHostKeyChecking=no "$DEPLOY_USER@$DEPLOY_HOST" "pm2 stop rnc-voca"

echo "🧹 서버 WAL 파일 제거..."
sshpass -e ssh -o StrictHostKeyChecking=no "$DEPLOY_USER@$DEPLOY_HOST" "rm -f $DEPLOY_PATH/data/study.db-shm $DEPLOY_PATH/data/study.db-wal"

echo "📦 DB 전송 중..."
sshpass -e scp -o StrictHostKeyChecking=no "$LOCAL_DB" "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/data/study.db"

echo "▶️  서버 시작..."
sshpass -e ssh -o StrictHostKeyChecking=no "$DEPLOY_USER@$DEPLOY_HOST" "pm2 start rnc-voca"

echo "✅ DB 동기화 완료!"
