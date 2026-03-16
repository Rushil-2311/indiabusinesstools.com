"use client";

import { useState } from "react";
import { CaseSensitive, Copy, Check } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TextCaseConverter() {
  const [text, setText] = useState("ToolsKit is an amazing multi-tool application.");
  const [copied, setCopied] = useState(false);

  const charCount = text.length;
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const sentenceCount =
    text.trim() === ""
      ? 0
      : text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const convert = (type: string) => {
    switch (type) {
      case "upper":
        setText(text.toUpperCase());
        break;
      case "lower":
        setText(text.toLowerCase());
        break;
      case "title":
        setText(
          text
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        );
        break;
      case "sentence":
        setText(text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase()));
        break;
      case "camel":
        setText(text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()));
        break;
      case "pascal": {
        const camel = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        setText(camel.charAt(0).toUpperCase() + camel.slice(1));
        break;
      }
      case "snake":
        setText(text.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, ""));
        break;
      case "kebab":
        setText(text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, ""));
        break;
      case "alt":
        setText(
          text
            .split("")
            .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
            .join("")
        );
        break;
      case "reverse":
        setText(text.split("").reverse().join(""));
        break;
      case "clear":
        setText("");
        break;
    }
  };

  const buttons = [
    { label: "UPPERCASE", type: "upper" },
    { label: "lowercase", type: "lower" },
    { label: "Title Case", type: "title" },
    { label: "Sentence case", type: "sentence" },
    { label: "camelCase", type: "camel" },
    { label: "PascalCase", type: "pascal" },
    { label: "snake_case", type: "snake" },
    { label: "kebab-case", type: "kebab" },
    { label: "aLtErNaTiNg", type: "alt" },
    { label: "esreveR", type: "reverse" },
  ];

  return (
    <>
      <PageHeader
        title="Text Case Converter"
        description="Convert your text to uppercase, lowercase, title case, and programming cases."
        icon={CaseSensitive}
        gradient="from-cyan-500 to-sky-600"
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 mb-16">
        <AdSlot className="mb-8" />

        <Card className="shadow-lg border-border/50 overflow-hidden">
          <div className="p-4 bg-muted/40 border-b flex flex-wrap gap-2 justify-center">
            {buttons.map((btn) => (
              <Button
                key={btn.type}
                variant="outline"
                size="sm"
                className="bg-background hover:bg-cyan-50 hover:text-cyan-600 hover:border-cyan-200 transition-colors"
                onClick={() => convert(btn.type)}
              >
                {btn.label}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => convert("clear")}
            >
              Clear
            </Button>
          </div>

          <div className="relative">
            <textarea
              className="w-full h-80 p-6 resize-y bg-background focus:outline-none focus:ring-inset focus:ring-2 focus:ring-cyan-500/50 text-base leading-relaxed"
              placeholder="Type or paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              spellCheck={false}
            />

            <Button
              className={`absolute bottom-6 right-6 shadow-md transition-all ${
                copied ? "bg-emerald-500 hover:bg-emerald-600 text-white" : ""
              }`}
              onClick={handleCopy}
              disabled={text.length === 0}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" /> Copy Text
                </>
              )}
            </Button>
          </div>

          <div className="bg-muted/30 border-t p-4 flex gap-6 text-sm text-muted-foreground justify-center">
            <div>
              <span className="font-semibold text-foreground">{charCount}</span> Characters
            </div>
            <div>
              <span className="font-semibold text-foreground">{wordCount}</span> Words
            </div>
            <div>
              <span className="font-semibold text-foreground">{sentenceCount}</span> Sentences
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
