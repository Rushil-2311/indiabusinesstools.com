'use client';

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown, Search, ChevronRight } from "lucide-react";
import { toolsData } from "@/lib/data";

const CATEGORIES = [
  {
    name: "Financial",
    slugs: [
      "sip-calculator",
      "emi-calculator",
      "gst-calculator",
      "fd-calculator",
      "ppf-calculator",
      "income-tax-calculator",
      "ctc-calculator",
      "compound-interest-calculator",
      "cagr-calculator",
      "loan-eligibility-calculator",
    ],
  },
  {
    name: "Converters",
    slugs: [
      "csv-json-converter",
      "xml-json-converter",
      "xml-csv-converter",
      "xml-formatter",
      "sql-formatter",
      "java-formatter",
    ],
  },
  {
    name: "Developer",
    slugs: ["json-formatter", "image-converter", "qr-code-generator", "color-converter", "base64-tool", "markdown-converter"],
  },
  {
    name: "Utility",
    slugs: [
      "age-calculator",
      "percentage-calculator",
      "unit-converter",
      "word-counter",
      "text-case-converter",
      "invoice-generator",
      "salary-slip-generator",
      "image-compressor",
      "pdf-tools",
      "pdf-editor",
      "zip-extractor",
    ],
  },
];

const toolsBySlug = Object.fromEntries(toolsData.map((t) => [t.slug, t]));

export function Header() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search when dropdown opens
  useEffect(() => {
    if (toolsOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [toolsOpen]);

  const filteredTools = search.trim()
    ? toolsData.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
    : null;

  function closeAll() {
    setToolsOpen(false);
    setMobileOpen(false);
    setSearch("");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" onClick={closeAll}>
            <div className="transition-all duration-300 group-hover:-translate-y-0.5 group-hover:drop-shadow-lg">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ibt-header" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FF6200" />
                    <stop offset="1" stopColor="#138808" />
                  </linearGradient>
                </defs>
                <rect width="40" height="40" rx="10" fill="url(#ibt-header)" />
                <rect x="0" y="13" width="40" height="2.5" fill="white" fillOpacity="0.25" />
                <rect x="0" y="24.5" width="40" height="2.5" fill="white" fillOpacity="0.25" />
                <text x="20" y="28" fontSize="20" fontFamily="system-ui, Arial, sans-serif" fontWeight="700" fill="white" textAnchor="middle">&#8377;</text>
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-base font-bold text-foreground tracking-tight">Indian</span>
              <span className="font-display text-base font-bold tracking-tight bg-linear-to-r from-orange-600 to-green-700 bg-clip-text text-transparent">BusinessTools</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>

            {/* Tools mega-menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setToolsOpen((v) => !v)}
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors outline-none"
              >
                Tools
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`} />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[520px] rounded-2xl border bg-background shadow-2xl shadow-black/10 ring-1 ring-black/5 overflow-hidden">
                  {/* Search */}
                  <div className="flex items-center gap-2 border-b px-4 py-3">
                    <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                    <input
                      ref={searchRef}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search tools…"
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                    {search && (
                      <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Search results */}
                  {filteredTools ? (
                    <div className="p-2 max-h-72 overflow-y-auto">
                      {filteredTools.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-6">No tools found</p>
                      ) : (
                        filteredTools.map((tool) => (
                          <Link
                            key={tool.slug}
                            href={`/${tool.slug}`}
                            onClick={closeAll}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                          >
                            <div className={`flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br ${tool.gradient} text-white shrink-0`}>
                              <tool.icon className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-sm font-medium">{tool.name}</span>
                          </Link>
                        ))
                      )}
                    </div>
                  ) : (
                    /* Grouped categories — 2-column layout */
                    <div className="grid grid-cols-2 divide-x">
                      {/* Left: Financial */}
                      <div className="p-3">
                        <CategorySection
                          category={CATEGORIES[0]}
                          onClose={closeAll}
                        />
                      </div>
                      {/* Right: Text, Developer, Utility */}
                      <div className="p-3 space-y-1">
                        {CATEGORIES.slice(1).map((cat) => (
                          <CategorySection key={cat.name} category={cat} onClose={closeAll} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Blog
            </Link>
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              About
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background absolute top-16 left-0 w-full shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="p-4 space-y-1">
            {[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: "About", path: "/about" }].map((l) => (
              <Link
                key={l.path}
                href={l.path}
                onClick={closeAll}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                {l.name}
              </Link>
            ))}

            <div className="pt-2 border-t mt-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">Tools</p>
              {CATEGORIES.map((cat) => (
                <div key={cat.name}>
                  <button
                    onClick={() => setOpenCategory(openCategory === cat.name ? null : cat.name)}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    <span>{cat.name} <span className="text-muted-foreground font-normal">({cat.slugs.length})</span></span>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openCategory === cat.name ? "rotate-180" : ""}`} />
                  </button>
                  {openCategory === cat.name && (
                    <div className="ml-3 mb-1 space-y-0.5">
                      {cat.slugs.map((slug) => {
                        const tool = toolsBySlug[slug];
                        if (!tool) return null;
                        return (
                          <Link
                            key={slug}
                            href={`/${slug}`}
                            onClick={closeAll}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                          >
                            <div className={`flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br ${tool.gradient} text-white shrink-0`}>
                              <tool.icon className="h-3 w-3" />
                            </div>
                            <span className="text-sm font-medium">{tool.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function CategorySection({
  category,
  onClose,
}: {
  category: (typeof CATEGORIES)[number];
  onClose: () => void;
}) {
  return (
    <div className="mb-1">
      <div className="flex items-center gap-1.5 px-2 py-1 mb-1">
        <span className="text-xs font-bold text-foreground uppercase tracking-wider">{category.name}</span>
        <span className="text-xs text-muted-foreground">({category.slugs.length})</span>
      </div>
      {category.slugs.map((slug) => {
        const tool = toolsBySlug[slug];
        if (!tool) return null;
        return (
          <Link
            key={slug}
            href={`/${slug}`}
            onClick={onClose}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors group"
          >
            <div className={`flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br ${tool.gradient} text-white shrink-0`}>
              <tool.icon className="h-3 w-3" />
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{tool.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
