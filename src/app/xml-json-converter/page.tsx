"use client";
import { useState, useMemo, useRef } from "react";
import { FileCode, Copy, Check, Download, ArrowLeftRight, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/PageHeader";

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<employees>
  <employee>
    <id>1</id>
    <name>Priya Sharma</name>
    <department>Engineering</department>
    <salary>85000</salary>
  </employee>
  <employee>
    <id>2</id>
    <name>Rahul Verma</name>
    <department>Marketing</department>
    <salary>72000</salary>
  </employee>
</employees>`;

const SAMPLE_JSON = JSON.stringify({
  employees: {
    employee: [
      { id: 1, name: "Priya Sharma", department: "Engineering", salary: 85000 },
      { id: 2, name: "Rahul Verma", department: "Marketing", salary: 72000 },
    ],
  },
}, null, 2);

function xmlToJson(xml: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml.trim(), "application/xml");
    const err = doc.querySelector("parsererror");
    if (err) return `Error: Invalid XML — ${err.textContent?.trim().split("\n")[0]}`;
    function nodeToObj(node: Element): unknown {
      const children = Array.from(node.children);
      if (children.length === 0) {
        const text = node.textContent?.trim() ?? "";
        const num = Number(text);
        return text !== "" && !isNaN(num) ? num : text;
      }
      const grouped: Record<string, unknown[]> = {};
      for (const child of children) {
        if (!grouped[child.tagName]) grouped[child.tagName] = [];
        grouped[child.tagName].push(nodeToObj(child));
      }
      const result: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(grouped)) {
        result[k] = v.length === 1 ? v[0] : v;
      }
      return result;
    }
    const root = doc.documentElement;
    return JSON.stringify({ [root.tagName]: nodeToObj(root) }, null, 2);
  } catch {
    return "Error: Could not parse XML";
  }
}

function jsonToXml(json: string, indent = 0): string {
  try {
    const obj = JSON.parse(json);
    function toXml(val: unknown, tag: string, lvl: number): string {
      const pad = "  ".repeat(lvl);
      if (val === null || val === undefined) return `${pad}<${tag}/>`;
      if (Array.isArray(val)) return val.map((v) => toXml(v, tag, lvl)).join("\n");
      if (typeof val === "object") {
        const inner = Object.entries(val as Record<string, unknown>)
          .map(([k, v]) => toXml(v, k, lvl + 1))
          .join("\n");
        return `${pad}<${tag}>\n${inner}\n${pad}</${tag}>`;
      }
      return `${pad}<${tag}>${val}</${tag}>`;
    }
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return "<root/>";
    const [rootTag, rootVal] = entries[0];
    return `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(rootVal, rootTag, 0)}`;
  } catch {
    return "Error: Invalid JSON";
  }
}

function download(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function XmlJsonConverterPage() {
  const [mode, setMode] = useState<"xml2json" | "json2xml">("xml2json");
  const [input, setInput] = useState(SAMPLE_XML);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    return mode === "xml2json" ? xmlToJson(input) : jsonToXml(input);
  }, [input, mode]);

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

  function swap() {
    setInput(output);
    setMode(mode === "xml2json" ? "json2xml" : "xml2json");
  }

  const isError = output.startsWith("Error:");
  const ext = mode === "xml2json" ? "json" : "xml";
  const mime = mode === "xml2json" ? "application/json" : "application/xml";

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="XML ↔ JSON Converter"
        description="Convert between XML and JSON instantly — paste text or upload a file"
        icon={FileCode}
        gradient="from-cyan-500 to-blue-600"
        breadcrumbs={[{ name: "Developer Tools" }, { name: "XML to JSON Converter" }]}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-10 space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl border overflow-hidden">
            {[
              { val: "xml2json", label: "XML → JSON" },
              { val: "json2xml", label: "JSON → XML" },
            ].map((m) => (
              <button
                key={m.val}
                onClick={() => { setMode(m.val as typeof mode); setInput(m.val === "xml2json" ? SAMPLE_XML : SAMPLE_JSON); }}
                className={`px-4 py-2 text-sm font-medium transition-colors ${mode === m.val ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"}`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <button onClick={swap} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm text-muted-foreground hover:bg-muted transition-colors">
            <ArrowLeftRight className="h-4 w-4" /> Swap
          </button>

          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm text-muted-foreground hover:bg-muted transition-colors">
            <Upload className="h-4 w-4" /> Upload {mode === "xml2json" ? "XML" : "JSON"}
          </button>
          <input ref={fileRef} type="file" accept={mode === "xml2json" ? ".xml,text/xml" : ".json,application/json"} className="hidden" onChange={handleFile} />
        </div>

        {/* Editor panels */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">{mode === "xml2json" ? "XML Input" : "JSON Input"}</CardTitle>
              <span className="text-xs text-muted-foreground">{input.split("\n").length} lines</span>
            </CardHeader>
            <CardContent>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-72 font-mono text-xs bg-muted/30 rounded-lg p-3 border border-input resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder={mode === "xml2json" ? "Paste XML here or upload a file…" : "Paste JSON here or upload a file…"}
                spellCheck={false}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">{mode === "xml2json" ? "JSON Output" : "XML Output"}</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{output.split("\n").length} lines</span>
                {!isError && (
                  <>
                    <button onClick={copy} className="flex items-center gap-1 px-2 py-1 rounded-md text-xs border hover:bg-muted transition-colors">
                      {copied ? <><Check className="h-3 w-3 text-green-500" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
                    </button>
                    <button onClick={() => download(output, `output.${ext}`, mime)} className="flex items-center gap-1 px-2 py-1 rounded-md text-xs border hover:bg-muted transition-colors">
                      <Download className="h-3 w-3" /> Download
                    </button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <textarea
                value={output}
                readOnly
                className={`w-full h-72 font-mono text-xs rounded-lg p-3 border resize-none focus:outline-none ${isError ? "bg-red-50 border-red-200 text-red-700" : "bg-muted/30 border-input"}`}
                spellCheck={false}
              />
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-muted-foreground text-center">All conversion happens in your browser — your data never leaves your device.</p>
      </div>
    </div>
  );
}
