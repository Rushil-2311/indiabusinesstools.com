"use client";
import { useState, useRef } from "react";
import { FileStack, Upload, Download, Trash2, RefreshCw, Scissors, Minimize2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/PageHeader";

type Tab = "merge" | "split" | "compress";

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(2)} MB`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function downloadBlob(blob: any, name: string) {
  const url = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

// ── Merge Tab ──────────────────────────────────────
function MergeTab() {
  const [files, setFiles] = useState<{ name: string; data: ArrayBuffer }[]>([]);
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    selected.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => setFiles((prev) => [...prev, { name: f.name, data: reader.result as ArrayBuffer }]);
      reader.readAsArrayBuffer(f);
    });
    e.target.value = "";
  }

  function remove(i: number) { setFiles((prev) => prev.filter((_, idx) => idx !== i)); }
  function move(i: number, dir: -1 | 1) {
    setFiles((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  async function merge() {
    if (files.length < 2) return;
    setProcessing(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();
      for (const f of files) {
        const doc = await PDFDocument.load(f.data);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const bytes = await merged.save();
      downloadBlob(bytes, "merged.pdf");
    } catch (e) {
      console.error(e);
      alert("Failed to merge PDFs. Ensure all files are valid PDFs.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-4">
      <div onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-muted-foreground/30 rounded-2xl p-10 text-center cursor-pointer hover:border-muted-foreground/60 hover:bg-muted/20 transition-all">
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="font-medium text-muted-foreground text-sm">Click to add PDF files</p>
        <p className="text-xs text-muted-foreground mt-1">You can add multiple files — drag to reorder</p>
        <input ref={fileRef} type="file" accept=".pdf,application/pdf" multiple className="hidden" onChange={handleFiles} />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border bg-card">
              <span className="text-xs font-bold text-muted-foreground w-5 text-center">{i + 1}</span>
              <span className="flex-1 text-sm font-medium truncate">{f.name}</span>
              <span className="text-xs text-muted-foreground shrink-0">{fmtBytes(f.data.byteLength)}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="text-xs px-1.5 py-0.5 rounded border hover:bg-muted disabled:opacity-30">↑</button>
                <button onClick={() => move(i, 1)} disabled={i === files.length - 1} className="text-xs px-1.5 py-0.5 rounded border hover:bg-muted disabled:opacity-30">↓</button>
                <button onClick={() => remove(i)} className="text-muted-foreground hover:text-red-500 ml-1"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length >= 2 && (
        <button onClick={merge} disabled={processing}
          className="w-full py-2.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity">
          {processing ? <><RefreshCw className="h-4 w-4 animate-spin" /> Merging…</> : `Merge ${files.length} PDFs → Download`}
        </button>
      )}
    </div>
  );
}

// ── Split Tab ──────────────────────────────────────
function SplitTab() {
  const [file, setFile] = useState<{ name: string; data: ArrayBuffer; pages: number } | null>(null);
  const [rangeInput, setRangeInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const data = await f.arrayBuffer();
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(data);
    setFile({ name: f.name, data, pages: doc.getPageCount() });
    e.target.value = "";
  }

  async function split() {
    if (!file) return;
    setProcessing(true);
    try {
      const { PDFDocument } = await import("pdf-lib");

      // Parse range like "1-3, 5, 7-9"
      const ranges = rangeInput.trim()
        ? rangeInput.split(",").flatMap((part) => {
            const [a, b] = part.trim().split("-").map((n) => parseInt(n.trim()) - 1);
            if (isNaN(a)) return [];
            const end = isNaN(b) ? a : b;
            return [Array.from({ length: end - a + 1 }, (_, i) => a + i)];
          })
        : Array.from({ length: file.pages }, (_, i) => [i]); // each page separately

      for (let ri = 0; ri < ranges.length; ri++) {
        const pageNums = ranges[ri].filter((p) => p >= 0 && p < file.pages);
        if (pageNums.length === 0) continue;
        const src = await PDFDocument.load(file.data);
        const out = await PDFDocument.create();
        const pages = await out.copyPages(src, pageNums);
        pages.forEach((p) => out.addPage(p));
        const bytes = await out.save();
        const label = ranges.length === file.pages ? `page-${pageNums[0] + 1}` : `part-${ri + 1}`;
        downloadBlob(bytes, `${file.name.replace(".pdf", "")}_${label}.pdf`);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to split PDF.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-4">
      <div onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-muted-foreground/30 rounded-2xl p-10 text-center cursor-pointer hover:border-muted-foreground/60 hover:bg-muted/20 transition-all">
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="font-medium text-muted-foreground text-sm">{file ? file.name : "Click to upload a PDF"}</p>
        {file && <p className="text-xs text-muted-foreground mt-1">{file.pages} pages · {fmtBytes(file.data.byteLength)}</p>}
        <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFile} />
      </div>

      {file && (
        <div className="space-y-3">
          <div>
            <Label className="text-sm mb-1 block">Page ranges (optional)</Label>
            <input value={rangeInput} onChange={(e) => setRangeInput(e.target.value)}
              placeholder={`e.g. 1-3, 5, 7-${file.pages}  (leave empty to extract each page)`}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <p className="text-xs text-muted-foreground mt-1">Each range creates a separate PDF. Leave empty to split into individual pages.</p>
          </div>

          <button onClick={split} disabled={processing}
            className="w-full py-2.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity">
            {processing ? <><RefreshCw className="h-4 w-4 animate-spin" /> Splitting…</> : "Split & Download"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Compress Tab ──────────────────────────────────────
function CompressTab() {
  const [file, setFile] = useState<{ name: string; data: ArrayBuffer } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ size: number; savings: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const data = await f.arrayBuffer();
    setFile({ name: f.name, data });
    setResult(null);
    e.target.value = "";
  }

  async function compress() {
    if (!file) return;
    setProcessing(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(file.data, { updateMetadata: false });
      // Remove metadata to reduce size
      doc.setTitle("");
      doc.setAuthor("");
      doc.setSubject("");
      doc.setKeywords([]);
      doc.setProducer("IndianBusinessTools");
      doc.setCreator("IndianBusinessTools");
      const bytes = await doc.save({ useObjectStreams: true });
      const savings = Math.round((1 - bytes.byteLength / file.data.byteLength) * 100);
      setResult({ size: bytes.byteLength, savings });
      downloadBlob(bytes, file.name.replace(".pdf", "_compressed.pdf"));
    } catch (e) {
      console.error(e);
      alert("Failed to compress PDF.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong>Limitation:</strong> Browser-based compression works by repacking PDF structure and removing metadata. It won't reduce the quality of embedded images inside the PDF. For heavy image-based PDFs, reduction may be minimal.
      </div>

      <div onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-muted-foreground/30 rounded-2xl p-10 text-center cursor-pointer hover:border-muted-foreground/60 hover:bg-muted/20 transition-all">
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="font-medium text-muted-foreground text-sm">{file ? file.name : "Click to upload a PDF"}</p>
        {file && <p className="text-xs text-muted-foreground mt-1">{fmtBytes(file.data.byteLength)}</p>}
        <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFile} />
      </div>

      {file && (
        <button onClick={compress} disabled={processing}
          className="w-full py-2.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity">
          {processing ? <><RefreshCw className="h-4 w-4 animate-spin" /> Compressing…</> : "Compress & Download"}
        </button>
      )}

      {result && (
        <div className="rounded-xl border p-4 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Output size</span>
            <span className="font-semibold">{fmtBytes(result.size)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Reduction</span>
            <span className={`font-bold ${result.savings > 0 ? "text-green-600" : "text-muted-foreground"}`}>
              {result.savings > 0 ? `${result.savings}% smaller` : "No change (PDF already optimal)"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ──────────────────────────────────────
export default function PdfToolsPage() {
  const [tab, setTab] = useState<Tab>("merge");

  const tabs: { val: Tab; label: string; icon: React.ElementType }[] = [
    { val: "merge", label: "Merge PDFs", icon: FileStack },
    { val: "split", label: "Split PDF", icon: Scissors },
    { val: "compress", label: "Compress PDF", icon: Minimize2 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="PDF Tools"
        description="Merge, split and compress PDF files — all in your browser, no uploads"
        icon={FileStack}
        gradient="from-red-600 to-rose-700"
        breadcrumbs={[{ name: "Utility Tools" }, { name: "PDF Tools" }]}
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-10 space-y-6">
        {/* Tab bar */}
        <div className="flex rounded-xl border overflow-hidden">
          {tabs.map((t) => (
            <button key={t.val} onClick={() => setTab(t.val)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${tab === t.val ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"}`}>
              <t.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{t.label}</span>
              <span className="sm:hidden">{t.label.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        <Card>
          <CardContent className="pt-6">
            {tab === "merge" && <MergeTab />}
            {tab === "split" && <SplitTab />}
            {tab === "compress" && <CompressTab />}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          Powered by <strong>pdf-lib</strong> — your PDF files never leave your device.
        </p>
      </div>
    </div>
  );
}
