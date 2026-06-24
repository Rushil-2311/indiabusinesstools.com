import Link from "next/link";
import { toolsData, toolCategories } from "@/lib/data";

interface RelatedToolsProps {
  currentSlug: string;
}

export function RelatedTools({ currentSlug }: RelatedToolsProps) {
  const category = Object.values(toolCategories).find((cat) =>
    cat.slugs.includes(currentSlug)
  );
  if (!category) return null;

  const relatedSlugs = category.slugs
    .filter((s) => s !== currentSlug)
    .slice(0, 4);
  const related = toolsData.filter((t) => relatedSlugs.includes(t.slug));
  if (related.length === 0) return null;

  return (
    <div className="mt-16 border-t">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-12 pb-16">
      <h2 className="text-xl font-bold mb-6">
        More {category.label} Tools
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="group flex flex-col items-center gap-3 p-4 rounded-xl border bg-card hover:border-primary/40 hover:shadow-md transition-all text-center"
            >
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${tool.gradient} text-white shadow-sm`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-foreground leading-snug group-hover:text-primary transition-colors">
                {tool.name}
              </span>
            </Link>
          );
        })}
      </div>
      </div>
    </div>
  );
}
