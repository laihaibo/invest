"use client";

import { useEffect, useState } from "react";
import { QuoteIcon } from "lucide-react";
import { QUOTES } from "@/lib/quotes";

/**
 * 每日金句：按客户端日期的 day-of-year 取模轮换。
 * 先渲染空占位再在挂载后填充，避免构建日期过期与 hydration 错位。
 */
export function QuoteOfDay() {
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor(
      (now.getTime() - start.getTime()) / 86_400_000,
    );
    setIndex(dayOfYear % QUOTES.length);
  }, []);

  if (index === null) {
    return <div className="glass h-24 rounded-2xl" aria-hidden />;
  }

  const quote = QUOTES[index];

  return (
    <figure className="glass rounded-2xl p-5">
      <div className="flex gap-3">
        <QuoteIcon className="mt-0.5 size-5 shrink-0 text-primary" />
        <div>
          <blockquote className="text-base leading-relaxed">
            {quote.text}
          </blockquote>
          <figcaption className="mt-2 text-sm text-muted-foreground">
            —— {quote.author}
          </figcaption>
        </div>
      </div>
    </figure>
  );
}
