import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/components/context/AuthContext";
import AmbientBackground from "@/components/home/AmbientBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://news.etomu.com"),
  title: {
    default: "Etomu News | Technology, Business & Innovation",
    template: "%s | Etomu News",
  },
  description:
    "Etomu News brings you the latest technology news, business insights, AI updates, programming tutorials, entrepreneurship tips, and digital trends from Uganda and beyond.",
  keywords: [
    "Etomu News",
    "Uganda technology news",
    "AI news",
    "business news Uganda",
    "technology Uganda",
    "programming tutorials",
    "web development",
    "startups Uganda",
    "entrepreneurship",
    "digital innovation",
    "Kabale technology",
    "tech guides",
  ],
  // NEW: Favicon configuration
  icons: {
    icon: [
      { url: "/etomu-48.png", sizes: "48x48", type: "image/png" },
      { url: "/etomu-192.png", sizes: "192x192", type: "image/png" },
      { url: "/etomu-512.png", sizes: "512x512", type: "image/png" },
    ],
    // Optional but recommended: Apple Touch Icon for iOS devices
    apple: [
      { url: "/etomu-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_UG",
    url: "https://news.etomu.com",
    title: "Etomu News | Technology, Business & Innovation",
    description:
      "Stay informed with the latest technology, AI, business, programming, and innovation news from Uganda and around the world.",
    siteName: "Etomu News",
    images: [
      {
        url: "/etomu-og.png", // Ensure this matches your actual file extension (.png or .jpg)
        width: 1200,
        height: 1200,
        alt: "Etomu News - Technology, Business & Innovation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Etomu News | Technology, Business & Innovation",
    description:
      "Stay informed with the latest technology, AI, business, programming, and innovation news from Uganda and around the world.",
    images: ["/etomu-og.png"], // Ensure this matches your actual file extension
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
      <body
        className={`${inter.className} bg-slate-50 text-slate-900 flex flex-col min-h-screen relative`}
      >
        <AmbientBackground />

        <AuthProvider>
          <Navbar />
          <main className="flex-grow w-full relative z-10">
            {children}
          </main>
          <Footer />
        </AuthProvider>

        <Analytics />
      </body>
    </html>
  );
}
