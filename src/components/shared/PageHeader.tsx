import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  gradient?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export function PageHeader({ title, description, icon: Icon, gradient = "from-primary to-accent", breadcrumbs }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-card border-b py-14 mb-8">
      {/* Decorative background elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

      <div className="mx-auto max-w-4xl px-4 text-center relative z-10">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-6 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-3 h-3" />
              <span>Home</span>
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight className="w-3 h-3 opacity-40" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-primary transition-colors">{crumb.name}</Link>
                ) : (
                  <span className="text-foreground font-medium">{crumb.name}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {Icon && (
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-xl shadow-primary/10 inline-block`}>
              <Icon className="w-8 h-8" />
            </div>
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight mb-4">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
