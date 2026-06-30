import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { InvoiceTemplateProps } from "./types";
import { fmt, numToWords, GST_RATES } from "./types";

export function ClassicTemplate(p: InvoiceTemplateProps) {
  return (
    <div className="bg-white text-gray-900 rounded-xl shadow-lg border p-8 text-sm font-sans">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {p.sellerName || <span className="invoice-placeholder text-gray-300">Your Business Name</span>}
          </h2>
          <p className="text-gray-600 mt-1 whitespace-pre-line">
            {p.sellerAddress || <span className="invoice-placeholder text-gray-300">Business Address</span>}
          </p>
          {p.sellerGSTIN && <p className="text-gray-600">GSTIN: {p.sellerGSTIN}</p>}
          {p.sellerPhone && <p className="text-gray-600">Ph: {p.sellerPhone}</p>}
          <p className="text-gray-600">State: {p.sellerState}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-800">INVOICE</div>
          <div className="mt-2 space-y-0.5">
            <p><span className="text-gray-500">Invoice No: </span><strong>{p.invoiceNo}</strong></p>
            <p><span className="text-gray-500">Date: </span><strong>{p.invoiceDate}</strong></p>
            {p.dueDate && <p><span className="text-gray-500">Due Date: </span><strong>{p.dueDate}</strong></p>}
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-6">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Bill To</div>
        <div className="font-semibold text-base">
          {p.buyerName || <span className="invoice-placeholder text-gray-300">Client Name</span>}
        </div>
        <p className="text-gray-600 whitespace-pre-line">
          {p.buyerAddress || <span className="invoice-placeholder text-gray-300">Client Address</span>}
        </p>
        {p.buyerGSTIN && <p className="text-gray-600">GSTIN: {p.buyerGSTIN}</p>}
        <p className="text-gray-600">State: {p.buyerState}</p>
        {p.isIGST && (
          <span className="inline-block mt-1 border border-gray-400 text-gray-700 text-xs px-2 py-0.5 rounded">
            Inter-state — IGST applicable
          </span>
        )}
      </div>

      {/* Items table */}
      <table className="w-full text-sm mb-4">
        <thead>
          <tr className="border-b-2 border-gray-800">
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">#</th>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Description</th>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">HSN</th>
            <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Qty</th>
            <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Rate (₹)</th>
            <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">GST%</th>
            <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {p.items.map((item, i) => (
            <tr key={i} className="border-b border-gray-200">
              <td className="px-3 py-2 text-gray-500">{i + 1}</td>
              <td className="px-3 py-2">
                <div className="no-print">
                  <Input value={item.description} onChange={(e) => p.updateItem(i, "description", e.target.value)} className="h-7 text-xs border-gray-300" placeholder="Description" />
                </div>
                <div className="print-only">{item.description}</div>
              </td>
              <td className="px-3 py-2">
                <div className="no-print">
                  <Input value={item.hsn} onChange={(e) => p.updateItem(i, "hsn", e.target.value)} className="h-7 text-xs w-20" placeholder="HSN" />
                </div>
                <div className="print-only">{item.hsn}</div>
              </td>
              <td className="px-3 py-2 text-right">
                <div className="no-print">
                  <Input value={item.qty} onChange={(e) => p.updateItem(i, "qty", e.target.value)} className="h-7 text-xs w-16 text-right" />
                </div>
                <div className="print-only">{item.qty}</div>
              </td>
              <td className="px-3 py-2 text-right">
                <div className="no-print">
                  <Input value={item.rate} onChange={(e) => p.updateItem(i, "rate", e.target.value)} className="h-7 text-xs w-24 text-right" placeholder="0" />
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

      <button onClick={p.addItem} className="no-print flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mb-6">
        <Plus className="h-3 w-3" /> Add Line Item
      </button>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64 space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>₹{fmt(p.subtotal)}</span>
          </div>
          {p.isIGST ? (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">IGST</span>
              <span>₹{fmt(p.totalGST)}</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">CGST</span>
                <span>₹{fmt(p.totalGST / 2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">SGST</span>
                <span>₹{fmt(p.totalGST / 2)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between font-bold text-base border-t-2 border-gray-800 pt-2 mt-2">
            <span>Total</span>
            <span>₹{fmt(p.grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Amount in words */}
      <div className="mt-4 p-3 border border-gray-200 rounded-lg">
        <span className="text-xs text-gray-500 font-semibold">Amount in Words: </span>
        <span className="text-xs text-gray-700">{numToWords(p.grandTotal)}</span>
      </div>

      {/* Notes */}
      {p.notes && (
        <div className="mt-4 border-t border-gray-200 pt-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notes</div>
          <p className="text-xs text-gray-600">{p.notes}</p>
        </div>
      )}

      <div className="mt-6 text-center text-xs text-gray-400 border-t border-gray-200 pt-3">
        Generated by IndianBusinessTools.com — Free GST Invoice Generator
      </div>
    </div>
  );
}
