import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  CONCEPT_CATEGORIES,
  type Concept,
  type ConceptCategory,
  type ConceptMeta,
  type ConceptStatus,
} from "@/lib/concept-types";

const CONCEPTS_DIR = path.join(process.cwd(), "content", "concepts");

const STATUSES: ConceptStatus[] = ["new", "learning", "learned", "mastered"];

/** 正文按 ## 标题切分为章节（保持原文顺序） */
function splitSections(body: string): Concept["sections"] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const sections: Concept["sections"] = [];
  let current: { title: string; lines: string[] } | null = null;
  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current) {
        sections.push({
          title: current.title,
          content: current.lines.join("\n").trim(),
        });
      }
      current = { title: line.slice(3).trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) {
    sections.push({
      title: current.title,
      content: current.lines.join("\n").trim(),
    });
  }
  return sections;
}

function parseConcept(filename: string): Concept {
  const id = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(CONCEPTS_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  const category = CONCEPT_CATEGORIES.includes(data.category)
    ? (data.category as ConceptCategory)
    : (() => {
        throw new Error(`[concepts] ${filename} category 非法: ${String(data.category)}`);
      })();

  const status = STATUSES.includes(data.status)
    ? (data.status as ConceptStatus)
    : "new";

  const meta: ConceptMeta = {
    id,
    name: String(data.name ?? id),
    en: String(data.en ?? ""),
    category,
    formula: String(data.formula ?? ""),
    difficulty: Number(data.difficulty ?? 1),
    prerequisite: Array.isArray(data.prerequisite)
      ? data.prerequisite.map(String)
      : [],
    related: Array.isArray(data.related) ? data.related.map(String) : [],
    status,
    firstLearned: String(data.first_learned ?? ""),
    reviewSchedule: Array.isArray(data.review_schedule)
      ? data.review_schedule.map(Number)
      : [1, 3, 7, 15, 30],
  };

  return { ...meta, sections: splitSections(content) };
}

/** 全部概念，按分类再按 id 排序 */
export function getAllConcepts(): Concept[] {
  if (!fs.existsSync(CONCEPTS_DIR)) return [];
  return fs
    .readdirSync(CONCEPTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parseConcept)
    .sort(
      (a, b) =>
        CONCEPT_CATEGORIES.indexOf(a.category) -
          CONCEPT_CATEGORIES.indexOf(b.category) || a.id.localeCompare(b.id),
    );
}

export function getConcept(id: string): Concept | undefined {
  return getAllConcepts().find((c) => c.id === id);
}
