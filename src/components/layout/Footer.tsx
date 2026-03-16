import  Link  from "next/link";
import { Wrench, Mail, Twitter, Github } from "lucide-react";
import { toolsData } from "@/lib/data";

export function Footer() {
  return (
    <footer className="bg-card border-t pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group inline-flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <Wrench className="h-4 w-4" />
              </div>
              <span className="font-display text-xl font-bold">ToolsKit</span>
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
            © {new Date().getFullYear()} ToolsKit. All rights reserved.
          </p>
          <div className="text-sm text-muted-foreground">
            Built with ❤️ for the community.
          </div>
        </div>
      </div>
    </footer>
  );
}
