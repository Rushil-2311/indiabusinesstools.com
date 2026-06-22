"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Copy, Check, Eye, Code } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

const SAMPLE = `# Welcome to Markdown Converter

## What is Markdown?
Markdown is a lightweight markup language for creating formatted text using a plain-text editor.

## Features
- **Bold text** and *italic text*
- Ordered and unordered lists
- \`inline code\` and code blocks
- [Links](https://indianbusinesstools.com) and images
- Tables, blockquotes, and more

## Code Example
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Table Example
| Tool | Category | Free |
|------|----------|------|
| SIP Calculator | Finance | ✅ |
| GST Calculator | Tax | ✅ |
| Image Converter | Utility | ✅ |

> **Tip:** Use this editor to write your README, blog post, or documentation — then export it instantly.
`;

export default function MarkdownConverter() {
  const [markdown, setMarkdown] = useState(SAMPLE);
  const [html, setHtml] = useState("");
  const [mode, setMode] = useState<"preview" | "html">("preview");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    import("marked").then(({ marked }) => {
      if (!cancelled) {
        const result = marked.parse(markdown) as string;
        setHtml(result);
      }
    });
    return () => { cancelled = true; };
  }, [markdown]);

  const handleCopy = () => {
    navigator.clipboard.writeText(mode === "html" ? html : markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHTML = () => {
    const full = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Document</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; color: #1a1a1a; }
  h1,h2,h3,h4 { font-weight: 700; margin-top: 1.5em; }
  code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
  pre { background: #f4f4f4; padding: 16px; border-radius: 8px; overflow-x: auto; }
  pre code { background: none; padding: 0; }
  blockquote { border-left: 4px solid #d1d5db; margin-left: 0; padding-left: 16px; color: #6b7280; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
  th { background: #f9fafb; font-weight: 600; }
  a { color: #3b82f6; }
  img { max-width: 100%; }
</style>
</head>
<body>${html}</body>
</html>`;
    const blob = new Blob([full], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "document.html";
    a.click();
  };

  const downloadDOC = () => {
    const wordHTML = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>Document</title>
<style>
  body { font-family: Calibri, sans-serif; font-size: 12pt; line-height: 1.6; }
  h1 { font-size: 24pt; } h2 { font-size: 18pt; } h3 { font-size: 14pt; }
  code, pre { font-family: Courier New, monospace; background: #f4f4f4; }
  table { border-collapse: collapse; width: 100%; }
  td, th { border: 1px solid #ccc; padding: 6px 10px; }
  th { background: #f0f0f0; font-weight: bold; }
</style></head>
<body>${html}</body></html>`;
    const blob = new Blob(["﻿", wordHTML], { type: "application/msword" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "document.doc";
    a.click();
  };

  const downloadPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"/>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 750px; margin: 0 auto; padding: 40px 20px; line-height: 1.7; color: #1a1a1a; }
  h1,h2,h3,h4 { font-weight: 700; margin-top: 1.5em; }
  code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
  pre { background: #f4f4f4; padding: 16px; border-radius: 8px; overflow-x: auto; }
  pre code { background: none; padding: 0; }
  blockquote { border-left: 4px solid #d1d5db; margin-left: 0; padding-left: 16px; color: #6b7280; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
  th { background: #f9fafb; font-weight: 600; }
  @media print { body { margin: 0; } }
</style></head>
<body>${html}</body></html>`);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 300);
  };

  const downloadMD = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "document.md";
    a.click();
  };

  return (
    <>
      <PageHeader
        title="Markdown Converter"
        description="Write Markdown and export to HTML, PDF, or Word DOC. Live preview included."
        icon={FileText}
        gradient="from-violet-500 to-purple-700"
      />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 mb-16">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setMode("preview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${mode === "preview" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Eye className="h-4 w-4" /> Preview
            </button>
            <button
              onClick={() => setMode("html")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${mode === "html" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Code className="h-4 w-4" /> HTML
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <><Check className="h-4 w-4 mr-1.5" />Copied!</> : <><Copy className="h-4 w-4 mr-1.5" />Copy</>}
            </Button>
            <Button variant="outline" size="sm" onClick={downloadMD}>
              <Download className="h-4 w-4 mr-1.5" /> .md
            </Button>
            <Button variant="outline" size="sm" onClick={downloadHTML} className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
              <Download className="h-4 w-4 mr-1.5" /> HTML
            </Button>
            <Button variant="outline" size="sm" onClick={downloadDOC} className="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200">
              <Download className="h-4 w-4 mr-1.5" /> DOC
            </Button>
            <Button size="sm" onClick={downloadPDF} className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-500/20">
              <Download className="h-4 w-4 mr-1.5" /> PDF
            </Button>
          </div>
        </div>

        {/* Editor + Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[680px]">
          {/* Markdown Editor */}
          <div className="flex flex-col rounded-xl border border-border/50 overflow-hidden shadow-sm">
            <div className="px-4 py-2.5 bg-muted/40 border-b text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-violet-500" /> Markdown
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="flex-1 p-4 font-mono text-sm resize-none bg-background focus:outline-none leading-relaxed"
              spellCheck={false}
              placeholder="Type your Markdown here..."
            />
            <div className="px-4 py-2 bg-muted/30 border-t text-xs text-muted-foreground">
              {markdown.trim().split(/\s+/).filter(Boolean).length} words · {markdown.length} chars
            </div>
          </div>

          {/* Output */}
          <div className="flex flex-col rounded-xl border border-border/50 overflow-hidden shadow-sm">
            <div className="px-4 py-2.5 bg-muted/40 border-b text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {mode === "preview" ? "Live Preview" : "HTML Output"}
            </div>
            <div className="flex-1 overflow-auto bg-background">
              {mode === "preview" ? (
                <div
                  className="p-6 prose prose-sm max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-blue-600 prose-code:bg-slate-100 prose-code:text-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-[0.85em] prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl prose-pre:shadow-lg [&_pre_code]:bg-transparent [&_pre_code]:text-slate-100 [&_pre_code]:p-0"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ) : (
                <pre className="p-4 font-mono text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap break-all">
                  {html}
                </pre>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6 text-center">
          {[
            { title: "Live Preview", desc: "See formatted output as you type." },
            { title: "Export to DOC", desc: "Download Word-compatible .doc file." },
            { title: "Export to PDF", desc: "Print to PDF via browser dialog." },
            { title: "Export HTML", desc: "Get a clean, styled HTML file." },
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
