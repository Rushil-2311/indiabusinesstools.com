"use client";
import { useState, useMemo } from "react";
import { FileSpreadsheet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/PageHeader";

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}

// New Regime slabs FY 2025-26 (Budget 2025)
const NEW_SLABS = [
  { from: 0, to: 400000, rate: 0 },
  { from: 400000, to: 800000, rate: 5 },
  { from: 800000, to: 1200000, rate: 10 },
  { from: 1200000, to: 1600000, rate: 15 },
  { from: 1600000, to: 2000000, rate: 20 },
  { from: 2000000, to: 2400000, rate: 25 },
  { from: 2400000, to: Infinity, rate: 30 },
];

// Old Regime slabs (below 60)
const OLD_SLABS_BELOW60 = [
  { from: 0, to: 250000, rate: 0 },
  { from: 250000, to: 500000, rate: 5 },
  { from: 500000, to: 1000000, rate: 20 },
  { from: 1000000, to: Infinity, rate: 30 },
];

// Old Regime slabs (60-80)
const OLD_SLABS_60_80 = [
  { from: 0, to: 300000, rate: 0 },
  { from: 300000, to: 500000, rate: 5 },
  { from: 500000, to: 1000000, rate: 20 },
  { from: 1000000, to: Infinity, rate: 30 },
];

// Old Regime slabs (above 80)
const OLD_SLABS_ABOVE80 = [
  { from: 0, to: 500000, rate: 0 },
  { from: 500000, to: 1000000, rate: 20 },
  { from: 1000000, to: Infinity, rate: 30 },
];

function calcTax(income: number, slabs: typeof NEW_SLABS) {
  let tax = 0;
  for (const slab of slabs) {
    if (income <= slab.from) break;
    const taxable = Math.min(income, slab.to) - slab.from;
    tax += taxable * (slab.rate / 100);
  }
  return tax;
}

function applyRebate87A(tax: number, taxableIncome: number, limit: number, maxRebate: number) {
  if (taxableIncome <= limit) return 0;
  return tax;
}

export default function IncomeTaxCalculatorPage() {
  const [grossIncome, setGrossIncome] = useState("10,00,000");
  const [age, setAge] = useState<"below60" | "60to80" | "above80">("below60");
  // Old regime deductions
  const [sec80C, setSec80C] = useState("1,50,000");
  const [sec80D, setSec80D] = useState("25,000");
  const [homeLoanInt, setHomeLoanInt] = useState("0");
  const [nps, setNps] = useState("0");
  const [otherDeductions, setOtherDeductions] = useState("0");

  const grossNum = parseFloat(grossIncome.replace(/,/g, "")) || 0;
  const c80C = Math.min(parseFloat(sec80C.replace(/,/g, "")) || 0, 150000);
  const c80D = Math.min(parseFloat(sec80D.replace(/,/g, "")) || 0, age === "below60" ? 25000 : 50000);
  const cHL = Math.min(parseFloat(homeLoanInt.replace(/,/g, "")) || 0, 200000);
  const cNPS = Math.min(parseFloat(nps.replace(/,/g, "")) || 0, 50000);
  const cOther = parseFloat(otherDeductions.replace(/,/g, "")) || 0;

  const result = useMemo(() => {
    // --- New Regime ---
    const newStdDeduction = 75000;
    const newTaxableIncome = Math.max(0, grossNum - newStdDeduction);
    let newTax = calcTax(newTaxableIncome, NEW_SLABS);
    // Rebate: if taxable income <= 12L, tax = 0 (rebate up to 60,000)
    if (newTaxableIncome <= 1200000) newTax = 0;
    const newCess = newTax * 0.04;
    const newTotal = newTax + newCess;

    // --- Old Regime ---
    const oldStdDeduction = 50000;
    const oldSlabs = age === "below60" ? OLD_SLABS_BELOW60 : age === "60to80" ? OLD_SLABS_60_80 : OLD_SLABS_ABOVE80;
    const totalDeductions = oldStdDeduction + c80C + c80D + cHL + cNPS + cOther;
    const oldTaxableIncome = Math.max(0, grossNum - totalDeductions);
    let oldTax = calcTax(oldTaxableIncome, oldSlabs);
    // Rebate 87A for old regime: taxable <= 5L → 0 tax (rebate max 12,500)
    if (oldTaxableIncome <= 500000) oldTax = 0;
    const oldCess = oldTax * 0.04;
    const oldTotal = oldTax + oldCess;

    const savings = Math.abs(newTotal - oldTotal);
    const betterRegime = newTotal <= oldTotal ? "new" : "old";

    return {
      new: { taxable: newTaxableIncome, tax: newTax, cess: newCess, total: newTotal, stdDeduction: newStdDeduction },
      old: { taxable: oldTaxableIncome, tax: oldTax, cess: oldCess, total: oldTotal, totalDeductions, stdDeduction: oldStdDeduction },
      savings,
      betterRegime,
    };
  }, [grossNum, age, c80C, c80D, cHL, cNPS, cOther]);

  function fmtInput(val: string, setter: (v: string) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = e.target.value.replace(/[^0-9]/g, "");
      if (!num) { setter(""); return; }
      setter(new Intl.NumberFormat("en-IN").format(parseInt(num)));
    };
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Income Tax Calculator"
        description="New vs Old Regime comparison — FY 2025-26"
        icon={FileSpreadsheet}
        gradient="from-red-500 to-rose-700"
      />

      <div className="mx-auto max-w-5xl px-4 pb-10 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Income Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="income">Annual Gross Income (₹)</Label>
                  <Input id="income" value={grossIncome} onChange={fmtInput(grossIncome, setGrossIncome)} className="mt-1" placeholder="10,00,000" />
                </div>
                <div>
                  <Label className="mb-2 block">Age Group</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: "below60", label: "Below 60" },
                      { val: "60to80", label: "60 – 80" },
                      { val: "above80", label: "Above 80" },
                    ].map((a) => (
                      <button
                        key={a.val}
                        onClick={() => setAge(a.val as typeof age)}
                        className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                          age === a.val ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground/40"
                        }`}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Old Regime Deductions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Section 80C (PF, PPF, ELSS, LIC)", val: sec80C, set: setSec80C, cap: "Max ₹1,50,000" },
                  { label: "Section 80D (Health Insurance)", val: sec80D, set: setSec80D, cap: age === "below60" ? "Max ₹25,000" : "Max ₹50,000" },
                  { label: "Home Loan Interest (Sec 24b)", val: homeLoanInt, set: setHomeLoanInt, cap: "Max ₹2,00,000" },
                  { label: "NPS Contribution (80CCD 1B)", val: nps, set: setNps, cap: "Max ₹50,000" },
                  { label: "Other Deductions", val: otherDeductions, set: setOtherDeductions, cap: "" },
                ].map((item) => (
                  <div key={item.label}>
                    <Label className="text-xs">{item.label}</Label>
                    <Input value={item.val} onChange={fmtInput(item.val, item.set)} className="mt-1 h-8 text-sm" placeholder="0" />
                    {item.cap && <p className="text-xs text-muted-foreground mt-0.5">{item.cap}</p>}
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">Standard deduction of ₹50,000 applied automatically</p>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {/* Recommendation */}
            <Card className="border-2 border-foreground">
              <CardContent className="pt-5 text-center space-y-1">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recommended Regime</div>
                <div className="text-2xl font-bold">
                  {result.betterRegime === "new" ? "New Regime" : "Old Regime"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Saves you <span className="font-bold text-foreground">₹{fmt(result.savings)}</span> more
                </div>
              </CardContent>
            </Card>

            {/* Side-by-side */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "New Regime", data: result.new, regime: "new" },
                { label: "Old Regime", data: result.old, regime: "old" },
              ].map(({ label, data, regime }) => {
                const isBetter = result.betterRegime === regime;
                return (
                  <Card key={regime} className={isBetter ? "ring-2 ring-foreground" : "opacity-80"}>
                    <CardContent className="pt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{label}</span>
                        {isBetter && <span className="text-xs bg-foreground text-background px-1.5 py-0.5 rounded font-medium">Best</span>}
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Taxable Income</div>
                        <div className="font-bold text-sm">₹{fmt(data.taxable)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Income Tax</div>
                        <div className="font-bold text-sm">₹{fmt(data.tax)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Cess (4%)</div>
                        <div className="font-bold text-sm">₹{fmt(data.cess)}</div>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="text-xs text-muted-foreground">Total Tax</div>
                        <div className="text-xl font-bold">₹{fmt(data.total)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Monthly Tax</div>
                        <div className="font-bold text-sm">₹{fmt(data.total / 12)}</div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Slab breakdown — New Regime */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">New Regime Slab Breakdown</CardTitle></CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="px-3 py-2 text-left">Slab</th>
                      <th className="px-3 py-2 text-right">Rate</th>
                      <th className="px-3 py-2 text-right">Tax</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NEW_SLABS.map((s, i) => {
                      if (result.new.taxable <= s.from) return null;
                      const taxable = Math.min(result.new.taxable, s.to === Infinity ? result.new.taxable : s.to) - s.from;
                      const tax = taxable * s.rate / 100;
                      return (
                        <tr key={i} className="border-b last:border-0">
                          <td className="px-3 py-1.5 text-muted-foreground">
                            ₹{fmt(s.from / 100000)}L – {s.to === Infinity ? "above" : `₹${fmt(s.to / 100000)}L`}
                          </td>
                          <td className="px-3 py-1.5 text-right">{s.rate}%</td>
                          <td className="px-3 py-1.5 text-right font-medium">₹{fmt(tax)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          * This calculator is for indicative purposes. Consult a tax professional for filing. Surcharge not included.
        </p>
      </div>
    </div>
  );
}
