import type { Metadata } from "next";
import Link from "next/link";
import { GuideContent } from "@/components/guide-content";

export const metadata: Metadata = { title: "读财报指南" };

export default function GuidePage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">读财报指南</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          静态方法论 + 6 个实战 AI 提示词 · 从 /plans 时间线点财报卡片可直达「三遍阅读法」
        </p>
      </header>

      <GuideContent />

      <p className="pt-2 text-center text-xs text-muted-foreground">
        <Link href="/about" className="underline-offset-4 hover:underline">
          关于本项目的三阶段目标 →
        </Link>
      </p>
    </div>
  );
}
