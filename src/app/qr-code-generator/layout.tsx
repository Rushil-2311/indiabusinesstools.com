import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolSchemas } from "@/components/seo/ToolSchemas";

export const metadata: Metadata = {
  title: "QR Code Generator — Free QR for URL, UPI, WhatsApp & Phone",
  description:
    "Free QR code generator for Indian businesses. Create QR codes for URLs, UPI payment IDs, WhatsApp numbers, phone numbers, and email addresses. Customize colors and download as PNG.",
  keywords: [
    "QR code generator India",
    "free QR code generator",
    "UPI QR code generator",
    "WhatsApp QR code",
    "QR code for business",
    "custom QR code",
    "QR code download PNG",
    "QR code maker online",
  ],
  openGraph: {
    title: "QR Code Generator — Free QR for URL, UPI & More | IndianBusinessTools",
    description:
      "Generate QR codes for URLs, UPI payments, WhatsApp, and phone numbers. Customize colors and download as PNG.",
    url: "https://www.indiabusinesstools.com/qr-code-generator",
  },
  alternates: { canonical: "/qr-code-generator" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "QR Code Generator",
  url: "https://www.indiabusinesstools.com/qr-code-generator",
  description:
    "Generate QR codes for URLs, UPI IDs, WhatsApp, and phone numbers with custom colors.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Organization", name: "IndianBusinessTools" },
  featureList: [
    "URL QR codes",
    "UPI payment QR codes",
    "WhatsApp QR codes",
    "Custom colors",
    "PNG download",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={schema} />
      <ToolSchemas slug="qr-code-generator" name="QR Code Generator" category="Utility Tools" categorySlug="utility" />
      {children}
    </>
  );
}
