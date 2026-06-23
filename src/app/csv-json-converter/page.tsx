"use client";
import { useState, useMemo, useRef } from "react";
import { Table, Copy, Check, Download, ArrowLeftRight, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";

const SAMPLE_CSV = `name,age,city,salary
Priya Sharma,28,Mumbai,85000
Rahul Verma,34,Delhi,120000
Sneha Patel,26,Bengaluru,95000
Amit Singh,31,Hyderabad,110000`;

const SAMPLE_JSON = JSON.stringify([
  { name: "Priya Sharma", age: 28, city: "Mumbai", salary: 85000 },
  { name: "Rahul Verma", age: 34, city: "Delhi", salary: 120000 },
  { name: "Sneha Patel", age: 26, city: "Bengaluru", salary: 95000 },
], null, 2);

function parseCSV(csv: string, delimiter: string): { headers: string[]; rows: string[][] } | null {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length < 1) return null;
  const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^"|"$/g, ""));
  const rows = lines.slice(1).map((line) =>
    line.split(delimiter).map((v) => v.trim().replace(/^"|"$/g, ""))
  );
  return { headers, rows };
}

function csvToJson(csv: string, delimiter: string): string {
  const parsed = parseCSV(csv, delimiter);
  if (!parsed) return "[]";
  const { headers, rows } = parsed;
  const objects = rows.map((row) =>
    Object.fromEntries(
      headers.map((h, i) => {
        const v = row[i] ?? "";
        const num = Number(v);
        return [h, v !== "" && !isNaN(num) ? num : v];
      })
    )
  );
  return JSON.stringify(objects, null, 2);
}

function jsonToCsv(jsonStr: string, delimiter: string): string {
  try {
    const data = JSON.parse(jsonStr);
    if (!Array.isArray(data) || data.length === 0) return "";
    const headers = Object.keys(data[0]);
    const escape = (v: unknown) => {
      const s = v === null || v === undefined ? "" : String(v);
      return s.includes(delimiter) || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = data.map((row) => headers.map((h) => escape(row[h])).join(delimiter));
    return [headers.join(delimiter), ...rows].join("\n");
  } catch {
    return "Invalid JSON";
  }
}

function download(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function CSVJSONConverterPage() {
  const [mode, setMode] = useState<"csv2json" | "json2csv">("csv2json");
  const [input, setInput] = useState(SAMPLE_CSV);
  const [delimiter, setDelimiter] = useState(",");
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    if (mode === "csv2json") return csvToJson(input, delimiter);
    return jsonToCsv(input, delimiter);
  }, [input, mode, delimiter]);

  const tableData = useMemo(() => {
    if (mode !== "csv2json") return null;
    return parseCSV(input, delimiter);
  }, [input, mode, delimiter]);

  function copy() {
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function swap() {
    setInput(output);
    setMode(mode === "csv2json" ? "json2csv" : "csv2json");
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setInput(reader.result as string);
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="CSV ↔ JSON Converter" description="Convert between CSV and JSON instantly with table preview" icon={Table} gradient="from-yellow-500 to-orange-500" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-10 space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl border overflow-hidden">
            {[{ val: "csv2json", label: "CSV → JSON" }, { val: "json2csv", label: "JSON → CSV" }].map((m) => (
              <button key={m.val} onClick={() => { setMode(m.val as typeof mode); setInput(m.val === "csv2json" ? SAMPLE_CSV : SAMPLE_JSON); }}
                className={`px-4 py-2 text-sm font-medium transition-colors ${mode === m.val ? "bg-orange-500 text-white" : "text-muted-foreground hover:bg-muted"}`}>
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm">Delimiter:</Label>
            <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value={"\t"}>Tab</option>
              <option value="|">Pipe (|)</option>
            </select>
          </div>

          <button onClick={swap} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm text-muted-foreground hover:bg-muted transition-colors">
            <ArrowLeftRight className="h-4 w-4" /> Swap
          </button>

          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm text-muted-foreground hover:bg-muted transition-colors">
            <Upload className="h-4 w-4" /> Upload {mode === "csv2json" ? "CSV" : "JSON"}
          </button>
          <input ref={fileRef} type="file" accept={mode === "csv2json" ? ".csv,text/csv" : ".json,application/json"} className="hidden" onChange={handleFile} />
        </div>

        {/* Editor panels */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">{mode === "csv2json" ? "CSV Input" : "JSON Input"}</CardTitle>
              <span className="text-xs text-muted-foreground">{input.split("\n").length} lines</span>
            </CardHeader>
            <CardContent>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-64 font-mono text-xs bg-muted/30 rounded-lg p-3 border border-input resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder={mode === "csv2json" ? "Paste your CSV here…" : "Paste your JSON array here…"}
                spellCheck={false}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">{mode === "csv2json" ? "JSON Output" : "CSV Output"}</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{output.split("\n").length} lines</span>
                <button onClick={copy} className="flex items-center gap-1 px-2 py-1 rounded-md text-xs border hover:bg-muted transition-colors">
                  {copied ? <><Check className="h-3 w-3 text-green-500" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
                </button>
                <button onClick={() => download(output, mode === "csv2json" ? "output.json" : "output.csv", mode === "csv2json" ? "application/json" : "text/csv")}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-xs border hover:bg-muted transition-colors">
                  <Download className="h-3 w-3" /> Download
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <textarea
                value={output}
                readOnly
                className="w-full h-64 font-mono text-xs bg-muted/30 rounded-lg p-3 border border-input resize-none focus:outline-none"
                spellCheck={false}
              />
            </CardContent>
          </Card>
        </div>

        {/* Table preview for CSV→JSON */}
        {tableData && tableData.headers.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Table Preview ({tableData.rows.length} rows)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto max-h-64 overflow-y-auto rounded-b-xl">
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
      </div>
    </div>
  );
}
