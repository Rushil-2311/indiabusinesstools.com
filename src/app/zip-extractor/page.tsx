"use client";
import { useState, useRef } from "react";
import { Archive, Upload, Download, FolderOpen, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";

interface ZipEntry {
  name: string;
  size: number;
  compressedSize: number;
  isDir: boolean;
  blob?: Blob;
}

function fmtBytes(b: number) {
  if (b === 0) return "—";
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(2)} MB`;
}

function fileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    pdf: "📄", jpg: "🖼️", jpeg: "🖼️", png: "🖼️", gif: "🖼️", webp: "🖼️",
    mp3: "🎵", mp4: "🎬", mov: "🎬", zip: "📦", json: "{ }", xml: "📋",
    csv: "📊", txt: "📝", js: "⚡", ts: "⚡", html: "🌐", css: "🎨",
    java: "☕", py: "🐍", sql: "🗄️",
  };
  return map[ext ?? ""] ?? "📄";
}

export default function ZipExtractorPage() {
  const [entries, setEntries] = useState<ZipEntry[]>([]);
  const [zipName, setZipName] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await processZip(file);
    e.target.value = "";
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) await processZip(file);
  }

  async function processZip(file: File) {
    setLoading(true);
    setEntries([]);
    setZipName(file.name);

    try {
      const JSZip = (await import("jszip")).default;
      const zip = await JSZip.loadAsync(file);
      const result: ZipEntry[] = [];

      for (const [name, entry] of Object.entries(zip.files)) {
        if (entry.dir) {
          result.push({ name, size: 0, compressedSize: 0, isDir: true });
        } else {
          const blob = await entry.async("blob");
          result.push({
            name,
            size: (entry as { _data?: { uncompressedSize?: number } })._data?.uncompressedSize ?? blob.size,
            compressedSize: blob.size,
            isDir: false,
            blob,
          });
        }
      }

      result.sort((a, b) => {
        if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
        return a.name.localeCompare(b.name);
      });

      setEntries(result);
    } catch (e) {
      console.error(e);
      alert("Failed to read ZIP file. The file may be corrupt or password-protected.");
    } finally {
      setLoading(false);
    }
  }

  function downloadFile(entry: ZipEntry) {
    if (!entry.blob) return;
    const url = URL.createObjectURL(entry.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = entry.name.split("/").pop() ?? entry.name;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadAll() {
    entries.filter((e) => !e.isDir && e.blob).forEach(downloadFile);
  }

  const fileCount = entries.filter((e) => !e.isDir).length;
  const totalSize = entries.reduce((s, e) => s + (e.isDir ? 0 : e.size), 0);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="ZIP Extractor"
        description="Extract and download files from ZIP archives — works entirely in your browser"
        icon={Archive}
        gradient="from-slate-600 to-gray-800"
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-10 space-y-6">
        {/* Upload area */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => !loading && fileRef.current?.click()}
          className="border-2 border-dashed border-muted-foreground/30 rounded-2xl p-12 text-center cursor-pointer hover:border-muted-foreground/60 hover:bg-muted/20 transition-all"
        >
          {loading ? (
            <><RefreshCw className="h-10 w-10 mx-auto mb-3 text-muted-foreground animate-spin" /><p className="text-muted-foreground font-medium">Reading ZIP…</p></>
          ) : (
            <>
              <Archive className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="font-medium text-muted-foreground mb-1">Drop a ZIP file here or click to upload</p>
              <p className="text-xs text-muted-foreground">Supports .zip files (not password-protected)</p>
            </>
          )}
          <input ref={fileRef} type="file" accept=".zip,application/zip,application/x-zip-compressed" className="hidden" onChange={handleFile} />
        </div>

        {entries.length > 0 && (
          <Card>
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">{zipName}</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">{fileCount} files · {fmtBytes(totalSize)} total</p>
              </div>
              {fileCount > 0 && (
                <button onClick={downloadAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity">
                  <Download className="h-3.5 w-3.5" /> Download All
                </button>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {entries.map((entry, i) => (
                  <div key={i} className={`flex items-center gap-3 px-4 py-2.5 border-b last:border-0 hover:bg-muted/30 transition-colors ${entry.isDir ? "bg-muted/10" : ""}`}>
                    <span className="text-base shrink-0">{entry.isDir ? "📁" : fileIcon(entry.name)}</span>
                    <span className={`flex-1 text-sm truncate ${entry.isDir ? "font-medium text-muted-foreground" : ""}`}>
                      {entry.name}
                    </span>
                    {!entry.isDir && (
                      <>
                        <span className="text-xs text-muted-foreground shrink-0">{fmtBytes(entry.size)}</span>
                        <button onClick={() => downloadFile(entry)}
                          className="shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Powered by <strong>JSZip</strong> — your files never leave your device.
        </p>
      </div>
    </div>
  );
}
