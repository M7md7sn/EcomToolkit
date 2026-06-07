"use server";

// Humanization instructions to avoid robotic AI cliches
const HUMANIZE_INSTRUCTION_AR = `
  هام جداً: اكتب بأسلوب بشري طبيعي بالكامل، مقنع، وودود (Humanized Style). 
  تجنب الكلمات والعبارات النمطية والمكررة للذكاء الاصطناعي تماماً مثل: "علاوة على ذلك"، "في هذا الصدد"، "يجدر بالذكر"، "شاهدٌ على"، "ثورة في عالم"، "نهدف إلى تقديم"، "يتميز بـ"، "مما يجعله الخيار الأمثل".
  اكتب بلغة بسيطة ومباشرة كما لو كان يكتبها كاتب نصوص بشري حقيقي يتحدث لصديق أو عميل حقيقي بصدق ووضوح.`;

const HUMANIZE_INSTRUCTION_EN = `
  IMPORTANT: Write in a highly natural, humanized, conversational, and direct tone.
  Strictly avoid robotic AI cliches, over-formal transitions, and generic buzzwords (such as 'delve', 'testament', 'tapestry', 'elevate', 'revolutionary', 'game-changer', 'fostering', 'moreover', 'designed to', 'look no further').
  Make it sound authentic, warm, and direct—as if written by a real marketer or support agent addressing a real human customer. Vary sentence structures and keep it simple.`;

/**
 * Builds the appropriate prompt based on tool type, locale, and inputs.
 */
function buildCopyPrompt(type: string, locale: "en" | "ar", inputs: string[]): string {
  const [firstInput, secondInput, thirdInput] = inputs;
  const isArabic = locale === "ar";

  if (type === "meta") {
    return isArabic
      ? `تصرف كخبير سيو (SEO) محترف للمتاجر الإلكترونية. اكتب عنوان SEO محسن لمحركات البحث (أقل من 60 حرفاً) ووصف ميتا (Meta Description) مقنع وجاذب لحث الباحثين على النقر (أقل من 160 حرفاً) لصفحة منتج.
الكلمة المفتاحية المستهدفة: ${firstInput}
تصنيف المتجر: ${secondInput}
الفائدة الأساسية للمنتج: ${thirdInput}
${HUMANIZE_INSTRUCTION_AR}
اكتب المخرجات بشكل مباشر بالتنسيق التالي فقط:
عنوان SEO: [اكتب العنوان هنا]
الوصف التعريفي: [اكتب الوصف التعريفي هنا]`
      : `Act as a professional SEO expert for ecommerce stores. Write an optimized SEO Title (under 60 characters) and a compelling, high-converting Meta Description (under 160 characters) for a product page.
Target Keyword: ${firstInput}
Store Category: ${secondInput}
Main Product Benefit: ${thirdInput}
${HUMANIZE_INSTRUCTION_EN}
Output the results directly using the following format:
SEO Title: [title here]
Meta Description: [description here]`;
  }

  if (type === "returnPolicy") {
    return isArabic
      ? `تصرف ككاتب نصوص دعم عملاء وسياسات قانونية للمتاجر الإلكترونية. اكتب مسودة سياسة استرجاع واستبدال واضحة، سهلة الفهم، وصديقة للعميل تبني الثقة وتزيل المخاوف لمتجر إلكتروني.
اسم المتجر: ${firstInput}
مدة الاسترجاع/الاستبدال المتاحة: ${secondInput}
البريد الإلكتروني للدعم الفني والاسترجاع: ${thirdInput}
${HUMANIZE_INSTRUCTION_AR}
اكتب سياسة استرجاع مرتبة ومقسمة بعناوين واضحة ونقاط لسهولة القراءة باللغة العربية الفصحى المبسطة.`
      : `Act as a customer support and legal policy copywriter for ecommerce stores. Write a clear, friendly, and professional Return and Exchange Policy that builds buyer trust and removes purchase friction.
Store Name: ${firstInput}
Return Window Duration: ${secondInput}
Support & Returns Email Address: ${thirdInput}
${HUMANIZE_INSTRUCTION_EN}
Output a structured policy with clear headings and bullet points in clean English.`;
  }

  if (type === "shippingPolicy") {
    return isArabic
      ? `تصرف ككاتب نصوص لوجستية محترف للتجارة الإلكترونية. اكتب سياسة شحن وتوصيل واضحة، موثوقة، وتبني المصداقية لمتجر إلكتروني.
اسم المتجر: ${firstInput}
مدة التوصيل المتوقعة: ${secondInput}
مناطق الشحن المتوفرة: ${thirdInput}
${HUMANIZE_INSTRUCTION_AR}
اكتب سياسة شحن منظمة ومقسمة بعناوين واضحة تشمل تفاصيل معالجة الطلبات، تتبع الشحن، وملاحظات حول الدفع عند الاستلام والتغليف باللغة العربية الفصحى المبسطة.`
      : `Act as a professional logistics and shipping copywriter for ecommerce. Write a clear, reliable, and comprehensive Shipping Policy for an online store.
Store Name: ${firstInput}
Expected Delivery Time: ${secondInput}
Shipping/Delivery Regions Covered: ${thirdInput}
${HUMANIZE_INSTRUCTION_EN}
Output a structured shipping policy with headers and bullet points covering order processing, tracking, packaging, and Cash on Delivery (COD) notes.`;
  }

  // Default: description (Product Description Generator)
  return isArabic
    ? `تصرف ككاتب نصوص تسويقية (Copywriter) خبير ومحترف في كتابة صفحات بيع المنتجات للمتاجر الإلكترونية. اكتب وصفاً تسويقياً جذاباً ومقنعاً جداً لمنتج يحث الزوار على الشراء.
اسم المنتج: ${firstInput}
المزايا والفوائد الأساسية للمنتج: ${secondInput}
الجمهور المستهدف: ${thirdInput}
${HUMANIZE_INSTRUCTION_AR}
اكتب وصفاً تسويقياً رائعاً يحتوي على عنوان رئيسي جذاب، فقرة قصيرة تشرح حل المشكلة، وقائمة نقطية تبرز أهم المزايا بشكل منسق واحترافي باللغة العربية الفصحى القريبة من لغة التجارة.`
    : `Act as an expert ecommerce conversion copywriter. Write a compelling, high-converting, and engaging product description for a landing page.
Product Name: ${firstInput}
Key Benefits & Features: ${secondInput}
Target Audience: ${thirdInput}
${HUMANIZE_INSTRUCTION_EN}
Write a persuasive description including an attention-grabbing headline, a short problem-solving paragraph, and a bulleted list of key benefits in a clean, professional ecommerce style.`;
}

/**
 * Handles HTTP connection to the Gemini API with retry logic and exponential backoff.
 */
async function fetchGeminiContent(prompt: string, apiKey: string): Promise<Response> {
  const maxRetries = 3;
  let currentDelay = 1000;
  let lastResponse: Response | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const apiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        },
      );

      lastResponse = apiResponse;

      if (apiResponse.ok) {
        return apiResponse;
      }

      // Retry on 503 (service overloaded), 429 (rate limit), or general 5xx errors
      const isServerError = apiResponse.status >= 500;
      const isRateLimit = apiResponse.status === 429;
      if (isServerError || isRateLimit) {
        console.warn(
          `Gemini API returned status ${apiResponse.status}. Retrying attempt ${attempt}/${maxRetries} in ${currentDelay}ms...`,
        );
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, currentDelay));
          currentDelay *= 2;
          continue;
        }
      }
      return apiResponse; // Return immediately if it's a client error (e.g., 400, 403)
    } catch (fetchError) {
      console.error(`Gemini fetch attempt ${attempt} threw an error:`, fetchError);
      if (attempt === maxRetries) {
        throw fetchError;
      }
      await new Promise((resolve) => setTimeout(resolve, currentDelay));
      currentDelay *= 2;
    }
  }

  if (!lastResponse) {
    throw new Error("No response was received from the Gemini server.");
  }
  return lastResponse;
}

/**
 * Orchestrates AI copy generation via Google Gemini API.
 */
export async function generateAiCopy(
  type: string,
  locale: "en" | "ar",
  inputs: string[],
): Promise<{ success: boolean; text?: string; error?: string; code?: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { success: false, code: "MISSING_KEY", error: "Gemini API key is not configured." };
  }

  const prompt = buildCopyPrompt(type, locale, inputs);

  try {
    const apiResponse = await fetchGeminiContent(prompt, apiKey);

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      console.error("Gemini API Error details:", errorData);
      return { success: false, error: `API response error status ${apiResponse.status}` };
    }

    const geminiResponseJson = await apiResponse.json();
    const resultText = geminiResponseJson.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      return { success: false, error: "Empty response generated by Gemini AI." };
    }

    return { success: true, text: resultText };
  } catch (error) {
    console.error("Gemini Fetch error:", error);
    const message = error instanceof Error ? error.message : "Failed to contact Gemini server.";
    return { success: false, error: message };
  }
}
