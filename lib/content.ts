import {
  BadgePercent,
  Banknote,
  Bot,
  Calculator,
  FileText,
  Globe,
  LineChart,
  PackageCheck,
  Receipt,
  Search,
  ShieldCheck,
  ShoppingCart,
  Truck
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Locale } from "./i18n";

export type ToolType =
  | "profit"
  | "pricing"
  | "shopify"
  | "dropshipping"
  | "roas"
  | "breakEvenRoas"
  | "discount"
  | "shipping"
  | "vat"
  | "payment"
  | "description"
  | "meta"
  | "returnPolicy"
  | "shippingPolicy"
  | "cod";

export type Tool = {
  slug: string;
  type: ToolType;
  icon: LucideIcon;
  category: string;
  priority: "MVP" | "Phase 2" | "Future";
  demand: "High" | "Medium" | "Low";
  difficulty: "Easy" | "Medium" | "Hard";
  score: number;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  resultLabel: Record<Locale, string>;
};

export const categories = [
  {
    slug: "profit-pricing",
    icon: Calculator,
    title: {
      en: "Profit & Pricing",
      ar: "الربح والتسعير"
    },
    summary: {
      en: "Price products, protect margins, and understand real profit after fees.",
      ar: "سعر المنتجات واحم هامش الربح وافهم الربح الحقيقي بعد الرسوم."
    }
  },
  {
    slug: "marketing",
    icon: LineChart,
    title: {
      en: "Marketing",
      ar: "التسويق"
    },
    summary: {
      en: "Plan ad spend, ROAS, CAC, conversion rates, and campaign economics.",
      ar: "خطط للإنفاق الإعلاني والعائد وتكلفة العميل واقتصاديات الحملات."
    }
  },
  {
    slug: "product-content",
    icon: Bot,
    title: {
      en: "Product Content",
      ar: "محتوى المنتجات"
    },
    summary: {
      en: "Generate product descriptions, SEO titles, metadata, and marketplace copy.",
      ar: "أنشئ أوصاف المنتجات وعناوين SEO والبيانات الوصفية ونصوص المتاجر."
    }
  },
  {
    slug: "store-policies",
    icon: ShieldCheck,
    title: {
      en: "Store Policies",
      ar: "سياسات المتجر"
    },
    summary: {
      en: "Create return, shipping, privacy, and terms templates for ecommerce stores.",
      ar: "أنشئ قوالب سياسات الإرجاع والشحن والخصوصية وشروط المتجر."
    }
  },
  {
    slug: "shipping-logistics",
    icon: Truck,
    title: {
      en: "Shipping & Logistics",
      ar: "الشحن واللوجستيات"
    },
    summary: {
      en: "Estimate delivery costs, volumetric weight, COD risk, and free shipping thresholds.",
      ar: "قدر تكاليف التوصيل والوزن الحجمي ومخاطر الدفع عند الاستلام وحد الشحن المجاني."
    }
  },
  {
    slug: "finance",
    icon: Receipt,
    title: {
      en: "Finance",
      ar: "الحسابات المالية"
    },
    summary: {
      en: "Calculate taxes, payment fees, cash flow, break-even points, and forecasts.",
      ar: "احسب الضرائب ورسوم الدفع والتدفق النقدي ونقاط التعادل والتوقعات."
    }
  }
];

export const tools: Tool[] = [
  {
    slug: "ecommerce-profit-margin-calculator",
    type: "profit",
    icon: BadgePercent,
    category: "profit-pricing",
    priority: "MVP",
    demand: "High",
    difficulty: "Easy",
    score: 98,
    title: {
      en: "Ecommerce Profit Margin Calculator",
      ar: "حاسبة هامش ربح المتجر الإلكتروني"
    },
    summary: {
      en: "Calculate net profit, margin, ROI, and cost ratios after product, shipping, ads, and fees.",
      ar: "احسب صافي الربح والهامش والعائد بعد تكلفة المنتج والشحن والإعلانات والرسوم."
    },
    resultLabel: {
      en: "Net profit per order",
      ar: "صافي الربح لكل طلب"
    }
  },
  {
    slug: "product-pricing-calculator",
    type: "pricing",
    icon: Calculator,
    category: "profit-pricing",
    priority: "MVP",
    demand: "High",
    difficulty: "Easy",
    score: 96,
    title: {
      en: "Product Pricing Calculator",
      ar: "حاسبة تسعير المنتجات"
    },
    summary: {
      en: "Find the selling price needed to hit a target profit margin.",
      ar: "اعرف سعر البيع المطلوب للوصول إلى هامش الربح المستهدف."
    },
    resultLabel: {
      en: "Recommended price",
      ar: "سعر البيع المقترح"
    }
  },
  {
    slug: "shopify-profit-calculator",
    type: "shopify",
    icon: ShoppingCart,
    category: "profit-pricing",
    priority: "MVP",
    demand: "High",
    difficulty: "Medium",
    score: 95,
    title: {
      en: "Shopify Profit Calculator",
      ar: "حاسبة أرباح Shopify"
    },
    summary: {
      en: "Model Shopify profit after gateway fees, app costs, shipping, returns, and ads.",
      ar: "احسب ربح Shopify بعد رسوم الدفع والتطبيقات والشحن والمرتجعات والإعلانات."
    },
    resultLabel: {
      en: "Estimated Shopify profit",
      ar: "الربح المتوقع من Shopify"
    }
  },
  {
    slug: "dropshipping-profit-calculator",
    type: "dropshipping",
    icon: Globe,
    category: "profit-pricing",
    priority: "MVP",
    demand: "High",
    difficulty: "Medium",
    score: 94,
    title: {
      en: "Dropshipping Profit Calculator",
      ar: "حاسبة أرباح الدروبشيبينغ"
    },
    summary: {
      en: "Check whether a dropshipping product can survive supplier cost, shipping, ads, and refunds.",
      ar: "اختبر قدرة منتج الدروبشيبينغ على تحمل تكلفة المورد والشحن والإعلانات والمرتجعات."
    },
    resultLabel: {
      en: "Dropshipping net profit",
      ar: "صافي ربح الدروبشيبينغ"
    }
  },
  {
    slug: "roas-calculator",
    type: "roas",
    icon: LineChart,
    category: "marketing",
    priority: "MVP",
    demand: "High",
    difficulty: "Easy",
    score: 93,
    title: {
      en: "ROAS Calculator",
      ar: "حاسبة العائد على الإنفاق الإعلاني"
    },
    summary: {
      en: "Calculate return on ad spend and understand campaign revenue efficiency.",
      ar: "احسب العائد على الإنفاق الإعلاني وافهم كفاءة إيرادات الحملات."
    },
    resultLabel: {
      en: "ROAS",
      ar: "العائد الإعلاني"
    }
  },
  {
    slug: "break-even-roas-calculator",
    type: "breakEvenRoas",
    icon: LineChart,
    category: "marketing",
    priority: "MVP",
    demand: "High",
    difficulty: "Easy",
    score: 92,
    title: {
      en: "Break-Even ROAS Calculator",
      ar: "حاسبة ROAS نقطة التعادل"
    },
    summary: {
      en: "Find the minimum ROAS needed before ads start producing profit.",
      ar: "اعرف أقل عائد إعلاني مطلوب قبل أن تبدأ الإعلانات بتحقيق الربح."
    },
    resultLabel: {
      en: "Break-even ROAS",
      ar: "ROAS نقطة التعادل"
    }
  },
  {
    slug: "discount-profit-impact-calculator",
    type: "discount",
    icon: BadgePercent,
    category: "profit-pricing",
    priority: "MVP",
    demand: "High",
    difficulty: "Easy",
    score: 91,
    title: {
      en: "Discount Profit Impact Calculator",
      ar: "حاسبة تأثير الخصم على الربح"
    },
    summary: {
      en: "See how discounts change margin, profit, and required sales volume.",
      ar: "اعرف كيف يغير الخصم هامش الربح وصافي الربح وحجم المبيعات المطلوب."
    },
    resultLabel: {
      en: "Profit after discount",
      ar: "الربح بعد الخصم"
    }
  },
  {
    slug: "shipping-cost-calculator",
    type: "shipping",
    icon: Truck,
    category: "shipping-logistics",
    priority: "MVP",
    demand: "High",
    difficulty: "Medium",
    score: 90,
    title: {
      en: "Shipping Cost Calculator",
      ar: "حاسبة تكلفة الشحن"
    },
    summary: {
      en: "Estimate shipping cost from base rate, weight, distance, packaging, and COD handling.",
      ar: "قدر تكلفة الشحن من السعر الأساسي والوزن والمسافة والتغليف ورسوم الدفع عند الاستلام."
    },
    resultLabel: {
      en: "Estimated shipping cost",
      ar: "تكلفة الشحن المتوقعة"
    }
  },
  {
    slug: "ecommerce-vat-calculator",
    type: "vat",
    icon: Receipt,
    category: "finance",
    priority: "MVP",
    demand: "High",
    difficulty: "Easy",
    score: 89,
    title: {
      en: "Ecommerce VAT Calculator",
      ar: "حاسبة ضريبة القيمة المضافة للتجارة الإلكترونية"
    },
    summary: {
      en: "Add or remove VAT from product prices for ecommerce orders.",
      ar: "أضف أو اطرح ضريبة القيمة المضافة من أسعار منتجات المتجر."
    },
    resultLabel: {
      en: "VAT amount",
      ar: "قيمة الضريبة"
    }
  },
  {
    slug: "payment-gateway-fee-calculator",
    type: "payment",
    icon: Banknote,
    category: "finance",
    priority: "MVP",
    demand: "High",
    difficulty: "Easy",
    score: 88,
    title: {
      en: "Payment Gateway Fee Calculator",
      ar: "حاسبة رسوم بوابات الدفع"
    },
    summary: {
      en: "Estimate card, wallet, PayPal, Stripe, or regional gateway fees.",
      ar: "قدر رسوم البطاقات والمحافظ وPayPal وStripe وبوابات الدفع المحلية."
    },
    resultLabel: {
      en: "Gateway fee",
      ar: "رسوم بوابة الدفع"
    }
  },
  {
    slug: "product-description-generator",
    type: "description",
    icon: Bot,
    category: "product-content",
    priority: "MVP",
    demand: "High",
    difficulty: "Medium",
    score: 87,
    title: {
      en: "Product Description Generator",
      ar: "مولد وصف المنتجات"
    },
    summary: {
      en: "Generate polished ecommerce product copy in English or Arabic.",
      ar: "أنشئ وصفًا احترافيًا للمنتجات بالعربية أو الإنجليزية."
    },
    resultLabel: {
      en: "Generated description",
      ar: "الوصف الناتج"
    }
  },
  {
    slug: "seo-title-meta-generator",
    type: "meta",
    icon: Search,
    category: "product-content",
    priority: "MVP",
    demand: "High",
    difficulty: "Easy",
    score: 86,
    title: {
      en: "SEO Title & Meta Generator",
      ar: "مولد عنوان SEO والوصف التعريفي"
    },
    summary: {
      en: "Create search-friendly product titles and meta descriptions.",
      ar: "أنشئ عناوين منتجات وأوصافًا تعريفية مناسبة لمحركات البحث."
    },
    resultLabel: {
      en: "SEO snippet",
      ar: "مقتطف SEO"
    }
  },
  {
    slug: "return-policy-generator",
    type: "returnPolicy",
    icon: FileText,
    category: "store-policies",
    priority: "MVP",
    demand: "High",
    difficulty: "Easy",
    score: 85,
    title: {
      en: "Return Policy Generator",
      ar: "مولد سياسة الاسترجاع والاستبدال"
    },
    summary: {
      en: "Draft a clear ecommerce return and exchange policy.",
      ar: "أنشئ مسودة واضحة لسياسة الاسترجاع والاستبدال لمتجرك."
    },
    resultLabel: {
      en: "Policy draft",
      ar: "مسودة السياسة"
    }
  },
  {
    slug: "shipping-policy-generator",
    type: "shippingPolicy",
    icon: PackageCheck,
    category: "store-policies",
    priority: "MVP",
    demand: "High",
    difficulty: "Easy",
    score: 84,
    title: {
      en: "Shipping Policy Generator",
      ar: "مولد سياسة الشحن"
    },
    summary: {
      en: "Create a store shipping policy with delivery windows, fees, and COD notes.",
      ar: "أنشئ سياسة شحن تشمل مدة التوصيل والرسوم وملاحظات الدفع عند الاستلام."
    },
    resultLabel: {
      en: "Shipping policy draft",
      ar: "مسودة سياسة الشحن"
    }
  },
  {
    slug: "cod-profit-calculator",
    type: "cod",
    icon: Truck,
    category: "shipping-logistics",
    priority: "MVP",
    demand: "Medium",
    difficulty: "Easy",
    score: 83,
    title: {
      en: "COD Profit Calculator",
      ar: "حاسبة ربح الدفع عند الاستلام"
    },
    summary: {
      en: "Calculate true profit after COD fees, failed delivery, returns, and shipping.",
      ar: "احسب الربح الحقيقي بعد رسوم الدفع عند الاستلام وفشل التوصيل والمرتجعات والشحن."
    },
    resultLabel: {
      en: "COD net profit",
      ar: "صافي ربح الدفع عند الاستلام"
    }
  }
];

export const copy = {
  en: {
    brand: "TajerKit",
    navTools: "Tools",
    navBlog: "Blog",
    navContact: "Contact",
    language: "العربية",
    heroEyebrow: "Free ecommerce calculators and AI tools",
    heroTitle: "Make every order prove its profit before you ship it.",
    heroText:
      "Plan prices, ads, taxes, shipping, policies, and product content from one fast bilingual toolkit built for global and Arabic ecommerce sellers.",
    searchPlaceholder: "Search tools, e.g. Shopify profit, ROAS, VAT...",
    featured: "MVP tools",
    categories: "Tool categories",
    popular: "Popular workflows",
    blog: "Latest growth notes",
    newsletter: "Get the next ecommerce tool drop",
    newsletterText:
      "One practical email when new calculators, Arabic templates, or monetization guides are published.",
    emailPlaceholder: "you@store.com",
    subscribe: "Subscribe",
    useTool: "Use tool",
    allTools: "All tools",
    leadCta: "Need your ecommerce store built?",
    leadText:
      "Turn the same calculations into a real Shopify, WooCommerce, Salla, or custom store build.",
    leadButton: "Request a free audit",
    adLabel: "Advertisement",
    formula: "Formula and notes",
    related: "Related tools",
    instantResult: "Instant result",
    copied: "Copied",
    copyResult: "Copy result",
    
    // Contact & Audit Form
    phone: "Phone number",
    phonePlaceholder: "+1 (555) 000-0000",
    platform: "Store platform",
    platformPlaceholder: "Select store platform",
    salesVolume: "Monthly sales volume",
    salesPlaceholder: "Select sales volume",
    storeUrl: "Store URL or idea details",
    storeUrlPlaceholder: "https://yourstore.com or describe your ecommerce business idea",
    submitForm: "Send audit request",
    submitting: "Submitting...",
    successTitle: "Audit Request Received!",
    successText: "Thank you! We have received your request and our team will analyze your store. We'll get back to you within 48 hours.",
    backHome: "Back to homepage",
    nameLabel: "Name",
    namePlaceholder: "Your full name",
    emailLabel: "Email address",
    emailFieldPlaceholder: "you@store.com",
    
    // Platforms
    platformShopify: "Shopify",
    platformSalla: "Salla (سلة)",
    platformWoo: "WooCommerce",
    platformCustom: "Custom store build",
    platformNone: "None / Idea stage",

    // Sales volumes
    salesUnder1k: "Under $1,000 / month",
    sales1kTo5k: "$1,000 - $5,000 / month",
    sales5kTo20k: "$5,000 - $20,000 / month",
    salesOver20k: "Over $20,000 / month",

    // Admin Dashboard
    adminLoginTitle: "Admin Access Portal",
    adminLoginText: "Enter the security passcode to manage incoming audit requests.",
    passcodeLabel: "Security Passcode",
    passcodePlaceholder: "Enter passcode",
    loginButton: "Unlock Dashboard",
    loginError: "Invalid passcode. Please try again.",
    adminDashboardTitle: "Audit Submissions",
    adminDashboardText: "Review, filter, and export incoming audit requests and customer leads.",
    adminSearchPlaceholder: "Search by name, email, phone, or store URL...",
    filterPlatform: "All platforms",
    filterSales: "All sales volumes",
    exportCsv: "Export CSV",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete this submission?",
    noSubmissions: "No submissions matching your criteria.",
    date: "Date",
    name: "Name",
    email: "Email",
    phoneHeader: "Phone",
    platformHeader: "Platform",
    salesHeader: "Sales",
    actions: "Actions",
    details: "Submission Details",
    close: "Close",
    loading: "Loading...",
    tabSubmissions: "Audit Requests",
    tabArticles: "Blog Articles",
    adminAddArticle: "Create Article",
    adminEditArticle: "Edit Article",
    titleLabelEn: "Title (English)",
    titleLabelAr: "Title (Arabic)",
    introLabelEn: "Introduction (English)",
    introLabelAr: "Introduction (Arabic)",
    categoryLabelEn: "Category (English)",
    categoryLabelAr: "Category (Arabic)",
    contentLabelEn: "Content (English - Markdown)",
    contentLabelAr: "Content (Arabic - Markdown)",
    slugLabel: "URL Slug",
    slugPlaceholder: "e.g. how-to-calculate-profit",
    relatedToolsLabel: "Related Tools",
    saveButton: "Save Article",
    cancelButton: "Cancel",
    confirmDeleteArticle: "Are you sure you want to delete this article?",
    postSavedSuccess: "Article saved successfully!",
    postDeletedSuccess: "Article deleted successfully!",
    readArticle: "Read article",
    category: "Category",
    btnGenerateAi: "Generate with Gemini AI",
    writingAi: "Gemini is writing...",
    errMissingKey: "Gemini API key is not configured. Add GEMINI_API_KEY to .env.local to activate real AI generation.",
    templatePreview: "Template preview (non-AI fallback)"
  },
  ar: {
    brand: "تاجر كيت",
    navTools: "الأدوات",
    navBlog: "المدونة",
    navContact: "تواصل",
    language: "English",
    heroEyebrow: "حاسبات وأدوات ذكاء اصطناعي للتجارة الإلكترونية",
    heroTitle: "اختبر ربح كل طلب قبل أن تشحنه.",
    heroText:
      "خطط للتسعير والإعلانات والضرائب والشحن والسياسات ومحتوى المنتجات من منصة سريعة تدعم العربية والإنجليزية لأصحاب المتاجر.",
    searchPlaceholder: "ابحث عن أداة، مثل: ربح Shopify، ROAS، الضريبة...",
    featured: "أدوات MVP",
    categories: "تصنيفات الأدوات",
    popular: "مسارات عمل شائعة",
    blog: "ملاحظات نمو حديثة",
    newsletter: "احصل على أحدث أدوات التجارة الإلكترونية",
    newsletterText:
      "رسالة عملية عند نشر حاسبات جديدة أو قوالب عربية أو أدلة ربحية.",
    emailPlaceholder: "you@store.com",
    subscribe: "اشترك",
    useTool: "استخدم الأداة",
    allTools: "كل الأدوات",
    leadCta: "هل تحتاج إلى بناء متجر إلكتروني؟",
    leadText:
      "عوّل نفس الحسابات إلى متجر Shopify أو WooCommerce أو Salla أو متجر مخصص جاهز للنمو.",
    leadButton: "اطلب تدقيقًا مجانيًا",
    adLabel: "إعلان",
    formula: "المعادلة والملاحظات",
    related: "أدوات مرتبطة",
    instantResult: "نتيجة فورية",
    copied: "تم النسخ",
    copyResult: "انسخ النتيجة",
    
    // Contact & Audit Form
    phone: "رقم الهاتف",
    phonePlaceholder: "+966 50 000 0000",
    platform: "منصة المتجر",
    platformPlaceholder: "اختر منصة المتجر",
    salesVolume: "حجم المبيعات الشهري",
    salesPlaceholder: "اختر حجم المبيعات",
    storeUrl: "رابط المتجر أو تفاصيل الفكرة",
    storeUrlPlaceholder: "https://yourstore.com أو تفاصيل فكرة مشروعك الإلكتروني",
    submitForm: "إرسال طلب التدقيق",
    submitting: "جاري الإرسال...",
    successTitle: "تم استلام الطلب بنجاح!",
    successText: "شكرًا لك! لقد استلمنا طلبك وسيقوم فريقنا بتحليل متجرك بدقة. سنتواصل معك خلال 48 ساعة.",
    backHome: "العودة للرئيسية",
    nameLabel: "الاسم",
    namePlaceholder: "اسمك الكامل",
    emailLabel: "البريد الإلكتروني",
    emailFieldPlaceholder: "you@store.com",
    
    // Platforms
    platformShopify: "Shopify",
    platformSalla: "سلة (Salla)",
    platformWoo: "WooCommerce",
    platformCustom: "متجر مخصص",
    platformNone: "لا يوجد / مرحلة الفكرة",

    // Sales volumes
    salesUnder1k: "أقل من 1,000 $ / شهرياً",
    sales1kTo5k: "1,000 $ - 5,000 $ / شهرياً",
    sales5kTo20k: "5,000 $ - 20,000 $ / شهرياً",
    salesOver20k: "أكثر من 20,000 $ / شهرياً",

    // Admin Dashboard
    adminLoginTitle: "بوابة المسؤول",
    adminLoginText: "أدخل رمز المرور السري للوصول إلى طلبات تدقيق المتاجر.",
    passcodeLabel: "رمز المرور السري",
    passcodePlaceholder: "أدخل الرمز",
    loginButton: "فتح لوحة التحكم",
    loginError: "رمز المرور غير صحيح. حاول مرة أخرى.",
    adminDashboardTitle: "طلبات تدقيق المتاجر",
    adminDashboardText: "إدارة وتصفية وتصدير طلبات تدقيق المتاجر وبيانات العملاء المحتملين.",
    adminSearchPlaceholder: "ابحث بالاسم، البريد، الهاتف، أو الرابط...",
    filterPlatform: "كل المنصات",
    filterSales: "كل أحجام المبيعات",
    exportCsv: "تصدير CSV",
    delete: "حذف",
    confirmDelete: "هل أنت متأكد من رغبتك في حذف هذا الطلب؟",
    noSubmissions: "لم يتم العثور على طلبات مطابقة للمعايير.",
    date: "التاريخ",
    name: "الاسم",
    email: "البريد",
    phoneHeader: "الهاتف",
    platformHeader: "المنصة",
    salesHeader: "المبيعات",
    actions: "الإجراءات",
    details: "تفاصيل الطلب",
    close: "إغلاق",
    loading: "جاري التحميل...",
    tabSubmissions: "طلبات التدقيق",
    tabArticles: "مقالات المدونة",
    adminAddArticle: "إنشاء مقال جديد",
    adminEditArticle: "تعديل المقال",
    titleLabelEn: "العنوان (بالإنجليزية)",
    titleLabelAr: "العنوان (بالعربية)",
    introLabelEn: "المقدمة (بالإنجليزية)",
    introLabelAr: "المقدمة (بالعربية)",
    categoryLabelEn: "التصنيف (بالإنجليزية)",
    categoryLabelAr: "التصنيف (بالعربية)",
    contentLabelEn: "المحتوى (بالإنجليزية - Markdown)",
    contentLabelAr: "المحتوى (بالعربية - Markdown)",
    slugLabel: "رابط المقال (Slug)",
    slugPlaceholder: "مثال: how-to-calculate-profit",
    relatedToolsLabel: "الأدوات المرتبطة",
    saveButton: "حفظ المقال",
    cancelButton: "إلغاء",
    confirmDeleteArticle: "هل أنت متأكد من رغبتك في حذف هذا المقال؟",
    postSavedSuccess: "تم حفظ المقال بنجاح!",
    postDeletedSuccess: "تم حذف المقال بنجاح!",
    readArticle: "اقرأ المقال",
    category: "التصنيف",
    btnGenerateAi: "إنشاء بذكاء Gemini AI",
    writingAi: "جاري الكتابة بذكاء Gemini...",
    errMissingKey: "مفتاح Gemini API غير مفعّل. أضف GEMINI_API_KEY في ملف .env.local لتفعيل الذكاء الاصطناعي الحقيقي.",
    templatePreview: "معاينة القالب (الخيار الاحتياطي بدون ذكاء اصطناعي)"
  }
};

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}
