import { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/blogData';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.indiabusinesstools.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/disclaimer`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const toolPages: MetadataRoute.Sitemap = [
    'sip-calculator',
    'emi-calculator',
    'gst-calculator',
    'percentage-calculator',
    'age-calculator',
    'text-case-converter',
    'json-formatter',
    'image-converter',
    'markdown-converter',
    'qr-code-generator',
    'word-counter',
    'base64-tool',
    'fd-calculator',
    'ppf-calculator',
    'income-tax-calculator',
    'ctc-calculator',
    'compound-interest-calculator',
    'unit-converter',
    'invoice-generator',
    'cagr-calculator',
    'loan-eligibility-calculator',
    'color-converter',
    'csv-json-converter',
    'salary-slip-generator',
    'xml-json-converter',
    'xml-csv-converter',
    'xml-formatter',
    'sql-formatter',
    'java-formatter',
    'image-compressor',
    'image-to-text',
    'pdf-tools',
    'zip-extractor',
  ].map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...toolPages, ...blogPages];
}
