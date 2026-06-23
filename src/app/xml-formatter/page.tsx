"use client";
import { useState, useMemo, useRef } from "react";
import { Code, Copy, Check, Download, Upload, Minimize2, Maximize2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/PageHeader";

const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?><employees><employee><id>1</id><name>Priya Sharma</name><department>Engineering</department><salary>85000</salary></employee><employee><id>2</id><name>Rahul Verma</name><department>Marketing</department><salary>72000</salary></employee></employees>`;

function formatXml(xml: string, indent: number): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml.trim(), "application/xml");
    const err = doc.querySelector("parsererror");
    if (err) return `Error: Invalid XML — ${err.textContent?.trim().split("\n")[0]}`;

    const pad = " ".repeat(indent);
    function serialize(node: Node, level: number): string {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = (node.textContent ?? "").trim();
        return text ? text : "";
      }
      if (node.nodeType === Node.COMMENT_NODE) {
        return `${"  ".repeat(level)}<!--${node.textContent}-->`;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return "";
      const el = node as Element;
      const tag = el.tagName;
      const attrs = Array.from(el.attributes).map((a) => ` ${a.name}="${a.value}"`).join("");
      const children = Array.from(el.childNodes)
        .map((c) => serialize(c, level + 1))
        .filter(Boolean);

      if (children.length === 0) return `${pad.repeat(level)}<${tag}${attrs}/>`;
      if (children.length === 1 && !children[0].includes("\n")) {
        return `${pad.repeat(level)}<${tag}${attrs}>${children[0]}</${tag}>`;
      }
      return `${pad.repeat(level)}<${tag}${attrs}>\n${children.map((c) => (c.startsWith(pad) ? c : pad.repeat(level + 1) + c)).join("\n")}\n${pad.repeat(level)}</${tag}>`;
    }

    const declaration = xml.trim().startsWith("<?xml") ? `<?xml version="1.0" encoding="UTF-8"?>\n` : "";
    return declaration + serialize(doc.documentElement, 0);
  } catch {
    return "Error: Could not format XML";
  }
}

function minifyXml(xml: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml.trim(), "application/xml");
    const err = doc.querySelector("parsererror");
    if (err) return `Error: Invalid XML`;
    return new XMLSerializer().serializeToString(doc).replace(/>\s+</g, "><").trim();
  } catch {
    return "Error: Could not minify XML";
  }
}

function download(content: string, filename: string) {
  const blob = new Blob([content], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function XmlFormatterPage() {
  const [input, setInput] = useState(SAMPLE);
  const [indent, setIndent] = useState(2);
  const [minified, setMinified] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    return minified ? minifyXml(input) : formatXml(input, indent);
  }, [input, indent, minified]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setInput(reader.result as string);
    reader.readAsText(file);
    e.target.value = "";
  }

  function copy() {
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isError = output.startsWith("Error:");
  const lineCount = input.trim() ? output.split("\n").length : 0;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="XML Formatter"
        description="Beautify, format and minify XML — validate structure instantly"
        icon={Code}
        gradient="from-orange-500 to-red-500"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-10 space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl border overflow-hidden">
            <button onClick={() => setMinified(false)} className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${!minified ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"}`}>
              <Maximize2 className="h-3.5 w-3.5" /> Beautify
            </button>
            <button onClick={() => setMinified(true)} className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${minified ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"}`}>
              <Minimize2 className="h-3.5 w-3.5" /> Minify
            </button>
          </div>

          {!minified && (
            <div className="flex items-center gap-2">
              <Label className="text-sm">Indent:</Label>
              <select value={indent} onChange={(e) => setIndent(+e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </div>
          )}

          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm text-muted-foreground hover:bg-muted transition-colors">
            <Upload className="h-4 w-4" /> Upload XML
          </button>
          <input ref={fileRef} type="file" accept=".xml,text/xml" className="hidden" onChange={handleFile} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">Input XML</CardTitle>
              <span className="text-xs text-muted-foreground">{input.split("\n").length} lines</span>
            </CardHeader>
            <CardContent>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-96 font-mono text-xs bg-muted/30 rounded-lg p-3 border border-input resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Paste XML here or upload a file…"
                spellCheck={false}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">
                {isError ? "Error" : minified ? "Minified XML" : "Formatted XML"}
                {!isError && <span className="ml-2 text-xs font-normal text-muted-foreground">({lineCount} lines)</span>}
              </CardTitle>
              {!isError && output && (
                <div className="flex items-center gap-2">
                  <button onClick={copy} className="flex items-center gap-1 px-2 py-1 rounded-md text-xs border hover:bg-muted transition-colors">
                    {copied ? <><Check className="h-3 w-3 text-green-500" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
                  </button>
                  <button onClick={() => download(output, "formatted.xml")} className="flex items-center gap-1 px-2 py-1 rounded-md text-xs border hover:bg-muted transition-colors">
                    <Download className="h-3 w-3" /> Download
                  </button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <textarea
                value={output}
                readOnly
                className={`w-full h-96 font-mono text-xs rounded-lg p-3 border resize-none focus:outline-none ${isError ? "bg-red-50 border-red-200 text-red-700" : "bg-muted/30 border-input"}`}
                spellCheck={false}
              />
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-muted-foreground text-center">All formatting happens in your browser — your data never leaves your device.</p>
      </div>
    </div>
  );
}
