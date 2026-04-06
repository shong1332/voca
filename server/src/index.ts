import express from "express";
import cors from "cors";
import path from "path";

// DB 초기화 (import 시 자동 실행)
import "./lib/db";

import wordsRouter from "./routes/words";
import quizRouter from "./routes/quiz";
import studyRouter from "./routes/study";

const app = express();
const PORT = 3001;

// 미들웨어
app.use(cors());
app.use(express.json());

// API 라우터
app.use("/api/words", wordsRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/study", studyRouter);

// 헬스체크
app.get("/api/health", (_req, res) => {
  res.json({ data: { status: "ok", timestamp: new Date().toISOString() } });
});

// 클라이언트 정적 파일 서빙 (배포용)
const clientDist = path.resolve(__dirname, "../../client/dist");
app.use("/voca", express.static(clientDist));
app.get("/voca/{*path}", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`[Server] http://localhost:${PORT} 에서 실행 중`);
  console.log(`[Server] API: http://localhost:${PORT}/api`);
});

export default app;
