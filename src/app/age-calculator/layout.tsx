import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolSchemas } from "@/components/seo/ToolSchemas";

export const metadata: Metadata = {
  title: "Age Calculator — Find Your Exact Age in Years, Months & Days",
  description:
    "Free age calculator. Find your exact age in years, months, days, hours, and minutes. Calculate age from date of birth and find days until your next birthday.",
  keywords: [
    "age calculator",
    "age calculator from date of birth",
    "exact age calculator",
    "date of birth age calculator",
    "how old am I calculator",
    "birthday calculator",
    "age in days calculator",
  ],
  openGraph: {
    title: "Age Calculator — Exact Age from Date of Birth | IndianBusinessTools",
    description:
      "Calculate your exact age in years, months, days, and hours from your date of birth.",
    url: "https://www.indiabusinesstools.com/age-calculator",
  },
  alternates: { canonical: "/age-calculator" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Age Calculator",
  url: "https://www.indiabusinesstools.com/age-calculator",
  description: "Calculate exact age in years, months, days, and hours from date of birth.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Organization", name: "IndianBusinessTools" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={schema} />
      <ToolSchemas slug="age-calculator" name="Age Calculator" category="Utility Tools" categorySlug="utility" />
      {children}
    </>
  );
}
