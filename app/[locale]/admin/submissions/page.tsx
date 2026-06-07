"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { copy, tools as allToolsList } from "@/lib/content";
import {
  getSubmissions,
  loginAdmin,
  logoutAdmin,
  deleteSubmission,
  isAuthenticated,
  type Submission,
} from "@/lib/actions/contact";
import { getPosts, savePost, deletePost, type Post } from "@/lib/actions/blog";
import {
  Lock,
  Search,
  Download,
  Trash2,
  Eye,
  LogOut,
  Sparkles,
  Loader2,
  Calendar,
  Layers,
  DollarSign,
  Globe,
  Mail,
  Phone,
  User,
  X,
  FileText,
  Plus,
  Edit,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function AdminSubmissionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = use(params);
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const t = copy[locale];
  const isAr = locale === "ar";

  // Auth & Navigation States
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<"submissions" | "articles">("submissions");

  // Submissions Data & Filter States
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionSearch, setSubmissionSearch] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedSales, setSelectedSales] = useState("");

  // Articles Data & Filter States
  const [articles, setArticles] = useState<Post[]>([]);
  const [articleSearch, setArticleSearch] = useState("");

  // Modals & Forms
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [subToDelete, setSubToDelete] = useState<string | null>(null);

  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorError, setEditorError] = useState("");
  const [editorSuccess, setEditorSuccess] = useState("");

  // Editor Form Fields
  const [formSlug, setFormSlug] = useState("");
  const [formTitleEn, setFormTitleEn] = useState("");
  const [formTitleAr, setFormTitleAr] = useState("");
  const [formIntroEn, setFormIntroEn] = useState("");
  const [formIntroAr, setFormIntroAr] = useState("");
  const [formCategoryEn, setFormCategoryEn] = useState("");
  const [formCategoryAr, setFormCategoryAr] = useState("");
  const [formContentEn, setFormContentEn] = useState("");
  const [formContentAr, setFormContentAr] = useState("");
  const [formTools, setFormTools] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // Check auth and load data on mount
  useEffect(() => {
    checkAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkAuthentication() {
    const verified = await isAuthenticated();
    setAuthed(verified);
    if (verified) {
      loadAllData();
    }
  }

  async function loadAllData() {
    loadSubmissions();
    loadArticles();
  }

  async function loadSubmissions() {
    const res = await getSubmissions();
    if (res.success && res.data) {
      setSubmissions(res.data);
    } else if (res.error === "Unauthorized access.") {
      setAuthed(false);
    }
  }

  async function loadArticles() {
    const res = await getPosts();
    if (res.success && res.data) {
      setArticles(res.data);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    const res = await loginAdmin(passcode);
    if (res.success) {
      setAuthed(true);
      loadAllData();
    } else {
      setAuthError(t.loginError);
    }
  }

  async function handleLogout() {
    await logoutAdmin();
    setAuthed(false);
    setSubmissions([]);
    setArticles([]);
  }

  // Submission CRUD Actions
  async function handleDeleteSubmission(id: string) {
    const res = await deleteSubmission(id);
    if (res.success) {
      setSubmissions((prev) => prev.filter((sub) => sub.id !== id));
      setSubToDelete(null);
      if (selectedSub?.id === id) {
        setSelectedSub(null);
      }
    }
  }

  // Article CRUD Actions
  async function handleDeleteArticle(slug: string) {
    const res = await deletePost(slug);
    if (res.success) {
      setArticles((prev) => prev.filter((art) => art.slug !== slug));
      setArticleToDelete(null);
    }
  }

  // Open Editor for Creating
  function openAddArticle() {
    setEditorError("");
    setEditorSuccess("");
    setFormSlug("");
    setFormTitleEn("");
    setFormTitleAr("");
    setFormIntroEn("");
    setFormIntroAr("");
    setFormCategoryEn("");
    setFormCategoryAr("");
    setFormContentEn("");
    setFormContentAr("");
    setFormTools([]);
    setIsEditing(false);
    setIsEditorOpen(true);
  }

  // Open Editor for Editing
  function openEditArticle(post: Post) {
    setEditorError("");
    setEditorSuccess("");
    setFormSlug(post.slug);
    setFormTitleEn(post.titleEn);
    setFormTitleAr(post.titleAr);
    setFormIntroEn(post.introEn);
    setFormIntroAr(post.introAr);
    setFormCategoryEn(post.categoryEn);
    setFormCategoryAr(post.categoryAr);
    setFormContentEn(post.contentEn);
    setFormContentAr(post.contentAr);
    setFormTools(post.tools || []);
    setIsEditing(true);
    setIsEditorOpen(true);
  }

  // Handle Tool Checkbox Toggle
  function handleToolToggle(toolSlug: string) {
    setFormTools((prev) =>
      prev.includes(toolSlug) ? prev.filter((s) => s !== toolSlug) : [...prev, toolSlug],
    );
  }

  // Save Article Submit
  async function handleSaveArticle(e: React.FormEvent) {
    e.preventDefault();
    setEditorError("");
    setEditorSuccess("");

    if (!formSlug.trim() || !formTitleEn.trim() || !formTitleAr.trim()) {
      setEditorError(
        isAr
          ? "يرجى تعبئة الحقول الأساسية (الرابط، العنوان بالإنجليزية، والعنوان بالعربية)."
          : "Please fill in essential fields (Slug, Title English, Title Arabic).",
      );
      return;
    }

    const cleanedSlug = formSlug
      .toLowerCase()
      .replace(/[^a-z0-9\-]/g, "-")
      .replace(/-+/g, "-");

    const articleData: Post = {
      slug: cleanedSlug,
      titleEn: formTitleEn.trim(),
      titleAr: formTitleAr.trim(),
      introEn: formIntroEn.trim(),
      introAr: formIntroAr.trim(),
      categoryEn: formCategoryEn.trim() || "General",
      categoryAr: formCategoryAr.trim() || "عام",
      contentEn: formContentEn,
      contentAr: formContentAr,
      tools: formTools,
      createdAt: new Date().toISOString(), // Fallback (overridden by server action for edits)
    };

    const res = await savePost(articleData);
    if (res.success) {
      setEditorSuccess(
        t.postSavedSuccess || (isAr ? "تم حفظ المقال بنجاح!" : "Article saved successfully!"),
      );
      loadArticles();
      setTimeout(() => {
        setIsEditorOpen(false);
      }, 1500);
    } else {
      setEditorError(res.error || (isAr ? "فشل حفظ المقال." : "Failed to save article."));
    }
  }

  // Submissions CSV Export
  function handleExportSubmissionsCSV() {
    if (filteredSubmissions.length === 0) return;

    const headers = [
      "ID",
      "Date",
      "Name",
      "Email",
      "Phone",
      "Platform",
      "Sales Volume",
      "Store URL / Idea",
    ];
    const rows = filteredSubmissions.map((sub) => [
      sub.id,
      new Date(sub.createdAt).toLocaleString(locale === "ar" ? "ar-EG" : "en-US"),
      sub.name,
      sub.email,
      sub.phone || "",
      sub.platform || "N/A",
      sub.salesVolume || "N/A",
      sub.storeUrl || "",
    ]);

    const csvContent =
      "\uFEFF" + // UTF-8 BOM for Arabic excel compatibility
      [
        headers.join(","),
        ...rows.map((r) => r.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")),
      ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ecommerce_audit_submissions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Filter Submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const query = submissionSearch.toLowerCase();
    const matchesQuery =
      sub.name.toLowerCase().includes(query) ||
      sub.email.toLowerCase().includes(query) ||
      (sub.phone && sub.phone.includes(query)) ||
      (sub.storeUrl && sub.storeUrl.toLowerCase().includes(query));

    const matchesPlatform = selectedPlatform ? sub.platform === selectedPlatform : true;
    const matchesSales = selectedSales ? sub.salesVolume === selectedSales : true;

    return matchesQuery && matchesPlatform && matchesSales;
  });

  // Filter Articles
  const filteredArticles = articles.filter((post) => {
    const query = articleSearch.toLowerCase();
    return (
      post.titleEn.toLowerCase().includes(query) ||
      post.titleAr.toLowerCase().includes(query) ||
      post.slug.toLowerCase().includes(query) ||
      post.categoryEn.toLowerCase().includes(query) ||
      post.categoryAr.toLowerCase().includes(query)
    );
  });

  // Loading Screen
  if (authed === null) {
    return (
      <div className="admin-loading-wrapper">
        <Loader2 size={32} className="animate-spin" />
        <span>{t.loading}</span>
      </div>
    );
  }

  // Login Card
  if (!authed) {
    return (
      <main className="page-main admin-login-page">
        <div className="admin-login-card">
          <div className="login-icon-circle">
            <Lock size={24} />
          </div>
          <h1>{t.adminLoginTitle}</h1>
          <p>{t.adminLoginText}</p>

          <form onSubmit={handleLogin} className="login-form">
            {authError && <div className="login-alert-error">{authError}</div>}
            <label className="input-line">
              <span>{t.passcodeLabel}</span>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder={t.passcodePlaceholder}
                required
              />
            </label>
            <button className="primary-button login-btn" type="submit">
              <Sparkles size={16} />
              <span>{t.loginButton}</span>
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="page-main admin-dashboard">
      {/* Top Header */}
      <header className="admin-dash-header">
        <div>
          <span className="eyebrow">Admin Panel</span>
          <h1>{isAr ? "لوحة الإشراف العامة" : "General Admin Portal"}</h1>
          <p>
            {isAr
              ? "تحكم بطلبات تدقيق المتاجر المحتملة وقم بتحرير مقالات مدونة النمو."
              : "Manage incoming audit leads and edit dynamic growth articles."}
          </p>
        </div>
        <button onClick={handleLogout} className="secondary-button logout-btn" title="Logout">
          <LogOut size={16} />
          <span>{isAr ? "تسجيل خروج" : "Logout"}</span>
        </button>
      </header>

      {/* Tabs navigation */}
      <nav className="admin-tabs" aria-label="Admin Navigation Tabs">
        <button
          onClick={() => setActiveTab("submissions")}
          className={`tab-btn ${activeTab === "submissions" ? "tab-btn-active" : ""}`}
        >
          <User size={16} />
          <span>{t.tabSubmissions || (isAr ? "طلبات التدقيق" : "Audit Requests")}</span>
          <span className="tab-count-badge">{submissions.length}</span>
        </button>

        <button
          onClick={() => setActiveTab("articles")}
          className={`tab-btn ${activeTab === "articles" ? "tab-btn-active" : ""}`}
        >
          <FileText size={16} />
          <span>{t.tabArticles || (isAr ? "مقالات المدونة" : "Blog Articles")}</span>
          <span className="tab-count-badge">{articles.length}</span>
        </button>
      </nav>

      {/* TAB 1: Submissions */}
      {activeTab === "submissions" && (
        <section className="fade-in">
          {/* Submissions Toolbar */}
          <div className="dash-toolbar">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                value={submissionSearch}
                onChange={(e) => setSubmissionSearch(e.target.value)}
                placeholder={t.adminSearchPlaceholder}
                className="toolbar-search-input"
              />
            </div>

            <div className="filters-wrapper">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="toolbar-select"
              >
                <option value="">{t.filterPlatform}</option>
                <option value="shopify">{t.platformShopify}</option>
                <option value="salla">{t.platformSalla}</option>
                <option value="woocommerce">{t.platformWoo}</option>
                <option value="custom">{t.platformCustom}</option>
                <option value="none">{t.platformNone}</option>
              </select>

              <select
                value={selectedSales}
                onChange={(e) => setSelectedSales(e.target.value)}
                className="toolbar-select"
              >
                <option value="">{t.filterSales}</option>
                <option value="under1k">{t.salesUnder1k}</option>
                <option value="1k-5k">{t.sales1kTo5k}</option>
                <option value="5k-20k">{t.sales5kTo20k}</option>
                <option value="over20k">{t.salesOver20k}</option>
              </select>

              <button
                onClick={handleExportSubmissionsCSV}
                disabled={filteredSubmissions.length === 0}
                className="secondary-button export-csv-btn"
              >
                <Download size={16} />
                <span>{t.exportCsv}</span>
              </button>
            </div>
          </div>

          {/* Table */}
          {filteredSubmissions.length === 0 ? (
            <div className="empty-submissions-card">
              <Layers size={48} className="empty-icon" />
              <p>{t.noSubmissions}</p>
            </div>
          ) : (
            <div className="table-responsive-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t.date}</th>
                    <th>{t.name}</th>
                    <th>{t.email}</th>
                    <th>{t.phoneHeader}</th>
                    <th>{t.platformHeader}</th>
                    <th>{t.salesHeader}</th>
                    <th className="actions-header">{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((sub) => (
                    <tr key={sub.id} className="table-row-hover">
                      <td className="date-cell">
                        {new Date(sub.createdAt).toLocaleDateString(locale, {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="font-bold">{sub.name}</td>
                      <td>
                        <a href={`mailto:${sub.email}`} className="email-link">
                          {sub.email}
                        </a>
                      </td>
                      <td className="phone-cell">{sub.phone || "—"}</td>
                      <td>
                        {sub.platform ? (
                          <span className={`platform-badge platform-${sub.platform}`}>
                            {sub.platform}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        {sub.salesVolume ? (
                          <span className="sales-volume-pill">{sub.salesVolume}</span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="actions-cell">
                        <button
                          onClick={() => setSelectedSub(sub)}
                          className="icon-button view-action-btn"
                          title={t.details}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => setSubToDelete(sub.id)}
                          className="icon-button delete-action-btn"
                          title={t.delete}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* TAB 2: Blog Articles */}
      {activeTab === "articles" && (
        <section className="fade-in">
          {/* Articles Toolbar */}
          <div className="dash-toolbar">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                value={articleSearch}
                onChange={(e) => setArticleSearch(e.target.value)}
                placeholder={isAr ? "ابحث عن المقالات..." : "Search articles by title..."}
                className="toolbar-search-input"
              />
            </div>

            <button onClick={openAddArticle} className="primary-button create-article-btn">
              <Plus size={16} />
              <span>{t.adminAddArticle || (isAr ? "إنشاء مقال جديد" : "Create Article")}</span>
            </button>
          </div>

          {/* Articles list grid */}
          {filteredArticles.length === 0 ? (
            <div className="empty-submissions-card">
              <FileText size={48} className="empty-icon" />
              <p>{isAr ? "لم يتم العثور على أي مقالات." : "No articles found."}</p>
            </div>
          ) : (
            <div className="table-responsive-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{isAr ? "التصنيف" : "Category"}</th>
                    <th>{isAr ? "العنوان" : "Title"}</th>
                    <th>{t.slugLabel || (isAr ? "رابط المقال" : "Slug")}</th>
                    <th>{isAr ? "التعديل الأخير" : "Last Updated"}</th>
                    <th className="actions-header">{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map((post) => (
                    <tr key={post.slug} className="table-row-hover">
                      <td>
                        <span className="sales-volume-pill">
                          {isAr ? post.categoryAr : post.categoryEn}
                        </span>
                      </td>
                      <td className="font-bold">
                        <div className="admin-post-title-cell">
                          <span>{post.titleEn}</span>
                          <span className="ar-sub-title">{post.titleAr}</span>
                        </div>
                      </td>
                      <td>
                        <code className="slug-code-badge">/{post.slug}</code>
                      </td>
                      <td className="date-cell">
                        {new Date(post.updatedAt || post.createdAt).toLocaleDateString(locale, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="actions-cell">
                        <Link
                          href={`/${locale}/blog/${post.slug}`}
                          target="_blank"
                          className="icon-button view-action-btn"
                          title={t.readArticle}
                        >
                          <Eye size={15} />
                        </Link>
                        <button
                          onClick={() => openEditArticle(post)}
                          className="icon-button edit-action-btn"
                          title={t.adminEditArticle}
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => setArticleToDelete(post.slug)}
                          className="icon-button delete-action-btn"
                          title={t.delete}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Submissions Details Modal */}
      {selectedSub && (
        <div className="modal-backdrop fade-in" onClick={() => setSelectedSub(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t.details}</h2>
              <button onClick={() => setSelectedSub(null)} className="close-modal-btn">
                <X size={18} />
              </button>
            </div>

            <div className="modal-content">
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">
                    <User size={14} /> {t.nameLabel}
                  </span>
                  <strong className="detail-value">{selectedSub.name}</strong>
                </div>

                <div className="detail-item">
                  <span className="detail-label">
                    <Mail size={14} /> {t.emailLabel}
                  </span>
                  <a href={`mailto:${selectedSub.email}`} className="detail-value detail-link">
                    {selectedSub.email}
                  </a>
                </div>

                <div className="detail-item">
                  <span className="detail-label">
                    <Phone size={14} /> {t.phone}
                  </span>
                  <span className="detail-value">{selectedSub.phone || "—"}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">
                    <Layers size={14} /> {t.platform}
                  </span>
                  <span className={`detail-value platform-badge platform-${selectedSub.platform}`}>
                    {selectedSub.platform || "—"}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">
                    <DollarSign size={14} /> {t.salesVolume}
                  </span>
                  <span className="detail-value sales-volume-pill">
                    {selectedSub.salesVolume || "—"}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">
                    <Calendar size={14} /> {t.date}
                  </span>
                  <span className="detail-value">
                    {new Date(selectedSub.createdAt).toLocaleString(locale)}
                  </span>
                </div>
              </div>

              {selectedSub.storeUrl && (
                <div className="store-url-detail-box">
                  <span className="detail-label">
                    <Globe size={14} /> {t.storeUrl}
                  </span>
                  <div className="store-url-value">
                    {selectedSub.storeUrl.startsWith("http") ? (
                      <a
                        href={selectedSub.storeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="url-link-out"
                      >
                        {selectedSub.storeUrl}
                      </a>
                    ) : (
                      <p className="idea-text">{selectedSub.storeUrl}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={() => setSelectedSub(null)} className="secondary-button">
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Submission Dialog */}
      {subToDelete && (
        <div className="modal-backdrop fade-in" onClick={() => setSubToDelete(null)}>
          <div className="modal-card delete-confirm-card" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon-warning">
              <Trash2 size={24} />
            </div>
            <h2>{isAr ? "حذف الطلب" : "Delete Request"}</h2>
            <p>{t.confirmDelete}</p>
            <div className="confirm-actions">
              <button onClick={() => setSubToDelete(null)} className="secondary-button">
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={() => handleDeleteSubmission(subToDelete)}
                className="primary-button danger-btn"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Article Dialog */}
      {articleToDelete && (
        <div className="modal-backdrop fade-in" onClick={() => setArticleToDelete(null)}>
          <div className="modal-card delete-confirm-card" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon-warning">
              <Trash2 size={24} />
            </div>
            <h2>{isAr ? "حذف المقال" : "Delete Article"}</h2>
            <p>
              {t.confirmDeleteArticle ||
                (isAr
                  ? "هل أنت متأكد من رغبتك في حذف هذا المقال؟"
                  : "Are you sure you want to delete this article?")}
            </p>
            <div className="confirm-actions">
              <button onClick={() => setArticleToDelete(null)} className="secondary-button">
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={() => handleDeleteArticle(articleToDelete)}
                className="primary-button danger-btn"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article Editor Modal */}
      {isEditorOpen && (
        <div className="modal-backdrop fade-in">
          <div className="modal-card large-editor-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {isEditing
                  ? t.adminEditArticle || (isAr ? "تعديل المقال" : "Edit Article")
                  : t.adminAddArticle || (isAr ? "إنشاء مقال جديد" : "Create Article")}
              </h2>
              <button onClick={() => setIsEditorOpen(false)} className="close-modal-btn">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveArticle}>
              <div className="modal-content editor-modal-content">
                {editorError && (
                  <div className="form-error-alert">
                    <AlertCircle size={18} />
                    <span>{editorError}</span>
                  </div>
                )}
                {editorSuccess && (
                  <div className="form-success-alert">
                    <CheckCircle size={18} />
                    <span>{editorSuccess}</span>
                  </div>
                )}

                <div className="editor-form-grid">
                  {/* Slug */}
                  <label className="input-line">
                    <span>
                      {t.slugLabel || (isAr ? "رابط المقال (Slug)" : "URL Slug")}{" "}
                      <span className="required-star">*</span>
                    </span>
                    <input
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                      placeholder={t.slugPlaceholder || "e.g. roas-guide-beginners"}
                      required
                      disabled={isEditing} // Block modifying slug on edit to prevent broken links
                    />
                  </label>

                  {/* Categories */}
                  <div className="form-grid-two-col">
                    <label className="input-line">
                      <span>
                        {t.categoryLabelEn ||
                          (isAr ? "التصنيف (بالإنجليزية)" : "Category (English)")}
                      </span>
                      <input
                        value={formCategoryEn}
                        onChange={(e) => setFormCategoryEn(e.target.value)}
                        placeholder="e.g. Profitability"
                      />
                    </label>

                    <label className="input-line">
                      <span>
                        {t.categoryLabelAr || (isAr ? "التصنيف (بالعربية)" : "Category (Arabic)")}
                      </span>
                      <input
                        value={formCategoryAr}
                        onChange={(e) => setFormCategoryAr(e.target.value)}
                        placeholder="مثال: الربحية"
                      />
                    </label>
                  </div>

                  {/* Titles */}
                  <div className="form-grid-two-col">
                    <label className="input-line">
                      <span>
                        {t.titleLabelEn || (isAr ? "العنوان (بالإنجليزية)" : "Title (English)")}{" "}
                        <span className="required-star">*</span>
                      </span>
                      <input
                        value={formTitleEn}
                        onChange={(e) => setFormTitleEn(e.target.value)}
                        placeholder="e.g. How to Calculate Profit Margin"
                        required
                      />
                    </label>

                    <label className="input-line">
                      <span>
                        {t.titleLabelAr || (isAr ? "العنوان (بالعربية)" : "Title (Arabic)")}{" "}
                        <span className="required-star">*</span>
                      </span>
                      <input
                        value={formTitleAr}
                        onChange={(e) => setFormTitleAr(e.target.value)}
                        placeholder="مثال: طريقة حساب هامش الربح"
                        required
                      />
                    </label>
                  </div>

                  {/* Intros */}
                  <div className="form-grid-two-col">
                    <label className="input-line">
                      <span>
                        {t.introLabelEn ||
                          (isAr ? "المقدمة (بالإنجليزية)" : "Introduction (English)")}
                      </span>
                      <textarea
                        rows={2}
                        value={formIntroEn}
                        onChange={(e) => setFormIntroEn(e.target.value)}
                        placeholder="A brief summary sentence..."
                      />
                    </label>

                    <label className="input-line">
                      <span>
                        {t.introLabelAr || (isAr ? "المقدمة (بالعربية)" : "Introduction (Arabic)")}
                      </span>
                      <textarea
                        rows={2}
                        value={formIntroAr}
                        onChange={(e) => setFormIntroAr(e.target.value)}
                        placeholder="ملخص بسيط للمقال في سطر واحد..."
                      />
                    </label>
                  </div>

                  {/* Contents (Markdown) */}
                  <label className="input-line">
                    <span>
                      {t.contentLabelEn ||
                        (isAr
                          ? "المحتوى (بالإنجليزية - Markdown)"
                          : "Content (English - Markdown)")}
                    </span>
                    <textarea
                      rows={8}
                      value={formContentEn}
                      onChange={(e) => setFormContentEn(e.target.value)}
                      placeholder="# Heading&#10;&#10;Write markdown article content here..."
                      className="monospace-textarea"
                    />
                  </label>

                  <label className="input-line">
                    <span>
                      {t.contentLabelAr ||
                        (isAr ? "المحتوى (بالعربية - Markdown)" : "Content (Arabic - Markdown)")}
                    </span>
                    <textarea
                      rows={8}
                      value={formContentAr}
                      onChange={(e) => setFormContentAr(e.target.value)}
                      placeholder="# عنوان المقال&#10;&#10;اكتب محتوى المقال بنظام المارك داون هنا..."
                      className="monospace-textarea"
                    />
                  </label>

                  {/* Related Tools Multiselect */}
                  <div className="editor-tools-checkboxes">
                    <span>
                      {t.relatedToolsLabel || (isAr ? "الأدوات المرتبطة" : "Related Tools")}
                    </span>
                    <div className="tools-checkbox-grid">
                      {allToolsList.map((tool) => (
                        <label key={tool.slug} className="tool-checkbox-item">
                          <input
                            type="checkbox"
                            checked={formTools.includes(tool.slug)}
                            onChange={() => handleToolToggle(tool.slug)}
                          />
                          <span>{isAr ? tool.title.ar : tool.title.en}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="secondary-button"
                  style={{ marginRight: isAr ? "0" : "8px", marginLeft: isAr ? "8px" : "0" }}
                >
                  {t.cancelButton || (isAr ? "إلغاء" : "Cancel")}
                </button>
                <button type="submit" className="primary-button">
                  <Sparkles size={16} />
                  <span>{t.saveButton || (isAr ? "حفظ المقال" : "Save Article")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
