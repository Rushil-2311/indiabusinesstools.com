import Link from "next/link";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";

const blogPosts = [
  {
    id: 1,
    title: "How to Calculate SIP Returns: A Complete Guide",
    excerpt:
      "Understand the math behind systematic investment plans and how compounding works in your favor over long periods.",
    category: "Finance",
    readTime: "5 min read",
    gradient: "from-blue-500 to-indigo-600",
    date: "Oct 12, 2023",
  },
  {
    id: 2,
    title: "Understanding GST: A Beginner's Guide",
    excerpt:
      "Everything you need to know about Goods and Services Tax, tax slabs, and how to calculate it accurately for your business.",
    category: "Finance",
    readTime: "4 min read",
    gradient: "from-amber-500 to-orange-600",
    date: "Sep 28, 2023",
  },
  {
    id: 3,
    title: "Why You Should Start SIP Investment at Age 25",
    excerpt:
      "The power of early investing is unmatched. See how starting just 5 years early can double your final retirement corpus.",
    category: "Investment",
    readTime: "6 min read",
    gradient: "from-emerald-500 to-teal-600",
    date: "Sep 15, 2023",
  },
];

export default function Blog() {
  return (
    <>
      <PageHeader
        title="ToolsKit Blog"
        description="Guides, tutorials, and financial insights to help you make the most of our tools."
        icon={BookOpen}
        gradient="from-primary to-accent"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-card border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col group"
            >
              <div
                className={`h-48 bg-gradient-to-br ${post.gradient} p-6 flex flex-col justify-end relative overflow-hidden`}
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
                <Link
                  href="#"
                  className="flex items-center text-primary font-medium text-sm mt-auto group-hover:gap-2 transition-all"
                >
                  Read More <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
