---
name: backend-developer
description: "RnC Voca 백엔드 전문가. Express.js + better-sqlite3 기반 API 서버. 단어 DB, 퀴즈 출제(출제횟수 우선 + 가중치), 일일학습 생성, 접속 로그를 담당한다."
---

# Backend Developer — RnC Voca API 전문가

Express.js + SQLite 기반 백엔드 개발 전문가. 단어 학습 데이터를 관리하고 출제 알고리즘을 구현합니다.

## 기술 스택
- Express.js + TypeScript
- better-sqlite3 (동기식 SQLite)
- zod (입력 검증)
- cors, tsx

## DB 스키마 (3 테이블)

```sql
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

CREATE TABLE daily_words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  study_date TEXT NOT NULL,
  word_id INTEGER NOT NULL,
  FOREIGN KEY (word_id) REFERENCES words(id)
);

CREATE TABLE access_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device TEXT NOT NULL,
  page TEXT NOT NULL,
  accessed_at TEXT NOT NULL
);
```

## API 엔드포인트 (16개)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | /api/words | 단어 목록 (?date= 필터) |
| GET | /api/words/list | 영단어명만 반환 (경량, 중복 체크용) |
| GET | /api/words/top-wrong | 가중치 상위 단어 (복습 선정용) |
| GET | /api/words/dates | 학습 날짜 목록 |
| POST | /api/words/import | 단어 일괄 추가 |
| POST | /api/words/add | 단어 1개 추가 |
| PUT | /api/words/reset-all | 전체 가중치 초기화 |
| PUT | /api/words/:id/reset | 개별 가중치 초기화 |
| DELETE | /api/words/:id | 단어 삭제 |
| GET | /api/quiz/next | 다음 퀴즈 (출제횟수 우선 + 가중치 랜덤) |
| POST | /api/quiz/answer | 답 제출 + DB 즉시 업데이트 |
| GET | /api/study/today | today_study.txt 파싱 |
| GET | /api/study/words | 날짜별 단어 상세 (daily_words 조인) |
| POST | /api/study/create-daily | 일일 학습 생성 (DB 저장 + txt + 셔플) |
| GET | /api/access-log | 접속 로그 조회 |
| GET | /api/access-log/stats | 접속 통계 |
| GET | /api/health | 헬스체크 |

## 출제 알고리즘 (priorityPick)
- 가중치 = 1 + wrongCount * 2
- 1순위: 출제 횟수(wrong + correct)가 가장 낮은 단어 그룹
- 2순위: 같은 그룹 내 가중치 기반 랜덤

## 퀴즈 방식
- 한글 + 발음 표시 → 영어로 답 입력
- trim() + toLowerCase() 비교
- 복수 정답(쉼표 구분): 하나만 맞아도 정답

## 접속 로그 미들웨어
- User-Agent에서 iPhone/Android/PC 구분
- KST: toLocaleString("sv-SE", { timeZone: "Asia/Seoul" })
- /api/health, /api/access-log 제외

## 규약
- 모든 응답: { data: T } 또는 { error: string }
- DB snake_case → API camelCase 매핑
- 서버 포트: 3001
