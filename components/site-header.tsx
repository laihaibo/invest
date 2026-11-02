"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Archive,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Info,
  Lightbulb,
  GraduationCap,
  Sigma,
} from "lucide-react";
import { NavMoreSheet } from "@/components/nav-more-sheet";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "今日", icon: BookOpen, mobile: "main" },
  { href: "/calendar", label: "日历", icon: CalendarDays, mobile: "main" },
  { href: "/concepts", label: "概念", icon: GraduationCap, mobile: "main" },
  { href: "/drill", label: "习题", icon: Sigma, mobile: "main" },
  { href: "/plans", label: "计划", icon: ClipboardList, mobile: "main" },
  { href: "/guide", label: "指南", icon: Lightbulb, mobile: "more" },
  { href: "/archive", label: "归档", icon: Archive, mobile: "more" },
  { href: "/quant", label: "量化", icon: Activity, mobile: "more" },
  { href: "/about", label: "关于", icon: Info, mobile: "more" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <>
      {/* 桌面端：顶部玻璃导航 */}
      <header className="hidden md:sticky md:top-0 md:z-40 md:block">
        <div className="glass border-x-0 border-t-0">
          <div className="mx-auto flex h-14 w-full max-w-3xl items-center gap-6 px-5">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-primary"
            >
              Invest
            </Link>
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-primary/12 font-medium text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* 移动端：底部玻璃标签栏（iOS 风格，安全区适配） */}
      <nav className="fixed inset-x-0 bottom-0 z-40 md:hidden">
        <div className="glass border-x-0 border-b-0 rounded-t-2xl px-2 pt-1.5 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
          <div className="grid grid-cols-5">
            {NAV_ITEMS.filter((item) => item.mobile === "main").map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <item.icon
                    className="size-5"
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                  {item.label}
                </Link>
              );
            })}
            <NavMoreSheet
              items={NAV_ITEMS.filter((i) => i.mobile === "more").map(
                ({ href, label }) => ({ href, label }),
              )}
              active={(href) => isActive(pathname, href)}
            />
          </div>
        </div>
      </nav>
    </>
  );
}
