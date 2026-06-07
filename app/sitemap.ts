import type { MetadataRoute } from "next";
import { tools } from "@/lib/content";
import { getPosts } from "@/lib/actions/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://tajertools.com";
  const locales = ["en", "ar"];
  const staticRoutes = ["", "/tools", "/blog", "/contact"];

  // Generate static page sitemaps for both locales
  const staticPages = locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1.0 : 0.8,
    })),
  );

  // Generate dynamic tools sitemaps for both locales
  const toolPages = locales.flatMap((locale) =>
    tools.map((tool) => ({
      url: `${baseUrl}/${locale}/tools/${tool.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  );

  // Generate dynamic blog posts sitemaps for both locales
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const postsResponse = await getPosts();
    if (postsResponse.success && postsResponse.data) {
      blogPages = locales.flatMap((locale) =>
        postsResponse.data!.map((post) => ({
          url: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastModified: new Date(post.updatedAt || post.createdAt),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        })),
      );
    }
  } catch (error) {
    console.error("Failed to generate blog sitemaps dynamically:", error);
  }

  return [...staticPages, ...toolPages, ...blogPages];
}
