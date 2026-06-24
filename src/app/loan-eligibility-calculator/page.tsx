"use client";
import { useState, useMemo } from "react";
import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/PageHeader";
import { FaqSection } from "@/components/shared/FaqSection";
import { RelatedTools } from "@/components/shared/RelatedTools";
import { faqs } from "@/lib/data";

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}

function fmtInput(set: (v: string) => void) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value.replace(/[^0-9]/g, "");
    if (!num) { set(""); return; }
    set(new Intl.NumberFormat("en-IN").format(parseInt(num)));
  };
}

// Max loan = EMI × [(1+r)^n - 1] / [r × (1+r)^n]  — present value of annuity
function maxLoan(emi: number, annualRate: number, tenureYears: number): number {
  if (emi <= 0 || annualRate <= 0 || tenureYears <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = tenureYears * 12;
  return emi * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));
}

const LOAN_TYPES = [
  { name: "Home Loan", rate: 8.75, tenure: 20, color: "blue", icon: "🏠" },
  { name: "Car Loan", rate: 9.5, tenure: 7, color: "emerald", icon: "🚗" },
  { name: "Personal Loan", rate: 13.0, tenure: 5, color: "orange", icon: "💳" },
  { name: "Education Loan", rate: 10.5, tenure: 10, color: "purple", icon: "🎓" },
];

export default function LoanEligibilityCalculatorPage() {
  const [salary, setSalary] = useState("75,000");
  const [existingEmi, setExistingEmi] = useState("0");
  const [foir, setFoir] = useState(50);
  const [tenure, setTenure] = useState(20);
  const [rate, setRate] = useState("8.75");

  const salaryNum = parseFloat(salary.replace(/,/g, "")) || 0;
  const existingNum = parseFloat(existingEmi.replace(/,/g, "")) || 0;
  const rateNum = parseFloat(rate) || 0;

  const maxEmi = useMemo(() => Math.max(0, (salaryNum * foir) / 100 - existingNum), [salaryNum, existingNum, foir]);
  const eligibleLoan = useMemo(() => maxLoan(maxEmi, rateNum, tenure), [maxEmi, rateNum, tenure]);

  const loanBreakdown = useMemo(() =>
    LOAN_TYPES.map((lt) => ({
      ...lt,
      eligibleEmi: Math.max(0, (salaryNum * foir) / 100 - existingNum),
      amount: maxLoan(Math.max(0, (salaryNum * foir) / 100 - existingNum), lt.rate, lt.tenure),
    })),
  [salaryNum, existingNum, foir]);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Loan Eligibility Calculator" description="Find your maximum loan amount based on salary and FOIR" icon={CreditCard} gradient="from-cyan-600 to-blue-700" breadcrumbs={[{ name: "Finance & Investments" }, { name: "Loan Eligibility Calculator" }]} />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-10 grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardHeader><CardTitle>Your Financial Profile</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label>Monthly Net Take-Home Salary (₹)</Label>
              <Input value={salary} onChange={fmtInput(setSalary)} className="mt-1" placeholder="75,000" />
            </div>
            <div>
              <Label>Existing Monthly EMIs (₹)</Label>
              <Input value={existingEmi} onChange={fmtInput(setExistingEmi)} className="mt-1" placeholder="0" />
              <p className="text-xs text-muted-foreground mt-1">Credit card, existing loans, etc.</p>
            </div>
            <div>
              <Label>FOIR — {foir}% of salary allowed for EMI</Label>
              <input type="range" min={30} max={65} value={foir} onChange={(e) => setFoir(+e.target.value)} className="w-full mt-2 accent-cyan-600" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>30% (Conservative)</span><span>65% (Aggressive)</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Most banks use 40–50%. SBI allows up to 60%.</p>
            </div>
            <div>
              <Label>Loan Tenure — {tenure} Years</Label>
              <input type="range" min={1} max={30} value={tenure} onChange={(e) => setTenure(+e.target.value)} className="w-full mt-2 accent-cyan-600" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>1 yr</span><span>30 yrs</span></div>
            </div>
            <div>
              <Label>Annual Interest Rate (%)</Label>
              <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-1" step="0.25" min="5" max="30" />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <Card className="border-cyan-200 bg-linear-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20">
            <CardContent className="pt-6 space-y-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Maximum Eligible Loan</div>
                <div className="text-4xl font-bold text-cyan-700 mt-1">₹{fmt(eligibleLoan)}</div>
                <div className="text-xs text-muted-foreground mt-1">at {rateNum}% for {tenure} years</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white dark:bg-background p-3 text-center shadow-sm">
                  <div className="text-xs text-muted-foreground">Max Monthly EMI</div>
                  <div className="text-lg font-bold mt-0.5">₹{fmt(maxEmi)}</div>
                </div>
                <div className="rounded-xl bg-white dark:bg-background p-3 text-center shadow-sm">
                  <div className="text-xs text-muted-foreground">FOIR Used</div>
                  <div className="text-lg font-bold mt-0.5">{salaryNum > 0 ? (((existingNum + maxEmi) / salaryNum) * 100).toFixed(1) : 0}%</div>
                </div>
              </div>
              {/* Salary usage bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Existing EMI</span><span>New EMI</span><span>Free</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden flex">
                  <div className="bg-red-400" style={{ width: salaryNum > 0 ? `${(existingNum / salaryNum) * 100}%` : "0%" }} />
                  <div className="bg-cyan-500" style={{ width: salaryNum > 0 ? `${(maxEmi / salaryNum) * 100}%` : "0%" }} />
                  <div className="bg-green-400 flex-1" />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-red-500">₹{fmt(existingNum)}</span>
                  <span className="text-cyan-600">₹{fmt(maxEmi)}</span>
                  <span className="text-green-600">₹{fmt(Math.max(0, salaryNum - existingNum - maxEmi))}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loan type breakdown */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Eligibility by Loan Type</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {loanBreakdown.map((lt) => (
                <div key={lt.name} className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lt.icon}</span>
                    <div>
                      <div className="text-sm font-medium">{lt.name}</div>
                      <div className="text-xs text-muted-foreground">{lt.rate}% · {lt.tenure} yrs</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-cyan-700">₹{fmt(lt.amount)}</div>
                    <div className="text-xs text-muted-foreground">EMI: ₹{fmt(lt.eligibleEmi)}</div>
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-1">* Rates are indicative. Actual eligibility depends on credit score, employer, and bank policy.</p>
            </CardContent>
          </Card>
        </div>
        <FaqSection faqs={faqs["loan-eligibility-calculator"]} />
      </div>
      <RelatedTools currentSlug="loan-eligibility-calculator" />
    </div>
  );
}
