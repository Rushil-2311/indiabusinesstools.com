'use client';

import Link from "next/link";
import { ArrowRight, Zap, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLayout } from "@/components/layout/PageLayout";
import { AdSlot } from "@/components/shared/AdSlot";
import { toolsData } from "@/lib/data";

export default function Home() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-32">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={`/images/hero-bg.png`}
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Badge variant="outline" className="mb-6 px-4 py-1.5 border-primary/20 bg-primary/5 text-primary">
            100% Free & No Sign-up Required
          </Badge>
          <h1 className="text-5xl md:text-7xl font-display font-extrabold text-foreground tracking-tight mb-8">
            Every Tool You Need. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              One Place. Free Forever.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            A comprehensive suite of beautifully designed calculators and utilities.
            Financial planning, daily math, or developer tasks — we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="rounded-full px-8 h-14 text-base font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/30 w-full sm:w-auto" onClick={() => {
              document.getElementById('tools-grid')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Explore Tools <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-semibold w-full sm:w-auto bg-background/50 backdrop-blur-sm">
              Bookmark Site
            </Button>
          </div>
        </div>
      </section>

      <AdSlot type="leaderboard" className="mb-12" />

      {/* Tools Grid Section */}
      <section id="tools-grid" className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Our Utility Kit</h2>
            <p className="text-muted-foreground">Select a tool below to get started immediately.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {toolsData.map((tool) => (
              <Link key={tool.slug} href={`/${tool.slug}`}>
                <div className="group bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col cursor-pointer relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${tool.gradient} opacity-5 rounded-bl-[100px] transition-opacity group-hover:opacity-10`} />

                  <div className="flex justify-between items-start mb-6 relative">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${tool.gradient} text-white shadow-lg`}>
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
                  <p className="text-muted-foreground text-sm flex-grow mb-6 leading-relaxed">
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
            <h2 className="text-3xl font-display font-bold mb-4">Why use ToolsKit?</h2>
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
    </PageLayout>
  );
}
