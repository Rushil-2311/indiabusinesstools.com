import Link from "next/link";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { blogPosts } from "@/lib/blogData";

export default function Blog() {
  return (
    <>
      <PageHeader
        title="IndianBusinessTools Blog"
        description="Guides, tutorials, and financial insights to help you make the most of our tools."
        icon={BookOpen}
        gradient="from-primary to-accent"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <article className="bg-card border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                <div
                  className={`h-48 bg-linear-to-br ${post.gradient} p-6 flex flex-col justify-end relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white hover:bg-white/30 w-max border-none backdrop-blur-sm mb-2 shadow-none relative z-10"
                  >
                    {post.category}
                  </Badge>
                </div>
                <div className="p-6 flex flex-col grow">
                  <div className="flex items-center text-xs text-muted-foreground mb-3 gap-3">
                    <span>{post.date}</span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 grow line-clamp-3">
                    {post.excerpt}
                  </p>
                  <span className="flex items-center text-primary font-medium text-sm mt-auto gap-1 group-hover:gap-2 transition-all">
                    Read More <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
