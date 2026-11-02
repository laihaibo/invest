"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function Sheet(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger(
  props: React.ComponentProps<typeof DialogPrimitive.Trigger>,
) {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(
  props: React.ComponentProps<typeof DialogPrimitive.Close>,
) {
  return <DialogPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetContent({
  className,
  children,
  side = "bottom",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  side?: "top" | "bottom" | "left" | "right";
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 supports-[backdrop-filter]:backdrop-blur-[2px]" />
      <DialogPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 glass border-none outline-none",
          side === "bottom" &&
            "inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl",
          side === "top" && "inset-x-0 top-0 rounded-b-2xl",
          side === "right" &&
            "inset-y-0 right-0 w-3/4 max-w-sm rounded-l-2xl",
          side === "left" && "inset-y-0 left-0 w-3/4 max-w-sm rounded-r-2xl",
          className,
        )}
        style={{
          backgroundColor:
            "light-dark(rgba(255,255,255,0.92), rgba(28,28,30,0.95))",
        }}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute top-4 right-4 rounded-full p-1.5 bg-secondary/80 text-muted-foreground transition-colors hover:text-foreground">
          <XIcon className="size-4" />
          <span className="sr-only">关闭</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
      <DialogPrimitive.Title className="sr-only">详情面板</DialogPrimitive.Title>
      <DialogPrimitive.Description className="sr-only">
        查看本篇笔记的元信息
      </DialogPrimitive.Description>
      </DialogPrimitive.Portal>
  );
}

export { Sheet, SheetTrigger, SheetClose, SheetContent };
