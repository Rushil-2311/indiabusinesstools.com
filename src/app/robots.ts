// app/robots.ts
// Auto-served at /robots.txt — always pair with sitemap

import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://indiabusinesstools.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all bots — including AI crawlers (GPTBot, Claude, Gemini, etc.)
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',         // Never index API routes
          '/admin/',       // Never index admin panel
          '/_next/',       // Never index Next.js internals
          '/private/',     // Any private routes
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}