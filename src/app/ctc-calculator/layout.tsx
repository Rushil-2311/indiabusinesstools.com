import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Salary / CTC Calculator',
  description: 'Calculate your in-hand salary from CTC. Break down CTC into Basic, HRA, PF, Gratuity, and Special Allowance. Free salary calculator for India.',
  keywords: ['CTC calculator India', 'salary calculator', 'in-hand salary calculator', 'CTC to take home salary', 'HRA PF gratuity calculator'],
  alternates: { canonical: '/ctc-calculator' },
  openGraph: {
    title: 'Salary / CTC Calculator — In-hand Salary Breakdown | IndianBusinessTools',
    description: 'Convert your CTC to monthly in-hand salary. See Basic, HRA, PF, Gratuity and all deductions.',
    url: 'https://www.indiabusinesstools.com/ctc-calculator',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Salary / CTC Calculator',
  description: 'Calculate in-hand salary from CTC with full component breakdown.',
  url: 'https://www.indiabusinesstools.com/ctc-calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function CTCCalculatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={schema} />
      {children}
    </>
  );
}
