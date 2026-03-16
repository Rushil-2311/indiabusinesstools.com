interface PageHeaderProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  gradient?: string;
}

export function PageHeader({ title, description, icon: Icon, gradient = "from-primary to-accent" }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-card border-b py-16 mb-8">
      {/* Decorative background elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="mx-auto max-w-4xl px-4 text-center relative z-10">
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
