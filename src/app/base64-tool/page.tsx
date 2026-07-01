"use client";

import { useState } from "react";
import { Binary, Copy, Check, Trash2, ArrowLeftRight, Upload } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ToolDescription } from "@/components/shared/ToolDescription";
import { FaqSection } from "@/components/shared/FaqSection";
import { faqs, toolDescriptions } from "@/lib/data";

type Mode = "encode" | "decode";

function encode(text: string): { result: string; error: null } | { result: null; error: string } {
  try {
    return { result: btoa(unescape(encodeURIComponent(text))), error: null };
  } catch {
    return { result: null, error: "Failed to encode. Input may contain invalid characters." };
  }
}

function decode(text: string): { result: string; error: null } | { result: null; error: string } {
  try {
    return { result: decodeURIComponent(escape(atob(text.trim()))), error: null };
  } catch {
    return { result: null, error: "Invalid Base64 string. Please check your input." };
  }
}

export default function Base64Tool() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("Hello, IndianBusinessTools! This is a Base64 encode/decode example.");
  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);

  const processed = mode === "encode" ? encode(input) : decode(input);

  const swap = () => {
    if (processed.result) {
      setInput(processed.result);
      setMode((m) => (m === "encode" ? "decode" : "encode"));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (mode === "encode") {
        const base64 = result.split(",")[1];
        setInput(`data:${file.type};base64,${base64}`);
        setMode("decode");
      }
    };
    reader.readAsDataURL(file);
  };

  const copyOutput = () => {
    if (!processed.result) return;
    navigator.clipboard.writeText(processed.result);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  const copyInput = () => {
    navigator.clipboard.writeText(input);
    setCopiedInput(true);
    setTimeout(() => setCopiedInput(false), 2000);
  };

  return (
    <>
      <PageHeader
        title="Base64 Encoder / Decoder"
        description="Encode text to Base64 or decode Base64 strings back to plain text. Also supports file encoding."
        icon={Binary}
        gradient="from-slate-600 to-zinc-800"
        breadcrumbs={[{ name: "Developer Tools" }, { name: "Base64 Tool" }]}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 mb-16">
        {/* Mode toggle */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="flex bg-muted rounded-xl p-1 gap-1">
            <button
              onClick={() => setMode("encode")}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "encode" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Encode → Base64
            </button>
            <button
              onClick={() => setMode("decode")}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "decode" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Decode ← Base64
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                {mode === "encode" ? "Plain Text Input" : "Base64 Input"}
              </span>
              <div className="flex gap-2">
                {mode === "encode" && (
                  <label className="cursor-pointer">
                    <input type="file" className="hidden" onChange={handleFileUpload} />
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors">
                      <Upload className="h-3.5 w-3.5" /> File
                    </span>
                  </label>
                )}
                <Button variant="ghost" size="sm" onClick={copyInput} disabled={!input}>
                  {copiedInput ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => setInput("")}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={14}
              className="w-full rounded-xl border border-border/50 bg-background p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-400/40 leading-relaxed"
              placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 string to decode..."}
              spellCheck={false}
            />
            <p className="text-xs text-muted-foreground">{input.length} characters</p>
          </div>

          {/* Output */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                {mode === "encode" ? "Base64 Output" : "Decoded Text"}
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={swap} disabled={!processed.result} title="Use output as next input">
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={copyOutput} disabled={!processed.result}>
                  {copiedOutput ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className={`flex-1 rounded-xl border font-mono text-sm p-4 min-h-[350px] overflow-auto leading-relaxed ${processed.error ? "border-destructive/40 bg-destructive/5 text-destructive" : "border-border/50 bg-muted/30 text-foreground"}`}>
              {processed.error ? (
                <span className="text-sm">{processed.error}</span>
              ) : processed.result ? (
                <span className="break-all whitespace-pre-wrap">{processed.result}</span>
              ) : (
                <span className="text-muted-foreground">Output will appear here...</span>
              )}
            </div>
            {processed.result && (
              <p className="text-xs text-muted-foreground">{processed.result.length} characters</p>
            )}
          </div>
        </div>

        {/* Copy button */}
        <div className="flex justify-center mt-4">
          <Button onClick={copyOutput} disabled={!processed.result} className="px-8 bg-slate-700 hover:bg-slate-800 text-white shadow-md">
            {copiedOutput ? <><Check className="h-4 w-4 mr-2" />Copied to Clipboard</> : <><Copy className="h-4 w-4 mr-2" />Copy Output</>}
          </Button>
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-center">
          {[
            { title: "What is Base64?", desc: "A binary-to-text encoding scheme representing binary data using 64 printable ASCII characters." },
            { title: "Common Uses", desc: "Email attachments, embedding images in HTML/CSS, API authentication tokens, and data URLs." },
            { title: "File Support", desc: "Upload any file to get its Base64 data URL — useful for embedding images inline in code." },
          ].map((c) => (
            <Card key={c.title} className="p-4 border-border/50 shadow-sm text-left">
              <p className="font-semibold text-sm text-foreground mb-1">{c.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
            </Card>
          ))}
        </div>

        <ToolDescription toolName="Base64 Tool" data={toolDescriptions["base64-tool"]} />
        <FaqSection faqs={faqs["base64-tool"]} />
      </div>
    </>
  );
}
