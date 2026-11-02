import type { Metadata } from "next";
import { Flame, LineChart, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "关于" };

const PHASES = [
  {
    icon: Flame,
    tint: "glass-tint-quant",
    iconColor: "text-teal-500",
    title: "第 1 年 · 认知升级",
    desc: "累积 ≥ 300 篇结构化笔记，独立讲清 300+ 个核心投资/商业概念，建立按 tag 聚合的个人思维模型库。",
    metric: "≥ 300 篇结构化笔记",
  },
  {
    icon: LineChart,
    tint: "glass-tint-report",
    iconColor: "text-blue-500",
    title: "第 2 年 · 商业洞察",
    desc: "绘制产业趋势地图，用第一性原理拆解商业模式，对「当下最先进的生产力是什么」形成自己的可验证答案。",
    metric: "产业地图 + 商业模式拆解",
  },
  {
    icon: Target,
    tint: "glass-tint-prospectus",
    title: "第 3 年 · 实战决策",
    desc: "建立自己的选股 Checklist、买入纪律与卖出纪律，历史每一条决策都能追溯到当时的推理依据。",
    metric: "选股 Checklist + 买卖纪律",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">关于 Invest</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          个人投资修炼场 · 认知复利实验
        </p>
      </header>

      <section className="glass rounded-2xl p-5 space-y-2">
        <h2 className="text-lg font-semibold">两条主线</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          量化学习采用费曼学习法 + 习题带练：每天一个概念讲到外行听懂，
          并完成一道习题，写下推理过程与卡点。
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          基本面阅读：每天精读一份财报，每周精读两份招股书，读完即生成结构化笔记。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground">三阶段目标</h2>
        {PHASES.map((p) => (
          <Card key={p.title} className={`glass ${p.tint}`}>
            <CardContent className="flex gap-3.5 p-5">
              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-full ${p.iconColor} bg-current/10`}
              >
                <p.icon className="size-5" />
              </div>
              <div className="min-w-0 space-y-1">
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {p.desc}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-foreground">学习闭环</h2>
        <div className="glass rounded-2xl p-5 space-y-2 text-sm leading-relaxed">
          <p>本地写 Markdown → git push → Actions 自动构建 → 手机日历回看。</p>
          <p>
            日常只需记住 4 条命令：<code>new:*</code> 生成模板 · 编辑内容 ·
            <code>pnpm dev</code> 预览 · <code>git push</code> 发布。
          </p>
          <p>这是一场以「年」为单位的实验，打卡天数是复利的刻度。</p>
        </div>
      </section>
    </div>
  );
}
