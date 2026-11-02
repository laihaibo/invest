"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { checklistKey, localToday } from "@/lib/plan-types";

const ITEMS = [
  "审计意见无保留",
  "事务所未更换",
  "净利润与经营现金流 3 年同向",
  "应收账款账龄占比已核对",
  "关联交易金额与定价已核对",
  "或有事项（担保/诉讼/贴现票据）已核对",
  "会计政策变更已核对",
  "Non-GAAP 调整项口径已核对",
  "MD&A 措辞与上期对比完成",
  "能用费曼法讲清这家公司的商业模式",
];

/** 一页检查清单：localStorage 按当天日期记忆，每日自动重置 */
export function ChecklistPanel() {
  const [today, setToday] = useState("");
  const [checked, setChecked] = useState<number[]>([]);

  useEffect(() => {
    const d = localToday();
    setToday(d);
    const raw = localStorage.getItem(checklistKey(d));
    if (raw) {
      try {
        setChecked(JSON.parse(raw) as number[]);
      } catch {
        setChecked([]);
      }
    }
  }, []);

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = prev.includes(i)
        ? prev.filter((x) => x !== i)
        : [...prev, i];
      localStorage.setItem(checklistKey(today), JSON.stringify(next));
      return next;
    });
  };

  const allDone = checked.length === ITEMS.length;
  const lastUnchecked = !checked.includes(ITEMS.length - 1);

  return (
    <div className="space-y-3">
      {lastUnchecked && allDone === false && (
        <div className="rounded-xl bg-amber-500/12 px-4 py-2.5 text-sm text-amber-600 dark:text-amber-300">
          费曼法验收未通过，建议回附注再读一遍。
        </div>
      )}
      {allDone && (
        <div className="rounded-xl bg-teal-500/12 px-4 py-2.5 text-sm text-teal-600 dark:text-teal-300">
          全部通过，这篇财报可以归档了。
        </div>
      )}
      <div className="glass rounded-2xl p-4 space-y-1">
        {ITEMS.map((label, i) => (
          <label
            key={label}
            className="flex min-h-10 cursor-pointer items-center gap-3 rounded-xl px-2 transition-colors hover:bg-accent/60"
          >
            <Checkbox
              checked={checked.includes(i)}
              onCheckedChange={() => toggle(i)}
            />
            <span className="text-sm">{label}</span>
          </label>
        ))}
      </div>
      <button
        onClick={() => {
          setChecked([]);
          localStorage.setItem(checklistKey(today), "[]");
        }}
        className="rounded-full bg-secondary px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        清空本日清单
      </button>
      <p className="text-xs text-muted-foreground">
        清单按当天日期记忆，第二天自动重置。
      </p>
    </div>
  );
}
