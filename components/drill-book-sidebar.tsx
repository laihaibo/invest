"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookX } from "lucide-react";
import {
  drillAnswerKey,
  DRILL_ERROR_META,
  type DrillErrorType,
  type DrillMeta,
} from "@/lib/drill-types";

/** 概念详情页的错题本侧栏：展示该概念关联的错题与归因 */
export function DrillBookSidebar({ drills }: { drills: DrillMeta[] }) {
  const [wrong, setWrong] = useState<DrillMeta[]>([]);
  const [answeredCount, setAnsweredCount] = useState(0);

  useEffect(() => {
    let answered = 0;
    const list: DrillMeta[] = [];
    for (const d of drills) {
      const a = localStorage.getItem(drillAnswerKey(d.id));
      if (a && a.trim()) answered += 1;
      const et = localStorage.getItem(`invest.drill.errorType.${d.id}`);
      const yamlError =
        d.errorType && DRILL_ERROR_META[d.errorType] ? d.errorType : null;
      const finalError =
        et === "concept-blur" ||
        et === "calc-error" ||
        et === "assumption-wrong" ||
        et === "data-misread"
          ? (et as DrillErrorType)
          : yamlError;
      if (finalError) {
        list.push({ ...d, errorType: finalError });
      }
    }
    setAnsweredCount(answered);
    setWrong(list);
  }, [drills]);

  if (drills.length === 0) return null;

  return (
    <aside className="glass glass-tint-report rounded-2xl p-5 space-y-2.5">
      <p className="flex items-center gap-2 text-sm font-medium">
        <BookX className="size-4 text-red-500" />
        本概念的错题本（{wrong.length} 错 / {drills.length} 题，已作答 {answeredCount}）
      </p>
      {wrong.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          还没有该概念的错题记录——去做做关联习题。
        </p>
      ) : (
        <ul className="space-y-1.5">
          {wrong.map((d) => (
            <li key={d.id} className="text-xs leading-relaxed">
              <Link href="/drill" className="text-primary hover:underline">
                {d.date} {d.id.split("-").pop()}
              </Link>
              <span
                className={`ml-2 rounded-full px-2 py-0.5 ${DRILL_ERROR_META[d.errorType as DrillErrorType].color}`}
              >
                {DRILL_ERROR_META[d.errorType as DrillErrorType].label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
