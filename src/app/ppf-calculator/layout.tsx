import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'PPF Calculator',
  description: 'Calculate PPF (Public Provident Fund) maturity amount with year-by-year interest breakdown. Current PPF rate 7.1%. Free online PPF calculator India.',
  keywords: ['PPF calculator', 'public provident fund calculator', 'PPF maturity calculator India', 'PPF interest calculator', 'PPF 2025'],
  alternates: { canonical: '/ppf-calculator' },
  openGraph: {
    title: 'PPF Calculator — Public Provident Fund Returns | IndianBusinessTools',
    description: 'Calculate your PPF maturity, total interest and yearly breakdown at current 7.1% rate.',
    url: 'https://www.indiabusinesstools.com/ppf-calculator',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PPF Calculator',
  description: 'Calculate PPF maturity amount and yearly interest breakdown.',
  url: 'https://www.indiabusinesstools.com/ppf-calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function PPFCalculatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={schema} />
      {children}
    </>
  );
}
