import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { InvoiceTemplateProps } from "./types";
import { fmt, numToWords, GST_RATES } from "./types";

export function MinimalTemplate(p: InvoiceTemplateProps) {
  return (
    <div className="bg-white text-gray-900 rounded-xl shadow-lg p-10 text-sm font-sans">
      {/* Header row */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-light tracking-tight text-gray-900">
            {p.sellerName || <span className="text-gray-200">Your Business Name</span>}
          </h2>
          <p className="text-gray-400 text-xs mt-1.5 whitespace-pre-line">
            {p.sellerAddress || <span className="text-gray-200">Business Address</span>}
          </p>
          {p.sellerGSTIN && <p className="text-gray-400 text-xs">GSTIN: {p.sellerGSTIN}</p>}
          {p.sellerPhone && <p className="text-gray-400 text-xs">{p.sellerPhone}</p>}
          <p className="text-gray-400 text-xs">State: {p.sellerState}</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-thin text-gray-200 uppercase tracking-[0.4em]">invoice</div>
        </div>
      </div>

      {/* Three-column meta strip */}
      <div className="grid grid-cols-3 border-t border-b border-gray-200 py-5 mb-8 gap-4 text-xs">
        <div>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">Bill To</div>
          <div className="font-semibold text-sm text-gray-900">
            {p.buyerName || <span className="text-gray-300">Client Name</span>}
          </div>
          <p className="text-gray-500 whitespace-pre-line mt-0.5">
            {p.buyerAddress || <span className="text-gray-200">Client Address</span>}
          </p>
          {p.buyerGSTIN && <p className="text-gray-500">GSTIN: {p.buyerGSTIN}</p>}
          <p className="text-gray-500">State: {p.buyerState}</p>
          {p.isIGST && (
            <span className="inline-block mt-1.5 border border-gray-300 text-gray-500 text-[10px] px-2 py-0.5 rounded">
              IGST Applicable
            </span>
          )}
        </div>
        <div className="text-center border-l border-r border-gray-200 px-4 flex flex-col justify-center">
          <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">Invoice No.</div>
          <div className="font-semibold text-base text-gray-900">{p.invoiceNo}</div>
        </div>
        <div className="text-right flex flex-col justify-center">
          <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">Date</div>
          <div className="font-semibold text-gray-900">{p.invoiceDate}</div>
          {p.dueDate && (
            <>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-3 mb-1.5">Due Date</div>
              <div className="font-semibold text-gray-900">{p.dueDate}</div>
            </>
          )}
        </div>
      </div>

      {/* Items table — no background fills */}
      <table className="w-full text-sm mb-6">
        <thead>
          <tr className="border-b-2 border-gray-900">
            <th className="pb-2.5 text-left text-[10px] uppercase tracking-widest text-gray-400 font-normal">#</th>
            <th className="pb-2.5 text-left text-[10px] uppercase tracking-widest text-gray-400 font-normal">Description</th>
            <th className="pb-2.5 text-left text-[10px] uppercase tracking-widest text-gray-400 font-normal">HSN</th>
            <th className="pb-2.5 text-right text-[10px] uppercase tracking-widest text-gray-400 font-normal">Qty</th>
            <th className="pb-2.5 text-right text-[10px] uppercase tracking-widest text-gray-400 font-normal">Rate (₹)</th>
            <th className="pb-2.5 text-right text-[10px] uppercase tracking-widest text-gray-400 font-normal">GST%</th>
            <th className="pb-2.5 text-right text-[10px] uppercase tracking-widest text-gray-400 font-normal">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {p.items.map((item, i) => (
            <tr key={i} className="border-b border-gray-100">
              <td className="py-3 text-gray-400 text-xs">{i + 1}</td>
              <td className="py-3">
                <div className="no-print">
                  <Input value={item.description} onChange={(e) => p.updateItem(i, "description", e.target.value)} className="h-7 text-xs border-gray-200" placeholder="Description" />
                </div>
                <div className="print-only">{item.description}</div>
              </td>
              <td className="py-3">
                <div className="no-print">
                  <Input value={item.hsn} onChange={(e) => p.updateItem(i, "hsn", e.target.value)} className="h-7 text-xs w-16 border-gray-200" placeholder="HSN" />
                </div>
                <div className="print-only">{item.hsn}</div>
              </td>
              <td className="py-3 text-right">
                <div className="no-print">
                  <Input value={item.qty} onChange={(e) => p.updateItem(i, "qty", e.target.value)} className="h-7 text-xs w-14 text-right border-gray-200" />
                </div>
                <div className="print-only">{item.qty}</div>
              </td>
              <td className="py-3 text-right">
                <div className="no-print">
                  <Input value={item.rate} onChange={(e) => p.updateItem(i, "rate", e.target.value)} className="h-7 text-xs w-20 text-right border-gray-200" placeholder="0" />
                </div>
                <div className="print-only">{item.rate}</div>
              </td>
              <td className="py-3 text-right">
                <div className="no-print">
                  <select value={item.gst} onChange={(e) => p.updateItem(i, "gst", e.target.value)} className="h-7 text-xs rounded border border-input bg-background px-1 focus:outline-none">
                    {GST_RATES.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="print-only">{item.gst}%</div>
              </td>
              <td className="py-3 text-right font-medium">
                ₹{fmt(p.lineCalcs[i]?.total ?? 0)}
                <button onClick={() => p.removeItem(i)} className="no-print ml-2 text-red-400 hover:text-red-600">
                  <Trash2 className="h-3 w-3" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={p.addItem} className="no-print flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-8">
        <Plus className="h-3 w-3" /> Add Line Item
      </button>

      {/* Bottom: notes + amount-in-words left | totals right */}
      <div className="flex justify-between items-start gap-8 border-t border-gray-200 pt-6">
        <div className="flex-1 text-xs text-gray-500">
          {p.notes && (
            <>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Notes</div>
              <p className="mb-4">{p.notes}</p>
            </>
          )}
          <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Amount in Words</div>
          <p className="text-gray-600 leading-relaxed">{numToWords(p.grandTotal)}</p>
        </div>
        <div className="w-56 shrink-0">
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
            <div className="flex justify-between font-bold text-lg border-t-2 border-gray-900 pt-2.5 mt-1">
              <span>Total</span>
              <span>₹{fmt(p.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-gray-300">
        Generated by IndianBusinessTools.com — Free GST Invoice Generator
      </div>
    </div>
  );
}
