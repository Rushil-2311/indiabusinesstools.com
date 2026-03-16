import { 
  TrendingUp, 
  Landmark, 
  Receipt, 
  Percent, 
  CalendarDays, 
  CaseSensitive, 
  Braces 
} from "lucide-react";

export const toolsData = [
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
  }
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
