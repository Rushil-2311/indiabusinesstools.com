import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Base64 Encoder & Decoder — Encode & Decode Online Free",
  description:
    "Free Base64 encoder and decoder. Encode text or files to Base64 or decode Base64 strings back to plain text. Supports file upload for data URL generation.",
  keywords: [
    "base64 encoder",
    "base64 decoder",
    "base64 encode online",
    "base64 decode online",
    "base64 converter",
    "encode text to base64",
    "decode base64 to text",
    "base64 tool free",
    "data URL generator",
  ],
  openGraph: {
    title: "Base64 Encoder & Decoder — Encode & Decode Free | IndianBusinessTools",
    description:
      "Encode text or files to Base64 or decode Base64 strings back to plain text. Free and instant.",
    url: "https://indianbusinesstools.com/base64-tool",
  },
  alternates: { canonical: "/base64-tool" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Base64 Encoder & Decoder",
  url: "https://indianbusinesstools.com/base64-tool",
  description: "Encode text/files to Base64 or decode Base64 strings back to plain text.",
  applicationCategory: "DeveloperApplication",
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
