import { notFound } from "next/navigation";
import { ToolCard } from "@/components/tool-card";
import { categories, copy, tools } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const current = isLocale(locale) ? locale : "en";
  return {
    title:
      current === "ar"
        ? "كل أدوات التجارة الإلكترونية | تاجر تولز"
        : "All Ecommerce Tools | TajerTools",
    description:
      current === "ar"
        ? "حاسبات وأدوات مجانية للتسعير والربح والشحن والسياسات ومحتوى المنتجات."
        : "Free calculators and generators for ecommerce pricing, profit, shipping, policies, and product content."
  };
}

export default async function ToolsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const t = copy[locale];

  return (
    <main className="page-main">
      <section className="page-hero">
        <span className="eyebrow">{t.allTools}</span>
        <h1>{locale === "ar" ? "مكتبة أدوات التجارة الإلكترونية" : "Ecommerce tool library"}</h1>
        <p>
          {locale === "ar"
            ? "ابدأ بأدوات MVP ثم توسع إلى التسويق والسياسات والشحن والماليات."
            : "Start with the MVP calculators, then expand into marketing, policies, logistics, and finance."}
        </p>
      </section>

      {categories.map((category) => {
        const categoryTools = tools.filter((tool) => tool.category === category.slug);
        return (
          <section className="section-block" id={category.slug} key={category.slug}>
            <div className="section-heading">
              <div>
                <span className="eyebrow">{categoryTools.length} tools</span>
                <h2>{category.title[locale]}</h2>
              </div>
              <p>{category.summary[locale]}</p>
            </div>
            <div className="tools-grid">
              {categoryTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} locale={locale} />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
