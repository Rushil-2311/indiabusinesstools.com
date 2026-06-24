import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateBreadcrumbSchema } from "@/lib/schema";

const BASE_URL = "https://www.indiabusinesstools.com";

export const metadata: Metadata = {
  title: "About Us — Free Tools for Indian Businesses",
  description:
    "Learn about IndianBusinessTools — our mission to provide free, fast, and privacy-first business tools for Indian professionals, entrepreneurs, and students.",
  openGraph: {
    title: "About IndianBusinessTools",
    description:
      "Our mission is to provide the highest quality free utilities for Indian businesses, with zero ads and complete privacy.",
    url: `${BASE_URL}/about`,
  },
  alternates: { canonical: "/about" },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "About Us", url: `${BASE_URL}/about` },
]);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      {children}
    </>
  );
}
