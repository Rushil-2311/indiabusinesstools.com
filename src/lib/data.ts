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
  FileStack,
  Archive,
  FilePen,
  Hash,
  Clock,
  Code2,
  KeyRound,
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
  {
    name: "PDF Editor",
    slug: "pdf-editor",
    description: "Draw, annotate, add text, erase content, watermark and fill form fields — 100% in your browser.",
    gradient: "from-orange-600 to-red-700",
    badge: "New",
    icon: FilePen
  },
  {
    name: "Number Base Converter",
    slug: "number-base-converter",
    description: "Convert numbers between binary, octal, decimal, and hexadecimal with bit visualization.",
    gradient: "from-violet-500 to-indigo-600",
    badge: "New",
    icon: Hash
  },
  {
    name: "Timestamp Converter",
    slug: "timestamp-converter",
    description: "Convert Unix epoch timestamps to human-readable dates and back, with timezone support.",
    gradient: "from-blue-500 to-cyan-600",
    badge: "New",
    icon: Clock
  },
  {
    name: "Regex Tester",
    slug: "regex-tester",
    description: "Test regular expressions with live match highlighting, flag toggles, and common Indian patterns.",
    gradient: "from-emerald-500 to-teal-600",
    badge: "New",
    icon: Code2
  },
  {
    name: "JWT Decoder",
    slug: "jwt-decoder",
    description: "Decode and inspect JSON Web Token headers, payloads, expiry, and algorithm — no secret needed.",
    gradient: "from-amber-500 to-orange-600",
    badge: "New",
    icon: KeyRound
  },
];

export const toolCategories: Record<string, { label: string; slugs: string[] }> = {
  finance: {
    label: "Finance & Investments",
    slugs: ["sip-calculator", "emi-calculator", "fd-calculator", "ppf-calculator", "compound-interest-calculator", "cagr-calculator", "loan-eligibility-calculator"],
  },
  tax: {
    label: "Tax & Payroll",
    slugs: ["gst-calculator", "income-tax-calculator", "ctc-calculator", "salary-slip-generator", "invoice-generator"],
  },
  developer: {
    label: "Developer Tools",
    slugs: ["json-formatter", "base64-tool", "number-base-converter", "timestamp-converter", "regex-tester", "jwt-decoder", "color-converter", "markdown-converter", "csv-json-converter", "xml-json-converter", "xml-csv-converter", "xml-formatter", "sql-formatter", "java-formatter"],
  },
  utility: {
    label: "Utility Tools",
    slugs: ["percentage-calculator", "age-calculator", "text-case-converter", "word-counter", "unit-converter", "qr-code-generator", "image-converter", "image-compressor", "pdf-tools", "pdf-editor", "zip-extractor"],
  },
};

export const faqs: Record<string, { q: string; a: string }[]> = {
  "sip-calculator": [
    { q: "What is a SIP?", a: "A Systematic Investment Plan (SIP) is a method of investing a fixed sum regularly in a mutual fund scheme, typically monthly." },
    { q: "What is Step-Up SIP?", a: "Step-Up SIP allows you to increase your SIP amount automatically by a fixed percentage every year, helping you invest more as your income grows." },
    { q: "Are SIP returns guaranteed?", a: "No, mutual fund returns depend on market performance and are not guaranteed. Past performance is not indicative of future results." },
    { q: "What is Lumpsum investment?", a: "A lumpsum investment is depositing the entire amount at once instead of spreading it over months. It's suited for those with a large amount available to invest." },
    { q: "Is SIP better than Lumpsum?", a: "SIP is generally better for salaried individuals as it averages out market volatility through rupee cost averaging. Lumpsum can outperform in a rising market." },
    { q: "What is a good SIP return rate to expect?", a: "Historically, diversified equity mutual funds in India have delivered 10–14% CAGR over 10+ year periods. For conservative estimates, use 10–12%." },
  ],
  "emi-calculator": [
    { q: "What does EMI stand for?", a: "EMI stands for Equated Monthly Installment — a fixed monthly payment made by a borrower to a lender consisting of both principal repayment and interest." },
    { q: "How is EMI calculated?", a: "EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P is principal, r is monthly interest rate (annual rate ÷ 12 ÷ 100), and n is number of months." },
    { q: "Does EMI change during the loan tenure?", a: "For fixed-rate loans, the EMI remains constant throughout. For floating-rate loans, it may change when the benchmark rate (like repo rate) changes." },
    { q: "What is an amortization schedule?", a: "An amortization schedule is a complete table of periodic loan payments showing how each EMI is split between principal repayment and interest over time." },
    { q: "Is interest calculated on the original or outstanding principal?", a: "Interest is calculated on the outstanding (reducing) balance. So the interest component decreases over time while the principal component increases — this is reducing balance method." },
    { q: "How can I reduce my total interest payment?", a: "Pay part-prepayments when possible, choose a shorter tenure if EMI is affordable, negotiate a lower interest rate, or refinance when rates drop." },
  ],
  "gst-calculator": [
    { q: "What is GST?", a: "GST (Goods and Services Tax) is a unified indirect tax in India that replaced VAT, service tax, and excise duty. It is levied at each stage of the supply chain." },
    { q: "What are the GST slabs in India?", a: "India has four main GST slabs: 5% (essential goods like packaged food), 12% (processed food, computers), 18% (most services and electronics), and 28% (luxury/sin goods like cars, tobacco). A 0% slab covers exempted items." },
    { q: "What is the difference between CGST, SGST, and IGST?", a: "For intra-state transactions, GST is split equally into CGST (Central GST) and SGST (State GST). For inter-state transactions, a single IGST at the full GST rate is levied." },
    { q: "How do I calculate GST on a price?", a: "To add GST: multiply price by (1 + GST%/100). To remove GST from an inclusive price: divide by (1 + GST%/100). For example, to remove 18% GST from ₹118: ₹118 / 1.18 = ₹100." },
    { q: "Who needs to register for GST?", a: "Businesses with annual turnover exceeding ₹20 lakh (₹10 lakh for special category states) must register for GST. E-commerce sellers must register regardless of turnover." },
    { q: "What is the GST composition scheme?", a: "The composition scheme allows small businesses (turnover up to ₹1.5 crore) to pay GST at a flat rate (1-6%) without maintaining detailed invoices. They cannot claim input tax credit." },
  ],
  "fd-calculator": [
    { q: "What is a Fixed Deposit?", a: "A Fixed Deposit (FD) is a financial instrument where you deposit a lump sum with a bank for a fixed period at a predetermined interest rate, offering guaranteed returns unlike market-linked investments." },
    { q: "How is FD interest calculated?", a: "FD uses compound interest formula: A = P × (1 + r/n)^(nt), where P is principal, r is annual rate, n is compounding frequency per year, and t is time in years." },
    { q: "What is TDS on FD interest?", a: "Banks deduct TDS at 10% if your FD interest income exceeds ₹40,000 per year (₹50,000 for senior citizens). Submit Form 15G/15H if your total income is below the taxable limit to avoid TDS." },
    { q: "Can I withdraw FD before maturity?", a: "Yes, you can break an FD prematurely. Most banks charge a penalty of 0.5–1% on the applicable interest rate, which reduces your actual earnings." },
    { q: "Are FD returns taxable?", a: "Yes, FD interest is fully taxable under 'Income from Other Sources' at your applicable income tax slab rate. This makes high-income individuals prefer debt mutual funds for better post-tax returns." },
    { q: "Which bank offers the highest FD rate?", a: "Small finance banks and NBFCs typically offer higher FD rates (7–9%) than large banks. Our calculator includes preset rates for SBI, HDFC, and ICICI. Always verify current rates on the bank's website." },
  ],
  "ppf-calculator": [
    { q: "What is PPF?", a: "Public Provident Fund (PPF) is a long-term, government-backed savings scheme in India with a 15-year lock-in period, offering guaranteed tax-free returns backed by the sovereign." },
    { q: "What is the current PPF interest rate?", a: "The PPF interest rate is set by the Government of India each quarter. As of FY 2025-26, it is 7.1% per annum, compounded annually." },
    { q: "Is PPF interest tax-free?", a: "Yes, PPF has EEE (Exempt-Exempt-Exempt) tax status: contributions up to ₹1.5 lakh qualify for Section 80C deduction, interest earned is tax-free, and maturity proceeds are tax-free." },
    { q: "What is the minimum and maximum PPF deposit?", a: "Minimum deposit is ₹500 per year (account becomes inactive if you miss a year). Maximum is ₹1.5 lakh per financial year. Deposits can be made in up to 12 installments." },
    { q: "Can I take a loan against PPF?", a: "Yes, you can take a loan of up to 25% of the balance at the end of 2nd preceding year, between the 3rd and 6th financial year of the account, at 1% above PPF rate." },
    { q: "Can I extend PPF beyond 15 years?", a: "Yes, after 15 years you can extend in blocks of 5 years, either with or without contributions. Without contributions, the balance continues earning interest." },
  ],
  "income-tax-calculator": [
    { q: "What is the difference between old and new tax regime?", a: "Old regime allows many deductions (HRA, 80C, 80D, LTA etc.) but has higher slab rates. New regime offers lower slab rates but disallows most deductions except the standard deduction." },
    { q: "Which tax regime is better for me?", a: "If your total eligible deductions exceed ~₹3.75 lakh (₹50K standard + ₹1.5L 80C + ₹25K 80D + other), old regime usually saves more tax. New regime benefits those with fewer deductions." },
    { q: "What is standard deduction for salaried employees?", a: "For FY 2025-26, the standard deduction is ₹75,000 under the new tax regime and ₹50,000 under the old tax regime for salaried individuals and pensioners." },
    { q: "When is the income tax return due date?", a: "For individuals (non-audit cases), the ITR due date is July 31 of the assessment year. For example, for FY 2025-26, the due date is July 31, 2026." },
    { q: "What is TDS?", a: "Tax Deducted at Source (TDS) is tax deducted by the payer at the time of making payments like salary, interest, rent, or professional fees, and deposited with the government on your behalf." },
    { q: "What is surcharge on income tax?", a: "Surcharge is an additional tax levied on higher incomes: 10% surcharge on income above ₹50 lakh, 15% above ₹1 crore, 25% above ₹2 crore, and 37% above ₹5 crore (capped at 25% for new regime)." },
  ],
  "ctc-calculator": [
    { q: "What is CTC?", a: "Cost to Company (CTC) is the total annual expense an employer incurs for an employee, including basic salary, allowances, PF contributions, gratuity, insurance, and other benefits." },
    { q: "What is in-hand salary?", a: "In-hand (take-home) salary is the amount credited to your bank account after all deductions — employee PF contribution, professional tax, TDS, ESIC, etc. — are subtracted from your gross salary." },
    { q: "How is HRA exemption calculated?", a: "HRA exemption is the minimum of: actual HRA received; 50% of basic salary for metro cities (40% for non-metro); or rent paid minus 10% of basic salary. Only the minimum of these three is tax-free." },
    { q: "What is the employee PF contribution?", a: "Employees contribute 12% of basic salary + DA to EPF. Employer also contributes 12%, of which 8.33% goes to EPS (Employee Pension Scheme) and 3.67% to EPF." },
    { q: "What is gratuity and when is it paid?", a: "Gratuity is a lump-sum payment by an employer to an employee who has completed at least 5 years of continuous service. Gratuity = (Last drawn salary × years served × 15) / 26." },
    { q: "What are metro cities for HRA purposes?", a: "For HRA exemption, metro cities are: Delhi, Mumbai, Kolkata, and Chennai. All other cities are classified as non-metro, attracting 40% HRA exemption (vs 50% for metros)." },
  ],
  "compound-interest-calculator": [
    { q: "What is compound interest?", a: "Compound interest is interest calculated on both the initial principal and all previously accumulated interest, causing the investment to grow exponentially rather than linearly." },
    { q: "How often should interest compound for best returns?", a: "More frequent compounding yields higher returns. Daily > Monthly > Quarterly > Half-yearly > Annually. A 10% annual rate compounded daily yields ~10.52% effective annual rate." },
    { q: "What is the Rule of 72?", a: "The Rule of 72 estimates how long it takes to double your investment — divide 72 by the annual interest rate. At 8% per year, money doubles in approximately 72/8 = 9 years." },
    { q: "How does compound interest differ from simple interest?", a: "Simple interest is calculated only on the original principal. Compound interest is calculated on principal plus accumulated interest, making it grow much faster over time." },
    { q: "What is the effective annual rate (EAR)?", a: "EAR is the actual annual return accounting for compounding. Formula: EAR = (1 + r/n)^n - 1, where r is nominal annual rate and n is compounding periods per year." },
    { q: "Where is compound interest applied in real life?", a: "Compound interest applies to savings accounts, FDs, mutual funds, PPF, EPF, and mortgages. It works in your favor as an investor and against you as a borrower." },
  ],
  "cagr-calculator": [
    { q: "What is CAGR?", a: "Compound Annual Growth Rate (CAGR) is the mean annual growth rate of an investment over a period, assuming profits are reinvested at year-end. It's the single rate that would take you from start to end value." },
    { q: "How is CAGR calculated?", a: "CAGR = (Ending Value / Beginning Value)^(1/Years) - 1. Example: ₹1 lakh growing to ₹2 lakh in 5 years → CAGR = (2/1)^(0.2) - 1 ≈ 14.87% per year." },
    { q: "What is a good CAGR for investments?", a: "For equity mutual funds in India, 12–15% CAGR over 10+ years is considered strong. Nifty 50 has delivered ~11–13% CAGR over 20 years. FDs offer 6–7.5% CAGR." },
    { q: "What is the difference between CAGR and absolute return?", a: "Absolute return is the total percentage gain regardless of time period. CAGR normalizes this across years for comparison. A 100% absolute return over 10 years is only ~7.2% CAGR." },
    { q: "Can CAGR be negative?", a: "Yes. If the ending value is less than the starting value, CAGR is negative — indicating an average annual loss. This is common for poorly performing investments." },
  ],
  "loan-eligibility-calculator": [
    { q: "How is loan eligibility calculated?", a: "Banks typically allow a maximum EMI of 40–50% of your net monthly income (Fixed Obligations to Income Ratio or FOIR). Maximum loan = permissible EMI × [(1 - (1+r)^-n) / r], where r is monthly rate." },
    { q: "What is FOIR?", a: "Fixed Obligation to Income Ratio (FOIR) is the percentage of monthly income already committed to existing EMIs. Most banks cap total FOIR (including new loan) at 50–55%." },
    { q: "How do existing EMIs affect loan eligibility?", a: "Existing EMIs directly reduce the income available for new loan repayment. If you earn ₹1 lakh and already pay ₹30K EMI, only ₹20K (50% limit) is available for new loan EMI, significantly reducing eligibility." },
    { q: "How can I improve my loan eligibility?", a: "Add an earning co-applicant (spouse), clear existing debts, choose a longer repayment tenure, show additional income sources, or improve your CIBIL score to 750+." },
    { q: "What CIBIL score is needed for a home loan?", a: "Most banks require a CIBIL score of 750+ for home loans. Scores above 800 often get preferential interest rates. Below 650 typically results in rejection." },
  ],
  "percentage-calculator": [
    { q: "How do I find what percentage one number is of another?", a: "Divide the part by the whole and multiply by 100. Example: 25 is what % of 80? = (25 ÷ 80) × 100 = 31.25%." },
    { q: "How do I calculate percentage increase?", a: "% Increase = [(New Value - Old Value) / Old Value] × 100. Example: price goes from ₹100 to ₹120 → increase = (20/100) × 100 = 20%." },
    { q: "How do I find a percentage of a number?", a: "Multiply the number by (percentage ÷ 100). Example: 15% of ₹200 = 200 × 0.15 = ₹30." },
    { q: "How do I reverse a percentage to find the original price?", a: "Original price = Discounted price ÷ (1 - discount%/100). Example: if ₹85 is the price after 15% discount, original = 85 ÷ 0.85 = ₹100." },
    { q: "What is the difference between percentage points and percentage?", a: "Percentage points are the arithmetic difference between two percentages. If interest rises from 5% to 8%, that's 3 percentage points — but a 60% relative increase in the rate." },
  ],
  "age-calculator": [
    { q: "How is exact age calculated?", a: "Exact age is calculated by counting completed years, months, and days from your birth date to the target date, accounting for leap years and the varying number of days in each month." },
    { q: "Why is knowing exact age important in India?", a: "Exact age determines eligibility for voting (18+), driving license (18+), retirement (58-60), EPF withdrawal, senior citizen benefits, and education admissions cut-off dates." },
    { q: "What is the legal age for different milestones in India?", a: "Voting and driving: 18 years; Marriage: 18 for women, 21 for men (proposed 21 for all); EPF withdrawal without penalty: 58 years; Senior citizen tax benefits: 60 years; Super senior citizen: 80 years." },
    { q: "How to calculate age difference between two people?", a: "Subtract the earlier birth date from the later one. Our calculator handles this automatically and shows the difference in years, months, and days." },
    { q: "Does the age calculator account for leap years?", a: "Yes, our age calculator correctly handles February 29 birthdays and leap years in the date range for accurate results." },
  ],
  "unit-converter": [
    { q: "What Indian units are supported?", a: "Our unit converter supports traditional Indian units including Tola (gold measurement = 11.6638g), Maund, Ser, Ratti, Bigha (land measurement), Katha, and Gunta." },
    { q: "How many grams is 1 Tola?", a: "1 Tola = 11.6638 grams. This unit is widely used in India for measuring gold jewelry and precious metals in the bullion market." },
    { q: "How many square feet is 1 Bigha?", a: "1 Bigha varies significantly by state. It ranges from 1,333 sq ft (Himachal Pradesh) to 27,000 sq ft (Uttar Pradesh). Our converter uses standard conversions for each state." },
    { q: "How do I convert Celsius to Fahrenheit?", a: "Multiply by 9/5 then add 32. Formula: °F = (°C × 9/5) + 32. Example: 37°C (body temperature) = (37 × 1.8) + 32 = 98.6°F." },
    { q: "How many kilometers in a mile?", a: "1 mile = 1.60934 kilometers. Conversely, 1 km = 0.62137 miles. Road distances in India are in km; US/UK use miles." },
  ],
  "json-formatter": [
    { q: "What is JSON?", a: "JSON (JavaScript Object Notation) is a lightweight, text-based data format for storing and transmitting structured data. It uses key-value pairs and supports strings, numbers, booleans, arrays, and objects." },
    { q: "What is the difference between prettified and minified JSON?", a: "Prettified JSON has indentation and line breaks for human readability. Minified JSON strips all whitespace to reduce file size for network transmission, saving 20–30% bandwidth." },
    { q: "How do I validate JSON?", a: "Valid JSON requires double quotes around all string keys and values, no trailing commas, correct nesting of brackets, and proper data types. Our formatter highlights errors in real time." },
    { q: "What are common JSON errors?", a: "Common errors: single quotes instead of double quotes, trailing commas after the last item, unquoted keys, using undefined or NaN (not valid JSON), and mismatched brackets." },
    { q: "Can I convert JSON to CSV?", a: "Yes! Use our CSV ↔ JSON Converter tool to convert JSON arrays to CSV format and back, with support for nested objects and custom delimiters." },
  ],
  "qr-code-generator": [
    { q: "What types of QR codes can I generate?", a: "Generate QR codes for URLs (website links), UPI payment IDs, phone numbers (auto-dial), SMS messages, email addresses (mailto), and plain text — all for free." },
    { q: "What is a UPI QR code?", a: "A UPI QR code encodes a UPI Virtual Payment Address (VPA) like yourname@upi. When scanned with PhonePe, Google Pay, Paytm, or any UPI app, it pre-fills the recipient for instant payment." },
    { q: "What format should I download QR codes in?", a: "Download as PNG for websites and digital use. For printing on business cards or banners, use a higher error correction level (H) so the code scans even if partially damaged." },
    { q: "What is QR code error correction?", a: "Error correction allows a QR code to be scanned even when 7–30% of it is damaged or obscured. Higher levels (M, Q, H) are better for printed QR codes in physical environments." },
    { q: "Are the QR codes generated here free to use commercially?", a: "Yes, completely free with no watermark, no account required, and no restrictions on commercial use." },
  ],
  "word-counter": [
    { q: "What is the ideal word count for an SEO blog post?", a: "1,500–2,500 words typically perform best for competitive keywords. Informational pages often rank well with 800–1,500 words. Quality and relevance matter more than hitting a specific count." },
    { q: "How is reading time calculated?", a: "Reading time is estimated based on an average reading speed of 200–250 words per minute. A 1,000-word article takes approximately 4–5 minutes to read." },
    { q: "Does word count include headings and lists?", a: "Yes, all visible text including headings, bullet points, captions, and body text is counted." },
    { q: "What is the character limit for Twitter/X and Instagram?", a: "Twitter/X allows 280 characters per post. Instagram captions allow up to 2,200 characters. Our counter helps you stay within these limits." },
    { q: "What are keyword density and keyword frequency?", a: "Keyword frequency is how many times a word appears. Keyword density is frequency as a percentage of total words. Our top keywords section shows the most frequent words in your text." },
  ],
  "base64-tool": [
    { q: "What is Base64 encoding?", a: "Base64 is a binary-to-text encoding scheme that converts any binary data (images, files, binary strings) into a string of 64 printable ASCII characters, safe for text-based transport." },
    { q: "Why is Base64 used?", a: "Common uses: embedding images directly in HTML/CSS as data URIs, encoding email attachments (MIME), storing binary data in JSON, and transmitting binary data in URLs or APIs." },
    { q: "Does Base64 encoding increase file size?", a: "Yes, Base64 increases data size by approximately 33% because every 3 bytes of data becomes 4 characters. This is the trade-off for text compatibility." },
    { q: "Is Base64 the same as encryption?", a: "No. Base64 is encoding, not encryption. It only converts format — anyone can decode it without any key. Never use Base64 for security purposes." },
    { q: "What is the difference between Base64 and Base64 URL?", a: "Standard Base64 uses + and / which are not URL-safe. Base64 URL encoding replaces + with - and / with _, making it safe for use in URLs and JWT tokens." },
  ],
  "text-case-converter": [
    { q: "What is camelCase?", a: "camelCase writes compound words without spaces, with each word after the first capitalized. Used for variable and function names in JavaScript and Java: e.g., userFirstName." },
    { q: "What is snake_case?", a: "snake_case separates words with underscores in lowercase. Commonly used in Python variable names, database column names, and file names: e.g., user_first_name." },
    { q: "What is PascalCase?", a: "PascalCase capitalizes the first letter of every word with no separators. Used for class and component names in Java, C#, and React: e.g., UserFirstName." },
    { q: "What is kebab-case?", a: "kebab-case uses hyphens between lowercase words. Commonly used in CSS class names, HTML attributes, and URL slugs: e.g., user-first-name." },
    { q: "What is Title Case?", a: "Title Case capitalizes the first letter of each major word. Used in article headings, book titles, and proper nouns. Minor words like 'and', 'the', 'of' are typically lowercase." },
    { q: "What is SCREAMING_SNAKE_CASE?", a: "SCREAMING_SNAKE_CASE is all uppercase with underscores. Used for constants in many programming languages: e.g., MAX_RETRY_ATTEMPTS." },
  ],
  "salary-slip-generator": [
    { q: "What is a salary slip?", a: "A salary slip is an official document issued by an employer each month detailing an employee's earnings (basic, HRA, allowances) and deductions (PF, TDS, professional tax), along with net take-home pay." },
    { q: "Is a salary slip legally mandatory in India?", a: "While not explicitly mandated by a central law for all employers, salary slips are required by most labor laws for maintaining records. They are essential for loan applications, visa processing, and ITR filing." },
    { q: "What are the main components of a salary slip?", a: "Earnings: Basic salary, HRA, Conveyance allowance, Medical allowance, Special allowance. Deductions: Employee PF (12% of basic), TDS, Professional tax, ESIC. Net pay = Gross earnings minus total deductions." },
    { q: "How is basic salary typically set?", a: "Basic salary is usually 40–50% of CTC. HRA is 40–50% of basic salary (40% for non-metro, 50% for metro cities). Higher basic means higher PF deduction but also better HRA exemption." },
    { q: "Can a salary slip be used as proof of income?", a: "Yes, salary slips are widely accepted as income proof for home loans, personal loans, credit cards, rent agreements, and visa applications." },
  ],
  "invoice-generator": [
    { q: "What makes a GST invoice legally valid in India?", a: "A valid GST invoice must include: supplier name, address, and GSTIN; buyer details; unique serial invoice number; date; HSN/SAC code; item description with quantity and rate; taxable value; applicable GST (CGST+SGST or IGST); and total amount." },
    { q: "What is the difference between CGST+SGST and IGST on invoices?", a: "For intra-state supply (buyer and seller in same state), use CGST + SGST each at half the GST rate. For inter-state supply, use IGST at the full GST rate." },
    { q: "What is an E-Invoice?", a: "E-Invoicing is mandatory for GST-registered businesses with turnover above ₹5 crore. It involves generating an Invoice Reference Number (IRN) from the GST portal to validate each invoice digitally." },
    { q: "What is HSN code?", a: "Harmonised System of Nomenclature (HSN) code classifies goods for GST purposes. Businesses with turnover over ₹5 crore must use 6-digit HSN codes; others use 4-digit codes." },
    { q: "What is a Debit Note and Credit Note?", a: "A Debit Note increases the taxable value of a supply (issued when you charge more than invoiced). A Credit Note reduces it (issued for returns or overcharging). Both must be reported in GST returns." },
  ],
  "number-base-converter": [
    { q: "What is binary (base-2)?", a: "Binary is the base-2 numeral system using only 0 and 1. It is the fundamental language of computers, where each digit represents a power of 2 and maps directly to electronic on/off states." },
    { q: "What is hexadecimal (base-16)?", a: "Hexadecimal uses digits 0–9 and letters A–F to represent values 0–15. It is widely used in programming for representing memory addresses, HTML color codes (#FF6200), and binary data compactly." },
    { q: "How do I convert decimal to binary?", a: "Repeatedly divide the number by 2 and record the remainders. Read remainders from bottom to top. Example: 13 ÷ 2 = 6 R1, 6 ÷ 2 = 3 R0, 3 ÷ 2 = 1 R1, 1 ÷ 2 = 0 R1 → 1101 in binary." },
    { q: "Why do computers use binary?", a: "Digital circuits operate on two stable voltage states (high/low, on/off), which naturally represent 1 and 0. Binary arithmetic is implemented efficiently using logic gates in hardware." },
    { q: "What is an octal number?", a: "Octal is base-8, using digits 0–7. It was historically used in computing because 3 binary bits represent exactly one octal digit. It's still used in Unix file permissions (chmod 755)." },
  ],
  "timestamp-converter": [
    { q: "What is a Unix timestamp?", a: "A Unix timestamp (epoch time) is the number of seconds elapsed since January 1, 1970, at 00:00:00 UTC. It is timezone-independent and universally used in programming to represent moments in time." },
    { q: "What is the current Unix timestamp?", a: "The current Unix timestamp changes every second. Our live display shows the exact current epoch time. As of mid-2025, it is approximately 1,750,000,000." },
    { q: "How do I convert Unix timestamp to IST?", a: "Add 5 hours and 30 minutes (19,800 seconds) to the UTC time. IST is UTC+5:30. Our converter handles this automatically and also shows UTC, ISO 8601, and relative time." },
    { q: "What is the Y2K38 problem?", a: "32-bit signed Unix timestamps will overflow (wrap to 1901) on January 19, 2038 at 03:14:07 UTC. Modern 64-bit systems won't face this issue for billions of years." },
    { q: "What is ISO 8601 date format?", a: "ISO 8601 is an international standard for date-time representation: YYYY-MM-DDTHH:MM:SSZ. Example: 2025-06-24T10:30:00Z. The Z indicates UTC timezone." },
  ],
  "regex-tester": [
    { q: "What is a regular expression (regex)?", a: "A regular expression is a sequence of characters that defines a search pattern. It's used for string matching, validation (email, phone number), text extraction, and find-and-replace operations in programming." },
    { q: "What does the global (g) flag do?", a: "The global flag makes the regex engine find all matches in the text instead of stopping after the first match. Without it, only the first occurrence is returned." },
    { q: "How do I validate an Indian mobile number with regex?", a: "Use the pattern ^[6-9]\\d{9}$ — it matches 10-digit Indian mobile numbers starting with 6, 7, 8, or 9 (the valid prefixes for Indian mobile numbers)." },
    { q: "What is a capture group?", a: "A capture group (enclosed in parentheses) captures part of the matched string for reuse. Example: (\\d{4})-(\\d{2})-(\\d{2}) captures year, month, and day separately from a date string." },
    { q: "What do ^ and $ mean in regex?", a: "^ matches the start of the string (or line in multiline mode). $ matches the end. Together, they ensure the entire string must match the pattern, not just a substring." },
    { q: "How do I validate a PAN card number with regex?", a: "Use ^[A-Z]{5}[0-9]{4}[A-Z]{1}$ — it matches the PAN format: 5 uppercase letters, 4 digits, 1 uppercase letter. Example: ABCDE1234F." },
  ],
  "jwt-decoder": [
    { q: "What is a JWT?", a: "A JSON Web Token (JWT) is a compact, URL-safe string representing claims between two parties. It consists of three base64url-encoded parts separated by dots: Header.Payload.Signature." },
    { q: "Is it safe to decode a JWT online?", a: "Only decode test or non-sensitive tokens publicly. Never paste real user session tokens, auth tokens, or JWTs containing sensitive data into any online tool, including ours." },
    { q: "What is the JWT 'exp' claim?", a: "The 'exp' (expiration time) claim is a Unix timestamp after which the token must not be accepted. Our decoder clearly shows whether the token is currently valid or expired." },
    { q: "What algorithms do JWTs use?", a: "Common algorithms: HS256 (HMAC-SHA256, symmetric key), RS256 (RSA with public/private key pair), ES256 (ECDSA). The algorithm is specified in the 'alg' field of the JWT header." },
    { q: "Can I decode a JWT without the secret key?", a: "Yes. The header and payload are only base64url-encoded, not encrypted — anyone can decode and read them. The secret key is only needed to verify the signature's authenticity." },
    { q: "What is the difference between JWT and a session token?", a: "Session tokens are opaque random strings; the server stores session data. JWTs are self-contained — the server encodes data into the token itself and doesn't need to store it, enabling stateless authentication." },
  ],
  "markdown-converter": [
    { q: "What is Markdown?", a: "Markdown is a lightweight markup language with plain text formatting syntax. Created by John Gruber in 2004, it converts to HTML and is widely used for READMEs, documentation, blogs, and content management." },
    { q: "How do I create a table in Markdown?", a: "Use pipes and hyphens: | Header 1 | Header 2 | on the first line, | --- | --- | on the second, then data rows. Columns are separated by pipe characters." },
    { q: "Can I export Markdown to PDF?", a: "Yes, our Markdown Converter lets you export to PDF, Word DOCX, or HTML with a live preview. The PDF export formats your document with proper typography and styling." },
    { q: "What is the difference between Markdown and Rich Text?", a: "Markdown uses plain text with special characters for formatting (# for heading, ** for bold). Rich Text (RTF) stores formatting as metadata. Markdown is more portable and version-control friendly." },
  ],
  "color-converter": [
    { q: "What is the HEX color format?", a: "HEX is a 6-character hexadecimal code prefixed with # used in web design. Each pair of characters represents Red, Green, Blue (00–FF). Example: #FF6200 is orange." },
    { q: "What is RGB color?", a: "RGB specifies color by Red, Green, Blue intensity (0–255 each). rgb(255, 98, 0) is equivalent to #FF6200. Used in CSS, image editing, and screen displays." },
    { q: "What is HSL color?", a: "HSL represents color as Hue (0–360°), Saturation (0–100%), and Lightness (0–100%). It is more intuitive for adjusting color shades and tints than RGB or HEX." },
    { q: "Why do colors look different on screen vs print?", a: "Screens use additive RGB color (light-based). Printers use subtractive CMYK color (ink-based). Converting between them may shift colors, which is why screen designs look different when printed." },
  ],
};

