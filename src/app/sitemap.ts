// app/sitemap.ts
// Next.js 13+ App Router — auto-served at /sitemap.xml

import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://indiabusinesstools.vercel.app'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

interface SitemapEntry {
  url: string
  lastModified?: Date | string
  changeFrequency?: ChangeFreq
  priority?: number
}

// ─────────────────────────────────────────────
// Static Routes
// Define all your static pages here
// ─────────────────────────────────────────────
const staticRoutes: SitemapEntry[] = [
  {
    url: '/',
    changeFrequency: 'weekly',
    priority: 1.0, // Highest — homepage
  },
  {
    url: '/about',
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: '/contact',
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    url: '/privacy-policy',
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    url: '/terms-of-service',
    changeFrequency: 'yearly',
    priority: 0.3,
  },
]

// ─────────────────────────────────────────────
// Fetch Dynamic Routes
// Replace these fetch calls with your actual data sources
// (database, CMS, API, filesystem, etc.)
// ─────────────────────────────────────────────

async function getToolRoutes(): Promise<SitemapEntry[]> {
  try {
    // Example: fetch from your API / DB
    // const res = await fetch(`${BASE_URL}/api`, { next: { revalidate: 3600 } })
    // const tools = await res.json()

    // ── Placeholder — replace with real data ──
    const tools = [
      { slug: 'gst-calculator', updatedAt: '2026-01-15' },
      { slug: 'emi-calculator', updatedAt: '2026-02-10' },
      { slug: 'income-tax-calculator', updatedAt: '2026-02-20' },
      { slug: 'profit-loss-calculator', updatedAt: '2026-01-05' },
      { slug: 'tds-calculator', updatedAt: '2026-03-01' },
      { slug: 'compound-interest-calculator', updatedAt: '2026-01-20' },
    ]

    return tools.map((tool) => ({
      url: `/${tool.slug}`,
      lastModified: new Date(tool.updatedAt),
      changeFrequency: 'monthly' as ChangeFreq,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('[Sitemap] Failed to fetch tool routes:', error)
    return [] // Fail gracefully — don't break the build
  }
}

async function getBlogRoutes(): Promise<SitemapEntry[]> {
  try {
    // Example: fetch from CMS (Contentful, Sanity, Notion, etc.)
    // const res = await fetch(`${BASE_URL}/api/blog`, { next: { revalidate: 3600 } })
    // const posts = await res.json()

    // ── Placeholder — replace with real data ──
    const posts = [
      { slug: 'gst-filing-guide-2026', publishedAt: '2026-01-10' },
      { slug: 'how-to-save-income-tax', publishedAt: '2026-02-15' },
      { slug: 'best-accounting-software-india', publishedAt: '2026-03-01' },
    ]

    return posts.map((post) => ({
      url: `/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'monthly' as ChangeFreq,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('[Sitemap] Failed to fetch blog routes:', error)
    return []
  }
}

async function getCategoryRoutes(): Promise<SitemapEntry[]> {
  try {
    const categories = [
      { slug: 'financial', updatedAt: '2026-01-01' },
      { slug: 'tax', updatedAt: '2026-01-01' },
      { slug: 'business', updatedAt: '2026-01-01' },
    ]

    return categories.map((cat) => ({
      url: `/category/${cat.slug}`,
      lastModified: new Date(cat.updatedAt),
      changeFrequency: 'weekly' as ChangeFreq,
      priority: 0.75,
    }))
  } catch (error) {
    console.error('[Sitemap] Failed to fetch category routes:', error)
    return []
  }
}

// ─────────────────────────────────────────────
// Main Sitemap Export
// Next.js calls this and auto-generates /sitemap.xml
// ─────────────────────────────────────────────
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [toolRoutes, blogRoutes] = await Promise.all([
    getToolRoutes(),
    getBlogRoutes(),
    // getCategoryRoutes(),
  ])

  const allStaticRoutes: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route.url}`,
    lastModified: route.lastModified ?? new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  const allDynamicRoutes: MetadataRoute.Sitemap = [
    ...toolRoutes,
    ...blogRoutes,
    // ...categoryRoutes,
  ].map((route) => ({
    url: `${BASE_URL}${route.url}`,
    lastModified: route.lastModified ?? new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  return [...allStaticRoutes, ...allDynamicRoutes]
}