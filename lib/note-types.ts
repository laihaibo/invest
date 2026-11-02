/** 客户端安全的共享类型与工具（禁止 import node 模块） */

export type NoteType = "quant" | "report" | "prospectus";

export const NOTE_TYPES: readonly NoteType[] = [
  "quant",
  "report",
  "prospectus",
] as const;

export const NOTE_TYPE_LABELS: Record<NoteType, string> = {
  quant: "量化学习",
  report: "财报精读",
  prospectus: "招股书精读",
};

/** frontmatter 规范见 AGENTS.md；date 是日历与归档的主键 */
export interface NoteMeta {
  /** 文件名（不含扩展名），如 2026-10-31-sharp-ratio */
  slug: string;
  type: NoteType;
  /** YYYY-MM-DD */
  date: string;
  title: string;
  tags: string[];
  /** 一句话核心观点 */
  thesis: string;
  // quant 专用
  problem?: string;
  myAnswer?: string;
  reflection?: string;
  // report / prospectus 专用
  company?: string;
  sector?: string;
  /** 1-5 星 */
  rating?: number;
}

export interface Note extends NoteMeta {
  /** frontmatter --- 之后的 Markdown 正文 */
  content: string;
}

/** YYYY-MM-DD → "2026 年 11 月 02 日" */
export function formatDateCN(date: string): string {
  const parts = date.split("-");
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];
  return `${y} 年 ${m} 月 ${d} 日`;
}
