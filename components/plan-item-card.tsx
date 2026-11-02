"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PlanStatusButton } from "@/components/plan-status-button";
import type { PlanItem, PlanItemType, PlanPriority } from "@/lib/plan-types";
import { cn } from "@/lib/utils";

/** priority 圆点配色：high 红 / medium 黄 / low 灰 */
const DOT: Record<PlanPriority, string> = {
  high: "bg-red-500",
  medium: "bg-amber-400",
  low: "bg-zinc-400",
};

const TYPE_LABEL: Record<PlanItemType, string> = {
  report: "财报",
  prospectus: "招股书",
  fund: "基金",
  review: "复盘",
  "quant-concept": "概念",
  "quant-drill": "习题",
};

/** quant 类型自动跳转：概念 → /concepts，习题 → /drill */
const TYPE_LINK: Partial<Record<PlanItemType, string>> = {
  "quant-concept": "/concepts",
  "quant-drill": "/drill",
};

export function PlanItemCard({
  item,
  isToday = false,
  onToggleStatus,
}: {
  item: PlanItem;
  isToday?: boolean;
  onToggleStatus: () => void;
}) {
  const isReading = item.type === "report" || item.type === "prospectus";
  const quantHref = TYPE_LINK[item.type];

  return (
    <div
      className={
        isToday
          ? "glass glass-tint-quant rounded-2xl p-4 ring-2 ring-primary/40"
          : "glass rounded-2xl p-4"
      }
    >
      <div className="flex items-start gap-3">
        <span
          className={cn("mt-2 size-2.5 shrink-0 rounded-full", DOT[item.priority])}
          aria-label={`优先级 ${item.priority}`}
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs tabular-nums text-muted-foreground">
            {item.date.slice(5)} · {TYPE_LABEL[item.type]}
          </p>
          {isReading ? (
            <Link
              href="/guide?focus=method"
              className="mt-0.5 block font-medium leading-snug transition-colors hover:text-primary"
              title="点击查看三遍阅读法"
            >
              {item.company} · {item.title}
            </Link>
          ) : quantHref ? (
            <Link
              href={quantHref}
              className="mt-0.5 block font-medium leading-snug transition-colors hover:text-primary"
              title={item.type === "quant-concept" ? "去概念库" : "去习题带练"}
            >
              {item.company} · {item.title}
            </Link>
          ) : (
            <p className="mt-0.5 font-medium leading-snug">
              {item.company} · {item.title}
            </p>
          )}
          {item.notes && (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {item.notes}
            </p>
          )}
          {item.source?.url && (
            <a
              href={item.source.url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-1.5 inline-flex items-center gap-1 text-xs text-primary underline-offset-4 hover:underline"
            >
              <ExternalLink className="size-3" />
              打开出处 · {item.source.name || "外部链接"}
            </a>
          )}
        </div>
        <PlanStatusButton status={item.status} onToggle={onToggleStatus} />
      </div>
    </div>
  );
}
