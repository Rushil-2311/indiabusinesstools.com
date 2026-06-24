import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolSchemas } from "@/components/seo/ToolSchemas";

export const metadata: Metadata = {
  title: "EMI Calculator — Loan EMI & Amortization Schedule",
  description:
    "Free EMI Calculator for India. Calculate your home loan, car loan, or personal loan EMI instantly. Get a full amortization schedule showing principal vs interest breakdown every month.",
  keywords: [
    "EMI calculator India",
    "home loan EMI calculator",
    "loan EMI calculator",
    "amortization schedule",
    "personal loan EMI",
    "car loan EMI calculator",
    "equated monthly installment calculator",
  ],
  openGraph: {
    title: "EMI Calculator — Loan EMI & Amortization Schedule | IndianBusinessTools",
    description:
      "Calculate your loan EMI and get a full amortization schedule. Works for home loans, car loans, and personal loans.",
    url: "https://www.indiabusinesstools.com/emi-calculator",
  },
  alternates: { canonical: "/emi-calculator" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "EMI Calculator",
  url: "https://www.indiabusinesstools.com/emi-calculator",
  description:
    "Calculate loan EMI and get a detailed amortization schedule for home, car, and personal loans.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Organization", name: "IndianBusinessTools" },
  featureList: [
    "EMI calculation",
    "Amortization schedule",
    "Total interest payable",
    "Principal vs interest chart",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={schema} />
      <ToolSchemas slug="emi-calculator" name="EMI Calculator" category="Finance & Investments" categorySlug="finance" />
      {children}
    </>
  );
}
