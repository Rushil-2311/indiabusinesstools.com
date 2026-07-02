/**
 * TextExtractor — extracts EditableTextRun[] from a PDF page.
 *
 * Replaces the inline extraction in usePdfLoader.  Key improvements over
 * the previous approach:
 *
 *   1. Uses textContent.styles[fontName].fontFamily directly — this is the
 *      CSS font-family that PDF.js computed (possibly an embedded @font-face
 *      name like "g_d0_f1").  The previous code ignored styles entirely and
 *      fell back to a name-based heuristic that always returned system fonts.
 *
 *   2. Uses textContent.styles[fontName].ascent / .descent for per-font
 *      metrics instead of hardcoded 0.82 / 0.25.  This makes overlay
 *      positioning match the canvas rendering for fonts with unusual metrics.
 *
 *   3. Uses GlyphMapper to detect and, where possible, fix characters that
 *      PDF.js could not map to standard Unicode (e.g. Symbol font bullets).
 */

import type { EditableTextRun } from "@/types/pdf-editor/EditableTextRun";
import type { Matrix6 } from "@/utils/pdf-editor/matrix";
import { FontManager } from "./FontManager";
import { resolveDisplayText } from "./GlyphMapper";
import { classifySymbol } from "./SymbolClassifier";

export { FontManager };

export const RENDER_SCALE = 1.5;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PdfJs = any;

export interface ExtractedPage {
  runs:        EditableTextRun[];
  fontManager: FontManager;
}

/**
 * Extract all text runs from one PDF page.
 *
 * @param page        PDFPageProxy (from pdfjs-dist)
 * @param pdfjs       The imported pdfjs-dist module (for Util.transform)
 * @param pageIndex   0-based page index
 * @param viewport    The full-scale viewport (RENDER_SCALE)
 */
export async function extractTextRuns(
  page:       PdfJs,
  pdfjs:      PdfJs,
  pageIndex:  number,
  viewport:   PdfJs,
): Promise<ExtractedPage> {
  const textContent = await page.getTextContent({ includeMarkedContent: false });
  const { items, styles } = textContent as {
    items:  any[];
    styles: Record<string, any>;
  };

  // Build a raw-font-name lookup: PDF resource name → raw font name string
  // so FontManager can fall back to heuristics when styles.fontFamily is generic.
  const rawFontNames: Record<string, string> = {};
  for (const raw of items) {
    if (typeof raw.str === "string" && raw.fontName) {
      rawFontNames[raw.fontName] = rawFontNames[raw.fontName] ?? raw.fontName;
    }
  }

  const fontManager = new FontManager();
  fontManager.registerStyles(styles ?? {}, rawFontNames);

  const runs: EditableTextRun[] = [];

  for (let j = 0; j < items.length; j++) {
    const raw = items[j];

    // MarkedContent markers have a `type` field; skip them.
    if (raw.type !== undefined) continue;
    if (raw.str === undefined || raw.str === null) continue;
    if (typeof raw.str !== "string") continue;
    // Skip truly empty strings but keep whitespace-only (they carry spacing info).
    if (raw.str === "") continue;

    // ── Transform to canvas-pixel space ──────────────────────────────────────
    const tx = pdfjs.Util.transform(viewport.transform, raw.transform) as Matrix6;

    // tx[3] is the effective font size (y-scale, negative when page is upright).
    const fontSize = Math.abs(tx[3]);
    if (fontSize < 1 || fontSize > 500) continue;

    const x = tx[4]; // baseline x in canvas-px at RENDER_SCALE
    const y = tx[5]; // baseline y in canvas-px at RENDER_SCALE (Y from top)

    // ── Font info from styles ─────────────────────────────────────────────────
    const fontName = raw.fontName ?? "";
    const resolved = fontManager.getFont(fontName);

    const ascentPx  = resolved.ascent  * fontSize;
    const descentPx = resolved.descent * fontSize;
    const height    = ascentPx + descentPx;

    // ── Width ─────────────────────────────────────────────────────────────────
    // raw.width is in PDF user-space; multiply by RENDER_SCALE to get canvas-px.
    // Fallback: estimate from character count × average glyph width.
    const width = raw.width > 0
      ? raw.width * RENDER_SCALE
      : Math.max(fontSize * (raw.str.length || 1) * 0.55, 4);

    // ── Rotation ──────────────────────────────────────────────────────────────
    const rotation = (Math.atan2(tx[1], tx[0]) * 180) / Math.PI;

    // ── Display text ──────────────────────────────────────────────────────────
    // Preserve private-use chars as-is (they render correctly with the
    // embedded font). Only attempt Unicode recovery for truly unmapped glyphs
    // in known symbol fonts (Symbol encoding) — see GlyphMapper for details.
    const displayText = resolveDisplayText(raw.str, fontName);

    // ── Symbol classification ─────────────────────────────────────────────────
    // Tag single-character symbol runs (bullets, checkboxes, dingbats) so
    // groupLines can isolate them from adjacent text runs.
    const symbolKind = classifySymbol(displayText, fontName);

    // ── CSS font-family ───────────────────────────────────────────────────────
    // raw.fontName from PDF.js getTextContent() equals font.loadedName, which is
    // the EXACT CSS font-family name that PDF.js injected as an @font-face rule
    // during page.render() (e.g. "g_d0_f1").  Putting it first in the CSS stack
    // means the browser uses the embedded font — same glyphs, same metrics as
    // the canvas.  resolved.fontFamily is the system-font fallback (e.g. "Calibri,
    // sans-serif") derived from tc.styles.fontFamily.
    const systemFallback = resolved.fontFamily;
    const fontFamily = fontName
      ? (systemFallback ? `${fontName}, ${systemFallback}` : fontName)
      : (systemFallback || "sans-serif");

    // ── Pre-split merged bullet runs ─────────────────────────────────────────
    // PDF text items sometimes bundle "• Aenean congue..." as a single item.
    // When that happens, isMarkerRun in groupLines can't isolate the bullet
    // (the combined text is too long to match the bullet regex).  Split the
    // item here into a marker run + a text run so the edit overlay starts at
    // the correct indented x position, not at the bullet's x position.
    //
    // Only fires when classifySymbol returned 'text' (i.e. the item was NOT
    // already classified as a standalone symbol), and the text visibly starts
    // with a bullet/dash marker followed by whitespace and then real content.
    const LEADING_MARKER_RE = /^([•·–—○◦▪▫►▶→])(\s+)/;
    const markerMatch = symbolKind === 'text' ? LEADING_MARKER_RE.exec(displayText) : null;
    const textAfterMarker = markerMatch
      ? displayText.slice(markerMatch[1].length + markerMatch[2].length)
      : null;

    if (markerMatch && textAfterMarker && textAfterMarker.trim().length > 1) {
      const prefixLen    = markerMatch[1].length + markerMatch[2].length;
      const totalLen     = Math.max(raw.str.length, 1);
      // Cap at 25% so a narrow bullet never steals most of the line width.
      const markerFrac   = Math.min(prefixLen / totalLen, 0.25);
      const markerWidthPx = width * markerFrac;
      const textX        = x + markerWidthPx;

      const sharedFields = {
        page:        pageIndex,
        transform:   tx,
        y,
        height,
        ascent:      ascentPx,
        fontSize,
        rotation,
        fontName,
        fontFamily,
        fontWeight:  resolved.fontWeight,
        fontStyle:   resolved.fontStyle,
        color:       "#000000",
        direction:   (raw.dir ?? "ltr") as string,
        charSpacing: (raw.charSpacing ?? 0) * RENDER_SCALE,
        wordSpacing: 0,
      };

      // Marker run — isolated, never editable.
      runs.push({
        ...sharedFields,
        id:           `p${pageIndex}_t${j}_m`,
        text:         markerMatch[1],
        originalText: markerMatch[1],
        x,
        width:        markerWidthPx,
        symbolKind:   'bullet-round' as const,
      });

      // Text run — starts at the indented position.
      runs.push({
        ...sharedFields,
        id:           `p${pageIndex}_t${j}_t`,
        text:         textAfterMarker,
        originalText: textAfterMarker,
        x:            textX,
        width:        Math.max(width - markerWidthPx, fontSize * 2),
      });

      continue; // skip the normal single-item push below
    }

    runs.push({
      id:           `p${pageIndex}_t${j}`,
      page:         pageIndex,
      text:         displayText,
      originalText: displayText,
      transform:    tx,
      x, y,
      width,
      height,
      ascent:       ascentPx,
      fontSize,
      rotation,
      fontName,
      fontFamily,
      fontWeight:   resolved.fontWeight,
      fontStyle:    resolved.fontStyle,
      color:        "#000000",
      direction:    raw.dir ?? "ltr",
      charSpacing:  (raw.charSpacing ?? 0) * RENDER_SCALE,
      wordSpacing:  0,
      // Only set symbolKind for non-text runs to keep the field sparse.
      ...(symbolKind !== 'text' ? { symbolKind } : {}),
    });
  }

  return { runs, fontManager };
}
