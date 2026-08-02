import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs"; // 🚨 Added Clerk Provider

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AmbientBackground from "@/components/home/AmbientBackground";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://news.etomu.com"),
  title: {
    default: "Etomu News | Politics, Sports, Tech, Business & More",
    template: "%s | Etomu News",
  },
  description:
    "Etomu News brings you the latest breaking news, football and sports updates, technology innovations, business insights, and lifestyle trends from Uganda and around the world.",
  keywords: [
    "Etomu News",
    "Uganda news updates",
    "politics Uganda",
    "football news",
    "sports updates",
    "Uganda technology news",
    "business insights",
    "real estate Uganda",
    "education news",
    "environment updates",
    "health and wellness",
    "AI news",
    "lifestyle and entertainment",
    "Kabale news",
    "global news",
  ],
  icons: {
    icon: [
      { url: "/etomu-48.png", sizes: "48x48", type: "image/png" },
      { url: "/etomu-192.png", sizes: "192x192", type: "image/png" },
      { url: "/etomu-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/etomu-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_UG",
    url: "https://news.etomu.com",
    title: "Etomu News | Politics, Sports, Tech & Business Updates",
    description:
      "Stay informed with the latest breaking news, football highlights, business insights, and technology innovations from Uganda and beyond.",
    siteName: "Etomu News",
    images: [
      {
        url: "/etomu-og.png", 
        width: 1200,
        height: 1200,
        alt: "Etomu News - Politics, Sports, Tech & Business",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Etomu News | Politics, Sports, Tech & Business Updates",
    description:
      "Stay informed with the latest breaking news, football highlights, business insights, and technology innovations from Uganda and beyond.",
    images: ["/etomu-og.png"], 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 🚨 Wrap the entire HTML output in ClerkProvider
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-slate-50 text-slate-900 flex flex-col min-h-screen relative`}>
          <AmbientBackground />
          
          <Navbar />
          <main className="flex-grow w-full relative z-10">
            {children}
          </main>
          <Footer />

          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
