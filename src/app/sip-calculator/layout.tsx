import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolSchemas } from "@/components/seo/ToolSchemas";

export const metadata: Metadata = {
  title: "SIP Calculator — Calculate Mutual Fund Returns & Corpus",
  description:
    "Free SIP Calculator for India. Calculate mutual fund returns with step-up SIP and inflation adjustment. Instantly see your projected corpus, total investment, and wealth gained.",
  keywords: [
    "SIP calculator India",
    "mutual fund SIP calculator",
    "SIP return calculator",
    "step-up SIP calculator",
    "systematic investment plan calculator",
    "SIP maturity calculator",
    "SIP investment calculator online",
  ],
  openGraph: {
    title: "SIP Calculator — Calculate Mutual Fund Returns | IndianBusinessTools",
    description:
      "Calculate SIP returns instantly. See projected corpus, wealth gained, and growth chart for any monthly investment amount.",
    url: "https://www.indiabusinesstools.com/sip-calculator",
  },
  alternates: { canonical: "/sip-calculator" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SIP Calculator",
  url: "https://www.indiabusinesstools.com/sip-calculator",
  description:
    "Calculate SIP returns for mutual fund investments with step-up and inflation adjustment.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  provider: { "@type": "Organization", name: "IndianBusinessTools" },
  featureList: [
    "Monthly SIP calculation",
    "Step-up SIP support",
    "Inflation adjustment",
    "Wealth gain visualization",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={schema} />
      <ToolSchemas slug="sip-calculator" name="SIP Calculator" category="Finance & Investments" categorySlug="finance" />
      {children}
    </>
  );
}
