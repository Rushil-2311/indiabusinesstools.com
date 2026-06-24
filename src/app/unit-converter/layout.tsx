import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { ToolSchemas } from "@/components/seo/ToolSchemas";

export const metadata: Metadata = {
  title: 'Unit Converter',
  description: 'Convert weight, length, volume, temperature and area units including Indian units like Tola, Maund, Bigha. Free online unit converter.',
  keywords: ['unit converter India', 'tola to gram converter', 'maund to kg', 'bigha to acre', 'weight length converter India'],
  alternates: { canonical: '/unit-converter' },
  openGraph: {
    title: 'Unit Converter — Weight, Length, Volume, Temperature | IndianBusinessTools',
    description: 'Convert between metric, imperial and traditional Indian units. Tola, Maund, Bigha and more.',
    url: 'https://www.indiabusinesstools.com/unit-converter',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Unit Converter',
  description: 'Convert units of weight, length, volume, temperature including Indian traditional units.',
  url: 'https://www.indiabusinesstools.com/unit-converter',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function UnitConverterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={schema} />
      <ToolSchemas slug="unit-converter" name="Unit Converter" category="Utility Tools" categorySlug="utility" />
      {children}
    </>
  );
}
