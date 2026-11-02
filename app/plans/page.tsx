import type { Metadata } from "next";
import { FundSopCard } from "@/components/fund-sop-card";
import { PlanMonthView } from "@/components/plan-month-view";
import { getAllPlans } from "@/lib/plans";

export const metadata: Metadata = { title: "月度计划" };

export default function PlansPage() {
  const plans = getAllPlans();
  const latest = plans[0];

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">月度计划</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          每月一个 YAML，push 即生效 · 点击状态按钮循环 待办/跳过/完成
        </p>
      </header>

      <PlanMonthView plans={plans} />

      {latest?.fundReminder && (
        <FundSopCard
          reminder={latest.fundReminder}
          disclosureCalendar={latest.disclosureCalendar}
        />
      )}
    </div>
  );
}
