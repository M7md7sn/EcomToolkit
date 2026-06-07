import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TajerKit | تاجر كيت",
  description:
    "Free ecommerce calculators and AI tools for pricing, profit, shipping, policies, and product content.",
  metadataBase: new URL("https://tajerkit.com")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
