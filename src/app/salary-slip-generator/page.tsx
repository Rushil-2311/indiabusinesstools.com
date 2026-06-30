"use client";
import { useState, useRef } from "react";
import { ScrollText, Download, Loader2, Upload, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { ClassicTemplate } from "./ClassicTemplate";
import { ModernTemplate } from "./ModernTemplate";
import { CorporateTemplate } from "./CorporateTemplate";
import { BoldTemplate } from "./BoldTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import { MONTHS } from "./types";
import type { Row } from "./types";

function fmtNum(n: number) {
  return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

function parseAmt(val: string) {
  return parseFloat(val.replace(/,/g, "")) || 0;
}

function updateRow(rows: Row[], i: number, field: keyof Row, val: string, set: (r: Row[]) => void) {
  set(rows.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
}

function updateAmt(rows: Row[], i: number, val: string, set: (r: Row[]) => void) {
  const num = val.replace(/[^0-9]/g, "");
  updateRow(rows, i, "amount", num ? new Intl.NumberFormat("en-IN").format(parseInt(num)) : "", set);
}

type TemplateId = "classic" | "modern" | "corporate" | "bold" | "minimal";

const TEMPLATES: { id: TemplateId; name: string; thumbnail: React.ReactNode }[] = [
  {
    id: "classic",
    name: "Classic",
    thumbnail: (
      <div className="rounded overflow-hidden aspect-[3/4] bg-white border border-gray-100 p-1.5 flex flex-col gap-1">
        <div className="flex justify-between items-start mb-0.5">
          <div className="h-2 bg-gray-800 rounded w-1/2" />
          <div className="h-1.5 bg-gray-200 rounded w-1/4" />
        </div>
        <div className="h-px bg-gray-800 w-full" />
        <div className="grid grid-cols-4 gap-0.5 mt-0.5">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-1 bg-gray-100 rounded" />)}
        </div>
        <div className="flex gap-1 mt-1">
          <div className="flex-1 space-y-0.5">
            <div className="h-0.5 bg-gray-400 rounded" />
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-1 bg-gray-100 rounded" />)}
          </div>
          <div className="flex-1 space-y-0.5">
            <div className="h-0.5 bg-gray-400 rounded" />
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-1 bg-gray-100 rounded" />)}
          </div>
        </div>
        <div className="h-3 bg-gray-100 border border-gray-200 rounded mt-auto" />
      </div>
    ),
  },
  {
    id: "modern",
    name: "Modern",
    thumbnail: (
      <div className="rounded overflow-hidden aspect-[3/4] bg-white border border-gray-100 flex">
        <div className="w-2/5 p-1 flex flex-col gap-1">
          <div className="h-1.5 bg-slate-600 rounded w-3/4" />
          <div className="h-0.5 bg-slate-700 rounded" />
          <div className="h-1 bg-slate-700 rounded w-full mt-1" />
          <div className="h-1 bg-slate-600 rounded w-5/6" />
          <div className="h-0.5 bg-slate-700 rounded mt-1" />
          <div className="h-2 bg-slate-800 rounded w-1/2" />
          <div className="h-0.5 bg-slate-700 rounded mt-1" />
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-1 bg-slate-700 rounded" />)}
        </div>
        <div className="flex-1 p-1 flex flex-col gap-0.5">
          <div className="h-1.5 bg-gray-800 rounded w-3/4" />
          <div className="h-1 bg-gray-200 rounded w-full" />
          <div className="h-1 bg-gray-100 rounded w-5/6" />
          <div className="h-1 bg-gray-100 rounded w-full" />
          <div className="h-px bg-indigo-200 w-full mt-1" />
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-1 bg-gray-100 rounded" />)}
          <div className="h-2.5 bg-indigo-100 border border-indigo-200 rounded mt-auto" />
        </div>
      </div>
    ),
  },
  {
    id: "corporate",
    name: "Corporate",
    thumbnail: (
      <div className="rounded overflow-hidden aspect-[3/4] bg-white border border-gray-100 flex flex-col">
        <div className="text-center p-1 border-b-2">
          <div className="h-1.5 bg-gray-800 rounded w-3/4 mx-auto" />
          <div className="h-1 bg-gray-200 rounded w-1/2 mx-auto mt-0.5" />
        </div>
        <div className="h-2 bg-blue-800 w-full" />
        <div className="p-1 flex gap-1 border-b border-gray-200">
          <div className="flex-1 space-y-0.5">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-1 bg-gray-100 rounded" />)}
          </div>
          <div className="flex-1 space-y-0.5">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-1 bg-gray-100 rounded" />)}
            <div className="h-3 bg-blue-50 border border-blue-100 rounded" />
          </div>
        </div>
        <div className="p-1">
          <div className="h-1.5 rounded mb-0.5" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="grid grid-cols-3 gap-0.5 mb-0.5">
              {Array.from({ length: 3 }).map((_, j) => <div key={j} className={`h-1 rounded ${i % 2 === 0 ? "bg-blue-50" : "bg-white border border-gray-100"}`} />)}
            </div>
          ))}
        </div>
        <div className="h-3 bg-blue-800 mx-1 rounded mt-auto mb-1" />
      </div>
    ),
  },
  {
    id: "bold",
    name: "Bold",
    thumbnail: (
      <div className="rounded overflow-hidden aspect-[3/4] bg-white border border-gray-100 flex flex-col">
        <div className="p-1.5 flex flex-col gap-1" style={{ height: "45%" }}>
          <div className="h-1 bg-gray-600 rounded w-2/3" />
          <div className="h-1.5 bg-gray-100 rounded w-1/2" />
          <div className="flex justify-end mt-auto">
            <div className="h-2.5 bg-amber-400 rounded w-1/3" />
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="flex-1 h-2.5 bg-gray-800 rounded" />)}
          </div>
        </div>
        <div className="p-1 flex-1 flex flex-col gap-0.5">
          <div className="flex gap-1">
            <div className="flex-1 space-y-0.5">
              <div className="h-0.5 bg-amber-400 rounded" />
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-1 bg-gray-100 rounded" />)}
            </div>
            <div className="flex-1 space-y-0.5">
              <div className="h-0.5 bg-red-400 rounded" />
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-1 bg-gray-100 rounded" />)}
            </div>
          </div>
          <div className="h-3 bg-amber-50 border-2 border-amber-300 rounded mt-auto" />
        </div>
      </div>
    ),
  },
  {
    id: "minimal",
    name: "Minimal",
    thumbnail: (
      <div className="rounded overflow-hidden aspect-[3/4] bg-white border border-gray-100 p-1.5 flex flex-col gap-1">
        <div className="flex justify-between items-end">
          <div className="h-2 bg-gray-900 rounded w-2/5" />
          <div className="h-1 bg-gray-300 rounded w-1/4" />
        </div>
        <div className="h-0.5 bg-gray-900 w-full" />
        <div className="h-1 bg-gray-100 rounded w-full" />
        <div className="h-px bg-gray-200 w-full" />
        <div className="space-y-0.5">
          <div className="grid grid-cols-4 gap-0.5">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-1 bg-gray-300 rounded" />)}
          </div>
          <div className="h-0.5 bg-gray-900 w-full" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-0.5">
              {Array.from({ length: 4 }).map((_, j) => <div key={j} className="h-1 bg-gray-100 rounded" />)}
            </div>
          ))}
          <div className="h-0.5 bg-gray-900 w-full" />
        </div>
        <div className="flex justify-end mt-auto">
          <div className="h-3.5 bg-gray-900 rounded w-1/3" />
        </div>
      </div>
    ),
  },
];

export default function SalarySlipGeneratorPage() {
  const logoRef = useRef<HTMLInputElement>(null);
  const [template, setTemplate] = useState<TemplateId>("classic");
  const [downloading, setDownloading] = useState(false);

  async function downloadPDF() {
    const wrapper = document.getElementById("slip-preview");
    if (!wrapper) return;
    const element = (wrapper.firstElementChild as HTMLElement | null) ?? wrapper;
    setDownloading(true);

    const allEls = [element, ...Array.from(element.querySelectorAll<HTMLElement>("*"))];
    const savedStyles = allEls.map((e) => e.style.cssText);
    allEls.forEach((e) => {
      const cs = window.getComputedStyle(e);
      const bg = cs.backgroundColor;
      if (bg && bg !== "rgba(0, 0, 0, 0)") e.style.backgroundColor = bg;
      e.style.color = cs.color;
    });

    try {
      const [{ toPng }, { default: jsPDF }] = await Promise.all([
        import("html-to-image"),
        import("jspdf"),
      ]);

      const dataUrl = await toPng(element, { pixelRatio: 2, cacheBust: true });

      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = reject;
        i.src = dataUrl;
      });

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const mmPerPx = pdfW / img.naturalWidth;
      const scaledH = img.naturalHeight * mmPerPx;

      if (scaledH <= pdfH) {
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfW, scaledH);
      } else {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext("2d")!.drawImage(img, 0, 0);
        const pageHeightPx = Math.floor(pdfH / mmPerPx);
        let offsetY = 0;
        while (offsetY < canvas.height) {
          const sliceH = Math.min(pageHeightPx, canvas.height - offsetY);
          if (sliceH < 2) break;
          if (offsetY > 0) pdf.addPage();
          const pageCanvas = document.createElement("canvas");
          pageCanvas.width = canvas.width;
          pageCanvas.height = sliceH;
          pageCanvas.getContext("2d")!.drawImage(canvas, 0, offsetY, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
          pdf.addImage(pageCanvas.toDataURL("image/png"), "PNG", 0, 0, pdfW, sliceH * mmPerPx);
          offsetY += pageHeightPx;
        }
      }

      pdf.save(`salary-slip-${empName.replace(/\s+/g, "-") || "download"}.pdf`);
    } finally {
      allEls.forEach((e, i) => (e.style.cssText = savedStyles[i]));
      setDownloading(false);
    }
  }

  // Company
  const [logo, setLogo] = useState("");
  const [companyName, setCompanyName] = useState("DEFMACRO SOFTWARE PRIVATE LIMITED");
  const [companyAddr, setCompanyAddr] = useState("B-3, Lower Ground Floor, Naraina Vihar\nNew Delhi, Delhi 110028");
  const [companyGSTIN, setCompanyGSTIN] = useState("");

  // Employee
  const [empName, setEmpName] = useState("Priya Sharma");
  const [empId, setEmpId] = useState("EMP-1042");
  const [designation, setDesignation] = useState("Senior Content Writer");
  const [department, setDepartment] = useState("Engineering");
  const [doj, setDoj] = useState("2020-07-27");
  const [pan, setPan] = useState("");
  const [uan, setUan] = useState("");
  const [pfNumber, setPfNumber] = useState("");
  const [bank, setBank] = useState("State Bank of India");
  const [ifsc, setIfsc] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [paymentMode, setPaymentMode] = useState("Bank Transfer");

  // Pay period
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [paidDays, setPaidDays] = useState(
    String(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate())
  );
  const [lopDays, setLopDays] = useState("0");

  const totalDays = new Date(year, month + 1, 0).getDate();

  function changeMonth(m: number) {
    setMonth(m);
    const days = new Date(year, m + 1, 0).getDate();
    setPaidDays((prev) => String(Math.min(parseInt(prev) || days, days)));
  }

  function changeYear(y: number) {
    setYear(y);
    const days = new Date(y, month + 1, 0).getDate();
    setPaidDays((prev) => String(Math.min(parseInt(prev) || days, days)));
  }

  function changePaidDays(val: string) {
    const num = parseInt(val.replace(/[^0-9]/g, "")) || 0;
    const capped = Math.min(num, totalDays);
    setPaidDays(String(capped));
    setLopDays(String(totalDays - capped));
  }

  const [earnings, setEarnings] = useState<Row[]>([
    { label: "Basic", amount: "45,000" },
    { label: "House Rent Allowance (HRA)", amount: "18,000" },
    { label: "Special Allowance", amount: "12,550" },
    { label: "Leave Travel Allowance", amount: "3,200" },
    { label: "Medical Allowance", amount: "1,250" },
  ]);

  const [contributions, setContributions] = useState<Row[]>([
    { label: "PF Employee", amount: "5,400" },
  ]);

  const [deductions, setDeductions] = useState<Row[]>([
    { label: "Professional Tax", amount: "200" },
    { label: "Income Tax (TDS)", amount: "3,500" },
  ]);

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setLogo(r.result as string);
    r.readAsDataURL(f);
  }

  const totalA = earnings.reduce((s, r) => s + parseAmt(r.amount), 0);
  const totalB = contributions.reduce((s, r) => s + parseAmt(r.amount), 0);
  const totalC = deductions.reduce((s, r) => s + parseAmt(r.amount), 0);
  const netPay = totalA - totalB - totalC;

  const templateProps = {
    logo, companyName, companyAddr, companyGSTIN,
    empName, empId, designation, department, doj, pan, uan, pfNumber,
    bank, ifsc, accountNo, paymentMode,
    month, year, paidDays, lopDays, totalDays,
    earnings, contributions, deductions,
    totalA, totalB, totalC, netPay,
  };

  const RowEditor = ({ rows, set, accentColor }: { rows: Row[]; set: (r: Row[]) => void; accentColor: string }) => (
    <div className="space-y-2">
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input value={row.label} onChange={(e) => updateRow(rows, i, "label", e.target.value, set)} className="h-8 text-xs flex-1" placeholder="Component name" />
          <Input value={row.amount} onChange={(e) => updateAmt(rows, i, e.target.value, set)} className="h-8 text-xs w-28 text-right font-mono" placeholder="0" />
          <button onClick={() => set(rows.filter((_, idx) => idx !== i))} className="shrink-0 text-muted-foreground hover:text-red-500 transition-colors">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button
        onClick={() => set([...rows, { label: "", amount: "0" }])}
        className="flex items-center gap-1 text-xs font-medium hover:underline"
        style={{ color: accentColor }}
      >
        <Plus className="h-3 w-3" /> Add row
      </button>
    </div>
  );

  return (
    <div id="slip-page" className="min-h-screen bg-background">
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
          header, footer { display: none !important; }
          .no-print { display: none !important; }
          #slip-page { min-height: 0 !important; background: white !important; }
          #slip-layout { display: block !important; padding: 0 !important; margin: 0 !important; max-width: 100% !important; }
          #slip-preview { overflow: visible !important; padding: 14mm 14mm !important; }
          #slip-preview > div {
            border: none !important; border-radius: 0 !important;
            max-width: 100% !important; min-width: 0 !important;
            padding: 0 !important; margin: 0 !important; box-shadow: none !important;
          }
        }
      `}</style>

      <div className="no-print">
        <PageHeader
          title="Salary Slip Generator"
          description="Professional payslip with company logo — download as PDF"
          icon={ScrollText}
          gradient="from-violet-600 to-indigo-700"
          breadcrumbs={[{ name: "Tax & Payroll" }, { name: "Salary Slip Generator" }]}
        />
      </div>

      <div id="slip-layout" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 grid lg:grid-cols-[400px_1fr] gap-6 items-start">

        {/* ── Form Panel ─────────────────────────────── */}
        <div id="slip-form" className="space-y-4 no-print">

          {/* Template Selector */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Template</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`group flex flex-col items-center gap-1 rounded-lg p-1 transition-all ${template === t.id ? "ring-2 ring-violet-600 bg-violet-50" : "hover:bg-muted cursor-pointer"}`}
                  >
                    <div className="w-full">{t.thumbnail}</div>
                    <span className={`text-[10px] font-medium ${template === t.id ? "text-violet-700" : "text-muted-foreground"}`}>
                      {t.name}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Company */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Company</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                {logo
                  ? <img src={logo} alt="logo" className="h-12 w-12 object-contain rounded border bg-white p-0.5" />
                  : <div className="h-12 w-12 rounded border border-dashed border-muted-foreground/40 flex items-center justify-center text-muted-foreground">
                      <Upload className="h-4 w-4" />
                    </div>
                }
                <div className="space-y-1">
                  <button onClick={() => logoRef.current?.click()} className="text-xs px-3 py-1.5 border rounded-lg font-medium hover:bg-muted transition-colors block">
                    {logo ? "Change Logo" : "Upload Logo"}
                  </button>
                  {logo && <button onClick={() => setLogo("")} className="text-xs text-red-500 hover:underline block">Remove</button>}
                </div>
                <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
              </div>
              {[
                { label: "Company Name", val: companyName, set: setCompanyName },
                { label: "Address", val: companyAddr, set: setCompanyAddr },
                { label: "GSTIN (optional)", val: companyGSTIN, set: setCompanyGSTIN },
              ].map((f) => (
                <div key={f.label}>
                  <Label className="text-xs">{f.label}</Label>
                  <Input value={f.val} onChange={(e) => f.set(e.target.value)} className="mt-1 h-8 text-xs" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Employee */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Employee</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {[
                { label: "Full Name", val: empName, set: setEmpName },
                { label: "Employee ID", val: empId, set: setEmpId },
                { label: "Designation", val: designation, set: setDesignation },
                { label: "Department", val: department, set: setDepartment },
                { label: "Date of Joining", val: doj, set: setDoj, type: "date" },
                { label: "Payment Mode", val: paymentMode, set: setPaymentMode },
                { label: "Bank Name", val: bank, set: setBank },
                { label: "Bank IFSC", val: ifsc, set: setIfsc },
                { label: "Bank Account No.", val: accountNo, set: setAccountNo },
                { label: "PAN", val: pan, set: setPan },
                { label: "UAN", val: uan, set: setUan },
                { label: "PF Number", val: pfNumber, set: setPfNumber },
              ].map((f) => (
                <div key={f.label}>
                  <Label className="text-xs">{f.label}</Label>
                  <Input type={f.type ?? "text"} value={f.val} onChange={(e) => f.set(e.target.value)} className="mt-1 h-8 text-xs" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pay Period */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Pay Period &amp; Attendance</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Month</Label>
                <select
                  value={month}
                  onChange={(e) => changeMonth(+e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-xs">Year</Label>
                <Input type="number" value={year} onChange={(e) => changeYear(+e.target.value)} className="mt-1 h-8 text-xs" />
              </div>
              <div>
                <Label className="text-xs">Total Working Days</Label>
                <Input value={totalDays} readOnly className="mt-1 h-8 text-xs bg-muted/50 text-muted-foreground cursor-not-allowed" />
              </div>
              <div>
                <Label className="text-xs">Actual Paid Days</Label>
                <Input value={paidDays} onChange={(e) => changePaidDays(e.target.value)} className="mt-1 h-8 text-xs" placeholder={String(totalDays)} />
              </div>
              <div>
                <Label className="text-xs">Loss of Pay Days</Label>
                <Input value={lopDays} readOnly className="mt-1 h-8 text-xs bg-muted/50 text-muted-foreground cursor-not-allowed" />
              </div>
            </CardContent>
          </Card>

          {/* Earnings A */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                Earnings
                <span className="text-xs font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded">(A) = ₹{fmtNum(totalA)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent><RowEditor rows={earnings} set={setEarnings} accentColor="#16a34a" /></CardContent>
          </Card>

          {/* Contributions B */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                Contributions
                <span className="text-xs font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded">(B) = ₹{fmtNum(totalB)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-2">PF, ESI employee share</p>
              <RowEditor rows={contributions} set={setContributions} accentColor="#2563eb" />
            </CardContent>
          </Card>

          {/* Deductions C */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                Taxes &amp; Deductions
                <span className="text-xs font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded">(C) = ₹{fmtNum(totalC)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent><RowEditor rows={deductions} set={setDeductions} accentColor="#dc2626" /></CardContent>
          </Card>

          <Button onClick={downloadPDF} disabled={downloading} className="w-full bg-gray-900 hover:bg-gray-800 text-white">
            {downloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            {downloading ? "Generating PDF…" : "Download PDF"}
          </Button>
        </div>

        {/* ── Salary Slip Preview ─────────────────────── */}
        <div id="slip-preview" className="overflow-x-auto">
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, minWidth: 560, maxWidth: 700, margin: "0 auto", overflow: "hidden" }}>
            {template === "classic" && <ClassicTemplate {...templateProps} />}
            {template === "modern" && <ModernTemplate {...templateProps} />}
            {template === "corporate" && <CorporateTemplate {...templateProps} />}
            {template === "bold" && <BoldTemplate {...templateProps} />}
            {template === "minimal" && <MinimalTemplate {...templateProps} />}
          </div>
        </div>
      </div>
    </div>
  );
}
