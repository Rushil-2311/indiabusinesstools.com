"use client";
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import type { EditableTextRun } from "@/types/pdf-editor/EditableTextRun";
import type { EditOverride } from "@/types/pdf-editor/EditableTextRun";
import { RENDER_SCALE } from "@/hooks/pdf-editor/usePdfLoader";
import { buildFontCss } from "@/utils/pdf-editor/font";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pdfDoc:    any;
  pageIndex: number;
  zoom:      number;
  width:     number;
  height:    number;
  runs:      EditableTextRun[];
  edits:     Record<string, EditOverride>;
  activeId:  string | null;
}

export interface PdfCanvasHandle {
  redraw: () => void;
}

function fillTextWrapped(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const paragraphs = text.split("\n");
  let currentY     = y;
  for (const para of paragraphs) {
    const words = para.split(" ");
    let line    = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(test).width > maxWidth) {
        ctx.fillText(line, x, currentY);
        line     = word;
        currentY += lineHeight;
      } else {
        line = test;
      }
    }
    if (line) { ctx.fillText(line, x, currentY); currentY += lineHeight; }
  }
}

export const PdfCanvas = forwardRef<PdfCanvasHandle, Props>(function PdfCanvas(
  { pdfDoc, pageIndex, zoom, width, height, runs, edits, activeId },
  ref,
) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const renderIdRef = useRef(0);

  async function renderPage() {
    if (!pdfDoc || !canvasRef.current) return;
    const renderId = ++renderIdRef.current;

    const page     = await pdfDoc.getPage(pageIndex + 1);
    const viewport = page.getViewport({ scale: RENDER_SCALE * zoom, rotation: 0 });
    const canvas   = canvasRef.current;
    if (!canvas) return;
    canvas.width  = viewport.width;
    canvas.height = viewport.height;
    const ctx     = canvas.getContext("2d")!;

    await page.render({ canvasContext: ctx, viewport }).promise;
    if (renderIdRef.current !== renderId) return; // stale

    for (const run of runs) {
      const override = edits[run.id];
      if (!override) continue;

      const origX    = run.x      * zoom;
      const origY    = run.y      * zoom;
      const w        = run.width  * zoom;
      const h        = run.height * zoom;
      const ascentPx = (run.ascent ?? run.fontSize * 0.82) * zoom;

      // Erase the original PDF text — white cover at original text bounds only.
      // Not extended for wrapping so it never bleeds onto adjacent text runs.
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(origX - 1, origY - ascentPx - 1, w + 2, h + 2);

      // Active run: the transparent contenteditable shows the live text.
      // Drawing here too would produce double-text.
      if (run.id === activeId) continue;

      // Inactive committed run: redraw the saved text on the canvas.
      // Using canvas (not an overlay div) avoids the async race where the
      // overlay div appears instantly while the canvas re-renders asynchronously,
      // which caused original + committed text to be visible simultaneously.
      const drawX      = (override.x ?? run.x) * zoom;
      const drawY      = (override.y ?? run.y) * zoom;
      const fontSize   = (override.fontSize  ?? run.fontSize)  * zoom;
      const fontFamily = override.fontFamily ?? run.fontFamily;
      const fontWeight = override.fontWeight ?? run.fontWeight;
      const fontStyle  = override.fontStyle  ?? run.fontStyle;
      const color      = override.color      ?? run.color;

      ctx.font         = buildFontCss({ fontFamily, fontWeight, fontStyle, fontSize });
      ctx.fillStyle    = color || "#000000";
      ctx.textBaseline = "alphabetic";

      // isWrapped runs are merged paragraphs — always word-wrap at the stored
      // column width.  override.w takes precedence when the user resized the box.
      const useWrap = override.w != null || !!run.isWrapped;
      const wrapW   = override.w != null ? override.w * zoom : run.width * zoom;
      if (useWrap) {
        fillTextWrapped(ctx, override.text, drawX, drawY, wrapW, fontSize * 1.35);
      } else {
        ctx.fillText(override.text, drawX, drawY);
      }
    }
  }

  useImperativeHandle(ref, () => ({ redraw: renderPage }));

  useEffect(() => {
    renderPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfDoc, pageIndex, zoom, edits, activeId]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset:    0,
        width:    "100%",
        height:   "100%",
        display:  "block",
      }}
    />
  );
});
