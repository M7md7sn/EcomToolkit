import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Search,
  Sparkles
} from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import { QuickProfitCalculator } from "@/components/quick-profit-calculator";
import { ToolsExplorer } from "@/components/tools-explorer";
import { copy, tools } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

const socialProof = {
  en: [
    { value: "12,000+", label: "calculations completed across the tools" },
    { value: "Shopify · Salla · WooCommerce", label: "built for the platforms sellers already use" },
    { value: "15", label: "MVP tools for profit, ROAS, pricing, shipping, and fees" }
  ],
  ar: [
    { value: "+12,000", label: "عملية حساب تمت عبر الأدوات" },
    { value: "Shopify · Salla · WooCommerce", label: "مناسبة للمنصات التي يستخدمها أصحاب المتاجر" },
    { value: "15", label: "أداة MVP للربحية وROAS والتسعير والشحن والعمولات" }
  ]
};

const guideArticles = {
  en: [
    {
      title: "How to calculate true ecommerce profit",
      category: "Profitability",
      href: "/blog/ecommerce-profit-calculation"
    },
    {
      title: "Best profit margin for clothing stores",
      category: "Pricing",
      href: "/blog/clothing-profit-margin"
    },
    {
      title: "ROAS explained for beginners",
      category: "Marketing",
      href: "/blog/roas-for-beginners"
    },
    {
      title: "How to price products professionally",
      category: "Pricing",
      href: "/blog/product-pricing-strategy"
    },
    {
      title: "Shipping costs in Egypt and Saudi Arabia",
      category: "Shipping",
      href: "/blog/shipping-cost-egypt-saudi"
    }
  ],
  ar: [
    {
      title: "كيفية حساب ربح متجر إلكتروني",
      category: "الربحية",
      href: "/blog/ecommerce-profit-calculation"
    },
    {
      title: "أفضل هامش ربح للملابس",
      category: "التسعير",
      href: "/blog/clothing-profit-margin"
    },
    {
      title: "شرح ROAS للمبتدئين",
      category: "التسويق",
      href: "/blog/roas-for-beginners"
    },
    {
      title: "كيفية تسعير المنتجات باحتراف",
      category: "التسعير",
      href: "/blog/product-pricing-strategy"
    },
    {
      title: "تكلفة الشحن في مصر والسعودية",
      category: "الشحن",
      href: "/blog/shipping-cost-egypt-saudi"
    }
  ]
};

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const current = isLocale(locale) ? locale : "en";
  const title =
    current === "ar"
      ? "تاجر كيت | حاسبات وأدوات مجانية لأصحاب المتاجر"
      : "TajerKit | Free Ecommerce Calculators for Store Owners";

  return {
    title,
    description:
      current === "ar"
        ? "حاسبات وأدوات مجانية لأصحاب المتاجر الإلكترونية العرب لحساب الربحية وROAS والتسعير والشحن والعمولات خلال ثوانٍ."
        : "Free ecommerce calculators for profit, ROAS, pricing, shipping, commissions, and store growth.",
    alternates: {
      canonical: `/${current}`,
      languages: {
        en: "/en",
        ar: "/ar"
      }
    }
  };
}

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const t = copy[locale];
  const isAr = locale === "ar";

  return (
    <main>
      <section className="hero-section home-hero">
        <div className="hero-copy">
          <span className="eyebrow">
            {isAr ? "مجموعة أدوات تشغيل التجارة الإلكترونية" : "INTUITIVE COMMERCE OPERATING SUITE"}
          </span>
          <h1>
            {isAr
              ? "اجعل كل طلب يثبت ربحيته قبل شحنه."
              : "Make every order prove its profit."}
          </h1>
          <p>
            {isAr
              ? "احسب الهوامش الحقيقية، حسّن استراتيجيات التسعير، وولّد نصوصاً تسويقية تحاكي الكتابة البشرية من منصة واحدة عالية الأداء."
              : "Calculate true margins, optimize pricing strategies, and generate humanized copy from one high-performance toolkit."}
          </p>

          <div className="hero-actions">
            <Link
              className="primary-button hero-primary"
              href={`/${locale}/tools/ecommerce-profit-margin-calculator`}
            >
              {isAr ? "ابدأ مجاناً الآن" : "Get Started Free"}
              <ArrowRight size={17} />
            </Link>
            <Link className="secondary-button" href={`/${locale}/tools`}>
              {isAr ? "استكشف +15 أداة" : "Explore 15+ Tools"}
            </Link>
          </div>

          <Link className="search-bar" href={`/${locale}/tools`}>
            <Search size={18} />
            <span>{t.searchPlaceholder}</span>
          </Link>

          <div className="hero-points">
            {[
              isAr ? "مخصص للمتاجر العربية" : "Built for Arabic and global stores",
              isAr ? "يربط الأدوات بالمقالات" : "Tools connected to SEO guides",
              isAr ? "تجربة مناسبة لـ AdSense" : "AdSense-friendly content flow"
            ].map((point) => (
              <span key={point}>
                <CheckCircle2 size={16} />
                {point}
              </span>
            ))}
          </div>
        </div>

        <QuickProfitCalculator locale={locale} />
      </section>

      <section className="social-proof-grid" aria-label="Platform usage statistics">
        {socialProof[locale].map((item) => (
          <article className="stat-card" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <AdSlot locale={locale} compact />

      {/* Interactive Tools Explorer */}
      <section className="section-block" id="tools-explorer-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{isAr ? "مكتبة الأدوات التفاعلية" : "Interactive Tools Hub"}</span>
            <h2>{isAr ? "استكشف وشغّل الأدوات فوراً" : "Explore & run any tool instantly"}</h2>
          </div>
          <p>
            {isAr
              ? "ابحث بالاسم، اختر التصنيف، أو اعثر على المولدات بالذكاء الاصطناعي مباشرة دون تعقيد."
              : "Search by keyword, filter by category, or discover AI generators instantly in one place."}
          </p>
        </div>
        <ToolsExplorer locale={locale} />
      </section>

      <section className="section-block guide-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{isAr ? "مركز مقالات النمو" : "SEO content hub"}</span>
            <h2>{isAr ? "دليل التجارة الإلكترونية" : "Ecommerce growth guide"}</h2>
          </div>
          <Link className="text-link" href={`/${locale}/blog`}>
            {isAr ? "كل المقالات" : "All articles"}
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="guide-grid">
          {guideArticles[locale].map((article, index) => (
            <Link
              href={`/${locale}${article.href}`}
              className={index === 0 ? "guide-card guide-card-large" : "guide-card"}
              key={article.title}
            >
              <span className="guide-category">
                <BookOpen size={15} />
                {article.category}
              </span>
              <h3>{article.title}</h3>
              <span className="guide-link">
                {isAr ? "اقرأ الدليل" : "Read guide"}
                <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>



      <section className="case-study-band">
        <div className="store-mockup" aria-hidden="true">
          <div className="mockup-top">
            <span />
            <span />
            <span />
          </div>
          <div className="mockup-hero">
            <div />
            <div />
          </div>
          <div className="mockup-kpis">
            <span>+34% CVR</span>
            <span>ROAS 4.2x</span>
          </div>
        </div>

        <div className="case-study-copy">
          <span className="eyebrow">{isAr ? "خدمات بناء المتاجر" : "Ecommerce development"}</span>
          <h2>{isAr ? "هل تريد متجرًا إلكترونيًا جاهزًا للنمو؟" : "Want an ecommerce store ready to grow?"}</h2>
          <p>
            {isAr
              ? "نصمم متاجر Shopify و WooCommerce و Salla مهيأة للربحية والتحويلات، مع صفحات منتجات واضحة ومسارات شراء أسرع."
              : "We design Shopify, WooCommerce, and Salla stores optimized for profitability, conversions, clear product pages, and faster buying flows."}
          </p>
          <ul className="benefit-list">
            <li>
              <CheckCircle2 size={16} />
              {isAr ? "هيكل SEO قابل للتوسع" : "Scalable SEO structure"}
            </li>
            <li>
              <CheckCircle2 size={16} />
              {isAr ? "تحسين صفحات المنتجات والتحويلات" : "Product page and conversion optimization"}
            </li>
            <li>
              <CheckCircle2 size={16} />
              {isAr ? "إعداد القياس والأدوات الأساسية" : "Analytics and essential tooling setup"}
            </li>
          </ul>
          <Link className="primary-button" href={`/${locale}/contact`}>
            {isAr ? "اطلب عرض سعر" : "Request a quote"}
            <ExternalLink size={16} />
          </Link>
        </div>
      </section>

      <section className="newsletter-band">
        <div>
          <span className="eyebrow">
            {isAr ? "نشرة عملية لأصحاب المتاجر" : "A practical seller newsletter"}
          </span>
          <h2>{t.newsletter}</h2>
          <p>
            {isAr
              ? "احصل على أدوات جديدة ودروس التجارة الإلكترونية ونماذج التسعير مباشرة إلى بريدك."
              : "Get new tools, ecommerce lessons, and pricing templates delivered directly to your inbox."}
          </p>
        </div>
        <form className="newsletter-form">
          <input type="email" placeholder={t.emailPlaceholder} aria-label="Email" />
          <button type="submit">
            <Sparkles size={16} />
            {t.subscribe}
          </button>
        </form>
      </section>
    </main>
  );
}
