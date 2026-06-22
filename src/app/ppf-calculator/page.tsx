"use client";
import { useState, useMemo } from "react";
import { Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const PPF_RATE = 7.1;

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}

export default function PPFCalculatorPage() {
  const [annualDeposit, setAnnualDeposit] = useState("1,50,000");
  const [tenure, setTenure] = useState(15);

  const depositNum = parseFloat(annualDeposit.replace(/,/g, "")) || 0;

  const rows = useMemo(() => {
    const r = PPF_RATE / 100;
    const result = [];
    let balance = 0;
    let totalDeposited = 0;
    for (let y = 1; y <= tenure; y++) {
      const opening = balance;
      totalDeposited += depositNum;
      const interest = (opening + depositNum) * r;
      balance = opening + depositNum + interest;
      result.push({ year: y, opening, deposit: depositNum, interest, closing: balance, totalDeposited });
    }
    return result;
  }, [depositNum, tenure]);

  const last = rows[rows.length - 1] ?? { closing: 0, totalDeposited: 0, interest: 0 };
  const totalInterest = last.closing - last.totalDeposited;
  const taxSaving = depositNum * 0.3;

  function handleDepositChange(val: string) {
    const num = val.replace(/[^0-9]/g, "");
    if (!num) { setAnnualDeposit(""); return; }
    const capped = Math.min(parseInt(num), 150000);
    setAnnualDeposit(new Intl.NumberFormat("en-IN").format(capped));
  }

  const tenureOptions = [15, 20, 25, 30];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-linear-to-br from-sky-500 to-cyan-600 py-14 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur mb-4">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">PPF Calculator</h1>
          <p className="text-white/80 text-lg">Public Provident Fund returns at current 7.1% p.a.</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardHeader><CardTitle>PPF Details</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label htmlFor="deposit">Annual Deposit (₹)</Label>
              <Input
                id="deposit"
                value={annualDeposit}
                onChange={(e) => handleDepositChange(e.target.value)}
                className="mt-1"
                placeholder="1,50,000"
              />
              <p className="text-xs text-muted-foreground mt-1">Min ₹500 — Max ₹1,50,000 per year</p>
            </div>

            <div>
              <Label className="mb-2 block">Tenure</Label>
              <div className="grid grid-cols-4 gap-2">
                {tenureOptions.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTenure(t)}
                    className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                      tenure === t
                        ? "bg-sky-500 text-white border-sky-500"
                        : "border-border text-muted-foreground hover:border-sky-400"
                    }`}
                  >
                    {t} yr
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">PPF matures in 15 years, extendable by 5 years</p>
            </div>

            <div>
              <Label className="mb-1 block">Interest Rate</Label>
              <div className="rounded-xl border border-sky-200 bg-sky-50 dark:bg-sky-950/20 px-4 py-3">
                <div className="text-2xl font-bold text-sky-600">{PPF_RATE}% p.a.</div>
                <div className="text-xs text-muted-foreground mt-0.5">Government-set rate (Q1 FY 2025-26)</div>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 p-4 space-y-1">
              <div className="text-sm font-semibold text-amber-800 dark:text-amber-400">Tax Benefits (EEE Status)</div>
              <div className="text-xs text-muted-foreground">• Deposits deductible under Section 80C (up to ₹1.5L)</div>
              <div className="text-xs text-muted-foreground">• Interest earned is tax-free</div>
              <div className="text-xs text-muted-foreground">• Maturity amount is tax-free</div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <Card className="border-sky-200 bg-linear-to-br from-sky-50 to-cyan-50 dark:from-sky-950/20 dark:to-cyan-950/20">
            <CardContent className="pt-6 space-y-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Maturity Amount</div>
                <div className="text-4xl font-bold text-sky-600 mt-1">₹{fmt(last.closing)}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white dark:bg-background p-3 text-center shadow-sm">
                  <div className="text-xs text-muted-foreground">Total Deposited</div>
                  <div className="text-lg font-bold mt-0.5">₹{fmt(last.totalDeposited)}</div>
                </div>
                <div className="rounded-xl bg-white dark:bg-background p-3 text-center shadow-sm">
                  <div className="text-xs text-muted-foreground">Interest Earned</div>
                  <div className="text-lg font-bold text-sky-600 mt-0.5">₹{fmt(totalInterest)}</div>
                </div>
              </div>
              <div className="rounded-xl bg-white dark:bg-background p-3 text-center shadow-sm">
                <div className="text-xs text-muted-foreground">Approx. Tax Saved (30% slab)</div>
                <div className="text-lg font-bold text-amber-600 mt-0.5">₹{fmt(taxSaving * tenure)} over {tenure} yrs</div>
              </div>
              {/* Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Deposited</span><span>Interest</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden flex">
                  <div
                    className="bg-sky-300 transition-all"
                    style={{ width: last.closing > 0 ? `${(last.totalDeposited / last.closing) * 100}%` : "100%" }}
                  />
                  <div className="bg-sky-600 flex-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Year-by-Year Breakdown</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                    <tr className="border-b">
                      <th className="px-3 py-2 text-left font-semibold">Yr</th>
                      <th className="px-3 py-2 text-right font-semibold">Deposit</th>
                      <th className="px-3 py-2 text-right font-semibold">Interest</th>
                      <th className="px-3 py-2 text-right font-semibold">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.year} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-3 py-2 text-muted-foreground">{r.year}</td>
                        <td className="px-3 py-2 text-right">₹{fmt(r.deposit)}</td>
                        <td className="px-3 py-2 text-right text-sky-600">₹{fmt(r.interest)}</td>
                        <td className="px-3 py-2 text-right font-medium">₹{fmt(r.closing)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
