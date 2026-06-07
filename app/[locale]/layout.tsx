import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { dir, isLocale, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <div lang={locale} dir={dir(locale as Locale)} className="app-shell">
      <SiteHeader locale={locale as Locale} />
      {children}
    </div>
  );
}
