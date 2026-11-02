"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ROADMAP_STAGES,
} from "@/lib/roadmap-data";
import {
  conceptStatusKey,
  type ConceptStatus,
} from "@/lib/concept-types";
import { cn } from "@/lib/utils";

/** 阶段进度：概念全 mastered 且习题全作答=100%；仅概念=60%；仅习题=40%；否则 0% */
function stageProgress(
  concepts: string[],
  drills: string[],
  statuses: Record<string, ConceptStatus>,
  answered: Record<string, boolean>,
): number {
  const allMastered =
    concepts.length > 0 &&
    concepts.every((id) => statuses[id] === "mastered");
  const allAnswered =
    drills.length > 0 &&
    drills.every((id) => answered[id]);
  if (allMastered && allAnswered) return 100;
  if (allMastered) return 60;
  if (allAnswered) return 40;
  return 0;
}

export function RoadmapTimeline({
  conceptNames,
}: {
  conceptNames: Record<string, string>;
}) {
  const [statuses, setStatuses] = useState<Record<string, ConceptStatus>>({});
  const [answered, setAnswered] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const st: Record<string, ConceptStatus> = {};
    const answeredMap: Record<string, boolean> = {};
    for (const s of ROADMAP_STAGES) {
      for (const id of s.concepts) {
        const v = localStorage.getItem(conceptStatusKey(id));
        if (v === "new" || v === "learning" || v === "learned" || v === "mastered") {
          st[id] = v;
        }
      }
      for (const id of s.drills) {
        const a = localStorage.getItem(`invest.drill.answer.${id}`);
        if (a && a.trim()) answeredMap[id] = true;
      }
    }
    setStatuses(st);
    setAnswered(answeredMap);
  }, []);

  const stages = useMemo(
    () =>
      ROADMAP_STAGES.map((s) => ({
        ...s,
        progress: stageProgress(s.concepts, s.drills, statuses, answered),
      })),
    [statuses, answered],
  );

  const current = stages.find((s) => s.progress > 0 && s.progress < 100);
  const currentStage = current?.stage ?? stages.find((s) => s.progress === 0)?.stage;

  return (
    <div className="no-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5 pb-2">
      {stages.map((s) => (
        <div
          key={s.stage}
          className={cn(
            "glass w-72 shrink-0 rounded-2xl p-5 space-y-3",
            s.stage === currentStage && "ring-2 ring-primary/50",
          )}
        >
          <div className="flex items-center justify-between">
            <p className="font-semibold">阶段 {s.stage} · {s.name}</p>
            <span className="text-xs tabular-nums text-muted-foreground">{s.weeks}</span>
          </div>
          <p className="text-sm text-muted-foreground">{s.goal}</p>
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">概念清单</p>
            {s.concepts.map((id) => (
              <Link
                key={id}
                href={`/concepts/${id}`}
                className="block text-xs text-primary hover:underline"
              >
                {conceptNames[id] ?? id}
              </Link>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            习题 {s.drills.length} 道 ·{" "}
            <Link href="/drill" className="text-primary hover:underline">
              去做题 →
            </Link>
          </p>
          <p className="rounded-xl bg-secondary/60 p-2.5 text-xs leading-relaxed text-muted-foreground">
            验收：{s.acceptance}
          </p>
          <div className="space-y-1">
            <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${s.progress}%` }}
                aria-label={`阶段 ${s.stage} 进度 ${s.progress}%`}
              />
            </div>
            <p className="text-right text-xs tabular-nums text-muted-foreground">{s.progress}%</p>
          </div>
        </div>
      ))}
    </div>
  );
}
