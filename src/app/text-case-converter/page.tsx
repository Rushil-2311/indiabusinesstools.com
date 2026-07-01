"use client";

import { useState } from "react";
import { CaseSensitive, Copy, Check } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToolDescription } from "@/components/shared/ToolDescription";
import { FaqSection } from "@/components/shared/FaqSection";
import { faqs, toolDescriptions } from "@/lib/data";

export default function TextCaseConverter() {
  const [text, setText] = useState("ToolsKit is an amazing multi-tool application.");
  const [copied, setCopied] = useState(false);
  const [activeCase, setActiveCase] = useState<string | null>(null);
  const [originalText, setOriginalText] = useState<string | null>(null);

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

  const applyConversion = (type: string, input: string): string => {
    switch (type) {
      case "upper":
        return input.toUpperCase();
      case "lower":
        return input.toLowerCase();
      case "title":
        return input
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      case "sentence":
        return input.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
      case "camel":
        return input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
      case "pascal": {
        const camel = input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        return camel.charAt(0).toUpperCase() + camel.slice(1);
      }
      case "snake":
        return input.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
      case "kebab":
        return input.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "");
      case "alt":
        return input
          .split("")
          .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
          .join("");
      case "reverse":
        return input.split("").reverse().join("");
      default:
        return input;
    }
  };

  const convert = (type: string) => {
    if (type === "clear") {
      setText("");
      setActiveCase(null);
      setOriginalText(null);
      return;
    }

    if (activeCase === type && originalText !== null) {
      setText(originalText);
      setActiveCase(null);
      setOriginalText(null);
    } else {
      setOriginalText(text);
      setText(applyConversion(type, text));
      setActiveCase(type);
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
        breadcrumbs={[{ name: "Utility Tools" }, { name: "Text Case Converter" }]}
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
                className={`transition-colors ${
                  activeCase === btn.type
                    ? "bg-cyan-100 text-cyan-700 border-cyan-400 hover:bg-cyan-50"
                    : "bg-background hover:bg-cyan-50 hover:text-cyan-600 hover:border-cyan-200"
                }`}
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
              onChange={(e) => {
                setText(e.target.value);
                setActiveCase(null);
                setOriginalText(null);
              }}
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

        <ToolDescription toolName="Text Case Converter" data={toolDescriptions["text-case-converter"]} />
        <FaqSection faqs={faqs["text-case-converter"]} />
      </div>
    </>
  );
}
