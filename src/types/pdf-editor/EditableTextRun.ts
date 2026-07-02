import type { SymbolKind } from "@/core/pdf/SymbolClassifier";

export type { SymbolKind };

export interface EditableTextRun {
  id: string;
  page: number;

  text: string;
  originalText: string;

  // Full 6-element affine matrix in viewport (canvas pixel) space.
  // [a, b, c, d, e, f] where (e, f) is the translation (origin of the glyph baseline).
  // Derived from: pdfjs.Util.transform(viewport.transform, raw.transform)
  transform: [number, number, number, number, number, number];

  // Convenience scalars derived from transform (no loss of info — transform is authoritative)
  x: number;       // = transform[4]
  y: number;       // = transform[5]  (baseline y in canvas pixels, from top)
  width: number;   // in canvas pixels at RENDER_SCALE
  height: number;  // ascent + descent in canvas pixels
  // Ascent above baseline in canvas-px at RENDER_SCALE.
  // Derived from tc.styles[fontName].ascent * fontSize for accurate per-font metrics.
  ascent: number;
  fontSize: number; // = Math.abs(transform[3])  (positive)
  rotation: number; // degrees, 0 | 90 | 180 | 270 (or arbitrary)

  // Raw PDF font name, never substituted
  fontName: string;
  // CSS-ready font-family derived from PDF.js injected @font-face, or best standard match
  fontFamily: string;
  fontWeight: string; // "normal" | "bold" | "100"–"900"
  fontStyle: string;  // "normal" | "italic" | "oblique"

  color: string;       // hex "#rrggbb"
  direction: string;   // "ltr" | "rtl"
  charSpacing: number; // in canvas pixels
  wordSpacing: number; // in canvas pixels
  // Classification of single-character symbol runs (bullets, checkboxes, etc.)
  // Undefined for regular text runs.
  symbolKind?: SymbolKind;
  // True when this run is a merged paragraph (bullet-list item with one or more
  // continuation lines folded in). Canvas and export always word-wrap these at
  // run.width; the contenteditable also uses run.width as the paragraph column.
  isWrapped?: boolean;
}

export interface EditOverride {
  text: string;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  fontSize?: number;
  color?: string;
  textAlign?: "left" | "center" | "right";
  // Custom position in RENDER_SCALE px (set when user drags the box)
  x?: number; // baseline x
  y?: number; // baseline y
  // Custom width in RENDER_SCALE px (set when user resizes the box)
  w?: number;
}
