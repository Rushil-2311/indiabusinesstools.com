"use client";

import { useState, useRef, useCallback } from "react";
import { ImageIcon, Download, Trash2, Upload, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Format = "image/png" | "image/jpeg" | "image/webp";

const FORMAT_LABELS: Record<Format, string> = {
  "image/png": "PNG",
  "image/jpeg": "JPG",
  "image/webp": "WebP",
};

const FORMAT_EXT: Record<Format, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export default function ImageConverter() {
  const [original, setOriginal] = useState<{ url: string; name: string; size: number } | null>(null);
  const [converted, setConverted] = useState<{ url: string; size: number } | null>(null);
  const [outputFormat, setOutputFormat] = useState<Format>("image/webp");
  const [quality, setQuality] = useState(90);
  const [dragging, setDragging] = useState(false);
  const [converting, setConverting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setOriginal({ url, name: file.name, size: file.size });
    setConverted(null);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const convert = () => {
    if (!original) return;
    setConverting(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      if (outputFormat === "image/jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL(outputFormat, quality / 100);
      const byteStr = atob(dataUrl.split(",")[1]);
      const bytes = new Uint8Array(byteStr.length);
      for (let i = 0; i < byteStr.length; i++) bytes[i] = byteStr.charCodeAt(i);
      const blob = new Blob([bytes], { type: outputFormat });
      setConverted({ url: dataUrl, size: blob.size });
      setConverting(false);
    };
    img.src = original.url;
  };

  const download = () => {
    if (!converted || !original) return;
    const a = document.createElement("a");
    a.href = converted.url;
    const baseName = original.name.replace(/\.[^/.]+$/, "");
    a.download = `${baseName}.${FORMAT_EXT[outputFormat]}`;
    a.click();
  };

  const reset = () => {
    setOriginal(null);
    setConverted(null);
  };

  const fmtSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  const saving =
    original && converted
      ? Math.round(((original.size - converted.size) / original.size) * 100)
      : null;

  return (
    <>
      <PageHeader
        title="Image Converter"
        description="Convert images between PNG, JPG, and WebP formats instantly in your browser. No upload to server."
        icon={ImageIcon}
        gradient="from-pink-500 to-rose-600"
        breadcrumbs={[{ name: "Utility Tools" }, { name: "Image Converter" }]}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 mb-16">
        {!original ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-200 ${
              dragging
                ? "border-pink-400 bg-pink-50 dark:bg-pink-950/20 scale-[1.01]"
                : "border-border hover:border-pink-300 hover:bg-muted/40"
            }`}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-semibold text-foreground mb-1">Drop an image here</p>
            <p className="text-sm text-muted-foreground">or click to browse — PNG, JPG, WebP, GIF supported</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Controls */}
            <Card className="p-5 border-border/50">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex-1 min-w-[200px]">
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Output Format</p>
                  <div className="flex gap-2">
                    {(Object.keys(FORMAT_LABELS) as Format[]).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => { setOutputFormat(fmt); setConverted(null); }}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                          outputFormat === fmt
                            ? "bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-500/20"
                            : "bg-background border-border hover:border-pink-300 text-foreground"
                        }`}
                      >
                        {FORMAT_LABELS[fmt]}
                      </button>
                    ))}
                  </div>
                </div>

                {(outputFormat === "image/jpeg" || outputFormat === "image/webp") && (
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      Quality: <span className="text-foreground">{quality}%</span>
                    </p>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={quality}
                      onChange={(e) => { setQuality(Number(e.target.value)); setConverted(null); }}
                      className="w-full accent-pink-500"
                    />
                  </div>
                )}

                <div className="flex gap-2 shrink-0">
                  <Button onClick={convert} disabled={converting} className="bg-pink-500 hover:bg-pink-600 text-white shadow-md shadow-pink-500/20">
                    {converting ? "Converting…" : (
                      <><ArrowRight className="h-4 w-4 mr-2" /> Convert</>
                    )}
                  </Button>
                  <Button variant="ghost" onClick={reset} className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden border-border/50">
                <div className="px-4 py-3 bg-muted/40 border-b flex items-center justify-between">
                  <span className="text-sm font-semibold">Original</span>
                  <span className="text-xs text-muted-foreground">{fmtSize(original.size)}</span>
                </div>
                <div className="p-4 bg-[repeating-conic-gradient(#f0f0f0_0%_25%,transparent_0%_50%)] bg-[size:20px_20px] flex items-center justify-center min-h-[250px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={original.url} alt="Original" className="max-h-64 max-w-full object-contain rounded shadow-sm" />
                </div>
                <div className="px-4 py-2 border-t text-xs text-muted-foreground truncate">{original.name}</div>
              </Card>

              <Card className="overflow-hidden border-border/50">
                <div className="px-4 py-3 bg-muted/40 border-b flex items-center justify-between">
                  <span className="text-sm font-semibold">Converted — {FORMAT_LABELS[outputFormat]}</span>
                  {converted && (
                    <span className={`text-xs font-medium ${saving && saving > 0 ? "text-emerald-600" : "text-muted-foreground"}`}>
                      {fmtSize(converted.size)}
                      {saving !== null && saving > 0 && ` (${saving}% smaller)`}
                    </span>
                  )}
                </div>
                <div className="p-4 bg-[repeating-conic-gradient(#f0f0f0_0%_25%,transparent_0%_50%)] bg-[size:20px_20px] flex items-center justify-center min-h-[250px]">
                  {converted ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={converted.url} alt="Converted" className="max-h-64 max-w-full object-contain rounded shadow-sm" />
                  ) : (
                    <p className="text-sm text-muted-foreground">Click Convert to see the result</p>
                  )}
                </div>
                <div className="px-4 py-2 border-t">
                  <Button size="sm" onClick={download} disabled={!converted} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Download className="h-4 w-4 mr-2" /> Download {converted ? FORMAT_LABELS[outputFormat] : ""}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-center">
          {[
            { title: "100% Private", desc: "All conversion happens in your browser. No image is uploaded to any server." },
            { title: "Lossless PNG", desc: "PNG output is always lossless — perfect for logos, icons, and screenshots." },
            { title: "WebP = Smaller", desc: "WebP is ~30% smaller than JPG at the same quality — ideal for web use." },
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
