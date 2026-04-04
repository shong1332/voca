---
name: english-study
description: "RnC Voca — 영어 단어 암기장 웹앱. React + Styled Components + Express.js + SQLite 기반. 퀴즈, 플래시카드, 오늘의 단어, 단어 관리 기능을 포함한다. '프로젝트 생성', '영어 공부 앱', '단어 암기장' 요청 시 이 스킬을 사용할 것."
---

# RnC Voca — 영어 단어 암기장 웹앱

## 앱 이름
RnC Voca

## 기술 스택
- 클라이언트: React 18 (Vite) + TypeScript + Styled Components + React Router
- 서버: Express.js + TypeScript + better-sqlite3 + zod
- 스타일: Styled Components (Tailwind 사용 금지)
- 반응형: 모바일(PWA 대응) + 데스크톱

## 핵심 기능 5가지

### 1. 홈페이지
- 오늘의 단어 / 플래시카드(학습) / 퀴즈 3개 카드 (모바일: 세로 1열)
- 단어 관리는 데스크톱 전용 (모바일 숨김)

### 2. 오늘의 단어 (/today)
- POST /api/study/create-daily로 생성된 today_study.txt를 파싱하여 표시
- 상단: 번호 인덱스 + 단어 미리보기 (2열 그리드)
- 하단: 각 단어별 상세 카드 (예문, 해석, 문법, 관련 단어)

### 3. 플래시카드 학습 (/flashcard)
- 3가지 모드: 한글 가리기 / 영어 가리기 / 랜덤 (드롭다운)
- 정답 공개 시 예문 + 해석도 함께 표시
- 무한 반복, 랜덤 셔플, 진행 상태 없음
- 일자별 / 전체 단어 필터 (URL 쿼리 파라미터로 유지)
- 모바일: 카드 터치로 정답 보기/다음 단어 전환
- 데스크톱: 하단 버튼 (정답 보기 / 다음), 키보드 지원 (Space/Enter/Arrow)

### 4. 단어 퀴즈 (/quiz)
- 한글 + 발음(힌트 버튼) 표시 → 영어로 답 입력
- 정답/오답 모두 피드백 카드 표시 (정답 + 뜻 + 예문 + 정답률)
- Enter 키로 다음 퀴즈 이동, 자동 포커스
- 출제 알고리즘: 1순위 출제 횟수 최소 → 2순위 오답 가중치(1 + wrongCount * 2)
- 무한 반복, 일자별 / 전체 필터

### 5. 단어 관리 (/manage) — 데스크톱 전용
- 탭 UI: 단어 관리 / 접속 로그
- 단어 관리: 테이블 (영어, 한글, 발음, 틀림, 맞음, 가중치, 출제횟수, 날짜, 초기화)
- 헤더 클릭으로 정렬 (틀림/맞음/가중치/출제 내림차순 토글)
- 전체 가중치 초기화, 선택 삭제, 일자별 필터
- 접속 로그: 통계 카드 + 접속 기록 테이블 (시각, 기기, 페이지)

## 반응형 디자인

### 모바일/태블릿 (768px 이하)
- 하단 고정 탭바 (홈/단어/학습/퀴즈 — 관리 숨김)
- 상단 고정 헤더 "RnC Voca"
- 각 페이지 h1 제목 숨김
- 터치 타겟 최소 44px, input font-size 16px (iOS 줌 방지)
- 플래시카드: 카드 터치로 조작
- 드롭다운 1:1 너비 분배

### 데스크톱
- 상단 고정 네비게이션 (홈/오늘의 단어/플래시카드/퀴즈/단어 관리)
- 키보드 중심 조작

## 프로젝트 구조

```
study/
├── client/
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── pages/
│       │   ├── HomePage.tsx
│       │   ├── TodayStudyPage.tsx
│       │   ├── FlashcardPage.tsx
│       │   ├── QuizPage.tsx
│       │   └── ManagePage.tsx
│       ├── components/
│       │   ├── Navigation.tsx
│       │   ├── MobileHeader.tsx
│       │   ├── DateFilter.tsx
│       │   ├── StudyCard.tsx
│       │   ├── Flashcard.tsx
│       │   ├── FlashcardModeSelector.tsx
│       │   ├── QuizCard.tsx
│       │   ├── AnswerInput.tsx
│       │   └── Feedback.tsx
│       ├── hooks/
│       │   ├── useQuiz.ts
│       │   ├── useFlashcard.ts
│       │   └── useStudy.ts
│       ├── styles/
│       │   ├── GlobalStyle.ts
│       │   ├── theme.ts
│       │   └── styled.d.ts
│       └── types/
│           └── index.ts
├── server/
│   └── src/
│       ├── index.ts
│       ├── routes/
│       │   ├── words.ts
│       │   ├── quiz.ts
│       │   ├── study.ts
│       │   └── accessLog.ts
│       └── lib/
│           ├── db.ts
│           ├── weight.ts
│           └── parser.ts
├── today_study.txt
└── data/
    └── study.db
```

## DB 스키마

```sql
-- 단어 테이블
CREATE TABLE words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  english TEXT NOT NULL,
  korean TEXT NOT NULL,
  pronunciation TEXT,
  example_sentence TEXT,
  example_translation TEXT,
  wrong_count INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  study_date TEXT NOT NULL,
  last_studied_at TEXT
);

-- 접속 로그 테이블
CREATE TABLE access_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device TEXT NOT NULL,
  page TEXT NOT NULL,
  accessed_at TEXT NOT NULL
);
```

## API 엔드포인트

| 메서드 | 경로 | 기능 |
|--------|------|------|
| GET | /api/words | 단어 목록 (?date= 필터) |
| GET | /api/words/list | 영단어명만 반환 (경량, 중복 체크용) |
| GET | /api/words/top-wrong | 가중치 상위 단어 (복습 선정용) |
| GET | /api/words/dates | 학습 날짜 목록 |
| POST | /api/words/import | 단어 일괄 추가 |
| POST | /api/words/add | 단어 1개 추가 |
| PUT | /api/words/:id/reset | 개별 가중치 초기화 |
| PUT | /api/words/reset-all | 전체 가중치 초기화 |
| DELETE | /api/words/:id | 단어 삭제 |
| GET | /api/quiz/next | 다음 퀴즈 문제 (우선순위 기반) |
| POST | /api/quiz/answer | 답 제출 + DB 즉시 업데이트 |
| GET | /api/study/today | today_study.txt 파싱 결과 |
| POST | /api/study/create-daily | 일일 단어 생성 (DB 저장 + txt 자동 생성) |
| GET | /api/access-log | 접속 로그 조회 |
| GET | /api/access-log/stats | 접속 통계 |
| GET | /api/health | 헬스체크 |

## 출제 알고리즘 (server/src/lib/weight.ts)
- 가중치 = 1 + wrongCount * 2
- 1순위: 출제 횟수(wrong + correct)가 가장 낮은 단어 그룹
- 2순위: 같은 그룹 내 가중치 기반 랜덤

## 퀴즈 답 비교 규칙
- trim() 후 비교, 영어는 toLowerCase()
- 복수 정답(쉼표 구분): 하나만 맞아도 정답

## API 규약
- 모든 응답: { data: T } 또는 { error: string }
- DB snake_case → API camelCase 매핑
- 서버 포트: 3001 / 클라이언트 포트: 5173
- Vite proxy: /api → http://localhost:3001

## 핵심 주의사항
- Styled Components 사용 (Tailwind 금지)
- 마우스 사용 최소화 (키보드/터치 우선)
- 모바일에서 단어 관리 페이지 숨김
- DateFilter는 URL 쿼리 파라미터(?date=)로 상태 유지
- DB 시드: 빈 DB 시 샘플 단어 10개 자동 삽입
- 접속 로그: /api/health, /api/access-log 자체는 로깅 제외
