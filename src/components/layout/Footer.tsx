import Link from "next/link";
import { Mail, Twitter, Github } from "lucide-react";

const FOOTER_CATEGORIES = [
  {
    label: "Finance & Investments",
    tools: [
      { name: "SIP Calculator", slug: "sip-calculator" },
      { name: "EMI Calculator", slug: "emi-calculator" },
      { name: "FD Calculator", slug: "fd-calculator" },
      { name: "PPF Calculator", slug: "ppf-calculator" },
      { name: "CAGR Calculator", slug: "cagr-calculator" },
      { name: "Loan Eligibility Calculator", slug: "loan-eligibility-calculator" },
      { name: "Compound Interest Calculator", slug: "compound-interest-calculator" },
    ],
  },
  {
    label: "Tax & Payroll",
    tools: [
      { name: "GST Calculator", slug: "gst-calculator" },
      { name: "Income Tax Calculator", slug: "income-tax-calculator" },
      { name: "Salary / CTC Calculator", slug: "ctc-calculator" },
      { name: "Salary Slip Generator", slug: "salary-slip-generator" },
      { name: "Invoice Generator", slug: "invoice-generator" },
    ],
  },
  {
    label: "Converters & Formatters",
    tools: [
      { name: "CSV ↔ JSON Converter", slug: "csv-json-converter" },
      { name: "XML ↔ JSON Converter", slug: "xml-json-converter" },
      { name: "XML ↔ CSV Converter", slug: "xml-csv-converter" },
      { name: "XML Formatter", slug: "xml-formatter" },
      { name: "SQL Formatter", slug: "sql-formatter" },
      { name: "Java Formatter", slug: "java-formatter" },
    ],
  },
  {
    label: "Developer & Media",
    tools: [
      { name: "JSON Formatter", slug: "json-formatter" },
      { name: "Base64 Tool", slug: "base64-tool" },
      { name: "Number Base Converter", slug: "number-base-converter" },
      { name: "Timestamp Converter", slug: "timestamp-converter" },
      { name: "Regex Tester", slug: "regex-tester" },
      { name: "JWT Decoder", slug: "jwt-decoder" },
      { name: "Color Converter", slug: "color-converter" },
      { name: "QR Code Generator", slug: "qr-code-generator" },
      { name: "Markdown Converter", slug: "markdown-converter" },
    ],
  },
  {
    label: "Utility Tools",
    tools: [
      { name: "Word Counter", slug: "word-counter" },
      { name: "Text Case Converter", slug: "text-case-converter" },
      { name: "Age Calculator", slug: "age-calculator" },
      { name: "Percentage Calculator", slug: "percentage-calculator" },
      { name: "Unit Converter", slug: "unit-converter" },
      { name: "Image Converter", slug: "image-converter" },
      { name: "Image Compressor", slug: "image-compressor" },
      { name: "PDF Tools", slug: "pdf-tools" },
      { name: "PDF Editor", slug: "pdf-editor" },
      { name: "ZIP Extractor", slug: "zip-extractor" },
    ],
  },
];

const COMPANY_LINKS = [
  { name: "About Us", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Disclaimer", href: "/disclaimer" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t pt-14 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Top row: Brand + Company */}
        <div className="flex flex-col sm:flex-row justify-between gap-8 pb-10 mb-10 border-b">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ibt-footer" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FF6200" />
                    <stop offset="1" stopColor="#138808" />
                  </linearGradient>
                </defs>
                <rect width="40" height="40" rx="10" fill="url(#ibt-footer)" />
                <rect x="0" y="13" width="40" height="2.5" fill="white" fillOpacity="0.25" />
                <rect x="0" y="24.5" width="40" height="2.5" fill="white" fillOpacity="0.25" />
                <text x="20" y="28" fontSize="20" fontFamily="system-ui, Arial, sans-serif" fontWeight="700" fill="white" textAnchor="middle">&#8377;</text>
              </svg>
              <div className="flex flex-col leading-none">
                <span className="font-display text-sm font-bold text-foreground tracking-tight">Indian</span>
                <span className="font-display text-sm font-bold tracking-tight bg-linear-to-r from-orange-600 to-green-700 bg-clip-text text-transparent">BusinessTools</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              Every Tool You Need. One Place. Free Forever. Designed to make your daily calculations and formatting tasks effortless.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Email" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="shrink-0">
            <h3 className="font-display font-semibold text-sm mb-4 text-foreground">Company</h3>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tool categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-8 mb-12">
          {FOOTER_CATEGORIES.map((cat) => (
            <div key={cat.label}>
              <h3 className="font-display font-semibold text-sm mb-4 text-foreground">{cat.label}</h3>
              <ul className="space-y-2.5">
                {cat.tools.map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/${tool.slug}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors leading-snug block"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} IndianBusinessTools. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ for the community.
          </p>
        </div>
      </div>
    </footer>
  );
}
