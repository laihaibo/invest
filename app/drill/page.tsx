import type { Metadata } from "next";
import { DrillsBrowser } from "@/components/drills-browser";
import { getAllConcepts } from "@/lib/concepts";
import { getAllDrills } from "@/lib/drills";

export const metadata: Metadata = { title: "习题带练" };

export default function DrillPage() {
  const drills = getAllDrills();
  const conceptNames: Record<string, string> = {};
  for (const c of getAllConcepts()) {
    conceptNames[c.id] = c.name;
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">习题带练</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          提示 → 我的解答 → 标准解法，依次解锁防偷看 · 做完记得选错误归因
        </p>
      </header>
      <DrillsBrowser drills={drills} conceptNames={conceptNames} />
    </div>
  );
}
