import { useState, useCallback } from 'react';
import type { QuizQuestion, QuizResult } from '../types';

interface FeedbackState {
  show: boolean;
  correct: boolean;
  correctAnswer: string;
  korean: string;
  exampleSentence: string | null;
  exampleTranslation: string | null;
  wrongCount: number;
}

const initialFeedback: FeedbackState = {
  show: false,
  correct: false,
  correctAnswer: '',
  korean: '',
  exampleSentence: null,
  exampleTranslation: null,
  wrongCount: 0,
};

export function useQuiz() {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(initialFeedback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [currentDate, setCurrentDate] = useState<string | undefined>();
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);

  const fetchNext = useCallback(async (date?: string) => {
    setLoading(true);
    setError(null);
    setFeedback(initialFeedback);
    setAnswer('');
    if (date !== undefined) setCurrentDate(date);
    const useDate = date !== undefined ? date : currentDate;
    try {
      const url = useDate ? `/api/quiz/next?date=${useDate}` : '/api/quiz/next';
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 400) {
          throw new Error('퀴즈 문제가 없습니다. 먼저 단어를 추가하세요.');
        }
        throw new Error('문제를 불러오는데 실패했습니다.');
      }
      const json = await res.json();
      setQuestion(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  const submitAnswer = useCallback(async () => {
    if (!question || !answer.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/quiz/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wordId: question.wordId,
          answer: answer.trim(),
        }),
      });
      if (!res.ok) throw new Error('답 제출에 실패했습니다.');
      const json = await res.json();
      const result: QuizResult = json.data;
      setTotalAnswered(prev => prev + 1);
      if (result.correct) setTotalCorrect(prev => prev + 1);
      setFeedback({
        show: true,
        correct: result.correct,
        correctAnswer: result.correctAnswer,
        korean: result.korean,
        exampleSentence: result.exampleSentence,
        exampleTranslation: result.exampleTranslation,
        wrongCount: result.wrongCount,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  }, [question, answer, fetchNext]);

  const dismissFeedback = useCallback(() => {
    setFeedback(initialFeedback);
    window.scrollTo(0, 0);
    fetchNext();
  }, [fetchNext]);

  return {
    question,
    feedback,
    loading,
    error,
    answer,
    setAnswer,
    fetchNext,
    submitAnswer,
    dismissFeedback,
    totalAnswered,
    totalCorrect,
  };
}
