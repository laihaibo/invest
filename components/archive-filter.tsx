"use client";

import { useState } from "react";
import { NoteCard } from "@/components/note-card";
import type { NoteMeta } from "@/lib/note-types";
import { cn } from "@/lib/utils";

export interface TagInfo {
  tag: string;
  count: number;
}

export function ArchiveFilter({
  notes,
  tags,
}: {
  notes: NoteMeta[];
  tags: TagInfo[];
}) {
  const [active, setActive] = useState<string | null>(null);

  const filtered =
    active === null
      ? notes
      : notes.filter((n) => n.tags.includes(active));

  const chips: { tag: string | null; label: string; count: number }[] = [
    { tag: null, label: "全部", count: notes.length },
    ...tags.map((t) => ({ tag: t.tag, label: t.tag, count: t.count })),
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c.tag ?? "all"}
            onClick={() => setActive(c.tag)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm transition-colors",
              active === c.tag
                ? "bg-primary/15 text-primary font-medium"
                : "bg-secondary text-muted-foreground hover:text-foreground",
            )}
          >
            {c.label}
            <span className="ml-1.5 text-xs opacity-60">{c.count}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            这个 tag 下还没有笔记。
          </p>
        ) : (
          filtered.map((note) => <NoteCard key={note.slug} note={note} />)
        )}
      </div>
    </div>
  );
}
