import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'SQL Formatter & Beautifier — Free Online Tool',
  description: 'Format and beautify SQL queries online. Supports MySQL, PostgreSQL, SQLite, and more. Free SQL formatter with syntax highlighting.',
  keywords: ['sql formatter', 'sql beautifier', 'format sql online', 'sql query formatter', 'mysql formatter'],
  alternates: { canonical: '/sql-formatter' },
  openGraph: {
    title: 'SQL Formatter & Beautifier | IndianBusinessTools',
    description: 'Format SQL queries for MySQL, PostgreSQL, SQLite and more.',
    url: 'https://www.indiabusinesstools.com/sql-formatter',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SQL Formatter',
  description: 'Format and beautify SQL queries online.',
  url: 'https://www.indiabusinesstools.com/sql-formatter',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd schema={schema} />{children}</>;
}
