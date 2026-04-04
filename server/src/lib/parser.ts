import fs from "fs";
import path from "path";

const STUDY_FILE_PATH = path.resolve(__dirname, "../../../today_study.txt");

interface WordPreview {
  number: number;
  english: string;
  korean: string;
  pronunciation: string;
}

interface WordDetail {
  number: number;
  english: string;
  korean: string;
  pronunciation: string;
  examples: Array<{
    english: string;
    korean: string;
  }>;
  grammar: string[];
  vocabulary: Array<{
    word: string;
    meaning: string;
  }>;
}

export interface StudyContent {
  date: string;
  preview: WordPreview[];
  details: WordDetail[];
  rawContent: string;
}

export function parseTodayStudy(): StudyContent | null {
  if (!fs.existsSync(STUDY_FILE_PATH)) {
    return null;
  }

  const raw = fs.readFileSync(STUDY_FILE_PATH, "utf-8");
  const lines = raw.split("\n");

  // 첫 줄에서 날짜 추출
  const dateMatch = lines[0]?.match(/\d{4}-\d{2}-\d{2}/);
  const date = dateMatch ? dateMatch[0] : "";

  // 구분선(────)으로 섹션 분리
  const separator = "────────────────────────";
  const sections = raw.split(separator);

  // 첫 번째 섹션: 미리보기 목록
  const previewSection = sections[0] || "";
  const preview: WordPreview[] = [];

  const previewLines = previewSection.split("\n");
  for (const line of previewLines) {
    const match = line.match(/^(\d+)\.\s+(.+?)\s+\/\s+(.+?)\s+\/\s+(.*)$/);
    if (match) {
      preview.push({
        number: parseInt(match[1]),
        english: match[2].trim(),
        korean: match[3].trim(),
        pronunciation: match[4].trim(),
      });
    }
  }

  // 나머지 섹션: 상세 내용
  const details: WordDetail[] = [];

  for (let i = 1; i < sections.length; i++) {
    const section = sections[i].trim();
    if (!section) continue;

    const sectionLines = section.split("\n");
    const headerMatch = sectionLines[0]?.match(
      /^(\d+)\.\s+(.+?)\s+\((.+?)\)\s+\/\s+(.+)$/
    );
    if (!headerMatch) continue;

    const detail: WordDetail = {
      number: parseInt(headerMatch[1]),
      english: headerMatch[2].trim(),
      korean: headerMatch[3].trim(),
      pronunciation: headerMatch[4].trim(),
      examples: [],
      grammar: [],
      vocabulary: [],
    };

    let currentMode: "example" | "grammar" | "vocabulary" | null = null;

    for (let j = 1; j < sectionLines.length; j++) {
      const line = sectionLines[j];

      if (line.includes("문법")) {
        currentMode = "grammar";
        continue;
      }
      if (line.includes("단어")) {
        currentMode = "vocabulary";
        continue;
      }

      if (line.startsWith("*") && currentMode === null) {
        // 예문 영어
        const nextLine = sectionLines[j + 1];
        if (nextLine && nextLine.trim().startsWith("→")) {
          detail.examples.push({
            english: line.replace(/^\*\s*/, "").trim(),
            korean: nextLine.replace(/^\s*→\s*/, "").trim(),
          });
          j++; // 다음 줄 건너뛰기
        }
      } else if (line.startsWith("*") && currentMode === "grammar") {
        detail.grammar.push(line.replace(/^\*\s*/, "").trim());
      } else if (line.startsWith("*") && currentMode === "vocabulary") {
        const vocabMatch = line.match(/^\*\s*(.+?):\s*(.+)$/);
        if (vocabMatch) {
          detail.vocabulary.push({
            word: vocabMatch[1].trim(),
            meaning: vocabMatch[2].trim(),
          });
        }
      }
    }

    details.push(detail);
  }

  return { date, preview, details, rawContent: raw };
}
