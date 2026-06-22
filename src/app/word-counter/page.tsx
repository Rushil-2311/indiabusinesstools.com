"use client";

import { useState } from "react";
import { AlignLeft, Copy, Check, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SAMPLE =
  "India is one of the fastest-growing economies in the world. With a young population and a booming digital sector, Indian businesses are rapidly expanding across global markets. Technology, finance, and manufacturing are key pillars driving this growth.";

function analyze(text: string) {
  const trimmed = text.trim();
  const words = trimmed === "" ? [] : trimmed.split(/\s+/);
  const sentences = trimmed === "" ? [] : trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const paragraphs = trimmed === "" ? [] : trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const readingTime = Math.max(1, Math.ceil(words.length / 200));
  const speakingTime = Math.max(1, Math.ceil(words.length / 130));

  const freq: Record<string, number> = {};
  words.forEach((w) => {
    const key = w.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (key.length > 2) freq[key] = (freq[key] || 0) + 1;
  });
  const topWords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, ""))).size;

  return { words, sentences, paragraphs, chars, charsNoSpace, readingTime, speakingTime, topWords, uniqueWords };
}

export default function WordCounter() {
  const [text, setText] = useState(SAMPLE);
  const [copied, setCopied] = useState(false);

  const stats = analyze(text);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statCards = [
    { label: "Words", value: stats.words.length, color: "text-blue-600" },
    { label: "Characters", value: stats.chars, color: "text-violet-600" },
    { label: "Chars (no spaces)", value: stats.charsNoSpace, color: "text-pink-600" },
    { label: "Sentences", value: stats.sentences.length, color: "text-amber-600" },
    { label: "Paragraphs", value: stats.paragraphs.length, color: "text-emerald-600" },
    { label: "Unique Words", value: stats.uniqueWords, color: "text-teal-600" },
    { label: "Read Time", value: `${stats.readingTime} min`, color: "text-orange-600" },
    { label: "Speak Time", value: `${stats.speakingTime} min`, color: "text-rose-600" },
  ];

  return (
    <>
      <PageHeader
        title="Word Counter"
        description="Count words, characters, sentences, and get reading time estimates instantly."
        icon={AlignLeft}
        gradient="from-orange-500 to-amber-600"
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 mb-16">
        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {statCards.map((s) => (
            <Card key={s.label} className="p-4 border-border/50 text-center shadow-sm">
              <div className={`text-2xl font-bold ${s.color} mb-0.5`}>{s.value}</div>
              <div className="text-xs text-muted-foreground font-medium">{s.label}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Text area */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">Your Text</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} disabled={!text}>
                  {copied ? <><Check className="h-4 w-4 mr-1.5 text-emerald-600" />Copied!</> : <><Copy className="h-4 w-4 mr-1.5" />Copy</>}
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => setText("")}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 min-h-[360px] w-full rounded-xl border border-border/50 bg-background p-4 text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-orange-400/40"
              placeholder="Paste or type your text here..."
              spellCheck={false}
            />
          </div>

          {/* Top keywords */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Top Keywords</p>
            <Card className="border-border/50 overflow-hidden shadow-sm">
              {stats.topWords.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">No keywords found yet.</p>
              ) : (
                <div className="divide-y divide-border/50">
                  {stats.topWords.map(([word, count], i) => {
                    const pct = Math.round((count / stats.words.length) * 100);
                    return (
                      <div key={word} className="px-4 py-3 flex items-center gap-3">
                        <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}</span>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-foreground">{word}</span>
                            <span className="text-xs text-muted-foreground">{count}× ({pct}%)</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-400 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(pct * 5, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Extra info */}
            <Card className="border-border/50 mt-4 p-4 shadow-sm space-y-3">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Average word length</p>
                <p className="text-lg font-bold text-foreground">
                  {stats.words.length === 0
                    ? "—"
                    : (stats.words.reduce((acc, w) => acc + w.replace(/[^a-zA-Z]/g, "").length, 0) / stats.words.length).toFixed(1)}{" "}
                  {stats.words.length > 0 && <span className="text-sm font-normal text-muted-foreground">chars</span>}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Average sentence length</p>
                <p className="text-lg font-bold text-foreground">
                  {stats.sentences.length === 0
                    ? "—"
                    : Math.round(stats.words.length / stats.sentences.length)}{" "}
                  {stats.sentences.length > 0 && <span className="text-sm font-normal text-muted-foreground">words</span>}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
