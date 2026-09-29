import type { NextConfig } from "next";

// Set NEXT_PUBLIC_BASE_PATH (e.g. "/alpha-arts-web") only when hosting in a
// sub-folder such as GitHub Pages project sites. Leave empty for a custom domain.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "export",
  // Pin the project root (a stray package-lock.json exists higher up the disk).
  turbopack: { root: process.cwd() },
  trailingSlash: true,
  basePath,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [640, 960, 1280, 1920],
    imageSizes: [384],
  },
};

export default nextConfig;
