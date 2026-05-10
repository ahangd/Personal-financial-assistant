import type { Metadata } from "next";

import "./globals.css";
import { ThemeProvider } from "next-themes";

import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "\u7406\u8d22\u77e5\u8bc6\u7f51\u7ad9 - \u667a\u80fd\u7406\u8d22\u52a9\u624b\u4e0e\u7406\u8d22\u767e\u79d1",
  description:
    "\u7cfb\u7edf\u5b66\u4e60\u7406\u8d22\u77e5\u8bc6\uff0cAI \u667a\u80fd\u52a9\u624b\u89e3\u7b54\u7406\u8d22\u95ee\u9898\uff0c\u590d\u5229\u8ba1\u7b97\u5668\u3001\u5b9a\u6295\u6a21\u62df\u7b49\u5b9e\u7528\u5de5\u5177\u3002\u4e13\u6ce8\u6559\u80b2\uff0c\u5efa\u7acb\u6b63\u786e\u6295\u8d44\u89c2\u5ff5\u3002",
  keywords: [
    "\u7406\u8d22\u77e5\u8bc6",
    "\u7406\u8d22\u767e\u79d1",
    "\u667a\u80fd\u7406\u8d22\u52a9\u624b",
    "\u590d\u5229\u8ba1\u7b97\u5668",
    "\u5b9a\u6295",
    "\u7406\u8d22\u5165\u95e8",
    "\u6295\u8d44\u77e5\u8bc6",
  ],
  openGraph: {
    type: "website",
    siteName: "\u7406\u8d22\u77e5\u8bc6\u7f51\u7ad9",
    locale: "zh_CN",
    title:
      "\u7406\u8d22\u77e5\u8bc6\u7f51\u7ad9 - \u667a\u80fd\u7406\u8d22\u52a9\u624b\u4e0e\u7406\u8d22\u767e\u79d1",
    description:
      "\u7cfb\u7edf\u5b66\u4e60\u7406\u8d22\u77e5\u8bc6\uff0cAI \u667a\u80fd\u52a9\u624b\u89e3\u7b54\u7406\u8d22\u95ee\u9898\uff0c\u5b9e\u7528\u7406\u8d22\u5de5\u5177\u3002",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FinLounge preview",
      },
    ],
  },
  authors: [
    {
      name: "Akash Moradiya",
      url: "https://shadcnui-blocks.com",
    },
  ],
  creator: "Akash Moradiya",
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/favicon-32x32.png",
      sizes: "32x32",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/favicon-16x16.png",
      sizes: "16x16",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/android-chrome-192x192.png",
      sizes: "192x192",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/android-chrome-512x512.png",
      sizes: "512x512",
    },
  ],
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body
        className="antialiased [text-rendering:optimizeLegibility] [font-smooth:always]"
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
