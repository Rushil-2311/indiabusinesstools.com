import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Text Case Converter — UPPERCASE, lowercase, Title Case & More",
  description:
    "Free online text case converter. Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, and kebab-case instantly.",
  keywords: [
    "text case converter",
    "uppercase converter",
    "lowercase converter",
    "title case converter",
    "camelCase converter",
    "snake_case converter",
    "text formatter online",
    "case changer",
  ],
  openGraph: {
    title: "Text Case Converter — UPPERCASE to lowercase & More | IndianBusinessTools",
    description:
      "Convert text between any case format: UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more.",
    url: "https://www.indiabusinesstools.com/text-case-converter",
  },
  alternates: { canonical: "/text-case-converter" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Text Case Converter",
  url: "https://www.indiabusinesstools.com/text-case-converter",
  description: "Convert text between UPPERCASE, lowercase, Title Case, camelCase, and more.",
  applicationCategory: "UtilitiesApplication",
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
