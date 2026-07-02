/**
 * FontManager — wraps PDF.js getTextContent() `styles` dict.
 *
 * PDF.js computes the correct CSS font-family for each PDF font resource
 * (including embedded @font-face names like "g_d0_f1") and stores it in
 * textContent.styles[fontResourceName].fontFamily.  We use that directly
 * instead of re-deriving it from the raw PDF font name string.
 *
 * Ascent / descent come from styles too, so overlay positioning matches
 * the canvas rendering exactly instead of relying on hardcoded 0.82/0.25.
 */

import { resolveFontFamily, resolveFontWeight, resolveFontStyle } from "@/utils/pdf-editor/font";

export interface ResolvedFont {
  fontFamily: string;   // CSS font-family, possibly an embedded @font-face name
  ascent: number;       // normalised 0-1 (fraction of font-size em)
  descent: number;      // normalised 0-1, always positive
  vertical: boolean;
  fontWeight: string;   // "normal" | "bold" | css numeric string
  fontStyle: string;    // "normal" | "italic"
}

const GENERIC_FAMILIES = new Set([
  "sans-serif", "serif", "monospace", "cursive", "fantasy", "system-ui",
]);

const DEFAULT_FONT: ResolvedFont = {
  fontFamily: "Arial, sans-serif",
  ascent: 0.80,
  descent: 0.20,
  vertical: false,
  fontWeight: "normal",
  fontStyle: "normal",
};

export class FontManager {
  private readonly map = new Map<string, ResolvedFont>();

  /**
   * Register font styles from page.getTextContent().styles.
   * Must be called before any getFont() calls for the page.
   */
  registerStyles(
    styles: Record<string, any> | null | undefined,
    rawFontNames: Record<string, string> = {},
  ): void {
    if (!styles) return;

    for (const [resourceName, style] of Object.entries(styles)) {
      if (!style) continue;

      // ── Font family ────────────────────────────────────────────────────────
      const pdfJsFamily = String(style.fontFamily || "").trim();
      const rawFontName = rawFontNames[resourceName] ?? resourceName;

      // If PDF.js returned only a generic CSS family (e.g. "sans-serif"),
      // fall back to our name-based heuristic which may be more specific.
      const firstFamily = pdfJsFamily.split(",")[0].trim().replace(/['"]/g, "").toLowerCase();
      const isGeneric = !pdfJsFamily || GENERIC_FAMILIES.has(firstFamily);
      const fontFamily = isGeneric
        ? resolveFontFamily(rawFontName)
        : pdfJsFamily;

      // ── Ascent / descent ──────────────────────────────────────────────────
      // PDF.js returns normalised values (0-1 fraction of em).
      // Guard against out-of-range values (some font types use a different scale).
      const rawAscent  = style.ascent;
      const rawDescent = style.descent;

      const ascent  = (typeof rawAscent  === "number" && isFinite(rawAscent)  && Math.abs(rawAscent)  < 2)
        ? Math.abs(rawAscent)
        : DEFAULT_FONT.ascent;
      const descent = (typeof rawDescent === "number" && isFinite(rawDescent) && Math.abs(rawDescent) < 2)
        ? Math.abs(rawDescent)
        : DEFAULT_FONT.descent;

      // ── Font weight / style ───────────────────────────────────────────────
      // PDF.js v3+ may include fontWeight and italic in styles.
      // Fall back to name-based heuristics for older versions.
      const fontWeight = style.fontWeight
        ? String(style.fontWeight)
        : resolveFontWeight(rawFontName);
      const fontStyle = style.italic
        ? "italic"
        : resolveFontStyle(rawFontName);

      this.map.set(resourceName, {
        fontFamily,
        ascent,
        descent,
        vertical: Boolean(style.vertical),
        fontWeight,
        fontStyle,
      });
    }
  }

  /** Return the resolved font info for a PDF resource name (e.g. "F1"). */
  getFont(resourceName: string): ResolvedFont {
    return this.map.get(resourceName) ?? DEFAULT_FONT;
  }

  /** Ascent in canvas-px at RENDER_SCALE. */
  getAscentPx(resourceName: string, fontSizePx: number): number {
    return this.getFont(resourceName).ascent * fontSizePx;
  }

  /** Descent in canvas-px at RENDER_SCALE (always positive). */
  getDescentPx(resourceName: string, fontSizePx: number): number {
    return this.getFont(resourceName).descent * fontSizePx;
  }
}
