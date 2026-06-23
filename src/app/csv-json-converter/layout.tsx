import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'CSV ↔ JSON Converter',
  description: 'Convert CSV to JSON or JSON to CSV online instantly. Supports custom delimiters, table preview and download. Free developer tool.',
  keywords: ['CSV to JSON converter', 'JSON to CSV converter', 'CSV JSON online tool', 'convert CSV to JSON free', 'developer tools India'],
  alternates: { canonical: '/csv-json-converter' },
  openGraph: {
    title: 'CSV ↔ JSON Converter — Free Online Tool | IndianBusinessTools',
    description: 'Convert CSV to JSON or JSON to CSV instantly. Custom delimiters, table preview and copy/download.',
    url: 'https://www.indiabusinesstools.com/csv-json-converter',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CSV ↔ JSON Converter',
  description: 'Convert between CSV and JSON formats with table preview.',
  url: 'https://www.indiabusinesstools.com/csv-json-converter',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function CSVJSONLayout({ children }: { children: React.ReactNode }) {
  return <><JsonLd schema={schema} />{children}</>;
}
