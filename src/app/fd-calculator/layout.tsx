import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { ToolSchemas } from "@/components/seo/ToolSchemas";

export const metadata: Metadata = {
  title: 'FD Calculator India — Fixed Deposit Maturity & Interest Calculator',
  description: 'Free Fixed Deposit calculator for India. Calculate FD maturity amount and interest with SBI, HDFC, ICICI, Axis Bank rate presets. See year-by-year growth and TDS impact.',
  keywords: ['FD calculator India', 'fixed deposit calculator', 'SBI FD calculator', 'HDFC FD rates', 'bank FD interest calculator', 'FD maturity calculator', 'fixed deposit interest calculator'],
  alternates: { canonical: '/fd-calculator' },
  openGraph: {
    title: 'FD Calculator India — Fixed Deposit Maturity & Interest | IndianBusinessTools',
    description: 'Calculate your Fixed Deposit returns with SBI, HDFC, ICICI rate presets. See maturity amount and year-by-year breakdown.',
    url: 'https://www.indiabusinesstools.com/fd-calculator',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'FD Calculator India — Fixed Deposit Maturity & Interest Calculator',
  description: 'Calculate Fixed Deposit maturity amount and interest with Indian bank rate presets.',
  url: 'https://www.indiabusinesstools.com/fd-calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  provider: { '@type': 'Organization', name: 'IndianBusinessTools' },
  featureList: [
    'SBI, HDFC, ICICI bank rate presets',
    'Simple and compound interest modes',
    'Senior citizen rate support',
    'Year-by-year interest breakdown',
    'TDS impact calculation',
  ],
};

export default function FDCalculatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={schema} />
      <ToolSchemas slug="fd-calculator" name="FD Calculator" category="Finance & Investments" categorySlug="finance" />
      {children}
    </>
  );
}
