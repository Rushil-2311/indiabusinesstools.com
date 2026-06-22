import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "GST Calculator — Add or Remove GST for All Tax Slabs",
  description:
    "Free GST Calculator for India. Add GST or reverse-calculate (remove) GST from any price. Supports all GST slabs: 5%, 12%, 18%, 28%. Shows CGST + SGST breakdown for intra-state transactions.",
  keywords: [
    "GST calculator India",
    "GST calculator online",
    "add GST calculator",
    "remove GST calculator",
    "reverse GST calculator",
    "CGST SGST calculator",
    "18 percent GST calculator",
    "GST inclusive price calculator",
  ],
  openGraph: {
    title: "GST Calculator — Add or Remove GST | IndianBusinessTools",
    description:
      "Instantly calculate GST for 5%, 12%, 18%, 28% slabs. Add GST to a price or remove it. Shows CGST and SGST breakdown.",
    url: "https://www.indiabusinesstools.com/gst-calculator",
  },
  alternates: { canonical: "/gst-calculator" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GST Calculator",
  url: "https://www.indiabusinesstools.com/gst-calculator",
  description:
    "Add or remove GST from prices with all Indian tax slabs and CGST/SGST breakdown.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Organization", name: "IndianBusinessTools" },
  featureList: [
    "Add GST to price",
    "Remove GST (reverse calculation)",
    "All GST slabs: 5%, 12%, 18%, 28%",
    "CGST and SGST breakdown",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={schema} />
      {children}
    </>
  );
}
