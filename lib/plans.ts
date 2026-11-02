import fs from "node:fs";
import path from "node:path";
import { load as loadYaml } from "js-yaml";
import type {
  MonthPlan,
  PlanItem,
  PlanItemType,
  PlanPriority,
  PlanStatus,
} from "@/lib/plan-types";

const PLANS_DIR = path.join(process.cwd(), "content", "plans");

const TYPES: PlanItemType[] = ["report", "prospectus", "fund", "review"];
const PRIORITIES: PlanPriority[] = ["high", "medium", "low"];
const STATUSES: PlanStatus[] = ["done", "todo", "skipped"];

/** YAML 里日期可能被解析成 Date 对象，统一转 YYYY-MM-DD 字符串 */
function coerceDate(v: unknown): string {
  if (v instanceof Date) {
    return v.toISOString().slice(0, 10);
  }
  return typeof v === "string" ? v : "";
}

function pickEnum<T extends string>(list: T[], v: unknown, fallback: T): T {
  return list.includes(v as T) ? (v as T) : fallback;
}

function parsePlan(raw: unknown, filename: string): MonthPlan | undefined {
  if (typeof raw !== "object" || raw === null) return undefined;
  const d = raw as Record<string, unknown>;

  const month = String(d.month ?? "");
  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw new Error(
      `[plans] ${filename} 的 month 必须是 "YYYY-MM" 带引号字符串`,
    );
  }

  const items: unknown[] = Array.isArray(d.items) ? d.items : [];
  const parsed: PlanItem[] = items.map((it) => {
    const item = (it ?? {}) as Record<string, unknown>;
    const source = item.source as { name?: unknown; url?: unknown } | undefined;
    return {
      date: coerceDate(item.date),
      company: String(item.company ?? "未填写"),
      type: pickEnum(TYPES, item.type, "report"),
      title: String(item.title ?? "未命名"),
      source: {
        name: String(source?.name ?? ""),
        url: typeof source?.url === "string" ? source.url : undefined,
      },
      priority: pickEnum(PRIORITIES, item.priority, "medium"),
      status: pickEnum(STATUSES, item.status, "todo"),
      notes: typeof item.notes === "string" ? item.notes : undefined,
    };
  });

  parsed.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  const fund = d.fund_reminder as Record<string, unknown> | undefined;
  const weeks = Array.isArray(d.weekly_themes) ? d.weekly_themes : [];

  return {
    month,
    theme: String(d.theme ?? ""),
    weeklyThemes: weeks.map((w, i) => {
      const w0 = (w ?? {}) as Record<string, unknown>;
      return {
        week: Number(w0.week ?? i + 1),
        title: String(w0.title ?? ""),
        note: String(w0.note ?? ""),
      };
    }),
    items: parsed,
    fundReminder: fund
      ? {
          quarterlyTask: String(fund.quarterly_task ?? ""),
          nextDue: coerceDate(fund.next_due),
        }
      : undefined,
    disclosureCalendar: Array.isArray(d.disclosure_calendar)
      ? d.disclosure_calendar.map(String)
      : [],
  };
}

/** 全部月度计划，月份倒序 */
export function getAllPlans(): MonthPlan[] {
  if (!fs.existsSync(PLANS_DIR)) return [];
  const plans: MonthPlan[] = [];
  for (const f of fs.readdirSync(PLANS_DIR)) {
    if (!f.endsWith(".yaml")) continue;
    const raw = loadYaml(fs.readFileSync(path.join(PLANS_DIR, f), "utf8"));
    const plan = parsePlan(raw, f);
    if (plan) plans.push(plan);
  }
  plans.sort((a, b) => (a.month < b.month ? 1 : -1));
  return plans;
}
