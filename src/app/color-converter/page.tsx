"use client";
import { useState, useMemo, useCallback } from "react";
import { Palette, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/PageHeader";
import { ToolDescription } from "@/components/shared/ToolDescription";
import { FaqSection } from "@/components/shared/FaqSection";
import { faqs, toolDescriptions } from "@/lib/data";

// ── Color conversion helpers ──────────────────────────────────────────────────
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const hn = h / 360, sn = s / 100, ln = l / 100;
  if (sn === 0) { const v = Math.round(ln * 255); return { r: v, g: v, b: v }; }
  function hue2rgb(p: number, q: number, t: number) {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  }
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  return {
    r: Math.round(hue2rgb(p, q, hn + 1/3) * 255),
    g: Math.round(hue2rgb(p, q, hn) * 255),
    b: Math.round(hue2rgb(p, q, hn - 1/3) * 255),
  };
}

function isLight(r: number, g: number, b: number) {
  return 0.299 * r + 0.587 * g + 0.114 * b > 128;
}

const PRESET_COLORS = [
  "#FF6B6B","#FF9F43","#FECA57","#48DBFB","#1DD1A1",
  "#FF9FF3","#54A0FF","#5F27CD","#00D2D3","#EE5A24",
  "#C8D6E5","#576574","#222F3E","#FFFFFF","#000000",
];

export default function ColorConverterPage() {
  const [hex, setHex] = useState("#3B82F6");
  const [r, setR] = useState(59);
  const [g, setG] = useState(130);
  const [b, setB] = useState(246);
  const [copied, setCopied] = useState("");

  const hsl = useMemo(() => rgbToHsl(r, g, b), [r, g, b]);
  const hexDisplay = useMemo(() => rgbToHex(r, g, b), [r, g, b]);

  function applyRgb(nr: number, ng: number, nb: number) {
    setR(nr); setG(ng); setB(nb);
    setHex(rgbToHex(nr, ng, nb));
  }

  function handleHexChange(val: string) {
    setHex(val);
    const rgb = hexToRgb(val);
    if (rgb) { setR(rgb.r); setG(rgb.g); setB(rgb.b); }
  }

  function handleHslChange(field: "h" | "s" | "l", val: number) {
    const newHsl = { ...hsl, [field]: val };
    const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    applyRgb(rgb.r, rgb.g, rgb.b);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(text);
    setTimeout(() => setCopied(""), 2000);
  }

  // Generate shades (darker) and tints (lighter)
  const shades = useMemo(() =>
    Array.from({ length: 9 }, (_, i) => {
      const l = Math.round(10 + i * 10);
      const rgb = hslToRgb(hsl.h, hsl.s, l);
      return { l, hex: rgbToHex(rgb.r, rgb.g, rgb.b), rgb };
    }),
  [hsl.h, hsl.s]);

  // Complementary, triadic, analogous
  const complementary = useMemo(() => {
    const h2 = (hsl.h + 180) % 360;
    const rgb = hslToRgb(h2, hsl.s, hsl.l);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }, [hsl]);

  const triadic = useMemo(() => {
    return [120, 240].map((offset) => {
      const h2 = (hsl.h + offset) % 360;
      const rgb = hslToRgb(h2, hsl.s, hsl.l);
      return rgbToHex(rgb.r, rgb.g, rgb.b);
    });
  }, [hsl]);

  const CopyBtn = ({ text }: { text: string }) => (
    <button onClick={() => copy(text)} className="p-1.5 rounded hover:bg-muted transition-colors">
      {copied === text ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        .color-range::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; cursor: pointer; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.25); }
        .color-range::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; cursor: pointer; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.25); }
        .color-range-r::-webkit-slider-thumb { background: #ef4444; }
        .color-range-r::-moz-range-thumb { background: #ef4444; }
        .color-range-g::-webkit-slider-thumb { background: #22c55e; }
        .color-range-g::-moz-range-thumb { background: #22c55e; }
        .color-range-b::-webkit-slider-thumb { background: #3b82f6; }
        .color-range-b::-moz-range-thumb { background: #3b82f6; }
        .color-range-hsl::-webkit-slider-thumb { background: #a855f7; }
        .color-range-hsl::-moz-range-thumb { background: #a855f7; }
      `}</style>
      <PageHeader title="Color Picker & Converter" description="Convert HEX ↔ RGB ↔ HSL with palette preview" icon={Palette} gradient="from-fuchsia-500 to-pink-600" breadcrumbs={[{ name: "Developer Tools" }, { name: "Color Converter" }]} />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-10 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            {/* Big color preview */}
            <div className="rounded-2xl h-32 flex items-center justify-center shadow-lg relative overflow-hidden" style={{ background: hexDisplay }}>
              <span className={`text-2xl font-bold tracking-widest ${isLight(r, g, b) ? "text-black/60" : "text-white/80"}`}>{hexDisplay.toUpperCase()}</span>
              {/* Native color picker overlay */}
              <input type="color" value={hexDisplay} onChange={(e) => handleHexChange(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" title="Click to open color picker" />
            </div>

            {/* HEX input */}
            <Card>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <Label>HEX</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={hex} onChange={(e) => handleHexChange(e.target.value)} className="font-mono uppercase" maxLength={7} />
                    <CopyBtn text={hexDisplay.toUpperCase()} />
                  </div>
                </div>

                {/* RGB sliders */}
                <div>
                  <Label>RGB</Label>
                  <div className="mt-2 space-y-2">
                    {[
                      { label: "R", cls: "color-range-r", val: r, set: (v: number) => applyRgb(v, g, b), color: "#ef4444" },
                      { label: "G", cls: "color-range-g", val: g, set: (v: number) => applyRgb(r, v, b), color: "#22c55e" },
                      { label: "B", cls: "color-range-b", val: b, set: (v: number) => applyRgb(r, g, v), color: "#3b82f6" },
                    ].map((ch) => (
                      <div key={ch.label} className="flex items-center gap-3">
                        <span className="w-4 text-xs font-bold" style={{ color: ch.color }}>{ch.label}</span>
                        <input type="range" min={0} max={255} value={ch.val}
                          onChange={(e) => ch.set(+e.target.value)}
                          className={`flex-1 cursor-pointer appearance-none h-1.5 rounded-full color-range ${ch.cls}`}
                          style={{ background: `linear-gradient(to right, ${ch.color} ${(ch.val/255)*100}%, #e2e8f0 ${(ch.val/255)*100}%)` }} />
                        <span className="w-8 text-xs text-right text-muted-foreground">{ch.val}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs text-muted-foreground font-mono">rgb({r}, {g}, {b})</span>
                      <CopyBtn text={`rgb(${r}, ${g}, ${b})`} />
                    </div>
                  </div>
                </div>

                {/* HSL sliders */}
                <div>
                  <Label>HSL</Label>
                  <div className="mt-2 space-y-2">
                    {[
                      { label: "H", val: hsl.h, max: 360, set: (v: number) => handleHslChange("h", v) },
                      { label: "S", val: hsl.s, max: 100, set: (v: number) => handleHslChange("s", v) },
                      { label: "L", val: hsl.l, max: 100, set: (v: number) => handleHslChange("l", v) },
                    ].map((ch) => (
                      <div key={ch.label} className="flex items-center gap-3">
                        <span className="w-4 text-xs font-bold text-muted-foreground">{ch.label}</span>
                        <input type="range" min={0} max={ch.max} value={ch.val}
                          onChange={(e) => ch.set(+e.target.value)}
                          className="flex-1 cursor-pointer appearance-none h-1.5 rounded-full color-range color-range-hsl"
                          style={{ background: `linear-gradient(to right, #a855f7 ${(ch.val/ch.max)*100}%, #e2e8f0 ${(ch.val/ch.max)*100}%)` }} />
                        <span className="w-8 text-xs text-right text-muted-foreground">{ch.val}{ch.label !== "H" ? "%" : "°"}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs text-muted-foreground font-mono">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</span>
                      <CopyBtn text={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Palette + presets */}
          <div className="space-y-4">
            {/* Shades/tints palette */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Color Scale</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-9 gap-1 rounded-xl overflow-hidden">
                  {shades.map((s) => (
                    <button
                      key={s.l}
                      onClick={() => { handleHexChange(s.hex); }}
                      className="aspect-square rounded-sm hover:scale-110 transition-transform"
                      style={{ background: s.hex }}
                      title={`${s.hex} (L: ${s.l}%)`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                  <span>Darkest</span><span>Lightest</span>
                </div>
              </CardContent>
            </Card>

            {/* Harmony */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Color Harmony</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1.5">Complementary</div>
                  <div className="flex gap-2">
                    {[hexDisplay, complementary].map((c) => (
                      <button key={c} onClick={() => handleHexChange(c)}
                        className="flex-1 h-10 rounded-lg border hover:scale-105 transition-transform"
                        style={{ background: c }} title={c} />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1.5">Triadic</div>
                  <div className="flex gap-2">
                    {[hexDisplay, ...triadic].map((c) => (
                      <button key={c} onClick={() => handleHexChange(c)}
                        className="flex-1 h-10 rounded-lg border hover:scale-105 transition-transform"
                        style={{ background: c }} title={c} />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Presets */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Popular Colors</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button key={c} onClick={() => handleHexChange(c)}
                      className="aspect-square rounded-lg border hover:scale-110 transition-transform shadow-sm"
                      style={{ background: c }} title={c} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* All formats */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Copy Formats</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "HEX", val: hexDisplay.toUpperCase() },
                  { label: "RGB", val: `rgb(${r}, ${g}, ${b})` },
                  { label: "HSL", val: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
                  { label: "CSS Var", val: `--color: ${hexDisplay};` },
                  { label: "Tailwind (approx)", val: `bg-[${hexDisplay}]` },
                ].map((f) => (
                  <div key={f.label} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground mr-2">{f.label}</span>
                      <span className="text-xs font-mono">{f.val}</span>
                    </div>
                    <CopyBtn text={f.val} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <ToolDescription toolName="Color Converter" data={toolDescriptions["color-converter"]} />
        <FaqSection faqs={faqs["color-converter"]} />
      </div>
    </div>
  );
}
