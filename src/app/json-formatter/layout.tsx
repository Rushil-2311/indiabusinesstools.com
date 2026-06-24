import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolSchemas } from "@/components/seo/ToolSchemas";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator — Beautify & Minify JSON Online",
  description:
    "Free online JSON formatter, validator, and minifier. Paste your JSON to beautify with syntax highlighting, validate for errors, or minify for production use.",
  keywords: [
    "JSON formatter",
    "JSON validator",
    "JSON beautifier",
    "JSON minifier",
    "format JSON online",
    "JSON parser online",
    "JSON viewer",
    "JSON pretty print",
  ],
  openGraph: {
    title: "JSON Formatter & Validator — Beautify JSON Online | IndianBusinessTools",
    description:
      "Format, validate, and minify JSON instantly. Syntax highlighting, error detection, and 2/4/8 space indentation.",
    url: "https://www.indiabusinesstools.com/json-formatter",
  },
  alternates: { canonical: "/json-formatter" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "JSON Formatter",
  url: "https://www.indiabusinesstools.com/json-formatter",
  description: "Format, validate, beautify, and minify JSON data with syntax highlighting.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Organization", name: "IndianBusinessTools" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={schema} />
      <ToolSchemas slug="json-formatter" name="JSON Formatter" category="Developer Tools" categorySlug="developer" />
      {children}
    </>
  );
}
