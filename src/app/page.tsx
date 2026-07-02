import Link from "next/link";
import { ArrowRight, Zap, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdSlot } from "@/components/shared/AdSlot";
import { toolsData } from "@/lib/data";
import { JsonLd } from "@/components/seo/JsonLd";
import Image from 'next/image';

const BASE_URL = "https://www.indiabusinesstools.com";

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Free Business Tools for India",
  description: "A comprehensive suite of free online tools for Indian businesses — finance calculators, tax utilities, developer tools, and more.",
  url: BASE_URL,
  numberOfItems: toolsData.length,
  itemListElement: toolsData.map((tool, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: tool.name,
    description: tool.description,
    url: `${BASE_URL}/${tool.slug}`,
  })),
};

const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Are all tools on IndianBusinessTools free?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, all tools on IndianBusinessTools are 100% free with no sign-up, no subscription, and no hidden charges. All calculations run in your browser." },
    },
    {
      "@type": "Question",
      name: "Is my data safe when I use these tools?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. All calculations happen locally in your browser — no data is ever sent to our servers. Your financial and personal information stays private." },
    },
    {
      "@type": "Question",
      name: "Which GST calculator is best for India?",
      acceptedAnswer: { "@type": "Answer", text: "Our GST Calculator supports all Indian tax slabs (5%, 12%, 18%, 28%) with add/remove GST and CGST+SGST breakdown, making it the most complete free GST tool for Indian businesses." },
    },
    {
      "@type": "Question",
      name: "How do I calculate SIP returns online?",
      acceptedAnswer: { "@type": "Answer", text: "Use our free SIP Calculator — enter your monthly amount, expected annual return rate, and duration. It instantly shows your projected corpus, total investment, and wealth gained. Supports step-up SIP and inflation adjustment." },
    },
    {
      "@type": "Question",
      name: "Does IndianBusinessTools work on mobile?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, all tools are fully responsive and work perfectly on mobile phones and tablets. No app download required — just open in any browser." },
    },
  ],
};

export default function Home() {
  return (
    <>
      <JsonLd schema={itemListSchema} />
      <JsonLd schema={homeFaqSchema} />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src={`/images/hero-bg.png`}
            alt="Every Tool You Need"
            className="w-full h-full object-cover"
            width={800}
            height={600}
            priority
            quality={85}
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-background" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
<h1 className="text-5xl md:text-7xl font-display font-extrabold text-foreground tracking-tight mb-8">
            Every Tool You Need. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
              One Place. Free Forever.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            A comprehensive suite of beautifully designed calculators and utilities.
            Financial planning, daily math, or developer tasks — we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#tools">
              <Button size="lg" className="rounded-full px-8 h-14 text-base font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/30 w-full sm:w-auto">
                Explore Tools <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <AdSlot type="leaderboard" className="mb-12" />

      {/* Tools Grid Section */}
      <section id="tools" className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Our Utility Kit</h2>
            <p className="text-muted-foreground">Select a tool below to get started immediately.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {toolsData.map((tool) => (
              <Link key={tool.slug} href={`/${tool.slug}`}>
                <div className="group bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col cursor-pointer relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-bl ${tool.gradient} opacity-5 rounded-bl-[100px] transition-opacity group-hover:opacity-10`} />

                  <div className="flex justify-between items-start mb-6 relative">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br ${tool.gradient} text-white shadow-lg`}>
                      <tool.icon className="h-7 w-7" />
                    </div>
                    {tool.badge && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10 font-semibold shadow-none">
                        {tool.badge}
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-muted-foreground text-sm grow mb-6 leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="flex items-center text-primary font-medium text-sm mt-auto group-hover:gap-2 transition-all">
                    Use Tool <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-card border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Why use IndianBusinessTools?</h2>
            <p className="text-muted-foreground">Built for speed, accuracy, and ease of use.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Blazing Fast", desc: "All calculations run locally in your browser. Zero server latency, instant results." },
              { icon: Sparkles, title: "No Sign-up", desc: "We respect your time. Jump straight into the tools without creating an account." },
              { icon: Shield, title: "Privacy First", desc: "Your data never leaves your device. We don't store or track your inputs." }
            ].map((feature, i) => (
              <div key={i} className="text-center p-8 rounded-2xl bg-muted/50 border border-border/50">
                <div className="mx-auto h-16 w-16 bg-background rounded-full flex items-center justify-center shadow-sm mb-6 text-primary">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AdSlot type="leaderboard" className="my-12" />
    </>
  );
}
