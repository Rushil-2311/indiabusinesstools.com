import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'ZIP Extractor — Extract ZIP Files Online Free',
  description: 'Extract and preview files inside ZIP archives online. No software needed — works entirely in your browser. Free ZIP file extractor.',
  keywords: ['zip extractor', 'unzip online', 'extract zip online', 'zip file opener', 'online zip extractor'],
  alternates: { canonical: '/zip-extractor' },
  openGraph: {
    title: 'ZIP Extractor | IndianBusinessTools',
    description: 'Extract and download files from ZIP archives in your browser.',
    url: 'https://www.indiabusinesstools.com/zip-extractor',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'ZIP Extractor',
  description: 'Extract ZIP files online in your browser.',
  url: 'https://www.indiabusinesstools.com/zip-extractor',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd schema={schema} />{children}</>;
}
