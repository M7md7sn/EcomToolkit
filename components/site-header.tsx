"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { copy } from "@/lib/content";
import { oppositeLocale, type Locale } from "@/lib/i18n";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const nextLocale = oppositeLocale(locale);
  const router = useRouter();
  const [searchVal, setSearchVal] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/${locale}/tools?q=${encodeURIComponent(searchVal.trim())}`);
    } else {
      router.push(`/${locale}/tools`);
    }
  };

  return (
    <header className="site-header">
      <Link className="brand-mark" href={`/${locale}`} aria-label={text.brand}>
        <span className="brand-icon">
          <span className="brand-logo-mask" />
        </span>
        <span className="brand-text" style={{ fontWeight: 700, display: "flex", gap: "2px" }}>
          {locale === "ar" ? (
            <>
              <span>تاجر</span>
              <span style={{ color: "var(--brand)" }}>تولز</span>
            </>
          ) : (
            <>
              <span>Tajer</span>
              <span style={{ color: "var(--brand)" }}>Tools</span>
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
        <form onSubmit={handleSearchSubmit} className="header-search-form">
          <div className="header-search-wrapper">
            <Search size={14} className="header-search-icon" />
            <input
              type="text"
              className="header-search-input"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder={locale === "ar" ? "ابحث..." : "Search..."}
            />
            <button type="submit" className="header-search-btn-mobile" aria-label="Search">
              <Search size={16} />
            </button>
          </div>
        </form>
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
