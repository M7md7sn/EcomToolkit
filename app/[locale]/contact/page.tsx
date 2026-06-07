import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { ContactForm } from "@/components/contact-form";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  return (
    <main className="page-main">
      <section className="page-hero">
        <span className="eyebrow">{locale === "ar" ? "تواصل" : "Contact"}</span>
        <h1>{locale === "ar" ? "اطلب تدقيق متجر مجاني" : "Request a free ecommerce audit"}</h1>
        <p>
          {locale === "ar"
            ? "املأ هذا النموذج وسنقوم بمراجعة متجرك وتحليل الأرباح والسرعة وتجربة المستخدم وتقديم توصيات مخصصة للنمو."
            : "Fill in the details below and we will audit your store's speed, conversion rate, profitability, and design. Get tailored recommendations in 48 hours."}
        </p>
      </section>

      <ContactForm locale={locale} />
    </main>
  );
}
