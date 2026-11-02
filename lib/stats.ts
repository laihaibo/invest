import { getAllNotes, type Note, type NoteType } from "./content";

export interface StreakInfo {
  /** 连续打卡天数，锚定在最后一条笔记的日期（push 即重建，数据始终新鲜） */
  current: number;
  longest: number;
}

/** 从 YYYY-MM-DD 日期集合计算连续打卡（全部用 UTC 计算，避免时区漂移） */
export function computeStreak(dates: string[]): StreakInfo {
  if (dates.length === 0) {
    return { current: 0, longest: 0 };
  }
  const set = new Set(dates);
  const sorted = [...set].sort();

  // current：从最后一天向前逐日回溯
  let current = 0;
  const cursor = new Date(`${sorted[sorted.length - 1]}T00:00:00Z`);
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (!set.has(key)) break;
    current += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  // longest：扫描排序后的日期序列，累加连续段
  let longest = 0;
  let run = 0;
  let prev: string | undefined;
  for (const d of sorted) {
    if (prev === undefined) {
      run = 1;
    } else {
      const next = new Date(`${prev}T00:00:00Z`);
      next.setUTCDate(next.getUTCDate() + 1);
      run = next.toISOString().slice(0, 10) === d ? run + 1 : 1;
    }
    if (run > longest) longest = run;
    prev = d;
  }

  return { current, longest };
}

/** 单条主线的统计 */
export interface MainlineStats {
  count: number;
  streak: StreakInfo;
}

/** 首页统计卡的数据结构 */
export interface StudyStats {
  totalNotes: number;
  /** 有笔记的天数 */
  studyDays: number;
  /** 去重后的 tag 数（思维模型库规模） */
  uniqueTags: number;
  overall: StreakInfo;
  /** 主线一：量化学习 */
  quant: MainlineStats;
  /** 主线二：基本面阅读（财报 + 招股书合并） */
  reading: MainlineStats;
  byType: Record<NoteType, number>;
}

export function getStats(): StudyStats {
  const notes = getAllNotes();
  const quantNotes = notes.filter((n) => n.type === "quant");
  const readingNotes = notes.filter((n) => n.type !== "quant");

  const uniqueTags = new Set<string>();
  for (const n of notes) {
    for (const t of n.tags) {
      uniqueTags.add(t);
    }
  }

  return {
    totalNotes: notes.length,
    studyDays: new Set(notes.map((n) => n.date)).size,
    uniqueTags: uniqueTags.size,
    overall: computeStreak(notes.map((n) => n.date)),
    quant: {
      count: quantNotes.length,
      streak: computeStreak(quantNotes.map((n) => n.date)),
    },
    reading: {
      count: readingNotes.length,
      streak: computeStreak(readingNotes.map((n) => n.date)),
    },
    byType: {
      quant: quantNotes.length,
      report: notes.filter((n) => n.type === "report").length,
      prospectus: notes.filter((n) => n.type === "prospectus").length,
    },
  };
}

/** 供类型标注复用 */
export type { Note };
