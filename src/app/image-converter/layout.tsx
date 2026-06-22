import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Image Converter — PNG to JPG, WebP Converter Online",
  description:
    "Free online image converter. Convert PNG to JPG, JPG to WebP, PNG to WebP and more. Adjust quality, compare file sizes, and download instantly. No upload — runs in your browser.",
  keywords: [
    "image converter online",
    "PNG to JPG converter",
    "JPG to WebP converter",
    "PNG to WebP converter",
    "image format converter",
    "convert image online free",
    "WebP converter",
    "image compression tool",
  ],
  openGraph: {
    title: "Image Converter — PNG, JPG, WebP Converter | IndianBusinessTools",
    description:
      "Convert images between PNG, JPG, and WebP instantly in your browser. Adjust quality and compare file sizes.",
    url: "https://www.indiabusinesstools.com/image-converter",
  },
  alternates: { canonical: "/image-converter" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Image Converter",
  url: "https://www.indiabusinesstools.com/image-converter",
  description: "Convert images between PNG, JPG, and WebP formats in your browser.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Organization", name: "IndianBusinessTools" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={schema} />
      {children}
    </>
  );
}
