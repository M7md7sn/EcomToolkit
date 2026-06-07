"use client";

import { Calculator, Copy, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { copy, type ToolType } from "@/lib/content";
import { generateAiCopy } from "@/lib/actions/ai";
import type { Locale } from "@/lib/i18n";

type NumberField = {
  key: string;
  label: Record<Locale, string>;
  value: number;
  suffix?: string;
};

const fieldSets: Record<string, NumberField[]> = {
  profit: [
    { key: "price", label: { en: "Selling price", ar: "سعر البيع" }, value: 99 },
    { key: "cogs", label: { en: "Product cost", ar: "تكلفة المنتج" }, value: 35 },
    { key: "shipping", label: { en: "Shipping cost", ar: "تكلفة الشحن" }, value: 9 },
    { key: "ads", label: { en: "Ad cost", ar: "تكلفة الإعلان" }, value: 14 },
    { key: "fees", label: { en: "Payment fee", ar: "رسوم الدفع" }, value: 3, suffix: "%" },
  ],
  pricing: [
    { key: "cogs", label: { en: "Total product cost", ar: "إجمالي تكلفة المنتج" }, value: 42 },
    {
      key: "target",
      label: { en: "Target margin", ar: "الهامش المستهدف" },
      value: 45,
      suffix: "%",
    },
    { key: "fees", label: { en: "Payment fee", ar: "رسوم الدفع" }, value: 3, suffix: "%" },
  ],
  roas: [
    { key: "revenue", label: { en: "Campaign revenue", ar: "إيراد الحملة" }, value: 5000 },
    { key: "adSpend", label: { en: "Ad spend", ar: "الإنفاق الإعلاني" }, value: 1250 },
  ],
  breakEvenRoas: [
    { key: "price", label: { en: "Selling price", ar: "سعر البيع" }, value: 100 },
    { key: "cost", label: { en: "Non-ad costs", ar: "التكاليف بدون الإعلان" }, value: 55 },
  ],
  discount: [
    { key: "price", label: { en: "Original price", ar: "السعر الأصلي" }, value: 120 },
    { key: "discount", label: { en: "Discount", ar: "نسبة الخصم" }, value: 20, suffix: "%" },
    { key: "cost", label: { en: "Total cost", ar: "إجمالي التكلفة" }, value: 58 },
  ],
  shipping: [
    { key: "base", label: { en: "Base rate", ar: "السعر الأساسي" }, value: 6 },
    { key: "weight", label: { en: "Weight charge", ar: "رسوم الوزن" }, value: 4 },
    { key: "packaging", label: { en: "Packaging", ar: "التغليف" }, value: 2 },
    { key: "cod", label: { en: "COD handling", ar: "رسوم الدفع عند الاستلام" }, value: 3 },
  ],
  vat: [
    { key: "price", label: { en: "Product price", ar: "سعر المنتج" }, value: 100 },
    { key: "rate", label: { en: "VAT rate", ar: "نسبة الضريبة" }, value: 15, suffix: "%" },
  ],
  payment: [
    { key: "amount", label: { en: "Order amount", ar: "قيمة الطلب" }, value: 250 },
    {
      key: "percent",
      label: { en: "Gateway percentage", ar: "نسبة البوابة" },
      value: 2.9,
      suffix: "%",
    },
    { key: "fixed", label: { en: "Fixed fee", ar: "رسوم ثابتة" }, value: 0.3 },
  ],
  cod: [
    { key: "price", label: { en: "Selling price", ar: "سعر البيع" }, value: 90 },
    { key: "cost", label: { en: "Product cost", ar: "تكلفة المنتج" }, value: 32 },
    {
      key: "shipping",
      label: { en: "Shipping and COD", ar: "الشحن والدفع عند الاستلام" },
      value: 13,
    },
    {
      key: "failed",
      label: { en: "Failed delivery rate", ar: "نسبة فشل التوصيل" },
      value: 8,
      suffix: "%",
    },
  ],
  shopify: [
    { key: "price", label: { en: "Selling price", ar: "سعر البيع" }, value: 110 },
    { key: "cost", label: { en: "Product cost", ar: "تكلفة المنتج" }, value: 39 },
    { key: "shipping", label: { en: "Shipping", ar: "الشحن" }, value: 10 },
    { key: "apps", label: { en: "App cost per order", ar: "تكلفة التطبيقات لكل طلب" }, value: 3 },
    { key: "ads", label: { en: "Ad cost", ar: "تكلفة الإعلان" }, value: 16 },
    { key: "fees", label: { en: "Gateway fee", ar: "رسوم الدفع" }, value: 2.9, suffix: "%" },
  ],
  dropshipping: [
    { key: "price", label: { en: "Selling price", ar: "سعر البيع" }, value: 69 },
    { key: "supplier", label: { en: "Supplier cost", ar: "تكلفة المورد" }, value: 21 },
    { key: "shipping", label: { en: "Shipping", ar: "الشحن" }, value: 7 },
    { key: "ads", label: { en: "Ad cost", ar: "تكلفة الإعلان" }, value: 14 },
    { key: "refund", label: { en: "Refund risk", ar: "مخاطر المرتجعات" }, value: 6, suffix: "%" },
  ],
};

const textInputs = {
  description: {
    en: ["Product name", "Key benefits", "Audience"],
    ar: ["اسم المنتج", "أهم المزايا", "الجمهور المستهدف"],
  },
  meta: {
    en: ["Product keyword", "Store category", "Main benefit"],
    ar: ["الكلمة المفتاحية", "تصنيف المتجر", "الفائدة الأساسية"],
  },
  returnPolicy: {
    en: ["Store name", "Return window", "Support email"],
    ar: ["اسم المتجر", "مدة الاسترجاع", "بريد الدعم"],
  },
  shippingPolicy: {
    en: ["Store name", "Delivery time", "Shipping regions"],
    ar: ["اسم المتجر", "مدة التوصيل", "مناطق الشحن"],
  },
};

type CalculationResult = {
  display: string;
  secondary: string;
  plain: string;
};

type CalculatorFn = (fieldValues: Record<string, number>) => CalculationResult;

/**
 * Format numeric value as USD currency.
 */
function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

// Registry of individual calculator functions
const calculatePricing: CalculatorFn = (fieldValues) => {
  const target = fieldValues.target / 100;
  const fees = fieldValues.fees / 100;
  const price = fieldValues.cogs / Math.max(0.01, 1 - target - fees);
  return {
    display: formatMoney(price),
    secondary: `Target margin ${fieldValues.target.toFixed(1)}%`,
    plain: `Recommended price: ${formatMoney(price)}`,
  };
};

const calculateRoas: CalculatorFn = (fieldValues) => {
  const roas = fieldValues.adSpend ? fieldValues.revenue / fieldValues.adSpend : 0;
  return {
    display: `${roas.toFixed(2)}x`,
    secondary: `${formatMoney(fieldValues.revenue)} revenue from ${formatMoney(fieldValues.adSpend)} ad spend`,
    plain: `ROAS: ${roas.toFixed(2)}x`,
  };
};

const calculateBreakEvenRoas: CalculatorFn = (fieldValues) => {
  const contribution = fieldValues.price - fieldValues.cost;
  const breakEven = contribution > 0 ? fieldValues.price / contribution : 0;
  return {
    display: `${breakEven.toFixed(2)}x`,
    secondary: `Contribution margin ${((contribution / fieldValues.price) * 100).toFixed(1)}%`,
    plain: `Break-even ROAS: ${breakEven.toFixed(2)}x`,
  };
};

const calculateDiscount: CalculatorFn = (fieldValues) => {
  const salePrice = fieldValues.price * (1 - fieldValues.discount / 100);
  const profit = salePrice - fieldValues.cost;
  return {
    display: formatMoney(profit),
    secondary: `Sale price ${formatMoney(salePrice)}`,
    plain: `Profit after discount: ${formatMoney(profit)}`,
  };
};

const calculateShipping: CalculatorFn = (fieldValues) => {
  const cost = fieldValues.base + fieldValues.weight + fieldValues.packaging + fieldValues.cod;
  return {
    display: formatMoney(cost),
    secondary: "Base + weight + packaging + COD handling",
    plain: `Estimated shipping cost: ${formatMoney(cost)}`,
  };
};

const calculateVat: CalculatorFn = (fieldValues) => {
  const vat = fieldValues.price * (fieldValues.rate / 100);
  return {
    display: formatMoney(vat),
    secondary: `Gross price ${formatMoney(fieldValues.price + vat)}`,
    plain: `VAT amount: ${formatMoney(vat)}`,
  };
};

const calculatePayment: CalculatorFn = (fieldValues) => {
  const fee = fieldValues.amount * (fieldValues.percent / 100) + fieldValues.fixed;
  return {
    display: formatMoney(fee),
    secondary: `Net payout ${formatMoney(fieldValues.amount - fee)}`,
    plain: `Gateway fee: ${formatMoney(fee)}`,
  };
};

const calculateCod: CalculatorFn = (fieldValues) => {
  const failedDeliveryCost = fieldValues.shipping * (fieldValues.failed / 100);
  const profit = fieldValues.price - fieldValues.cost - fieldValues.shipping - failedDeliveryCost;
  return {
    display: formatMoney(profit),
    secondary: `Failed delivery cost reserve ${formatMoney(failedDeliveryCost)}`,
    plain: `COD net profit: ${formatMoney(profit)}`,
  };
};

const calculateShopify: CalculatorFn = (fieldValues) => {
  const fee = fieldValues.price * (fieldValues.fees / 100);
  const profit =
    fieldValues.price -
    fieldValues.cost -
    fieldValues.shipping -
    fieldValues.apps -
    fieldValues.ads -
    fee;
  const margin = fieldValues.price ? (profit / fieldValues.price) * 100 : 0;
  return {
    display: formatMoney(profit),
    secondary: `Margin ${margin.toFixed(1)}% after Shopify costs`,
    plain: `Shopify profit: ${formatMoney(profit)}`,
  };
};

const calculateDropshipping: CalculatorFn = (fieldValues) => {
  const refundReserve = fieldValues.price * (fieldValues.refund / 100);
  const profit =
    fieldValues.price -
    fieldValues.supplier -
    fieldValues.shipping -
    fieldValues.ads -
    refundReserve;
  return {
    display: formatMoney(profit),
    secondary: `Refund reserve ${formatMoney(refundReserve)}`,
    plain: `Dropshipping profit: ${formatMoney(profit)}`,
  };
};

const calculateProfit: CalculatorFn = (fieldValues) => {
  const fee = fieldValues.price * ((fieldValues.fees || 0) / 100);
  const profit =
    fieldValues.price -
    (fieldValues.cogs || 0) -
    (fieldValues.shipping || 0) -
    (fieldValues.ads || 0) -
    fee;
  const margin = fieldValues.price ? (profit / fieldValues.price) * 100 : 0;
  return {
    display: formatMoney(profit),
    secondary: `Margin ${margin.toFixed(1)}%`,
    plain: `Net profit: ${formatMoney(profit)}`,
  };
};

const CALCULATORS: Record<string, CalculatorFn> = {
  pricing: calculatePricing,
  roas: calculateRoas,
  breakEvenRoas: calculateBreakEvenRoas,
  discount: calculateDiscount,
  shipping: calculateShipping,
  vat: calculateVat,
  payment: calculatePayment,
  cod: calculateCod,
  shopify: calculateShopify,
  dropshipping: calculateDropshipping,
  profit: calculateProfit,
};

/**
 * Dispatches the appropriate calculator based on tool type.
 */
function calculate(type: string, fieldValues: Record<string, number>): CalculationResult {
  const runCalculator = CALCULATORS[type] || CALCULATORS.profit;
  return runCalculator(fieldValues);
}

type GeneratorFn = (locale: Locale, inputs: string[]) => CalculationResult;

const generateMeta: GeneratorFn = (locale, inputs) => {
  const [name, detail, benefit] = inputs;
  const isArabic = locale === "ar";
  const title = isArabic
    ? `${name} | ${detail} لمتجرك الإلكتروني`
    : `${name} | ${detail} for Your Online Store`;
  const description = isArabic
    ? `اكتشف ${name} المصمم لفئة ${benefit}. خيار عملي يساعدك على تحسين تجربة الشراء وزيادة الثقة.`
    : `Discover ${name} for ${benefit}. A practical ecommerce choice designed to improve trust, clarity, and conversion.`;
  return {
    display: `${title}\n\n${description}`,
    secondary: "",
    plain: `${title}\n${description}`,
  };
};

const generateReturnPolicy: GeneratorFn = (locale, inputs) => {
  const [name, windowDays, supportEmail] = inputs;
  const isArabic = locale === "ar";
  const policy = isArabic
    ? `تقبل ${name} طلبات الاسترجاع أو الاستبدال خلال ${windowDays} من تاريخ الاستلام. يجب أن يكون المنتج بحالته الأصلية، ويمكن التواصل عبر ${supportEmail} لمراجعة الطلب.`
    : `${name} accepts return or exchange requests within ${windowDays} of delivery. Items should remain in original condition, and customers can contact ${supportEmail} to review the request.`;
  return { display: policy, secondary: "", plain: policy };
};

const generateShippingPolicy: GeneratorFn = (locale, inputs) => {
  const [name, timeRange, regions] = inputs;
  const isArabic = locale === "ar";
  const policy = isArabic
    ? `تقوم ${name} بشحن الطلبات عادة خلال ${timeRange}. تتوفر خدمات التوصيل إلى ${regions}، وقد تختلف الرسوم حسب المدينة وطريقة الدفع.`
    : `${name} usually ships orders within ${timeRange}. Delivery is available to ${regions}, with fees depending on region and payment method.`;
  return { display: policy, secondary: "", plain: policy };
};

const generateProductDescription: GeneratorFn = (locale, inputs) => {
  const [name, features, targetAudience] = inputs;
  const isArabic = locale === "ar";
  const description = isArabic
    ? `${name} منتج عملي مصمم لفئة ${targetAudience}. يتميز بـ ${features}، ويمنح العميل تجربة استخدام واضحة وسهلة من أول طلب.`
    : `${name} is a practical product built for ${targetAudience}. It stands out through ${features}, giving shoppers a clear reason to buy with confidence.`;
  return { display: description, secondary: "", plain: description };
};

const GENERATORS: Record<string, GeneratorFn> = {
  meta: generateMeta,
  returnPolicy: generateReturnPolicy,
  shippingPolicy: generateShippingPolicy,
  description: generateProductDescription,
};

/**
 * Dispatches the appropriate fallback template text generator based on tool type.
 */
function generateText(type: string, locale: Locale, inputs: string[]): CalculationResult {
  const runGenerator = GENERATORS[type] || generateProductDescription;
  return runGenerator(locale, inputs);
}

export function ToolRunner({
  tool,
  locale,
}: {
  tool: {
    type: ToolType;
    priority: string;
    title: Record<Locale, string>;
    resultLabel: Record<Locale, string>;
  };
  locale: Locale;
}) {
  const translations = copy[locale];
  const isArabic = locale === "ar";
  const numericFields = fieldSets[tool.type] || fieldSets.profit;
  const isGenerator = ["description", "meta", "returnPolicy", "shippingPolicy"].includes(tool.type);

  // Form Value States
  const [values, setValues] = useState(
    Object.fromEntries(numericFields.map((field) => [field.key, field.value])),
  );
  const [textValues, setTextValues] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // AI Generation States
  const [aiOutput, setAiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState("");
  const [missingApiKey, setMissingApiKey] = useState(false);

  // Reset states and update defaults when tool/locale changes
  useEffect(() => {
    setAiOutput("");
    setAiError("");
    setMissingApiKey(false);

    if (tool.type === "meta") {
      setTextValues(
        isArabic
          ? ["حقيبة ذكية", "حقيبة ظهر مقاومة للماء مع شاحن USB", "المسافرين وأصحاب الأعمال"]
          : [
              "Smart backpack",
              "waterproof laptop backpack with USB port",
              "commuters and travelers",
            ],
      );
    } else if (tool.type === "returnPolicy") {
      setTextValues(
        isArabic
          ? ["متجر الأناقة", "14 يوماً", "support@alanaqastore.com"]
          : ["Elegance Store", "30 days", "returns@elegancestore.com"],
      );
    } else if (tool.type === "shippingPolicy") {
      setTextValues(
        isArabic
          ? ["متجر الأناقة", "3 - 5 أيام عمل", "جميع مدن المملكة العربية السعودية ومصر"]
          : ["Elegance Store", "2-4 business days", "United States and Canada"],
      );
    } else {
      // description
      setTextValues(
        isArabic
          ? [
              "حقيبة ظهر ذكية",
              "متينة، خفيفة الوزن، منظمة بشكل ممتاز، مع منفذ شحن USB",
              "المتسوقين عبر الإنترنت والطلاب والمسافرين",
            ]
          : [
              "Smart backpack",
              "durable, lightweight, well-organized with USB charging port",
              "busy online shoppers, students, and travelers",
            ],
      );
    }
  }, [tool.type, locale, isArabic]);

  const result = useMemo(() => {
    if (isGenerator) {
      return generateText(tool.type, locale, textValues);
    }
    return calculate(tool.type, values);
  }, [isGenerator, locale, textValues, tool.type, values]);

  function updateValue(key: string, value: string) {
    setValues((prevValues) => ({ ...prevValues, [key]: Number(value) }));
  }

  // Trigger Gemini AI generation
  async function handleGenerateAi() {
    setAiError("");
    setMissingApiKey(false);
    setIsGenerating(true);

    try {
      const aiCopyResponse = await generateAiCopy(tool.type, locale, textValues);
      if (aiCopyResponse.success && aiCopyResponse.text) {
        setAiOutput(aiCopyResponse.text);
      } else if (aiCopyResponse.code === "MISSING_KEY") {
        setMissingApiKey(true);
      } else {
        setAiError(aiCopyResponse.error || "Failed to generate AI copywriting.");
      }
    } catch (error) {
      console.error(error);
      const errMsg = error instanceof Error ? error.message : String(error);
      setAiError(
        isArabic
          ? `فشل الاتصال بالذكاء الاصطناعي: ${errMsg}`
          : `Failed to connect to AI server: ${errMsg}`,
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function copyToClipboard() {
    const textToCopy = isGenerator && aiOutput ? aiOutput : result.plain;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="runner-grid">
      <div className="runner-panel">
        <div className="runner-heading">
          <span className="tool-icon">
            <Calculator size={20} />
          </span>
          <div>
            <span className="eyebrow">{tool.priority} tool</span>
            <h2>{tool.title[locale]}</h2>
          </div>
        </div>

        {isGenerator ? (
          <div className="form-grid">
            {(textInputs[tool.type as keyof typeof textInputs]?.[locale] || []).map(
              (label, index) => (
                <label className="input-line" key={label}>
                  <span>{label}</span>
                  <input
                    value={textValues[index] || ""}
                    onChange={(event) => {
                      const updatedTextValues = [...textValues];
                      updatedTextValues[index] = event.target.value;
                      setTextValues(updatedTextValues);
                    }}
                  />
                </label>
              ),
            )}

            {/* AI Action Button */}
            <button
              type="button"
              className="primary-button ai-generate-btn"
              onClick={handleGenerateAi}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{translations.writingAi}</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>{translations.btnGenerateAi}</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="form-grid">
            {numericFields.map((field) => (
              <label key={field.key} className="input-line">
                <span>
                  {field.label[locale]}
                  {field.suffix ? ` (${field.suffix})` : ""}
                </span>
                <input
                  type="number"
                  value={values[field.key] ?? 0}
                  min="0"
                  step="0.01"
                  onChange={(event) => updateValue(field.key, event.target.value)}
                />
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="result-panel">
        <div className="result-heading">
          <div>
            <span className="eyebrow">{translations.instantResult}</span>
            <h2>{tool.resultLabel[locale]}</h2>
          </div>
          <button className="icon-button" type="button" onClick={copyToClipboard}>
            <Copy size={17} />
          </button>
        </div>

        {isGenerator ? (
          <div className="generator-result-wrapper">
            {/* Missing Key Warning */}
            {missingApiKey && (
              <div className="ai-warning-box">
                <AlertCircle size={18} />
                <span>{translations.errMissingKey}</span>
              </div>
            )}

            {/* General AI Error Alert */}
            {aiError && (
              <div className="ai-warning-box danger-alert">
                <AlertCircle size={18} />
                <span>{aiError}</span>
              </div>
            )}

            {isGenerating ? (
              <div className="ai-writing-skeleton">
                <Loader2 size={24} className="animate-spin skeleton-spinner" />
                <p>{translations.writingAi}</p>
              </div>
            ) : aiOutput ? (
              <div className="ai-generated-wrap fade-in">
                <div className="ai-source-badge">
                  <Sparkles size={12} />
                  <span>Gemini AI</span>
                </div>
                <div className="generated-copy">{aiOutput}</div>
              </div>
            ) : (
              <div className="ai-generated-wrap fallback-preview">
                <div className="ai-source-badge fallback-badge">
                  <span>{translations.templatePreview}</span>
                </div>
                <div className="generated-copy muted-copy">{result.display}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="result-stack">
            <strong>{result.display}</strong>
            <span>{result.secondary}</span>
          </div>
        )}

        <div className="quiet-note">
          <Sparkles size={16} />
          <span>{copied ? translations.copied : translations.copyResult}</span>
        </div>
      </div>
    </section>
  );
}
