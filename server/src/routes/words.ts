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

function toApiWord(row: WordRow) {
  return {
    id: row.id,
    english: row.english,
    korean: row.korean,
    pronunciation: row.pronunciation,
    exampleSentence: row.example_sentence,
    exampleTranslation: row.example_translation,
    wrongCount: row.wrong_count,
    correctCount: row.correct_count,
    studyDate: row.study_date,
    lastStudiedAt: row.last_studied_at,
  };
}

// GET /api/words - 단어 목록
router.get("/", (req: Request, res: Response) => {
  try {
    const { date } = req.query;

    let rows: WordRow[];
    if (date && typeof date === "string") {
      rows = db
        .prepare("SELECT * FROM words WHERE study_date = ? ORDER BY id")
        .all(date) as WordRow[];
    } else {
      rows = db.prepare("SELECT * FROM words ORDER BY id").all() as WordRow[];
    }

    res.json({ data: rows.map(toApiWord) });
  } catch (err) {
    res.status(500).json({ error: "단어 목록을 불러올 수 없습니다" });
  }
});

// GET /api/words/dates - 학습 날짜 목록
router.get("/dates", (_req: Request, res: Response) => {
  try {
    const rows = db
      .prepare("SELECT DISTINCT study_date FROM words ORDER BY study_date DESC")
      .all() as { study_date: string }[];

    res.json({ data: rows.map((r) => r.study_date) });
  } catch (err) {
    res.status(500).json({ error: "날짜 목록을 불러올 수 없습니다" });
  }
});

// GET /api/words/list - 영단어명만 반환 (중복 체크용, 경량)
router.get("/list", (_req: Request, res: Response) => {
  try {
    const rows = db
      .prepare("SELECT english FROM words ORDER BY id")
      .all() as { english: string }[];

    res.json({ data: rows.map((r) => r.english) });
  } catch (err) {
    res.status(500).json({ error: "단어 목록을 불러올 수 없습니다" });
  }
});

// GET /api/words/top-review - 복습 점수 상위 단어 (복습 선정용, 경량)
// 점수 = 오답률(60%) + 망각(40%)
router.get("/top-review", (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 10;
    // 한 번이라도 출제된 단어만 대상
    const rows = db
      .prepare(
        "SELECT id, english, korean, pronunciation, wrong_count, correct_count, study_date, last_studied_at FROM words WHERE (wrong_count + correct_count) > 0 ORDER BY id"
      )
      .all() as WordRow[];

    const now = Date.now();
    const scored = rows.map((r) => {
      const total = r.wrong_count + r.correct_count;
      const wrongRate = total > 0 ? r.wrong_count / total : 0;

      let daysSince = 7;
      if (r.last_studied_at) {
        const lastDate = new Date(r.last_studied_at.replace(" ", "T")).getTime();
        daysSince = Math.max((now - lastDate) / (1000 * 60 * 60 * 24), 0);
      }
      const forgetScore = Math.min(daysSince / 7, 1);

      const reviewScore = wrongRate * 0.6 + forgetScore * 0.4;

      return {
        id: r.id,
        english: r.english,
        korean: r.korean,
        pronunciation: r.pronunciation,
        wrongCount: r.wrong_count,
        correctCount: r.correct_count,
        studyDate: r.study_date,
        reviewScore: Math.round(reviewScore * 100) / 100,
      };
    });

    scored.sort((a, b) => b.reviewScore - a.reviewScore);

    res.json({ data: scored.slice(0, limit) });
  } catch (err) {
    res.status(500).json({ error: "단어를 불러올 수 없습니다" });
  }
});

// POST /api/words/import - 단어 일괄 추가
const importSchema = z.object({
  words: z.array(
    z.object({
      english: z.string().min(1),
      korean: z.string().min(1),
      pronunciation: z.string().optional(),
      exampleSentence: z.string().optional(),
      exampleTranslation: z.string().optional(),
      studyDate: z.string().min(1),
    })
  ),
});

router.post("/import", (req: Request, res: Response) => {
  try {
    const parsed = importSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "잘못된 요청 형식입니다" });
      return;
    }

    const { words } = parsed.data;
    const insert = db.prepare(
      "INSERT INTO words (english, korean, pronunciation, example_sentence, example_translation, study_date) VALUES (?, ?, ?, ?, ?, ?)"
    );

    let imported = 0;
    let skipped = 0;

    const importMany = db.transaction(() => {
      for (const w of words) {
        try {
          const existing = db
            .prepare(
              "SELECT id FROM words WHERE english = ? AND study_date = ?"
            )
            .get(w.english.trim(), w.studyDate) as { id: number } | undefined;

          if (existing) {
            skipped++;
            continue;
          }

          insert.run(w.english.trim(), w.korean.trim(), w.pronunciation || null, w.exampleSentence || null, w.exampleTranslation || null, w.studyDate);
          imported++;
        } catch {
          skipped++;
        }
      }
    });

    importMany();
    res.json({ data: { imported, skipped } });
  } catch (err) {
    res.status(500).json({ error: "단어 임포트에 실패했습니다" });
  }
});

// POST /api/words/add - 새 단어 추가 (english-teacher용)
const addSchema = z.object({
  english: z.string().min(1),
  korean: z.string().min(1),
  pronunciation: z.string().optional(),
  exampleSentence: z.string().optional(),
  exampleTranslation: z.string().optional(),
  studyDate: z.string().min(1),
});

router.post("/add", (req: Request, res: Response) => {
  try {
    const parsed = addSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "잘못된 요청 형식입니다" });
      return;
    }

    const { english, korean, pronunciation, exampleSentence, exampleTranslation, studyDate } = parsed.data;

    const result = db
      .prepare(
        "INSERT INTO words (english, korean, pronunciation, example_sentence, example_translation, study_date) VALUES (?, ?, ?, ?, ?, ?)"
      )
      .run(english.trim(), korean.trim(), pronunciation || null, exampleSentence || null, exampleTranslation || null, studyDate);

    const newWord = db
      .prepare("SELECT * FROM words WHERE id = ?")
      .get(result.lastInsertRowid) as WordRow;

    res.json({ data: toApiWord(newWord) });
  } catch (err) {
    res.status(500).json({ error: "단어 추가에 실패했습니다" });
  }
});

// PUT /api/words/reset-all - 전체 가중치 초기화
router.put("/reset-all", (_req: Request, res: Response) => {
  try {
    db.prepare(
      "UPDATE words SET wrong_count = 0, correct_count = 0, last_studied_at = NULL"
    ).run();

    const count = db.prepare("SELECT COUNT(*) as cnt FROM words").get() as { cnt: number };
    res.json({ data: { reset: true, count: count.cnt } });
  } catch (err) {
    res.status(500).json({ error: "전체 초기화에 실패했습니다" });
  }
});

// PUT /api/words/:id/reset - 가중치 초기화
router.put("/:id/reset", (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "잘못된 ID입니다" });
      return;
    }

    const existing = db
      .prepare("SELECT * FROM words WHERE id = ?")
      .get(id) as WordRow | undefined;

    if (!existing) {
      res.status(404).json({ error: "단어를 찾을 수 없습니다" });
      return;
    }

    db.prepare(
      "UPDATE words SET wrong_count = 0, correct_count = 0, last_studied_at = NULL WHERE id = ?"
    ).run(id);

    const updated = db
      .prepare("SELECT * FROM words WHERE id = ?")
      .get(id) as WordRow;

    res.json({ data: toApiWord(updated) });
  } catch (err) {
    res.status(500).json({ error: "가중치 초기화에 실패했습니다" });
  }
});

// DELETE /api/words/:id - 단어 삭제
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "잘못된 ID입니다" });
      return;
    }

    const existing = db
      .prepare("SELECT id FROM words WHERE id = ?")
      .get(id) as { id: number } | undefined;

    if (!existing) {
      res.status(404).json({ error: "단어를 찾을 수 없습니다" });
      return;
    }

    db.prepare("DELETE FROM words WHERE id = ?").run(id);

    res.json({ data: { deleted: true, id } });
  } catch (err) {
    res.status(500).json({ error: "단어 삭제에 실패했습니다" });
  }
});

export default router;
