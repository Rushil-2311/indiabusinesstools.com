import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Java Code Formatter — Free Online Tool',
  description: 'Format and beautify Java code online. Auto-indent, fix spacing and clean up Java source code instantly. Free Java formatter.',
  keywords: ['java formatter', 'java code formatter', 'format java online', 'java beautifier', 'java code beautifier'],
  alternates: { canonical: '/java-formatter' },
  openGraph: {
    title: 'Java Code Formatter | IndianBusinessTools',
    description: 'Format and beautify Java source code online instantly.',
    url: 'https://www.indiabusinesstools.com/java-formatter',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Java Formatter',
  description: 'Format and beautify Java code online.',
  url: 'https://www.indiabusinesstools.com/java-formatter',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd schema={schema} />{children}</>;
}
