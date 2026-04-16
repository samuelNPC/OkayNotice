import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/components/context/AuthContext"; // ADDED IMPORT

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://okaynotice.com"),
  title: {
    default: "OkayNotice | Smart Finance & Tech Tips for Uganda",
    template: "%s | OkayNotice"
  },
  description: "Learn how to navigate digital payments, save money, and find the absolute best gadget deals in Uganda.",
  keywords: [
    "Uganda tech news",
    "financial tools Uganda",
    "Kabale Online deals",
    "MTN MoMo calculator",
    "Airtel money charges",
    "smartphone deals Uganda",
    "business profit calculator"
  ],
  openGraph: {
    type: "website",
    locale: "en_UG",
    url: "https://okaynotice.com",
    title: "OkayNotice | Smart Finance & Tech Tips for Uganda",
    description: "Learn how to navigate digital payments, save money, and find the absolute best gadget deals in Uganda.",
    siteName: "OkayNotice",
    images: [
      {
        url: "/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "OkayNotice - Tech News & Financial Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OkayNotice | Smart Finance & Tech Tips for Uganda",
    description: "Learn how to navigate digital payments, save money, and find the absolute best gadget deals in Uganda.",
    images: ["/og-image.jpg"],
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
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 flex flex-col min-h-screen`}>
        {/* WRAPPED APP IN AUTHPROVIDER */}
        <AuthProvider>
          <Navbar />
          <main className="flex-grow w-full">
            {children}
          </main>
          <Footer />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
