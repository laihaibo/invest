"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Lightbulb, Unlock } from "lucide-react";
import { DrillAnswerSheet } from "@/components/drill-answer-sheet";
import { ErrorTagSelector } from "@/components/error-tag-selector";
import {
  drillAnswerKey,
  drillErrorTypeKey,
  drillStageKey,
  DRILL_ERROR_META,
  DRILL_TYPE_LABELS,
  type DrillErrorType,
  type DrillMeta,
} from "@/lib/drill-types";
import { cn } from "@/lib/utils";

export function DrillCard({
  drill,
  conceptName,
}: {
  drill: DrillMeta;
  conceptName?: string;
}) {
  const [stage, setStage] = useState(0);
  const [answer, setAnswer] = useState(drill.mySolution);
  const [errorType, setErrorType] = useState<DrillErrorType | null>(drill.errorType);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const s = Number(localStorage.getItem(drillStageKey(drill.id)) ?? 0);
    setStage(Number.isInteger(s) ? Math.max(0, Math.min(3, s)) : 0);
    setAnswer(localStorage.getItem(drillAnswerKey(drill.id)) ?? drill.mySolution);
    const et = localStorage.getItem(drillErrorTypeKey(drill.id));
    setErrorType(
      et === "concept-blur" || et === "calc-error" || et === "assumption-wrong" || et === "data-misread"
        ? (et as DrillErrorType)
        : drill.errorType,
    );
    setMounted(true);
  }, [drill.id, drill.mySolution, drill.errorType]);

  const unlock = (n: number) => {
    localStorage.setItem(drillStageKey(drill.id), String(n));
    setStage((prev) => Math.max(prev, n));
  };

  const answered = answer.trim().length > 0;

  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="tabular-nums">{drill.date}</span>
        <span className={cn("rounded-full px-2 py-0.5", typeBadge(drill.type))}>
          {DRILL_TYPE_LABELS[drill.type]}
        </span>
        <span aria-label={`难度 ${drill.difficulty} 星`}>
          {"★".repeat(drill.difficulty)}{"☆".repeat(5 - drill.difficulty)}
        </span>
        <Link href={`/concepts/${drill.conceptId}`} className="text-primary hover:underline">
          {conceptName ?? drill.conceptId}
        </Link>
        {mounted && stage >= 3 && (
          <span className="ml-auto text-teal-500">已解锁全部解析</span>
        )}
      </div>

      <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{drill.question}</p>

      {/* 三阶段按钮：依次解锁 */}
      <div className="flex flex-wrap gap-2">
        {([
          { n: 1, label: "显示提示", icon: Lightbulb, enabled: stage >= 0 },
          { n: 2, label: "显示我的解答", icon: PenIcon, enabled: stage >= 1 },
          { n: 3, label: "显示标准解法", icon: Unlock, enabled: stage >= 2 },
        ] as const).map((b) => (
          <button
            key={b.n}
            onClick={() => unlock(b.n)}
            disabled={!b.enabled}
            aria-label={b.label}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm transition-colors",
              b.enabled
                ? "bg-secondary text-foreground hover:bg-accent"
                : "bg-secondary/50 text-muted-foreground/50",
            )}
          >
            <b.icon className="size-3.5" />
            {b.label}
          </button>
        ))}
        <DrillAnswerSheet drillId={drill.id} onSaved={setAnswer} />
      </div>

      {stage >= 1 && drill.hint && (
        <div className="rounded-xl bg-secondary/60 p-3.5">
          <p className="text-xs font-medium text-muted-foreground">提示</p>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{drill.hint}</p>
        </div>
      )}

      {stage >= 2 && (
        <div className="rounded-xl bg-secondary/60 p-3.5">
          <p className="text-xs font-medium text-muted-foreground">我的解答</p>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
            {answer || "（还没作答，点「开始作答」写下你的推理）"}
          </p>
        </div>
      )}

      {stage >= 3 && (
        <div className="rounded-xl bg-teal-500/10 p-3.5">
          <p className="text-xs font-medium text-teal-600 dark:text-teal-300">标准解法</p>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{drill.standardSolution}</p>
        </div>
      )}

      {/* 归因：作答后出现 */}
      {mounted && answered && (
        <ErrorTagSelector
          drillId={drill.id}
          current={errorType}
          onSelect={setErrorType}
        />
      )}
      {mounted && answered && errorType && (
        <p className="text-xs text-muted-foreground">
          当前归因：{DRILL_ERROR_META[errorType].label} · {DRILL_ERROR_META[errorType].remedy}
        </p>
      )}
    </div>
  );
}

function typeBadge(t: DrillMeta["type"]): string {
  return {
    calculation: "bg-blue-500/15 text-blue-600 dark:text-blue-300",
    concept: "bg-teal-500/15 text-teal-600 dark:text-teal-300",
    case: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
    trap: "bg-red-500/15 text-red-600 dark:text-red-300",
  }[t];
}

function PenIcon({ className }: { className?: string }) {
  return <Eye className={className} />;
}
