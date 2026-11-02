import type { Metadata } from "next";
import { RoadmapTimeline } from "@/components/roadmap-timeline";
import { getAllConcepts } from "@/lib/concepts";

export const metadata: Metadata = { title: "量化路线图" };

export default function RoadmapPage() {
  const conceptNames: Record<string, string> = {};
  for (const c of getAllConcepts()) {
    conceptNames[c.id] = c.name;
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">量化路线图</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          6 阶段 · 14 周 · 左右滑动查看 · 进度实时取自本机浏览器状态
        </p>
      </header>
      <RoadmapTimeline conceptNames={conceptNames} />
    </div>
  );
}
