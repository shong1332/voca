import Database, { type Database as DatabaseType } from "better-sqlite3";
import path from "path";

const DB_PATH = path.resolve(__dirname, "../../../data/study.db");

const db: DatabaseType = new Database(DB_PATH);

// WAL 모드로 성능 향상
db.pragma("journal_mode = WAL");

// 테이블 생성
db.exec(`
  CREATE TABLE IF NOT EXISTS words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    english TEXT NOT NULL,
    korean TEXT NOT NULL,
    pronunciation TEXT,
    example_sentence TEXT,
    example_translation TEXT,
    wrong_count INTEGER DEFAULT 0,
    correct_count INTEGER DEFAULT 0,
    study_date TEXT NOT NULL,
    last_studied_at TEXT
  );
`);

// DB가 비어있으면 시드 데이터 삽입
const count = db.prepare("SELECT COUNT(*) as cnt FROM words").get() as {
  cnt: number;
};

if (count.cnt === 0) {
  const seedWords = [
    { english: "pursue", korean: "추구하다", pronunciation: "퍼슈", exSen: "She decided to pursue her dream of becoming a doctor.", exTr: "그녀는 의사가 되겠다는 꿈을 추구하기로 결심했다." },
    { english: "deprecated", korean: "더 이상 사용되지 않는", pronunciation: "데프리케이티드", exSen: "This function is deprecated and will be removed in the next version.", exTr: "이 함수는 더 이상 사용되지 않으며 다음 버전에서 제거될 예정이다." },
    { english: "beneath", korean: "~아래에", pronunciation: "비니쓰", exSen: "The cat was sleeping beneath the enormous oak tree in the garden.", exTr: "고양이가 정원의 거대한 참나무 아래에서 자고 있었다." },
    { english: "resolve", korean: "해결하다", pronunciation: "리졸브", exSen: "The team worked together to resolve the merge conflict before the deadline.", exTr: "팀은 마감 전에 머지 충돌을 해결하기 위해 함께 작업했다." },
    { english: "enormous", korean: "거대한", pronunciation: "이노머스", exSen: "The new shopping mall is so enormous that it takes an hour to walk through it.", exTr: "새 쇼핑몰이 너무 거대해서 걸어서 돌아보는 데 한 시간이 걸린다." },
    { english: "threshold", korean: "임계값, 문턱", pronunciation: "쓰레숄드", exSen: "The server crashes when memory usage exceeds the threshold.", exTr: "메모리 사용량이 임계값을 초과하면 서버가 다운된다." },
    { english: "occasion", korean: "경우, 행사", pronunciation: "어케이젼", exSen: "On this special occasion, the whole family gathered to celebrate together.", exTr: "이 특별한 행사에 온 가족이 함께 축하하기 위해 모였다." },
    { english: "verbose", korean: "장황한, 상세한", pronunciation: "버보스", exSen: "The error log was too verbose, so it was hard to find the actual problem.", exTr: "에러 로그가 너무 장황해서 실제 문제를 찾기 어려웠다." },
    { english: "reluctant", korean: "꺼리는, 주저하는", pronunciation: "릴럭턴트", exSen: "He was reluctant to allocate more budget to the project without clear results.", exTr: "그는 명확한 결과 없이 프로젝트에 더 많은 예산을 할당하기를 꺼렸다." },
    { english: "allocate", korean: "할당하다", pronunciation: "앨로케이트", exSen: "The system failed to allocate enough memory, which caused the process to crash.", exTr: "시스템이 충분한 메모리를 할당하지 못해서 프로세스가 다운되었다." },
  ];

  const insert = db.prepare(
    "INSERT INTO words (english, korean, pronunciation, example_sentence, example_translation, study_date) VALUES (?, ?, ?, ?, ?, ?)"
  );

  const insertMany = db.transaction((words: typeof seedWords) => {
    for (const w of words) {
      insert.run(w.english, w.korean, w.pronunciation, w.exSen, w.exTr, "2026-04-04");
    }
  });

  insertMany(seedWords);
  console.log(`[DB] 시드 데이터 ${seedWords.length}개 삽입 완료`);
}

// 일일 출제 단어 테이블 (복습 단어 포함)
db.exec(`
  CREATE TABLE IF NOT EXISTS daily_words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    study_date TEXT NOT NULL,
    word_id INTEGER NOT NULL,
    FOREIGN KEY (word_id) REFERENCES words(id)
  );
`);

// 접속 로그 테이블 생성
db.exec(`
  CREATE TABLE IF NOT EXISTS access_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device TEXT NOT NULL,
    page TEXT NOT NULL,
    accessed_at TEXT NOT NULL
  );
`);

export default db;
