import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'FD Calculator',
  description: 'Calculate Fixed Deposit maturity amount and interest with SBI, HDFC, ICICI, Axis Bank rate presets. Free FD calculator for India.',
  keywords: ['FD calculator', 'fixed deposit calculator India', 'SBI FD rates', 'HDFC FD calculator', 'bank FD interest calculator'],
  alternates: { canonical: '/fd-calculator' },
  openGraph: {
    title: 'FD Calculator — Fixed Deposit Maturity & Interest | IndianBusinessTools',
    description: 'Calculate your Fixed Deposit returns with SBI, HDFC, ICICI rate presets. See maturity amount and year-by-year breakdown.',
    url: 'https://www.indiabusinesstools.com/fd-calculator',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'FD Calculator',
  description: 'Calculate Fixed Deposit maturity amount and interest with Indian bank rate presets.',
  url: 'https://www.indiabusinesstools.com/fd-calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function FDCalculatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={schema} />
      {children}
    </>
  );
}
