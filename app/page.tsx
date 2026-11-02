import Link from "next/link";
import { BookOpen, Flame } from "lucide-react";
import { NoteCard } from "@/components/note-card";
import { QuoteOfDay } from "@/components/quote-of-day";
import { Card, CardContent } from "@/components/ui/card";
import { getAllNotes } from "@/lib/content";
import { getStats } from "@/lib/stats";

function StatTile({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="glass rounded-xl p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">
        {value}
        {suffix && (
          <span className="ml-0.5 text-sm font-normal text-muted-foreground">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}

function StreakCard({
  title,
  icon,
  tint,
  count,
  current,
  longest,
}: {
  title: string;
  icon: React.ReactNode;
  tint: string;
  count: number;
  current: number;
  longest: number;
}) {
  return (
    <Card className={`glass ${tint}`}>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xl font-semibold tabular-nums">
            {current} <span className="text-sm font-normal">天</span>
          </p>
          <p className="text-xs text-muted-foreground">
            累计 {count} 篇 · 最长 {longest} 天
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const notes = getAllNotes();
  const stats = getStats();
  const latest = notes[0];

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Invest</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          我的投资修炼场 · 认知复利，从每天一篇开始
        </p>
      </section>

      {latest ? (
        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              最新一篇
            </h2>
            <Link
              href="/archive"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              全部笔记 →
            </Link>
          </div>
          <NoteCard note={latest} />
        </section>
      ) : (
        <section className="glass rounded-2xl p-6 space-y-3">
          <h2 className="text-lg font-semibold">还没有笔记，从今天开始</h2>
          <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>
              <code>pnpm new:quant</code> 生成今日量化模板
            </li>
            <li>
              <code>pnpm new:report 2026-11-02</code> 生成财报模板
            </li>
            <li>写完内容，git push，约 1 分钟后手机刷新站点</li>
          </ol>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">今日状态</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <StreakCard
            title="量化学习 · 连续打卡"
            icon={<Flame className="size-5" />}
            tint="glass-tint-quant"
            count={stats.quant.count}
            current={stats.quant.streak.current}
            longest={stats.quant.streak.longest}
          />
          <StreakCard
            title="基本面阅读 · 连续打卡"
            icon={<BookOpen className="size-5" />}
            tint="glass-tint-report"
            count={stats.reading.count}
            current={stats.reading.streak.current}
            longest={stats.reading.streak.longest}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatTile label="总笔记" value={stats.totalNotes} suffix="篇" />
          <StatTile label="学习天数" value={stats.studyDays} suffix="天" />
          <StatTile label="当前连续" value={stats.overall.current} suffix="天" />
          <StatTile label="思维模型" value={stats.uniqueTags} suffix="个" />
        </div>
      </section>

      <QuoteOfDay />
    </div>
  );
}
