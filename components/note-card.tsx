import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { TypeBadge } from "@/components/type-badge";
import { formatDateCN, type NoteMeta, type NoteType } from "@/lib/content";
import { cn } from "@/lib/utils";

/** 每种内容线一种玻璃色调 */
const TINT_CLASS: Record<NoteType, string> = {
  quant: "glass-tint-quant",
  report: "glass-tint-report",
  prospectus: "glass-tint-prospectus",
};

/** 笔记 → 详情页路由（report 与 prospectus 共用 /report/[slug]） */
export function noteHref(note: Pick<NoteMeta, "type" | "slug">): string {
  return note.type === "quant"
    ? `/quant/${note.slug}`
    : `/report/${note.slug}`;
}

export function NoteCard({
  note,
  showType = true,
}: {
  note: NoteMeta;
  showType?: boolean;
}) {
  return (
    <Link href={noteHref(note)} className="group block">
      <Card
        className={cn(
          "glass h-full transition-transform duration-200 group-active:scale-[0.98]",
          TINT_CLASS[note.type],
        )}
      >
        <CardContent className="space-y-2 p-4">
          <div className="flex items-center gap-2">
            {showType && <TypeBadge type={note.type} />}
            <span className="text-xs text-muted-foreground">
              {formatDateCN(note.date)}
            </span>
          </div>
          <h3 className="text-lg font-semibold leading-snug">{note.title}</h3>
          {note.thesis && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {note.thesis}
            </p>
          )}
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
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
        </CardContent>
      </Card>
    </Link>
  );
}
