"use client";

import { useState } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { toast } from "sonner";
import { type PromptCardData } from "@/lib/prompts";

/** 复制文本：clipboard API 优先，失败降级 execCommand */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

export function PromptCard({ prompt }: { prompt: PromptCardData }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    const ok = await copyText(prompt.body);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast.success("已复制，粘贴到 ChatGPT / Claude 使用，记得上传财报 PDF");
    } else {
      toast.error("复制失败，请手动选择文本复制");
    }
  };

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-start justify-between gap-2">
        <button
          onClick={() => setOpen((v) => !v)}
          className="min-w-0 flex-1 text-left"
        >
          <p className="font-medium leading-snug">{prompt.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            场景：{prompt.scenario}
          </p>
        </button>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={onCopy}
            aria-label="复制提示词"
            className="flex size-10 items-center justify-center rounded-full bg-secondary/70 text-muted-foreground transition-colors hover:text-primary"
          >
            {copied ? <Check className="size-4 text-teal-500" /> : <Copy className="size-4" />}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="展开正文"
            className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronDown className={open ? "size-4 rotate-180 transition-transform" : "size-4 transition-transform"} />
          </button>
        </div>
      </div>
      {open && (
        <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-secondary/60 p-3 text-sm leading-relaxed">
          {prompt.body}
        </pre>
      )}
    </div>
  );
}
