"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Calculator, CheckCircle2, TrendingUp } from "lucide-react";
import type { Locale } from "@/lib/i18n";

type Field = {
  key: string;
  label: string;
  value: number;
};

const fieldLabels = {
  en: {
    selling: "Selling price",
    product: "Product cost",
    shipping: "Shipping",
    ads: "Ad cost",
    fees: "Gateway fee %",
    profit: "Net profit",
    margin: "Margin",
    roi: "ROI"
  },
  ar: {
    selling: "سعر البيع",
    product: "تكلفة المنتج",
    shipping: "الشحن",
    ads: "الإعلان",
    fees: "رسوم الدفع %",
    profit: "صافي الربح",
    margin: "الهامش",
    roi: "العائد"
  }
};

/**
 * Format numeric value as USD currency.
 */
function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(amount);
}

export function QuickProfitCalculator({ locale }: { locale: Locale }) {
  const labels = fieldLabels[locale];
  const [fields, setFields] = useState<Field[]>([
    { key: "selling", label: labels.selling, value: 79 },
    { key: "product", label: labels.product, value: 28 },
    { key: "shipping", label: labels.shipping, value: 8 },
    { key: "ads", label: labels.ads, value: 12 },
    { key: "fees", label: labels.fees, value: 3 }
  ]);

  const profitAnalysis = useMemo(() => {
    const fieldValueMap = Object.fromEntries(fields.map((field) => [field.key, field.value]));
    const gatewayFeeAmount = Number(fieldValueMap.selling || 0) * (Number(fieldValueMap.fees || 0) / 100);
    const totalOrderCost =
      Number(fieldValueMap.product || 0) +
      Number(fieldValueMap.shipping || 0) +
      Number(fieldValueMap.ads || 0) +
      gatewayFeeAmount;
    const netProfitAmount = Number(fieldValueMap.selling || 0) - totalOrderCost;
    const marginPercentage = Number(fieldValueMap.selling) ? (netProfitAmount / Number(fieldValueMap.selling)) * 100 : 0;
    const roiPercentage = totalOrderCost ? (netProfitAmount / totalOrderCost) * 100 : 0;

    return { profit: netProfitAmount, margin: marginPercentage, roi: roiPercentage };
  }, [fields]);

  const status = profitAnalysis.profit > 0 && profitAnalysis.margin >= 25 ? "healthy" : "warning";
  const statusText =
    locale === "ar"
      ? status === "healthy"
        ? "المنتج مربح"
        : "هامش الربح منخفض"
      : status === "healthy"
        ? "Product is profitable"
        : "Profit margin is low";

  function updateValue(key: string, inputValueString: string) {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.key === key ? { ...field, value: Number(inputValueString) } : field
      )
    );
  }

  return (
    <section className="quick-tool" aria-label="Quick profit calculator">
      <div className="quick-tool-header">
        <span className="tool-icon">
          <Calculator size={20} />
        </span>
        <div>
          <span className="eyebrow">Live calculator</span>
          <h2>{locale === "ar" ? "حاسبة ربح فورية" : "Instant profit calculator"}</h2>
        </div>
      </div>

      <div className="quick-grid">
        {fields.map((field) => (
          <label key={field.key} className="input-line">
            <span>{field.label}</span>
            <input
              type="number"
              value={field.value}
              min="0"
              step="0.01"
              onChange={(event) => updateValue(field.key, event.target.value)}
            />
          </label>
        ))}
      </div>

      <div className={`profit-status profit-status-${status}`}>
        {status === "healthy" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
        <span>{statusText}</span>
      </div>

      <div className="hero-result-card">
        <span>{labels.profit}</span>
        <strong>{formatMoney(profitAnalysis.profit)}</strong>
      </div>

      <div className="result-strip">
        <div>
          <span>{labels.margin}</span>
          <strong>{profitAnalysis.margin.toFixed(1)}%</strong>
          <small>{locale === "ar" ? "بعد كل التكاليف" : "after all costs"}</small>
        </div>
        <div>
          <span>{labels.roi}</span>
          <strong>{profitAnalysis.roi.toFixed(1)}%</strong>
          <small>{locale === "ar" ? "عائد على التكلفة" : "return on cost"}</small>
        </div>
        <div>
          <span>{locale === "ar" ? "الحالة" : "Status"}</span>
          <strong>{status === "healthy" ? "OK" : "LOW"}</strong>
          <small>{locale === "ar" ? "قرار سريع" : "quick read"}</small>
        </div>
      </div>

      <div className="quiet-note">
        <TrendingUp size={16} />
        <span>
          {locale === "ar"
            ? "استخدم هذه النتيجة قبل إطلاق المنتج أو زيادة الإنفاق الإعلاني."
            : "Use this result before launching a product or increasing ad spend."}
        </span>
      </div>
    </section>
  );
}
