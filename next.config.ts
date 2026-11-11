import type { NextConfig } from "next";
import path from "node:path";

/**
 * GitHub project pages are served from `https://<owner>.github.io/<repo>/`,
 * while user/organization pages and custom domains are served from the root.
 * The deploy workflow sets NEXT_PUBLIC_BASE_PATH to `/<repo>` for project pages
 * and leaves it empty for root deployments.
 */
function resolveBasePath(value: string | undefined): string {
  const trimmed = value?.trim().replace(/\/+$/, "") ?? "";
  if (!trimmed || trimmed === "/") return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1"],
  // GitHub Pages only serves static files, so export the whole app to `out/`.
  output: "export",
  // Emit `route/index.html` so GitHub Pages resolves routes without rewrites.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: resolveBasePath(process.env.NEXT_PUBLIC_BASE_PATH),
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
