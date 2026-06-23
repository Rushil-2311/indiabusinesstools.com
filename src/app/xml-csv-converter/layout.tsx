import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'XML ↔ CSV Converter — Free Online Tool',
  description: 'Convert XML to CSV or CSV to XML instantly. Upload a file or paste your data. Free online XML CSV converter.',
  keywords: ['xml to csv', 'csv to xml', 'xml csv converter', 'convert xml to csv online'],
  alternates: { canonical: '/xml-csv-converter' },
  openGraph: {
    title: 'XML ↔ CSV Converter | IndianBusinessTools',
    description: 'Convert XML to CSV or CSV to XML instantly with file upload support.',
    url: 'https://www.indiabusinesstools.com/xml-csv-converter',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'XML ↔ CSV Converter',
  description: 'Convert XML to CSV or CSV to XML instantly.',
  url: 'https://www.indiabusinesstools.com/xml-csv-converter',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd schema={schema} />{children}</>;
}
