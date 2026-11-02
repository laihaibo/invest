import type { Metadata } from "next";
import { ArchiveFilter } from "@/components/archive-filter";
import { getAllNotes, getAllTags } from "@/lib/content";
import type { NoteMeta } from "@/lib/note-types";

export const metadata: Metadata = { title: "归档" };

/** NoteCard 接受 NoteMeta（客户端安全），Note 是其超集可直接传入 */
type MetaOf = ReturnType<typeof getAllNotes>[number];

export default function NoteArchivePage() {
  const notes: NoteMeta[] = getAllNotes();
  const tags = getAllTags();

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">归档</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          全部笔记的时间线 · 按日期倒序 · 点击 tag 聚合你的思维模型库
        </p>
      </header>

      <ArchiveFilter notes={notes} tags={tags} />
    </div>
  );
}
