import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Loan Eligibility Calculator',
  description: 'Calculate your maximum loan eligibility based on salary, existing EMIs and tenure. Check home loan, personal loan and car loan eligibility. Free India loan calculator.',
  keywords: ['loan eligibility calculator India', 'home loan eligibility', 'personal loan eligibility calculator', 'max loan amount calculator', 'FOIR calculator India'],
  alternates: { canonical: '/loan-eligibility-calculator' },
  openGraph: {
    title: 'Loan Eligibility Calculator — Home, Personal & Car Loan | IndianBusinessTools',
    description: 'Find your maximum loan amount based on net salary, existing EMIs and bank FOIR norms.',
    url: 'https://www.indiabusinesstools.com/loan-eligibility-calculator',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Loan Eligibility Calculator',
  description: 'Calculate maximum loan eligibility based on salary and existing obligations.',
  url: 'https://www.indiabusinesstools.com/loan-eligibility-calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function LoanEligibilityLayout({ children }: { children: React.ReactNode }) {
  return <><JsonLd schema={schema} />{children}</>;
}
