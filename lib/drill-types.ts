/** 客户端安全的习题库类型与工具（禁止 import node 模块） */

export type DrillType = "calculation" | "concept" | "case" | "trap";

export const DRILL_TYPE_LABELS: Record<DrillType, string> = {
  calculation: "计算题",
  concept: "概念题",
  case: "案例题",
  trap: "陷阱题",
};

/** 四类错误归因（与 /guide 章节8 四色卡对应） */
export type DrillErrorType =
  | "concept-blur"
  | "calc-error"
  | "assumption-wrong"
  | "data-misread";

export const DRILL_ERROR_META: Record<
  DrillErrorType,
  { label: string; color: string; icon: string; remedy: string }
> = {
  "concept-blur": {
    label: "概念混淆",
    color: "bg-blue-500/15 text-blue-600 dark:text-blue-300",
    icon: "🔵",
    remedy: "回 /concepts 重读费曼讲解，重新裸讲录音",
  },
  "calc-error": {
    label: "计算错误",
    color: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
    icon: "🟡",
    remedy: "同类计算连续 5 道全对才算过——不是粗心，是自动化不足",
  },
  "assumption-wrong": {
    label: "前提假设错",
    color: "bg-violet-500/15 text-violet-600 dark:text-violet-300",
    icon: "🟣",
    remedy: "读题先写「已知什么、求什么」再动笔",
  },
  "data-misread": {
    label: "数据理解错",
    color: "bg-red-500/15 text-red-600 dark:text-red-300",
    icon: "🔴",
    remedy: "先看单位、再看口径、再看时间区间，三连问后再计算",
  },
};

export interface DrillMeta {
  /** 文件名 = id，如 drill-2026-11-03-sharpe */
  id: string;
  /** YYYY-MM-DD */
  date: string;
  conceptId: string;
  /** 1-5 */
  difficulty: number;
  type: DrillType;
  question: string;
  hint: string;
  standardSolution: string;
  /** YAML 里的初始归因（null = 未作答） */
  errorType: DrillErrorType | null;
  reflection: string;
  mySolution: string;
}

/** localStorage key 规范（见 AGENTS.md） */
export function drillAnswerKey(id: string): string {
  return `invest.drill.answer.${id}`;
}
export function drillErrorTypeKey(id: string): string {
  return `invest.drill.errorType.${id}`;
}
export function drillStageKey(id: string): string {
  return `invest.drill.stage.${id}`;
}
