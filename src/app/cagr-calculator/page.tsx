"use client";
import { useState, useMemo } from "react";
import { LineChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/PageHeader";

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}

function fmtInput(val: string, set: (v: string) => void) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value.replace(/[^0-9]/g, "");
    if (!num) { set(""); return; }
    set(new Intl.NumberFormat("en-IN").format(parseInt(num)));
  };
}

export default function CAGRCalculatorPage() {
  const [mode, setMode] = useState<"cagr" | "future">("cagr");
  const [initialValue, setInitialValue] = useState("1,00,000");
  const [finalValue, setFinalValue] = useState("2,50,000");
  const [cagrInput, setCagrInput] = useState("15");
  const [years, setYears] = useState(5);

  const initialNum = parseFloat(initialValue.replace(/,/g, "")) || 0;
  const finalNum = parseFloat(finalValue.replace(/,/g, "")) || 0;
  const cagrNum = parseFloat(cagrInput) || 0;

  const result = useMemo(() => {
    if (mode === "cagr") {
      if (!initialNum || !finalNum || !years || finalNum <= 0 || initialNum <= 0) return null;
      const cagrVal = (Math.pow(finalNum / initialNum, 1 / years) - 1) * 100;
      return { cagrVal, finalVal: finalNum, absoluteGain: finalNum - initialNum, multiple: finalNum / initialNum };
    } else {
      if (!initialNum || !cagrNum || !years) return null;
      const finalVal = initialNum * Math.pow(1 + cagrNum / 100, years);
      return { cagrVal: cagrNum, finalVal, absoluteGain: finalVal - initialNum, multiple: finalVal / initialNum };
    }
  }, [mode, initialNum, finalNum, cagrNum, years]);

  const rows = useMemo(() => {
    if (!result || !initialNum) return [];
    return Array.from({ length: years }, (_, i) => {
      const y = i + 1;
      const val = initialNum * Math.pow(1 + result.cagrVal / 100, y);
      return { year: y, value: val, gain: val - initialNum };
    });
  }, [result, initialNum, years]);

  const benchmarks = [
    { label: "Savings Account", cagr: 3.5 },
    { label: "FD (5yr)", cagr: 7.0 },
    { label: "PPF", cagr: 7.1 },
    { label: "Nifty 50 (15yr avg)", cagr: 13.5 },
    { label: "Gold (10yr avg)", cagr: 10.2 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="CAGR Calculator" description="Compound Annual Growth Rate for investments" icon={LineChart} gradient="from-lime-500 to-emerald-600" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-10 space-y-6">
        {/* Mode toggle */}
        <div className="flex rounded-xl border overflow-hidden w-fit">
          {[{ val: "cagr", label: "Calculate CAGR" }, { val: "future", label: "Calculate Future Value" }].map((m) => (
            <button key={m.val} onClick={() => setMode(m.val as typeof mode)}
              className={`px-5 py-2.5 text-sm font-medium transition-colors ${mode === m.val ? "bg-emerald-600 text-white" : "text-muted-foreground hover:bg-muted"}`}>
              {m.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Inputs */}
          <Card>
            <CardHeader><CardTitle>Investment Details</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label>Initial Value (₹)</Label>
                <Input value={initialValue} onChange={fmtInput(initialValue, setInitialValue)} className="mt-1" placeholder="1,00,000" />
              </div>

              {mode === "cagr" ? (
                <div>
                  <Label>Final Value (₹)</Label>
                  <Input value={finalValue} onChange={fmtInput(finalValue, setFinalValue)} className="mt-1" placeholder="2,50,000" />
                </div>
              ) : (
                <div>
                  <Label>Expected CAGR (%)</Label>
                  <Input type="number" value={cagrInput} onChange={(e) => setCagrInput(e.target.value)} className="mt-1" step="0.5" min="0.1" max="100" />
                </div>
              )}

              <div>
                <Label>Time Period — {years} Year{years > 1 ? "s" : ""}</Label>
                <input type="range" min={1} max={40} value={years} onChange={(e) => setYears(+e.target.value)} className="w-full mt-2 accent-emerald-600" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>1 yr</span><span>40 yrs</span></div>
              </div>

              {/* Benchmarks */}
              <div>
                <Label className="mb-2 block text-xs text-muted-foreground">Compare with benchmarks</Label>
                <div className="space-y-2">
                  {benchmarks.map((b) => {
                    const futureVal = initialNum * Math.pow(1 + b.cagr / 100, years);
                    return (
                      <div key={b.label} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{b.label} ({b.cagr}%)</span>
                        <span className="font-medium">₹{fmt(futureVal)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-4">
            {result ? (
              <>
                <Card className="border-emerald-200 bg-linear-to-br from-emerald-50 to-lime-50 dark:from-emerald-950/20 dark:to-lime-950/20">
                  <CardContent className="pt-6 space-y-4">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">{mode === "cagr" ? "CAGR" : "Future Value"}</div>
                      <div className="text-5xl font-bold text-emerald-700 mt-1">
                        {mode === "cagr" ? `${result.cagrVal.toFixed(2)}%` : `₹${fmt(result.finalVal)}`}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Initial", val: `₹${fmt(initialNum)}` },
                        { label: "Gain", val: `₹${fmt(result.absoluteGain)}`, color: "text-emerald-600" },
                        { label: "Multiple", val: `${result.multiple.toFixed(2)}x` },
                      ].map((s) => (
                        <div key={s.label} className="rounded-xl bg-white dark:bg-background p-3 text-center shadow-sm">
                          <div className="text-xs text-muted-foreground">{s.label}</div>
                          <div className={`text-base font-bold mt-0.5 ${s.color ?? ""}`}>{s.val}</div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-muted-foreground"><span>Principal</span><span>Gain</span></div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden flex">
                        <div className="bg-emerald-300" style={{ width: `${(initialNum / result.finalVal) * 100}%` }} />
                        <div className="bg-emerald-600 flex-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base">Year-by-Year Growth</CardTitle></CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-60 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                          <tr className="border-b">
                            <th className="px-4 py-2 text-left font-semibold">Year</th>
                            <th className="px-4 py-2 text-right font-semibold">Value</th>
                            <th className="px-4 py-2 text-right font-semibold text-emerald-600">Gain</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((r) => (
                            <tr key={r.year} className="border-b last:border-0 hover:bg-muted/30">
                              <td className="px-4 py-2 text-muted-foreground">Year {r.year}</td>
                              <td className="px-4 py-2 text-right font-medium">₹{fmt(r.value)}</td>
                              <td className="px-4 py-2 text-right text-emerald-600">+₹{fmt(r.gain)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="pt-10 pb-10 text-center text-muted-foreground">Enter values to calculate</CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
