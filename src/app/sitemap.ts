import type { MetadataRoute } from "next";
import { NICHE_LIST } from "@/lib/niches";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return [
    {
      url: siteUrl,
      changeFrequency: "hourly",
      priority: 1,
    },
    ...NICHE_LIST.map((n) => ({
      url: `${siteUrl}/nicho/${n.slug}`,
      changeFrequency: "hourly" as const,
      priority: 0.8,
    })),
  ];
}
