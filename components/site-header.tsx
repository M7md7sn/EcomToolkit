import Link from "next/link";
import { Menu, Search, ShoppingBag } from "lucide-react";
import { copy } from "@/lib/content";
import { oppositeLocale, type Locale } from "@/lib/i18n";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const nextLocale = oppositeLocale(locale);

  return (
    <header className="site-header">
      <Link className="brand-mark" href={`/${locale}`} aria-label={text.brand}>
        <span className="brand-icon">
          <ShoppingBag size={20} style={{ color: "var(--brand)" }} />
        </span>
        <span className="brand-text" style={{ fontWeight: 700, display: "flex", gap: "2px" }}>
          {locale === "ar" ? (
            <>
              <span>تاجر</span>
              <span style={{ color: "var(--brand)" }}>كيت</span>
            </>
          ) : (
            <>
              <span>Tajer</span>
              <span style={{ color: "var(--brand)" }}>Kit</span>
            </>
          )}
        </span>
      </Link>

      <nav className="primary-nav" aria-label="Primary navigation">
        <Link href={`/${locale}/tools`}>{text.navTools}</Link>
        <Link href={`/${locale}/blog`}>{text.navBlog}</Link>
        <Link href={`/${locale}/contact`}>{text.navContact}</Link>
      </nav>

      <div className="header-actions">
        <Link
          className="header-search"
          href={`/${locale}/tools`}
          aria-label={text.navTools}
        >
          <Search size={16} />
        </Link>
        <ThemeToggle />
        <Link className="locale-pill" href={`/${nextLocale}`}>
          {text.language}
        </Link>
        <button className="icon-button mobile-menu" type="button" aria-label="Menu">
          <Menu size={18} />
        </button>
      </div>
    </header>
  );
}
