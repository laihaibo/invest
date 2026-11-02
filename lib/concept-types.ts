/** 客户端安全的概念库类型与工具（禁止 import node 模块） */

export const CONCEPT_CATEGORIES = [
  "统计基础",
  "收益风险指标",
  "组合理论",
  "选股因子",
  "回测方法论",
  "衍生品基础",
] as const;

export type ConceptCategory = (typeof CONCEPT_CATEGORIES)[number];

export type ConceptStatus = "new" | "learning" | "learned" | "mastered";

export interface ConceptMeta {
  /** 文件名 = id，如 sharpe-ratio */
  id: string;
  name: string;
  en: string;
  category: ConceptCategory;
  formula: string;
  /** 1-5 */
  difficulty: number;
  prerequisite: string[];
  related: string[];
  /** YAML 默认值；用户改动存 localStorage */
  status: ConceptStatus;
  /** YYYY-MM-DD */
  firstLearned: string;
  /** 复习间隔天数，如 [1,3,7,15,30] */
  reviewSchedule: number[];
}

export interface ConceptSection {
  title: string;
  content: string;
}

export interface Concept extends ConceptMeta {
  /** 正文按 ## 标题切分的章节（保持原文顺序） */
  sections: ConceptSection[];
}

/** localStorage key 规范（见 AGENTS.md） */
export function conceptStatusKey(id: string): string {
  return `invest.concept.status.${id}`;
}
export function conceptLastReviewKey(id: string): string {
  return `invest.concept.lastReview.${id}`;
}

/** YYYY-MM-DD → 距今天数（客户端本地时区） */
export function daysSince(date: string): number {
  const now = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  const today = `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
  const diff =
    new Date(`${today}T00:00:00`).getTime() -
    new Date(`${date}T00:00:00`).getTime();
  return Math.round(diff / 86_400_000);
}

/** 待复习：learning/learned 且距上次复习（缺省 first_learned）≥1 天 */
export function isDueForReview(
  concept: ConceptMeta,
  lastReview: string | null,
): boolean {
  if (concept.status === "new" || concept.status === "mastered") return false;
  return daysSince(lastReview ?? concept.firstLearned) >= 1;
}
