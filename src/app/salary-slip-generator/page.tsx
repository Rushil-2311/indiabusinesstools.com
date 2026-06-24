"use client";
import { useState, useRef } from "react";
import { ScrollText, Printer, Upload, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const SHORT_MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

type Row = { label: string; amount: string };

function fmtNum(n: number) {
  return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

function parseAmt(val: string) {
  return parseFloat(val.replace(/,/g, "")) || 0;
}

function formatAmt(val: string, set: (v: string) => void) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value.replace(/[^0-9]/g, "");
    set(num ? new Intl.NumberFormat("en-IN").format(parseInt(num)) : "");
  };
}

function numToWords(num: number): string {
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  if (num === 0) return "Zero Rupees Only";
  function h(n: number): string {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? " "+ones[n%10] : "");
    if (n < 1000) return ones[Math.floor(n/100)]+" Hundred"+(n%100 ? " "+h(n%100) : "");
    if (n < 100000) return h(Math.floor(n/1000))+" Thousand"+(n%1000 ? " "+h(n%1000) : "");
    if (n < 10000000) return h(Math.floor(n/100000))+" Lakh"+(n%100000 ? " "+h(n%100000) : "");
    return h(Math.floor(n/10000000))+" Crore"+(n%10000000 ? " "+h(n%10000000) : "");
  }
  const intPart = Math.floor(num);
  const dec = Math.round((num - intPart)*100);
  return h(intPart)+" Rupees"+(dec>0 ? " and "+h(dec)+" Paise" : "")+" Only";
}

function updateRow(rows: Row[], i: number, field: keyof Row, val: string, set: (r: Row[]) => void) {
  set(rows.map((r, idx) => idx===i ? {...r, [field]: val} : r));
}

function updateAmt(rows: Row[], i: number, val: string, set: (r: Row[]) => void) {
  const num = val.replace(/[^0-9]/g, "");
  updateRow(rows, i, "amount", num ? new Intl.NumberFormat("en-IN").format(parseInt(num)) : "", set);
}

export default function SalarySlipGeneratorPage() {
  const logoRef = useRef<HTMLInputElement>(null);

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
  const [paidDays, setPaidDays] = useState(String(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()));
  const [lopDays, setLopDays] = useState("0");

  // Auto-derive total days from selected month/year
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

  // Earnings (A)
  const [earnings, setEarnings] = useState<Row[]>([
    { label: "Basic", amount: "45,000" },
    { label: "House Rent Allowance (HRA)", amount: "18,000" },
    { label: "Special Allowance", amount: "12,550" },
    { label: "Leave Travel Allowance", amount: "3,200" },
    { label: "Medical Allowance", amount: "1,250" },
  ]);

  // Contributions (B) — PF/ESI type
  const [contributions, setContributions] = useState<Row[]>([
    { label: "PF Employee", amount: "5,400" },
  ]);

  // Taxes & Deductions (C)
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
      <button onClick={() => set([...rows, { label: "", amount: "0" }])}
        className={`flex items-center gap-1 text-xs font-medium hover:underline`} style={{ color: accentColor }}>
        <Plus className="h-3 w-3" /> Add row
      </button>
    </div>
  );

  // ── Preview styles (inline so they print correctly) ──────────────────
  const sl: React.CSSProperties = { fontFamily: "'Arial', 'Helvetica', sans-serif", fontSize: 11, color: "#111", lineHeight: 1.5 };
  const thStyle: React.CSSProperties = { fontSize: 9, color: "#555", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: 0.5, paddingBottom: 2 };
  const tdVal: React.CSSProperties = { fontWeight: 600, color: "#111", fontSize: 11 };
  const divider: React.CSSProperties = { borderBottom: "1px solid #d1d5db", marginBottom: 10, paddingBottom: 6 };

  return (
    <div id="slip-page" className="min-h-screen bg-background">
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
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
        <PageHeader title="Salary Slip Generator" description="Professional payslip with company logo — download as PDF" icon={ScrollText} gradient="from-violet-600 to-indigo-700" />
      </div>

      <div id="slip-layout" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 grid lg:grid-cols-[400px_1fr] gap-6 items-start">

        {/* ── Form Panel ─────────────────────────────── */}
        <div id="slip-form" className="space-y-4 no-print">

          {/* Company */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Company</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                {logo
                  ? <img src={logo} alt="logo" className="h-12 w-12 object-contain rounded border bg-white p-0.5" />
                  : <div className="h-12 w-12 rounded border border-dashed border-muted-foreground/40 flex items-center justify-center text-muted-foreground"><Upload className="h-4 w-4" /></div>}
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
            <CardHeader className="pb-2"><CardTitle className="text-sm">Pay Period & Attendance</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Month</Label>
                <select value={month} onChange={(e) => changeMonth(+e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring">
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
                Earnings <span className="text-xs font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded">(A) = ₹{fmtNum(totalA)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent><RowEditor rows={earnings} set={setEarnings} accentColor="#16a34a" /></CardContent>
          </Card>

          {/* Contributions B */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                Contributions <span className="text-xs font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded">(B) = ₹{fmtNum(totalB)}</span>
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
                Taxes & Deductions <span className="text-xs font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded">(C) = ₹{fmtNum(totalC)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent><RowEditor rows={deductions} set={setDeductions} accentColor="#dc2626" /></CardContent>
          </Card>

          <Button onClick={() => window.print()} className="w-full bg-gray-900 hover:bg-gray-800 text-white">
            <Printer className="h-4 w-4 mr-2" /> Download / Print PDF
          </Button>
        </div>

        {/* ── Salary Slip Preview ─────────────────────── */}
        <div id="slip-preview" className="overflow-x-auto">
          <div style={{ ...sl, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 32, minWidth: 560, maxWidth: 700, margin: "0 auto" }}>

            {/* Top: PAYSLIP heading + month */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#111", letterSpacing: -0.5 }}>
                PAYSLIP &nbsp;<span style={{ color: "#4B5563" }}>{SHORT_MONTHS[month]} {year}</span>
              </div>
              {logo && <img src={logo} alt="logo" style={{ height: 48, objectFit: "contain" }} />}
            </div>

            {/* Company info */}
            <div style={{ marginBottom: 2, fontWeight: 700, fontSize: 11 }}>{companyName}</div>
            {companyAddr.split("\n").map((line, i) => (
              <div key={i} style={{ fontSize: 10, color: "#555" }}>{line}</div>
            ))}
            {companyGSTIN && <div style={{ fontSize: 10, color: "#555" }}>GSTIN: {companyGSTIN}</div>}

            <div style={{ borderBottom: "2px solid #111", margin: "12px 0" }} />

            {/* Employee name large */}
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{empName}</div>

            {/* Employee detail grid */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 4 }}>
              <tbody>
                {[
                  [
                    { label: "Emp No", val: empId },
                    { label: "Date Joined", val: doj },
                    { label: "Department", val: department },
                    { label: "Designation", val: designation },
                  ],
                  [
                    { label: "Payment Mode", val: paymentMode },
                    { label: "Bank", val: bank },
                    { label: "Bank IFSC", val: ifsc || "NA" },
                    { label: "Bank Account", val: accountNo ? "••••"+accountNo.slice(-4) : "NA" },
                  ],
                  [
                    { label: "PAN", val: pan || "NA" },
                    { label: "UAN", val: uan || "NA" },
                    { label: "PF Number", val: pfNumber || "NA" },
                    { label: "", val: "" },
                  ],
                ].map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{ padding: "6px 8px 6px 0", width: "25%", verticalAlign: "top" }}>
                        {cell.label && (
                          <>
                            <div style={thStyle}>{cell.label}</div>
                            <div style={tdVal}>{cell.val || "—"}</div>
                          </>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Salary Details heading */}
            <div style={{ fontWeight: 800, fontSize: 11, letterSpacing: 1, marginTop: 16, marginBottom: 4, textTransform: "uppercase" as const }}>SALARY DETAILS</div>
            <div style={{ borderBottom: "2px solid #111", marginBottom: 10 }} />

            {/* Attendance row */}
            <table style={{ width: "100%", marginBottom: 14 }}>
              <tbody>
                <tr>
                  {[
                    { label: "Actual Payable Days", val: paidDays },
                    { label: "Total Working Days", val: String(totalDays) },
                    { label: "Loss of Pay Days", val: lopDays },
                    { label: "Days Payable", val: paidDays },
                  ].map((c) => (
                    <td key={c.label} style={{ width: "25%" }}>
                      <div style={thStyle}>{c.label}</div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{c.val}</div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>

            {/* Earnings | Contributions + Deductions */}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                  {/* LEFT: Earnings */}
                  <td style={{ width: "48%", verticalAlign: "top", paddingRight: 20, borderRight: "1px solid #e5e7eb" }}>
                    <div style={{ fontWeight: 800, fontSize: 10, letterSpacing: 0.8, marginBottom: 6, textTransform: "uppercase" as const }}>EARNINGS</div>
                    {earnings.map((e, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid #f3f4f6" }}>
                        <span style={{ color: "#374151" }}>{e.label}</span>
                        <span style={{ fontWeight: 600 }}>{fmtNum(parseAmt(e.amount))}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", marginTop: 4, borderTop: "2px solid #111", fontWeight: 800 }}>
                      <span>Total Earnings (A)</span>
                      <span>{fmtNum(totalA)}</span>
                    </div>
                  </td>

                  {/* RIGHT: Contributions + Deductions */}
                  <td style={{ verticalAlign: "top", paddingLeft: 20 }}>
                    <div style={{ fontWeight: 800, fontSize: 10, letterSpacing: 0.8, marginBottom: 6, textTransform: "uppercase" as const }}>CONTRIBUTIONS</div>
                    {contributions.map((c, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid #f3f4f6" }}>
                        <span style={{ color: "#374151" }}>{c.label}</span>
                        <span style={{ fontWeight: 600 }}>{fmtNum(parseAmt(c.amount))}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", marginTop: 2, borderTop: "1px solid #d1d5db", fontWeight: 700, fontSize: 10 }}>
                      <span>Total Contributions (B)</span>
                      <span>{fmtNum(totalB)}</span>
                    </div>

                    <div style={{ fontWeight: 800, fontSize: 10, letterSpacing: 0.8, margin: "12px 0 6px", textTransform: "uppercase" as const }}>TAXES &amp; DEDUCTIONS</div>
                    {deductions.map((d, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid #f3f4f6" }}>
                        <span style={{ color: "#374151" }}>{d.label}</span>
                        <span style={{ fontWeight: 600 }}>{fmtNum(parseAmt(d.amount))}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", marginTop: 2, borderTop: "1px solid #d1d5db", fontWeight: 700, fontSize: 10 }}>
                      <span>Total Deductions (C)</span>
                      <span>{fmtNum(totalC)}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Net Pay row */}
            <div style={{ marginTop: 12, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "10px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, letterSpacing: 0.5 }}>NET SALARY PAYABLE (A - B - C)</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#111", marginTop: 2 }}>₹ {fmtNum(netPay)}</div>
                </div>
                <div style={{ fontSize: 10, color: "#6b7280", textAlign: "right" }}>
                  <div>Gross (A): ₹ {fmtNum(totalA)}</div>
                  <div>Contributions (B): ₹ {fmtNum(totalB)}</div>
                  <div>Deductions (C): ₹ {fmtNum(totalC)}</div>
                </div>
              </div>
              <div style={{ marginTop: 8, borderTop: "1px solid #e5e7eb", paddingTop: 6, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, color: "#6b7280" }}>Net Salary in words</span>
                <span style={{ fontSize: 10, fontStyle: "italic", color: "#374151" }}>{numToWords(netPay)}</span>
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: 16, fontSize: 10, color: "#6b7280" }}>
              <div><strong>**Note:</strong> All amounts displayed in this payslip are in INR.</div>
            </div>
            <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ fontSize: 9, color: "#9ca3af" }}>*This is a system generated salary slip and does not require signature.</div>
              <div style={{ textAlign: "center" }}>
                <div style={{ borderTop: "1px solid #9ca3af", paddingTop: 4, width: 140, fontSize: 9, color: "#6b7280" }}>Authorised Signatory</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
