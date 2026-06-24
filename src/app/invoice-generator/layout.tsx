import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { ToolSchemas } from "@/components/seo/ToolSchemas";

export const metadata: Metadata = {
  title: 'GST Invoice Generator',
  description: 'Create GST-ready invoices online. Auto-calculates CGST, SGST and IGST. Download as PDF. Free invoice generator for Indian freelancers and businesses.',
  keywords: ['GST invoice generator', 'invoice maker India', 'CGST SGST invoice', 'free invoice generator India', 'online invoice PDF India'],
  alternates: { canonical: '/invoice-generator' },
  openGraph: {
    title: 'GST Invoice Generator — Free PDF Invoice Maker | IndianBusinessTools',
    description: 'Create professional GST invoices with CGST/SGST/IGST. Download PDF instantly. Free for Indian businesses and freelancers.',
    url: 'https://www.indiabusinesstools.com/invoice-generator',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'GST Invoice Generator',
  description: 'Create GST-ready invoices with CGST/SGST/IGST and download as PDF.',
  url: 'https://www.indiabusinesstools.com/invoice-generator',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function InvoiceGeneratorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd schema={schema} />
      <ToolSchemas slug="invoice-generator" name="Invoice Generator" category="Tax & Payroll" categorySlug="tax" />
      {children}
    </>
  );
}
