import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { InvoiceTemplateProps } from "./types";
import { fmt, numToWords, GST_RATES } from "./types";

export function BoldTemplate(p: InvoiceTemplateProps) {
  return (
    <div className="bg-white text-gray-900 rounded-xl shadow-lg overflow-hidden text-sm font-sans">
      {/* Header */}
      <div className="p-8 pb-6 border-b-2 border-gray-900">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-[0.3em] mb-2">Tax Invoice</div>
            <h2 className="text-2xl font-black leading-tight">
              {p.sellerName || <span className="opacity-30">Business Name</span>}
            </h2>
            <p className="text-gray-500 text-xs mt-1 whitespace-pre-line">
              {p.sellerAddress || <span className="opacity-20">Business Address</span>}
            </p>
            {p.sellerGSTIN && <p className="text-gray-500 text-xs">GSTIN: {p.sellerGSTIN}</p>}
            {p.sellerPhone && <p className="text-gray-500 text-xs">{p.sellerPhone}</p>}
            <p className="text-gray-500 text-xs">State: {p.sellerState}</p>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-400 uppercase tracking-[0.3em] mb-1">Amount Due</div>
            <div className="text-4xl font-black text-gray-900">₹{fmt(p.grandTotal)}</div>
            <div className="text-xs text-gray-500 mt-1">{p.invoiceNo}</div>
            <div className="text-xs text-gray-500">{p.invoiceDate}</div>
            {p.dueDate && <div className="text-xs text-gray-500">Due: {p.dueDate}</div>}
          </div>
        </div>

        {/* FROM / BILL TO — bordered cards */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">From</div>
            <div className="font-semibold text-sm">
              {p.sellerName || <span className="opacity-30">Business</span>}
            </div>
            <p className="text-gray-500 text-xs mt-0.5 whitespace-pre-line">{p.sellerAddress}</p>
            {p.sellerGSTIN && <p className="text-gray-500 text-xs">GSTIN: {p.sellerGSTIN}</p>}
            <p className="text-gray-500 text-xs">State: {p.sellerState}</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Bill To</div>
            <div className="font-semibold text-sm">
              {p.buyerName || <span className="opacity-30">Client</span>}
            </div>
            <p className="text-gray-500 text-xs mt-0.5 whitespace-pre-line">{p.buyerAddress}</p>
            {p.buyerGSTIN && <p className="text-gray-500 text-xs">GSTIN: {p.buyerGSTIN}</p>}
            <p className="text-gray-500 text-xs">State: {p.buyerState}</p>
            {p.isIGST && (
              <span className="inline-block mt-1.5 border border-gray-400 text-gray-700 text-[10px] px-2 py-0.5 rounded">
                IGST Applicable
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content panel */}
      <div className="px-8 pt-8 pb-8">
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
                <td className="px-3 py-2.5 text-gray-400 text-xs">{i + 1}</td>
                <td className="px-3 py-2.5">
                  <div className="no-print">
                    <Input value={item.description} onChange={(e) => p.updateItem(i, "description", e.target.value)} className="h-7 text-xs border-gray-200" placeholder="Description" />
                  </div>
                  <div className="print-only">{item.description}</div>
                </td>
                <td className="px-3 py-2.5">
                  <div className="no-print">
                    <Input value={item.hsn} onChange={(e) => p.updateItem(i, "hsn", e.target.value)} className="h-7 text-xs w-16 border-gray-200" placeholder="HSN" />
                  </div>
                  <div className="print-only">{item.hsn}</div>
                </td>
                <td className="px-3 py-2.5 text-right">
                  <div className="no-print">
                    <Input value={item.qty} onChange={(e) => p.updateItem(i, "qty", e.target.value)} className="h-7 text-xs w-14 text-right border-gray-200" />
                  </div>
                  <div className="print-only">{item.qty}</div>
                </td>
                <td className="px-3 py-2.5 text-right">
                  <div className="no-print">
                    <Input value={item.rate} onChange={(e) => p.updateItem(i, "rate", e.target.value)} className="h-7 text-xs w-20 text-right border-gray-200" placeholder="0" />
                  </div>
                  <div className="print-only">{item.rate}</div>
                </td>
                <td className="px-3 py-2.5 text-right">
                  <div className="no-print">
                    <select value={item.gst} onChange={(e) => p.updateItem(i, "gst", e.target.value)} className="h-7 text-xs rounded border border-input bg-background px-1 focus:outline-none">
                      {GST_RATES.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="print-only">{item.gst}%</div>
                </td>
                <td className="px-3 py-2.5 text-right font-semibold">
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

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-1.5">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>₹{fmt(p.subtotal)}</span>
            </div>
            {p.isIGST ? (
              <div className="flex justify-between text-sm text-gray-500">
                <span>IGST</span>
                <span>₹{fmt(p.totalGST)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>CGST</span>
                  <span>₹{fmt(p.totalGST / 2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>SGST</span>
                  <span>₹{fmt(p.totalGST / 2)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between items-center font-black text-lg border-t-2 border-gray-900 pt-2.5 mt-1">
              <span>TOTAL</span>
              <span>₹{fmt(p.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Amount in words */}
        <div className="mt-4 p-3 border-l-4 border-gray-400 pl-4">
          <span className="text-xs text-gray-500 font-bold">Amount in Words: </span>
          <span className="text-xs text-gray-700">{numToWords(p.grandTotal)}</span>
        </div>

        {/* Notes */}
        {p.notes && (
          <div className="mt-4 border-t border-gray-100 pt-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Notes</p>
            <p className="text-xs text-gray-600">{p.notes}</p>
          </div>
        )}

        <div className="mt-6 text-center text-xs text-gray-300 border-t border-gray-100 pt-3">
          Generated by IndianBusinessTools.com — Free GST Invoice Generator
        </div>
      </div>
    </div>
  );
}
