import {
  TrendingUp,
  Landmark,
  Receipt,
  Percent,
  CalendarDays,
  CaseSensitive,
  Braces,
  ImageIcon,
  FileText,
  QrCode,
  AlignLeft,
  Binary,
  PiggyBank,
  Shield,
  FileSpreadsheet,
  Briefcase,
  BarChart3,
  Ruler,
  ClipboardList,
  LineChart,
  CreditCard,
  Palette,
  Table,
  ScrollText,
  FileCode,
  Database,
  Coffee,
  ImageDown,
  ScanText,
  FileStack,
  Archive,
} from "lucide-react";

export const toolsData = [
  {
    name: "Salary Slip Generator",
    slug: "salary-slip-generator",
    description: "Generate professional salary slips with company logo, earnings, deductions and PDF download.",
    gradient: "from-violet-600 to-indigo-700",
    badge: "New",
    icon: ScrollText
  },
  {
    name: "SIP Calculator",
    slug: "sip-calculator",
    description: "Calculate mutual fund returns with step-up & inflation adjustment.",
    gradient: "from-blue-600 to-indigo-600",
    badge: "Popular",
    icon: TrendingUp
  },
  {
    name: "EMI Calculator",
    slug: "emi-calculator",
    description: "Plan your loan repayment with detailed amortization schedule.",
    gradient: "from-emerald-500 to-teal-600",
    badge: "Popular",
    icon: Landmark
  },
  {
    name: "GST Calculator",
    slug: "gst-calculator",
    description: "Quickly add or remove GST with standard tax slabs.",
    gradient: "from-amber-500 to-orange-600",
    badge: null,
    icon: Receipt
  },
  {
    name: "Percentage Calculator",
    slug: "percentage-calculator",
    description: "Solve complex percentage math instantly.",
    gradient: "from-violet-500 to-purple-600",
    badge: null,
    icon: Percent
  },
  {
    name: "Age Calculator",
    slug: "age-calculator",
    description: "Find out your exact age in years, months, and days.",
    gradient: "from-rose-500 to-pink-600",
    badge: "New",
    icon: CalendarDays
  },
  {
    name: "Text Case Converter",
    slug: "text-case-converter",
    description: "Convert text between upper, lower, title case and more.",
    gradient: "from-cyan-500 to-sky-600",
    badge: null,
    icon: CaseSensitive
  },
  {
    name: "JSON Formatter",
    slug: "json-formatter",
    description: "Beautify, minify, and validate JSON data instantly.",
    gradient: "from-slate-600 to-gray-800",
    badge: null,
    icon: Braces
  },
  {
    name: "Image Converter",
    slug: "image-converter",
    description: "Convert images between PNG, JPG, and WebP. Resize quality, download instantly.",
    gradient: "from-pink-500 to-rose-600",
    badge: "New",
    icon: ImageIcon
  },
  {
    name: "Markdown Converter",
    slug: "markdown-converter",
    description: "Write Markdown and export to PDF, Word DOC, or HTML with live preview.",
    gradient: "from-violet-500 to-purple-700",
    badge: "New",
    icon: FileText
  },
  {
    name: "QR Code Generator",
    slug: "qr-code-generator",
    description: "Generate QR codes for URLs, UPI IDs, phones, and more. Download as PNG.",
    gradient: "from-teal-500 to-emerald-600",
    badge: "New",
    icon: QrCode
  },
  {
    name: "Word Counter",
    slug: "word-counter",
    description: "Count words, characters, sentences. Get reading time and top keyword analysis.",
    gradient: "from-orange-500 to-amber-600",
    badge: "New",
    icon: AlignLeft
  },
  {
    name: "Base64 Tool",
    slug: "base64-tool",
    description: "Encode text or files to Base64, or decode Base64 strings back to plain text.",
    gradient: "from-slate-500 to-zinc-700",
    badge: "New",
    icon: Binary
  },
  {
    name: "FD Calculator",
    slug: "fd-calculator",
    description: "Calculate Fixed Deposit maturity & interest with SBI, HDFC, ICICI bank rate presets.",
    gradient: "from-green-500 to-emerald-700",
    badge: "New",
    icon: PiggyBank
  },
  {
    name: "PPF Calculator",
    slug: "ppf-calculator",
    description: "Calculate Public Provident Fund returns with year-by-year interest breakdown.",
    gradient: "from-sky-500 to-cyan-600",
    badge: "New",
    icon: Shield
  },
  {
    name: "Income Tax Calculator",
    slug: "income-tax-calculator",
    description: "Compare new vs old tax regime and calculate income tax for FY 2025-26.",
    gradient: "from-red-500 to-rose-700",
    badge: "New",
    icon: FileSpreadsheet
  },
  {
    name: "Salary / CTC Calculator",
    slug: "ctc-calculator",
    description: "Break down your CTC into in-hand salary with PF, HRA, and gratuity components.",
    gradient: "from-indigo-600 to-blue-800",
    badge: "New",
    icon: Briefcase
  },
  {
    name: "Compound Interest Calculator",
    slug: "compound-interest-calculator",
    description: "Calculate compound interest with daily, monthly, quarterly, and yearly compounding.",
    gradient: "from-purple-600 to-violet-800",
    badge: "New",
    icon: BarChart3
  },
  {
    name: "Unit Converter",
    slug: "unit-converter",
    description: "Convert weight, length, volume, temperature including Indian units like Tola and Maund.",
    gradient: "from-amber-400 to-orange-500",
    badge: "New",
    icon: Ruler
  },
  {
    name: "Invoice Generator",
    slug: "invoice-generator",
    description: "Create GST-ready invoices with CGST/SGST/IGST split and download as PDF.",
    gradient: "from-gray-700 to-slate-900",
    badge: "New",
    icon: ClipboardList
  },
  {
    name: "CAGR Calculator",
    slug: "cagr-calculator",
    description: "Calculate Compound Annual Growth Rate for investments or find future value at a given CAGR.",
    gradient: "from-lime-500 to-emerald-600",
    badge: "New",
    icon: LineChart
  },
  {
    name: "Loan Eligibility Calculator",
    slug: "loan-eligibility-calculator",
    description: "Find out your maximum loan amount based on salary, existing EMIs, tenure and FOIR.",
    gradient: "from-cyan-600 to-blue-700",
    badge: "New",
    icon: CreditCard
  },
  {
    name: "Color Converter",
    slug: "color-converter",
    description: "Convert colors between HEX, RGB and HSL with live preview, palette, and copy buttons.",
    gradient: "from-fuchsia-500 to-pink-600",
    badge: "New",
    icon: Palette
  },
  {
    name: "CSV ↔ JSON Converter",
    slug: "csv-json-converter",
    description: "Convert CSV to JSON or JSON to CSV instantly. Supports custom delimiters, file upload and preview.",
    gradient: "from-yellow-500 to-orange-500",
    badge: "New",
    icon: Table
  },
  {
    name: "XML ↔ JSON Converter",
    slug: "xml-json-converter",
    description: "Convert XML to JSON or JSON to XML instantly. Upload a file or paste your data.",
    gradient: "from-cyan-500 to-blue-600",
    badge: "New",
    icon: FileCode
  },
  {
    name: "XML ↔ CSV Converter",
    slug: "xml-csv-converter",
    description: "Convert XML to CSV or CSV to XML with file upload support and table preview.",
    gradient: "from-emerald-500 to-teal-600",
    badge: "New",
    icon: FileSpreadsheet
  },
  {
    name: "XML Formatter",
    slug: "xml-formatter",
    description: "Beautify, format and minify XML. Validate structure and pretty-print with custom indentation.",
    gradient: "from-orange-500 to-red-500",
    badge: "New",
    icon: FileCode
  },
  {
    name: "SQL Formatter",
    slug: "sql-formatter",
    description: "Format SQL queries for MySQL, PostgreSQL, SQLite and more. Supports uppercase keywords.",
    gradient: "from-blue-600 to-indigo-700",
    badge: "New",
    icon: Database
  },
  {
    name: "Java Formatter",
    slug: "java-formatter",
    description: "Beautify and format Java source code — auto-indent, clean spacing, file upload support.",
    gradient: "from-amber-600 to-orange-700",
    badge: "New",
    icon: Coffee
  },
  {
    name: "Image Compressor",
    slug: "image-compressor",
    description: "Compress and resize images in your browser. Adjust quality, set max dimensions, convert format.",
    gradient: "from-pink-500 to-rose-600",
    badge: "New",
    icon: ImageDown
  },
  {
    name: "Image to Text (OCR)",
    slug: "image-to-text",
    description: "Extract text from images using OCR. Supports English, Hindi, Tamil, Telugu and more Indian languages.",
    gradient: "from-violet-500 to-purple-700",
    badge: "New",
    icon: ScanText
  },
  {
    name: "PDF Tools",
    slug: "pdf-tools",
    description: "Merge multiple PDFs, split PDF by page range, and compress PDF size — all in your browser.",
    gradient: "from-red-600 to-rose-700",
    badge: "New",
    icon: FileStack
  },
  {
    name: "ZIP Extractor",
    slug: "zip-extractor",
    description: "Extract and download files from ZIP archives online. Preview contents and download individually.",
    gradient: "from-slate-600 to-gray-800",
    badge: "New",
    icon: Archive
  },
];

export const faqs = {
  "sip-calculator": [
    { q: "What is a SIP?", a: "A Systematic Investment Plan (SIP) is a method of investing a fixed sum, regularly, in a mutual fund scheme." },
    { q: "What is Step-Up SIP?", a: "Step-Up SIP allows you to increase your SIP amount automatically by a fixed percentage every year." },
    { q: "Are SIP returns guaranteed?", a: "No, mutual fund returns depend on market performance and are not guaranteed." },
    { q: "What is Lumpsum investment?", a: "A lumpsum investment is depositing the entire amount at once instead of spreading it out over months." },
    { q: "Is SIP better than Lumpsum?", a: "SIP is generally better for salaried individuals as it averages out market volatility (rupee cost averaging)." },
  ],
  "emi-calculator": [
    { q: "What does EMI stand for?", a: "Equated Monthly Installment - a fixed payment made by a borrower to a lender at a specified date each calendar month." },
    { q: "How is EMI calculated?", a: "EMI uses the formula: P × r × (1+r)^n / ((1+r)^n - 1) where P is principal, r is monthly rate, and n is number of months." },
    { q: "Does EMI change during the loan tenure?", a: "For fixed-rate loans, the EMI remains constant. For floating-rate loans, it may change based on market rates." },
    { q: "What is an amortization schedule?", a: "It's a table detailing each periodic payment on an amortizing loan, showing how much goes to principal vs interest." },
    { q: "Is interest calculated on the original or outstanding principal?", a: "Interest is typically calculated on the outstanding balance, meaning the interest portion of your EMI decreases over time." },
  ]
};
