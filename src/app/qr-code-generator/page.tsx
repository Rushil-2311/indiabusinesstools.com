"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { QrCode, Download, Copy, Check } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const PRESETS = [
  { label: "URL", value: "https://indianbusinesstools.com" },
  { label: "UPI", value: "upi://pay?pa=yourname@upi&pn=Your+Name&cu=INR" },
  { label: "Email", value: "mailto:hello@example.com" },
  { label: "Phone", value: "tel:+919999999999" },
  { label: "WhatsApp", value: "https://wa.me/919999999999" },
];

export default function QRCodeGenerator() {
  const [text, setText] = useState("https://indianbusinesstools.com");
  const [size, setSize] = useState(280);
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#FFFFFF");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = useCallback(async () => {
    if (!text.trim() || !canvasRef.current) return;
    try {
      const QRCode = (await import("qrcode")).default;
      await QRCode.toCanvas(canvasRef.current, text, {
        width: size,
        margin: 2,
        color: { dark: fg, light: bg },
        errorCorrectionLevel: "M",
      });
    } catch {}
  }, [text, size, fg, bg]);

  useEffect(() => { generate(); }, [generate]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "qrcode.png";
    a.click();
  };

  const copyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        const url = canvas.toDataURL();
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    });
  };

  return (
    <>
      <PageHeader
        title="QR Code Generator"
        description="Generate QR codes for URLs, UPI payments, phone numbers, emails, and more. Free & instant."
        icon={QrCode}
        gradient="from-teal-500 to-emerald-600"
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Controls */}
          <div className="space-y-5">
            {/* Quick presets */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Quick Presets</p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setText(p.value)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-950/30 dark:hover:text-teal-400 transition-all"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Text input */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide block">Content</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 resize-none leading-relaxed"
                placeholder="Enter URL, text, phone number, UPI ID..."
              />
              <p className="text-xs text-muted-foreground mt-1">{text.length} characters</p>
            </div>

            {/* Size */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide block">
                Size: <span className="text-foreground">{size}×{size}px</span>
              </label>
              <input
                type="range"
                min={120}
                max={500}
                step={20}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-teal-500"
              />
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide block">QR Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-10 w-10 rounded-lg border border-border cursor-pointer" />
                  <span className="text-sm font-mono text-foreground">{fg.toUpperCase()}</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide block">Background</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 w-10 rounded-lg border border-border cursor-pointer" />
                  <span className="text-sm font-mono text-foreground">{bg.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Preview */}
          <div className="flex flex-col items-center gap-4">
            <Card className="p-6 border-border/50 shadow-lg flex items-center justify-center w-full">
              <canvas
                ref={canvasRef}
                style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
              />
            </Card>

            <div className="flex gap-3 w-full">
              <Button onClick={copyImage} variant="outline" className="flex-1">
                {copied ? <><Check className="h-4 w-4 mr-2 text-emerald-600" />Copied!</> : <><Copy className="h-4 w-4 mr-2" />Copy PNG</>}
              </Button>
              <Button onClick={download} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20">
                <Download className="h-4 w-4 mr-2" /> Download PNG
              </Button>
            </div>
          </div>
        </div>

        {/* Use cases */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 text-center">
          {[
            { title: "UPI Payments", desc: "Create QR for your UPI ID — customers scan & pay instantly." },
            { title: "Business Cards", desc: "Add a QR linking to your website or contact details." },
            { title: "Shop Menus", desc: "Link a QR to your online menu or catalogue." },
            { title: "WhatsApp Chat", desc: "Generate a QR that opens a WhatsApp chat directly." },
          ].map((c) => (
            <div key={c.title} className="p-4 rounded-xl bg-muted/40 border border-border/50">
              <p className="font-semibold text-sm text-foreground mb-1">{c.title}</p>
              <p className="text-xs text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
