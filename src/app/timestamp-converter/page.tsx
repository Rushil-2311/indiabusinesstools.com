"use client";

import { useState, useEffect } from "react";
import { Clock, Copy, Check, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TIMEZONES = [
  { label: "IST — India Standard Time", value: "Asia/Kolkata" },
  { label: "UTC", value: "UTC" },
  { label: "US Eastern (ET)", value: "America/New_York" },
  { label: "US Pacific (PT)", value: "America/Los_Angeles" },
  { label: "London (GMT/BST)", value: "Europe/London" },
  { label: "Dubai (GST)", value: "Asia/Dubai" },
  { label: "Singapore (SGT)", value: "Asia/Singapore" },
  { label: "Tokyo (JST)", value: "Asia/Tokyo" },
];

function fmt(d: Date, tz: string, opts: Intl.DateTimeFormatOptions) {
  try {
    return new Intl.DateTimeFormat("en-IN", { timeZone: tz, ...opts }).format(d);
  } catch {
    return "Invalid timezone";
  }
}

function relative(epochSec: number, nowSec: number) {
  const diff = epochSec - nowSec;
  const abs = Math.abs(diff);
  const suffix = diff >= 0 ? "from now" : "ago";
  if (abs < 60) return `${abs}s ${suffix}`;
  if (abs < 3600) return `${Math.floor(abs / 60)}m ${Math.floor(abs % 60)}s ${suffix}`;
  if (abs < 86400) return `${Math.floor(abs / 3600)}h ${Math.floor((abs % 3600) / 60)}m ${suffix}`;
  return `${Math.floor(abs / 86400)}d ${Math.floor((abs % 86400) / 3600)}h ${suffix}`;
}

function localDatetimeValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function TimestampConverter() {
  const [nowSec, setNowSec] = useState(0);
  const [tsInput, setTsInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [tz, setTz] = useState("Asia/Kolkata");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setNowSec(Math.floor(Date.now() / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setDateInput(localDatetimeValue(new Date()));
  }, []);

  const copy = (value: string, key: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const CopyBtn = ({ value, id }: { value: string; id: string }) => (
    <button
      onClick={() => copy(value, id)}
      className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied === id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );

  // Unix → Date
  const rawTs = tsInput.trim();
  const parsedTs = rawTs ? Number(rawTs) : NaN;
  const tsDate = !isNaN(parsedTs) ? new Date(parsedTs * 1000) : null;
  const tsValid = tsDate !== null && !isNaN(tsDate.getTime());

  const tsRows = tsValid && tsDate
    ? [
        {
          label: `Local (${tz})`,
          value: fmt(tsDate, tz, { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }),
        },
        { label: "UTC", value: tsDate.toUTCString() },
        { label: "ISO 8601", value: tsDate.toISOString() },
        { label: "Relative", value: relative(parsedTs, nowSec) },
        { label: "Day of week", value: fmt(tsDate, tz, { weekday: "long" }) },
      ]
    : [];

  // Date → Unix
  const parsedDate = dateInput ? new Date(dateInput) : null;
  const dateUnix = parsedDate && !isNaN(parsedDate.getTime()) ? Math.floor(parsedDate.getTime() / 1000) : null;

  const nowDate = new Date(nowSec * 1000);

  return (
    <>
      <PageHeader
        title="Timestamp Converter"
        description="Convert Unix epoch timestamps to human-readable dates and back, with timezone support."
        icon={Clock}
        gradient="from-blue-500 to-cyan-600"
      />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 mb-16">
        <AdSlot className="mb-8" />

        {/* Live current time */}
        <Card className="p-5 mb-6 border-border/50 shadow-sm bg-gradient-to-br from-blue-50/60 to-cyan-50/60 dark:from-blue-950/20 dark:to-cyan-950/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Current Unix Timestamp
            </p>
            <CopyBtn value={String(nowSec)} id="live" />
          </div>
          <p className="font-mono text-3xl font-bold text-blue-600 mb-2 tabular-nums">{nowSec}</p>
          <p className="text-sm text-muted-foreground">
            {fmt(nowDate, tz, { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
          </p>
        </Card>

        {/* Timezone */}
        <div className="flex items-center gap-3 mb-6">
          <label className="text-sm font-medium text-foreground shrink-0">Timezone</label>
          <select
            value={tz}
            onChange={(e) => setTz(e.target.value)}
            className="flex-1 bg-background border border-border/50 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400/40"
          >
            {TIMEZONES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-5">
          {/* Unix → Date */}
          <Card className="p-5 border-border/50 shadow-sm">
            <p className="text-sm font-semibold text-foreground mb-3">Unix Timestamp → Date</p>
            <div className="flex gap-2 mb-4">
              <input
                value={tsInput}
                onChange={(e) => setTsInput(e.target.value)}
                placeholder="Enter Unix timestamp (seconds)…"
                className="flex-1 font-mono text-sm bg-muted/40 rounded-lg px-3 py-2.5 outline-none border border-border/50 focus:ring-2 focus:ring-blue-400/40"
              />
              <Button variant="outline" size="sm" className="shrink-0" onClick={() => setTsInput(String(nowSec))}>
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Now
              </Button>
            </div>
            {rawTs && !tsValid && (
              <p className="text-sm text-destructive mb-2">Invalid timestamp</p>
            )}
            {tsRows.length > 0 && (
              <div className="divide-y divide-border/50">
                {tsRows.map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-3 py-2.5">
                    <span className="text-xs text-muted-foreground shrink-0 w-32 pt-0.5">{label}</span>
                    <span className="text-sm text-foreground flex-1 font-mono leading-relaxed">{value}</span>
                    <CopyBtn value={value} id={label} />
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Date → Unix */}
          <Card className="p-5 border-border/50 shadow-sm">
            <p className="text-sm font-semibold text-foreground mb-3">Date → Unix Timestamp</p>
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full bg-muted/40 rounded-lg px-3 py-2.5 text-sm outline-none border border-border/50 focus:ring-2 focus:ring-blue-400/40 mb-4"
            />
            {dateUnix !== null && (
              <div className="divide-y divide-border/50">
                {[
                  { label: "Unix (seconds)", value: String(dateUnix) },
                  { label: "Unix (ms)", value: String(dateUnix * 1000) },
                  { label: "Relative", value: relative(dateUnix, nowSec) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="text-xs text-muted-foreground w-32">{label}</span>
                    <span className="text-sm font-mono font-semibold text-foreground flex-1">{value}</span>
                    <CopyBtn value={value} id={label + "-d"} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
