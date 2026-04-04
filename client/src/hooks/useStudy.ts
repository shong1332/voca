import { useState, useCallback } from 'react';
import type { TodayStudyData } from '../types';

export function useStudy() {
  const [data, setData] = useState<TodayStudyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (date?: string) => {
    setLoading(true);
    setError(null);
    const start = Date.now();
    try {
      const url = date ? `/api/study/words?date=${date}` : '/api/study/words';
      const res = await fetch(url);
      if (!res.ok) throw new Error('데이터를 불러오는데 실패했습니다.');
      const json = await res.json();
      const elapsed = Date.now() - start;
      const delay = Math.max(200 - elapsed, 0);
      await new Promise(r => setTimeout(r, delay));
      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
}
