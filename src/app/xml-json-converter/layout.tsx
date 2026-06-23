import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'XML ↔ JSON Converter — Free Online Tool',
  description: 'Convert XML to JSON or JSON to XML instantly. Upload a file or paste your data. Free online XML JSON converter with file upload support.',
  keywords: ['xml to json', 'json to xml', 'xml json converter', 'convert xml online', 'online xml converter'],
  alternates: { canonical: '/xml-json-converter' },
  openGraph: {
    title: 'XML ↔ JSON Converter | IndianBusinessTools',
    description: 'Convert XML to JSON or JSON to XML instantly with file upload support.',
    url: 'https://www.indiabusinesstools.com/xml-json-converter',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'XML ↔ JSON Converter',
  description: 'Convert XML to JSON or JSON to XML instantly.',
  url: 'https://www.indiabusinesstools.com/xml-json-converter',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd schema={schema} />{children}</>;
}
