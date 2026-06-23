import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Salary Slip Generator',
  description: 'Generate professional salary slips with company logo, earnings, deductions and net pay. Download as PDF. Free online salary slip maker for India.',
  keywords: ['salary slip generator India', 'payslip generator', 'salary slip PDF download', 'online salary slip maker', 'payslip format India'],
  alternates: { canonical: '/salary-slip-generator' },
  openGraph: {
    title: 'Salary Slip Generator — Professional Payslip with Logo | IndianBusinessTools',
    description: 'Generate professional salary slips with company branding, earnings/deductions breakdown and PDF download.',
    url: 'https://www.indiabusinesstools.com/salary-slip-generator',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Salary Slip Generator',
  description: 'Generate professional salary slips with company logo and PDF download.',
  url: 'https://www.indiabusinesstools.com/salary-slip-generator',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function SalarySlipLayout({ children }: { children: React.ReactNode }) {
  return <><JsonLd schema={schema} />{children}</>;
}
