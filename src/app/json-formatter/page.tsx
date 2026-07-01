"use client";

import { useState } from "react";
import {
  Braces,
  Copy,
  Check,
  Wand2,
  Minimize2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AdSlot } from "@/components/shared/AdSlot";
import { Button } from "@/components/ui/button";
import { syntaxHighlightJson } from "@/lib/calculators";
import { FaqSection } from "@/components/shared/FaqSection";
import { ToolDescription } from "@/components/shared/ToolDescription";
import { RelatedTools } from "@/components/shared/RelatedTools";
import { faqs, toolDescriptions } from "@/lib/data";

export default function JsonFormatter() {
  const [input, setInput] = useState(
    '{"name":"ToolsKit","status":"active","features":["calculate","format","convert"],"version":1.0}',
  );
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);

  const formatJson = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indent);
      setOutput(formatted);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Invalid JSON");
      setOutput("");
    }
  };

  const minifyJson = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (e: any) {
      setError(e.message || "Invalid JSON");
      setOutput("");
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <PageHeader
        title="JSON Formatter"
        description="Format, validate, beautify, and minify your JSON data."
        icon={Braces}
        gradient="from-slate-600 to-gray-800"
        breadcrumbs={[{ name: "Developer Tools" }, { name: "JSON Formatter" }]}
      />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 mb-16">
        <AdSlot className="mb-8" />

        <div className="bg-card rounded-xl shadow-lg border border-border/50 overflow-hidden flex flex-col h-[700px]">
          <div className="p-3 bg-muted/40 border-b flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                onClick={formatJson}
                className="bg-slate-700 hover:bg-slate-800 text-white shadow-sm"
              >
                <Wand2 className="w-4 h-4 mr-2" /> Format
              </Button>
              <Button
                onClick={minifyJson}
                variant="outline"
                className="bg-background"
              >
                <Minimize2 className="w-4 h-4 mr-2" /> Minify
              </Button>
              <select
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={indent}
                onChange={(e) => setIndent(Number(e.target.value))}
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces</option>
                <option value={8}>8 Spaces</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => {
                  setInput("");
                  setOutput("");
                  setError(null);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!output}
                className={
                  copied
                    ? "text-emerald-600 border-emerald-200 bg-emerald-50"
                    : ""
                }
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" /> Copy Output
                  </>
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border-b border-destructive/20 p-3 text-sm text-destructive flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
              <span className="font-mono">{error}</span>
            </div>
          )}

          <div className="flex flex-col md:flex-row grow overflow-hidden">
            <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-border/50 relative flex">
              <textarea
                className="w-full h-full p-4 font-mono text-sm resize-none bg-background focus:outline-none"
                placeholder="Paste JSON here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                spellCheck={false}
              />
            </div>
            <div className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-950/30 relative flex overflow-auto">
              {output ? (
                <pre
                  className="w-full p-4 font-mono text-sm m-0 overflow-auto"
                  dangerouslySetInnerHTML={{
                    __html: syntaxHighlightJson(output),
                  }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-muted-foreground text-sm font-mono opacity-50">
                  Formatted output will appear here
                </div>
              )}
            </div>
          </div>
        </div>
        <ToolDescription toolName="JSON Formatter" data={toolDescriptions["json-formatter"]} />
        <FaqSection faqs={faqs["json-formatter"]} />
      </div>
      <RelatedTools currentSlug="json-formatter" />
    </>
  );
}
