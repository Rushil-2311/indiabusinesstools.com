"use client";
import { useState, useRef } from "react";
import { ScanText, Upload, Copy, Check, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/PageHeader";

type Status = "idle" | "loading" | "done" | "error";

export default function ImageToTextPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [lang, setLang] = useState("eng");
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  function loadFile(file: File) {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setText("");
    setStatus("idle");
    setProgress(0);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) loadFile(file);
  }

  async function runOCR() {
    if (!imageUrl) return;
    setStatus("loading");
    setProgress(0);
    setText("");

    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker(lang, 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") setProgress(Math.round(m.progress * 100));
        },
      });
      const { data } = await worker.recognize(imageUrl);
      setText(data.text.trim());
      await worker.terminate();
      setStatus("done");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }

  function copy() {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function download() {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "extracted-text.txt"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Image to Text (OCR)"
        description="Extract text from images using Optical Character Recognition — works in your browser"
        icon={ScanText}
        gradient="from-violet-500 to-purple-700"
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-10 space-y-6">
        {/* Notice */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>Note:</strong> OCR runs entirely in your browser via Tesseract.js. The first run downloads ~25MB of language data — subsequent runs are instant.
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Upload + settings */}
          <div className="space-y-4">
            <div
              ref={dropRef}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => !imageUrl && fileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl text-center transition-all ${imageUrl ? "p-2 border-muted" : "p-12 border-muted-foreground/30 hover:border-muted-foreground/60 hover:bg-muted/20 cursor-pointer"}`}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="selected" className="w-full max-h-64 object-contain rounded-xl" />
              ) : (
                <>
                  <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-medium text-muted-foreground mb-1">Drop image here or click to upload</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG, BMP, TIFF</p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

            {imageUrl && (
              <button onClick={() => fileRef.current?.click()} className="text-xs text-muted-foreground hover:text-foreground underline">
                Choose different image
              </button>
            )}

            <div>
              <Label className="text-sm mb-2 block">Language</Label>
              <select value={lang} onChange={(e) => setLang(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="eng">English</option>
                <option value="hin">Hindi</option>
                <option value="tam">Tamil</option>
                <option value="tel">Telugu</option>
                <option value="ben">Bengali</option>
                <option value="mar">Marathi</option>
                <option value="guj">Gujarati</option>
                <option value="kan">Kannada</option>
              </select>
            </div>

            <button
              onClick={runOCR}
              disabled={!imageUrl || status === "loading"}
              className="w-full py-2.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <><RefreshCw className="h-4 w-4 animate-spin" /> Extracting text… {progress > 0 ? `${progress}%` : ""}</>
              ) : "Extract Text"}
            </button>
          </div>

          {/* Right: Output */}
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">
                {status === "idle" ? "Extracted Text" : status === "loading" ? `Processing… ${progress}%` : status === "error" ? "Error" : `Done — ${text.split(/\s+/).filter(Boolean).length} words`}
              </CardTitle>
              {status === "done" && text && (
                <div className="flex items-center gap-2">
                  <button onClick={copy} className="flex items-center gap-1 px-2 py-1 rounded-md text-xs border hover:bg-muted transition-colors">
                    {copied ? <><Check className="h-3 w-3 text-green-500" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
                  </button>
                  <button onClick={download} className="flex items-center gap-1 px-2 py-1 rounded-md text-xs border hover:bg-muted transition-colors">
                    Download
                  </button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {status === "loading" && (
                <div className="h-2 rounded-full bg-muted overflow-hidden mb-4">
                  <div className="h-full bg-foreground transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
                </div>
              )}
              {status === "error" && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                  OCR failed. Try a clearer image with better contrast and resolution.
                </div>
              )}
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                readOnly={status === "loading"}
                className="w-full h-80 text-sm bg-muted/30 rounded-lg p-3 border border-input resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Extracted text will appear here after you click Extract Text…"
              />
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Powered by <strong>Tesseract.js</strong> — your images never leave your device.
        </p>
      </div>
    </div>
  );
}
