// PDF export using canvas-to-image approach.
//
// Strategy:
//   1. For each page, render the original PDF to an offscreen canvas using PDF.js
//      at high resolution (RENDER_SCALE × EXPORT_ZOOM).
//   2. Apply edits on that canvas: draw a white rectangle over the original text
//      position, then draw the committed text (with word-wrap if width was set).
//   3. Convert the canvas to JPEG.
//   4. Create a brand-new PDF with pdf-lib containing one image page per original
//      page (sized to match the original page dimensions in points).
//   5. Download the result.
//
// Why this approach?
//   pdf-lib's drawText/drawRectangle adds content AFTER the original PDF content
//   stream. Many viewers render all text objects at the end regardless of drawing
//   order, so the original text bleeds through the white cover. The canvas approach
//   produces a flat raster — original text is painted pixels, white cover is opaque
//   pixels on top, new text pixels on top of that. No layering ambiguity possible.

import type { EditableTextRun, EditOverride } from "@/types/pdf-editor/EditableTextRun";
import { buildFontCss } from "@/utils/pdf-editor/font";

const RENDER_SCALE = 1.5;
const EXPORT_ZOOM  = 2;     // higher → sharper export; coords scale by this factor

export async function exportEditedPdf(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pdfJsDoc:  any,                            // PDF.js PDFDocumentProxy
  runs:      EditableTextRun[][],             // [pageIndex][runIndex]
  edits:     Record<string, EditOverride>,
  fileName:  string,
): Promise<void> {
  // Wait for any web fonts (Google Fonts etc.) to be ready before drawing text.
  await document.fonts.ready;

  const { PDFDocument } = await import("pdf-lib");
  const newPdf = await PDFDocument.create();

  for (let pi = 0; pi < runs.length; pi++) {
    const page = await pdfJsDoc.getPage(pi + 1);

    // scale=1 → viewport dimensions equal PDF page size in points
    const baseVp  = page.getViewport({ scale: 1.0, rotation: 0 });
    const pdfW    = baseVp.width;
    const pdfH    = baseVp.height;

    // Render at RENDER_SCALE * EXPORT_ZOOM for a high-quality raster.
    const viewport = page.getViewport({ scale: RENDER_SCALE * EXPORT_ZOOM, rotation: 0 });
    const canvas   = document.createElement("canvas");
    canvas.width   = viewport.width;
    canvas.height  = viewport.height;
    const ctx      = canvas.getContext("2d")!;

    await page.render({ canvasContext: ctx, viewport }).promise;

    // Apply edits — same coordinate logic as PdfCanvas.tsx with zoom = EXPORT_ZOOM.
    const pageRuns = runs[pi] ?? [];
    for (const run of pageRuns) {
      const override = edits[run.id];
      if (!override) continue;

      const zoom     = EXPORT_ZOOM;
      const origX    = run.x      * zoom;
      const origY    = run.y      * zoom;
      const origW    = run.width  * zoom;
      const origH    = run.height * zoom;
      const ascentPx = (run.ascent ?? run.fontSize * 0.82) * zoom;

      // Erase original text — white cover at ORIGINAL bounds only (never extended
      // for wrapping so it never bleeds onto adjacent runs).
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(origX - 1, origY - ascentPx - 1, origW + 2, origH + 2);

      // Draw committed text at the saved baseline (may differ if user dragged).
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

      // isWrapped runs are merged paragraphs that must always be word-wrapped.
      // override.w takes precedence; fallback to the stored paragraph column width.
      const useWrap = override.w != null || !!run.isWrapped;
      const wrapW   = override.w != null ? override.w * zoom : run.width * zoom;
      if (useWrap) {
        fillTextWrapped(ctx, override.text, drawX, drawY, wrapW, fontSize * 1.35);
      } else {
        ctx.fillText(override.text, drawX, drawY);
      }
    }

    // Convert page to JPEG and embed in the new PDF.
    const jpegBytes = dataUrlToBytes(canvas.toDataURL("image/jpeg", 0.92));

    const pdfPage = newPdf.addPage([pdfW, pdfH]);
    const img     = await newPdf.embedJpg(jpegBytes);
    pdfPage.drawImage(img, { x: 0, y: 0, width: pdfW, height: pdfH });
  }

  const bytes = await newPdf.save();
  const blob  = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const url   = URL.createObjectURL(blob);
  const a     = document.createElement("a");
  a.href      = url;
  a.download  = fileName.replace(/\.pdf$/i, "-edited.pdf");
  a.click();
  URL.revokeObjectURL(url);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1];
  const binary = atob(base64);
  const out    = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

function fillTextWrapped(
  ctx:        CanvasRenderingContext2D,
  text:       string,
  x:          number,
  y:          number,
  maxWidth:   number,
  lineHeight: number,
): void {
  // Each \n in the text content starts a new paragraph; within paragraphs words
  // wrap automatically when the measured line width would exceed maxWidth.
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
    if (line) {
      ctx.fillText(line, x, currentY);
      currentY += lineHeight;
    }
  }
}
