import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ConceptDetail } from "@/components/concept-detail";
import { getAllConcepts, getConcept } from "@/lib/concepts";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllConcepts().map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const concept = getConcept(id);
  return { title: concept ? concept.name : "概念详情" };
}

export default async function ConceptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const concept = getConcept(id);
  if (!concept) notFound();

  return (
    <div className="space-y-4">
      <Link
        href="/concepts"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        返回概念库
      </Link>
      <ConceptDetail concept={concept} />
    </div>
  );
}
