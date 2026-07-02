/**
 * SymbolClassifier — multi-signal glyph classification for PDF symbols.
 *
 * Problem
 * -------
 * PDF.js getTextContent() maps glyphs to Unicode via each font's ToUnicode
 * CMap.  When no mapping exists (Wingdings, ZapfDingbats, old Symbol fonts),
 * PDF.js may return one of:
 *   • Private-use area char (U+E000–U+F8FF): the original char code offset
 *     by 0xF000.  The embedded @font-face injected by PDF.js uses the SAME
 *     private-use mapping, so rendering this char with the embedded CSS font
 *     produces the correct glyph — no substitution needed for display.
 *   • U+FFFD (replacement char) / U+25A1 (□): original code truly lost at
 *     the text-layer level.  Only font-name heuristics can help here.
 *   • ASCII-range char (0x21–0xFE): some PDF generators store raw font char
 *     codes without ToUnicode.  A Wingdings 0x72 comes through as 'r'.
 *
 * Strategy
 * --------
 * Classification uses THREE independent signals, applied in priority order:
 *   1. Private-use area → recover original char code (low byte), look up in
 *      the font's encoding table.
 *   2. Known Unicode code points → direct symbol-kind table lookup.
 *      Special case: U+25A1 (□) is upgraded to checkbox-unchecked when the
 *      font is a known symbol font (Wingdings checkbox maps here in some PDFs).
 *   3. ASCII-range char in known symbol font → encoding table lookup.
 *      Handles PDFs where Wingdings chars come through without Unicode mapping.
 *
 * Classification is METADATA ONLY — the character code stored in the run
 * and passed to fillText is never modified here.  Rendering always uses the
 * original item.str with the embedded @font-face CSS.
 */

// ── Symbol kind taxonomy ──────────────────────────────────────────────────────

export type SymbolKind =
  | 'bullet-round'        // ●  •  ∙  ·
  | 'bullet-hollow'       // ○  ◦  ◌
  | 'bullet-square'       // ■  ▪  □  ▫
  | 'bullet-diamond'      // ◆  ◇  ♦  ◊
  | 'bullet-triangle'     // ▶  ►  ▸  ▷  ◀
  | 'bullet-arrow'        // →  ⇒  ➤  ‣
  | 'checkbox-checked'    // ☑  ✓  ✔  ✗  ✘
  | 'checkbox-unchecked'  // ☐
  | 'dingbat'             // other identifiable dingbat / decorative glyph
  | 'text';               // regular text — NOT an isolated symbol marker

/** True for any SymbolKind that should be isolated from adjacent text runs. */
export function isIsolatedMarker(kind: SymbolKind): boolean {
  return kind !== 'text';
}

// ── Font encoding tables ──────────────────────────────────────────────────────
// Maps original char codes (0x20–0xFF) to SymbolKind.
// A missing entry means the glyph is a dingbat we don't specifically classify.

/**
 * Wingdings 1 encoding → SymbolKind.
 * Source: Microsoft Wingdings character map (Wingdings 1, the default).
 */
const WINGDINGS: Record<number, SymbolKind> = {
  // Decorative / dingbat symbols
  0x21: 'dingbat', // ✏ PENCIL
  0x22: 'dingbat', // ✂ BLACK SCISSORS
  0x23: 'dingbat', // ✁ UPPER BLADE SCISSORS
  0x24: 'dingbat', // ✈ AIRPLANE
  0x25: 'dingbat', // ✍ WRITING HAND
  0x26: 'dingbat', // ✌ VICTORY HAND
  0x27: 'dingbat', // ☞ WHITE RIGHT POINTING INDEX
  0x28: 'dingbat', // ☛ BLACK RIGHT POINTING INDEX
  0x29: 'dingbat', // ☜ WHITE LEFT POINTING INDEX
  0x2A: 'dingbat', // ☚ BLACK LEFT POINTING INDEX
  0x2B: 'dingbat', // ✋ RAISED HAND
  0x2C: 'dingbat', // happy face
  // Bullets
  0x4F: 'bullet-round',         // ● BLACK CIRCLE (filled bullet, large)
  0x50: 'bullet-round',         // ● (medium filled circle)
  0x51: 'bullet-diamond',       // ◊ LOZENGE
  0x52: 'dingbat',              // ✦ FOUR POINTED STAR
  0x53: 'bullet-diamond',       // ◆ BLACK DIAMOND
  // Small squares/circles (used as sub-bullets)
  0x6B: 'bullet-square',        // ▪ BLACK SMALL SQUARE
  0x6C: 'bullet-square',        // ■ BLACK MEDIUM SQUARE
  0x6D: 'bullet-square',        // ▫ WHITE SMALL SQUARE
  0x6E: 'bullet-square',        // □ WHITE MEDIUM SQUARE (as bullet)
  0x6F: 'bullet-hollow',        // ○ WHITE CIRCLE (hollow bullet)
  0x70: 'bullet-round',         // ● (small filled circle)
  // Checkboxes — the most important entries for correct checkbox detection
  0x72: 'checkbox-unchecked',   // ☐ BALLOT BOX
  0x73: 'checkbox-checked',     // ☑ BALLOT BOX WITH CHECK (some Wingdings variants)
  0x74: 'checkbox-unchecked',   // □ (square checkbox variant)
  0x75: 'bullet-square',        // ▪ (small black square, sub-bullet)
  // Other bullets
  0x76: 'bullet-round',         // ● (small)
  0xA7: 'bullet-hollow',        // ◦ HOLLOW BULLET
  0xA8: 'bullet-round',         // • BULLET
  // Arrows (used as list markers)
  0xE0: 'bullet-arrow',         // ➔ ARROW
  0xE1: 'bullet-arrow',         // → (variant)
  0xE2: 'bullet-arrow',
  0xF0: 'bullet-arrow',
  0xF1: 'bullet-triangle',      // ▶ RIGHT TRIANGLE
  0xF2: 'bullet-triangle',
  // Checkmarks / ballot entries
  0xFC: 'checkbox-checked',     // ✔ HEAVY CHECK MARK
  0xFD: 'checkbox-checked',     // ✔ (variant)
  0xFE: 'checkbox-checked',     // ☑ BALLOT BOX WITH CHECK
  0xFF: 'dingbat',              // ✗ BALLOT X (used as strikethrough / negative marker)
};

/**
 * ZapfDingbats encoding → SymbolKind.
 * Source: PDF specification, Annex D (Standard Type 1 Font Encodings).
 */
const ZAPF_DINGBATS: Record<number, SymbolKind> = {
  0x21: 'dingbat', // ✁
  0x22: 'dingbat', // ✂
  0x23: 'dingbat', // ✃
  0x24: 'dingbat', // ✄
  0x25: 'dingbat', // ☎
  0x26: 'dingbat', // ✆
  0x27: 'dingbat', // ✇
  0x28: 'dingbat', // ✈
  0x29: 'dingbat', // ✉
  0x2A: 'dingbat', // ☛
  0x2B: 'dingbat', // ☞
  // Pencils / editing
  0x2C: 'dingbat', // ✌
  // Bullets
  0x6C: 'bullet-round',    // ● BLACK CIRCLE
  0x6D: 'bullet-hollow',   // ❍ SHADOWED WHITE CIRCLE
  0x6E: 'bullet-diamond',  // ◆ BLACK DIAMOND
  0x6F: 'bullet-square',   // ❑ LOWER RIGHT SHADOWED WHITE SQUARE
  0x70: 'bullet-square',   // ❒ UPPER RIGHT SHADOWED WHITE SQUARE
  0x71: 'bullet-triangle', // ▶ BLACK RIGHT POINTING TRIANGLE
  0x72: 'dingbat',         // ✦ BLACK FOUR POINTED STAR
  0x73: 'dingbat',         // ★ BLACK STAR
  0x74: 'dingbat',         // ✶ SIX POINTED BLACK STAR
  0x75: 'dingbat',         // ✷ EIGHT POINTED RECTILINEAR BLACK STAR
  0x76: 'dingbat',         // ✸ HEAVY EIGHT POINTED RECTILINEAR BLACK STAR
  0x77: 'dingbat',         // ✹ TWELVE POINTED BLACK STAR
  0x78: 'dingbat',         // ✺ SIXTEEN POINTED ASTERISK
  0x79: 'dingbat',         // ✻ TEARDROP-SPOKED ASTERISK
  0x7A: 'dingbat',         // ✼ OPEN CENTRE TEARDROP-SPOKED ASTERISK
  // Arrows
  0xE8: 'bullet-arrow',   // → BLACK RIGHTWARDS ARROW
  0xE9: 'bullet-arrow',   // ➔ HEAVY WIDE-HEADED RIGHTWARDS ARROW
  0xEA: 'bullet-arrow',
  0xEB: 'bullet-arrow',
  0xF1: 'bullet-arrow',   // ➡ BLACK RIGHTWARDS ARROW
  // Checkmarks
  0xB1: 'checkbox-checked', // ✔ HEAVY CHECK MARK
  0xB2: 'checkbox-checked', // ✖ HEAVY MULTIPLICATION X (as "done" marker)
  0xB3: 'dingbat',          // ✚ HEAVY GREEK CROSS
  0xB4: 'checkbox-checked', // ✛ HEAVY OPEN CENTRE CROSS
};

/**
 * Adobe Symbol font encoding → SymbolKind.
 * Source: Adobe Symbol Encoding (standard PDF Symbol font).
 * Most Symbol chars are math/Greek symbols; only bullet-relevant ones listed.
 */
const SYMBOL_FONT: Record<number, SymbolKind> = {
  0xB7: 'bullet-round',   // • BULLET (most common — 0xB7 in Symbol = U+2022)
  0xD7: 'dingbat',        // ⋅ DOT OPERATOR
  0xE0: 'bullet-diamond', // ◊ LOZENGE (0xE0 in Symbol)
  0xB0: 'dingbat',        // ° DEGREE SIGN
};

// ── Direct Unicode classification ─────────────────────────────────────────────

const UNICODE_KINDS: Readonly<Record<number, SymbolKind>> = {
  // Round bullets
  0x2022: 'bullet-round',   // •  BULLET
  0x2043: 'bullet-round',   // ⁃  HYPHEN BULLET
  0x00B7: 'bullet-round',   // ·  MIDDLE DOT
  0x2219: 'bullet-round',   // ∙  BULLET OPERATOR
  0x22C5: 'bullet-round',   // ⋅  DOT OPERATOR
  0x25CF: 'bullet-round',   // ●  BLACK CIRCLE
  0x2B24: 'bullet-round',   // ⬤  BLACK LARGE CIRCLE
  // Hollow bullets
  0x25CB: 'bullet-hollow',  // ○  WHITE CIRCLE
  0x25E6: 'bullet-hollow',  // ◦  WHITE BULLET
  0x25CC: 'bullet-hollow',  // ◌  DOTTED CIRCLE
  // Square bullets
  0x25AA: 'bullet-square',  // ▪  BLACK SMALL SQUARE
  0x25AB: 'bullet-square',  // ▫  WHITE SMALL SQUARE
  0x25A0: 'bullet-square',  // ■  BLACK SQUARE
  0x25FE: 'bullet-square',  // ◾  BLACK MEDIUM SMALL SQUARE
  0x2B1B: 'bullet-square',  // ⬛  BLACK LARGE SQUARE
  // NOTE: 0x25A1 (□) is context-sensitive — handled separately below
  // Diamond bullets
  0x25C6: 'bullet-diamond', // ◆  BLACK DIAMOND
  0x25C7: 'bullet-diamond', // ◇  WHITE DIAMOND
  0x2666: 'bullet-diamond', // ♦  BLACK DIAMOND SUIT
  0x25CA: 'bullet-diamond', // ◊  LOZENGE
  // Triangle bullets
  0x25B6: 'bullet-triangle',// ▶  BLACK RIGHT POINTING TRIANGLE
  0x25BA: 'bullet-triangle',// ►  RIGHT POINTING POINTER
  0x25B8: 'bullet-triangle',// ▸  BLACK RIGHT POINTING SMALL TRIANGLE
  0x25B7: 'bullet-triangle',// ▷  WHITE RIGHT POINTING TRIANGLE
  0x25C0: 'bullet-triangle',// ◀  BLACK LEFT POINTING TRIANGLE
  0x25C4: 'bullet-triangle',// ◄  LEFT POINTING POINTER
  0x25BE: 'bullet-triangle',// ▾  BLACK DOWN POINTING SMALL TRIANGLE
  // Arrow bullets
  0x2192: 'bullet-arrow',   // →  RIGHTWARDS ARROW
  0x21D2: 'bullet-arrow',   // ⇒  RIGHTWARDS DOUBLE ARROW
  0x27A4: 'bullet-arrow',   // ➤  (private plane — handled by private-use path)
  0x2794: 'bullet-arrow',   // ➔  HEAVY WIDE-HEADED RIGHTWARDS ARROW
  0x27A2: 'bullet-arrow',   // ➢  THREE-D RIGHTWARDS ARROWHEAD
  0x2023: 'bullet-arrow',   // ‣  TRIANGULAR BULLET (arrow-ish)
  // Checkboxes
  0x2610: 'checkbox-unchecked', // ☐  BALLOT BOX
  0x2611: 'checkbox-checked',   // ☑  BALLOT BOX WITH CHECK MARK
  0x2612: 'checkbox-checked',   // ☒  BALLOT BOX WITH X
  0x2713: 'checkbox-checked',   // ✓  CHECK MARK
  0x2714: 'checkbox-checked',   // ✔  HEAVY CHECK MARK
  0x2717: 'checkbox-checked',   // ✗  BALLOT X
  0x2718: 'checkbox-checked',   // ✘  HEAVY BALLOT X
  // Misc dingbats commonly used as list markers
  0x2605: 'dingbat',        // ★  BLACK STAR
  0x2606: 'dingbat',        // ☆  WHITE STAR
  // Hyphen-like list markers (dash, em-dash, en-dash)
  0x002D: 'bullet-arrow',   // -  HYPHEN-MINUS (only when used as single-char marker)
  0x2013: 'bullet-arrow',   // –  EN DASH
  0x2014: 'bullet-arrow',   // —  EM DASH
};

// ── Helpers ───────────────────────────────────────────────────────────────────

// Known symbol font name fragments (lower-cased).
const SYMBOL_FONT_FRAGMENTS = [
  'wingding', 'zapf', 'dingbat', 'webding', 'symbol',
] as const;

function isSymbolFontName(fontName: string): boolean {
  const lower = fontName.toLowerCase();
  return SYMBOL_FONT_FRAGMENTS.some(f => lower.includes(f));
}

type EncodingTable = Record<number, SymbolKind>;

function getEncodingTable(fontName: string): EncodingTable | null {
  const lower = fontName.toLowerCase();
  if (lower.includes('wingding')) return WINGDINGS;
  if (lower.includes('zapf') || (lower.includes('dingbat') && !lower.includes('wingding'))) return ZAPF_DINGBATS;
  if (lower.includes('symbol') && !lower.includes('zapf')) return SYMBOL_FONT;
  return null;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Classify a single PDF text-run character (or very short string) as a
 * specific SymbolKind.
 *
 * This is METADATA ONLY.  The character stored in the run and passed to
 * fillText / textContent is never substituted.  Rendering always uses the
 * original item.str with the embedded @font-face CSS.
 *
 * @param str      The string from PDF.js item.str (after PDF.js processing)
 * @param fontName The PDF resource font name (e.g. "F1", "g_d0_f1", "Symbol")
 */
export function classifySymbol(str: string, fontName: string): SymbolKind {
  const t = str.trim();
  if (t.length === 0) return 'text';

  // Use the FIRST code point only; multi-char runs are regular text.
  // (Surrogate-safe iteration via spread)
  const firstChar = [...t][0];
  if (!firstChar) return 'text';
  const cp = firstChar.codePointAt(0) ?? 0;

  // ── 1. Private-use area (U+E000–U+F8FF) ──────────────────────────────────
  // PDF.js shifts unmapped char codes by 0xF000 into private-use space.
  // Recover the original font char code (low byte) and look up in the
  // font's encoding table.
  if (cp >= 0xE000 && cp <= 0xF8FF) {
    const originalCode = cp & 0xFF;
    const table = getEncodingTable(fontName);
    if (table) {
      const kind = table[originalCode];
      if (kind !== undefined) return kind;
    }
    // Private-use from a known symbol font, table entry missing → dingbat
    if (isSymbolFontName(fontName)) return 'dingbat';
    // Private-use from unknown font → treat as dingbat so run stays isolated
    return 'dingbat';
  }

  // ── 2. Known Unicode code points ─────────────────────────────────────────
  const unicodeKind = UNICODE_KINDS[cp];
  if (unicodeKind !== undefined) {
    // Special case: □ (U+25A1) is "WHITE SQUARE" in normal text, but in a
    // known symbol font (especially Wingdings) it almost always represents a
    // CHECKBOX (the Wingdings ballot-box glyph PDF.js couldn't map).
    if (cp === 0x25A1 && isSymbolFontName(fontName)) return 'checkbox-unchecked';
    return unicodeKind;
  }

  // ── 3. Replacement placeholders in known symbol fonts ────────────────────
  // U+FFFD / U+25A1 from a symbol font where the original code was lost →
  // at least mark as dingbat so the run is separated from adjacent text.
  if ((cp === 0xFFFD || cp === 0x25A1) && isSymbolFontName(fontName)) {
    return 'dingbat';
  }

  // ── 4. ASCII-range chars in known symbol fonts ────────────────────────────
  // Some PDF generators store raw Wingdings/Symbol char codes without any
  // ToUnicode mapping.  A Wingdings checkbox (code 0x72) appears as 'r' in
  // item.str.  Detect this pattern and classify from the encoding table.
  // Only applies to single-character runs from known symbol fonts.
  if (t.length === 1 && cp >= 0x21 && cp <= 0xFE && isSymbolFontName(fontName)) {
    const table = getEncodingTable(fontName);
    if (table) {
      const kind = table[cp];
      if (kind !== undefined) return kind;
    }
    // Single char from symbol font, not in table → generic dingbat
    return 'dingbat';
  }

  return 'text';
}
