"use client";
import { useState, useMemo } from "react";
import { Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/PageHeader";
import { FaqSection } from "@/components/shared/FaqSection";
import { ToolDescription } from "@/components/shared/ToolDescription";
import { RelatedTools } from "@/components/shared/RelatedTools";
import { faqs, toolDescriptions } from "@/lib/data";

function fmt(n: number, decimals = 0) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: decimals }).format(n);
}

const PT_SLABS: Record<string, number> = {
  "Karnataka": 2400,
  "Maharashtra": 2500,
  "West Bengal": 2400,
  "Andhra Pradesh": 2400,
  "Telangana": 2400,
  "Tamil Nadu": 1800,
  "Gujarat": 0,
  "Delhi": 0,
  "Other / None": 0,
};

export default function CTCCalculatorPage() {
  const [ctc, setCtc] = useState("12,00,000");
  const [basicPercent, setBasicPercent] = useState(40);
  const [hraPercent, setHraPercent] = useState(50);
  const [view, setView] = useState<"monthly" | "annual">("monthly");
  const [ptState, setPtState] = useState("Karnataka");
  const [isMetro, setIsMetro] = useState(true);

  const ctcNum = parseFloat(ctc.replace(/,/g, "")) || 0;

  const salary = useMemo(() => {
    const annualCTC = ctcNum;
    const basic = annualCTC * (basicPercent / 100);
    const hra = basic * (hraPercent / 100);
    const gratuity = basic * 0.0481;
    const employerPF = Math.min(basic * 0.12, 21600);
    const specialAllowance = annualCTC - basic - hra - gratuity - employerPF;

    const grossSalary = basic + hra + specialAllowance;

    // Deductions
    const employeePF = Math.min(basic * 0.12, 21600);
    const ptAnnual = PT_SLABS[ptState] ?? 0;
    // Simplified TDS (new regime, 75k std deduction)
    const taxableIncome = Math.max(0, grossSalary - 75000 - employeePF);
    const tds = taxableIncome <= 1200000 ? 0 : (() => {
      const NEW_SLABS = [
        { from: 0, to: 400000, rate: 0 },
        { from: 400000, to: 800000, rate: 5 },
        { from: 800000, to: 1200000, rate: 10 },
        { from: 1200000, to: 1600000, rate: 15 },
        { from: 1600000, to: 2000000, rate: 20 },
        { from: 2000000, to: 2400000, rate: 25 },
        { from: 2400000, to: Infinity, rate: 30 },
      ];
      let t = 0;
      for (const s of NEW_SLABS) {
        if (taxableIncome <= s.from) break;
        t += (Math.min(taxableIncome, s.to === Infinity ? taxableIncome : s.to) - s.from) * s.rate / 100;
      }
      return t * 1.04;
    })();

    const totalDeductions = employeePF + ptAnnual + tds;
    const netInHand = grossSalary - totalDeductions;

    return {
      basic, hra, specialAllowance, gratuity, employerPF, grossSalary,
      employeePF, ptAnnual, tds, totalDeductions, netInHand, annualCTC,
    };
  }, [ctcNum, basicPercent, hraPercent, ptState]);

  const div = view === "monthly" ? 12 : 1;

  function handleCTCChange(e: React.ChangeEvent<HTMLInputElement>) {
    const num = e.target.value.replace(/[^0-9]/g, "");
    if (!num) { setCtc(""); return; }
    setCtc(new Intl.NumberFormat("en-IN").format(parseInt(num)));
  }

  const earningsRows = [
    { label: "Basic Salary", val: salary.basic },
    { label: `HRA (${hraPercent}% of Basic)`, val: salary.hra },
    { label: "Special Allowance", val: salary.specialAllowance },
  ];

  const employerRows = [
    { label: "Employer PF (12% of Basic)", val: salary.employerPF },
    { label: "Gratuity (4.81% of Basic)", val: salary.gratuity },
  ];

  const deductionRows = [
    { label: "Employee PF (12% of Basic)", val: salary.employeePF },
    { label: `Professional Tax (${ptState})`, val: salary.ptAnnual },
    { label: "TDS (Estimated, New Regime)", val: salary.tds },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Salary / CTC Calculator"
        description="Break down your CTC into monthly in-hand salary"
        icon={Briefcase}
        gradient="from-indigo-600 to-blue-800"
        breadcrumbs={[{ name: "Tax & Payroll" }, { name: "Salary / CTC Calculator" }]}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-10 grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardHeader><CardTitle>CTC Details</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label htmlFor="ctc">Annual CTC (₹)</Label>
              <Input id="ctc" value={ctc} onChange={handleCTCChange} className="mt-1" placeholder="12,00,000" />
            </div>

            <div>
              <Label>Basic Salary — {basicPercent}% of CTC</Label>
              <input
                type="range" min={30} max={60} value={basicPercent}
                onChange={(e) => setBasicPercent(+e.target.value)}
                className="w-full mt-2 accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>30%</span><span>60%</span>
              </div>
            </div>

            <div>
              <Label>HRA — {hraPercent}% of Basic</Label>
              <input
                type="range" min={40} max={60} value={hraPercent}
                onChange={(e) => setHraPercent(+e.target.value)}
                className="w-full mt-2 accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>40% (Non-metro)</span><span>60%</span>
              </div>
            </div>

            <div>
              <Label htmlFor="pt">Professional Tax State</Label>
              <select
                id="pt"
                value={ptState}
                onChange={(e) => setPtState(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {Object.keys(PT_SLABS).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setView("monthly")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${view === "monthly" ? "bg-indigo-600 text-white border-indigo-600" : "border-border text-muted-foreground hover:border-indigo-400"}`}
              >
                Monthly View
              </button>
              <button
                onClick={() => setView("annual")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${view === "annual" ? "bg-indigo-600 text-white border-indigo-600" : "border-border text-muted-foreground hover:border-indigo-400"}`}
              >
                Annual View
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {/* In-hand highlight */}
          <Card className="border-indigo-200 bg-linear-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="text-sm text-muted-foreground">Monthly In-Hand Salary</div>
              <div className="text-4xl font-bold text-indigo-700">₹{fmt(salary.netInHand / 12)}</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white dark:bg-background p-3 shadow-sm">
                  <div className="text-xs text-muted-foreground">Monthly Gross</div>
                  <div className="font-bold text-sm mt-0.5">₹{fmt(salary.grossSalary / 12)}</div>
                </div>
                <div className="rounded-xl bg-white dark:bg-background p-3 shadow-sm">
                  <div className="text-xs text-muted-foreground">Monthly Deductions</div>
                  <div className="font-bold text-sm text-red-500 mt-0.5">₹{fmt(salary.totalDeductions / 12)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Earnings table */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-green-600">Earnings ({view})</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <tbody>
                  {earningsRows.map((r) => (
                    <tr key={r.label} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-2 text-muted-foreground">{r.label}</td>
                      <td className="px-4 py-2 text-right font-medium text-green-600">₹{fmt(r.val / div)}</td>
                    </tr>
                  ))}
                  <tr className="bg-green-50 dark:bg-green-950/20 border-b">
                    <td className="px-4 py-2 font-semibold">Gross Salary</td>
                    <td className="px-4 py-2 text-right font-bold text-green-700">₹{fmt(salary.grossSalary / div)}</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Deductions table */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-red-500">Deductions ({view})</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <tbody>
                  {deductionRows.map((r) => (
                    <tr key={r.label} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-2 text-muted-foreground">{r.label}</td>
                      <td className="px-4 py-2 text-right font-medium text-red-500">₹{fmt(r.val / div)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Employer cost */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-amber-600">Employer Cost (CTC Components)</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <tbody>
                  {employerRows.map((r) => (
                    <tr key={r.label} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-2 text-muted-foreground">{r.label}</td>
                      <td className="px-4 py-2 text-right font-medium text-amber-600">₹{fmt(r.val / div)}</td>
                    </tr>
                  ))}
                  <tr className="bg-amber-50 dark:bg-amber-950/20">
                    <td className="px-4 py-2 font-semibold">Total CTC</td>
                    <td className="px-4 py-2 text-right font-bold text-amber-700">₹{fmt(salary.annualCTC / div)}</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
          <p className="text-xs text-muted-foreground">* TDS is estimated. Actual deductions depend on employer, investments declared, and other factors.</p>
        </div>
        <ToolDescription toolName="CTC Calculator" data={toolDescriptions["ctc-calculator"]} />
        <FaqSection faqs={faqs["ctc-calculator"]} />
      </div>
      <RelatedTools currentSlug="ctc-calculator" />
    </div>
  );
}
