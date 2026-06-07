"use client";

import { useState } from "react";
import { CheckCircle2, Sparkles, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { copy } from "@/lib/content";
import { submitAuditRequest } from "@/lib/actions/contact";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

export function ContactForm({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const isAr = locale === "ar";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [platform, setPlatform] = useState("");
  const [salesVolume, setSalesVolume] = useState("");
  const [storeUrl, setStoreUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim()) {
      setError(
        isAr
          ? "يرجى ملء الحقول المطلوبة (الاسم والبريد الإلكتروني)."
          : "Please fill in required fields (Name and Email).",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitAuditRequest({
        name,
        email,
        phone,
        platform,
        salesVolume,
        storeUrl,
      });

      if (res.success) {
        setSuccess(true);
      } else {
        setError(
          res.error ||
            (isAr
              ? "حدث خطأ ما. يرجى المحاولة مرة أخرى."
              : "Something went wrong. Please try again."),
        );
      }
    } catch (err) {
      console.error(err);
      setError(isAr ? "فشل الاتصال بالخادم." : "Failed to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="success-panel fade-in">
        <div className="success-icon-wrap">
          <CheckCircle2 size={48} className="success-check-icon" />
          <div className="icon-pulse" />
        </div>
        <h2>{t.successTitle}</h2>
        <p>{t.successText}</p>
        <div className="success-actions">
          <Link href={`/${locale}`} className="primary-button">
            {!isAr && <ArrowLeft size={16} style={{ marginRight: "8px" }} />}
            {t.backHome}
            {isAr && (
              <ArrowLeft size={16} style={{ marginLeft: "8px", transform: "rotate(180deg)" }} />
            )}
          </Link>
        </div>
        <div className="success-glow" />
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      {error && (
        <div className="form-error-alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="form-grid-two-col">
        <label className="input-line">
          <span>
            {t.nameLabel} <span className="required-star">*</span>
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.namePlaceholder}
            required
            disabled={isSubmitting}
          />
        </label>

        <label className="input-line">
          <span>
            {t.emailLabel} <span className="required-star">*</span>
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailFieldPlaceholder}
            required
            disabled={isSubmitting}
          />
        </label>
      </div>

      <div className="form-grid-two-col">
        <label className="input-line">
          <span>{t.phone}</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t.phonePlaceholder}
            disabled={isSubmitting}
          />
        </label>

        <label className="input-line">
          <span>{t.platform}</span>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            disabled={isSubmitting}
            className="styled-select"
          >
            <option value="">{t.platformPlaceholder}</option>
            <option value="shopify">{t.platformShopify}</option>
            <option value="salla">{t.platformSalla}</option>
            <option value="woocommerce">{t.platformWoo}</option>
            <option value="custom">{t.platformCustom}</option>
            <option value="none">{t.platformNone}</option>
          </select>
        </label>
      </div>

      <label className="input-line">
        <span>{t.salesVolume}</span>
        <select
          value={salesVolume}
          onChange={(e) => setSalesVolume(e.target.value)}
          disabled={isSubmitting}
          className="styled-select"
        >
          <option value="">{t.salesPlaceholder}</option>
          <option value="under1k">{t.salesUnder1k}</option>
          <option value="1k-5k">{t.sales1kTo5k}</option>
          <option value="5k-20k">{t.sales5kTo20k}</option>
          <option value="over20k">{t.salesOver20k}</option>
        </select>
      </label>

      <label className="input-line">
        <span>{t.storeUrl}</span>
        <textarea
          rows={4}
          value={storeUrl}
          onChange={(e) => setStoreUrl(e.target.value)}
          placeholder={t.storeUrlPlaceholder}
          disabled={isSubmitting}
        />
      </label>

      <button className="primary-button submit-btn" type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>{t.submitting}</span>
          </>
        ) : (
          <>
            <Sparkles size={16} />
            <span>{t.submitForm}</span>
          </>
        )}
      </button>
    </form>
  );
}
