import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolSchemas } from "@/components/seo/ToolSchemas";

export const metadata: Metadata = {
  title: "Markdown Converter — MD to PDF, Word DOC & HTML",
  description:
    "Free online Markdown converter with live preview. Write Markdown and export to PDF, Word DOC, or HTML. Perfect for README files, blog posts, and documentation.",
  keywords: [
    "markdown to PDF converter",
    "markdown to Word converter",
    "markdown to HTML",
    "markdown editor online",
    "MD to DOC converter",
    "markdown converter free",
    "markdown live preview",
    "markdown formatter",
  ],
  openGraph: {
    title: "Markdown Converter — MD to PDF, Word, HTML | IndianBusinessTools",
    description:
      "Write Markdown with live preview and export to PDF, Word DOC, or HTML instantly.",
    url: "https://www.indiabusinesstools.com/markdown-converter",
  },
  alternates: { canonical: "/markdown-converter" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Markdown Converter",
  url: "https://www.indiabusinesstools.com/markdown-converter",
  description: "Convert Markdown to PDF, Word DOC, and HTML with live preview.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Organization", name: "IndianBusinessTools" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={schema} />
      <ToolSchemas slug="markdown-converter" name="Markdown Converter" category="Developer Tools" categorySlug="developer" />
      {children}
    </>
  );
}
