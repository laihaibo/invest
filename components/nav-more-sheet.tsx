"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
}

/** 底部导航「更多」：收纳次要入口，当前页高亮 */
export function NavMoreSheet({
  items,
  active,
}: {
  items: NavItem[];
  active: (href: string) => boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const anyActive = items.some((i) => active(i.href)) || false;
  void pathname;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="更多导航"
          className={cn(
            "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] transition-colors",
            anyActive ? "text-primary" : "text-muted-foreground",
          )}
        >
          <MoreHorizontal className="size-5" strokeWidth={anyActive ? 2.2 : 1.8} />
          更多
        </button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <nav className="space-y-1 pb-6" aria-label="更多导航列表">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex min-h-11 items-center rounded-xl px-4 text-base transition-colors",
                active(item.href)
                  ? "bg-primary/12 text-primary font-medium"
                  : "text-foreground hover:bg-accent",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
