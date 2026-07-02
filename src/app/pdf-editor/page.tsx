"use client";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  LayoutGrid,
  Undo2,
  Type,
  FilePen,
  PenLine,
  Pencil,
  Link2,
  StickyNote,
  Printer,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Layers,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RefreshCw,
  ChevronDown,
  Image as ImageIcon,
  Highlighter,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  PdfCanvas,
  type PdfCanvasHandle,
} from "@/components/pdf-editor/PdfCanvas";
import { OverlayLayer } from "@/components/pdf-editor/OverlayLayer";
import { usePdfLoader, RENDER_SCALE } from "@/hooks/pdf-editor/usePdfLoader";
import { useEditState } from "@/hooks/pdf-editor/useEditState";
import { exportEditedPdf } from "@/utils/pdf-editor/export";
import {
  SYSTEM_FONTS,
  GOOGLE_FONTS,
  buildGoogleFontsUrl,
} from "@/utils/pdf-editor/font";
import type { EditableTextRun } from "@/types/pdf-editor/EditableTextRun";

function extractFontDisplayName(fontFamily: string): string {
  const EMBEDDED_RE = /^[a-z]_d\d+_f\d+$/i;
  const GENERIC = new Set([
    "sans-serif",
    "serif",
    "monospace",
    "cursive",
    "fantasy",
    "system-ui",
  ]);
  const parts = fontFamily.split(",").map((s) => s.trim().replace(/['"]/g, ""));
  for (const p of parts) {
    if (!EMBEDDED_RE.test(p) && !GENERIC.has(p.toLowerCase())) return p;
  }
  return parts[0] || fontFamily;
}

// ── Toolbar button ─────────────────────────────────────────────────────────────
function ToolBtn({
  icon,
  label,
  active,
  onClick,
  disabled,
  chevron,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  chevron?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center gap-[3px] px-3 py-2 rounded-md text-[10px] font-medium transition-all min-w-[48px] shrink-0 ${
        active
          ? "bg-rose-50 text-rose-600"
          : disabled
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      }`}
    >
      <span
        className={`flex items-center justify-center [&>svg]:h-[20px] [&>svg]:w-[20px] ${active ? "text-rose-500" : ""}`}
      >
        {icon}
      </span>
      <span className="flex items-center gap-0.5 whitespace-nowrap leading-none">
        {label}
        {chevron && <ChevronDown className="h-2.5 w-2.5 opacity-60" />}
      </span>
    </button>
  );
}

const VSep = () => (
  <div className="w-px bg-gray-200 self-stretch my-1.5 mx-0.5 shrink-0" />
);

// ── Main editor component ──────────────────────────────────────────────────────
function EditContentTab() {
  type ActiveTool = "select" | "edit-text";

  const [activeTool, setActiveTool] = useState<ActiveTool>("select");
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1.0);
  const [isDragging, setIsDragging] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [customSizes, setCustomSizes] = useState<
    Record<string, { w: number; h: number }>
  >({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const canvasRef = useRef<PdfCanvasHandle>(null);

  const { state: pdf, pdfDocRef, loadFile, reset: resetPdf } = usePdfLoader();
  const {
    edits,
    editsRef,
    activeId,
    hoveredId,
    setHoveredId,
    activeOverride,
    activateRun,
    updateActive,
    commitRun,
    deactivate,
    reset: resetEdits,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useEditState();

  const currentData = pdf.pages[currentPage];
  const scaledW = currentData ? Math.round(currentData.width * zoom) : 794;
  const scaledH = currentData ? Math.round(currentData.height * zoom) : 1122;

  useEffect(() => {
    if (pdf.status !== "ready") return;
    thumbRefs.current[currentPage]?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [currentPage, pdf.status]);

  // PdfCanvas re-renders automatically when edits or activeId change (via its own useEffect).
  // No manual redraw needed here.

  useEffect(() => {
    const id = "pdf-editor-gfonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = buildGoogleFontsUrl();
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || activeId) return;
      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (e.key === "y" || (e.key === "z" && e.shiftKey)) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeId, undo, redo]);

  function handleFile(file: File) {
    resetEdits();
    setCustomSizes({});
    setCurrentPage(0);
    setActiveTool("select");
    loadFile(file);
  }

  const handleExport = useCallback(async () => {
    if (!pdfDocRef.current) return;
    setIsExporting(true);
    try {
      await exportEditedPdf(
        pdfDocRef.current,
        pdf.pages.map((p) => p.runs),
        editsRef.current,
        pdf.fileName,
      );
    } catch (err) {
      console.error("[export]", err);
    } finally {
      setIsExporting(false);
    }
  }, [pdfDocRef, pdf.pages, editsRef, pdf.fileName]);

  const handleActivate = useCallback(
    (run: EditableTextRun) => {
      activateRun(run.id, {
        text: run.originalText,
        fontFamily: run.fontFamily,
        fontWeight: run.fontWeight,
        fontStyle: run.fontStyle,
        fontSize: run.fontSize,
        color: run.color || "#000000",
      });
    },
    [activateRun],
  );

  // ── Loading ────────────────────────────────────────────────────────────────
  if (pdf.status === "loading" || isExporting)
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4 bg-white">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="font-semibold text-gray-700">
          {isExporting ? "Exporting PDF…" : "Loading PDF…"}
        </p>
      </div>
    );

  // ── Upload view ────────────────────────────────────────────────────────────
  if (pdf.status !== "ready")
    return (
      <>
        <PageHeader
          title="PDF Editor"
          description="Edit text directly on any PDF — preserves original layout and fonts"
          icon={FilePen}
          gradient="from-orange-600 to-red-700"
          breadcrumbs={[{ name: "Utility Tools" }, { name: "PDF Editor" }]}
        />
        <div className="flex-1 flex items-start justify-center py-8 px-4">
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Edit your PDF
              </h2>
              <p className="text-gray-600 mb-7">
                Upload a PDF file to start editing text directly on the page.
              </p>
              {[
                "Edit text directly on any PDF page",
                "Preserve original fonts and layout",
                "Download your edited PDF instantly",
              ].map((f) => (
                <div key={f} className="flex items-center gap-3 mb-3.5">
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">{f}</span>
                </div>
              ))}
            </div>
            <div>
              {pdf.error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {pdf.error}
                </div>
              )}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const f = e.dataTransfer.files[0];
                  if (f) handleFile(f);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl py-12 px-10 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-orange-400 hover:bg-orange-50/20"
                }`}
              >
                <div className="flex justify-center mb-6">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 bg-orange-100 rounded-full" />
                    <svg
                      className="absolute inset-0 w-full h-full p-5 text-orange-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-700 font-semibold text-base mb-1">
                  Drop PDF here
                </p>
                <p className="text-gray-400 text-sm mb-6">or</p>
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-2.5 rounded-lg transition-colors text-sm"
                >
                  Upload PDF
                </button>
                <p className="text-xs text-gray-400 mt-5">Max 20 MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                  e.target.value = "";
                }}
              />
            </div>
          </div>
        </div>
      </>
    );

  // ── Editing view ───────────────────────────────────────────────────────────
  const editCount = Object.keys(edits).length;
  const fontSizePt =
    activeOverride?.fontSize != null
      ? Math.round(activeOverride.fontSize / RENDER_SCALE)
      : 12;

  const currentFamily = activeOverride?.fontFamily ?? "";
  const matchedSystem = SYSTEM_FONTS.find((f) => currentFamily === f.value);
  const matchedGoogle = GOOGLE_FONTS.find((f) => currentFamily === f.value);
  const matchedWebFont = matchedSystem ?? matchedGoogle ?? null;
  const displayName = extractFontDisplayName(currentFamily);
  const isEmbedded = !matchedWebFont && currentFamily !== "";

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
      {/* ── Row 1: Main toolbar ── */}
      <div
        className="bg-white border-b border-gray-200 flex items-stretch px-1 shrink-0"
        style={{ minHeight: 56 }}
      >
        {/* Left tools */}
        <div className="flex items-stretch gap-0">
          <ToolBtn icon={<LayoutGrid />} label="Thumbnails" chevron disabled />
          <VSep />
          <ToolBtn
            icon={<Undo2 />}
            label="Undo"
            disabled={!canUndo}
            onClick={undo}
          />
          <ToolBtn
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 7v6h-6" />
                <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
              </svg>
            }
            label="Redo"
            disabled={!canRedo}
            onClick={redo}
          />
          <VSep />
          <ToolBtn icon={<Type />} label="Add text" disabled />
          <ToolBtn
            icon={<FilePen />}
            label="Edit text"
            active={activeTool === "edit-text"}
            onClick={() => {
              setActiveTool((t) =>
                t === "edit-text" ? "select" : "edit-text",
              );
              deactivate();
            }}
          />
          <VSep />
          <ToolBtn icon={<PenLine />} label="Sign" disabled />
          <ToolBtn icon={<Pencil />} label="Draw" disabled />
          <ToolBtn
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            }
            label="Line"
            chevron
            disabled
          />
          <VSep />
          <ToolBtn icon={<Highlighter />} label="Highlight" disabled />
          <ToolBtn icon={<ImageIcon />} label="Image" disabled />
          <ToolBtn
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            }
            label="Stamp"
            disabled
          />
          <ToolBtn icon={<Link2 />} label="Link" disabled />
          <ToolBtn icon={<StickyNote />} label="Note" disabled />
        </div>

        {/* Right tools */}
        <div className="ml-auto flex items-stretch gap-0">
          {editCount > 0 && (
            <div className="self-center px-3 text-xs text-blue-600 font-semibold whitespace-nowrap">
              {editCount} edit{editCount !== 1 ? "s" : ""}
            </div>
          )}
          <VSep />
          <ToolBtn icon={<Layers />} label="Pages" disabled />
          <ToolBtn icon={<Printer />} label="Print" disabled />
          <ToolBtn icon={<Search />} label="Search" disabled />
          <VSep />
          <div className="flex items-center gap-2 px-2">
            <button
              onClick={() => {
                resetPdf();
                resetEdits();
                setCustomSizes({});
                setCurrentPage(0);
                setActiveTool("select");
              }}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-2 py-1.5 rounded hover:bg-gray-100 transition-colors font-medium"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Back
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors shadow-sm"
            >
              <Download className="h-3.5 w-3.5" /> Done
            </button>
          </div>
        </div>
      </div>

      {/* ── Row 2: Formatting toolbar (only in edit-text mode) ── */}
      {activeTool === "edit-text" && activeOverride && activeId && (
        <div className="bg-white border-b border-gray-200 flex items-center px-3 py-1.5 gap-1.5 shrink-0 overflow-x-auto">
          {/* Text color */}
          <div
            className="flex flex-col items-center gap-0.5"
            title="Text color"
          >
            <span
              className="text-sm font-bold leading-none"
              style={{ color: activeOverride.color ?? "#000000" }}
            >
              A
            </span>
            <input
              type="color"
              value={activeOverride.color ?? "#000000"}
              onChange={(e) => updateActive({ color: e.target.value })}
              className="h-3 w-8 rounded-sm border-0 cursor-pointer p-0 bg-transparent"
              style={{ WebkitAppearance: "none", MozAppearance: "none" }}
            />
          </div>

          <div className="w-px h-6 bg-gray-200 mx-1 shrink-0" />

          {/* Font family */}
          <select
            value={matchedWebFont ? matchedWebFont.value : currentFamily}
            onChange={(e) => updateActive({ fontFamily: e.target.value })}
            className="text-xs border border-gray-300 rounded px-2 h-7 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 max-w-[180px]"
            style={{ minWidth: 140 }}
          >
            {isEmbedded && (
              <option value={currentFamily}>{displayName} (PDF)</option>
            )}
            <optgroup label="System Fonts">
              {SYSTEM_FONTS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Google Fonts">
              {GOOGLE_FONTS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </optgroup>
          </select>

          {/* Font size */}
          <div className="flex items-center border border-gray-300 rounded h-7 overflow-hidden">
            <input
              type="number"
              min={6}
              max={200}
              value={fontSizePt}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                if (v >= 6 && v <= 200)
                  updateActive({ fontSize: v * RENDER_SCALE });
              }}
              className="w-10 text-xs text-center border-none outline-none px-1 h-full"
            />
            <div className="flex flex-col border-l border-gray-300">
              <button
                className="px-1 h-3.5 flex items-center justify-center hover:bg-gray-100 text-gray-500 text-[8px] leading-none"
                onMouseDown={(e) => {
                  e.preventDefault();
                  updateActive({
                    fontSize: Math.min(200, fontSizePt + 1) * RENDER_SCALE,
                  });
                }}
              >
                ▲
              </button>
              <button
                className="px-1 h-3.5 flex items-center justify-center hover:bg-gray-100 text-gray-500 border-t border-gray-200 text-[8px] leading-none"
                onMouseDown={(e) => {
                  e.preventDefault();
                  updateActive({
                    fontSize: Math.max(6, fontSizePt - 1) * RENDER_SCALE,
                  });
                }}
              >
                ▼
              </button>
            </div>
          </div>

          <div className="w-px h-6 bg-gray-200 mx-1 shrink-0" />

          {/* Bold */}
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              updateActive({
                fontWeight:
                  activeOverride.fontWeight === "bold" ? "normal" : "bold",
              });
            }}
            className={`h-7 w-7 rounded text-sm font-bold border transition-colors flex items-center justify-center ${
              activeOverride.fontWeight === "bold"
                ? "bg-blue-100 text-blue-700 border-blue-300"
                : "border-gray-300 hover:bg-gray-100 text-gray-700"
            }`}
          >
            B
          </button>

          {/* Italic */}
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              updateActive({
                fontStyle:
                  activeOverride.fontStyle === "italic" ? "normal" : "italic",
              });
            }}
            className={`h-7 w-7 rounded text-sm italic border transition-colors flex items-center justify-center ${
              activeOverride.fontStyle === "italic"
                ? "bg-blue-100 text-blue-700 border-blue-300"
                : "border-gray-300 hover:bg-gray-100 text-gray-700"
            }`}
          >
            I
          </button>

          <div className="w-px h-6 bg-gray-200 mx-1 shrink-0" />

          {/* Text alignment */}
          {(["left", "center", "right"] as const).map((align) => {
            const Icon =
              align === "left"
                ? AlignLeft
                : align === "center"
                  ? AlignCenter
                  : AlignRight;
            const isActive = (activeOverride.textAlign ?? "left") === align;
            return (
              <button
                key={align}
                onMouseDown={(e) => {
                  e.preventDefault();
                  updateActive({ textAlign: align });
                }}
                className={`h-7 w-7 rounded border transition-colors flex items-center justify-center ${
                  isActive
                    ? "bg-blue-100 text-blue-700 border-blue-300"
                    : "border-gray-300 hover:bg-gray-100 text-gray-600"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            );
          })}
        </div>
      )}

      {/* ── Body: sidebar + canvas ── */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Thumbnail sidebar */}
        <div className="w-[130px] shrink-0 bg-gray-100 border-r border-gray-200 overflow-y-auto flex flex-col gap-3 p-2">
          {pdf.pages.map((pg, i) => (
            <div
              key={i}
              ref={(el) => {
                thumbRefs.current[i] = el;
              }}
              onClick={() => setCurrentPage(i)}
              className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                currentPage === i
                  ? "border-red-500 shadow-md"
                  : "border-transparent hover:border-gray-400"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pg.thumb}
                alt={`Page ${i + 1}`}
                className="w-full block"
              />
              <div className="flex justify-center py-1 bg-white">
                <span
                  className={`rounded-full text-[10px] font-bold px-2 py-0.5 leading-none ${
                    currentPage === i
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Canvas scroll area */}
        <div
          className="flex-1 overflow-auto bg-[#7a7a7a]"
          onClick={() => {
            if (activeId) deactivate();
          }}
        >
          {currentData && (
            <div className="py-4 px-4" style={{ minWidth: scaledW + 32 }}>
              {/* White PDF page */}
              <div
                className="relative shadow-2xl bg-white mx-auto"
                style={{ width: scaledW, height: scaledH }}
                onClick={() => {
                  if (activeId) deactivate();
                }}
              >
                <PdfCanvas
                  ref={canvasRef}
                  pdfDoc={pdfDocRef.current}
                  pageIndex={currentPage}
                  zoom={zoom}
                  width={scaledW}
                  height={scaledH}
                  runs={currentData.runs}
                  edits={edits}
                  activeId={activeId}
                />

                {activeTool === "edit-text" && (
                  <OverlayLayer
                    runs={currentData.runs}
                    zoom={zoom}
                    width={scaledW}
                    height={scaledH}
                    activeId={activeId}
                    hoveredId={hoveredId}
                    edits={edits}
                    customSizes={customSizes}
                    onActivate={handleActivate}
                    onMouseEnter={setHoveredId}
                    onMouseLeave={() => setHoveredId(null)}
                    onCommit={(id, text) => {
                      // Pass current box width (RENDER_SCALE units) so canvas
                      // can wrap the committed text at the same width.
                      const w = customSizes[id]?.w;
                      commitRun(id, text, w != null ? w / zoom : undefined);
                    }}
                    onResize={(id, w, h) =>
                      setCustomSizes((prev) => ({ ...prev, [id]: { w, h } }))
                    }
                    onMove={(_id, x, y) => updateActive({ x, y })}
                  />
                )}
              </div>
            </div>
          )}

          {/* Floating page + zoom bar */}
          <div className="sticky bottom-5 flex justify-center pointer-events-none z-30 pb-1">
            <div className="pointer-events-auto inline-flex items-center gap-1 bg-gray-800/95 text-white rounded-full px-4 py-2 shadow-2xl backdrop-blur-sm">
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="p-1 rounded-full hover:bg-gray-700 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium whitespace-nowrap px-1">
                Page: {currentPage + 1} / {pdf.numPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(pdf.numPages - 1, p + 1))
                }
                disabled={currentPage === pdf.numPages - 1}
                className="p-1 rounded-full hover:bg-gray-700 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="w-px h-5 bg-gray-600 mx-1" />
              <button
                onClick={() =>
                  setZoom((z) =>
                    Math.max(0.25, parseFloat((z - 0.25).toFixed(2))),
                  )
                }
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-700 text-base font-bold transition-colors"
              >
                −
              </button>
              <span className="text-xs w-12 text-center font-medium">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() =>
                  setZoom((z) => Math.min(3, parseFloat((z + 0.25).toFixed(2))))
                }
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-700 text-base font-bold transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PdfEditorPage() {
  return (
    // Height = full viewport minus the sticky 64px site header (h-16).
    // overflow-hidden prevents the outer page from growing a scrollbar —
    // all scrolling happens inside the canvas area (overflow-auto).
    <div
      className="flex flex-col bg-white overflow-hidden"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <EditContentTab />
    </div>
  );
}
