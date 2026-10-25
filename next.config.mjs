/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets a verification build run in its own folder without touching `pnpm dev`'s cache.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
}

export default nextConfig
