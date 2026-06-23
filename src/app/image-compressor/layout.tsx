import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Image Compressor & Resizer — Free Online Tool',
  description: 'Compress and resize images online without losing quality. Supports JPG, PNG, WebP. Reduce file size instantly in your browser.',
  keywords: ['image compressor', 'image resizer', 'compress image online', 'resize image online', 'reduce image size'],
  alternates: { canonical: '/image-compressor' },
  openGraph: {
    title: 'Image Compressor & Resizer | IndianBusinessTools',
    description: 'Compress and resize images online — JPG, PNG, WebP. No upload to server.',
    url: 'https://www.indiabusinesstools.com/image-compressor',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Image Compressor & Resizer',
  description: 'Compress and resize images online.',
  url: 'https://www.indiabusinesstools.com/image-compressor',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd schema={schema} />{children}</>;
}
