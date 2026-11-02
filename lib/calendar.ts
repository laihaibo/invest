/** 月历网格计算（纯函数，周一开头的 6×7 网格） */

export interface MonthGridDay {
  /** YYYY-MM-DD；补位日期同样给出真实日期，展示时淡显 */
  date: string;
  inMonth: boolean;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toKey(y: number, m: number, d: number): string {
  return `${y}-${pad(m)}-${pad(d)}`;
}

/** 生成 42 格月历网格（含前后月补位） */
export function buildMonthGrid(year: number, month: number): MonthGridDay[] {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const offset = (first.getUTCDay() + 6) % 7; // 周一开头
  const gridStart = new Date(first);
  gridStart.setUTCDate(1 - offset);
  const cells: MonthGridDay[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setUTCDate(gridStart.getUTCDate() + i);
    cells.push({
      date: toKey(
        d.getUTCFullYear(),
        d.getUTCMonth() + 1,
        d.getUTCDate(),
      ),
      inMonth: d.getUTCMonth() + 1 === month && d.getUTCFullYear() === year,
    });
  }
  return cells;
}

/** 月份标题 "2026 年 11 月" */
export function monthLabel(year: number, month: number): string {
  return `${year} 年 ${month} 月`;
}
