import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/siteConfig";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.site.url;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}?lang=en`,
          id: `${baseUrl}?lang=id`,
        },
      },
    },
  ];
}
