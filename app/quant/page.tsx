import type { Metadata } from "next";
import { NoteCard } from "@/components/note-card";
import { getNotesByType } from "@/lib/content";

export const metadata: Metadata = { title: "量化学习" };

export default function QuantListPage() {
  const notes = getNotesByType("quant");

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">量化学习</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          每天一个概念 + 一道习题 · 费曼练习，讲给外行听懂为止
        </p>
      </header>

      {notes.length === 0 ? (
        <section className="glass rounded-2xl p-6">
          <p className="text-sm text-muted-foreground">
            还没有量化笔记。运行 <code>pnpm new:quant</code> 开始今天的学习。
          </p>
        </section>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <NoteCard key={note.slug} note={note} showType={false} />
          ))}
        </div>
      )}
    </div>
  );
}
