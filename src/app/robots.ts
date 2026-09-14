import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const isProd =
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_SITE_URL?.includes("afrizahanif.com");

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
    sitemap: "https://afrizahanif.com/sitemap.xml",
  };
}
