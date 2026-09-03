import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — ${SITE_TAGLINE}`,
    short_name: SITE_NAME,
    description: "دليل مهني مجاني لربط المحامين المصريين لتبادل الإنابات القضائية.",
    start_url: "/board",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0f172a",
    lang: "ar",
    dir: "rtl",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
