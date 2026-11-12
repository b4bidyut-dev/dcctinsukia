import path from "path";
import type { NextConfig } from "next";

// Ensure build environments (Vercel, Render) have necessary environment variables with absolute path
if (!process.env.DATABASE_URL || process.env.DATABASE_URL === "file:./dev.db") {
  const dbPath = path.resolve(process.cwd(), "prisma", "dev.db");
  process.env.DATABASE_URL = `file:${dbPath}`;
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "dcc_tinsukia_notes_portal_super_secret_jwt_key_2026_secured";
}

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
