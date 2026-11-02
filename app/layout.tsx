import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Invest · 个人投资学习平台",
    template: "%s · Invest",
  },
  description: "以年为单位的认知复利实验：量化投资刻意练习 + 基本面精读",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-3xl flex-1 px-5 pt-6 pb-28 md:pb-16">
          {children}
        </main>
        <footer className="hidden pb-6 text-center text-xs text-muted-foreground md:block">
          Invest · 以年为单位的认知复利
        </footer>
      </body>
    </html>
  );
}
