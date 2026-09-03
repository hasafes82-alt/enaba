import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // شعارات الشركاء وصور الأعلام تُرفع على buckets عامة في Supabase Storage
        // (sponsors/avatars) — راجع SPEC.md §6 (التخزين).
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
