import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ToolsExplorer } from "@/components/tools-explorer";
import { copy } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
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
        : "Free calculators and generators for ecommerce pricing, profit, shipping, policies, and product content.",
  };
}

export default async function ToolsPage({ params }: { params: Promise<{ locale: string }> }) {
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
            ? "ابحث عن أدوات التسعير، الربح، الشحن، والسياسات، أو شغّلها فوراً."
            : "Search and run any calculator or AI content generator instantly."}
        </p>
      </section>

      <section className="section-block">
        <Suspense fallback={<div>{locale === "ar" ? "جاري التحميل..." : "Loading tools..."}</div>}>
          <ToolsExplorer locale={locale} />
        </Suspense>
      </section>
    </main>
  );
}
