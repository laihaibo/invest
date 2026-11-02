"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlarmClock } from "lucide-react";
import { ConceptCard } from "@/components/concept-card";
import {
  CONCEPT_CATEGORIES,
  conceptLastReviewKey,
  conceptStatusKey,
  daysSince,
  isDueForReview,
  type Concept,
  type ConceptStatus,
} from "@/lib/concept-types";
import { cn } from "@/lib/utils";

/** 6 张分类玻璃卡（总数 + 已掌握进度环）+ 待复习提醒 + 概念网格 */
export function ConceptsBrowser({ concepts }: { concepts: Concept[] }) {
  const [cat, setCat] = useState<string>("全部");
  const [statuses, setStatuses] = useState<Record<string, ConceptStatus>>({});
  const [lastReviews, setLastReviews] = useState<Record<string, string>>({});

  useEffect(() => {
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

  const enriched = useMemo(
    () =>
      concepts.map((c) => ({
        ...c,
        status: statuses[c.id] ?? c.status,
        due: isDueForReview({ ...c, status: statuses[c.id] ?? c.status }, lastReviews[c.id] ?? null),
      })),
    [concepts, statuses, lastReviews],
  );

  const dueList = enriched
    .filter((c) => c.due)
    .sort((a, b) =>
      daysSince(lastReviews[b.id] ?? b.firstLearned) -
      daysSince(lastReviews[a.id] ?? a.firstLearned),
    );

  const masteredCount = (list: typeof enriched) =>
    list.filter((c) => c.status === "mastered").length;

  const filtered =
    cat === "全部" ? enriched : enriched.filter((c) => c.category === cat);

  return (
    <div className="space-y-5">
      {/* 分类卡片 */}
      <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
        {["全部", ...CONCEPT_CATEGORIES].map((name) => {
          const list =
            name === "全部"
              ? enriched
              : enriched.filter((c) => c.category === name);
          const m = masteredCount(list);
          const pct = list.length ? m / list.length : 0;
          const active = cat === name;
          return (
            <button
              key={name}
              onClick={() => setCat(name)}
              aria-label={`分类 ${name}，共 ${list.length} 个概念，已掌握 ${m} 个`}
              className={cn(
                "glass flex w-36 shrink-0 flex-col items-center gap-1 rounded-2xl p-3 text-sm transition-colors",
                active && "ring-2 ring-primary/50",
              )}
            >
              <span className={cn("font-medium", active && "text-primary")}>{name}</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {list.length} 个 · 已掌握 {m}
              </span>
              <span className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <span
                  className="block h-full rounded-full bg-primary"
                  style={{ width: `${Math.round(pct * 100)}%` }}
                />
              </span>
            </button>
          );
        })}
      </div>

      {/* 待复习提醒 */}
      {dueList.length > 0 && (
        <div className="glass glass-tint-quant rounded-2xl p-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <AlarmClock className="size-4 text-red-500" />
            今日待复习（{dueList.length}）
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {dueList.map((c) => (
              <Link
                key={c.id}
                href={`/concepts/${c.id}`}
                className="rounded-full bg-red-500/10 px-3 py-1.5 text-xs text-red-500"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 概念网格 */}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">该分类暂无概念。</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((c) => (
            <ConceptCard key={c.id} concept={c} status={c.status} due={c.due} />
          ))}
        </div>
      )}
    </div>
  );
}
