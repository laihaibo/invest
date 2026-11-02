# AGENTS.md — 给未来 AI 协作者的约定

Invest 是纯静态个人投资学习平台（Next.js 15 静态导出 + GitHub Pages）。修改本仓库时遵守以下约定。

## 技术基线

- pnpm + Node 22，禁用 npm/yarn/bun
- 禁止引入数据库、认证、任何外部 SaaS；纯静态导出
- 静态内容用 Server Components；仅交互（日历切换、状态循环等）用 `'use client'`
- 深浅模式纯 CSS 跟随系统，无 JS 主题切换

## 项目结构

```
app/            页面（/ /calendar /day/[date] /quant /report/[slug] /archive /about /plans /guide /concepts /concepts/[id] /drill /roadmap）
components/     业务组件；components/ui/ 为 shadcn 基础组件
content/        本地内容源（quant/ report/ prospectus/ plans/ concepts/ drills/）
lib/            content.ts+plans.ts+concepts.ts+drills.ts(fs 解析) / note/plan/concept/drill-types.ts(客户端安全类型) / prompts.ts / roadmap-data.ts
scripts/        new-note.mjs（pnpm new:quant / new:report / new:prospectus）
```

## localStorage key 规范

- `invest.plan.status.<date>` 月度计划条目状态（done/todo/skipped 循环）
- `invest.checklist.<date>` 读财报检查清单（按天重置）
- `invest.concept.status.{id}` / `invest.concept.lastReview.{id}` 概念状态与复习
- `invest.drill.answer.{id}` / `invest.drill.errorType.{id}` / `invest.drill.stage.{id}` 习题作答/归因/解锁

## frontmatter 规范

```yaml
date: "YYYY-MM-DD"   # 必须带引号的字符串；必须与文件名前缀一致
type: quant | report | prospectus
title: / tags: [] / thesis:
# quant 专用：problem / my_answer / reflection
# report|prospectus 专用：company / sector / rating(1-5)
```

文件命名 `YYYY-MM-DD-<英文slug>.md`；slug 在 report/ 与 prospectus/ 间不可重名（共用路由）。

## 其他约定

- 图片放 `public/images/`，Markdown 里用相对路径（渲染器自动补 basePath `/invest`）
- UI 文案、README、注释全部中文
- 新页面移动端优先；玻璃卡片 `blur` 上限 16px；尊重 `prefers-reduced-motion`
- 客户端组件禁止 import `lib/content.ts`（含 node:fs）；共享类型从 `lib/note-types.ts` 导入
- 提交信息遵循 Conventional Commits（feat/fix/docs/chore/ci）
