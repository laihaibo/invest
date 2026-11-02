import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  NOTE_TYPES,
  type Note,
  type NoteMeta,
  type NoteType,
} from "@/lib/note-types";

// 共享类型与工具统一从 note-types 导出（客户端组件禁止直接 import 本模块）
export {
  NOTE_TYPES,
  NOTE_TYPE_LABELS,
  formatDateCN,
  type Note,
  type NoteMeta,
  type NoteType,
} from "@/lib/note-types";

const CONTENT_DIR = path.join(process.cwd(), "content");

/** 解析并校验单个 md 文件；字段缺失或越界时抛出可读错误，构建期即暴露问题 */
function parseNoteFile(type: NoteType, filename: string): Note {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(CONTENT_DIR, type, filename), "utf8");
  const { data, content } = matter(raw);

  const fail = (msg: string): never => {
    throw new Error(`[content] ${type}/${filename} ${msg}`);
  };

  if (typeof data.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    fail('date 必须是带引号的 YYYY-MM-DD 字符串，如 date: "2026-11-02"（不加引号会被 YAML 解析成 Date 对象）');
  }

  if (!slug.startsWith(data.date)) {
    fail(`date(${data.date}) 必须与文件名前缀一致，如 ${data.date}-xxx.md`);
  }

  // 模板允许"先建后写"：title 等字段留空时用宽松回退，不阻断构建
  const title =
    typeof data.title === "string" && data.title.trim()
      ? data.title
      : slug;

  const note: NoteMeta = {
    slug,
    type,
    date: data.date,
    title,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    thesis: typeof data.thesis === "string" ? data.thesis : "",
  };

  if (type === "quant") {
    note.problem =
      typeof data.problem === "string" ? data.problem : "";
    note.myAnswer = typeof data.my_answer === "string" ? data.my_answer : "";
    note.reflection =
      typeof data.reflection === "string" ? data.reflection : "";
  } else {
    note.company =
      typeof data.company === "string" && data.company.trim()
        ? data.company
        : "未填写";
    note.sector = typeof data.sector === "string" ? data.sector : "";
    const rating = data.rating == null || data.rating === "" ? NaN : Number(data.rating);
    if (Number.isInteger(rating) && rating >= 1 && rating <= 5) {
      note.rating = rating;
    }
  }

  return { ...note, content };
}

/** 某类型的全部笔记，日期倒序（同日按 slug 倒序） */
export function getNotesByType(type: NoteType): Note[] {
  const dir = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(dir)) {
    return [];
  }
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parseNoteFile(type, f));
  return files.sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : b.slug.localeCompare(a.slug),
  );
}

/** 全部笔记，日期倒序。大多数页面的数据入口 */
export function getAllNotes(): Note[] {
  const all: Note[] = [];
  for (const t of NOTE_TYPES) {
    all.push(...getNotesByType(t));
  }
  all.sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : b.slug.localeCompare(a.slug),
  );
  return all;
}

export function getNote(type: NoteType, slug: string): Note | undefined {
  for (const n of getAllNotes()) {
    if (n.type === type && n.slug === slug) {
      return n;
    }
  }
  return undefined;
}

/** 某一天的笔记列表（日历点击落点 /day/[date]） */
export function getNotesByDate(date: string): Note[] {
  return getAllNotes().filter((n) => n.date === date);
}

/** 全部 tag 及使用次数，按次数降序（思维模型库的聚合入口） */
export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const note of getAllNotes()) {
    for (const t of note.tags) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  const list: { tag: string; count: number }[] = [];
  for (const [tag, count] of counts) {
    list.push({ tag, count });
  }
  list.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  return list;
}

/** 有笔记的全部日期，升序 */
export function getAllDates(): string[] {
  const set = new Set<string>();
  for (const n of getAllNotes()) {
    set.add(n.date);
  }
  return [...set].sort();
}
