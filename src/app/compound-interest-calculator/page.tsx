"use client";
import { useState, useMemo } from "react";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/PageHeader";

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}

const FREQUENCIES = [
  { label: "Daily", n: 365 },
  { label: "Monthly", n: 12 },
  { label: "Quarterly", n: 4 },
  { label: "Half-Yearly", n: 2 },
  { label: "Yearly", n: 1 },
];

export default function CompoundInterestCalculatorPage() {
  const [principal, setPrincipal] = useState("1,00,000");
  const [rate, setRate] = useState("10");
  const [years, setYears] = useState(5);
  const [freqIdx, setFreqIdx] = useState(1);

  const principalNum = parseFloat(principal.replace(/,/g, "")) || 0;
  const rateNum = parseFloat(rate) || 0;
  const n = FREQUENCIES[freqIdx].n;

  const { maturity, ciInterest, siInterest, extraGain, rows } = useMemo(() => {
    const r = rateNum / 100;
    const maturity = principalNum * Math.pow(1 + r / n, n * years);
    const ciInterest = maturity - principalNum;
    const siInterest = principalNum * r * years;
    const extraGain = ciInterest - siInterest;

    const rows = Array.from({ length: years }, (_, i) => {
      const y = i + 1;
      const ci = principalNum * Math.pow(1 + r / n, n * y);
      const si = principalNum * (1 + r * y);
      return { year: y, ci, si, ciInterest: ci - principalNum, siInterest: si - principalNum };
    });

    return { maturity, ciInterest, siInterest, extraGain, rows };
  }, [principalNum, rateNum, n, years]);

  function handlePrincipalChange(e: React.ChangeEvent<HTMLInputElement>) {
    const num = e.target.value.replace(/[^0-9]/g, "");
    if (!num) { setPrincipal(""); return; }
    setPrincipal(new Intl.NumberFormat("en-IN").format(parseInt(num)));
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Compound Interest Calculator"
        description="See how compounding grows your money over time"
        icon={BarChart3}
        gradient="from-purple-600 to-violet-800"
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-10 grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardHeader><CardTitle>Investment Details</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label htmlFor="principal">Principal Amount (₹)</Label>
              <Input id="principal" value={principal} onChange={handlePrincipalChange} className="mt-1" placeholder="1,00,000" />
            </div>
            <div>
              <Label htmlFor="rate">Annual Interest Rate (%)</Label>
              <Input id="rate" type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-1" step="0.5" min="0.1" max="50" />
            </div>
            <div>
              <Label>Time Period — {years} Year{years > 1 ? "s" : ""}</Label>
              <input
                type="range" min={1} max={40} value={years}
                onChange={(e) => setYears(+e.target.value)}
                className="w-full mt-2 accent-purple-600"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1 yr</span><span>40 yrs</span>
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Compounding Frequency</Label>
              <div className="grid grid-cols-3 gap-2">
                {FREQUENCIES.map((f, i) => (
                  <button
                    key={f.label}
                    onClick={() => setFreqIdx(i)}
                    className={`py-2 rounded-lg text-xs font-medium border transition-colors ${
                      freqIdx === i ? "bg-purple-600 text-white border-purple-600" : "border-border text-muted-foreground hover:border-purple-400"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency comparison */}
            <div>
              <Label className="mb-2 block text-xs text-muted-foreground">Maturity by Frequency (same rate)</Label>
              <div className="space-y-1.5">
                {FREQUENCIES.map((f) => {
                  const m = principalNum * Math.pow(1 + rateNum / 100 / f.n, f.n * years);
                  const pct = maturity > 0 ? (m / maturity) * 100 : 0;
                  return (
                    <div key={f.label} className="flex items-center gap-2 text-xs">
                      <span className="w-20 text-muted-foreground">{f.label}</span>
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-24 text-right font-medium">₹{fmt(m)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <Card className="border-purple-200 bg-linear-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20">
            <CardContent className="pt-6 space-y-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Compound Interest Maturity</div>
                <div className="text-4xl font-bold text-purple-700 mt-1">₹{fmt(maturity)}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white dark:bg-background p-3 text-center shadow-sm">
                  <div className="text-xs text-muted-foreground">CI Earned</div>
                  <div className="text-lg font-bold text-purple-600 mt-0.5">₹{fmt(ciInterest)}</div>
                </div>
                <div className="rounded-xl bg-white dark:bg-background p-3 text-center shadow-sm">
                  <div className="text-xs text-muted-foreground">SI Would Earn</div>
                  <div className="text-lg font-bold text-muted-foreground mt-0.5">₹{fmt(siInterest)}</div>
                </div>
              </div>
              <div className="rounded-xl bg-white dark:bg-background p-3 text-center shadow-sm">
                <div className="text-xs text-muted-foreground">Extra gain from Compounding</div>
                <div className="text-xl font-bold text-green-600 mt-0.5">+₹{fmt(extraGain)}</div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Principal</span><span>CI Interest</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden flex">
                  <div className="bg-purple-300" style={{ width: maturity > 0 ? `${(principalNum / maturity) * 100}%` : "100%" }} />
                  <div className="bg-purple-600 flex-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">CI vs SI — Year by Year</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                    <tr className="border-b">
                      <th className="px-3 py-2 text-left font-semibold">Year</th>
                      <th className="px-3 py-2 text-right font-semibold text-purple-600">CI Amount</th>
                      <th className="px-3 py-2 text-right font-semibold text-muted-foreground">SI Amount</th>
                      <th className="px-3 py-2 text-right font-semibold text-green-600">Extra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.year} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-3 py-2 text-muted-foreground">Yr {r.year}</td>
                        <td className="px-3 py-2 text-right font-medium text-purple-600">₹{fmt(r.ci)}</td>
                        <td className="px-3 py-2 text-right text-muted-foreground">₹{fmt(r.si)}</td>
                        <td className="px-3 py-2 text-right text-green-600">+₹{fmt(r.ci - r.si)}</td>
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
