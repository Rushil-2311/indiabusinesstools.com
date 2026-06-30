import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { InvoiceTemplateProps } from "./types";
import { fmt, numToWords, GST_RATES } from "./types";

export function CorporateTemplate(p: InvoiceTemplateProps) {
  return (
    <div className="bg-white text-gray-900 rounded-xl shadow-lg overflow-hidden text-sm font-sans">
      {/* Centered letterhead */}
      <div className="text-center px-8 pt-8 pb-5">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-gray-900">
          {p.sellerName || <span className="text-gray-200">Your Business Name</span>}
        </h2>
        <p className="text-gray-500 text-xs mt-1">
          {p.sellerAddress || <span className="text-gray-200">Business Address</span>}
        </p>
        <div className="flex justify-center gap-6 mt-1 text-xs text-gray-500 flex-wrap">
          {p.sellerGSTIN && <span>GSTIN: {p.sellerGSTIN}</span>}
          {p.sellerPhone && <span>Ph: {p.sellerPhone}</span>}
          <span>State: {p.sellerState}</span>
        </div>
      </div>

      {/* Info strip — border only, no colour fill */}
      <div className="border-y-2 border-gray-900 px-8 py-3 flex items-center justify-between text-xs">
        <span className="font-bold uppercase tracking-widest text-sm">Tax Invoice</span>
        <div className="flex gap-6">
          <span>No: <strong>{p.invoiceNo}</strong></span>
          <span>Date: <strong>{p.invoiceDate}</strong></span>
          {p.dueDate && <span>Due: <strong>{p.dueDate}</strong></span>}
        </div>
      </div>

      {/* Two-column: Bill From | Bill To */}
      <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
        <div className="p-6">
          <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">From</div>
          <div className="font-semibold">
            {p.sellerName || <span className="text-gray-300">Your Business</span>}
          </div>
          <p className="text-gray-500 text-xs whitespace-pre-line mt-0.5">
            {p.sellerAddress || <span className="text-gray-200">Address</span>}
          </p>
          {p.sellerGSTIN && <p className="text-gray-500 text-xs">GSTIN: {p.sellerGSTIN}</p>}
          {p.sellerPhone && <p className="text-gray-500 text-xs">Ph: {p.sellerPhone}</p>}
          <p className="text-gray-500 text-xs">State: {p.sellerState}</p>
        </div>
        <div className="p-6">
          <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Bill To</div>
          <div className="font-semibold">
            {p.buyerName || <span className="text-gray-300">Client Name</span>}
          </div>
          <p className="text-gray-500 text-xs whitespace-pre-line mt-0.5">
            {p.buyerAddress || <span className="text-gray-200">Client Address</span>}
          </p>
          {p.buyerGSTIN && <p className="text-gray-500 text-xs">GSTIN: {p.buyerGSTIN}</p>}
          <p className="text-gray-500 text-xs">State: {p.buyerState}</p>
          {p.isIGST && (
            <span className="inline-block mt-1.5 border border-gray-400 text-gray-700 text-[10px] px-2 py-0.5 rounded">
              Inter-state — IGST Applicable
            </span>
          )}
        </div>
      </div>

      {/* Items table */}
      <div className="px-8 pt-6">
        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="border-b-2 border-gray-900">
              <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">#</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Description</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">HSN</th>
              <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Qty</th>
              <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Rate (₹)</th>
              <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">GST%</th>
              <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {p.items.map((item, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="px-3 py-2 text-gray-400 text-xs">{i + 1}</td>
                <td className="px-3 py-2">
                  <div className="no-print">
                    <Input value={item.description} onChange={(e) => p.updateItem(i, "description", e.target.value)} className="h-7 text-xs border-gray-200" placeholder="Description" />
                  </div>
                  <div className="print-only">{item.description}</div>
                </td>
                <td className="px-3 py-2">
                  <div className="no-print">
                    <Input value={item.hsn} onChange={(e) => p.updateItem(i, "hsn", e.target.value)} className="h-7 text-xs w-16 border-gray-200" placeholder="HSN" />
                  </div>
                  <div className="print-only">{item.hsn}</div>
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="no-print">
                    <Input value={item.qty} onChange={(e) => p.updateItem(i, "qty", e.target.value)} className="h-7 text-xs w-14 text-right border-gray-200" />
                  </div>
                  <div className="print-only">{item.qty}</div>
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="no-print">
                    <Input value={item.rate} onChange={(e) => p.updateItem(i, "rate", e.target.value)} className="h-7 text-xs w-20 text-right border-gray-200" placeholder="0" />
                  </div>
                  <div className="print-only">{item.rate}</div>
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="no-print">
                    <select value={item.gst} onChange={(e) => p.updateItem(i, "gst", e.target.value)} className="h-7 text-xs rounded border border-input bg-background px-1 focus:outline-none">
                      {GST_RATES.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="print-only">{item.gst}%</div>
                </td>
                <td className="px-3 py-2 text-right font-medium">
                  ₹{fmt(p.lineCalcs[i]?.total ?? 0)}
                  <button onClick={() => p.removeItem(i)} className="no-print ml-2 text-red-400 hover:text-red-600">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={p.addItem} className="no-print flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 mb-6">
          <Plus className="h-3 w-3" /> Add Line Item
        </button>
      </div>

      {/* Two-column footer: notes + amount-in-words | totals */}
      <div className="border-t border-gray-200 px-8 py-6">
        <div className="grid grid-cols-2 gap-8">
          <div>
            {p.notes && (
              <div className="mb-4">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Notes</div>
                <p className="text-xs text-gray-600">{p.notes}</p>
              </div>
            )}
            <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Amount in Words</div>
            <p className="text-xs text-gray-700 leading-relaxed">{numToWords(p.grandTotal)}</p>
          </div>
          <div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{fmt(p.subtotal)}</span>
              </div>
              {p.isIGST ? (
                <div className="flex justify-between text-gray-500">
                  <span>IGST</span>
                  <span>₹{fmt(p.totalGST)}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-gray-500">
                    <span>CGST</span>
                    <span>₹{fmt(p.totalGST / 2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>SGST</span>
                    <span>₹{fmt(p.totalGST / 2)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between font-bold text-base border-t-2 border-gray-900 pt-2.5 mt-1">
                <span>Total Due</span>
                <span>₹{fmt(p.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-gray-300 border-t border-gray-100 pt-4">
          Generated by IndianBusinessTools.com — Free GST Invoice Generator
        </div>
      </div>
    </div>
  );
}
