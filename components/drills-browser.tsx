"use client";

import { useEffect, useMemo, useState } from "react";
import { DrillCard } from "@/components/drill-card";
import {
  DRILL_ERROR_META,
  type DrillErrorType,
  type DrillMeta,
} from "@/lib/drill-types";
import { cn } from "@/lib/utils";

const ERRORS = Object.keys(DRILL_ERROR_META) as DrillErrorType[];

/** 习题筛选浏览器：错题本 / 错误类型 / 难度 */
export function DrillsBrowser({
  drills,
  conceptNames,
}: {
  drills: DrillMeta[];
  conceptNames: Record<string, string>;
}) {
  const [onlyWrong, setOnlyWrong] = useState(false);
  const [errFilter, setErrFilter] = useState<DrillErrorType | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errorTypes, setErrorTypes] = useState<Record<string, DrillErrorType | null>>({});

  useEffect(() => {
    const a: Record<string, string> = {};
    const e: Record<string, DrillErrorType | null> = {};
    for (const d of drills) {
      a[d.id] = localStorage.getItem(`invest.drill.answer.${d.id}`) ?? "";
      const et = localStorage.getItem(`invest.drill.errorType.${d.id}`);
      e[d.id] =
        et === "concept-blur" || et === "calc-error" || et === "assumption-wrong" || et === "data-misread"
          ? (et as DrillErrorType)
          : d.errorType;
    }
    setAnswers(a);
    setErrorTypes(e);
  }, [drills]);

  const filtered = useMemo(
    () =>
      drills.filter((d) => {
        const et = errorTypes[d.id] ?? d.errorType;
        if (onlyWrong && !et) return false;
        if (errFilter && et !== errFilter) return false;
        return true;
      }),
    [drills, onlyWrong, errFilter, errorTypes],
  );

  const wrongCount = drills.filter(
    (d) => (errorTypes[d.id] ?? d.errorType) !== null,
  ).length;

  return (
    <div className="space-y-4">
      {/* 筛选条 */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setOnlyWrong((v) => !v)}
          aria-label="只看错题本"
          className={cn(
            "rounded-full px-3.5 py-1.5 text-sm transition-colors",
            onlyWrong ? "bg-red-500/15 text-red-500" : "bg-secondary text-muted-foreground",
          )}
        >
          错题本（{wrongCount}）
        </button>
        {ERRORS.map((t) => (
          <button
            key={t}
            onClick={() => setErrFilter((v) => (v === t ? null : t))}
            aria-label={`筛选 ${DRILL_ERROR_META[t].label}`}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs transition-colors",
              DRILL_ERROR_META[t].color,
              errFilter === t ? "ring-2 ring-primary/50" : "opacity-70 hover:opacity-100",
            )}
          >
            {DRILL_ERROR_META[t].icon} {DRILL_ERROR_META[t].label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {onlyWrong || errFilter
            ? "该筛选下暂无错题——保持住！"
            : "还没有习题。"}
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map((d) => (
            <DrillCard key={d.id} drill={d} conceptName={conceptNames[d.conceptId]} />
          ))}
        </div>
      )}
    </div>
  );
}
