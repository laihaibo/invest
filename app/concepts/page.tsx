import type { Metadata } from "next";
import { ConceptsBrowser } from "@/components/concepts-browser";
import { getAllConcepts } from "@/lib/concepts";

export const metadata: Metadata = { title: "量化概念库" };

export default function ConceptsPage() {
  const concepts = getAllConcepts();

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">量化概念库</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          30 个核心概念 · 费曼讲解 + 间隔复习 · 状态存在本机浏览器
        </p>
      </header>
      <ConceptsBrowser concepts={concepts} />
    </div>
  );
}
