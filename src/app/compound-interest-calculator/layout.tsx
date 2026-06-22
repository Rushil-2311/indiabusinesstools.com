import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Compound Interest Calculator',
  description: 'Calculate compound interest with daily, monthly, quarterly, half-yearly and yearly compounding. Compare simple vs compound interest. Free online CI calculator.',
  keywords: ['compound interest calculator', 'CI calculator India', 'monthly compounding calculator', 'simple vs compound interest', 'compound interest formula'],
  alternates: { canonical: '/compound-interest-calculator' },
  openGraph: {
    title: 'Compound Interest Calculator — Monthly, Quarterly, Yearly | IndianBusinessTools',
    description: 'Calculate compound interest with any compounding frequency. Compare simple vs compound interest with year-by-year growth.',
    url: 'https://www.indiabusinesstools.com/compound-interest-calculator',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Compound Interest Calculator',
  description: 'Calculate compound interest with multiple compounding frequencies and year-by-year breakdown.',
  url: 'https://www.indiabusinesstools.com/compound-interest-calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function CompoundInterestLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={schema} />
      {children}
    </>
  );
}
