"use client";

import { useEffect, useState } from "react";
import { PiggyBank } from "lucide-react";
import { localToday, type FundReminder } from "@/lib/plan-types";

/** 基金重仓池 SOP 常驻卡：季度任务 + 披露节点 + 下个窗口倒计时 */
export function FundSopCard({
  reminder,
  disclosureCalendar,
}: {
  reminder: FundReminder;
  disclosureCalendar: string[];
}) {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const today = localToday();
    const diff = Math.round(
      (new Date(`${reminder.nextDue}T00:00:00`).getTime() -
        new Date(`${today}T00:00:00`).getTime()) /
        86_400_000,
    );
    setDaysLeft(diff);
  }, [reminder.nextDue]);

  return (
    <div className="glass glass-tint-prospectus rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <PiggyBank className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">基金重仓池 SOP（每季度）</h3>
        {daysLeft !== null && daysLeft >= 0 && (
          <span className="ml-auto rounded-full bg-primary/12 px-2.5 py-1 text-xs text-primary tabular-nums">
            距 {reminder.nextDue.slice(5)} 还剩 {daysLeft} 天
          </span>
        )}
        {daysLeft !== null && daysLeft < 0 && (
          <span className="ml-auto rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground tabular-nums">
            {reminder.nextDue.slice(5)} 窗口已过，记得更新 next_due
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {reminder.quarterlyTask}
      </p>
      {disclosureCalendar.length > 0 && (
        <ul className="space-y-1 text-xs text-muted-foreground">
          {disclosureCalendar.map((line) => (
            <li key={line} className="flex items-center gap-1.5">
              <span className="size-1 rounded-full bg-primary/60" />
              {line}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
