---
name: english-study-orchestrator
description: "RnC Voca 프로젝트를 빌드하는 오케스트레이터. '프로젝트 생성', '영어 공부 앱 만들어줘', '단어 암기장 빌드' 요청 시 이 스킬을 사용할 것."
---

# RnC Voca — 프로젝트 빌드 오케스트레이터

english-study 스킬 스펙에 따라 RnC Voca 웹앱을 생성하는 통합 스킬.

## 빌드 워크플로우

### Phase 1: 프로젝트 초기화
1. _workspace/, data/ 디렉토리 생성
2. client/ — `npm create vite@latest client -- --template react-ts`
3. client/ — `npm install styled-components react-router-dom`
4. server/ — `npm init -y`
5. server/ — `npm install express better-sqlite3 zod cors`
6. server/ — `npm install -D typescript @types/express @types/better-sqlite3 @types/cors @types/node tsx`

### Phase 2: 백엔드 + 프론트엔드 구현 (병렬)

backend-developer와 frontend-developer 에이전트를 **병렬**로 실행.

**백엔드 (server/):**
- server/tsconfig.json
- server/src/lib/db.ts — SQLite 연결 + words/access_log 테이블 + 시드 데이터 10개
- server/src/lib/weight.ts — 가중치 계산 + priorityPick (출제 횟수 우선)
- server/src/lib/parser.ts — today_study.txt 파서
- server/src/routes/words.ts — 단어 CRUD + list(경량) + top-wrong + reset-all
- server/src/routes/quiz.ts — 퀴즈 출제(priorityPick) + 채점
- server/src/routes/study.ts — today 파싱 + create-daily (DB 저장 + txt 자동 생성 + 셔플)
- server/src/routes/accessLog.ts — 접속 로그 조회 + 통계
- server/src/index.ts — Express 앱 + 접속 로그 미들웨어 + 라우터 등록

**프론트엔드 (client/):**
- styles/ — theme.ts (breakpoints/mq 포함), GlobalStyle.ts, styled.d.ts
- types/index.ts — Word, QuizQuestion, QuizResult, FlashcardMode 등
- components/ — Navigation, MobileHeader, DateFilter, StudyCard, Flashcard, FlashcardModeSelector, QuizCard (힌트 토글), AnswerInput (forwardRef), Feedback (정답률 표시)
- hooks/ — useQuiz, useFlashcard, useStudy
- pages/ — HomePage, TodayStudyPage, FlashcardPage, QuizPage, ManagePage (탭: 단어관리/접속로그)
- App.tsx — BrowserRouter + MobileHeader + Navigation + Main(padding-bottom) + Routes
- vite.config.ts — proxy /api → localhost:3001

### Phase 3: 빌드 검증
1. server: `npx tsc --noEmit`
2. client: `npx tsc --noEmit`
3. server 실행 → API 테스트 (health, words, quiz/next, quiz/answer, study/today)
4. client 빌드: `npx vite build`

### Phase 4: 시드 데이터
- DB가 비어있으면 샘플 단어 10개 자동 삽입 (db.ts에서 처리)

## 에이전트 구성

| 팀원 | 역할 |
|------|------|
| backend-developer | Express + SQLite API 전체 구현 |
| frontend-developer | React + Styled Components UI 전체 구현 |
| qa-inspector | 통합 정합성 검증 (출제 알고리즘 포함) |
| english-teacher | 단어 생성 (경량 API 사용) |

## 핵심 체크리스트
- [ ] Styled Components만 사용 (Tailwind 금지)
- [ ] 모바일 반응형 (하단 탭바, 상단 헤더, 터치 조작)
- [ ] 단어 관리는 데스크톱 전용
- [ ] DateFilter URL 쿼리 파라미터 유지
- [ ] 퀴즈 키보드 전용 조작 (Enter로 제출/다음)
- [ ] 플래시카드 모바일 터치 지원
- [ ] 출제 알고리즘: 출제 횟수 최소 우선 → 가중치 랜덤
- [ ] create-daily API로 단어 셔플 + txt 자동 생성
- [ ] 접속 로그 미들웨어 (iPhone/Android/PC 구분)
