"use client";
import { useState } from "react";
import { ClipboardList, Plus, Trash2, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";

type LineItem = { description: string; hsn: string; qty: string; rate: string; gst: string };

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
  "Chandigarh","Puducherry","Andaman & Nicobar","Lakshadweep","Dadra & Nagar Haveli",
];

const GST_RATES = ["0","5","12","18","28"];

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

function numToWords(num: number): string {
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  if (num === 0) return "Zero";
  function helper(n: number): string {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? " " + ones[n%10] : "");
    if (n < 1000) return ones[Math.floor(n/100)] + " Hundred" + (n%100 ? " " + helper(n%100) : "");
    if (n < 100000) return helper(Math.floor(n/1000)) + " Thousand" + (n%1000 ? " " + helper(n%1000) : "");
    if (n < 10000000) return helper(Math.floor(n/100000)) + " Lakh" + (n%100000 ? " " + helper(n%100000) : "");
    return helper(Math.floor(n/10000000)) + " Crore" + (n%10000000 ? " " + helper(n%10000000) : "");
  }
  const intPart = Math.floor(num);
  const decPart = Math.round((num - intPart) * 100);
  let result = helper(intPart) + " Rupees";
  if (decPart > 0) result += " and " + helper(decPart) + " Paise";
  return result + " Only";
}

export default function InvoiceGeneratorPage() {
  const [sellerName, setSellerName] = useState("");
  const [sellerAddress, setSellerAddress] = useState("");
  const [sellerGSTIN, setSellerGSTIN] = useState("");
  const [sellerState, setSellerState] = useState("Karnataka");
  const [sellerPhone, setSellerPhone] = useState("");

  const [buyerName, setBuyerName] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [buyerGSTIN, setBuyerGSTIN] = useState("");
  const [buyerState, setBuyerState] = useState("Karnataka");

  const [invoiceNo, setInvoiceNo] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("Thank you for your business!");

  const [items, setItems] = useState<LineItem[]>([
    { description: "", hsn: "", qty: "1", rate: "", gst: "18" },
  ]);

  const isIGST = sellerState !== buyerState;

  function addItem() {
    setItems([...items, { description: "", hsn: "", qty: "1", rate: "", gst: "18" }]);
  }

  function removeItem(i: number) {
    setItems(items.filter((_, idx) => idx !== i));
  }

  function updateItem(i: number, field: keyof LineItem, val: string) {
    setItems(items.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  }

  const lineCalcs = items.map((item) => {
    const qty = parseFloat(item.qty) || 0;
    const rate = parseFloat(item.rate) || 0;
    const gst = parseFloat(item.gst) || 0;
    const subtotal = qty * rate;
    const gstAmt = subtotal * gst / 100;
    const total = subtotal + gstAmt;
    return { subtotal, gstAmt, total, gst, taxable: subtotal };
  });

  const subtotal = lineCalcs.reduce((s, r) => s + r.taxable, 0);
  const totalGST = lineCalcs.reduce((s, r) => s + r.gstAmt, 0);
  const grandTotal = subtotal + totalGST;

  function printInvoice() {
    window.print();
  }

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        @media print {
          /* Zero out page margins so browser removes date/URL headers */
          @page { size: A4; margin: 0; }

          /* Strip all min-heights — this is what causes blank extra pages */
          * { min-height: 0 !important; }

          /* Hide site header and footer */
          header, footer { display: none !important; }

          /* Hide form panels and buttons */
          .no-print { display: none !important; }

          /* Show plain text values in table cells */
          .print-only { display: block !important; }

          /* Collapse the two-column grid so only the invoice shows */
          #invoice-layout {
            display: block !important;
            padding: 0 !important;
            max-width: 100% !important;
          }

          /* Clean invoice card */
          #invoice-preview {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
          }

          /* Hide empty placeholder spans */
          .invoice-placeholder { display: none !important; }
        }

        @media screen {
          .print-only { display: none !important; }
        }
      `}</style>

      <div className="no-print">
        <PageHeader
          title="GST Invoice Generator"
          description="Create professional GST invoices — download as PDF"
          icon={ClipboardList}
          gradient="from-gray-700 to-slate-900"
          breadcrumbs={[{ name: "Tax & Payroll" }, { name: "Invoice Generator" }]}
        />
      </div>

      <div id="invoice-layout" className="mx-auto max-w-6xl px-4 pb-8 grid lg:grid-cols-[400px_1fr] gap-6">
        {/* Form */}
        <div className="space-y-4 no-print">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Your Details (Seller)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Business Name", val: sellerName, set: setSellerName, placeholder: "e.g. Sharma Enterprises" },
                { label: "Address", val: sellerAddress, set: setSellerAddress, placeholder: "Street, City, PIN" },
                { label: "GSTIN (optional)", val: sellerGSTIN, set: setSellerGSTIN, placeholder: "22AAAAA0000A1Z5" },
                { label: "Phone (optional)", val: sellerPhone, set: setSellerPhone, placeholder: "+91 98765 43210" },
              ].map((f) => (
                <div key={f.label}>
                  <Label className="text-xs">{f.label}</Label>
                  <Input value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder} className="mt-1 h-8 text-sm" />
                </div>
              ))}
              <div>
                <Label className="text-xs">State</Label>
                <select value={sellerState} onChange={(e) => setSellerState(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Client Details (Buyer)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Client Name", val: buyerName, set: setBuyerName, placeholder: "e.g. Patel Trading Co." },
                { label: "Address", val: buyerAddress, set: setBuyerAddress, placeholder: "Street, City, PIN" },
                { label: "GSTIN (optional)", val: buyerGSTIN, set: setBuyerGSTIN, placeholder: "22BBBBB0000B1Z5" },
              ].map((f) => (
                <div key={f.label}>
                  <Label className="text-xs">{f.label}</Label>
                  <Input value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder} className="mt-1 h-8 text-sm" />
                </div>
              ))}
              <div>
                <Label className="text-xs">State</Label>
                <select value={buyerState} onChange={(e) => setBuyerState(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Invoice Details</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Invoice No.</Label>
                  <Input value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} className="mt-1 h-8 text-sm" />
                </div>
                <div>
                  <Label className="text-xs">Date</Label>
                  <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="mt-1 h-8 text-sm" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Due Date (optional)</Label>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="mt-1 h-8 text-sm" />
              </div>
              <div>
                <Label className="text-xs">Notes</Label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 h-8 text-sm" />
              </div>
            </CardContent>
          </Card>

          <Button onClick={printInvoice} className="w-full bg-gray-800 hover:bg-gray-700 text-white">
            <Printer className="h-4 w-4 mr-2" /> Download / Print PDF
          </Button>
        </div>

        {/* Invoice Preview */}
        <div id="invoice-preview">
          <div className="bg-white text-gray-900 rounded-xl shadow-lg border p-8 text-sm font-sans">
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {sellerName || <span className="invoice-placeholder text-gray-300">Your Business Name</span>}
                </h2>
                <p className="text-gray-600 mt-1 whitespace-pre-line">
                  {sellerAddress || <span className="invoice-placeholder text-gray-300">Business Address</span>}
                </p>
                {sellerGSTIN && <p className="text-gray-600">GSTIN: {sellerGSTIN}</p>}
                {sellerPhone && <p className="text-gray-600">Ph: {sellerPhone}</p>}
                <p className="text-gray-600">State: {sellerState}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800">INVOICE</div>
                <div className="mt-2 space-y-0.5">
                  <p><span className="text-gray-500">Invoice No: </span><strong>{invoiceNo}</strong></p>
                  <p><span className="text-gray-500">Date: </span><strong>{invoiceDate}</strong></p>
                  {dueDate && <p><span className="text-gray-500">Due Date: </span><strong>{dueDate}</strong></p>}
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="mb-6">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Bill To</div>
              <div className="font-semibold text-base">
                {buyerName || <span className="invoice-placeholder text-gray-300">Client Name</span>}
              </div>
              <p className="text-gray-600 whitespace-pre-line">
                {buyerAddress || <span className="invoice-placeholder text-gray-300">Client Address</span>}
              </p>
              {buyerGSTIN && <p className="text-gray-600">GSTIN: {buyerGSTIN}</p>}
              <p className="text-gray-600">State: {buyerState}</p>
              {isIGST && (
                <span className="inline-block mt-1 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
                  Inter-state — IGST applicable
                </span>
              )}
            </div>

            {/* Items table */}
            <table className="w-full text-sm mb-4">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="px-3 py-2 text-left">#</th>
                  <th className="px-3 py-2 text-left">Description</th>
                  <th className="px-3 py-2 text-left">HSN</th>
                  <th className="px-3 py-2 text-right">Qty</th>
                  <th className="px-3 py-2 text-right">Rate (₹)</th>
                  <th className="px-3 py-2 text-right">GST%</th>
                  <th className="px-3 py-2 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                    <td className="px-3 py-2">
                      <div className="no-print">
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(i, "description", e.target.value)}
                          className="h-7 text-xs border-gray-300"
                          placeholder="Description"
                        />
                      </div>
                      <div className="print-only">{item.description}</div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="no-print">
                        <Input value={item.hsn} onChange={(e) => updateItem(i, "hsn", e.target.value)} className="h-7 text-xs w-20" placeholder="HSN" />
                      </div>
                      <div className="print-only">{item.hsn}</div>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="no-print">
                        <Input value={item.qty} onChange={(e) => updateItem(i, "qty", e.target.value)} className="h-7 text-xs w-16 text-right" />
                      </div>
                      <div className="print-only">{item.qty}</div>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="no-print">
                        <Input value={item.rate} onChange={(e) => updateItem(i, "rate", e.target.value)} className="h-7 text-xs w-24 text-right" placeholder="0" />
                      </div>
                      <div className="print-only">{item.rate}</div>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="no-print">
                        <select value={item.gst} onChange={(e) => updateItem(i, "gst", e.target.value)}
                          className="h-7 text-xs rounded border border-input bg-background px-1 focus:outline-none">
                          {GST_RATES.map((r) => <option key={r}>{r}</option>)}
                        </select>
                      </div>
                      <div className="print-only">{item.gst}%</div>
                    </td>
                    <td className="px-3 py-2 text-right font-medium">
                      ₹{fmt(lineCalcs[i]?.total ?? 0)}
                      <button onClick={() => removeItem(i)} className="no-print ml-2 text-red-400 hover:text-red-600">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button onClick={addItem} className="no-print flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mb-6">
              <Plus className="h-3 w-3" /> Add Line Item
            </button>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{fmt(subtotal)}</span>
                </div>
                {isIGST ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IGST</span>
                    <span>₹{fmt(totalGST)}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">CGST</span>
                      <span>₹{fmt(totalGST / 2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">SGST</span>
                      <span>₹{fmt(totalGST / 2)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between font-bold text-base border-t-2 border-gray-800 pt-2 mt-2">
                  <span>Total</span>
                  <span>₹{fmt(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Amount in words */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-xs text-gray-500 font-semibold">Amount in Words: </span>
              <span className="text-xs text-gray-700">{numToWords(grandTotal)}</span>
            </div>

            {/* Notes */}
            {notes && (
              <div className="mt-4 border-t border-gray-200 pt-3">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notes</div>
                <p className="text-xs text-gray-600">{notes}</p>
              </div>
            )}

            <div className="mt-6 text-center text-xs text-gray-400 border-t border-gray-200 pt-3">
              Generated by IndianBusinessTools.com — Free GST Invoice Generator
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
