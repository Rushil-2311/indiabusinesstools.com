'use client';

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toolsData } from "@/lib/data";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = typeof window !== 'undefined' ? window.location.pathname : '';

  const isActive = (path: string) => true;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "About", path: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="transition-all duration-300 group-hover:-translate-y-0.5 group-hover:drop-shadow-lg">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ibt-header" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FF6200"/>
                    <stop offset="1" stopColor="#138808"/>
                  </linearGradient>
                </defs>
                <rect width="40" height="40" rx="10" fill="url(#ibt-header)"/>
                <rect x="0" y="13" width="40" height="2.5" fill="white" fillOpacity="0.25"/>
                <rect x="0" y="24.5" width="40" height="2.5" fill="white" fillOpacity="0.25"/>
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
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground">
              Home
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary text-muted-foreground outline-none">
                  Tools <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px] rounded-xl p-2">
                {toolsData.map((tool) => (
                  <Link key={tool.slug} href={`/${tool.slug}`}>
                    <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br ${tool.gradient} text-white`}>
                          <tool.icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{tool.name}</span>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {navLinks.slice(1).map((link) => (
              <Link key={link.path} href={link.path} className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground">
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background absolute top-16 left-0 w-full p-4 shadow-xl">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path} 
                className={`text-base font-medium p-2 rounded-lg ${isActive(link.path) ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3 font-medium px-2">Our Tools</p>
              <div className="grid grid-cols-1 gap-2">
                {toolsData.map((tool) => (
                  <Link 
                    key={tool.slug} 
                    href={`/${tool.slug}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br ${tool.gradient} text-white`}>
                      <tool.icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-sm">{tool.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
