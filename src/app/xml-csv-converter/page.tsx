"use client";
import { useState, useMemo, useRef } from "react";
import { FileSpreadsheet, Copy, Check, Download, ArrowLeftRight, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { ToolDescription } from "@/components/shared/ToolDescription";
import { FaqSection } from "@/components/shared/FaqSection";
import { faqs, toolDescriptions } from "@/lib/data";

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<data>
  <row>
    <name>Priya Sharma</name>
    <age>28</age>
    <city>Mumbai</city>
    <salary>85000</salary>
  </row>
  <row>
    <name>Rahul Verma</name>
    <age>34</age>
    <city>Delhi</city>
    <salary>120000</salary>
  </row>
  <row>
    <name>Sneha Patel</name>
    <age>26</age>
    <city>Bengaluru</city>
    <salary>95000</salary>
  </row>
</data>`;

const SAMPLE_CSV = `name,age,city,salary
Priya Sharma,28,Mumbai,85000
Rahul Verma,34,Delhi,120000
Sneha Patel,26,Bengaluru,95000`;

function xmlToCsv(xml: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml.trim(), "application/xml");
    const err = doc.querySelector("parsererror");
    if (err) return `Error: Invalid XML`;

    // Collect all leaf-element tag names from first row child
    const root = doc.documentElement;
    const rows = Array.from(root.children);
    if (rows.length === 0) return "Error: No rows found";

    const headers = Array.from(rows[0].children).map((c) => c.tagName);
    if (headers.length === 0) return "Error: No columns found";

    const escape = (v: string) => (v.includes(",") || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v);
    const csvRows = rows.map((row) =>
      headers.map((h) => escape(row.querySelector(h)?.textContent?.trim() ?? "")).join(",")
    );
    return [headers.join(","), ...csvRows].join("\n");
  } catch {
    return "Error: Could not parse XML";
  }
}

function csvToXml(csv: string): string {
  try {
    const lines = csv.trim().split(/\r?\n/);
    if (lines.length < 2) return "Error: Need at least a header row and one data row";
    const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
    const rows = lines.slice(1).map((line) => line.split(",").map((v) => v.trim().replace(/^"|"$/g, "")));

    const rowsXml = rows.map((row) => {
      const cols = headers.map((h, i) => `    <${h}>${row[i] ?? ""}</${h}>`).join("\n");
      return `  <row>\n${cols}\n  </row>`;
    }).join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>\n<data>\n${rowsXml}\n</data>`;
  } catch {
    return "Error: Could not parse CSV";
  }
}

function download(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function XmlCsvConverterPage() {
  const [mode, setMode] = useState<"xml2csv" | "csv2xml">("xml2csv");
  const [input, setInput] = useState(SAMPLE_XML);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    return mode === "xml2csv" ? xmlToCsv(input) : csvToXml(input);
  }, [input, mode]);

  const tableData = useMemo(() => {
    if (mode !== "xml2csv" || !output || output.startsWith("Error:")) return null;
    const lines = output.split("\n");
    if (lines.length < 2) return null;
    const headers = lines[0].split(",");
    const rows = lines.slice(1).map((l) => l.split(","));
    return { headers, rows };
  }, [mode, output]);

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
    setMode(mode === "xml2csv" ? "csv2xml" : "xml2csv");
  }

  const isError = output.startsWith("Error:");
  const ext = mode === "xml2csv" ? "csv" : "xml";
  const mime = mode === "xml2csv" ? "text/csv" : "application/xml";

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="XML ↔ CSV Converter"
        description="Convert between XML and CSV instantly — paste text or upload a file"
        icon={FileSpreadsheet}
        gradient="from-emerald-500 to-teal-600"
        breadcrumbs={[{ name: "Developer Tools" }, { name: "XML to CSV Converter" }]}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-10 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl border overflow-hidden">
            {[
              { val: "xml2csv", label: "XML → CSV" },
              { val: "csv2xml", label: "CSV → XML" },
            ].map((m) => (
              <button
                key={m.val}
                onClick={() => { setMode(m.val as typeof mode); setInput(m.val === "xml2csv" ? SAMPLE_XML : SAMPLE_CSV); }}
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
            <Upload className="h-4 w-4" /> Upload {mode === "xml2csv" ? "XML" : "CSV"}
          </button>
          <input ref={fileRef} type="file" accept={mode === "xml2csv" ? ".xml,text/xml" : ".csv,text/csv"} className="hidden" onChange={handleFile} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">{mode === "xml2csv" ? "XML Input" : "CSV Input"}</CardTitle>
              <span className="text-xs text-muted-foreground">{input.split("\n").length} lines</span>
            </CardHeader>
            <CardContent>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-72 font-mono text-xs bg-muted/30 rounded-lg p-3 border border-input resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder={mode === "xml2csv" ? "Paste XML here or upload a file…" : "Paste CSV here or upload a file…"}
                spellCheck={false}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">{mode === "xml2csv" ? "CSV Output" : "XML Output"}</CardTitle>
              <div className="flex items-center gap-2">
                {!isError && output && (
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

        {tableData && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Table Preview ({tableData.rows.length} rows)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto max-h-60 overflow-y-auto rounded-b-xl">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                    <tr className="border-b">
                      {tableData.headers.map((h) => (
                        <th key={h} className="px-4 py-2 text-left font-semibold whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.rows.map((row, ri) => (
                      <tr key={ri} className="border-b last:border-0 hover:bg-muted/30">
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-4 py-2 text-muted-foreground whitespace-nowrap">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground text-center">All conversion happens in your browser — your data never leaves your device.</p>

        <ToolDescription toolName="XML ↔ CSV Converter" data={toolDescriptions["xml-csv-converter"]} />
        <FaqSection faqs={faqs["xml-csv-converter"]} />
      </div>
    </div>
  );
}
