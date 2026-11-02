"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildMonthGrid, monthLabel } from "@/lib/calendar";
import type { NoteType } from "@/lib/content";
import { CalendarDayCell } from "@/components/calendar-day-cell";

export interface CalendarDayInfo {
  date: string;
  types: NoteType[];
}

function localTodayKey(): string {
  const now = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

export function CalendarMonth({ days }: { days: CalendarDayInfo[] }) {
  const [ym, setYm] = useState<{ y: number; m: number } | null>(null);
  const [touchX, setTouchX] = useState<number | null>(null);

  useEffect(() => {
    const now = new Date();
    setYm({ y: now.getFullYear(), m: now.getMonth() + 1 });
  }, []);

  const byDate = useMemo(() => {
    const map = new Map<string, NoteType[]>();
    for (const d of days) {
      map.set(d.date, d.types);
    }
    return map;
  }, [days]);

  if (!ym) return <div className="glass h-80 rounded-2xl" aria-hidden />;

  const grid = buildMonthGrid(ym.y, ym.m);
  const todayKey = localTodayKey();
  const typesOn = (date: string): NoteType[] => byDate.get(date) ?? [];

  const go = (delta: number) => {
    const next = new Date(Date.UTC(ym.y, ym.m - 1 + delta, 1));
    setYm({ y: next.getUTCFullYear(), m: next.getUTCMonth() + 1 });
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchX(e.touches[0].clientX);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
    setTouchX(null);
  };

  return (
    <div
      className="glass rounded-2xl p-3 sm:p-4"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex items-center justify-between px-1 pb-2">
        <button
          onClick={() => go(-1)}
          aria-label="上个月"
          className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ChevronLeft className="size-5" />
        </button>
        <p className="text-lg font-semibold tabular-nums">
          {monthLabel(ym.y, ym.m)}
        </p>
        <button
          onClick={() => go(1)}
          aria-label="下个月"
          className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 pb-1">
        {["一", "二", "三", "四", "五", "六", "日"].map((w) => (
          <div
            key={w}
            className="flex h-8 items-center justify-center text-xs text-muted-foreground"
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 justify-items-center">
        {grid.map((cell) => (
          <CalendarDayCell
            key={cell.date}
            date={cell.date}
            day={Number(cell.date.slice(8))}
            inMonth={cell.inMonth}
            types={cell.inMonth ? (typesOn(cell.date) ?? []) : []}
            isToday={cell.date === todayKey}
          />
        ))}
      </div>
    </div>
  );
}
