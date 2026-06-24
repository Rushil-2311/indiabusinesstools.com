"use client";

import { useState } from "react";
import { KeyRound, Copy, Check, AlertCircle, CheckCircle2, Clock, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsIm5hbWUiOiJSb2hhbiBTaGFybWEiLCJlbWFpbCI6InJvaGFuQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

function b64urlDecode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "==".slice((base64.length % 4) || 4);
  return atob(padded);
}

function decodeJWT(token: string) {
  const parts = token.trim().split(".");
  if (parts.length !== 3) throw new Error("A JWT must have exactly 3 parts separated by dots.");
  const header = JSON.parse(b64urlDecode(parts[0]));
  const payload = JSON.parse(b64urlDecode(parts[1]));
  return { header, payload, signature: parts[2], raw: parts };
}

function formatTs(unix: number) {
  return new Date(unix * 1000).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
  }) + " IST";
}

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };

function JsonView({ data }: { data: JsonValue }) {
  if (data === null) return <span className="text-rose-500">null</span>;
  if (typeof data === "boolean") return <span className="text-orange-500">{String(data)}</span>;
  if (typeof data === "number") return <span className="text-blue-500">{data}</span>;
  if (typeof data === "string") return <span className="text-emerald-600 dark:text-emerald-400">&quot;{data}&quot;</span>;
  if (Array.isArray(data))
    return (
      <span>
        {"["}
        {data.map((v, i) => (
          <span key={i}>
            <JsonView data={v as JsonValue} />
            {i < data.length - 1 ? ", " : ""}
          </span>
        ))}
        {"]"}
      </span>
    );
  return (
    <span className="block">
      {"{"}
      <div className="ml-4">
        {Object.entries(data as Record<string, JsonValue>).map(([k, v], i, arr) => (
          <div key={k}>
            <span className="text-violet-600 dark:text-violet-400">&quot;{k}&quot;</span>
            {": "}
            <JsonView data={v} />
            {i < arr.length - 1 ? "," : ""}
          </div>
        ))}
      </div>
      {"}"}
    </span>
  );
}

function Section({
  title,
  badge,
  data,
  onCopy,
  copied,
}: {
  title: string;
  badge?: React.ReactNode;
  data: Record<string, JsonValue>;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <Card className="border-border/50 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{title}</span>
          {badge}
        </div>
        <button
          onClick={onCopy}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : "Copy JSON"}
        </button>
      </div>
      <pre className="p-4 text-sm font-mono leading-relaxed overflow-x-auto">
        <JsonView data={data as JsonValue} />
      </pre>
    </Card>
  );
}

export default function JwtDecoder() {
  const [token, setToken] = useState(SAMPLE_JWT);
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (value: string, key: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  let decoded: ReturnType<typeof decodeJWT> | null = null;
  let error: string | null = null;

  if (token.trim()) {
    try {
      decoded = decodeJWT(token);
    } catch (e) {
      error = (e as Error).message;
    }
  }

  const nowSec = Math.floor(Date.now() / 1000);
  const exp = decoded?.payload?.exp as number | undefined;
  const iat = decoded?.payload?.iat as number | undefined;
  const nbf = decoded?.payload?.nbf as number | undefined;

  const isExpired = exp !== undefined && exp < nowSec;
  const isNotYetValid = nbf !== undefined && nbf > nowSec;

  return (
    <>
      <PageHeader
        title="JWT Decoder"
        description="Decode and inspect JSON Web Token headers, payloads, and expiry status — no secret needed."
        icon={KeyRound}
        gradient="from-amber-500 to-orange-600"
        breadcrumbs={[{ name: "Developer Tools" }, { name: "JWT Decoder" }]}
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 mb-16">
        <AdSlot className="mb-8" />

        {/* Token input */}
        <Card className="p-5 mb-5 border-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-foreground">JWT Token</p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7" onClick={() => setToken(SAMPLE_JWT)}>
                Load sample
              </Button>
              <Button variant="ghost" size="sm" className="text-xs text-destructive hover:bg-destructive/10 h-7" onClick={() => setToken("")}>
                <Trash2 className="h-3 w-3 mr-1" /> Clear
              </Button>
            </div>
          </div>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your JWT token here…"
            rows={4}
            className={`w-full font-mono text-xs leading-relaxed bg-muted/40 rounded-lg px-3 py-2.5 outline-none border resize-y focus:ring-2 focus:ring-amber-400/40 ${
              error ? "border-destructive" : "border-border/50"
            }`}
            spellCheck={false}
          />
          {error && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </p>
          )}
        </Card>

        {decoded && (
          <>
            {/* Status bar */}
            <div className="flex flex-wrap gap-3 mb-5">
              {isExpired ? (
                <div className="flex items-center gap-1.5 text-sm text-destructive font-medium">
                  <AlertCircle className="h-4 w-4" /> Expired
                  {exp && <span className="text-xs font-normal text-muted-foreground ml-1">({formatTs(exp)})</span>}
                </div>
              ) : exp !== undefined ? (
                <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                  <CheckCircle2 className="h-4 w-4" /> Valid
                  {exp && <span className="text-xs font-normal text-muted-foreground ml-1">(expires {formatTs(exp)})</span>}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
                  <Clock className="h-4 w-4" /> No expiry claim (exp)
                </div>
              )}
              {isNotYetValid && (
                <div className="flex items-center gap-1.5 text-sm text-amber-600 font-medium">
                  <AlertCircle className="h-4 w-4" /> Not yet valid (nbf: {formatTs(nbf!)})
                </div>
              )}
              <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                Algorithm: <span className="font-semibold text-foreground">{(decoded.header as Record<string,JsonValue>).alg as string ?? "unknown"}</span>
              </div>
            </div>

            {/* Timestamp metadata */}
            {(iat !== undefined || exp !== undefined || nbf !== undefined) && (
              <Card className="mb-5 px-5 py-4 border-border/50 shadow-sm">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Timestamps</p>
                <div className="divide-y divide-border/50">
                  {[
                    { key: "iat", label: "Issued At", value: iat },
                    { key: "exp", label: "Expires At", value: exp },
                    { key: "nbf", label: "Not Before", value: nbf },
                  ]
                    .filter((r) => r.value !== undefined)
                    .map(({ key, label, value }) => (
                      <div key={key} className="flex items-center justify-between gap-3 py-2.5">
                        <span className="text-xs font-mono text-muted-foreground w-16">{key}</span>
                        <span className="text-xs text-muted-foreground w-24 font-mono">{value}</span>
                        <span className="text-sm text-foreground flex-1">{formatTs(value!)}</span>
                        <button onClick={() => copy(String(value), key)} className="text-muted-foreground hover:text-foreground">
                          {copied === key ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    ))}
                </div>
              </Card>
            )}

            <div className="space-y-4">
              <Section
                title="Header"
                data={decoded.header as Record<string, JsonValue>}
                onCopy={() => copy(JSON.stringify(decoded!.header, null, 2), "header")}
                copied={copied === "header"}
              />
              <Section
                title="Payload"
                badge={
                  isExpired ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">Expired</span>
                  ) : exp !== undefined ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium">Valid</span>
                  ) : undefined
                }
                data={decoded.payload as Record<string, JsonValue>}
                onCopy={() => copy(JSON.stringify(decoded!.payload, null, 2), "payload")}
                copied={copied === "payload"}
              />

              {/* Signature */}
              <Card className="border-border/50 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                  <span className="text-sm font-semibold text-foreground">Signature</span>
                  <button
                    onClick={() => copy(decoded!.signature, "sig")}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copied === "sig" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied === "sig" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="p-4">
                  <p className="font-mono text-xs text-muted-foreground break-all leading-relaxed mb-2">{decoded.signature}</p>
                  <p className="text-xs text-muted-foreground border-t border-border/50 pt-2">
                    Signature verification requires the secret key and cannot be done client-side securely. Use your backend to verify.
                  </p>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  );
}
