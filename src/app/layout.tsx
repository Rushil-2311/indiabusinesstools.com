import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = "https://www.indiabusinesstools.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "IndianBusinessTools — Free Business & Finance Tools for India",
    template: "%s | IndianBusinessTools",
  },
  description:
    "Free online tools for Indian businesses and professionals. Calculate SIP returns, EMI, GST, generate QR codes, convert images, format JSON, and more. 100% free, no sign-up required.",
  keywords: [
    "Indian business tools",
    "GST calculator India",
    "SIP calculator",
    "EMI calculator",
    "QR code generator India",
    "free finance tools India",
    "Indian tax calculator",
    "business tools online",
    "percentage calculator",
    "image converter",
    "markdown to PDF",
    "base64 encoder",
    "word counter",
    "JSON formatter",
  ],
  authors: [{ name: "IndianBusinessTools", url: BASE_URL }],
  creator: "IndianBusinessTools",
  publisher: "IndianBusinessTools",
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
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "IndianBusinessTools",
    title: "IndianBusinessTools — Free Business & Finance Tools for India",
    description:
      "Free online tools for Indian businesses. Calculate SIP, EMI, GST, generate QR codes, convert images, and more. No sign-up required.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "IndianBusinessTools — Free Business & Finance Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IndianBusinessTools — Free Business & Finance Tools for India",
    description:
      "Free online tools for Indian businesses. SIP, EMI, GST calculators, QR code generator, image converter, and more.",
    images: ["/og-image.png"],
    creator: "@indianbiztools",
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: "dtAsTsMu43DxbdyBaD_bZGhhrzGtC2ulqkT9DLUrcsg",
  },
  category: "business",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "IndianBusinessTools",
  url: BASE_URL,
  description:
    "Free online business and finance tools for Indian professionals and entrepreneurs.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "IndianBusinessTools",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/favicon.svg`,
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "IndianBusinessTools",
  alternateName: "Indian Business Tools",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/favicon.svg`,
    width: 512,
    height: 512,
  },
  description:
    "Free online tools for Indian businesses and professionals. Calculate SIP, EMI, GST, generate invoices, format JSON, convert images, and 30+ more tools. No sign-up required.",
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  inLanguage: "en-IN",
  knowsAbout: [
    "GST Calculator",
    "SIP Calculator",
    "EMI Calculator",
    "Income Tax Calculator",
    "Indian Business Finance",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <JsonLd schema={websiteSchema} />
        <JsonLd schema={organizationSchema} />
        <AppShell>{children}</AppShell>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
