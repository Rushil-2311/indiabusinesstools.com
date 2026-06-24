"use client";

import { useState, useMemo } from "react";
import { Code2, Copy, Check } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const QUICK_PATTERNS = [
  { label: "Email", pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}", flags: "g" },
  { label: "URL", pattern: "https?:\\/\\/(www\\.)?[\\w\\-]+\\.[a-zA-Z]{2,}(\\/\\S*)?", flags: "gi" },
  { label: "Indian Mobile", pattern: "[6-9]\\d{9}", flags: "g" },
  { label: "Indian PAN", pattern: "[A-Z]{5}[0-9]{4}[A-Z]", flags: "g" },
  { label: "Indian PIN Code", pattern: "[1-9][0-9]{5}", flags: "g" },
  { label: "IPv4 Address", pattern: "(\\d{1,3}\\.){3}\\d{1,3}", flags: "g" },
  { label: "Hex Color", pattern: "#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})", flags: "g" },
  { label: "Date DD/MM/YYYY", pattern: "\\d{2}\\/\\d{2}\\/\\d{4}", flags: "g" },
];

const FLAG_OPTIONS = [
  { flag: "g", label: "g (Global)", title: "Find all matches, not just the first one" },
  { flag: "i", label: "i (Case Insensitive)", title: "Ignore uppercase / lowercase differences" },
  { flag: "m", label: "m (Multiline)", title: "^ and $ match start/end of each line" },
  { flag: "s", label: "s (Dot All)", title: ". also matches newline characters" },
];

const DEFAULT_TEXT = `Hello, my name is Rohan Sharma. You can reach me at rohan.sharma@example.com
or at my backup account test+1@company.co.in.

My mobile number is 9876543210 and alternate is 8123456789.
Our office PIN code is 400001 and branch PIN is 110092.
Visit us at https://www.indiabusinesstools.com for more info.
My PAN is ABCDE1234F and GST hex colour code is #FF6200.`;

function runRegex(pattern: string, flags: string, text: string) {
  if (!pattern) return { matches: [], error: null };
  try {
    const effectiveFlags = flags.includes("g") ? flags : flags + "g";
    const re = new RegExp(pattern, effectiveFlags);
    const matches: Array<{ match: string; index: number; groups: string[] }> = [];
    let m: RegExpExecArray | null;
    let lastIndex = -1;
    while ((m = re.exec(text)) !== null) {
      if (m.index === lastIndex) { re.lastIndex++; continue; }
      lastIndex = m.index;
      matches.push({ match: m[0], index: m.index, groups: Array.from(m).slice(1).map((g) => g ?? "undefined") });
    }
    return { matches, error: null };
  } catch (e) {
    return { matches: [], error: (e as Error).message };
  }
}

function buildHighlightedHtml(text: string, matches: Array<{ match: string; index: number }>) {
  if (!matches.length) return escapeHtml(text);
  const parts: string[] = [];
  let cursor = 0;
  for (const { match, index } of matches) {
    parts.push(escapeHtml(text.slice(cursor, index)));
    parts.push(`<mark class="bg-yellow-300 dark:bg-yellow-600 rounded-sm px-0.5">${escapeHtml(match)}</mark>`);
    cursor = index + match.length;
  }
  parts.push(escapeHtml(text.slice(cursor)));
  return parts.join("");
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default function RegexTester() {
  const [pattern, setPattern] = useState("[6-9]\\d{9}");
  const [flags, setFlags] = useState("g");
  const [testText, setTestText] = useState(DEFAULT_TEXT);
  const [copied, setCopied] = useState(false);

  const toggleFlag = (f: string) => {
    setFlags((prev) => (prev.includes(f) ? prev.replace(f, "") : prev + f));
  };

  const { matches, error } = useMemo(() => runRegex(pattern, flags, testText), [pattern, flags, testText]);
  const highlightedHtml = useMemo(() => buildHighlightedHtml(testText, matches), [testText, matches]);

  const copyPattern = () => {
    navigator.clipboard.writeText(`/${pattern}/${flags}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <PageHeader
        title="Regex Tester"
        description="Test regular expressions against text with live match highlighting and common pattern shortcuts."
        icon={Code2}
        gradient="from-emerald-500 to-teal-600"
        breadcrumbs={[{ name: "Developer Tools" }, { name: "Regex Tester" }]}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 mb-16">
        <AdSlot className="mb-8" />

        {/* Pattern input */}
        <Card className="p-5 mb-5 border-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-foreground">Regular Expression</p>
            <button
              onClick={copyPattern}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy pattern"}
            </button>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className="text-2xl text-muted-foreground">/</span>
            <input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern…"
              className={`flex-1 text-base bg-muted/40 rounded-lg px-3 py-2.5 outline-none border focus:ring-2 focus:ring-emerald-400/40 ${
                error ? "border-destructive text-destructive" : "border-border/50 text-emerald-700 dark:text-emerald-400"
              }`}
              spellCheck={false}
            />
            <span className="text-2xl text-muted-foreground">/</span>
            <span className="text-base text-muted-foreground font-mono w-8">{flags}</span>
          </div>

          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

          {/* Flags */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-xs text-muted-foreground font-medium">Flags:</span>
            {FLAG_OPTIONS.map(({ flag, label, title }) => (
              <button
                key={flag}
                title={title}
                onClick={() => toggleFlag(flag)}
                className={`text-xs px-3 py-1 rounded-md border transition-colors ${
                  flags.includes(flag)
                    ? "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700"
                    : "bg-background text-muted-foreground border-border/50 hover:bg-muted"
                }`}
              >
                {label}
              </button>
            ))}

            {/* Match count badge */}
            {!error && pattern && (
              <span className="ml-auto text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                {matches.length} match{matches.length !== 1 ? "es" : ""}
              </span>
            )}
          </div>
        </Card>

        {/* Quick patterns */}
        <div className="flex flex-wrap gap-2 mb-5">
          {QUICK_PATTERNS.map(({ label, pattern: p, flags: f }) => (
            <Button
              key={label}
              variant="outline"
              size="sm"
              className="text-xs bg-background hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 dark:hover:bg-emerald-900/20"
              onClick={() => { setPattern(p); setFlags(f); }}
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Test string */}
          <div className="flex flex-col gap-3">
            <Card className="border-border/50 shadow-sm overflow-hidden flex-1">
              <div className="flex items-center justify-between px-4 py-2.5 border-b bg-muted/30">
                <span className="text-xs font-semibold text-foreground">Test String</span>
                <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground" onClick={() => setTestText("")}>
                  Clear
                </Button>
              </div>
              <textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                className="w-full h-64 p-4 text-sm font-mono bg-background resize-none outline-none leading-relaxed"
                placeholder="Paste or type the text to test against…"
                spellCheck={false}
              />
            </Card>

            {/* Highlighted output */}
            <Card className="border-border/50 shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b bg-muted/30">
                <span className="text-xs font-semibold text-foreground">Highlighted Matches</span>
              </div>
              <pre
                className="p-4 text-sm font-mono leading-relaxed whitespace-pre-wrap break-words overflow-auto max-h-48"
                dangerouslySetInnerHTML={{ __html: highlightedHtml || '<span class="text-muted-foreground">Output appears here…</span>' }}
              />
            </Card>
          </div>

          {/* Match list */}
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Match Details</span>
              {matches.length > 0 && (
                <span className="text-xs text-muted-foreground">{matches.length} found</span>
              )}
            </div>
            <div className="overflow-y-auto max-h-[480px]">
              {!pattern ? (
                <p className="p-4 text-sm text-muted-foreground">Enter a pattern to see matches.</p>
              ) : error ? (
                <p className="p-4 text-sm text-destructive">Fix the pattern to see matches.</p>
              ) : matches.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">No matches found.</p>
              ) : (
                <div className="divide-y divide-border/50">
                  {matches.map(({ match, index, groups }, i) => (
                    <div key={i} className="px-4 py-3">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-xs text-muted-foreground shrink-0 pt-0.5">#{i + 1} @ {index}</span>
                        <code className="text-sm font-mono text-emerald-700 dark:text-emerald-400 font-semibold break-all flex-1 text-right">
                          {match || '""'}
                        </code>
                      </div>
                      {groups.length > 0 && groups.some((g) => g !== "undefined") && (
                        <div className="mt-1 pl-2 border-l-2 border-emerald-300/50 space-y-0.5">
                          {groups.map((g, gi) => (
                            <p key={gi} className="text-xs text-muted-foreground font-mono">
                              Group {gi + 1}: <span className="text-foreground">{g}</span>
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
