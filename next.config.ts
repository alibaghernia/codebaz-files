import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  basePath: '/codebaz-files', // اسم ریپوی گیت‌هاب
  images: { unoptimized: true },
  distDir: 'dist',
  trailingSlash: true,
};

export default nextConfig;
