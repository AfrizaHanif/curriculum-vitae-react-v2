import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/siteConfig";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const isProd =
    process.env.NODE_ENV === "production" &&
    siteConfig.site.url.includes("afrizahanif.com");

  if (!isProd) {
    // Larang crawler mengindeks environment development / staging
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  // Izinkan pengindeksan penuh di Production
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${siteConfig.site.url}/sitemap.xml`,
  };
}
