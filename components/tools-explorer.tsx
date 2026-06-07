"use client";

import { useState, useMemo } from "react";
import { Search, Sparkles, Filter, X } from "lucide-react";
import { tools, categories, copy } from "@/lib/content";
import { ToolCard } from "./tool-card";
import type { Locale } from "@/lib/i18n";

export function ToolsExplorer({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const isAr = locale === "ar";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [toolTypeFilter, setToolTypeFilter] = useState<"all" | "calc" | "ai">("all");

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      // 1. Search Query filter
      const titleText = tool.title[locale].toLowerCase();
      const summaryText = tool.summary[locale].toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = titleText.includes(query) || summaryText.includes(query);

      // 2. Category filter
      const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;

      // 3. Tool Type filter (AI generator vs Calculator)
      const isAiTool = ["description", "meta", "returnPolicy", "shippingPolicy"].includes(tool.type);
      const matchesType = 
        toolTypeFilter === "all" ||
        (toolTypeFilter === "ai" && isAiTool) ||
        (toolTypeFilter === "calc" && !isAiTool);

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [locale, searchQuery, selectedCategory, toolTypeFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setToolTypeFilter("all");
  };

  return (
    <div className="tools-explorer">
      {/* Search and Filters Header */}
      <div className="explorer-controls">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon-inside" />
          <input
            type="text"
            className="explorer-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? "ابحث عن الأدوات... مثلاً: ربح، ROAS، شحن" : "Search tools... e.g. profit, ROAS, shipping"}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Tool Type Toggle (Calculator vs AI Generator) */}
        <div className="type-filters">
          <button
            className={`type-filter-btn ${toolTypeFilter === "all" ? "active" : ""}`}
            onClick={() => setToolTypeFilter("all")}
          >
            {isAr ? "جميع الأدوات" : "All Tools"}
          </button>
          <button
            className={`type-filter-btn ${toolTypeFilter === "calc" ? "active" : ""}`}
            onClick={() => setToolTypeFilter("calc")}
          >
            {isAr ? "حاسبات مالية" : "Calculators"}
          </button>
          <button
            className={`type-filter-btn ${toolTypeFilter === "ai" ? "active" : ""}`}
            onClick={() => setToolTypeFilter("ai")}
          >
            <Sparkles size={13} style={{ marginRight: isAr ? 0 : 5, marginLeft: isAr ? 5 : 0 }} />
            {isAr ? "منشئات بالذكاء الاصطناعي" : "AI Generators"}
          </button>
        </div>
      </div>

      {/* Category Pills List */}
      <div className="category-pills-scroll">
        <button
          className={`category-pill ${selectedCategory === "all" ? "active" : ""}`}
          onClick={() => setSelectedCategory("all")}
        >
          {isAr ? "الكل" : "All Categories"}
        </button>
        {categories.map((cat) => {
          const CatIcon = cat.icon;
          return (
            <button
              key={cat.slug}
              className={`category-pill ${selectedCategory === cat.slug ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.slug)}
            >
              <CatIcon size={14} className="cat-pill-icon" />
              <span>{cat.title[locale]}</span>
            </button>
          );
        })}
      </div>

      {/* Search results metrics */}
      <div className="explorer-stats">
        <span>
          {isAr
            ? `تم العثور على ${filteredTools.length} أداة`
            : `Found ${filteredTools.length} ${filteredTools.length === 1 ? "tool" : "tools"}`}
        </span>
        {(searchQuery || selectedCategory !== "all" || toolTypeFilter !== "all") && (
          <button className="reset-filters-link" onClick={clearFilters}>
            {isAr ? "إعادة تعيين الفلاتر" : "Reset filters"}
          </button>
        )}
      </div>

      {/* Tools Grid Output */}
      {filteredTools.length > 0 ? (
        <div className="tools-grid fade-in">
          {filteredTools.map((tool, index) => (
            <ToolCard key={tool.slug} tool={tool} locale={locale} featured={false} rank={index} />
          ))}
        </div>
      ) : (
        <div className="explorer-empty-state">
          <Filter size={48} className="empty-icon" />
          <h3>{isAr ? "لم نجد أي أدوات مطابقة" : "No tools match your query"}</h3>
          <p>
            {isAr
              ? "حاول استخدام كلمات مفتاحية أخرى أو إعادة تعيين عوامل التصفية."
              : "Try adjusting your search keywords or resetting the filters."}
          </p>
          <button className="primary-button" onClick={clearFilters}>
            {isAr ? "عرض جميع الأدوات" : "Show all tools"}
          </button>
        </div>
      )}
    </div>
  );
}
