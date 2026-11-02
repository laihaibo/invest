"use client";

import { useEffect, useState } from "react";
import { CalendarCheck } from "lucide-react";
import { localToday, type PlanItem } from "@/lib/plan-types";

/** 首页「今日计划」卡：从当月 YAML 找 date=今天的条目 */
export function TodayPlanCard({ items }: { items: PlanItem[] }) {
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(localToday());
  }, []);

  const todayItems = today
    ? items.filter((i) => i.date === today)
    : [];

  return (
    <div className="glass glass-tint-report rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <CalendarCheck className="size-4 text-primary" />
        <p className="text-sm font-medium">今日计划</p>
        <p className="ml-auto text-xs tabular-nums text-muted-foreground">
          {today || "…"}
        </p>
      </div>
      {todayItems.length === 0 ? (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {today
            ? "今日无既定任务，可自由研究或补作业。"
            : "加载中…"}
        </p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {todayItems.map((it) => (
            <li key={it.date + it.title} className="text-sm leading-relaxed">
              <span className="font-medium">{it.company}</span>
              <span className="text-muted-foreground"> · {it.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
