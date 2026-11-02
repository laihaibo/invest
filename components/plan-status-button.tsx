"use client";

import { CheckCircle2, Circle, CircleSlash } from "lucide-react";
import type { PlanStatus } from "@/lib/plan-types";
import { cn } from "@/lib/utils";

export const NEXT_STATUS: Record<PlanStatus, PlanStatus> = {
  done: "todo",
  todo: "skipped",
  skipped: "done",
};

const LABEL: Record<PlanStatus, string> = {
  done: "完成",
  todo: "待办",
  skipped: "跳过",
};

const ICON: Record<PlanStatus, React.ReactNode> = {
  done: <CheckCircle2 className="size-3.5" />,
  todo: <Circle className="size-3.5" />,
  skipped: <CircleSlash className="size-3.5" />,
};

const COLOR: Record<PlanStatus, string> = {
  done: "bg-teal-500/15 text-teal-600 dark:text-teal-300",
  todo: "bg-secondary text-muted-foreground",
  skipped: "bg-muted/60 text-muted-foreground/60",
};

export function PlanStatusButton({
  status,
  onToggle,
}: {
  status: PlanStatus;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      title="点击切换：待办 → 跳过 → 完成"
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-xs transition-colors",
        COLOR[status],
      )}
    >
      {ICON[status]}
      {LABEL[status]}
    </button>
  );
}
