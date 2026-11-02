"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrainCircuit, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Markdown } from "@/components/markdown";
import { conceptLastReviewKey, conceptStatusKey, type Concept, type ConceptStatus } from "@/lib/concept-types";
import { localToday } from "@/lib/plan-types";
import { PROMPTS } from "@/lib/prompts";

/** 费曼反刍提示词（lib/prompts.ts 中的 feynman-replay），【概念名】替换为当前概念 */
function feynmanPrompt(name: string): string {
  const p = PROMPTS.find((x) => x.id === "feynman-replay");
  return (p?.body ?? "").replaceAll("【概念名】", name);
}

export function ConceptDetail({ concept }: { concept: Concept }) {
  const [status, setStatus] = useState<ConceptStatus>(concept.status);
  const [lastReview, setLastReview] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem(conceptStatusKey(concept.id));
    if (s === "new" || s === "learning" || s === "learned" || s === "mastered") {
      setStatus(s);
    }
    setLastReview(localStorage.getItem(conceptLastReviewKey(concept.id)));
    setMounted(true);
  }, [concept.id]);

  const save = (s: ConceptStatus, reviewedToday: boolean) => {
    localStorage.setItem(conceptStatusKey(concept.id), s);
    if (reviewedToday) {
      const today = localToday();
      localStorage.setItem(conceptLastReviewKey(concept.id), today);
      setLastReview(today);
    }
    setStatus(s);
  };

  const copyFeynman = async () => {
    try {
      await navigator.clipboard.writeText(feynmanPrompt(concept.name));
      toast.success("已复制费曼反刍提示词，粘贴到 ChatGPT / Claude 并上传你的裸讲转写");
    } catch {
      toast.error("复制失败，请手动选择文本");
    }
  };

  return (
    <article className="space-y-4">
      <header className="glass rounded-2xl p-5 space-y-2">
        <p className="text-xs text-muted-foreground">
          {concept.category} · 难度 {"★".repeat(concept.difficulty)}
          {mounted && (
            <span className="ml-2">
              状态：{conceptStatusLabel(status)}
              {lastReview && ` · 上次复习 ${lastReview}`}
            </span>
          )}
        </p>
        <h1 className="text-xl font-semibold">
          {concept.name}
          <span className="ml-2 text-sm font-normal text-muted-foreground">{concept.en}</span>
        </h1>
        {concept.formula && (
          <p className="rounded-xl bg-secondary/70 px-3 py-2 font-mono text-sm">{concept.formula}</p>
        )}
        {(concept.prerequisite.length > 0 || concept.related.length > 0) && (
          <div className="flex flex-wrap gap-1.5 pt-1 text-xs">
            {concept.prerequisite.map((id) => (
              <Link key={id} href={`/concepts/${id}`} className="rounded-full bg-secondary px-2.5 py-1 text-muted-foreground hover:text-primary">
                前置：{id}
              </Link>
            ))}
            {concept.related.map((id) => (
              <Link key={id} href={`/concepts/${id}`} className="rounded-full bg-secondary px-2.5 py-1 text-muted-foreground hover:text-primary">
                关联：{id}
              </Link>
            ))}
          </div>
        )}
      </header>

      {concept.sections.map((sec) => (
        <section key={sec.title} className="glass rounded-2xl p-5">
          <h2 className="mb-2 text-sm font-medium text-muted-foreground">{sec.title}</h2>
          <Markdown content={sec.content} />
        </section>
      ))}

      <div className="flex flex-wrap gap-2.5 pb-6">
        <button
          onClick={copyFeynman}
          aria-label="复制费曼反刍提示词"
          className="glass inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm text-primary"
        >
          <BrainCircuit className="size-4" />
          我讲给 AI 听
        </button>
        <button
          onClick={() => { save(status, true); toast.success("已记录本次复习"); }}
          aria-label="标记今天已复习"
          className="glass inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm"
        >
          <RefreshCw className="size-4" />
          已复习
        </button>
        <button
          onClick={() => { save("mastered", true); toast.success("标记为已掌握，清除待复习角标"); }}
          aria-label="标记为已掌握"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm text-primary-foreground"
        >
          <CheckCircle2 className="size-4" />
          标记为已掌握
        </button>
      </div>
    </article>
  );
}

function conceptStatusLabel(s: ConceptStatus): string {
  return { new: "未学", learning: "学习中", learned: "已学", mastered: "已掌握" }[s];
}
