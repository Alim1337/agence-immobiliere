import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project folder. Without this, Turbopack
  // can get confused if a parent directory (e.g. your user home folder on
  // Windows) contains a stray package-lock.json / yarn.lock, and will pick
  // the wrong directory as the root — causing module resolution errors.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
