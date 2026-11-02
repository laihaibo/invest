import type { NextConfig } from "next";

// 纯静态导出：构建产物在 out/，由 GitHub Pages 托管
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/invest",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
