import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, BookOpen, CheckCircle2, ExternalLink, Search, Sparkles } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import { QuickProfitCalculator } from "@/components/quick-profit-calculator";
import { ToolsExplorer } from "@/components/tools-explorer";
import { copy } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

const socialProof = {
  en: [
    { value: "12,000+", label: "calculations completed across the tools" },
    {
      value: "Shopify · Salla · WooCommerce",
      label: "built for the platforms sellers already use",
    },
    { value: "15", label: "MVP tools for profit, ROAS, pricing, shipping, and fees" },
  ],
  ar: [
    { value: "+12,000", label: "عملية حساب تمت عبر الأدوات" },
    { value: "Shopify · Salla · WooCommerce", label: "مناسبة للمنصات التي يستخدمها أصحاب المتاجر" },
    { value: "15", label: "أداة MVP للربحية وROAS والتسعير والشحن والعمولات" },
  ],
};

const guideArticles: Record<
  string,
  { title: string; category: string; href: string; description?: string }[]
> = {
  en: [
    {
      title: "How to calculate true ecommerce profit",
      category: "Profitability",
      href: "/blog/ecommerce-profit-calculation",
      description:
        "Learn how to accurately factor in product costs, marketing spend, platform fees, and shipping costs to discover your true net profit.",
    },
    {
      title: "Best profit margin for clothing stores",
      category: "Pricing",
      href: "/blog/clothing-profit-margin",
    },
    {
      title: "ROAS explained for beginners",
      category: "Marketing",
      href: "/blog/roas-for-beginners",
    },
    {
      title: "How to price products professionally",
      category: "Pricing",
      href: "/blog/product-pricing-strategy",
    },
    {
      title: "Shipping costs in Egypt and Saudi Arabia",
      category: "Shipping",
      href: "/blog/shipping-cost-egypt-saudi",
    },
  ],
  ar: [
    {
      title: "كيفية حساب ربح متجر إلكتروني",
      category: "الربحية",
      href: "/blog/ecommerce-profit-calculation",
      description:
        "تعرف على كيفية احتساب تكاليف المنتجات، مصاريف التسويق، رسوم المنصات، وتكاليف الشحن بدقة لتصل إلى صافي ربحك الحقيقي.",
    },
    {
      title: "أفضل هامش ربح للملابس",
      category: "التسعير",
      href: "/blog/clothing-profit-margin",
    },
    {
      title: "شرح ROAS للمبتدئين",
      category: "التسويق",
      href: "/blog/roas-for-beginners",
    },
    {
      title: "كيفية تسعير المنتجات باحتراف",
      category: "التسعير",
      href: "/blog/product-pricing-strategy",
    },
    {
      title: "تكلفة الشحن في مصر والسعودية",
      category: "الشحن",
      href: "/blog/shipping-cost-egypt-saudi",
    },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const current = isLocale(locale) ? locale : "en";
  const title =
    current === "ar"
      ? "تاجر تولز | حاسبات وأدوات مجانية لأصحاب المتاجر"
      : "TajerTools | Free Ecommerce Calculators for Store Owners";

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
        ar: "/ar",
      },
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
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
            {isAr ? "اجعل كل طلب يثبت ربحيته قبل شحنه." : "Make every order prove its profit."}
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
              isAr ? "تجربة مناسبة لـ AdSense" : "AdSense-friendly content flow",
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
            <span className="eyebrow">
              {isAr ? "مكتبة الأدوات التفاعلية" : "Interactive Tools Hub"}
            </span>
            <h2>{isAr ? "استكشف وشغّل الأدوات فوراً" : "Explore & run any tool instantly"}</h2>
          </div>
          <p>
            {isAr
              ? "ابحث بالاسم، اختر التصنيف، أو اعثر على المولدات بالذكاء الاصطناعي مباشرة دون تعقيد."
              : "Search by keyword, filter by category, or discover AI generators instantly in one place."}
          </p>
        </div>
        <Suspense fallback={<div>{isAr ? "جاري التحميل..." : "Loading tools..."}</div>}>
          <ToolsExplorer locale={locale} />
        </Suspense>
      </section>

      <section className="section-block guide-section">
        <div className="section-heading">
          <div>
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
              {index === 0 && article.description && (
                <p className="guide-card-desc">{article.description}</p>
              )}
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
            <div className="mockup-card dashboard-card">
              <div className="card-header">
                <span className="card-title">{isAr ? "معدل التحويل" : "Conversion Rate"}</span>
                <span className="trend-badge">↑ 34%</span>
              </div>
              <div className="card-value">3.82%</div>
              <div className="card-graph">
                <svg viewBox="0 0 160 50" preserveAspectRatio="none" className="graph-svg">
                  <defs>
                    <linearGradient id="card-chart-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 45 C 20 40, 40 15, 60 25 C 80 35, 100 10, 120 18 C 140 25, 150 5, 160 2"
                    fill="none"
                    stroke="var(--brand)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 0 45 C 20 40, 40 15, 60 25 C 80 35, 100 10, 120 18 C 140 25, 150 5, 160 2 L 160 50 L 0 50 Z"
                    fill="url(#card-chart-grad)"
                  />
                  <circle cx="160" cy="2" r="3" fill="var(--brand)" />
                </svg>
              </div>
            </div>
            <div className="mockup-card product-card">
              <div className="mini-product-img">
                <svg
                  viewBox="0 0 100 64"
                  preserveAspectRatio="none"
                  className="product-placeholder-svg"
                >
                  <rect width="100" height="64" fill="var(--surface-strong)" />
                  <circle cx="50" cy="32" r="16" fill="var(--line)" />
                  <path
                    d="M 15 48 L 35 30 L 55 38 L 75 22 L 95 30 L 95 48 Z"
                    fill="var(--surface)"
                    opacity="0.4"
                  />
                </svg>
                <span className="product-tag">{isAr ? "سلة" : "Shopify"}</span>
              </div>
              <div className="mini-product-info">
                <div className="product-title">
                  {isAr ? "كوب سيراميك يدوي" : "Handcrafted Ceramic Mug"}
                </div>
                <div className="product-action-row">
                  <span className="product-price">{isAr ? "٨٩ ر.س" : "$24"}</span>
                  <button className="buy-btn" type="button">
                    {isAr ? "شراء سريع" : "Buy Now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mockup-kpis">
            <span>+34% CVR</span>
            <span>ROAS 4.2x</span>
          </div>
        </div>

        <div className="case-study-copy">
          <span className="eyebrow">{isAr ? "خدمات بناء المتاجر" : "Ecommerce development"}</span>
          <h2>
            {isAr
              ? "هل تريد متجرًا إلكترونيًا جاهزًا للنمو؟"
              : "Want an ecommerce store ready to grow?"}
          </h2>
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
              {isAr
                ? "تحسين صفحات المنتجات والتحويلات"
                : "Product page and conversion optimization"}
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
