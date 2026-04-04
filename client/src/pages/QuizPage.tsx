import { useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useQuiz } from '../hooks/useQuiz';
import QuizCard from '../components/QuizCard';
import AnswerInput from '../components/AnswerInput';
import Feedback from '../components/Feedback';
import DateFilter from '../components/DateFilter';

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']};
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mq.tablet} {
    padding: ${({ theme }) => theme.spacing.md};
    height: calc(100dvh - 104px);
    overflow: hidden;
  }
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.mq.tablet} {
    display: none;
  }
`;

const FilterRow = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const QuizArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  flex: 1;
`;

const CenterMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RetryButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.xl}`};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 500;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid ${({ theme }) => theme.colors.borderLight};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function QuizPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    question, feedback, loading, error, answer,
    setAnswer, fetchNext, submitAnswer, dismissFeedback,
    totalAnswered, totalCorrect,
  } = useQuiz();

  const focusInput = useCallback(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, []);

  useEffect(() => {
    fetchNext();
  }, []);

  useEffect(() => {
    if (question && !feedback.show) {
      focusInput();
    }
  }, [question, feedback.show, focusInput]);

  useEffect(() => {
    if (!feedback.show) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        dismissFeedback();
      }
    };
    const timer = setTimeout(() => {
      window.addEventListener('keydown', handleKeyDown);
    }, 100);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [feedback.show, feedback.correct, dismissFeedback]);

  const handleDateChange = useCallback((date?: string) => {
    fetchNext(date);
  }, [fetchNext]);

  if (loading && !question) {
    return (
      <Container>
        <CenterMessage><LoadingSpinner /></CenterMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <PageTitle>단어 퀴즈</PageTitle>
        <CenterMessage>
          <p>{error}</p>
          <RetryButton onClick={() => fetchNext()}>다시 시도</RetryButton>
        </CenterMessage>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle>단어 퀴즈</PageTitle>

      <FilterRow>
        <DateFilter onDateChange={handleDateChange} />
      </FilterRow>

      {question && (
        <QuizArea>
          <QuizCard question={question} />
          <AnswerInput
            ref={inputRef}
            value={answer}
            onChange={setAnswer}
            onSubmit={submitAnswer}
            disabled={feedback.show || loading}
            placeholder="영어로 입력하세요"
          />
          {feedback.show && (
            <Feedback
              correct={feedback.correct}
              correctAnswer={feedback.correctAnswer}
              korean={feedback.korean}
              exampleSentence={feedback.exampleSentence}
              exampleTranslation={feedback.exampleTranslation}
              accuracy={totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0}
              onNext={dismissFeedback}
            />
          )}
        </QuizArea>
      )}
    </Container>
  );
}
