"use client";
import { useState } from "react";
import { Ruler, ArrowLeftRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/PageHeader";

type Unit = { label: string; factor: number; note?: string };
type Category = { name: string; units: Unit[]; convert?: (val: number, from: Unit, to: Unit) => number };

const CATEGORIES: Category[] = [
  {
    name: "Weight",
    units: [
      { label: "Kilogram (kg)", factor: 1 },
      { label: "Gram (g)", factor: 0.001 },
      { label: "Milligram (mg)", factor: 0.000001 },
      { label: "Pound (lb)", factor: 0.453592 },
      { label: "Ounce (oz)", factor: 0.0283495 },
      { label: "Tola (Indian)", factor: 0.0116638, note: "1 Tola = 11.664 g" },
      { label: "Maund (Indian)", factor: 37.3242, note: "1 Maund = 37.32 kg" },
      { label: "Quintal", factor: 100, note: "1 Quintal = 100 kg" },
      { label: "Metric Ton", factor: 1000 },
    ],
  },
  {
    name: "Length",
    units: [
      { label: "Metre (m)", factor: 1 },
      { label: "Centimetre (cm)", factor: 0.01 },
      { label: "Millimetre (mm)", factor: 0.001 },
      { label: "Kilometre (km)", factor: 1000 },
      { label: "Inch (in)", factor: 0.0254 },
      { label: "Foot (ft)", factor: 0.3048 },
      { label: "Yard (yd)", factor: 0.9144 },
      { label: "Mile (mi)", factor: 1609.34 },
      { label: "Nautical Mile", factor: 1852 },
    ],
  },
  {
    name: "Area",
    units: [
      { label: "Square Metre (m²)", factor: 1 },
      { label: "Square Foot (ft²)", factor: 0.092903 },
      { label: "Square Kilometre (km²)", factor: 1000000 },
      { label: "Acre", factor: 4046.86 },
      { label: "Hectare (ha)", factor: 10000 },
      { label: "Bigha (N. India)", factor: 2529.29, note: "≈2529 m² (varies by state)" },
      { label: "Guntha", factor: 101.171, note: "1 Guntha = 101.17 m²" },
      { label: "Marla", factor: 25.2929, note: "1 Marla = 25.29 m²" },
      { label: "Kanal", factor: 505.857, note: "1 Kanal = 505.86 m²" },
    ],
  },
  {
    name: "Volume",
    units: [
      { label: "Litre (L)", factor: 1 },
      { label: "Millilitre (mL)", factor: 0.001 },
      { label: "Cubic Metre (m³)", factor: 1000 },
      { label: "Gallon (US)", factor: 3.78541 },
      { label: "Gallon (UK)", factor: 4.54609 },
      { label: "Fluid Ounce (US)", factor: 0.0295735 },
      { label: "Cup (US)", factor: 0.236588 },
      { label: "Tablespoon", factor: 0.0147868 },
      { label: "Teaspoon", factor: 0.00492892 },
    ],
  },
  {
    name: "Temperature",
    units: [
      { label: "Celsius (°C)", factor: 1 },
      { label: "Fahrenheit (°F)", factor: 1 },
      { label: "Kelvin (K)", factor: 1 },
    ],
    convert: (val, from, to) => {
      let celsius = val;
      if (from.label.includes("°F")) celsius = (val - 32) * 5 / 9;
      else if (from.label.includes("K")) celsius = val - 273.15;
      if (to.label.includes("°F")) return celsius * 9 / 5 + 32;
      if (to.label.includes("K")) return celsius + 273.15;
      return celsius;
    },
  },
  {
    name: "Data",
    units: [
      { label: "Byte (B)", factor: 1 },
      { label: "Kilobyte (KB)", factor: 1024 },
      { label: "Megabyte (MB)", factor: 1048576 },
      { label: "Gigabyte (GB)", factor: 1073741824 },
      { label: "Terabyte (TB)", factor: 1099511627776 },
      { label: "Bit", factor: 0.125 },
      { label: "Kilobit (Kbps)", factor: 128 },
      { label: "Megabit (Mbps)", factor: 131072 },
    ],
  },
];

function fmtResult(n: number): string {
  if (isNaN(n) || !isFinite(n)) return "—";
  if (Math.abs(n) >= 1e9) return n.toExponential(4);
  if (Math.abs(n) >= 1000) return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 4 }).format(n);
  return n.toPrecision(7).replace(/\.?0+$/, "");
}

export default function UnitConverterPage() {
  const [catIdx, setCatIdx] = useState(0);
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [value, setValue] = useState("1");

  const cat = CATEGORIES[catIdx];
  const fromUnit = cat.units[fromIdx];
  const toUnit = cat.units[toIdx];
  const inputNum = parseFloat(value) || 0;

  let result: number;
  if (cat.convert) {
    result = cat.convert(inputNum, fromUnit, toUnit);
  } else {
    result = (inputNum * fromUnit.factor) / toUnit.factor;
  }

  function handleCatChange(i: number) {
    setCatIdx(i);
    setFromIdx(0);
    setToIdx(1);
    setValue("1");
  }

  function swap() {
    setFromIdx(toIdx);
    setToIdx(fromIdx);
  }

  // Build all conversions from current input
  const allConversions = cat.units.map((u, i) => {
    let converted: number;
    if (cat.convert) {
      converted = cat.convert(inputNum, fromUnit, u);
    } else {
      converted = (inputNum * fromUnit.factor) / u.factor;
    }
    return { unit: u, value: converted, idx: i };
  });

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Unit Converter"
        description="Weight, Length, Area, Volume, Temperature & more"
        icon={Ruler}
        gradient="from-amber-400 to-orange-500"
      />

      <div className="mx-auto max-w-4xl px-4 pb-10 space-y-6">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c, i) => (
            <button
              key={c.name}
              onClick={() => handleCatChange(i)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                catIdx === i
                  ? "bg-amber-500 text-white border-amber-500"
                  : "border-border text-muted-foreground hover:border-amber-400 hover:text-amber-600"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Converter */}
        <Card>
          <CardHeader><CardTitle>Convert {cat.name}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
              {/* From */}
              <div className="space-y-2">
                <Label>From</Label>
                <select
                  value={fromIdx}
                  onChange={(e) => setFromIdx(+e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {cat.units.map((u, i) => (
                    <option key={u.label} value={i}>{u.label}</option>
                  ))}
                </select>
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter value"
                />
                {fromUnit.note && <p className="text-xs text-muted-foreground">{fromUnit.note}</p>}
              </div>

              {/* Swap */}
              <button
                onClick={swap}
                className="mb-2 p-2 rounded-full border border-border hover:bg-muted transition-colors"
                title="Swap units"
              >
                <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
              </button>

              {/* To */}
              <div className="space-y-2">
                <Label>To</Label>
                <select
                  value={toIdx}
                  onChange={(e) => setToIdx(+e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {cat.units.map((u, i) => (
                    <option key={u.label} value={i}>{u.label}</option>
                  ))}
                </select>
                <div className="rounded-lg border-2 border-amber-400 bg-amber-50 dark:bg-amber-950/20 px-3 py-2 min-h-10 flex items-center">
                  <span className="text-xl font-bold text-amber-700">{fmtResult(result)}</span>
                </div>
                {toUnit.note && <p className="text-xs text-muted-foreground">{toUnit.note}</p>}
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm text-center text-muted-foreground">
              {value || "1"} {fromUnit.label.split(" (")[0]} = <strong className="text-foreground">{fmtResult(result)} {toUnit.label.split(" (")[0]}</strong>
            </div>
          </CardContent>
        </Card>

        {/* All conversions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              All {cat.name} Conversions for {value || "1"} {fromUnit.label.split(" (")[0]}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
              {allConversions.map(({ unit, value: converted, idx }) => (
                <button
                  key={unit.label}
                  onClick={() => setToIdx(idx)}
                  className={`flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors text-left border-b last:border-0 sm:last:border-0 ${
                    toIdx === idx ? "bg-amber-50 dark:bg-amber-950/20" : ""
                  }`}
                >
                  <span className="text-sm text-muted-foreground">{unit.label}</span>
                  <span className={`text-sm font-bold ${toIdx === idx ? "text-amber-600" : "text-foreground"}`}>
                    {fmtResult(converted)}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
