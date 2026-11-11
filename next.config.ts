import type { NextConfig } from "next";

// Ensure build environments (Cloudflare Pages, Vercel, Render) have necessary environment variables
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
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
