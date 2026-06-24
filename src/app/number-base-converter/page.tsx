"use client";

import { useState } from "react";
import { Hash, Copy, Check, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BASES = [
  { label: "Binary", base: 2, color: "text-blue-600", dot: "bg-blue-500", prefix: "0b", placeholder: "e.g. 11111111" },
  { label: "Octal", base: 8, color: "text-amber-600", dot: "bg-amber-500", prefix: "0o", placeholder: "e.g. 377" },
  { label: "Decimal", base: 10, color: "text-emerald-600", dot: "bg-emerald-500", prefix: "", placeholder: "e.g. 255" },
  { label: "Hexadecimal", base: 16, color: "text-violet-600", dot: "bg-violet-500", prefix: "0x", placeholder: "e.g. FF" },
] as const;

function convertAll(value: string, fromBase: number) {
  if (!value.trim()) return null;
  const n = parseInt(value, fromBase);
  if (isNaN(n) || n < 0 || n > 2 ** 32 - 1) return null;
  return {
    2: n.toString(2),
    8: n.toString(8),
    10: n.toString(10),
    16: n.toString(16).toUpperCase(),
    n,
  };
}

export default function NumberBaseConverter() {
  const [inputs, setInputs] = useState<Record<number, string>>({ 2: "11111111", 8: "377", 10: "255", 16: "FF" });
  const [activeBase, setActiveBase] = useState(10);
  const [copied, setCopied] = useState<number | null>(null);

  const handleChange = (base: number, raw: string) => {
    const value = raw.toUpperCase().replace(/\s/g, "");
    setActiveBase(base);
    if (!value) {
      setInputs({ 2: "", 8: "", 10: "", 16: "" });
      return;
    }
    const result = convertAll(value, base);
    if (result) {
      setInputs({ 2: result[2], 8: result[8], 10: result[10], 16: result[16] });
    } else {
      setInputs((prev) => ({ ...prev, [base]: value }));
    }
  };

  const copy = (base: number) => {
    const val = inputs[base];
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopied(base);
    setTimeout(() => setCopied(null), 2000);
  };

  const reset = () => setInputs({ 2: "", 8: "", 10: "", 16: "" });

  const result = convertAll(inputs[activeBase] || "", activeBase);
  const n = result?.n ?? null;

  return (
    <>
      <PageHeader
        title="Number Base Converter"
        description="Convert numbers between binary, octal, decimal, and hexadecimal instantly."
        icon={Hash}
        gradient="from-violet-500 to-indigo-600"
        breadcrumbs={[{ name: "Developer Tools" }, { name: "Number Base Converter" }]}
      />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 mb-16">
        <AdSlot className="mb-8" />

        <div className="flex justify-end mb-3">
          <Button variant="ghost" size="sm" onClick={reset} className="text-muted-foreground">
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Reset
          </Button>
        </div>

        <div className="space-y-3">
          {BASES.map(({ label, base, color, dot, prefix, placeholder }) => (
            <Card
              key={base}
              className={`p-5 border-border/50 shadow-sm transition-shadow ${activeBase === base ? "ring-2 ring-violet-400/30" : ""}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${dot}`} />
                  <span className="text-sm font-semibold text-foreground">{label}</span>
                  <span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                    Base {base}
                  </span>
                </div>
                <button
                  onClick={() => copy(base)}
                  disabled={!inputs[base]}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                >
                  {copied === base ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied === base ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="flex items-center gap-2">
                {prefix && (
                  <span className="text-sm font-mono text-muted-foreground shrink-0">{prefix}</span>
                )}
                <input
                  value={inputs[base] || ""}
                  onChange={(e) => handleChange(base, e.target.value)}
                  placeholder={placeholder}
                  className={`flex-1 font-mono text-base bg-muted/40 rounded-lg px-3 py-2.5 outline-none border border-border/50 focus:ring-2 focus:ring-violet-400/40 ${color}`}
                  spellCheck={false}
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Bit visualization */}
        {n !== null && (
          <Card className="mt-6 p-5 border-border/50 shadow-sm">
            <p className="text-sm font-semibold text-foreground mb-4">Bit Visualization</p>

            {/* 8-bit */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground font-mono mb-2">
                8-bit {n > 255 && <span className="text-amber-500 ml-1">(overflow — showing lowest 8 bits)</span>}
              </p>
              <div className="flex gap-1">
                {Array.from({ length: 8 }, (_, i) => {
                  const bit = (n >> (7 - i)) & 1;
                  return (
                    <div
                      key={i}
                      className={`flex-1 h-10 rounded-lg flex items-center justify-center font-mono text-sm font-bold border transition-colors ${
                        bit
                          ? "bg-violet-500 text-white border-violet-600"
                          : "bg-muted text-muted-foreground border-border/50"
                      }`}
                    >
                      {bit}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info row */}
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground border-t border-border/50 pt-3">
              <span>
                Decimal: <span className="font-semibold text-foreground">{n}</span>
              </span>
              <span>
                Signed 8-bit: <span className="font-semibold text-foreground">{n > 127 ? n - 256 : n}</span>
              </span>
              <span>
                Bits needed:{" "}
                <span className="font-semibold text-foreground">
                  {n === 0 ? 1 : Math.floor(Math.log2(n)) + 1}
                </span>
              </span>
              <span>
                Even/Odd:{" "}
                <span className="font-semibold text-foreground">{n % 2 === 0 ? "Even" : "Odd"}</span>
              </span>
            </div>
          </Card>
        )}

        {/* Quick reference */}
        <Card className="mt-6 p-5 border-border/50 shadow-sm">
          <p className="text-sm font-semibold text-foreground mb-3">Quick Reference</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-center">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="py-1.5 px-2 text-left font-semibold">Dec</th>
                  <th className="py-1.5 px-2 font-semibold">Hex</th>
                  <th className="py-1.5 px-2 font-semibold">Oct</th>
                  <th className="py-1.5 px-2 font-semibold">Bin</th>
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2, 4, 8, 10, 15, 16, 32, 64, 127, 128, 255].map((v) => (
                  <tr
                    key={v}
                    className="hover:bg-muted/40 cursor-pointer transition-colors"
                    onClick={() => handleChange(10, String(v))}
                  >
                    <td className="py-1 px-2 text-left text-emerald-600">{v}</td>
                    <td className="py-1 px-2 text-violet-600">{v.toString(16).toUpperCase()}</td>
                    <td className="py-1 px-2 text-amber-600">{v.toString(8)}</td>
                    <td className="py-1 px-2 text-blue-600">{v.toString(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
