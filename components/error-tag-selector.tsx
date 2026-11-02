"use client";

import { DRILL_ERROR_META, type DrillErrorType } from "@/lib/drill-types";
import { cn } from "@/lib/utils";

const ERRORS = Object.keys(DRILL_ERROR_META) as DrillErrorType[];

/** 错题归因选择器：四色卡片，选择后写入 localStorage */
export function ErrorTagSelector({
  drillId,
  current,
  onSelect,
}: {
  drillId: string;
  current: DrillErrorType | null;
  onSelect: (t: DrillErrorType) => void;
}) {
  const pick = (t: DrillErrorType) => {
    localStorage.setItem(`invest.drill.errorType.${drillId}`, t);
    onSelect(t);
  };

  return (
    <div className="space-y-2" role="radiogroup" aria-label="错误归因选择">
      <p className="text-sm font-medium">答错了？选一个归因（写入错题本）：</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {ERRORS.map((t) => {
          const meta = DRILL_ERROR_META[t];
          return (
            <button
              key={t}
              role="radio"
              aria-checked={current === t}
              onClick={() => pick(t)}
              className={cn(
                "flex min-h-11 flex-col items-start gap-0.5 rounded-xl p-3 text-left text-sm transition-colors",
                meta.color,
                current === t ? "ring-2 ring-primary/50" : "opacity-80 hover:opacity-100",
              )}
            >
              <span className="font-medium">
                {meta.icon} {meta.label}
              </span>
              <span className="text-xs leading-relaxed opacity-80">{meta.remedy}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
