import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/siteConfig";

export const dynamic = "force-static";

// 1. Tipe data item postingan blog (disiapkan untuk nanti)
// interface BlogPostItem {
//   slug: string;
//   updated_at?: string;
//   published_at?: string;
// }

// 2. Daftar rute statis utama
const staticRoutes = [
  { path: "", changeFrequency: "weekly" as const, priority: 1.0 },
  { path: "resume", changeFrequency: "monthly" as const, priority: 0.8 },
  // { path: "blog", changeFrequency: "daily" as const, priority: 0.9 }, // Aktifkan jika halaman index blog sudah siap
];

// 3. Helper: Ambil data artikel (disiapkan untuk nanti)
// async function getBlogPosts(): Promise<BlogPostItem[]> {
//   const apiUrl = "https://api.afrizahanif.com/api/posts";
//   try {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 5000);
//     const res = await fetch(apiUrl, {
//       signal: controller.signal,
//       headers: { Accept: "application/json" },
//     });
//     clearTimeout(timeoutId);
//     if (!res.ok) throw new Error(`API error: ${res.status}`);
//     const data = await res.json();
//     return Array.isArray(data) ? data : data.data || [];
//   } catch {
//     try {
//       const localData = await import("@/data/jsons/posts.json");
//       return Array.isArray(localData.default)
//         ? localData.default
//         : (localData as any).data || [];
//     } catch {
//       return [];
//     }
//   }
// }

// 4. Generator Sitemap Utama
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.site.url.replace(/\/$/, "");

  // A. Generate entri untuk rute statis (Beranda & Resume)
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => {
    const routePath = route.path ? `/${route.path}/` : "/";
    const fullUrl = `${baseUrl}${routePath}`;

    return {
      url: fullUrl,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          en: `${fullUrl}?lang=en`,
          id: `${fullUrl}?lang=id`,
        },
      },
    };
  });

  // B & C. Artikel blog dinamis (di-uncomment nanti ketika fitur blog sudah live)
  // const posts = await getBlogPosts();
  // const blogEntries: MetadataRoute.Sitemap = posts.map((post) => {
  //   const fullUrl = `${baseUrl}/blog/${post.slug}/`;
  //   return {
  //     url: fullUrl,
  //     lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
  //     changeFrequency: "weekly" as const,
  //     priority: 0.7,
  //     alternates: {
  //       languages: {
  //         en: `${fullUrl}?lang=en`,
  //         id: `${fullUrl}?lang=id`,
  //       },
  //     },
  //   };
  // });

  // D. Kembalikan rute aktif saat ini
  return staticEntries;
}
