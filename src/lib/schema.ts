const BASE_URL = "https://www.indiabusinesstools.com";

export function generateFaqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ name, url }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: url,
    })),
  };
}

export function toolBreadcrumbs(
  toolName: string,
  slug: string,
  categoryName: string,
  categorySlug: string
) {
  return generateBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: categoryName, url: `${BASE_URL}/?category=${categorySlug}` },
    { name: toolName, url: `${BASE_URL}/${slug}` },
  ]);
}
