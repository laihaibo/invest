"use client";

import { Toaster as SonnerToaster } from "sonner";

/** 全局 Toast 容器（挂载在根布局） */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      toastOptions={{
        style: {
          borderRadius: "14px",
        },
      }}
    />
  );
}
