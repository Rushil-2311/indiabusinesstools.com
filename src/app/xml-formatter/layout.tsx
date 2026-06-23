import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'XML Formatter & Beautifier — Free Online Tool',
  description: 'Beautify, format and minify XML online. Validate XML structure and pretty-print with indentation. Free XML formatter.',
  keywords: ['xml formatter', 'xml beautifier', 'xml prettifier', 'format xml online', 'xml minifier'],
  alternates: { canonical: '/xml-formatter' },
  openGraph: {
    title: 'XML Formatter & Beautifier | IndianBusinessTools',
    description: 'Beautify, format and minify XML online with validation.',
    url: 'https://www.indiabusinesstools.com/xml-formatter',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'XML Formatter',
  description: 'Format, beautify and minify XML online.',
  url: 'https://www.indiabusinesstools.com/xml-formatter',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd schema={schema} />{children}</>;
}
