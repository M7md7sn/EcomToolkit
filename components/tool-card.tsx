import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories, copy, type Tool } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

const badges = {
  en: ["Most used", "Recommended", "Most visited", "New", "Popular", "Fast result"],
  ar: ["الأكثر استخدامًا", "موصى به", "الأكثر زيارة", "جديد", "شائع", "نتيجة سريعة"]
};

const usage = ["8.4k", "7.9k", "7.1k", "6.8k", "6.2k", "5.9k", "5.4k"];

export function ToolCard({
  tool,
  locale,
  featured = false,
  rank = 0
}: {
  tool: Tool;
  locale: Locale;
  featured?: boolean;
  rank?: number;
}) {
  const Icon = tool.icon;
  const text = copy[locale];
  const category = categories.find((item) => item.slug === tool.category);
  const badge = badges[locale][rank % badges[locale].length];
  const monthlyUsage = usage[rank % usage.length];

  return (
    <Link
      href={`/${locale}/tools/${tool.slug}`}
      className={featured ? "tool-card tool-card-featured" : "tool-card"}
    >
      <span className="tool-card-top">
        <span className="tool-icon">
          <Icon size={20} />
        </span>
        <span className="usage-chip">{badge}</span>
      </span>

      <span className="category-label">
        {category?.title[locale] || (locale === "ar" ? "أداة" : "Tool")}
      </span>

      <strong>{tool.title[locale]}</strong>
      <span>{tool.summary[locale]}</span>

      <span className="tool-card-footer">
        <span>
          {monthlyUsage}
          {locale === "ar" ? " استخدام شهري" : " monthly uses"}
        </span>
        <span className="tool-link">
          {text.useTool}
          <ArrowUpRight size={15} />
        </span>
      </span>
    </Link>
  );
}
