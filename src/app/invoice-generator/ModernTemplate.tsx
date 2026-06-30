import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { InvoiceTemplateProps } from "./types";
import { fmt, numToWords, GST_RATES } from "./types";

export function ModernTemplate(p: InvoiceTemplateProps) {
  return (
    <div className="bg-white text-gray-900 rounded-xl shadow-lg overflow-hidden text-sm font-sans flex min-h-[700px]">
      {/* Left Sidebar — white with right border */}
      <div className="border-r border-gray-200 text-gray-900 w-52 shrink-0 flex flex-col p-6 gap-5">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-2">From</p>
          <h2 className="text-base font-bold leading-tight">
            {p.sellerName || <span className="opacity-30">Business Name</span>}
          </h2>
          <p className="text-gray-500 text-xs mt-1 whitespace-pre-line leading-relaxed">
            {p.sellerAddress || <span className="opacity-30">Address</span>}
          </p>
          {p.sellerGSTIN && <p className="text-gray-500 text-xs mt-0.5">GSTIN: {p.sellerGSTIN}</p>}
          {p.sellerPhone && <p className="text-gray-500 text-xs">Ph: {p.sellerPhone}</p>}
          <p className="text-gray-500 text-xs">State: {p.sellerState}</p>
        </div>

        <div className="border-t border-gray-200 pt-5">
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-2">Bill To</p>
          <div className="font-semibold text-sm">
            {p.buyerName || <span className="opacity-30">Client Name</span>}
          </div>
          <p className="text-gray-500 text-xs mt-1 whitespace-pre-line leading-relaxed">
            {p.buyerAddress || <span className="opacity-30">Address</span>}
          </p>
          {p.buyerGSTIN && <p className="text-gray-500 text-xs mt-0.5">GSTIN: {p.buyerGSTIN}</p>}
          <p className="text-gray-500 text-xs">State: {p.buyerState}</p>
          {p.isIGST && (
            <span className="inline-block mt-2 text-[10px] border border-gray-400 text-gray-600 px-2 py-0.5 rounded">
              IGST Applicable
            </span>
          )}
        </div>

        <div className="border-t border-gray-200 pt-5">
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-3">Invoice</p>
          <div className="space-y-2.5 text-xs">
            <div>
              <div className="text-gray-400 text-[10px]">Number</div>
              <div className="font-semibold text-gray-900 mt-0.5">{p.invoiceNo}</div>
            </div>
            <div>
              <div className="text-gray-400 text-[10px]">Date</div>
              <div className="font-semibold text-gray-900 mt-0.5">{p.invoiceDate}</div>
            </div>
            {p.dueDate && (
              <div>
                <div className="text-gray-400 text-[10px]">Due Date</div>
                <div className="font-semibold text-gray-900 mt-0.5">{p.dueDate}</div>
              </div>
            )}
          </div>
        </div>

        {p.notes && (
          <div className="border-t border-gray-200 pt-5">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-1.5">Notes</p>
            <p className="text-gray-500 text-xs leading-relaxed">{p.notes}</p>
          </div>
        )}

        <div className="mt-auto text-[10px] text-gray-300 pt-4 border-t border-gray-100">
          IndianBusinessTools.com
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 flex flex-col">
        <div className="flex items-start justify-between mb-8">
          <div className="text-4xl font-black tracking-tight text-gray-900">INVOICE</div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-700">₹{fmt(p.grandTotal)}</div>
            <div className="text-xs text-gray-400 mt-0.5">Total Amount</div>
          </div>
        </div>

        {/* Items table */}
        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="border-b-2 border-gray-900">
              <th className="pb-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
              <th className="pb-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
              <th className="pb-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">HSN</th>
              <th className="pb-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Qty</th>
              <th className="pb-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Rate (₹)</th>
              <th className="pb-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">GST%</th>
              <th className="pb-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {p.items.map((item, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-2.5 text-gray-400 text-xs">{i + 1}</td>
                <td className="py-2.5">
                  <div className="no-print">
                    <Input value={item.description} onChange={(e) => p.updateItem(i, "description", e.target.value)} className="h-7 text-xs" placeholder="Description" />
                  </div>
                  <div className="print-only">{item.description}</div>
                </td>
                <td className="py-2.5">
                  <div className="no-print">
                    <Input value={item.hsn} onChange={(e) => p.updateItem(i, "hsn", e.target.value)} className="h-7 text-xs w-16" placeholder="HSN" />
                  </div>
                  <div className="print-only">{item.hsn}</div>
                </td>
                <td className="py-2.5 text-right">
                  <div className="no-print">
                    <Input value={item.qty} onChange={(e) => p.updateItem(i, "qty", e.target.value)} className="h-7 text-xs w-14 text-right" />
                  </div>
                  <div className="print-only">{item.qty}</div>
                </td>
                <td className="py-2.5 text-right">
                  <div className="no-print">
                    <Input value={item.rate} onChange={(e) => p.updateItem(i, "rate", e.target.value)} className="h-7 text-xs w-20 text-right" placeholder="0" />
                  </div>
                  <div className="print-only">{item.rate}</div>
                </td>
                <td className="py-2.5 text-right">
                  <div className="no-print">
                    <select value={item.gst} onChange={(e) => p.updateItem(i, "gst", e.target.value)} className="h-7 text-xs rounded border border-input bg-background px-1 focus:outline-none">
                      {GST_RATES.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="print-only">{item.gst}%</div>
                </td>
                <td className="py-2.5 text-right font-medium">
                  ₹{fmt(p.lineCalcs[i]?.total ?? 0)}
                  <button onClick={() => p.removeItem(i)} className="no-print ml-2 text-red-400 hover:text-red-600">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={p.addItem} className="no-print flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 mb-4">
          <Plus className="h-3 w-3" /> Add Line Item
        </button>

        {/* Totals */}
        <div className="flex justify-end mt-auto pt-4">
          <div className="w-60">
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
                <span>Total</span>
                <span>₹{fmt(p.grandTotal)}</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500 leading-relaxed">
              {numToWords(p.grandTotal)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
