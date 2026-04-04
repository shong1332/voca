import { Router, Request, Response } from "express";
import db from "../lib/db";

const router = Router();

interface AccessLogRow {
  id: number;
  device: string;
  page: string;
  accessed_at: string;
}

// GET /api/access-log - 접속 로그 조회
router.get("/", (req: Request, res: Response) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 1000);
    const device = req.query.device as string | undefined;

    let rows: AccessLogRow[];
    if (device && ["iPhone", "Android", "PC"].includes(device)) {
      rows = db
        .prepare(
          "SELECT * FROM access_log WHERE device = ? ORDER BY id DESC LIMIT ?"
        )
        .all(device, limit) as AccessLogRow[];
    } else {
      rows = db
        .prepare("SELECT * FROM access_log ORDER BY id DESC LIMIT ?")
        .all(limit) as AccessLogRow[];
    }

    res.json({
      data: rows.map((row) => ({
        id: row.id,
        device: row.device,
        page: row.page,
        accessedAt: row.accessed_at,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: "접속 로그를 불러올 수 없습니다" });
  }
});

// GET /api/access-log/stats - 접속 통계
router.get("/stats", (_req: Request, res: Response) => {
  try {
    const total = db
      .prepare("SELECT COUNT(*) as cnt FROM access_log")
      .get() as { cnt: number };

    const byDeviceRows = db
      .prepare(
        "SELECT device, COUNT(*) as cnt FROM access_log GROUP BY device"
      )
      .all() as { device: string; cnt: number }[];

    const byDevice: Record<string, number> = {
      iPhone: 0,
      Android: 0,
      PC: 0,
    };
    for (const row of byDeviceRows) {
      byDevice[row.device] = row.cnt;
    }

    // KST 기준 오늘 날짜
    const now = new Date();
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const todayStr = kst.toISOString().substring(0, 10);

    const todayResult = db
      .prepare(
        "SELECT COUNT(*) as cnt FROM access_log WHERE accessed_at LIKE ?"
      )
      .get(`${todayStr}%`) as { cnt: number };

    res.json({
      data: {
        total: total.cnt,
        byDevice,
        today: todayResult.cnt,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "접속 통계를 불러올 수 없습니다" });
  }
});

export default router;
