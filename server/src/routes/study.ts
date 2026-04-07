import { Router, Request, Response } from "express";
import { z } from "zod";
import db from "../lib/db";

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

// GET /api/study/words?date=YYYY-MM-DD — 날짜별 단어 상세 (today 페이지용)
router.get("/words", (req: Request, res: Response) => {
  try {
    const { date } = req.query;

    let rows: WordRow[];
    if (date && typeof date === "string") {
      const dailyCount = db
        .prepare("SELECT COUNT(*) as cnt FROM daily_words WHERE study_date = ?")
        .get(date) as { cnt: number };

      if (dailyCount.cnt > 0) {
        rows = db
          .prepare(
            "SELECT w.* FROM daily_words dw JOIN words w ON dw.word_id = w.id WHERE dw.study_date = ?"
          )
          .all(date) as WordRow[];
      } else {
        rows = db
          .prepare("SELECT * FROM words WHERE study_date = ? ORDER BY id")
          .all(date) as WordRow[];
      }
    } else {
      rows = db
        .prepare("SELECT * FROM words ORDER BY id DESC LIMIT 20")
        .all() as WordRow[];
    }

    // 셔플
    for (let i = rows.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rows[i], rows[j]] = [rows[j], rows[i]];
    }

    const preview = rows.map((w, i) => ({
      number: i + 1,
      english: w.english,
      korean: w.korean,
      pronunciation: w.pronunciation || "",
    }));

    const details = rows.map((w, i) => ({
      number: i + 1,
      english: w.english,
      korean: w.korean,
      pronunciation: w.pronunciation || "",
      examples: w.example_sentence
        ? [{ english: w.example_sentence, korean: w.example_translation || "" }]
        : [],
      grammar: [],
      vocabulary: [],
    }));

    res.json({
      data: {
        date: date || "전체",
        preview,
        details,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "단어를 불러올 수 없습니다" });
  }
});

// POST /api/study/create-daily
const createDailySchema = z.object({
  date: z.string().min(1),
  newWords: z.array(
    z.object({
      english: z.string().min(1),
      korean: z.string().min(1),
      pronunciation: z.string().optional(),
      exampleSentence: z.string().optional(),
      exampleTranslation: z.string().optional(),
    })
  ),
  reviewWordIds: z.array(z.number()).optional(),
});

router.post("/create-daily", (req: Request, res: Response) => {
  try {
    const parsed = createDailySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "잘못된 요청 형식입니다" });
      return;
    }

    const { date, newWords, reviewWordIds } = parsed.data;

    // 1. 새 단어 DB 저장
    const insert = db.prepare(
      "INSERT INTO words (english, korean, pronunciation, example_sentence, example_translation, study_date) VALUES (?, ?, ?, ?, ?, ?)"
    );

    let imported = 0;
    let skipped = 0;

    const insertMany = db.transaction(() => {
      for (const w of newWords) {
        const existing = db
          .prepare("SELECT id FROM words WHERE english = ?")
          .get(w.english.trim()) as { id: number } | undefined;

        if (existing) {
          skipped++;
          continue;
        }

        insert.run(
          w.english.trim(),
          w.korean.trim(),
          w.pronunciation || null,
          w.exampleSentence || null,
          w.exampleTranslation || null,
          date
        );
        imported++;
      }
    });

    insertMany();

    // 2. 복습 단어 DB에서 조회 + review_count +1
    const reviewWords: WordRow[] = [];
    if (reviewWordIds && reviewWordIds.length > 0) {
      for (const id of reviewWordIds) {
        db.prepare("UPDATE words SET review_count = review_count + 1 WHERE id = ?").run(id);
        const row = db
          .prepare("SELECT * FROM words WHERE id = ?")
          .get(id) as WordRow | undefined;
        if (row) reviewWords.push(row);
      }
    }

    // 3. 해당 날짜의 모든 단어 조회
    const dateWords = db
      .prepare("SELECT * FROM words WHERE study_date = ? ORDER BY id")
      .all(date) as WordRow[];

    // 복습 단어 + 해당 날짜 단어 조합 후 셔플
    const allWords = [...reviewWords, ...dateWords];
    for (let i = allWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allWords[i], allWords[j]] = [allWords[j], allWords[i]];
    }

    // 4. daily_words 테이블에 기록
    const insertDaily = db.prepare(
      "INSERT INTO daily_words (study_date, word_id) VALUES (?, ?)"
    );
    db.prepare("DELETE FROM daily_words WHERE study_date = ?").run(date);
    const insertDailyMany = db.transaction(() => {
      for (const w of allWords) {
        insertDaily.run(date, w.id);
      }
    });
    insertDailyMany();

    res.json({
      data: {
        imported,
        skipped,
        reviewCount: reviewWords.length,
        totalWords: allWords.length,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "일일 학습 생성에 실패했습니다" });
  }
});

export default router;
