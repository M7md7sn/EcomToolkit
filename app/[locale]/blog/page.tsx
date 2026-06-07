import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { getPosts } from "@/lib/actions/blog";
import { copy } from "@/lib/content";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const t = copy[locale];
  const isAr = locale === "ar";

  const res = await getPosts();
  const posts = res.success && res.data ? res.data : [];

  return (
    <main className="page-main">
      <section className="page-hero">
        <span className="eyebrow">{locale === "ar" ? "المدونة" : "Blog"}</span>
        <h1>{locale === "ar" ? "أدلة نمو عملية للمتاجر" : "Practical growth notes for sellers"}</h1>
        <p>
          {locale === "ar"
            ? "تعلم كيف تزيد أرباح متجرك، وتحسن تسعير منتجاتك، وتدير حملاتك الإعلانية بكفاءة."
            : "Learn how to improve store margins, price products effectively, and optimize your ad campaigns."}
        </p>
      </section>

      <AdSlot locale={locale} />

      {posts.length === 0 ? (
        <div className="empty-submissions-card">
          <BookOpen size={48} className="empty-icon" />
          <p>{isAr ? "لا توجد مقالات منشورة حالياً." : "No articles published yet."}</p>
        </div>
      ) : (
        <div className="blog-list">
          {posts.map((post) => {
            const title = isAr ? post.titleAr : post.titleEn;
            const intro = isAr ? post.introAr : post.introEn;
            const category = isAr ? post.categoryAr : post.categoryEn;

            return (
              <article className="blog-card" key={post.slug}>
                <span className="eyebrow blog-card-cat">{category}</span>
                <h2>{title}</h2>
                <p>{intro}</p>
                <Link className="text-link blog-card-link" href={`/${locale}/blog/${post.slug}`}>
                  <span>{t.readArticle || (isAr ? "اقرأ المقال" : "Read article")}</span>
                  <ArrowRight size={16} className={isAr ? "rotate-180" : ""} />
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
