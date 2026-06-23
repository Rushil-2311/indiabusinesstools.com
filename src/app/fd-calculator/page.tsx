"use client";
import { useState, useMemo } from "react";
import { PiggyBank } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/PageHeader";

const BANK_PRESETS = [
  { name: "Custom", rate: 0 },
  { name: "SBI (1 yr)", rate: 6.8 },
  { name: "SBI (2 yr)", rate: 7.0 },
  { name: "HDFC (1 yr)", rate: 7.1 },
  { name: "HDFC (2 yr)", rate: 7.25 },
  { name: "ICICI (1 yr)", rate: 6.9 },
  { name: "ICICI (2 yr)", rate: 7.1 },
  { name: "Axis (1 yr)", rate: 7.1 },
  { name: "Kotak (1 yr)", rate: 7.1 },
  { name: "Post Office", rate: 7.5 },
];

const COMPOUNDING = [
  { label: "Monthly", n: 12 },
  { label: "Quarterly", n: 4 },
  { label: "Half-Yearly", n: 2 },
  { label: "Yearly", n: 1 },
];

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}

export default function FDCalculatorPage() {
  const [principal, setPrincipal] = useState("1,00,000");
  const [rate, setRate] = useState("7.1");
  const [tenureYears, setTenureYears] = useState(3);
  const [tenureMonths, setTenureMonths] = useState(0);
  const [compIdx, setCompIdx] = useState(1);
  const [selectedBank, setSelectedBank] = useState(0);

  const principalNum = parseFloat(principal.replace(/,/g, "")) || 0;
  const rateNum = parseFloat(rate) || 0;
  const n = COMPOUNDING[compIdx].n;
  const totalMonths = tenureYears * 12 + tenureMonths;
  const t = totalMonths / 12;

  const maturity = useMemo(() => {
    if (!principalNum || !rateNum || !t) return 0;
    return principalNum * Math.pow(1 + rateNum / 100 / n, n * t);
  }, [principalNum, rateNum, n, t]);

  const interest = maturity - principalNum;

  const yearlyRows = useMemo(() => {
    const rows = [];
    for (let y = 1; y <= Math.ceil(t); y++) {
      const yr = Math.min(y, t);
      const bal = principalNum * Math.pow(1 + rateNum / 100 / n, n * yr);
      rows.push({ year: y, balance: bal, interest: bal - principalNum });
    }
    return rows;
  }, [principalNum, rateNum, n, t]);

  function handleBankSelect(idx: number) {
    setSelectedBank(idx);
    if (BANK_PRESETS[idx].rate > 0) setRate(BANK_PRESETS[idx].rate.toString());
  }

  function handlePrincipalChange(val: string) {
    const num = val.replace(/[^0-9]/g, "");
    if (!num) { setPrincipal(""); return; }
    setPrincipal(new Intl.NumberFormat("en-IN").format(parseInt(num)));
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="FD Calculator"
        description="Calculate Fixed Deposit maturity with bank rate presets"
        icon={PiggyBank}
        gradient="from-green-500 to-emerald-700"
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-10 grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardHeader><CardTitle>FD Details</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            {/* Bank Presets */}
            <div>
              <Label className="mb-2 block">Bank Preset</Label>
              <div className="flex flex-wrap gap-2">
                {BANK_PRESETS.map((b, i) => (
                  <button
                    key={b.name}
                    onClick={() => handleBankSelect(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      selectedBank === i
                        ? "bg-green-600 text-white border-green-600"
                        : "border-border text-muted-foreground hover:border-green-500 hover:text-green-600"
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="principal">Principal Amount (₹)</Label>
              <Input
                id="principal"
                value={principal}
                onChange={(e) => handlePrincipalChange(e.target.value)}
                className="mt-1"
                placeholder="1,00,000"
              />
            </div>

            <div>
              <Label htmlFor="rate">Annual Interest Rate (%)</Label>
              <Input
                id="rate"
                type="number"
                value={rate}
                onChange={(e) => { setRate(e.target.value); setSelectedBank(0); }}
                className="mt-1"
                step="0.05"
                min="1"
                max="15"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Tenure — Years</Label>
                <div className="mt-1 space-y-1">
                  <input
                    type="range" min={0} max={30} value={tenureYears}
                    onChange={(e) => setTenureYears(+e.target.value)}
                    className="w-full accent-green-600"
                  />
                  <div className="text-center text-sm font-semibold text-green-700">{tenureYears} yr</div>
                </div>
              </div>
              <div>
                <Label>Tenure — Months</Label>
                <div className="mt-1 space-y-1">
                  <input
                    type="range" min={0} max={11} value={tenureMonths}
                    onChange={(e) => setTenureMonths(+e.target.value)}
                    className="w-full accent-green-600"
                  />
                  <div className="text-center text-sm font-semibold text-green-700">{tenureMonths} mo</div>
                </div>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Compounding Frequency</Label>
              <div className="grid grid-cols-2 gap-2">
                {COMPOUNDING.map((c, i) => (
                  <button
                    key={c.label}
                    onClick={() => setCompIdx(i)}
                    className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                      compIdx === i
                        ? "bg-green-600 text-white border-green-600"
                        : "border-border text-muted-foreground hover:border-green-500"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              * Rates are indicative. Actual rates may vary. Senior citizens typically get +0.25–0.5%.
            </p>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <Card className="border-green-200 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardContent className="pt-6 space-y-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Maturity Amount</div>
                <div className="text-4xl font-bold text-green-700 mt-1">₹{fmt(maturity)}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl bg-white dark:bg-background p-3 text-center shadow-sm">
                  <div className="text-xs text-muted-foreground">Principal</div>
                  <div className="text-lg font-bold text-foreground mt-0.5">₹{fmt(principalNum)}</div>
                </div>
                <div className="rounded-xl bg-white dark:bg-background p-3 text-center shadow-sm">
                  <div className="text-xs text-muted-foreground">Interest Earned</div>
                  <div className="text-lg font-bold text-green-600 mt-0.5">₹{fmt(interest)}</div>
                </div>
              </div>
              <div className="rounded-xl bg-white dark:bg-background p-3 text-center shadow-sm">
                <div className="text-xs text-muted-foreground">Effective Yield</div>
                <div className="text-lg font-bold text-foreground mt-0.5">
                  {principalNum > 0 && t > 0
                    ? ((interest / principalNum / t) * 100).toFixed(2)
                    : "0.00"}% p.a.
                </div>
              </div>
              {/* Visual bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Principal</span><span>Interest</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden flex">
                  <div
                    className="bg-green-400 transition-all"
                    style={{ width: maturity > 0 ? `${(principalNum / maturity) * 100}%` : "100%" }}
                  />
                  <div className="bg-green-600 flex-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Year-by-year table */}
          {yearlyRows.length > 0 && (
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Year-by-Year Growth</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="px-4 py-2 text-left font-semibold">Year</th>
                        <th className="px-4 py-2 text-right font-semibold">Balance</th>
                        <th className="px-4 py-2 text-right font-semibold">Interest</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearlyRows.map((r) => (
                        <tr key={r.year} className="border-b last:border-0 hover:bg-muted/30">
                          <td className="px-4 py-2 text-muted-foreground">Year {r.year}</td>
                          <td className="px-4 py-2 text-right font-medium">₹{fmt(r.balance)}</td>
                          <td className="px-4 py-2 text-right text-green-600">₹{fmt(r.interest)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
