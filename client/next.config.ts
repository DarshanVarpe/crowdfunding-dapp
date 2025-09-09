import type { NextConfig } from "next";
import path from 'path';
import { fileURLToPath } from 'url';

// These lines are the modern, TypeScript-compatible way to define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig: NextConfig = {
  // Add this line to fix the monorepo warning
  outputFileTracingRoot: __dirname,

  // You can keep any other config options you have here
};

export default nextConfig;