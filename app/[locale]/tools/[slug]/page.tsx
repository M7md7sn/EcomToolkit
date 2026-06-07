import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ad-slot";
import { ToolCard } from "@/components/tool-card";
import { ToolRunner } from "@/components/tool-runner";
import { copy, getTool, tools, categories } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n";
import Link from "next/link";

export function generateStaticParams() {
  return tools.flatMap((tool) => [
    { locale: "en", slug: tool.slug },
    { locale: "ar", slug: tool.slug }
  ]);
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const current = isLocale(locale) ? locale : "en";
  const tool = getTool(slug);

  if (!tool) {
    return {};
  }

  return {
    title: `${tool.title[current]} | ${current === "ar" ? "تاجر كيت" : "TajerKit"}`,
    description: tool.summary[current],
    alternates: {
      canonical: `/${current}/tools/${tool.slug}`,
      languages: {
        en: `/en/tools/${tool.slug}`,
        ar: `/ar/tools/${tool.slug}`
      }
    }
  };
}

export default async function ToolPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const tool = getTool(slug);
  if (!tool) notFound();

  const t = copy[locale];
  const related = tools
    .filter((candidate) => candidate.category === tool.category && candidate.slug !== tool.slug)
    .slice(0, 3);
  const isAr = locale === "ar";

  return (
    <main className="page-main">
      <div className="tool-layout-container">
        {/* Sticky Left Sidebar for Quick Switch */}
        <aside className="tool-sidebar" aria-label="Tools navigation">
          <div className="sidebar-scroll">
            <h3 className="sidebar-group-title">
              {isAr ? "جميع الأدوات" : "All Tools"}
            </h3>
            {categories.map((category) => {
              const categoryTools = tools.filter((tItem) => tItem.category === category.slug);
              const CatIcon = category.icon;
              return (
                <div key={category.slug} className="sidebar-group">
                  <div className="sidebar-cat-header">
                    <CatIcon size={14} />
                    <span>{category.title[locale]}</span>
                  </div>
                  <ul className="sidebar-tools-list">
                    {categoryTools.map((tItem) => {
                      const ToolIcon = tItem.icon;
                      const isActive = tItem.slug === tool.slug;
                      return (
                        <li key={tItem.slug}>
                          <Link
                            href={`/${locale}/tools/${tItem.slug}`}
                            className={`sidebar-tool-link ${isActive ? "active" : ""}`}
                          >
                            <ToolIcon size={13} className="sidebar-tool-icon" />
                            <span>{tItem.title[locale]}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main Tool Content Area */}
        <div className="tool-main-content">
          <section className="tool-hero">
            <span className="eyebrow">
              {tool.priority} · {tool.demand} demand · {tool.score} score
            </span>
            <h1>{tool.title[locale]}</h1>
            <p>{tool.summary[locale]}</p>
          </section>

          <ToolRunner
            tool={{
              type: tool.type,
              priority: tool.priority,
              title: tool.title,
              resultLabel: tool.resultLabel
            }}
            locale={locale}
          />

          <AdSlot locale={locale} />

          <section className="content-grid">
            <article className="explain-panel">
              <span className="eyebrow">{t.formula}</span>
              <h2>{locale === "ar" ? "كيف تستخدم النتيجة؟" : "How to use the result"}</h2>
              <p>
                {locale === "ar"
                  ? "استخدم الأداة كنقطة قرار سريعة قبل إطلاق منتج أو حملة. راجع تكلفة المنتج والشحن والإعلانات والرسوم، ثم قارن النتيجة بهامش الربح الذي تحتاجه للنمو."
                  : "Use this tool as a quick decision layer before launching a product or campaign. Check product cost, shipping, ads, and fees, then compare the result against the margin you need to grow."}
              </p>
              <p>
                {locale === "ar"
                  ? "النتائج تقديرية وليست نصيحة مالية أو ضريبية. حدّث القيم حسب بلدك وبوابة الدفع وشركة الشحن."
                  : "Results are estimates, not financial or tax advice. Adjust values for your country, payment gateway, and shipping provider."}
              </p>
            </article>

            <aside className="cta-panel">
              <span className="eyebrow">{locale === "ar" ? "خدمة احترافية" : "Done-for-you"}</span>
              <h2>{t.leadCta}</h2>
              <p>{t.leadText}</p>
              <a className="primary-button" href={`/${locale}/contact`}>
                {t.leadButton}
              </a>
            </aside>
          </section>

          {related.length > 0 && (
            <section className="section-block">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">{t.related}</span>
                  <h2>{locale === "ar" ? "أدوات تكمل نفس القرار" : "Tools for the same decision"}</h2>
                </div>
              </div>
              <div className="tools-grid">
                {related.map((item) => (
                  <ToolCard key={item.slug} tool={item} locale={locale} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
