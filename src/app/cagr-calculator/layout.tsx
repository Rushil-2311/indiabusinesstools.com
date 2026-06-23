import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'CAGR Calculator',
  description: 'Calculate Compound Annual Growth Rate (CAGR) for your investments. Find future value at a target CAGR. Free CAGR calculator India.',
  keywords: ['CAGR calculator', 'compound annual growth rate', 'investment return calculator India', 'CAGR formula', 'future value calculator'],
  alternates: { canonical: '/cagr-calculator' },
  openGraph: {
    title: 'CAGR Calculator — Compound Annual Growth Rate | IndianBusinessTools',
    description: 'Calculate CAGR for investments or find future value at a target growth rate.',
    url: 'https://www.indiabusinesstools.com/cagr-calculator',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CAGR Calculator',
  description: 'Calculate Compound Annual Growth Rate for investments.',
  url: 'https://www.indiabusinesstools.com/cagr-calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function CAGRLayout({ children }: { children: React.ReactNode }) {
  return <><JsonLd schema={schema} />{children}</>;
}
