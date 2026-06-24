"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  FilePen, Upload, RefreshCw, Download, Trash2, Undo2,
  Type, Pen, Highlighter, Square, Circle, MoveRight, Eraser,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/PageHeader";

// ── Types ──────────────────────────────────────────────────────────────────────
const SCALE = 1.5;
type Tab = "draw" | "watermark";
type Tool = "pen" | "highlight" | "text" | "rect" | "circle" | "arrow" | "eraser";

type PenOp   = { type: "pen" | "highlight" | "eraser"; pts: [number, number][]; color: string; width: number };
type TextOp  = { type: "text";  x: number; y: number; text: string; color: string; size: number };
type ShapeOp = { type: "rect" | "circle" | "arrow"; x1: number; y1: number; x2: number; y2: number; color: string; width: number };
type DrawOp  = PenOp | TextOp | ShapeOp;

// ── Canvas renderer ────────────────────────────────────────────────────────────
function renderOp(ctx: CanvasRenderingContext2D, op: DrawOp) {
  ctx.save();
  if (op.type === "pen" || op.type === "highlight" || op.type === "eraser") {
    ctx.globalAlpha = op.type === "highlight" ? 0.4 : 1;
    ctx.strokeStyle  = op.type === "eraser" ? "#ffffff" : op.color;
    ctx.fillStyle    = op.type === "eraser" ? "#ffffff" : op.color;
    ctx.lineWidth    = op.width;
    ctx.lineCap      = "round";
    ctx.lineJoin     = "round";
    if (op.pts.length === 1) {
      ctx.beginPath();
      ctx.arc(op.pts[0][0], op.pts[0][1], op.width / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(op.pts[0][0], op.pts[0][1]);
      for (let i = 1; i < op.pts.length; i++) ctx.lineTo(op.pts[i][0], op.pts[i][1]);
      ctx.stroke();
    }
  } else if (op.type === "text") {
    ctx.font         = `${op.size}px Arial, sans-serif`;
    ctx.fillStyle    = op.color;
    ctx.textBaseline = "top"; // y is the TOP of the text, not the baseline
    op.text.split("\n").forEach((line, i) => ctx.fillText(line, op.x, op.y + i * op.size * 1.3));
  } else if (op.type === "rect") {
    ctx.strokeStyle = op.color;
    ctx.lineWidth   = op.width;
    ctx.strokeRect(Math.min(op.x1, op.x2), Math.min(op.y1, op.y2), Math.abs(op.x2 - op.x1), Math.abs(op.y2 - op.y1));
  } else if (op.type === "circle") {
    ctx.strokeStyle = op.color;
    ctx.lineWidth   = op.width;
    const cx = (op.x1 + op.x2) / 2, cy = (op.y1 + op.y2) / 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.abs(op.x2 - op.x1) / 2, Math.abs(op.y2 - op.y1) / 2, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else if (op.type === "arrow") {
    ctx.strokeStyle = op.color;
    ctx.fillStyle   = op.color;
    ctx.lineWidth   = op.width;
    ctx.beginPath(); ctx.moveTo(op.x1, op.y1); ctx.lineTo(op.x2, op.y2); ctx.stroke();
    const a = Math.atan2(op.y2 - op.y1, op.x2 - op.x1);
    const hl = 14 + op.width * 2;
    ctx.beginPath();
    ctx.moveTo(op.x2, op.y2);
    ctx.lineTo(op.x2 - hl * Math.cos(a - Math.PI / 6), op.y2 - hl * Math.sin(a - Math.PI / 6));
    ctx.lineTo(op.x2 - hl * Math.cos(a + Math.PI / 6), op.y2 - hl * Math.sin(a + Math.PI / 6));
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

// ── Draw & Edit Tab ────────────────────────────────────────────────────────────
function DrawEditTab() {
  const [file, setFile]             = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [allOps, setAllOps]         = useState<DrawOp[][]>([]);
  const [tool, setTool]             = useState<Tool>("pen");
  const [color, setColor]           = useState("#ef4444");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [fontSize, setFontSize]     = useState(18);
  const [saving, setSaving]         = useState(false);
  const [loading, setLoading]       = useState(false);
  const [textEditor, setTextEditor] = useState<{
    panelX: number; panelY: number;
    canvasX: number; canvasY: number;
    text: string;
    color: string;
    size: number;
    editingIndex?: number;
  } | null>(null);

  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const bgCanvases      = useRef<HTMLCanvasElement[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfDocRef       = useRef<any>(null);
  const allOpsRef       = useRef<DrawOp[][]>([]);
  const isDrawing       = useRef(false);
  const currentPts      = useRef<[number, number][]>([]);
  const startPt         = useRef<[number, number]>([0, 0]);
  const fileRef         = useRef<HTMLInputElement>(null);
  const textareaRef     = useRef<HTMLTextAreaElement>(null);
  const textEditorRef   = useRef<typeof textEditor>(null);
  const textEditorDivRef = useRef<HTMLDivElement>(null);
  const justCommitted   = useRef(false);
  const currentPageRef  = useRef(0);

  // Keep refs in sync
  useEffect(() => { allOpsRef.current = allOps; }, [allOps]);
  useEffect(() => { currentPageRef.current = currentPage; }, [currentPage]);
  useEffect(() => { textEditorRef.current = textEditor; }, [textEditor]);

  // Redraw: bg + committed ops + optional in-progress op (skips op being actively edited)
  const redraw = useCallback((inProgressOp?: DrawOp) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const bg = bgCanvases.current[currentPageRef.current];
    if (bg) {
      ctx.drawImage(bg, 0, 0);
    } else {
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    const editingIdx = textEditorRef.current?.editingIndex;
    const ops = allOpsRef.current[currentPageRef.current] ?? [];
    for (let i = 0; i < ops.length; i++) {
      if (editingIdx !== undefined && i === editingIdx) continue;
      renderOp(ctx, ops[i]);
    }
    if (inProgressOp) renderOp(ctx, inProgressOp);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function renderPage(pdfDoc: any, idx: number): Promise<HTMLCanvasElement> {
    const page     = await pdfDoc.getPage(idx + 1);
    const viewport = page.getViewport({ scale: SCALE });
    const cvs      = document.createElement("canvas");
    cvs.width  = viewport.width;
    cvs.height = viewport.height;
    await page.render({ canvasContext: cvs.getContext("2d")!, viewport }).promise;
    return cvs;
  }

  async function loadPdf(f: File) {
    setLoading(true);
    setFile(f);
    setAllOps([]);
    setCurrentPage(0);
    currentPageRef.current = 0;
    bgCanvases.current = [];

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfjsLib = await import("pdfjs-dist") as any;
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      const pdfDoc = await pdfjsLib.getDocument({ data: await f.arrayBuffer() }).promise;
      pdfDocRef.current = pdfDoc;

      const n = pdfDoc.numPages;
      setTotalPages(n);
      const emptyOps = Array.from({ length: n }, (): DrawOp[] => []);
      setAllOps(emptyOps);
      allOpsRef.current = emptyOps;

      // Render first page now
      const first = await renderPage(pdfDoc, 0);
      bgCanvases.current[0] = first;
      const canvas = canvasRef.current!;
      canvas.width  = first.width;
      canvas.height = first.height;
      redraw();

      // Render remaining pages in background
      for (let i = 1; i < n; i++) {
        renderPage(pdfDoc, i).then(cvs => { bgCanvases.current[i] = cvs; });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) loadPdf(f);
    e.target.value = "";
  }

  // Switch page
  useEffect(() => {
    const bg = bgCanvases.current[currentPage];
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (bg) {
      canvas.width  = bg.width;
      canvas.height = bg.height;
    }
    redraw();
  }, [currentPage, redraw]);

  // Redraw when ops change
  useEffect(() => { redraw(); }, [allOps, redraw]);

  function getPos(e: React.PointerEvent<HTMLCanvasElement>): [number, number] {
    const r = e.currentTarget.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  }

  function findTextOpAt(x: number, y: number): { index: number; op: TextOp } | null {
    const ops = allOpsRef.current[currentPageRef.current] ?? [];
    for (let i = ops.length - 1; i >= 0; i--) {
      const op = ops[i];
      if (op.type !== "text") continue;
      const tOp = op as TextOp;
      const w = tOp.text.length * tOp.size * 0.55;
      const h = tOp.size * 1.3; // textBaseline=top, so y is the top
      if (x >= tOp.x - 6 && x <= tOp.x + w + 6 && y >= tOp.y - 6 && y <= tOp.y + h + 6) {
        return { index: i, op: tOp };
      }
    }
    return null;
  }

  function commitTextEditor(editor: NonNullable<typeof textEditor>) {
    textEditorRef.current = null;
    if (editor.text.trim()) {
      const newOp: DrawOp = {
        type: "text", x: editor.canvasX, y: editor.canvasY,
        text: editor.text, color: editor.color, size: editor.size,
      };
      if (editor.editingIndex !== undefined) {
        const idx = editor.editingIndex;
        setAllOps(prev => {
          const next = prev.map((p, i) => {
            if (i !== currentPageRef.current) return p;
            const updated = [...p]; updated[idx] = newOp; return updated;
          });
          allOpsRef.current = next; return next;
        });
      } else {
        setAllOps(prev => {
          const next = prev.map((p, i) => i === currentPageRef.current ? [...p, newOp] : p);
          allOpsRef.current = next; return next;
        });
      }
    }
    setTextEditor(null);
  }

  function handleDragHandleMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    const snap = textEditorRef.current;
    if (!snap) return;
    const { panelX, panelY, canvasX, canvasY } = snap;
    const sx = e.clientX, sy = e.clientY;
    function onMove(ev: MouseEvent) {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      setTextEditor(prev => prev ? { ...prev, panelX: panelX + dx, panelY: panelY + dy, canvasX: canvasX + dx, canvasY: canvasY + dy } : null);
    }
    function onUp() { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    // Capture listener already committed/cleared the editor; swallow this click for text tool
    if (justCommitted.current) {
      justCommitted.current = false;
      if (tool === "text") return;
    }
    if (tool === "text") {
      const [x, y] = getPos(e);
      const existing = findTextOpAt(x, y);
      if (existing) {
        setColor(existing.op.color);
        setFontSize(existing.op.size);
        // op.y is already the TOP of the text (textBaseline="top")
        const panelY = Math.max(20, existing.op.y);
        setTextEditor({
          panelX: existing.op.x, panelY,
          canvasX: existing.op.x, canvasY: panelY,
          text: existing.op.text, color: existing.op.color,
          size: existing.op.size, editingIndex: existing.index,
        });
      } else {
        // panelY = top of the textarea = top of where the text will draw
        const panelY = Math.max(20, y - fontSize);
        setTextEditor({
          panelX: x, panelY,
          canvasX: x, canvasY: panelY, // canvasY === panelY (textBaseline=top)
          text: "", color, size: fontSize,
          editingIndex: undefined,
        });
      }
      return;
    }
    isDrawing.current = true;
    const pt = getPos(e);
    startPt.current   = pt;
    currentPts.current = [pt];
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing.current) return;
    const pt = getPos(e);
    if (tool === "pen" || tool === "highlight" || tool === "eraser") {
      currentPts.current.push(pt);
      redraw({ type: tool, pts: currentPts.current, color, width: tool === "highlight" ? strokeWidth * 5 : strokeWidth });
    } else {
      const [x1, y1] = startPt.current;
      redraw({ type: tool as "rect" | "circle" | "arrow", x1, y1, x2: pt[0], y2: pt[1], color, width: strokeWidth });
    }
  }

  function handlePointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const pt = getPos(e);
    let newOp: DrawOp;
    if (tool === "pen" || tool === "highlight" || tool === "eraser") {
      currentPts.current.push(pt);
      newOp = { type: tool, pts: [...currentPts.current], color, width: tool === "highlight" ? strokeWidth * 5 : strokeWidth };
    } else {
      const [x1, y1] = startPt.current;
      newOp = { type: tool as "rect" | "circle" | "arrow", x1, y1, x2: pt[0], y2: pt[1], color, width: strokeWidth };
    }
    commitOp(newOp);
    currentPts.current = [];
  }

  function commitOp(op: DrawOp) {
    setAllOps(prev => {
      const next = prev.map((p, i) => i === currentPageRef.current ? [...p, op] : p);
      allOpsRef.current = next;
      return next;
    });
  }

  // Redraw when textEditor opens/closes/moves so edited op hides correctly
  useEffect(() => { redraw(); }, [textEditor, redraw]);

  // Focus the textarea whenever a new editor session opens
  useEffect(() => {
    if (textEditor) {
      const t = setTimeout(() => { textareaRef.current?.focus(); }, 0);
      return () => clearTimeout(t);
    }
  }, [textEditor]); // eslint-disable-line react-hooks/exhaustive-deps

  // Window capture-phase listener: commit when user clicks outside the text-editor div.
  // Capture fires BEFORE canvas onPointerDown, so we can set justCommitted first.
  useEffect(() => {
    if (!textEditor) return;
    function onCapture(e: PointerEvent) {
      if (textEditorDivRef.current && !textEditorDivRef.current.contains(e.target as Node)) {
        const editor = textEditorRef.current;
        if (editor) {
          commitTextEditor(editor);
          justCommitted.current = true;
        }
      }
    }
    window.addEventListener("pointerdown", onCapture, { capture: true });
    return () => window.removeEventListener("pointerdown", onCapture, { capture: true });
  }, [textEditor]); // eslint-disable-line react-hooks/exhaustive-deps

  function undo() {
    setAllOps(prev => {
      const next = prev.map((p, i) => i === currentPage ? p.slice(0, -1) : p);
      allOpsRef.current = next;
      return next;
    });
  }

  function clearPage() {
    setAllOps(prev => {
      const next = prev.map((p, i) => i === currentPage ? [] : p);
      allOpsRef.current = next;
      return next;
    });
  }

  async function save() {
    if (!file) return;
    setSaving(true);
    try {
      // Ensure all pages rendered before saving
      for (let i = 0; i < totalPages; i++) {
        if (!bgCanvases.current[i]) {
          bgCanvases.current[i] = await renderPage(pdfDocRef.current, i);
        }
      }

      const { PDFDocument } = await import("pdf-lib");
      const newDoc = await PDFDocument.create();

      for (let i = 0; i < totalPages; i++) {
        const bg = bgCanvases.current[i];
        if (!bg) continue;
        const comp = document.createElement("canvas");
        comp.width  = bg.width;
        comp.height = bg.height;
        const ctx   = comp.getContext("2d")!;
        ctx.drawImage(bg, 0, 0);
        for (const op of allOpsRef.current[i] ?? []) renderOp(ctx, op);

        const jpegData  = comp.toDataURL("image/jpeg", 0.92).split(",")[1];
        const jpegBytes = Uint8Array.from(atob(jpegData), c => c.charCodeAt(0));
        const img       = await newDoc.embedJpg(jpegBytes);
        const pw = bg.width / SCALE, ph = bg.height / SCALE;
        const page = newDoc.addPage([pw, ph]);
        page.drawImage(img, { x: 0, y: 0, width: pw, height: ph });
      }

      const bytes = await newDoc.save();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const url = URL.createObjectURL(new Blob([bytes as any], { type: "application/pdf" }));
      const a = document.createElement("a"); a.href = url; a.download = `edited-${file.name}`; a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to save PDF.");
    } finally {
      setSaving(false);
    }
  }

  const TOOLS: { val: Tool; icon: React.ElementType; label: string }[] = [
    { val: "pen",       icon: Pen,         label: "Pen" },
    { val: "highlight", icon: Highlighter,  label: "Highlight" },
    { val: "text",      icon: Type,        label: "Text" },
    { val: "rect",      icon: Square,      label: "Rectangle" },
    { val: "circle",    icon: Circle,      label: "Circle / Oval" },
    { val: "arrow",     icon: MoveRight,   label: "Arrow" },
    { val: "eraser",    icon: Eraser,      label: "Eraser (cover content)" },
  ];

  const totalOps = allOps.reduce((s, p) => s + (p?.length ?? 0), 0);

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type === "application/pdf") loadPdf(f); }}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-muted-foreground/30 rounded-2xl p-14 text-center cursor-pointer hover:border-muted-foreground/60 hover:bg-muted/20 transition-all"
        >
          <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="font-medium text-muted-foreground">Drop PDF here or click to upload</p>
          <p className="text-xs text-muted-foreground mt-1">Renders in your browser — files are never uploaded</p>
          <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFile} />
        </div>
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-xl border overflow-hidden">
              {TOOLS.map((t) => (
                <button key={t.val} onClick={() => setTool(t.val)} title={t.label}
                  className={`flex items-center justify-center p-2.5 transition-colors ${tool === t.val ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"}`}>
                  <t.icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            {/* Color */}
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
              title="Color" className="h-9 w-9 rounded-lg border cursor-pointer p-0.5" />

            {/* Size control */}
            {tool !== "text" ? (
              <div className="flex items-center gap-1.5">
                <Label className="text-xs text-muted-foreground shrink-0">Size</Label>
                <input type="range" min={1} max={24} value={strokeWidth}
                  onChange={(e) => setStrokeWidth(parseInt(e.target.value))} className="w-20" />
                <span className="text-xs text-muted-foreground w-4">{strokeWidth}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Label className="text-xs text-muted-foreground shrink-0">Font</Label>
                <input type="number" min={8} max={120} value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value) || 18)}
                  className="w-16 rounded-md border border-input bg-background px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            )}

            <div className="flex items-center gap-1 ml-auto">
              <button onClick={undo} disabled={!(allOps[currentPage]?.length)}
                title="Undo last stroke" className="p-2 rounded-lg border text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors">
                <Undo2 className="h-4 w-4" />
              </button>
              <button onClick={clearPage} disabled={!(allOps[currentPage]?.length)}
                title="Clear this page" className="p-2 rounded-lg border text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
              <button onClick={() => fileRef.current?.click()}
                className="px-3 py-1.5 rounded-lg border text-xs text-muted-foreground hover:bg-muted transition-colors">
                Change PDF
              </button>
              <button onClick={save} disabled={saving || totalOps === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity">
                {saving ? <><RefreshCw className="h-3 w-3 animate-spin" /> Saving…</> : <><Download className="h-3 w-3" /> Save PDF</>}
              </button>
            </div>
            <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFile} />
          </div>

          {/* Tool hint */}
          {tool === "eraser" && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              <strong>Eraser tip:</strong> Paint white over existing text to cover it, then switch to the Text tool to type new content on top. This is how you replace text without a server.
            </div>
          )}
          {tool === "text" && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800">
              Click anywhere to add text. Click existing text to edit it. Drag the <strong>purple pill</strong> above the box to move it. Resize from the bottom-right corner. Click outside to save.
            </div>
          )}

          {/* Canvas */}
          <div className="overflow-auto rounded-xl border bg-gray-200 max-h-165 flex justify-center">
            <div className="relative">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-xl">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading PDF…</span>
                </div>
              )}
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{
                  cursor: tool === "text" ? "text" : tool === "eraser" ? "cell" : "crosshair",
                  display: "block",
                  touchAction: "none",
                }}
              />
              {textEditor && (
                /*
                 * Flex-column wrapper: pill (20px) sits ABOVE the textarea.
                 * The wrapper top = panelY - 20 so the textarea top edge lands
                 * exactly at panelY — matching canvasY (textBaseline="top").
                 */
                <div
                  ref={textEditorDivRef}
                  style={{
                    position: "absolute",
                    left: textEditor.panelX,
                    top: textEditor.panelY - 20,
                    zIndex: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Drag pill — 20 px tall, sits in the gap above the textarea */}
                  <div
                    onMouseDown={handleDragHandleMouseDown}
                    style={{
                      height: 16,
                      marginBottom: 4,
                      minWidth: 44,
                      borderRadius: 8,
                      background: "rgba(99,102,241,0.9)",
                      cursor: "grab",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      userSelect: "none",
                      alignSelf: "center",
                    }}
                  >
                    {[0,1,2,3].map(i => (
                      <span key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "white" }} />
                    ))}
                  </div>

                  {/* Textarea — top edge at canvasY (= panelY) */}
                  <textarea
                    ref={textareaRef}
                    value={textEditor.text}
                    onChange={e => setTextEditor(prev => prev ? { ...prev, text: e.target.value } : null)}
                    onKeyDown={e => {
                      if (e.key === "Escape") {
                        textEditorRef.current = null;
                        setTextEditor(null);
                      }
                    }}
                    style={{
                      display: "block",
                      fontSize: `${textEditor.size}px`,
                      lineHeight: 1.3,
                      color: textEditor.color,
                      fontFamily: "Arial, sans-serif",
                      background: "rgba(255,255,255,0.06)",
                      border: "1.5px dashed rgba(99,102,241,0.8)",
                      outline: "none",
                      resize: "both",
                      overflow: "auto",
                      minWidth: 100,
                      minHeight: `${Math.round(textEditor.size * 1.8)}px`,
                      padding: "0 4px", // no vertical padding so top aligns with canvasY
                      boxSizing: "border-box",
                    }}
                    placeholder="Type here…"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Page navigation */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setCurrentPage((p) => Math.max(0, p - 1))} disabled={currentPage === 0}
                className="p-1.5 rounded-lg border text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-muted-foreground font-medium">Page {currentPage + 1} / {totalPages}</span>
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))} disabled={currentPage === totalPages - 1}
                className="p-1.5 rounded-lg border text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Watermark Tab ──────────────────────────────────────────────────────────────
function WatermarkTab() {
  const [file, setFile]               = useState<File | null>(null);
  const [text, setText]               = useState("CONFIDENTIAL");
  const [color, setColor]             = useState("#ef4444");
  const [opacity, setOpacity]         = useState(20);
  const [size, setSize]               = useState(60);
  const [angle, setAngle]             = useState(45);
  const [saving, setSaving]           = useState(false);
  const [previewing, setPreviewing]   = useState(false);
  const [previewPages, setPreviewPages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  function clearPreview() { setPreviewPages([]); }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) { setFile(f); clearPreview(); }
    e.target.value = "";
  }

  async function generatePreview() {
    if (!file || !text.trim()) return;
    setPreviewing(true);
    setPreviewPages([]);
    try {
      const pdfjsLib = await import("pdfjs-dist") as any;
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const pdfDoc   = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      const numPages = pdfDoc.numPages;

      const hex = color.replace("#", "");
      const r   = parseInt(hex.slice(0, 2), 16);
      const g   = parseInt(hex.slice(2, 4), 16);
      const b   = parseInt(hex.slice(4, 6), 16);

      // Render pages one by one and stream them into state as they finish
      for (let p = 1; p <= numPages; p++) {
        const page     = await pdfDoc.getPage(p);
        const viewport = page.getViewport({ scale: 1.5 });

        const offscreen   = document.createElement("canvas");
        offscreen.width   = viewport.width;
        offscreen.height  = viewport.height;
        const ctx = offscreen.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport }).promise;

        // Overlay watermark centred — matches pdf-lib positioning
        const scaledSize = size * 1.5;
        ctx.save();
        ctx.globalAlpha  = opacity / 100;
        ctx.fillStyle    = `rgb(${r},${g},${b})`;
        ctx.font         = `bold ${scaledSize}px Helvetica, Arial, sans-serif`;
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        ctx.translate(offscreen.width / 2, offscreen.height / 2);
        ctx.rotate((-angle * Math.PI) / 180); // pdf-lib CCW → negate for canvas CW
        ctx.fillText(text, 0, 0);
        ctx.restore();

        const dataUrl = offscreen.toDataURL("image/png");
        setPreviewPages(prev => [...prev, dataUrl]);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to generate preview.");
    } finally {
      setPreviewing(false);
    }
  }

  async function save() {
    if (!file || !text.trim()) return;
    setSaving(true);
    try {
      const { PDFDocument, rgb, degrees, StandardFonts } = await import("pdf-lib");
      const doc  = await PDFDocument.load(await file.arrayBuffer());
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const hex  = color.replace("#", "");
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;

      for (const page of doc.getPages()) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, size);
        page.drawText(text, {
          x: width / 2 - textWidth / 2,
          y: height / 2,
          size, font,
          color: rgb(r, g, b),
          opacity: opacity / 100,
          rotate: degrees(angle),
        });
      }

      const bytes = await doc.save();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const url = URL.createObjectURL(new Blob([bytes as any], { type: "application/pdf" }));
      const a = document.createElement("a"); a.href = url; a.download = `watermarked-${file.name}`; a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Failed to add watermark.");
    } finally {
      setSaving(false);
    }
  }

  const hasPreview = previewPages.length > 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6">

      {/* ── Left: controls ─────────────────────────────────────── */}
      <div className="lg:w-80 shrink-0 space-y-4">

        {/* File picker */}
        <div onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl text-center transition-all cursor-pointer ${!file ? "p-10 border-muted-foreground/30 hover:border-muted-foreground/60 hover:bg-muted/20" : "p-3 border-muted hover:bg-muted/10"}`}>
          {file ? (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium truncate">{file.name}</span>
              <span className="text-xs underline text-muted-foreground ml-2 shrink-0">Change</span>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="font-medium text-muted-foreground text-sm">Upload PDF to watermark</p>
            </>
          )}
          <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFile} />
        </div>

        {/* Settings */}
        <div className="space-y-3">
          <div>
            <Label className="text-xs mb-1 block">Watermark Text</Label>
            <input value={text} onChange={e => { setText(e.target.value); clearPreview(); }} placeholder="CONFIDENTIAL"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs mb-1 block">Color</Label>
              <input type="color" value={color} onChange={e => { setColor(e.target.value); clearPreview(); }}
                className="h-9 w-full rounded-md border border-input cursor-pointer" />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Font size ({size}pt)</Label>
              <input type="range" min={20} max={120} value={size} onChange={e => { setSize(parseInt(e.target.value)); clearPreview(); }} className="w-full mt-2" />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Opacity ({opacity}%)</Label>
              <input type="range" min={5} max={80} value={opacity} onChange={e => { setOpacity(parseInt(e.target.value)); clearPreview(); }} className="w-full mt-2" />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Angle ({angle}°)</Label>
              <input type="range" min={-90} max={90} value={angle} onChange={e => { setAngle(parseInt(e.target.value)); clearPreview(); }} className="w-full mt-2" />
            </div>
          </div>
        </div>

        {/* Preview button */}
        <button onClick={generatePreview} disabled={!file || !text.trim() || previewing}
          className="w-full py-2.5 rounded-xl border border-foreground/20 bg-muted text-foreground font-semibold text-sm hover:bg-muted/70 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
          {previewing
            ? <><RefreshCw className="h-4 w-4 animate-spin" /> Generating preview…</>
            : hasPreview
              ? <><RefreshCw className="h-4 w-4" /> Regenerate Preview</>
              : "Preview Watermark"}
        </button>

        {/* Download — only unlocked after preview */}
        {hasPreview && (
          <button onClick={save} disabled={saving || previewing}
            className="w-full py-2.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity">
            {saving ? <><RefreshCw className="h-4 w-4 animate-spin" /> Adding watermark…</> : <><Download className="h-4 w-4" /> Download Watermarked PDF</>}
          </button>
        )}
      </div>

      {/* ── Right: all-pages preview ────────────────────────────── */}
      {(hasPreview || previewing) && (
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground font-medium mb-3">
            {previewing && previewPages.length === 0
              ? "Rendering pages…"
              : `Preview — ${previewPages.length} page${previewPages.length !== 1 ? "s" : ""}${previewing ? " (loading…)" : ""}`}
          </p>
          <div className="overflow-y-auto max-h-170 space-y-3 pr-1 rounded-xl">
            {previewPages.map((url, i) => (
              <div key={i} className="rounded-xl border overflow-hidden shadow-sm">
                <div className="bg-muted/40 px-2 py-1 text-xs text-muted-foreground border-b">Page {i + 1}</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Page ${i + 1}`} className="w-full block" />
              </div>
            ))}
            {previewing && (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Rendering page {previewPages.length + 1}…
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
const TABS: { val: Tab; label: string; desc: string }[] = [
  { val: "draw",      label: "Draw & Edit",  desc: "Pen, shapes, text, eraser, arrow" },
  { val: "watermark", label: "Watermark",    desc: "Stamp text across all pages" },
];

export default function PdfEditorPage() {
  const [tab, setTab] = useState<Tab>("draw");
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="PDF Editor"
        description="Draw, annotate, add text, erase content and watermark — 100% in your browser"
        icon={FilePen}
        gradient="from-orange-600 to-red-700"
        breadcrumbs={[{ name: "Utility Tools" }, { name: "PDF Editor" }]}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-10 space-y-6">
        <div className="flex rounded-xl border overflow-hidden">
          {TABS.map(t => (
            <button key={t.val} onClick={() => setTab(t.val)}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-2 text-sm font-medium transition-colors ${tab === t.val ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"}`}>
              <span>{t.label}</span>
              <span className={`text-xs hidden sm:block mt-0.5 ${tab === t.val ? "text-background/70" : "text-muted-foreground/70"}`}>{t.desc}</span>
            </button>
          ))}
        </div>
        <Card>
          <CardContent className="pt-6">
            {tab === "draw"      && <DrawEditTab />}
            {tab === "watermark" && <WatermarkTab />}
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground text-center">
          Powered by <strong>PDF.js</strong> + <strong>pdf-lib</strong> — your files are processed entirely in your browser and never leave your device.
        </p>
      </div>
    </div>
  );
}
