import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { ToolSchemas } from "@/components/seo/ToolSchemas";

export const metadata: Metadata = {
  title: 'PDF Editor — Draw, Annotate, Edit Text & Fill Forms Free Online',
  description: 'Edit PDF files in your browser — draw freehand, add text boxes, highlight, add shapes, erase content, watermark, and fill form fields. No upload required.',
  keywords: ['pdf editor online', 'edit pdf free', 'annotate pdf', 'pdf text editor', 'fill pdf form', 'watermark pdf', 'draw on pdf', 'pdf editor no upload'],
  alternates: { canonical: '/pdf-editor' },
  openGraph: {
    title: 'PDF Editor — Draw, Annotate & Edit PDF Free | IndianBusinessTools',
    description: 'Edit PDF files online for free — draw, annotate, add text, erase content, watermark, and fill forms. All done in your browser.',
    url: 'https://www.indiabusinesstools.com/pdf-editor',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF Editor',
  description: 'Draw, annotate, edit text, fill forms and watermark PDF files — all in your browser.',
  url: 'https://www.indiabusinesstools.com/pdf-editor',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  featureList: [
    'Freehand drawing on PDF',
    'Text annotation',
    'Shape tools (rectangle, circle, arrow)',
    'Highlight tool',
    'Eraser to cover existing content',
    'Text watermark across all pages',
    'AcroForm field filling',
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd schema={schema} /><ToolSchemas slug="pdf-editor" name="PDF Editor" category="Utility Tools" categorySlug="utility" />{children}</>;
}
