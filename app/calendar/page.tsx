import type { Metadata } from "next";
import { CalendarMonth, type CalendarDayInfo } from "@/components/calendar-month";
import { getAllNotes, NOTE_TYPES } from "@/lib/content";

export const metadata: Metadata = { title: "日历" };

/** 聚合：每个日期 → 当天出现的类型集合 */
function collectDays(notes: ReturnType<typeof getAllNotes>): CalendarDayInfo[] {
  const map = new Map<string, Set<string>>();
  for (const n of notes) {
    if (!map.has(n.date)) {
      map.set(n.date, new Set<string>());
    }
    map.get(n.date)!.add(n.type);
  }
  const list: CalendarDayInfo[] = [];
  for (const [date, types] of map) {
    const ordered = NOTE_TYPES.filter((t) => types.has(t)) as CalendarDayInfo["types"];
    list.push({ date, types: ordered });
  }
  return list;
}

export default function CalendarPage() {
  const days = collectDays(getAllNotes());

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">日历</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          圆点代表当日完成的学习条目 · 点击日期看当天笔记 · 左右滑动切换月份
        </p>
      </header>

      <CalendarMonth days={days} />

      <div className="flex items-center justify-center gap-5 pt-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-teal-500" />
          量化学习
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-blue-500" />
          财报精读
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-violet-500" />
          招股书精读
        </span>
      </div>
    </div>
  );
}
