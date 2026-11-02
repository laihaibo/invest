"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PlanItemCard } from "@/components/plan-item-card";
import { NEXT_STATUS } from "@/components/plan-status-button";
import {
  localToday,
  planStatusKey,
  type MonthPlan,
  type PlanStatus,
} from "@/lib/plan-types";

function ProgressRing({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? done / total : 0;
  const r = 15;
  const c = 2 * Math.PI * r;
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="shrink-0">
      <circle cx="20" cy="20" r={r} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="4" />
      <circle
        cx="20" cy="20" r={r} fill="none" stroke="var(--primary)" strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${c * pct} ${c}`}
        transform="rotate(-90 20 20)"
      />
      <text x="20" y="24" textAnchor="middle" fontSize="10" fill="currentColor">
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
}

export function PlanMonthView({ plans }: { plans: MonthPlan[] }) {
  // plans 按月份倒序，默认显示最新月
  const [idx, setIdx] = useState(0);
  const [today, setToday] = useState("");
  const [overrides, setOverrides] = useState<Record<string, PlanStatus>>({});

  useEffect(() => {
    setToday(localToday());
    const map: Record<string, PlanStatus> = {};
    for (const plan of plans) {
      for (const it of plan.items) {
        const v = localStorage.getItem(planStatusKey(it.date));
        if (v === "done" || v === "todo" || v === "skipped") {
          map[it.date] = v;
        }
      }
    }
    setOverrides(map);
  }, [plans]);

  if (plans.length === 0 || !plans[idx]) {
    return (
      <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">
        还没有任何月度计划。在 content/plans/ 下新建 YYYY-MM.yaml 并 push。
      </div>
    );
  }

  const plan = plans[idx];
  const items = plan.items.map((it) => ({
    ...it,
    status: overrides[it.date] ?? it.status,
  }));
  const done = items.filter((i) => i.status === "done").length;

  const setStatus = (date: string, next: PlanStatus) => {
    localStorage.setItem(planStatusKey(date), next);
    setOverrides((prev) => ({ ...prev, [date]: next }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button aria-label="上一月" onClick={() => setIdx((i) => Math.min(i + 1, plans.length - 1))}
          className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <ChevronLeft className="size-5" />
        </button>
        <p className="text-lg font-semibold tabular-nums">
          {plan.month.replace("-", " 年 ")} 月
        </p>
        <button aria-label="下一月" onClick={() => setIdx((i) => Math.max(i - 1, 0))}
          className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="glass glass-tint-quant rounded-2xl p-5 space-y-2">
        <p className="text-sm text-muted-foreground">本月主题</p>
        <p className="font-semibold leading-snug">{plan.theme}</p>
        {plan.weeklyThemes.map((w) => (
          <p key={w.week} className="text-xs text-muted-foreground">
            W{w.week} {w.title} · {w.note}
          </p>
        ))}
      </div>

      {today && items.some((i) => i.date === today) && (
        <p className="text-xs text-muted-foreground">
          今日任务在列表中已用高亮标记（{today.slice(5)}）
        </p>
      )}

      <div className="space-y-3">
        {items.map((it) => (
          <PlanItemCard
            key={`${it.date}-${it.title}`}
            item={it}
            isToday={today !== "" && it.date === today}
            onToggleStatus={() => setStatus(it.date, NEXT_STATUS[it.status])}
          />
        ))}
      </div>

      <div className="glass rounded-2xl p-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          本月完成 {done} / {items.length} 项
        </p>
        <ProgressRing done={done} total={items.length} />
      </div>
    </div>
  );
}
