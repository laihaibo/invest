#!/usr/bin/env node
// 用法：pnpm new:quant [YYYY-MM-DD] [slug后缀]
//       pnpm new:report [YYYY-MM-DD] [slug后缀]
//       pnpm new:prospectus [YYYY-MM-DD] [slug后缀]
// 在 content/<type>/ 下生成带 frontmatter 的当日笔记模板。
import fs from "node:fs";
import path from "node:path";

const TYPE_LABELS = {
  quant: "量化学习",
  report: "财报精读",
  prospectus: "招股书精读",
};

const today = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

const type = process.argv[2];
const date = process.argv[3] || today();
const suffix = process.argv[4] || "untitled";

if (!TYPE_LABELS[type]) {
  console.error(`未知类型: ${type}，应为 quant / report / prospectus`);
  process.exit(1);
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error(`日期格式应为 YYYY-MM-DD，收到: ${date}`);
  process.exit(1);
}

// slug 只保留字母数字与连字符，保证 URL 干净
const slug = suffix
  .toLowerCase()
  .replace(/\s+/g, "-")
  .replace(/[^a-z0-9-]/g, "")
  .replace(/-+/g, "-")
  .replace(/^-|-$/g, "") || "untitled";

const dir = path.join(process.cwd(), "content", type);
const file = path.join(dir, `${date}-${slug}.md`);

if (fs.existsSync(file)) {
  console.error(`文件已存在，跳过: content/${type}/${date}-${slug}.md`);
  process.exit(1);
}

fs.mkdirSync(dir, { recursive: true });

const templates = {
  quant: `---
date: "${date}"
type: quant
title: 
tags: []
thesis: 
problem: 
my_answer: 
reflection: 
---

# 概念讲解（费曼练习：讲给完全不懂的外行）

<!-- 用自己的话讲清今天的概念，不许照抄定义 -->

# 习题与推理过程

<!--
习题：
${"{{ 今日习题，贴原文或自己出一道 }}"} -->

# 卡点与下一步

`,
  report: `---
date: "${date}"
type: report
title:
tags: []
thesis:
company:
sector:
rating:
---

# 核心观点

# 关键数字

<!-- 营收 / 利润 / 毛利率 / 现金流……只抄打动你的三个数字并说明为什么 -->

# 生意逻辑

# 风险与验证点

`,
  prospectus: `---
date: "${date}"
type: prospectus
title:
tags: []
thesis:
company:
sector:
rating:
---

# 这是一门什么生意

# 为什么上市 / 募资用途

# 商业模式拆解（第一性原理）

# 风险因素

`,
};

fs.writeFileSync(file, templates[type], "utf8");
console.log(`已创建 content/${type}/${date}-${slug}.md`);
