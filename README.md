# RnC Voca

영어 단어 암기장 웹앱. 매일 새로운 단어를 학습하고, 플래시카드와 퀴즈로 반복 복습합니다.

## 주요 기능

| 기능 | 설명 |
|------|------|
| 오늘의 단어 | 날짜별 단어를 카드 형태로 학습 (예문, 발음 포함) |
| 플래시카드 | 한글/영어 가리기 모드로 무한 반복 학습 |
| 단어 퀴즈 | 한글+발음을 보고 영어로 답하는 무한 퀴즈 |
| 단어 관리 | 가중치 조회, 정렬, 초기화, 삭제 (데스크톱 전용) |
| TTS 발음 | 영국/미국 영어 발음 재생 (데스크톱 전용) |

## 기술 스택

- **프론트엔드**: React 18 + TypeScript + Vite + Styled Components
- **백엔드**: Express.js + TypeScript + better-sqlite3
- **DB**: SQLite (words, daily_words)
- **반응형**: 모바일(PWA) + 데스크톱

## 실행 방법

```bash
# 서버
cd server && npm install && npm run dev

# 클라이언트
cd client && npm install && npm run dev

# 브라우저 접속
http://localhost:5173
```

## 배포

```bash
# 클라이언트 빌드 + 서버 전송 + 재시작
./scripts/deploy.sh

# DB만 동기화
./scripts/sync-db.sh
```

## 출제 알고리즘

- **퀴즈**: 출제 횟수 최소 단어 우선 → 오답 가중치(1 + wrongCount * 2) 기반 랜덤
- **복습 선정**: review_count 낮은 순 → 가중치 높은 순

## 프로젝트 구조

```
├── client/          # React 프론트엔드
├── server/          # Express 백엔드
├── data/            # SQLite DB
├── scripts/         # 배포, DB 동기화, 단어 생성 스크립트
└── .claude/         # AI 에이전트 설정
```
