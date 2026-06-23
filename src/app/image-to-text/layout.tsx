import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Image to Text (OCR) — Free Online Tool',
  description: 'Extract text from images online using OCR. Supports JPG, PNG, and scanned documents. Free image to text converter — works in your browser.',
  keywords: ['image to text', 'ocr online', 'extract text from image', 'image text extractor', 'ocr tool'],
  alternates: { canonical: '/image-to-text' },
  openGraph: {
    title: 'Image to Text (OCR) | IndianBusinessTools',
    description: 'Extract text from images using OCR — works entirely in your browser.',
    url: 'https://www.indiabusinesstools.com/image-to-text',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Image to Text (OCR)',
  description: 'Extract text from images using OCR.',
  url: 'https://www.indiabusinesstools.com/image-to-text',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd schema={schema} />{children}</>;
}
