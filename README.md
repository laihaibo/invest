# Invest · 个人投资学习平台

以「年」为单位的认知复利实验：本地写 Markdown → git push → GitHub Actions 自动构建 → 手机上通过日历视图回看认知轨迹。

## 技术栈

- Next.js 15（App Router，`output: 'export'` 纯静态导出）
- shadcn/ui + Tailwind CSS v4（CSS 变量主题，深浅模式跟随系统）
- pnpm + Node 22.x（`engines` 字段锁定）
- 内容源：`content/` 下的本地 Markdown（YAML frontmatter），`gray-matter` 解析
- TypeScript 严格模式，无数据库 / 无后端 / 无外部服务

## 日常使用（5 步循环）

1. **生成今日模板**：
   ```bash
   pnpm new:quant                      # 量化学习
   pnpm new:report 2026-11-02          # 财报精读
   pnpm new:prospectus 2026-11-02      # 招股书精读
   ```
   自动创建 `content/<type>/<date>-<slug>.md`，frontmatter 已按类型备好。
2. **编辑内容**：填写标题、核心观点、正文。quant 笔记记得填 `problem / my_answer / reflection`。
3. **本地预览**：`pnpm dev`，浏览器打开 http://localhost:3000/invest/。
4. **发布**：`git add -A && git commit -m "docs: 2026-11-02 量化笔记"`，然后 `git push`。
5. **手机回看**：等约 1 分钟，刷新 GitHub Pages 站点，日历上今天的圆点就亮了。

## 页面

| 路由 | 说明 |
| --- | --- |
| `/` | 今日最新一篇 + 双主线连续打卡 + 总量统计 + 每日金句 |
| `/calendar` | 月历视图（核心页）：圆点标记当日条目，左右滑动切月，点击日期看当天笔记 |
| `/quant` | 量化学习列表（卡片式，倒序） |
| `/quant/[slug]` | 量化详情：习题 → 我的解法 → 卡点 → 费曼讲解 |
| `/report/[slug]` | 财报 / 招股书详情（共用路由，slug 不可重名） |
| `/archive` | 全部笔记时间线，点击 tag 聚合成思维模型库 |
| `/plans` | 月度计划：`content/plans/YYYY-MM.yaml` 驱动，状态点击循环存 localStorage |
| `/guide` | 读财报指南 + 6 个 AI 提示词库（可一键复制） |
| `/about` | 三阶段目标 |

## 月度计划工作流

复制 `content/plans/2026-11.yaml` 改名为下月 → 改 `month`、`theme`、`items` → push。
`fund_reminder.next_due` 每季度手动更新一次（如 2027-01-20），SOP 卡片自动倒计时。
计划条目的完成状态存浏览器 localStorage（`invest.plan.status.<日期>`），不写回 YAML，
避免 push 时产生大量状态 diff 噪音；代价是换设备不同步。

## 站点地址

启用 GitHub Pages（Settings → Pages → Source 选 **GitHub Actions**）后，站点在：

**https://laihaibo.github.io/invest/**

## 开发

```bash
pnpm install   # 安装依赖
pnpm dev       # 本地开发
pnpm build     # 静态导出到 out/
pnpm lint      # ESLint 检查
```
