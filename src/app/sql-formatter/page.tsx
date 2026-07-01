"use client";
import { useState, useMemo, useRef } from "react";
import { Database, Copy, Check, Upload, Minimize2, Maximize2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/PageHeader";
import { format, type FormatOptionsWithLanguage } from "sql-formatter";
import { ToolDescription } from "@/components/shared/ToolDescription";
import { FaqSection } from "@/components/shared/FaqSection";
import { faqs, toolDescriptions } from "@/lib/data";

const SAMPLE = `SELECT e.id,e.name,e.salary,d.department_name FROM employees e LEFT JOIN departments d ON e.department_id=d.id WHERE e.salary>(SELECT AVG(salary) FROM employees) AND e.status='active' ORDER BY e.salary DESC LIMIT 10;`;

const DIALECTS = [
  { val: "sql", label: "Standard SQL" },
  { val: "mysql", label: "MySQL" },
  { val: "postgresql", label: "PostgreSQL" },
  { val: "sqlite", label: "SQLite" },
  { val: "bigquery", label: "BigQuery" },
  { val: "spark", label: "Spark SQL" },
];

export default function SqlFormatterPage() {
  const [input, setInput] = useState(SAMPLE);
  const [dialect, setDialect] = useState("sql");
  const [uppercase, setUppercase] = useState(true);
  const [minified, setMinified] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    if (minified) {
      return input.replace(/\s+/g, " ").trim();
    }
    try {
      const opts: FormatOptionsWithLanguage = {
        language: dialect as FormatOptionsWithLanguage["language"],
        keywordCase: uppercase ? "upper" : "lower",
        indentStyle: "standard",
        tabWidth: 2,
      };
      return format(input, opts);
    } catch (e) {
      return `Error: ${e instanceof Error ? e.message : "Could not format SQL"}`;
    }
  }, [input, dialect, uppercase, minified]);

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

  function download() {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "formatted.sql"; a.click();
    URL.revokeObjectURL(url);
  }

  const isError = output.startsWith("Error:");

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="SQL Formatter"
        description="Format and beautify SQL queries — MySQL, PostgreSQL, SQLite and more"
        icon={Database}
        gradient="from-blue-600 to-indigo-700"
        breadcrumbs={[{ name: "Developer Tools" }, { name: "SQL Formatter" }]}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-10 space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl border overflow-hidden">
            <button onClick={() => setMinified(false)} className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${!minified ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"}`}>
              <Maximize2 className="h-3.5 w-3.5" /> Format
            </button>
            <button onClick={() => setMinified(true)} className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${minified ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"}`}>
              <Minimize2 className="h-3.5 w-3.5" /> Minify
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm shrink-0">Dialect:</Label>
            <select value={dialect} onChange={(e) => setDialect(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              {DIALECTS.map((d) => <option key={d.val} value={d.val}>{d.label}</option>)}
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="rounded" />
            UPPERCASE keywords
          </label>

          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm text-muted-foreground hover:bg-muted transition-colors">
            <Upload className="h-4 w-4" /> Upload .sql
          </button>
          <input ref={fileRef} type="file" accept=".sql,text/plain" className="hidden" onChange={handleFile} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">SQL Input</CardTitle>
              <span className="text-xs text-muted-foreground">{input.split("\n").length} lines</span>
            </CardHeader>
            <CardContent>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-96 font-mono text-xs bg-muted/30 rounded-lg p-3 border border-input resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Paste SQL here or upload a .sql file…"
                spellCheck={false}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">{isError ? "Error" : minified ? "Minified SQL" : "Formatted SQL"}</CardTitle>
              {!isError && output && (
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

        <ToolDescription toolName="SQL Formatter" data={toolDescriptions["sql-formatter"]} />
        <FaqSection faqs={faqs["sql-formatter"]} />
      </div>
    </div>
  );
}
