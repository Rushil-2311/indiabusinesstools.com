import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { ToolSchemas } from "@/components/seo/ToolSchemas";

export const metadata: Metadata = {
  title: 'CTC to In-Hand Salary Calculator India — HRA, PF & Gratuity Breakdown',
  description: 'Free CTC to in-hand salary calculator for India. Break down your Cost to Company into Basic, HRA, PF, Gratuity, and Special Allowance. Supports metro and non-metro HRA rates.',
  keywords: ['CTC calculator India', 'CTC to in-hand salary', 'salary breakdown calculator', 'in-hand salary calculator', 'HRA PF gratuity calculator', 'take home salary calculator India'],
  alternates: { canonical: '/ctc-calculator' },
  openGraph: {
    title: 'CTC to In-Hand Salary Calculator India | IndianBusinessTools',
    description: 'Convert your CTC to monthly in-hand salary. See Basic, HRA, PF, Gratuity, standard deduction and all components.',
    url: 'https://www.indiabusinesstools.com/ctc-calculator',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CTC to In-Hand Salary Calculator India',
  description: 'Calculate in-hand salary from CTC with full component breakdown including HRA, PF, gratuity, and deductions.',
  url: 'https://www.indiabusinesstools.com/ctc-calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  provider: { '@type': 'Organization', name: 'IndianBusinessTools' },
  featureList: [
    'CTC to gross salary conversion',
    'Basic, HRA, PF, Gratuity breakdown',
    'Metro and non-metro HRA calculation',
    'Employee and employer PF split',
    'Standard deduction applied',
    'Monthly and annual view',
  ],
};

export default function CTCCalculatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={schema} />
      <ToolSchemas slug="ctc-calculator" name="Salary / CTC Calculator" category="Tax & Payroll" categorySlug="tax" />
      {children}
    </>
  );
}
