"use client";

import { useEffect, useState } from "react";
import { PenLine } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { drillAnswerKey } from "@/lib/drill-types";

/** 作答模式：底部上滑 Sheet + 大号 textarea，存 localStorage */
export function DrillAnswerSheet({
  drillId,
  onSaved,
}: {
  drillId: string;
  onSaved: (text: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (open) {
      setText(localStorage.getItem(drillAnswerKey(drillId)) ?? "");
    }
  }, [open, drillId]);

  const save = () => {
    localStorage.setItem(drillAnswerKey(drillId), text);
    onSaved(text);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="开始作答"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm text-primary-foreground"
        >
          <PenLine className="size-4" />
          开始作答
        </button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <div className="space-y-3 pb-8">
          <p className="text-sm font-medium">我的解答（完成后点保存）</p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={9}
            aria-label="我的解答输入区"
            placeholder="先写「已知什么、求什么」，再写推理步骤……"
            className="w-full rounded-xl border border-border bg-background p-3.5 text-base leading-relaxed outline-none focus:ring-2 focus:ring-primary/40"
          />
          <div className="flex gap-2">
            <button
              onClick={save}
              className="rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"
            >
              保存解答
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full bg-secondary px-5 py-2.5 text-sm text-muted-foreground"
            >
              取消
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
