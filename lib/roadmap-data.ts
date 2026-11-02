/** 量化学习路线图数据（纯数据，客户端安全） */

export interface RoadmapStage {
  stage: number;
  name: string;
  weeks: string;
  goal: string;
  concepts: string[];
  drills: string[];
  acceptance: string;
}

export const ROADMAP_STAGES: RoadmapStage[] = [
  {
    stage: 1,
    name: "统计基础",
    weeks: "2 周",
    goal: "标准差 / 相关系数 / 正态分布 / 回归",
    concepts: [
      "mean-variance-stddev",
      "correlation-coefficient",
      "covariance",
      "normal-distribution",
      "linear-regression",
    ],
    drills: [
      "drill-2026-11-27-covcorr",
      "drill-2026-11-14-normaltrap",
    ],
    acceptance: "能徒手算一组数据的标准差并解释含义",
  },
  {
    stage: 2,
    name: "收益风险指标",
    weeks: "2 周",
    goal: "夏普 / 最大回撤 / 卡玛 / 索提诺",
    concepts: [
      "annualized-return",
      "volatility",
      "sharpe-ratio",
      "sortino-ratio",
      "max-drawdown",
      "calmar-ratio",
      "win-rate-pl-ratio",
    ],
    drills: [
      "drill-2026-11-03-sharpe",
      "drill-2026-11-05-sharpetrap",
      "drill-2026-11-06-drawdown",
      "drill-2026-11-10-annret",
      "drill-2026-11-13-sortino",
      "drill-2026-11-17-winrate",
    ],
    acceptance: "能给任一策略算全套指标并判断好坏",
  },
  {
    stage: 3,
    name: "组合理论",
    weeks: "2 周",
    goal: "Alpha / Beta / 相关性 / 有效前沿",
    concepts: ["alpha", "beta", "correlation-matrix", "efficient-frontier", "diversification"],
    drills: ["drill-2026-11-04-alphabeta", "drill-2026-11-24-portfoliovar", "drill-2026-11-11-diversify"],
    acceptance: "能解释为什么 2 个夏普 2 的策略组合能到 3+",
  },
  {
    stage: 4,
    name: "选股因子",
    weeks: "3 周",
    goal: "价值 / 动量 / 质量 / 低波",
    concepts: [
      "pe-pb-ps",
      "roe",
      "value-factor",
      "quality-factor",
      "momentum-factor",
      "low-vol-factor",
      "dividend-factor",
    ],
    drills: [
      "drill-2026-11-12-petrap",
      "drill-2026-11-19-momentumtrap",
      "drill-2026-11-20-roedecomp",
      "drill-2026-11-28-lowvol",
    ],
    acceptance: "能对任一股票说出 3 个适用因子",
  },
  {
    stage: 5,
    name: "回测方法论",
    weeks: "3 周",
    goal: "样本内外 / 滚动前推 / 过拟合",
    concepts: [
      "in-out-sample",
      "walk-forward",
      "parameter-plateau",
      "overfitting-signals",
      "lookahead-bias",
    ],
    drills: [
      "drill-2026-11-18-overfit",
      "drill-2026-11-21-lookahead",
      "drill-2026-11-26-plateautrap",
      "drill-2026-11-30-sampletrap",
    ],
    acceptance: "能识别一份回测报告里的 5 种过拟合信号",
  },
  {
    stage: 6,
    name: "实盘对接",
    weeks: "2 周",
    goal: "成本 / 滑点 / 仓位管理",
    concepts: ["cost-slippage"],
    drills: ["drill-2026-11-25-momentumcost"],
    acceptance: "能写一份完整的策略落地检查清单",
  },
];

