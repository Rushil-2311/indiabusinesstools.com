import { JsonLd } from "./JsonLd";
import { faqs } from "@/lib/data";
import { generateFaqSchema, generateBreadcrumbSchema } from "@/lib/schema";

const BASE_URL = "https://www.indiabusinesstools.com";

interface ToolSchemasProps {
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
}

export function ToolSchemas({ slug, name, category, categorySlug }: ToolSchemasProps) {
  const toolFaqs = faqs[slug];
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: category, url: `${BASE_URL}/?category=${categorySlug}` },
    { name, url: `${BASE_URL}/${slug}` },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      {toolFaqs && <JsonLd schema={generateFaqSchema(toolFaqs)} />}
    </>
  );
}
