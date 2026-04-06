#!/bin/bash
# RnC Voca — 매일 06시 단어 15개 자동 생성
# crontab: 0 6 * * * /path/to/study/scripts/daily-words.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$PROJECT_DIR/scripts/daily-words.log"
TODAY=$(date +%Y-%m-%d)

echo "[$TODAY $(date +%H:%M:%S)] 단어 생성 시작" >> "$LOG_FILE"

# 서버가 실행 중인지 확인
if ! curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
  echo "[$TODAY] 서버가 실행 중이 아닙니다. 종료." >> "$LOG_FILE"
  exit 1
fi

# Claude Code CLI로 단어 생성
cd "$PROJECT_DIR"
claude --print "
오늘 날짜는 ${TODAY}입니다.

.claude/agents/english-teacher.md 파일을 읽고 그 규칙에 따라 단어 15개를 생성해주세요.

워크플로우:
1. GET http://localhost:3001/api/words/list 로 기존 단어 확인
2. GET http://localhost:3001/api/words/top-review?limit=10 로 복습 단어 3개 선정
3. 중복되지 않는 새 단어 12개 생성 (기본 조건에 따라)
4. POST http://localhost:3001/api/study/create-daily 로 DB에 저장

반드시 실제 API를 호출해서 DB에 저장하세요. today_study.txt는 생성하지 마세요.
" >> "$LOG_FILE" 2>&1

echo "[$TODAY $(date +%H:%M:%S)] 단어 생성 완료" >> "$LOG_FILE"
echo "---" >> "$LOG_FILE"
