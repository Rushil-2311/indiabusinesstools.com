import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { ToolSchemas } from "@/components/seo/ToolSchemas";

export const metadata: Metadata = {
  title: 'PDF Tools — Merge, Split & Compress PDF Free Online',
  description: 'Merge multiple PDFs into one, split a PDF into pages, or compress PDF size. All free, all in your browser — no upload to server.',
  keywords: ['pdf merger', 'pdf splitter', 'pdf compressor', 'merge pdf online', 'split pdf online', 'compress pdf online'],
  alternates: { canonical: '/pdf-tools' },
  openGraph: {
    title: 'PDF Tools — Merge, Split & Compress | IndianBusinessTools',
    description: 'Merge, split and compress PDFs online — all done in your browser.',
    url: 'https://www.indiabusinesstools.com/pdf-tools',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF Tools',
  description: 'Merge, split and compress PDF files online.',
  url: 'https://www.indiabusinesstools.com/pdf-tools',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd schema={schema} /><ToolSchemas slug="pdf-tools" name="PDF Tools" category="Utility Tools" categorySlug="utility" />{children}</>;
}
