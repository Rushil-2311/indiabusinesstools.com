import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, User, Tag } from 'lucide-react';
import { blogPosts, ContentBlock } from '@/lib/blogData';
import { Badge } from '@/components/ui/badge';
import { JsonLd } from '@/components/seo/JsonLd';
import type { Metadata } from 'next';

const BASE_URL = 'https://indianbusinesstools.com';

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    keywords: [post.category, 'IndianBusinessTools', 'finance guide India', post.title.split(' ').slice(0, 4).join(' ')],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${BASE_URL}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: [post.category],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

function renderBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case 'heading':
      return (
        <h2 key={index} className="text-2xl font-bold text-foreground mt-10 mb-4 font-display">
          {block.text}
        </h2>
      );
    case 'paragraph':
      return (
        <p key={index} className="text-muted-foreground leading-relaxed mb-5 text-base">
          {block.text}
        </p>
      );
    case 'bullets':
      return (
        <ul key={index} className="space-y-2 mb-5 ml-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-muted-foreground text-base">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      );
    case 'callout':
      return (
        <div key={index} className="my-6 rounded-xl border border-primary/20 bg-primary/5 p-5">
          {block.text.split('\n').map((line, i) => (
            <p key={i} className={`text-sm leading-relaxed ${i === 0 ? 'font-semibold text-foreground' : 'text-muted-foreground mt-1'}`}>
              {line}
            </p>
          ))}
        </div>
      );
    case 'table':
      return (
        <div key={index} className="my-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                {block.headers.map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Organization", name: post.author, url: BASE_URL },
    publisher: { "@type": "Organization", name: "IndianBusinessTools", url: BASE_URL },
    datePublished: post.date,
    url: `${BASE_URL}/blog/${post.slug}`,
    articleSection: post.category,
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd schema={articleSchema} />
      {/* Hero */}
      <div className={`bg-linear-to-br ${post.gradient} py-20 px-4`}>
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
          <div className="mb-5">
            <Badge className="bg-white/20 text-white border-none backdrop-blur-sm shadow-none hover:bg-white/30">
              {post.category}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white leading-tight mb-6">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" /> {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Tag className="h-4 w-4" /> {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {post.readTime}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-12 mb-12">
        <div className="prose-container">
          {post.content.map((block, i) => renderBlock(block, i))}
        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> All Articles
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-primary hover:underline"
          >
            Explore Our Tools →
          </Link>
        </div>
      </div>
    </div>
  );
}
