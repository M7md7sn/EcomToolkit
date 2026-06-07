import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TajerTools | تاجر تولز",
  description:
    "Free ecommerce calculators and AI tools for pricing, profit, shipping, policies, and product content.",
  metadataBase: new URL("https://tajertools.com"),
  icons: {
    icon: "/favicon.svg?v=2",
    shortcut: "/favicon.svg?v=2",
    apple: "/favicon.svg?v=2"
  }
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
