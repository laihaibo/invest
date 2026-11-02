import Link from "next/link";
import { ChevronLeft, Tags } from "lucide-react";
import { Markdown } from "@/components/markdown";
import { NoteSheet } from "@/components/note-sheet";
import { TypeBadge } from "@/components/type-badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateCN, type Note } from "@/lib/content";
import { cn } from "@/lib/utils";

const TINT_CLASS: Record<Note["type"], string> = {
  quant: "glass-tint-quant",
  report: "glass-tint-report",
  prospectus: "glass-tint-prospectus",
};

export function NoteDetail({ note, backHref }: { note: Note; backHref: string }) {
  const isQuant = note.type === "quant";
  const tint = TINT_CLASS[note.type];

  return (
    <article className="space-y-5">
      <header className="space-y-3">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          返回
        </Link>
        <div className={cn("glass rounded-2xl p-5 space-y-2.5", tint)}>
          <div className="flex flex-wrap items-center gap-2">
            <TypeBadge type={note.type} />
            <span className="text-xs text-muted-foreground">
              {formatDateCN(note.date)}
            </span>
          </div>
          <h1 className="text-xl font-semibold leading-snug sm:text-2xl">
            {note.title}
          </h1>
          {note.thesis && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {note.thesis}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <NoteSheet note={note} />
            {note.tags.length > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/70 px-3 py-2 text-xs text-muted-foreground">
                <Tags className="size-3.5" />
                {note.tags.join(" · ")}
              </span>
            )}
          </div>
        </div>
      </header>

      {isQuant && (
        <section className="space-y-3">
          <div className={cn("glass rounded-2xl p-4 space-y-1.5", tint)}>
            <p className="text-xs font-medium text-muted-foreground">今日习题</p>
            <p className="text-sm leading-relaxed">{note.problem}</p>
          </div>
          <div className={cn("glass rounded-2xl p-4 space-y-1.5", tint)}>
            <p className="text-xs font-medium text-muted-foreground">我的解法</p>
            <p className="text-sm leading-relaxed">{note.myAnswer}</p>
          </div>
          <div className={cn("glass rounded-2xl p-4 space-y-1.5", tint)}>
            <p className="text-xs font-medium text-muted-foreground">卡点反思</p>
            <p className="text-sm leading-relaxed">{note.reflection}</p>
          </div>
        </section>
      )}

      {isQuant && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">概念讲解正文</h2>
          <div className={cn("glass rounded-2xl p-5", tint)}>
            <Markdown content={note.content} />
          </div>
        </section>
      )}

      {!isQuant && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">精读正文</h2>
          <div className={cn("glass rounded-2xl p-5", tint)}>
            <Markdown content={note.content} />
          </div>
        </section>
      )}
    </article>
  );
}
