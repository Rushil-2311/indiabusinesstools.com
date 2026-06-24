import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolSchemas } from "@/components/seo/ToolSchemas";

export const metadata: Metadata = {
  title: "Percentage Calculator — Solve Any Percentage Problem Instantly",
  description:
    "Free percentage calculator. Find the percentage of a number, calculate percentage change, increase/decrease, and find what percentage X is of Y. Instant results.",
  keywords: [
    "percentage calculator",
    "percentage of a number calculator",
    "percentage change calculator",
    "percentage increase calculator",
    "percentage decrease calculator",
    "what percent of calculator",
    "online percentage calculator",
  ],
  openGraph: {
    title: "Percentage Calculator — Solve Any Percentage Problem | IndianBusinessTools",
    description:
      "Instantly solve percentage problems — percentage of a number, change, increase, decrease, and ratio.",
    url: "https://www.indiabusinesstools.com/percentage-calculator",
  },
  alternates: { canonical: "/percentage-calculator" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Percentage Calculator",
  url: "https://www.indiabusinesstools.com/percentage-calculator",
  description: "Solve any percentage problem instantly — change, ratio, increase, and decrease.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Organization", name: "IndianBusinessTools" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={schema} />
      <ToolSchemas slug="percentage-calculator" name="Percentage Calculator" category="Utility Tools" categorySlug="utility" />
      {children}
    </>
  );
}
