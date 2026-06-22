import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Word Counter — Count Words, Characters & Reading Time",
  description:
    "Free word counter and text analyzer. Count words, characters, sentences, and paragraphs. Get reading time, speaking time, unique word count, and top keyword frequency analysis.",
  keywords: [
    "word counter online",
    "character counter",
    "word count tool",
    "reading time calculator",
    "text analyzer",
    "sentence counter",
    "paragraph counter",
    "keyword density checker",
    "word frequency counter",
  ],
  openGraph: {
    title: "Word Counter — Words, Characters & Reading Time | IndianBusinessTools",
    description:
      "Count words, characters, sentences. Get reading time and keyword frequency analysis instantly.",
    url: "https://indianbusinesstools.com/word-counter",
  },
  alternates: { canonical: "/word-counter" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Word Counter",
  url: "https://indianbusinesstools.com/word-counter",
  description:
    "Count words, characters, sentences. Analyze reading time and keyword frequency.",
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
