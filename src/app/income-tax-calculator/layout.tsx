import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Income Tax Calculator FY 2025-26',
  description: 'Calculate income tax for FY 2025-26. Compare new vs old tax regime, see slab-wise breakdown and find which regime saves you more tax. Free India income tax calculator.',
  keywords: ['income tax calculator India 2025', 'new vs old tax regime calculator', 'FY 2025-26 tax calculator', 'income tax slab India', 'tax regime comparison'],
  alternates: { canonical: '/income-tax-calculator' },
  openGraph: {
    title: 'Income Tax Calculator FY 2025-26 — New vs Old Regime | IndianBusinessTools',
    description: 'Compare new and old tax regime for FY 2025-26. Get slab-wise breakdown and find which regime saves more.',
    url: 'https://www.indiabusinesstools.com/income-tax-calculator',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Income Tax Calculator FY 2025-26',
  description: 'Compare new vs old tax regime for FY 2025-26 with slab-wise breakdown.',
  url: 'https://www.indiabusinesstools.com/income-tax-calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function IncomeTaxLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={schema} />
      {children}
    </>
  );
}
