import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { ToolSchemas } from "@/components/seo/ToolSchemas";

export const metadata: Metadata = {
  title: 'Color Picker & Converter',
  description: 'Convert colors between HEX, RGB and HSL formats instantly. Pick colors, generate shades/tints and copy color codes. Free online color converter.',
  keywords: ['color converter', 'hex to rgb converter', 'rgb to hsl', 'color picker online', 'hex color code converter'],
  alternates: { canonical: '/color-converter' },
  openGraph: {
    title: 'Color Picker & Converter — HEX, RGB, HSL | IndianBusinessTools',
    description: 'Convert HEX to RGB, RGB to HSL and more. Generate color palettes and copy codes instantly.',
    url: 'https://www.indiabusinesstools.com/color-converter',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Color Picker & Converter',
  description: 'Convert colors between HEX, RGB and HSL with palette generation.',
  url: 'https://www.indiabusinesstools.com/color-converter',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function ColorConverterLayout({ children }: { children: React.ReactNode }) {
  return <><JsonLd schema={schema} /><ToolSchemas slug="color-converter" name="Color Converter" category="Developer Tools" categorySlug="developer" />{children}</>;
}
