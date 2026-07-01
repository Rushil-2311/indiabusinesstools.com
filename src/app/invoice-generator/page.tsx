"use client";
import { useState } from "react";
import { ClipboardList, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import type { LineItem, LineCalc } from "./types";
import { ClassicTemplate } from "./ClassicTemplate";
import { ModernTemplate } from "./ModernTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import { CorporateTemplate } from "./CorporateTemplate";
import { BoldTemplate } from "./BoldTemplate";
import { ToolDescription } from "@/components/shared/ToolDescription";
import { FaqSection } from "@/components/shared/FaqSection";
import { faqs, toolDescriptions } from "@/lib/data";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
  "Chandigarh","Puducherry","Andaman & Nicobar","Lakshadweep","Dadra & Nagar Haveli",
];

type TemplateId = "classic" | "modern" | "minimal" | "corporate" | "bold";

const TEMPLATES: { id: TemplateId; name: string; thumbnail: React.ReactNode }[] = [
  {
    id: "classic",
    name: "Classic",
    thumbnail: (
      <div className="rounded overflow-hidden aspect-[3/4] bg-white border border-gray-100">
        <div className="h-3 bg-gray-800 w-full" />
        <div className="p-1.5 space-y-1">
          <div className="h-1 bg-gray-300 rounded w-3/4" />
          <div className="h-1 bg-gray-200 rounded w-1/2" />
          <div className="mt-1 h-1.5 bg-gray-700 rounded w-full" />
          <div className="h-1 bg-gray-200 rounded w-full" />
          <div className="h-1 bg-gray-200 rounded w-5/6" />
          <div className="h-1 bg-gray-200 rounded w-4/6" />
        </div>
      </div>
    ),
  },
  {
    id: "modern",
    name: "Modern",
    thumbnail: (
      <div className="rounded overflow-hidden aspect-[3/4] bg-white border border-gray-100 flex">
        <div className="w-2/5 p-1 space-y-0.5">
          <div className="h-1 bg-slate-600 rounded w-3/4" />
          <div className="h-1 bg-slate-700 rounded w-full" />
          <div className="h-1 bg-slate-700 rounded w-5/6" />
          <div className="mt-1 h-px bg-slate-700 w-full" />
          <div className="h-1 bg-slate-600 rounded w-2/3 mt-1" />
          <div className="h-1 bg-slate-700 rounded w-full" />
        </div>
        <div className="flex-1 p-1 space-y-0.5">
          <div className="h-1.5 bg-gray-800 rounded w-3/4" />
          <div className="mt-1 h-1 bg-gray-200 rounded w-full" />
          <div className="h-1 bg-gray-100 rounded w-full" />
          <div className="h-1 bg-gray-200 rounded w-5/6" />
          <div className="h-1.5 bg-slate-900 rounded w-full mt-1" />
        </div>
      </div>
    ),
  },
  {
    id: "minimal",
    name: "Minimal",
    thumbnail: (
      <div className="rounded overflow-hidden aspect-[3/4] bg-white border border-gray-100 p-1.5">
        <div className="flex justify-between items-end mb-1">
          <div className="h-1.5 bg-gray-800 rounded w-2/5" />
          <div className="h-1 bg-gray-100 rounded w-1/4" />
        </div>
        <div className="h-px bg-gray-300 w-full mb-1" />
        <div className="grid grid-cols-3 gap-0.5 mb-1">
          <div className="h-1 bg-gray-200 rounded" />
          <div className="h-1 bg-gray-200 rounded" />
          <div className="h-1 bg-gray-200 rounded" />
        </div>
        <div className="h-px bg-gray-300 w-full mb-1" />
        <div className="space-y-0.5">
          <div className="h-1 bg-gray-200 rounded w-full" />
          <div className="h-1 bg-gray-100 rounded w-5/6" />
        </div>
        <div className="flex justify-between mt-1.5">
          <div className="h-1 bg-gray-200 rounded w-1/3" />
          <div className="h-1.5 bg-gray-800 rounded w-1/4" />
        </div>
      </div>
    ),
  },
  {
    id: "corporate",
    name: "Corporate",
    thumbnail: (
      <div className="rounded overflow-hidden aspect-[3/4] bg-white border border-gray-100 flex flex-col">
        <div className="p-1 text-center space-y-0.5">
          <div className="h-1.5 bg-gray-800 rounded w-3/4 mx-auto" />
          <div className="h-1 bg-gray-200 rounded w-1/2 mx-auto" />
        </div>
        <div className="h-2.5 bg-blue-900 w-full" />
        <div className="flex divide-x divide-gray-200 border-b border-gray-200">
          <div className="flex-1 p-1 space-y-0.5">
            <div className="h-px bg-gray-200 w-full" />
            <div className="h-1 bg-gray-300 rounded w-3/4" />
          </div>
          <div className="flex-1 p-1 space-y-0.5">
            <div className="h-px bg-gray-200 w-full" />
            <div className="h-1 bg-gray-300 rounded w-3/4" />
          </div>
        </div>
        <div className="p-1 space-y-0.5 flex-1">
          <div className="h-1.5 bg-blue-900 rounded w-full" />
          <div className="h-1 bg-blue-50 rounded w-full" />
          <div className="h-1 bg-gray-100 rounded w-5/6" />
        </div>
        <div className="p-1 border-t border-gray-100 flex justify-end">
          <div className="h-1.5 bg-blue-900 rounded w-1/3" />
        </div>
      </div>
    ),
  },
  {
    id: "bold",
    name: "Bold",
    thumbnail: (
      <div className="rounded overflow-hidden aspect-[3/4] flex flex-col">
        <div className="p-1.5 flex justify-between items-start">
          <div className="space-y-0.5">
            <div className="h-1.5 bg-white rounded w-10" />
            <div className="h-1 bg-gray-700 rounded w-8" />
          </div>
          <div className="h-2 bg-amber-400 rounded w-8" />
        </div>
        <div className="flex gap-1 px-1.5 mb-1">
          <div className="flex-1 h-3 bg-gray-900 rounded" />
          <div className="flex-1 h-3 bg-gray-900 rounded" />
        </div>
        <div className="bg-white rounded-t-lg flex-1 p-1.5 space-y-0.5">
          <div className="h-1.5 bg-gray-900 rounded w-full" />
          <div className="h-1 bg-amber-50 rounded w-full" />
          <div className="h-1 bg-gray-100 rounded w-5/6" />
          <div className="h-1.5 bg-gray-950 rounded w-1/2 ml-auto mt-1" />
        </div>
      </div>
    ),
  },
];

export default function InvoiceGeneratorPage() {
  const [template, setTemplate] = useState<TemplateId>("classic");
  const [downloading, setDownloading] = useState(false);

  async function downloadPDF() {
    const wrapper = document.getElementById("invoice-preview");
    if (!wrapper) return;
    // Capture the template's root element, not the grid cell wrapper.
    // The grid cell stretches to match the sidebar height, adding blank space.
    const element = (wrapper.firstElementChild as HTMLElement | null) ?? wrapper;
    setDownloading(true);

    const noPrintEls = wrapper.querySelectorAll<HTMLElement>(".no-print");
    const printOnlyEls = wrapper.querySelectorAll<HTMLElement>(".print-only");
    noPrintEls.forEach((el) => (el.style.display = "none"));
    printOnlyEls.forEach((el) => (el.style.display = "block"));

    // Bake computed colors as inline styles before serialisation.
    // getComputedStyle always returns resolved rgb() values, so Tailwind
    // CSS-variable / oklch colors survive the SVG foreignObject context.
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
        // Multi-page: draw image to canvas, slice into A4-height chunks
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
          pageCanvas.getContext("2d")!.drawImage(
            canvas, 0, offsetY, canvas.width, sliceH, 0, 0, canvas.width, sliceH
          );
          pdf.addImage(pageCanvas.toDataURL("image/png"), "PNG", 0, 0, pdfW, sliceH * mmPerPx);
          offsetY += pageHeightPx;
        }
      }

      pdf.save(`invoice-${invoiceNo || "download"}.pdf`);
    } finally {
      allEls.forEach((e, i) => (e.style.cssText = savedStyles[i]));
      noPrintEls.forEach((el) => (el.style.display = ""));
      printOnlyEls.forEach((el) => (el.style.display = ""));
      setDownloading(false);
    }
  }

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

  const lineCalcs: LineCalc[] = items.map((item) => {
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

  const templateProps = {
    sellerName, sellerAddress, sellerGSTIN, sellerState, sellerPhone,
    buyerName, buyerAddress, buyerGSTIN, buyerState,
    invoiceNo, invoiceDate, dueDate, notes,
    items, lineCalcs, subtotal, totalGST, grandTotal, isIGST,
    updateItem, addItem, removeItem,
  };

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          * {
            min-height: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          header, footer { display: none !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          #invoice-layout {
            display: block !important;
            padding: 0 !important;
            max-width: 100% !important;
          }
          #invoice-preview {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
          }
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
          {/* Template selector */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Template</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`rounded-lg border-2 p-1.5 transition-all ${
                      template === t.id
                        ? "border-blue-500 shadow-sm bg-blue-50/50"
                        : "border-gray-200 hover:border-gray-400 cursor-pointer"
                    }`}
                  >
                    {t.thumbnail}
                    <div className={`text-xs text-center mt-1.5 font-medium ${template === t.id ? "text-blue-600" : "text-gray-600"}`}>
                      {t.name}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

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

          <Button onClick={downloadPDF} disabled={downloading} className="w-full bg-gray-800 hover:bg-gray-700 text-white">
            {downloading
              ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating PDF…</>
              : <><Download className="h-4 w-4 mr-2" /> Download PDF</>}
          </Button>
        </div>

        {/* Invoice Preview */}
        <div id="invoice-preview">
          {template === "classic" && <ClassicTemplate {...templateProps} />}
          {template === "modern" && <ModernTemplate {...templateProps} />}
          {template === "minimal" && <MinimalTemplate {...templateProps} />}
          {template === "corporate" && <CorporateTemplate {...templateProps} />}
          {template === "bold" && <BoldTemplate {...templateProps} />}
        </div>

        <ToolDescription toolName="Invoice Generator" data={toolDescriptions["invoice-generator"]} />
        <FaqSection faqs={faqs["invoice-generator"]} />
      </div>
    </div>
  );
}
