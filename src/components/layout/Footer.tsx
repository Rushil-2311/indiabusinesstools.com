import  Link  from "next/link";
import { Mail, Twitter, Github } from "lucide-react";
import { toolsData } from "@/lib/data";

export function Footer() {
  return (
    <footer className="bg-card border-t pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ibt-footer" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FF6200"/>
                    <stop offset="1" stopColor="#138808"/>
                  </linearGradient>
                </defs>
                <rect width="40" height="40" rx="10" fill="url(#ibt-footer)"/>
                <rect x="0" y="13" width="40" height="2.5" fill="white" fillOpacity="0.25"/>
                <rect x="0" y="24.5" width="40" height="2.5" fill="white" fillOpacity="0.25"/>
                <text x="20" y="28" fontSize="20" fontFamily="system-ui, Arial, sans-serif" fontWeight="700" fill="white" textAnchor="middle">&#8377;</text>
              </svg>
              <div className="flex flex-col leading-none">
                <span className="font-display text-sm font-bold text-foreground tracking-tight">Indian</span>
                <span className="font-display text-sm font-bold tracking-tight bg-linear-to-r from-orange-600 to-green-700 bg-clip-text text-transparent">BusinessTools</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Every Tool You Need. One Place. Free Forever. Designed to make your daily calculations and formatting tasks effortless.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4 text-foreground">Tools</h3>
            <ul className="space-y-3">
              {toolsData.slice(0, 4).map((tool) => (
                <li key={tool.slug}>
                  <Link href={`/${tool.slug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4 text-foreground">More Tools</h3>
            <ul className="space-y-3">
              {toolsData.slice(4).map((tool) => (
                <li key={tool.slug}>
                  <Link href={`/${tool.slug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4 text-foreground">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-sm text-muted-foreground hover:text-primary transition-colors">Disclaimer</Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} IndianBusinessTools. All rights reserved.
          </p>
          <div className="text-sm text-muted-foreground">
            Built with ❤️ for the community.
          </div>
        </div>
      </div>
    </footer>
  );
}
