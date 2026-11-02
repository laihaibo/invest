"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChecklistPanel } from "@/components/checklist-panel";
import { PromptCard } from "@/components/prompt-card";
import { PROMPTS } from "@/lib/prompts";

/** 章节 1：阅读顺序四步法 */
const STEPS = [
  {
    time: "5 分钟",
    title: "审计意见",
    what: "是否无保留、KAM 点了什么、事务所是否更换",
    flags: "保留意见 / 强调事项段 / 事务所频繁更换",
  },
  {
    time: "30 分钟",
    title: "三大报表主表",
    what: "净利润 vs 经营现金流是否同向",
    flags: "连续 3 年利润涨但现金流跌",
  },
  {
    time: "30-40 分钟",
    title: "附注",
    what: "信息密度最高，99% 散户跳过",
    flags: "见章节 2 的四大宝藏位置",
  },
  {
    time: "20 分钟",
    title: "MD&A",
    what: "最后读，让数字先设定预期再听故事",
    flags: "措辞比上期软化（略有挑战 → 面临压力）",
  },
];

/** 章节 2：附注四大宝藏位置 */
const TREASURES = [
  {
    title: "应收账款账龄",
    desc: "3 年以上占比 >15% 危险",
  },
  {
    title: "关联方交易",
    desc: "看定价是否偏离市场价",
  },
  {
    title: "或有事项",
    desc: "担保、诉讼、贴现票据",
  },
  {
    title: "会计政策变更",
    desc: "折旧年限拉长 = 会计改善非经营改善",
  },
];

/** 章节 3：三遍阅读法 */
const PASSES = [
  { name: "第一遍 · 框架", time: "10 分钟", what: "审计意见 + 三大数 + 同比" },
  { name: "第二遍 · 详读", time: "40 分钟", what: "抓两个矛盾：数字之间、数字与故事" },
  { name: "第三遍 · AI 验证", time: "20 分钟", what: "使用下方提示词库" },
];

export function GuideContent() {
  const [value, setValue] = useState<string>("");
  // /plans 时间线卡片深链：/guide?focus=method 自动展开「三遍阅读法」
  useEffect(() => {
    const focus = new URLSearchParams(window.location.search).get("focus");
    if (focus === "method") setValue("method");
  }, []);

  return (
    <Accordion value={value} onValueChange={setValue} className="space-y-4">
      <AccordionItem value="steps">
        <AccordionTrigger>1 · 阅读顺序（四步法）</AccordionTrigger>
        <AccordionContent className="space-y-3">
          {STEPS.map((s) => (
            <div key={s.title} className="rounded-xl bg-secondary/60 p-3.5">
              <p className="text-sm font-medium">
                {s.title}
                <span className="ml-2 text-xs text-muted-foreground">{s.time}</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">看什么：{s.what}</p>
              <p className="mt-1 text-sm text-red-500/90">红旗：{s.flags}</p>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="treasures">
        <AccordionTrigger>2 · 附注四大宝藏位置</AccordionTrigger>
        <AccordionContent className="grid grid-cols-2 gap-3">
          {TREASURES.map((t) => (
            <div key={t.title} className="rounded-xl bg-secondary/60 p-3.5">
              <p className="text-sm font-medium">{t.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.desc}</p>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="method">
        <AccordionTrigger>3 · 三遍阅读法（适配每天 90 分钟）</AccordionTrigger>
        <AccordionContent className="space-y-2.5">
          {PASSES.map((p) => (
            <div key={p.name} className="flex items-start gap-2.5 rounded-xl bg-secondary/60 p-3.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/12 text-xs font-semibold text-primary">
                {p.name.slice(0, 1)}
              </span>
              <div>
                <p className="text-sm font-medium">
                  {p.name}
                  <span className="ml-2 text-xs text-muted-foreground">{p.time}</span>
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">{p.what}</p>
              </div>
            </div>
          ))}
          <p className="text-center text-xs text-muted-foreground">
            框架 → 详读 → AI 验证 · 流程固定，先自己再外脑
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="checklist">
        <AccordionTrigger>4 · 一页检查清单（每日重置）</AccordionTrigger>
        <AccordionContent>
          <ChecklistPanel />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="boundary">
        <AccordionTrigger>5 · AI 辅助边界表</AccordionTrigger>
        <AccordionContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-teal-500/10 p-3.5">
              <p className="text-sm font-medium text-teal-600 dark:text-teal-300">AI 该做</p>
              <ul className="mt-1.5 space-y-1 text-xs leading-relaxed text-muted-foreground">
                <li>· 翻译外文财报、解释术语</li>
                <li>· 抽 5 年对比数据</li>
                <li>· 抽取附注指定项</li>
                <li>· 复述你的结论</li>
                <li>· 扮演看空方</li>
              </ul>
            </div>
            <div className="rounded-xl bg-amber-500/10 p-3.5">
              <p className="text-sm font-medium text-amber-600 dark:text-amber-300">你必须自己来</p>
              <ul className="mt-1.5 space-y-1 text-xs leading-relaxed text-muted-foreground">
                <li>· 通读主表</li>
                <li>· 精读 MD&A 语气</li>
                <li>· 判断 Non-GAAP 剔除口径</li>
                <li>· 下最终判断</li>
                <li>· 费曼法输出</li>
              </ul>
            </div>
          </div>
          <p className="rounded-xl bg-red-500/10 p-3.5 text-xs leading-relaxed text-red-500/90">
            Reputation Age 2026-09 测试显示 AI 对财报数字回报 40% 出错率（EBITDA 错 36% / 增速错 42%）。
            AI 处理语言层，你处理判断层。
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="prompts">
        <AccordionTrigger>6 · AI 提示词库（点击卡片展开，右上角复制）</AccordionTrigger>
        <AccordionContent className="space-y-3">
          {PROMPTS.map((p) => (
            <PromptCard key={p.id} prompt={p} />
          ))}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="feynman-method">
        <AccordionTrigger>7 · 费曼学习法操作指南</AccordionTrigger>
        <AccordionContent className="space-y-3">
          {[
            { n: "1", t: "选概念", d: "从 /concepts 选一个 status = 未学 或 学习中的概念，只选一个。" },
            { n: "2", t: "裸讲", d: "合上所有资料，用手机录音 3 分钟，假装讲给完全不懂的家人听，不许翻书。" },
            { n: "3", t: "卡壳反馈", d: "回放录音，列出所有卡壳点和逻辑跳跃的地方——这些就是你没真懂的位置。" },
            { n: "4", t: "重新学习 + 再讲", d: "回 /concepts 详情页重点补卡壳点，再录一遍，直到 3 分钟流畅讲完。" },
          ].map((s) => (
            <div key={s.n} className="flex items-start gap-3 rounded-xl bg-secondary/60 p-3.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/12 text-sm font-semibold text-primary">
                {s.n}
              </span>
              <div>
                <p className="text-sm font-medium">{s.t}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            </div>
          ))}
          <p className="rounded-xl bg-primary/10 p-3.5 text-sm text-primary">
            「听懂了」和「会讲了」之间的差距，就是你需要训练的全部。
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="error-attribution">
        <AccordionTrigger>8 · 错题归因方法论</AccordionTrigger>
        <AccordionContent className="space-y-3">
          {[
            { c: "bg-blue-500/10 text-blue-600 dark:text-blue-300", t: "🔵 概念混淆（不知道用什么概念）", d: "解法：回 /concepts 重读费曼讲解，重新裸讲录音——这是知识缺失，不是粗心。" },
            { c: "bg-amber-500/10 text-amber-600 dark:text-amber-300", t: "🟡 计算错误（思路对但算错）", d: "解法：不是「粗心」，是「自动化不足」——同类计算连续 5 道全对才算过关。" },
            { c: "bg-violet-500/10 text-violet-600 dark:text-violet-300", t: "🟣 前提假设错（对题目条件理解偏了）", d: "解法：读题时先写「这题已知什么、求什么」，再动笔——审题是独立技能。" },
            { c: "bg-red-500/10 text-red-600 dark:text-red-300", t: "🔴 数据理解错（把 A 数据当成 B）", d: "解法：养成「先看单位、再看口径、再看时间区间」三连问，看完才准计算。" },
          ].map((e) => (
            <div key={e.t} className={`rounded-xl p-3.5 ${e.c}`}>
              <p className="text-sm font-medium">{e.t}</p>
              <p className="mt-1 text-sm leading-relaxed opacity-90">{e.d}</p>
            </div>
          ))}
          <p className="rounded-xl bg-primary/10 p-3.5 text-sm text-primary">
            错题本的核心是「卡壳点」和「归因」，不是抄题。
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}