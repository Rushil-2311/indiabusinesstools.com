import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { ToolSchemas } from "@/components/seo/ToolSchemas";

export const metadata: Metadata = {
  title: 'PPF Calculator India — Public Provident Fund Returns 2025',
  description: 'Free PPF Calculator for India. Calculate Public Provident Fund maturity with year-by-year interest breakdown at 7.1% rate. See EEE tax benefits and partial withdrawal rules.',
  keywords: ['PPF calculator India', 'public provident fund calculator', 'PPF maturity calculator', 'PPF interest rate 2025', 'PPF 15 year returns', 'tax free investment India'],
  alternates: { canonical: '/ppf-calculator' },
  openGraph: {
    title: 'PPF Calculator India — Public Provident Fund Returns 2025 | IndianBusinessTools',
    description: 'Calculate your PPF maturity and interest at current 7.1% rate. See year-by-year growth, EEE tax benefits, and loan eligibility.',
    url: 'https://www.indiabusinesstools.com/ppf-calculator',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PPF Calculator India — Public Provident Fund Returns 2025',
  description: 'Calculate PPF maturity amount and yearly interest breakdown.',
  url: 'https://www.indiabusinesstools.com/ppf-calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  provider: { '@type': 'Organization', name: 'IndianBusinessTools' },
  featureList: [
    '15-year PPF maturity calculation',
    'Year-by-year interest breakdown',
    'EEE tax benefit explanation',
    'Partial withdrawal eligibility',
    'Loan against PPF calculation',
    'Extension beyond 15 years',
  ],
};

export default function PPFCalculatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={schema} />
      <ToolSchemas slug="ppf-calculator" name="PPF Calculator" category="Finance & Investments" categorySlug="finance" />
      {children}
    </>
  );
}
