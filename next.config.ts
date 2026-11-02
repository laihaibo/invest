import type { NextConfig } from "next";

// 纯静态导出：构建产物在 out/，由 GitHub Pages 项目站托管（仓库名 invest）
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/invest",
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: "/invest",
  },
};

export default nextConfig;
