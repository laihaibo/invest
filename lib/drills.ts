import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  DrillErrorType,
  DrillMeta,
  DrillType,
} from "@/lib/drill-types";

const DRILLS_DIR = path.join(process.cwd(), "content", "drills");

const TYPES: DrillType[] = ["calculation", "concept", "case", "trap"];
const ERRORS: DrillErrorType[] = [
  "concept-blur",
  "calc-error",
  "assumption-wrong",
  "data-misread",
];

function parseDrill(filename: string): DrillMeta {
  const id = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(DRILLS_DIR, filename), "utf8");
  const { data } = matter(raw);

  const type = TYPES.includes(data.type)
    ? (data.type as DrillType)
    : "calculation";

  const errorType =
    typeof data.error_type === "string" && ERRORS.includes(data.error_type as DrillErrorType)
      ? (data.error_type as DrillErrorType)
      : null;

  return {
    id,
    date: String(data.date ?? ""),
    conceptId: String(data.concept_id ?? ""),
    difficulty: Number(data.difficulty ?? 3),
    type,
    question: String(data.question ?? "").trim(),
    hint: String(data.hint ?? "").trim(),
    standardSolution: String(data.standard_solution ?? "").trim(),
    errorType,
    reflection: String(data.reflection ?? "").trim(),
    mySolution: String(data.my_solution ?? "").trim(),
  };
}

/** 全部习题，日期倒序 */
export function getAllDrills(): DrillMeta[] {
  if (!fs.existsSync(DRILLS_DIR)) return [];
  return fs
    .readdirSync(DRILLS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parseDrill)
    .sort((a, b) => b.id.localeCompare(a.id));
}

export function getDrillsByConcept(conceptId: string): DrillMeta[] {
  return getAllDrills().filter((d) => d.conceptId === conceptId);
}
