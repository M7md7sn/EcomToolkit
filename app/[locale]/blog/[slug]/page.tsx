import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Layers } from "lucide-react";
import { ToolCard } from "@/components/tool-card";
import { getPostBySlug } from "@/lib/actions/blog";
import { tools, copy } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n";
import fs from "fs";
import path from "path";

// Generate static params from posts.json during build time
export function generateStaticParams() {
  try {
    const filePath = path.join(process.cwd(), "data", "posts.json");
    if (!fs.existsSync(filePath)) return [];
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const posts = JSON.parse(fileContent || "[]");
    return posts.flatMap((post: any) => [
      { locale: "en", slug: post.slug },
      { locale: "ar", slug: post.slug }
    ]);
  } catch (error) {
    console.error("Failed to generate static params for blog:", error);
    return [];
  }
}

// Generate dynamic metadata
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const current = isLocale(locale) ? locale : "en";
  const res = await getPostBySlug(slug);

  if (!res.success || !res.data) return {};
  const post = res.data;

  return {
    title: `${isLocale(locale) && locale === "ar" ? post.titleAr : post.titleEn} | ${isLocale(locale) && locale === "ar" ? "تاجر تولز" : "TajerTools"}`,
    description: isLocale(locale) && locale === "ar" ? post.introAr : post.introEn
  };
}

// Simple Markdown to HTML Parser
function renderMarkdownToHtml(markdown: string): string {
  if (!markdown) return "";

  // Replace HTML tags to prevent raw HTML injection/XSS
  let html = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headings
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");

  // Inline Code
  html = html.replace(/`(.*?)`/gim, "<code>$1</code>");

  // Blockquotes
  html = html.replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>");

  // Unordered list items
  // First match list items starting with - or *
  html = html.replace(/^\- (.*$)/gim, "<li>$1</li>");
  html = html.replace(/^\* (.*$)/gim, "<li>$1</li>");

  // Paragraph blocks (split by double newline, wrap text blocks in p if they aren't other elements)
  const blocks = html.split(/\n\r?\n/);
  const processed = blocks.map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return "";
    
    // If block starts with HTML tag, leave it as is
    if (
      trimmed.startsWith("<h") ||
      trimmed.startsWith("<li") ||
      trimmed.startsWith("<blockquote") ||
      trimmed.startsWith("<p>")
    ) {
      return block;
    }
    
    // Otherwise, wrap in paragraph
    return `<p>${block}</p>`;
  });

  return processed.filter(Boolean).join("\n");
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const t = copy[locale];
  const isAr = locale === "ar";

  const res = await getPostBySlug(slug);
  if (!res.success || !res.data) notFound();
  const post = res.data;

  const title = isAr ? post.titleAr : post.titleEn;
  const intro = isAr ? post.introAr : post.introEn;
  const category = isAr ? post.categoryAr : post.categoryEn;
  const content = isAr ? post.contentAr : post.contentEn;

  // Resolve related tools
  const relatedTools = (post.tools || [])
    .map((toolSlug) => tools.find((tool) => tool.slug === toolSlug))
    .filter((tool) => Boolean(tool));

  const parsedHtml = renderMarkdownToHtml(content);

  return (
    <main className="page-main article-view-page">
      <div className="article-nav-back">
        <Link href={`/${locale}/blog`} className="text-link back-to-blog-btn">
          <ArrowLeft size={16} className={isAr ? "rotate-180" : ""} />
          <span>{isAr ? "العودة للمدونة" : "Back to blog"}</span>
        </Link>
      </div>

      <article className="page-hero article-hero">
        <span className="eyebrow blog-article-cat">{category}</span>
        <h1>{title}</h1>
        <p className="article-intro-text">{intro}</p>
      </article>

      <section className="article-body-wrapper explain-panel">
        <div 
          className="markdown-body" 
          dangerouslySetInnerHTML={{ __html: parsedHtml }} 
        />
      </section>

      {relatedTools.length > 0 && (
        <section className="section-block article-related-tools">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{isAr ? "أدوات مرتبطة" : "Related Tools"}</span>
              <h2>{isAr ? "أدوات تكمل نفس القرار" : "Tools to apply this guide"}</h2>
            </div>
          </div>
          <div className="tools-grid">
            {relatedTools.map((tool, index) => (
              <ToolCard key={tool!.slug} tool={tool!} locale={locale} rank={index} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
