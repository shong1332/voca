# 배치 스크립트

## daily-words.sh — 매일 06시 단어 15개 자동 생성

### 동작 방식
1. 서버(localhost:3001) 실행 여부 확인
2. Claude Code CLI로 english-teacher.md 규칙에 따라 단어 생성
3. 경량 API로 중복 체크 + 복습 선정
4. create-daily API로 DB 저장 + today_study.txt 자동 생성

### 사전 조건
- Node.js 서버가 실행 중 (pm2 또는 npm run dev)
- Claude Code CLI 설치 + 로그인 완료

### 로컬(맥)에서 crontab 등록

```bash
# crontab 편집
crontab -e

# 아래 줄 추가 (매일 06:00 KST)
0 6 * * * /Users/kimsunhong/Desktop/something/study/scripts/daily-words.sh
```

### 서버(Ubuntu)에서 crontab 등록

```bash
# Claude Code CLI 설치
npm install -g @anthropic-ai/claude-code
claude login

# crontab 편집
crontab -e

# 아래 줄 추가 (매일 06:00 KST)
0 6 * * * /data/rnc-voca/scripts/daily-words.sh
```

### 수동 실행 (테스트)

```bash
./scripts/daily-words.sh
```

### 로그 확인

```bash
cat scripts/daily-words.log
```
