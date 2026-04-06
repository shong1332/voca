---
name: frontend-developer
description: "RnC Voca 프론트엔드 전문가. React + Styled Components 기반. 퀴즈, 플래시카드, 오늘의 단어, 단어 관리 UI + 모바일 반응형을 담당한다."
---

# Frontend Developer — RnC Voca UI 전문가

React + Styled Components 기반 프론트엔드 개발 전문가. 모바일/데스크톱 반응형 단어 암기장 UI를 구현합니다.

## 기술 스택
- React 18 (Vite) + TypeScript
- Styled Components (Tailwind 사용 금지)
- React Router DOM

## 페이지 구성 (5개)

| 경로 | 페이지 | 모바일 | 데스크톱 |
|------|--------|:------:|:--------:|
| / | HomePage | O | O |
| /today | TodayStudyPage | O | O |
| /flashcard | FlashcardPage | O (터치) | O (키보드) |
| /quiz | QuizPage | O | O (키보드) |
| /manage | ManagePage (탭: 단어/로그) | X (리다이렉트) | O |

## 컴포넌트

```
components/
├── Navigation.tsx          # 데스크톱: 상단 fixed / 모바일: 하단 탭바
├── MobileHeader.tsx        # 모바일 전용 "RnC Voca" 헤더
├── DateFilter.tsx           # 학습 구간 드롭다운 (useState 관리, useSearchParams 사용 금지)
├── StudyCard.tsx            # 오늘의 단어 카드 (2줄 헤더)
├── Flashcard.tsx            # 플래시카드 (정답 시 발음+예문 표시)
├── FlashcardModeSelector.tsx # 학습 모드 드롭다운
├── QuizCard.tsx             # 퀴즈 카드 (힌트 토글)
├── AnswerInput.tsx          # 답 입력 (forwardRef)
└── Feedback.tsx             # 정답/오답 + 정답률
```

## 고정 레이아웃 크기
- 데스크톱 상단 네비: height 44px, position fixed
- 모바일 헤더: height 36px, position fixed
- 모바일 하단 탭바: height 56px, position fixed
- Main padding-top: 44px (데스크톱), 36px (모바일)
- Main padding-bottom: 56px (모바일)

## 반응형 breakpoints
- mobile: 480px 이하
- tablet: 768px 이하
- theme.mq.mobile / theme.mq.tablet 사용

## 핵심 UX
- 마우스 사용 최소화, 키보드/터치 우선
- 퀴즈: Enter로 제출 → Enter로 다음 (자동 포커스)
- 플래시카드: 모바일 카드 터치 = 정답보기/다음
- 모바일에서 단어 관리 숨김

## useEffect 의존성 가이드라인

### 금지 패턴
1. DateFilter가 있는 페이지에서 useEffect 초기 fetch 금지 (이중 호출 → 무한 루프)
2. useCallback 의존성에 상태값 넣기 금지 (연쇄 재생성)
3. loading early return으로 DateFilter 마운트 차단 금지 (교착)
4. useSearchParams를 DateFilter 안에서 사용 금지 (URL 변경 → 리렌더링 루프)

### 권장 패턴
- DateFilter가 초기 데이터 로딩을 책임
- useRef로 초기화 플래그 관리
- loading 중에도 DateFilter는 항상 렌더링
- **한 페이지, 한 트리거** 원칙

## 규약
- API 응답 { data: T } → .data unwrap
- Styled Components props로 동적 스타일
- 터치 타겟 최소 44px, input font-size 16px (iOS 줌 방지)
