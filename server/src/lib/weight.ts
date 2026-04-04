/**
 * 오답 가중치 = 1 + wrongCount * 2
 */
export function calculateWeight(wrongCount: number): number {
  return 1 + wrongCount * 2;
}

/**
 * 출제 우선순위 선택
 * 1순위: 출제 횟수(wrong + correct)가 가장 낮은 단어 그룹
 * 2순위: 같은 그룹 내에서 오답 가중치 기반 랜덤
 */
export function priorityPick(
  words: Array<{ id: number; wrong_count: number; correct_count: number }>
): number {
  if (words.length === 0) return -1;
  if (words.length === 1) return words[0].id;

  const minAttempts = Math.min(
    ...words.map((w) => w.wrong_count + w.correct_count)
  );

  const pool = words.filter(
    (w) => w.wrong_count + w.correct_count === minAttempts
  );

  const weighted = pool.map((w) => ({
    id: w.id,
    weight: calculateWeight(w.wrong_count),
  }));

  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
  let random = Math.random() * totalWeight;

  for (const w of weighted) {
    random -= w.weight;
    if (random <= 0) return w.id;
  }

  return weighted[weighted.length - 1].id;
}
