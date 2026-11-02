"use client";

import { Info } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { formatDateCN, NOTE_TYPE_LABELS, type Note } from "@/lib/note-types";

/** 详情页元信息面板：底部上滑 Sheet，展示 frontmatter 信息 */
export function NoteSheet({ note }: { note: Note }) {
  const isQuant = note.type === "quant";

  const rows: [string, string][] = [
    ["类型", NOTE_TYPE_LABELS[note.type]],
    ["日期", formatDateCN(note.date)],
    ...(isQuant
      ? ([
          ["今日习题", note.problem ?? ""],
          ["我的解法", note.myAnswer ?? ""],
          ["卡点反思", note.reflection ?? ""],
        ] as [string, string][])
      : ([
          ["公司", note.company ?? "未填写"],
          ["行业", note.sector || "未填写"],
          ["评分", "★".repeat(note.rating ?? 3) + "☆".repeat(5 - (note.rating ?? 3))],
        ] as [string, string][])),
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="glass inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <Info className="size-4" />
          元信息
        </button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <div className="space-y-2.5 p-5 pb-8">
          {rows.map(([label, value]) => (
            <p key={label} className="text-sm leading-relaxed">
              <span className="text-muted-foreground">{label}：</span>
              {value}
            </p>
          ))}
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
