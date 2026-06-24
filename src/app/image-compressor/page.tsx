"use client";
import { useState, useRef, useCallback } from "react";
import { ImageDown, Upload, Download, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/PageHeader";

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(2)} MB`;
}

interface Result {
  url: string;
  size: number;
  width: number;
  height: number;
  name: string;
  format: string;
}

export default function ImageCompressorPage() {
  const [original, setOriginal] = useState<{ url: string; size: number; width: number; height: number; name: string } | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const [format, setFormat] = useState<"original" | "jpeg" | "png" | "webp">("jpeg");
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  function loadImage(file: File) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setOriginal({ url, size: file.size, width: img.naturalWidth, height: img.naturalHeight, name: file.name });
      setResult(null);
    };
    img.src = url;
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) loadImage(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) loadImage(file);
  }

  const compress = useCallback(() => {
    if (!original) return;
    setProcessing(true);

    const img = new Image();
    img.onload = () => {
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (maxWidth > 0 && w > maxWidth) { h = Math.round(h * (maxWidth / w)); w = maxWidth; }
      if (maxHeight > 0 && h > maxHeight) { w = Math.round(w * (maxHeight / h)); h = maxHeight; }

      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);

      const mime = format === "original" ? (original.name.endsWith(".png") ? "image/png" : "image/jpeg")
        : format === "png" ? "image/png"
        : format === "webp" ? "image/webp"
        : "image/jpeg";

      const ext = mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";

      canvas.toBlob((blob) => {
        if (!blob) { setProcessing(false); return; }
        const url = URL.createObjectURL(blob);
        const baseName = original.name.replace(/\.[^.]+$/, "");
        setResult({ url, size: blob.size, width: w, height: h, name: `${baseName}_compressed.${ext}`, format: ext });
        setProcessing(false);
      }, mime, quality / 100);
    };
    img.src = original.url;
  }, [original, quality, maxWidth, maxHeight, format]);

  function downloadResult() {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url; a.download = result.name; a.click();
  }

  const savings = original && result ? Math.round((1 - result.size / original.size) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Image Compressor & Resizer"
        description="Compress and resize images instantly in your browser — JPG, PNG, WebP"
        icon={ImageDown}
        gradient="from-pink-500 to-rose-600"
        breadcrumbs={[{ name: "Utility Tools" }, { name: "Image Compressor" }]}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-10 space-y-6">
        {/* Upload area */}
        {!original && (
          <div
            ref={dropRef}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-muted-foreground/30 rounded-2xl p-16 text-center cursor-pointer hover:border-muted-foreground/60 hover:bg-muted/20 transition-all"
          >
            <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="font-medium text-muted-foreground mb-1">Drop an image here or click to upload</p>
            <p className="text-xs text-muted-foreground">Supports JPG, PNG, WebP, GIF</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>
        )}

        {original && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Settings */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Settings</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-sm">Quality: {quality}%</Label>
                    <span className="text-xs text-muted-foreground">{quality < 60 ? "High compression" : quality < 80 ? "Balanced" : "High quality"}</span>
                  </div>
                  <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(+e.target.value)}
                    className="w-full accent-foreground" />
                </div>

                <div>
                  <Label className="text-sm mb-2 block">Output Format</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["original", "jpeg", "png", "webp"] as const).map((f) => (
                      <button key={f} onClick={() => setFormat(f)}
                        className={`py-1.5 rounded-lg text-xs font-medium border transition-colors ${format === f ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground/40"}`}>
                        {f === "original" ? "Same" : f.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Max Width (px)</Label>
                    <input type="number" value={maxWidth || ""} onChange={(e) => setMaxWidth(+e.target.value || 0)}
                      placeholder={`${original.width} (original)`}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <Label className="text-xs">Max Height (px)</Label>
                    <input type="number" value={maxHeight || ""} onChange={(e) => setMaxHeight(+e.target.value || 0)}
                      placeholder={`${original.height} (original)`}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Leave width/height empty to keep original dimensions.</p>

                <div className="flex gap-2">
                  <button onClick={compress} disabled={processing}
                    className="flex-1 py-2.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                    {processing ? <><RefreshCw className="h-4 w-4 animate-spin" /> Compressing…</> : "Compress Image"}
                  </button>
                  <button onClick={() => { setOriginal(null); setResult(null); }}
                    className="px-4 py-2.5 rounded-xl border text-sm text-muted-foreground hover:bg-muted transition-colors">
                    Reset
                  </button>
                </div>

                <div>
                  <button onClick={() => fileRef.current?.click()} className="text-xs text-muted-foreground hover:text-foreground underline transition-colors">
                    Upload a different image
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Original</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src={original.url} alt="original" className="w-full rounded-lg object-contain max-h-48 bg-muted/20" />
                  <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                    <span>{original.width} × {original.height} px</span>
                    <span className="font-medium">{fmtBytes(original.size)}</span>
                  </div>
                </CardContent>
              </Card>

              {result && (
                <Card className="border-foreground/20">
                  <CardHeader className="pb-2 flex-row items-center justify-between">
                    <CardTitle className="text-sm">Compressed</CardTitle>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${savings > 0 ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                      {savings > 0 ? `−${savings}% smaller` : "No change"}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <img src={result.url} alt="compressed" className="w-full rounded-lg object-contain max-h-48 bg-muted/20" />
                    <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                      <span>{result.width} × {result.height} px · {result.format.toUpperCase()}</span>
                      <span className="font-medium">{fmtBytes(result.size)}</span>
                    </div>
                    <button onClick={downloadResult}
                      className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity">
                      <Download className="h-4 w-4" /> Download
                    </button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">All processing happens in your browser using Canvas API — your images never leave your device.</p>
      </div>
    </div>
  );
}
