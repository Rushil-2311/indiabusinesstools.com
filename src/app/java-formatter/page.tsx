"use client";
import { useState, useMemo, useRef } from "react";
import { Coffee, Copy, Check, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/PageHeader";

const SAMPLE = `public class BankAccount{private String owner;private double balance;public BankAccount(String owner,double initialBalance){this.owner=owner;this.balance=initialBalance;}public void deposit(double amount){if(amount<=0){throw new IllegalArgumentException("Deposit amount must be positive");}balance+=amount;}public boolean withdraw(double amount){if(amount<=0||amount>balance){return false;}balance-=amount;return true;}public double getBalance(){return balance;}@Override public String toString(){return "BankAccount{owner='"+owner+"', balance="+balance+"}";}}`;

function formatJava(code: string, indent: number): string {
  const pad = " ".repeat(indent);
  let result = "";
  let level = 0;
  let inString = false;
  let stringChar = "";
  let i = 0;

  while (i < code.length) {
    const ch = code[i];
    const next = code[i + 1] ?? "";

    if (inString) {
      result += ch;
      if (ch === "\\" && (stringChar === '"' || stringChar === "'")) {
        result += next;
        i += 2;
        continue;
      }
      if (ch === stringChar) inString = false;
      i++;
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = true;
      stringChar = ch;
      result += ch;
      i++;
      continue;
    }

    if (ch === "{") {
      result = result.trimEnd();
      result += " {\n";
      level++;
      result += pad.repeat(level);
      i++;
      continue;
    }

    if (ch === "}") {
      result = result.trimEnd();
      level = Math.max(0, level - 1);
      result += "\n" + pad.repeat(level) + "}";
      if (next === ";" || next === ",") {
        result += next;
        i++;
      }
      if (code[i + 1] !== "}") result += "\n" + pad.repeat(level);
      i++;
      continue;
    }

    if (ch === ";") {
      result += ";\n" + pad.repeat(level);
      i++;
      continue;
    }

    if (ch === "\n" || ch === "\r") {
      i++;
      continue;
    }

    result += ch;
    i++;
  }

  // Clean up excess blank lines
  return result
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l, i, arr) => !(l === "" && arr[i - 1] === ""))
    .join("\n")
    .trim();
}

export default function JavaFormatterPage() {
  const [input, setInput] = useState(SAMPLE);
  const [indent, setIndent] = useState(4);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    try {
      return formatJava(input, indent);
    } catch {
      return "Error: Could not format Java code";
    }
  }, [input, indent]);

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
    const a = document.createElement("a"); a.href = url; a.download = "formatted.java"; a.click();
    URL.revokeObjectURL(url);
  }

  const isError = output.startsWith("Error:");

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Java Code Formatter"
        description="Beautify and format Java source code — auto-indent, clean spacing"
        icon={Coffee}
        gradient="from-amber-600 to-orange-700"
        breadcrumbs={[{ name: "Developer Tools" }, { name: "Java Formatter" }]}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-10 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm shrink-0">Indent:</Label>
            <select value={indent} onChange={(e) => setIndent(+e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
          </div>

          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm text-muted-foreground hover:bg-muted transition-colors">
            <Upload className="h-4 w-4" /> Upload .java
          </button>
          <input ref={fileRef} type="file" accept=".java,text/plain" className="hidden" onChange={handleFile} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">Java Input</CardTitle>
              <span className="text-xs text-muted-foreground">{input.split("\n").length} lines</span>
            </CardHeader>
            <CardContent>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-[500px] font-mono text-xs bg-muted/30 rounded-lg p-3 border border-input resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Paste Java code here or upload a .java file…"
                spellCheck={false}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">{isError ? "Error" : "Formatted Java"}</CardTitle>
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
                className={`w-full h-[500px] font-mono text-xs rounded-lg p-3 border resize-none focus:outline-none ${isError ? "bg-red-50 border-red-200 text-red-700" : "bg-muted/30 border-input"}`}
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
