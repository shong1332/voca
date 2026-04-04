import express from "express";
import cors from "cors";

// DB 초기화 (import 시 자동 실행)
import db from "./lib/db";

import wordsRouter from "./routes/words";
import quizRouter from "./routes/quiz";
import studyRouter from "./routes/study";
import accessLogRouter from "./routes/accessLog";

const app = express();
const PORT = 3001;

// 미들웨어
app.use(cors());
app.use(express.json());

// 접속 로그 미들웨어
const EXCLUDED_PATHS = ["/api/health", "/api/access-log"];

app.use("/api", (req, _res, next) => {
  const fullPath = `/api${req.path}`;

  // 제외 경로 체크
  const shouldExclude = EXCLUDED_PATHS.some(
    (excluded) => fullPath === excluded || fullPath.startsWith(excluded + "/")
  );

  if (!shouldExclude) {
    const ua = req.headers["user-agent"] || "";
    let device = "PC";
    if (ua.includes("iPhone")) {
      device = "iPhone";
    } else if (ua.includes("Android")) {
      device = "Android";
    }

    // KST 시간 생성
    const now = new Date();
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const accessedAt = kst.toISOString().replace("T", " ").substring(0, 19);

    try {
      db.prepare(
        "INSERT INTO access_log (device, page, accessed_at) VALUES (?, ?, ?)"
      ).run(device, fullPath, accessedAt);
    } catch (err) {
      console.error("[AccessLog] 로그 기록 실패:", err);
    }
  }

  next();
});

// 라우터 등록
app.use("/api/words", wordsRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/study", studyRouter);
app.use("/api/access-log", accessLogRouter);

// 헬스체크
app.get("/api/health", (_req, res) => {
  res.json({ data: { status: "ok", timestamp: new Date().toISOString() } });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`[Server] http://localhost:${PORT} 에서 실행 중`);
  console.log(`[Server] API: http://localhost:${PORT}/api`);
});

export default app;
