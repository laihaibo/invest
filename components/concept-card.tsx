"use client";

import Link from "next/link";
import { AlarmClock } from "lucide-react";
import type { ConceptMeta, ConceptStatus } from "@/lib/concept-types";
import { cn } from "@/lib/utils";

/** 状态徽章配色：new 灰 / learning 黄 / learned 蓝 / mastered 绿 */
const STATUS_BADGE: Record<ConceptStatus, string> = {
  new: "bg-secondary text-muted-foreground",
  learning: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
  learned: "bg-blue-500/15 text-blue-600 dark:text-blue-300",
  mastered: "bg-teal-500/15 text-teal-600 dark:text-teal-300",
};

const STATUS_LABEL: Record<ConceptStatus, string> = {
  new: "未学",
  learning: "学习中",
  learned: "已学",
  mastered: "已掌握",
};

export function ConceptCard({
  concept,
  status,
  due,
}: {
  concept: ConceptMeta;
  status: ConceptStatus;
  due: boolean;
}) {
  return (
    <Link
      href={`/concepts/${concept.id}`}
      className="glass relative block rounded-2xl p-4 transition-transform active:scale-[0.98]"
    >
      {due && (
        <span
          className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-xs text-red-500"
          aria-label="待复习"
        >
          <AlarmClock className="size-3" />
          待复习
        </span>
      )}
      <p className="text-base font-semibold leading-snug">
        {concept.name}
        {concept.en && (
          <span className="ml-1.5 text-xs font-normal text-muted-foreground">
            {concept.en}
          </span>
        )}
      </p>
      <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
        <span aria-label={`难度 ${concept.difficulty} 星`}>
          {"★".repeat(concept.difficulty)}
          {"☆".repeat(5 - concept.difficulty)}
        </span>
        <span className={cn("rounded-full px-2 py-0.5", STATUS_BADGE[status])}>
          {STATUS_LABEL[status]}
        </span>
      </div>
    </Link>
  );
}
