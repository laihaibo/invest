"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sigma } from "lucide-react";
import {
  conceptLastReviewKey,
  conceptStatusKey,
  isDueForReview,
  type ConceptMeta,
  type ConceptStatus,
} from "@/lib/concept-types";
import type { DrillMeta } from "@/lib/drill-types";
import { localToday } from "@/lib/plan-types";

/** 首页「量化学习」卡：今日推荐概念 + 今日习题 + 掌握度进度 */
export function QuantHomeCard({
  concepts,
  drills,
}: {
  concepts: ConceptMeta[];
  drills: DrillMeta[];
}) {
  const [today, setToday] = useState("");
  const [statuses, setStatuses] = useState<Record<string, ConceptStatus>>({});
  const [lastReviews, setLastReviews] = useState<Record<string, string>>({});

  useEffect(() => {
    setToday(localToday());
    const st: Record<string, ConceptStatus> = {};
    const lr: Record<string, string> = {};
    for (const c of concepts) {
      const s = localStorage.getItem(conceptStatusKey(c.id));
      if (s === "new" || s === "learning" || s === "learned" || s === "mastered") {
        st[c.id] = s;
      }
      const d = localStorage.getItem(conceptLastReviewKey(c.id));
      if (d) lr[c.id] = d;
    }
    setStatuses(st);
    setLastReviews(lr);
  }, [concepts]);

  const enriched = concepts.map((c) => ({
    ...c,
    status: statuses[c.id] ?? c.status,
    due: isDueForReview({ ...c, status: statuses[c.id] ?? c.status }, lastReviews[c.id] ?? null),
  }));

  const dueConcepts = enriched.filter((c) => c.due);
  const recommend =
    dueConcepts[0] ??
    enriched.find((c) => c.status === "learning") ??
    enriched.find((c) => c.status === "new") ??
    enriched[0];

  const todayDrill = today ? drills.find((d) => d.date === today) : undefined;
  const mastered = enriched.filter((c) => c.status === "mastered").length;
  const pct = enriched.length ? Math.round((mastered / enriched.length) * 100) : 0;

  return (
    <div className="glass glass-tint-quant rounded-2xl p-4 space-y-2.5">
      <div className="flex items-center gap-2">
        <Sigma className="size-4 text-primary" />
        <p className="text-sm font-medium">量化学习</p>
        <Link href="/roadmap" className="ml-auto text-xs text-primary hover:underline">
          路线图 →
        </Link>
      </div>
      {recommend && (
        <p className="text-sm leading-relaxed">
          <span className="text-muted-foreground">今日推荐概念：</span>
          {dueConcepts.length > 0 && (
            <span className="mr-1.5 rounded-full bg-red-500/15 px-2 py-0.5 text-xs text-red-500">
              待复习 {dueConcepts.length}
            </span>
          )}
          <Link href={`/concepts/${recommend.id}`} className="font-medium text-primary hover:underline">
            {recommend.name}
          </Link>
        </p>
      )}
      <p className="text-sm leading-relaxed">
        <span className="text-muted-foreground">今日习题：</span>
        {todayDrill ? (
          <Link href="/drill" className="text-primary hover:underline">
            {todayDrill.date.slice(5)} {DRILL_LABEL(todayDrill.type)} · {todayDrill.id.split("-").pop()}
          </Link>
        ) : (
          <span className="text-muted-foreground">今日无既定习题，可自由复习</span>
        )}
      </p>
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>概念掌握度</span>
          <span className="tabular-nums">
            {mastered} / {enriched.length}（{pct}%）
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

function DRILL_LABEL(t: DrillMeta["type"]): string {
  return { calculation: "计算", concept: "概念", case: "案例", trap: "陷阱" }[t];
}
