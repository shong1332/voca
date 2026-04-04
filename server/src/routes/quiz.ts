import { Router, Request, Response } from "express";
import { z } from "zod";
import db from "../lib/db";
import { priorityPick } from "../lib/weight";

const router = Router();

interface WordRow {
  id: number;
  english: string;
  korean: string;
  pronunciation: string | null;
  example_sentence: string | null;
  example_translation: string | null;
  wrong_count: number;
  correct_count: number;
  study_date: string;
  last_studied_at: string | null;
}

// GET /api/quiz/next - 다음 문제 (가중치 기반, 한글+발음 → 영어)
router.get("/next", (req: Request, res: Response) => {
  try {
    const { date } = req.query;

    let words: WordRow[];
    if (date && typeof date === "string") {
      words = db
        .prepare("SELECT * FROM words WHERE study_date = ?")
        .all(date) as WordRow[];
    } else {
      words = db.prepare("SELECT * FROM words").all() as WordRow[];
    }

    if (words.length === 0) {
      res.status(400).json({ error: "단어를 먼저 추가해주세요" });
      return;
    }

    const selectedId = priorityPick(
      words.map((w) => ({ id: w.id, wrong_count: w.wrong_count, correct_count: w.correct_count }))
    );

    const word = words.find((w) => w.id === selectedId)!;

    res.json({
      data: {
        wordId: word.id,
        korean: word.korean,
        pronunciation: word.pronunciation,
        totalWords: words.length,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "퀴즈 문제를 가져올 수 없습니다" });
  }
});

// POST /api/quiz/answer - 답 제출
const answerSchema = z.object({
  wordId: z.number(),
  answer: z.string(),
});

router.post("/answer", (req: Request, res: Response) => {
  try {
    const parsed = answerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "잘못된 요청 형식입니다" });
      return;
    }

    const { wordId, answer } = parsed.data;

    const word = db
      .prepare("SELECT * FROM words WHERE id = ?")
      .get(wordId) as WordRow | undefined;

    if (!word) {
      res.status(404).json({ error: "단어를 찾을 수 없습니다" });
      return;
    }

    const userAnswer = answer.trim().toLowerCase();
    const correctAnswer = word.english.toLowerCase();
    const isCorrect = correctAnswer === userAnswer;

    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    if (isCorrect) {
      db.prepare(
        "UPDATE words SET correct_count = correct_count + 1, last_studied_at = ? WHERE id = ?"
      ).run(now, wordId);
    } else {
      db.prepare(
        "UPDATE words SET wrong_count = wrong_count + 1, last_studied_at = ? WHERE id = ?"
      ).run(now, wordId);
    }

    const updated = db
      .prepare("SELECT * FROM words WHERE id = ?")
      .get(wordId) as WordRow;

    res.json({
      data: {
        correct: isCorrect,
        correctAnswer: word.english,
        korean: word.korean,
        exampleSentence: word.example_sentence,
        exampleTranslation: word.example_translation,
        wrongCount: updated.wrong_count,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "답변 처리에 실패했습니다" });
  }
});

export default router;
