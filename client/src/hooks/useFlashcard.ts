import { useState, useCallback, useEffect } from 'react';
import type { Word, FlashcardMode } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface UseFlashcardReturn {
  words: Word[];
  currentWord: Word | null;
  currentIndex: number;
  revealed: boolean;
  loading: boolean;
  error: string | null;
  mode: FlashcardMode;
  setMode: (mode: FlashcardMode) => void;
  reveal: () => void;
  next: () => void;
  prev: () => void;
  fetchWords: (date?: string) => void;
}

export function useFlashcard(): UseFlashcardReturn {
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<FlashcardMode>('hide_korean');

  const fetchWords = useCallback(async (date?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = date ? `/api/words?date=${date}` : '/api/words';
      const res = await fetch(url);
      if (!res.ok) throw new Error('단어를 불러오는데 실패했습니다.');
      const json = await res.json();
      const fetched: Word[] = json.data;
      if (fetched.length === 0) {
        throw new Error('단어가 없습니다. 먼저 단어를 임포트하세요.');
      }
      setAllWords(fetched);
      setWords(shuffle(fetched));
      setCurrentIndex(0);
      setRevealed(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  }, []);

  const reveal = useCallback(() => {
    setRevealed(true);
  }, []);

  const next = useCallback(() => {
    setRevealed(false);
    setCurrentIndex(prev => {
      if (prev >= words.length - 1) {
        // Reshuffle at the end
        setWords(shuffle(allWords));
        return 0;
      }
      return prev + 1;
    });
  }, [words.length, allWords]);

  const prev = useCallback(() => {
    setRevealed(false);
    setCurrentIndex(prev => {
      if (prev <= 0) return words.length - 1;
      return prev - 1;
    });
  }, [words.length]);

  useEffect(() => {
    setCurrentIndex(0);
    setRevealed(false);
  }, [mode]);

  const currentWord = words.length > 0 ? words[currentIndex] : null;

  return {
    words,
    currentWord,
    currentIndex,
    revealed,
    loading,
    error,
    mode,
    setMode,
    reveal,
    next,
    prev,
    fetchWords,
  };
}
