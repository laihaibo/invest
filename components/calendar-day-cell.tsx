import Link from "next/link";
import type { NoteType } from "@/lib/content";
import { cn } from "@/lib/utils";

const DOT_CLASS: Record<NoteType, string> = {
  quant: "bg-teal-500",
  report: "bg-blue-500",
  prospectus: "bg-violet-500",
};

export interface CalendarDayCellProps {
  date: string;
  day: number;
  inMonth: boolean;
  types: NoteType[];
  isToday: boolean;
}

export function CalendarDayCell(props: CalendarDayCellProps) {
  if (!props.inMonth) {
    return (
      <div className="flex size-11 items-center justify-center rounded-xl opacity-35">
        <span className="text-base tabular-nums leading-none">
          {props.day}
        </span>
      </div>
    );
  }

  if (props.types.length === 0) {
    return (
      <div className="flex size-11 items-center justify-center rounded-xl">
        <span className="text-base tabular-nums leading-none">{props.day}</span>
      </div>
    );
  }

  return (
    <Link
      href={`/day/${props.date}`}
      className={cn(
        "flex size-11 flex-col items-center justify-center gap-1 rounded-xl transition-colors",
        props.isToday && "bg-primary/15 font-semibold text-primary",
      )}
    >
      <span className="text-base leading-none tabular-nums">{props.day}</span>
      <span className="flex gap-0.5">
        {props.types.map((t) => (
          <span
            key={t}
            className={cn("size-1.5 rounded-full", DOT_CLASS[t])}
          />
        ))}
      </span>
    </Link>
  );
}
