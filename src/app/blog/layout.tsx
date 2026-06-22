import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Blog — Finance, Investment & Business Guides for India",
  description:
    "Finance guides, investment tips, GST tutorials, and business insights for Indian entrepreneurs. Learn how to calculate SIP returns, understand GST, and more.",
  keywords: [
    "Indian business blog",
    "SIP investment guide",
    "GST guide India",
    "finance tips India",
    "investment guides India",
    "business tools blog",
  ],
  openGraph: {
    title: "Blog — Finance & Business Guides | IndianBusinessTools",
    description:
      "Practical finance guides and business insights for Indian professionals and entrepreneurs.",
    url: "https://www.indiabusinesstools.com/blog",
    type: "website",
  },
  alternates: { canonical: "/blog" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "IndianBusinessTools Blog",
  url: "https://www.indiabusinesstools.com/blog",
  description: "Finance guides, investment tips, and business insights for Indian professionals.",
  publisher: {
    "@type": "Organization",
    name: "IndianBusinessTools",
    url: "https://www.indiabusinesstools.com",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={schema} />
      {children}
    </>
  );
}
