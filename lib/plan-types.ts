/** 客户端安全的计划数据类型与工具（禁止 import node 模块） */

export type PlanItemType = "report" | "prospectus" | "fund" | "review";

export type PlanPriority = "high" | "medium" | "low";

export type PlanStatus = "done" | "todo" | "skipped";

export interface PlanSource {
  name: string;
  url?: string;
}

export interface PlanItem {
  /** YYYY-MM-DD */
  date: string;
  company: string;
  type: PlanItemType;
  title: string;
  source?: PlanSource;
  priority: PlanPriority;
  /** YAML 里的初始默认值；用户改动存 localStorage */
  status: PlanStatus;
  notes?: string;
}

export interface WeeklyTheme {
  week: number;
  title: string;
  note: string;
}

export interface FundReminder {
  quarterlyTask: string;
  /** YYYY-MM-DD，下一季报披露窗口 */
  nextDue: string;
}

export interface MonthPlan {
  /** YYYY-MM */
  month: string;
  theme: string;
  weeklyThemes: WeeklyTheme[];
  /** 按日期升序 */
  items: PlanItem[];
  fundReminder?: FundReminder;
  disclosureCalendar: string[];
}

/** localStorage key 规范：invest.plan.status.2026-11-02 */
export function planStatusKey(date: string): string {
  return `invest.plan.status.${date}`;
}

/** localStorage key 规范：invest.checklist.2026-11-02（每日重置） */
export function checklistKey(date: string): string {
  return `invest.checklist.${date}`;
}

/** 客户端本地日期 YYYY-MM-DD（挂载后调用） */
export function localToday(): string {
  const now = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}
