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
    slugs: [
      "json-formatter",
      "image-converter",
      "qr-code-generator",
      "color-converter",
      "base64-tool",
      "markdown-converter",
      "number-base-converter",
      "timestamp-converter",
      "regex-tester",
      "jwt-decoder",
    ],
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
    <header ref={dropdownRef} className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" onClick={closeAll}>
            <div className="transition-all duration-300 group-hover:-translate-y-0.5 group-hover:drop-shadow-lg">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ibt-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1A56DB"/>
                    <stop offset="1" stopColor="#0A2466"/>
                  </linearGradient>
                </defs>
                {/* Background */}
                <rect width="40" height="40" rx="10" fill="url(#ibt-bg)"/>
                {/* Bar 1 short */}
                <rect x="6"  y="25" width="7" height="10" rx="2" fill="white" fillOpacity="0.92"/>
                {/* Bar 2 medium */}
                <rect x="16" y="18" width="7" height="17" rx="2" fill="white" fillOpacity="0.92"/>
                {/* Bar 3 tall */}
                <rect x="27" y="10" width="7" height="25" rx="2" fill="white" fillOpacity="0.92"/>
                {/* Saffron trend line */}
                <polyline points="9.5,24 19.5,17 30.5,9" stroke="#FF8000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                {/* Green peak dot */}
                <circle cx="30.5" cy="9" r="3.5" fill="#138808"/>
                <circle cx="30.5" cy="9" r="1.8" fill="white"/>
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-base font-bold text-foreground tracking-tight">India</span>
              <span className="font-display text-base font-bold tracking-tight bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">BusinessTools</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>

            <button
              onClick={() => setToolsOpen((v) => !v)}
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors outline-none"
            >
              Tools
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`} />
            </button>

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

      {/* Desktop mega-menu — floating card, separated from header */}
      {toolsOpen && (
        <div className="hidden md:block absolute top-full left-0 right-0 px-4 sm:px-6 lg:px-8 pt-2 pointer-events-none">
          <div className="mx-auto max-w-7xl pointer-events-auto bg-background rounded-2xl border shadow-2xl shadow-black/10 ring-1 ring-black/5 overflow-hidden flex flex-col max-h-[calc(100vh-5rem)]">
            {/* Search — pinned */}
            <div className="flex items-center gap-2 border-b px-6 py-3 shrink-0">
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

            {/* Scrollable content */}
            <div className="overflow-y-auto">
              {filteredTools ? (
                <div className="px-4 py-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
                  {filteredTools.length === 0 ? (
                    <p className="col-span-full text-center text-sm text-muted-foreground py-8">No tools found</p>
                  ) : (
                    filteredTools.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/${tool.slug}`}
                        onClick={closeAll}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className={`flex h-7 w-7 items-center justify-center rounded-md bg-linear-to-br ${tool.gradient} text-white shrink-0`}>
                          <tool.icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm font-medium">{tool.name}</span>
                      </Link>
                    ))
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-6 px-6 py-6">
                  {CATEGORIES.map((cat) => (
                    <CategorySection key={cat.name} category={cat} onClose={closeAll} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
                            <div className={`flex h-6 w-6 items-center justify-center rounded-md bg-linear-to-br ${tool.gradient} text-white shrink-0`}>
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
            <div className={`flex h-6 w-6 items-center justify-center rounded-md bg-linear-to-br ${tool.gradient} text-white shrink-0`}>
              <tool.icon className="h-3 w-3" />
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{tool.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
