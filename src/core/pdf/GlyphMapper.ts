/**
 * GlyphMapper — character normalization for PDF text runs.
 *
 * PDF.js getTextContent() maps glyphs to Unicode via each font's ToUnicode
 * CMap.  When a glyph has no ToUnicode entry (common for Symbol, Wingdings,
 * ZapfDingbats, and some CID fonts), PDF.js may return:
 *   • A private-use area code point (U+E000–U+F8FF)
 *     → The embedded @font-face injected by PDF.js maps the SAME private-use
 *       code to the original glyph.  PASS THROUGH UNCHANGED — rendering is
 *       correct as-is when the embedded CSS font is used.
 *   • U+FFFD (replacement char) or U+25A1 (□ white square)
 *     → Truly unmapped; original code is lost at the text-layer level.
 *       Attempt recovery only for fonts with complete static encoding tables
 *       (Symbol font).  All other cases are returned unchanged.
 *
 * Key principle: never substitute a character code that renders correctly
 * with the embedded font.  Private-use chars DO render correctly — replacing
 * them with "nicer" Unicode characters BREAKS rendering because the embedded
 * @font-face does not have a glyph at the substituted code point.
 */

// ── Symbol font encoding table ────────────────────────────────────────────────
// Standard Symbol encoding (Adobe Symbol font, PDF spec Annex D).
// Maps original char codes (in the range 0x20–0xFF) to Unicode code points.
// Used ONLY for U+FFFD / U+25A1 recovery in Symbol font runs; private-use
// chars use the font table in SymbolClassifier and are never substituted.
const SYMBOL_TO_UNICODE: Record<number, number> = {
  // Punctuation / operators (mostly identity or near-identity)
  0x21: 0x0021, // !
  0x22: 0x2200, // ∀ FOR ALL
  0x23: 0x0023, // #
  0x24: 0x2203, // ∃ THERE EXISTS
  0x25: 0x0025, // %
  0x26: 0x0026, // &
  0x27: 0x220D, // ∋ SMALL CONTAINS AS MEMBER
  0x28: 0x0028, // (
  0x29: 0x0029, // )
  0x2A: 0x2217, // ∗ ASTERISK OPERATOR
  0x2B: 0x002B, // +
  0x2C: 0x002C, // ,
  0x2D: 0x2212, // − MINUS SIGN
  0x2E: 0x002E, // .
  0x2F: 0x002F, // /
  // Digits 0x30–0x39 are the same in Symbol and Latin
  0x30: 0x0030, 0x31: 0x0031, 0x32: 0x0032, 0x33: 0x0033, 0x34: 0x0034,
  0x35: 0x0035, 0x36: 0x0036, 0x37: 0x0037, 0x38: 0x0038, 0x39: 0x0039,
  0x3A: 0x003A, // :
  0x3B: 0x003B, // ;
  0x3C: 0x003C, // <
  0x3D: 0x003D, // =
  0x3E: 0x003E, // >
  0x3F: 0x003F, // ?
  0x40: 0x2245, // ≅ APPROXIMATELY EQUAL TO
  // Greek uppercase (0x41–0x5A)
  0x41: 0x0391, // Α
  0x42: 0x0392, // Β
  0x43: 0x03A7, // Χ
  0x44: 0x0394, // Δ
  0x45: 0x0395, // Ε
  0x46: 0x03A6, // Φ
  0x47: 0x0393, // Γ
  0x48: 0x0397, // Η
  0x49: 0x0399, // Ι
  0x4A: 0x03D1, // ϑ
  0x4B: 0x039A, // Κ
  0x4C: 0x039B, // Λ
  0x4D: 0x039C, // Μ
  0x4E: 0x039D, // Ν
  0x4F: 0x039F, // Ο
  0x50: 0x03A0, // Π
  0x51: 0x0398, // Θ
  0x52: 0x03A1, // Ρ
  0x53: 0x03A3, // Σ
  0x54: 0x03A4, // Τ
  0x55: 0x03A5, // Υ
  0x56: 0x03C2, // ς
  0x57: 0x03A9, // Ω
  0x58: 0x039E, // Ξ
  0x59: 0x03A8, // Ψ
  0x5A: 0x0396, // Ζ
  // 0x5B–0x60 brackets / misc
  0x5B: 0x005B, 0x5D: 0x005D, 0x5E: 0x22A5, 0x5F: 0x005F,
  // Greek lowercase (0x61–0x7A)
  0x61: 0x03B1, // α
  0x62: 0x03B2, // β
  0x63: 0x03C7, // χ
  0x64: 0x03B4, // δ
  0x65: 0x03B5, // ε
  0x66: 0x03C6, // φ
  0x67: 0x03B3, // γ
  0x68: 0x03B7, // η
  0x69: 0x03B9, // ι
  0x6A: 0x03D5, // ϕ
  0x6B: 0x03BA, // κ
  0x6C: 0x03BB, // λ
  0x6D: 0x03BC, // μ
  0x6E: 0x03BD, // ν
  0x6F: 0x03BF, // ο
  0x70: 0x03C0, // π
  0x71: 0x03B8, // θ
  0x72: 0x03C1, // ρ
  0x73: 0x03C3, // σ
  0x74: 0x03C4, // τ
  0x75: 0x03C5, // υ
  0x76: 0x03D6, // ϖ
  0x77: 0x03C9, // ω
  0x78: 0x03BE, // ξ
  0x79: 0x03C8, // ψ
  0x7A: 0x03B6, // ζ
  // Misc
  0x7B: 0x007B, // {
  0x7C: 0x007C, // |
  0x7D: 0x007D, // }
  0x7E: 0x223C, // ∼ TILDE OPERATOR
  // Extended (0xA0–0xFF)
  0xA0: 0x20AC, // € EURO SIGN (in some Symbol variants)
  0xA1: 0x03D2, // ϒ UPSILON WITH HOOK
  0xA2: 0x2032, // ′ PRIME
  0xA3: 0x2264, // ≤
  0xA4: 0x2044, // ⁄ FRACTION SLASH
  0xA5: 0x221E, // ∞ INFINITY
  0xA6: 0x0192, // ƒ FUNCTION
  0xA7: 0x2663, // ♣ BLACK CLUB SUIT
  0xA8: 0x2666, // ♦ BLACK DIAMOND SUIT
  0xA9: 0x2665, // ♥ BLACK HEART SUIT
  0xAA: 0x2660, // ♠ BLACK SPADE SUIT
  0xAB: 0x2194, // ↔ LEFT RIGHT ARROW
  0xAC: 0x2190, // ← LEFTWARDS ARROW
  0xAD: 0x2191, // ↑ UPWARDS ARROW
  0xAE: 0x2192, // → RIGHTWARDS ARROW
  0xAF: 0x2193, // ↓ DOWNWARDS ARROW
  0xB0: 0x00B0, // ° DEGREE SIGN
  0xB1: 0x00B1, // ±
  0xB2: 0x2033, // ″ DOUBLE PRIME
  0xB3: 0x2265, // ≥
  0xB4: 0x00D7, // × MULTIPLICATION SIGN
  0xB5: 0x221D, // ∝ PROPORTIONAL TO
  0xB6: 0x2202, // ∂ PARTIAL DIFFERENTIAL
  0xB7: 0x2022, // • BULLET  ← key: Symbol 0xB7 = bullet
  0xB8: 0x00F7, // ÷ DIVISION SIGN
  0xB9: 0x2260, // ≠
  0xBA: 0x2261, // ≡
  0xBB: 0x2248, // ≈
  0xBC: 0x2026, // … ELLIPSIS
  0xBD: 0x23D0, // ⏐ VERTICAL LINE EXTENSION
  0xBE: 0x23AF, // ⎯ HORIZONTAL LINE EXTENSION
  0xBF: 0x21B5, // ↵
  0xC0: 0x2135, // ℵ
  0xC1: 0x2111, // ℑ
  0xC2: 0x211C, // ℜ
  0xC3: 0x2118, // ℘
  0xC4: 0x2297, // ⊗
  0xC5: 0x2295, // ⊕
  0xC6: 0x2205, // ∅
  0xC7: 0x2229, // ∩
  0xC8: 0x222A, // ∪
  0xC9: 0x2283, // ⊃
  0xCA: 0x2287, // ⊇
  0xCB: 0x2284, // ⊄
  0xCC: 0x2282, // ⊂
  0xCD: 0x2286, // ⊆
  0xCE: 0x2208, // ∈
  0xCF: 0x2209, // ∉
  0xD0: 0x2220, // ∠
  0xD1: 0x2207, // ∇
  0xD2: 0x00AE, // ®
  0xD3: 0x00A9, // ©
  0xD4: 0x2122, // ™
  0xD5: 0x220F, // ∏
  0xD6: 0x221A, // √
  0xD7: 0x22C5, // ⋅ DOT OPERATOR
  0xD8: 0x00AC, // ¬
  0xD9: 0x2227, // ∧
  0xDA: 0x2228, // ∨
  0xDB: 0x21D4, // ⟺
  0xDC: 0x21D0, // ⟸
  0xDD: 0x2191, // ↑
  0xDE: 0x21D2, // ⟹
  0xDF: 0x21D3, // ↓
  0xE0: 0x25CA, // ◊ LOZENGE
  0xE1: 0x27E8, // ⟨
  0xE2: 0x00AE, // ® (serif variant)
  0xE5: 0x2211, // ∑
  0xE6: 0x239B, // ⎛
  0xF1: 0x232D, // ⌭
  0xF2: 0x222B, // ∫
  0xF3: 0x2320, // ⌠
  0xF4: 0x007C, // |
  0xF5: 0x2321, // ⌡
};

// ── Public API ────────────────────────────────────────────────────────────────

const PRIVATE_USE_START = 0xE000;
const PRIVATE_USE_END   = 0xF8FF;

/** True when a code point is in the Unicode private-use area. */
export function isPrivateUse(codePoint: number): boolean {
  return codePoint >= PRIVATE_USE_START && codePoint <= PRIVATE_USE_END;
}

/** True when the string contains glyphs that PDF.js could not map to Unicode. */
export function hasUnmappedGlyphs(str: string): boolean {
  for (const ch of str) {
    const cp = ch.codePointAt(0) ?? 0;
    if (cp === 0xFFFD || cp === 0x25A1 || isPrivateUse(cp)) return true;
  }
  return false;
}

/**
 * Return the display string for an overlay edit box.
 *
 * Rules:
 *   1. Private-use area chars → PASS THROUGH UNCHANGED.
 *      The embedded @font-face maps these to the correct glyphs.
 *      Substituting them with "nicer" Unicode would break rendering.
 *   2. Symbol font with U+FFFD / U+25A1 → attempt recovery via the
 *      Symbol encoding table (SYMBOL_TO_UNICODE[cp & 0xFF]).
 *      This works because PDF.js's Symbol-font fallback uses low-byte char codes.
 *   3. All other cases → return as-is.
 */
export function resolveDisplayText(str: string, fontName: string): string {
  if (!hasUnmappedGlyphs(str)) return str;

  const lower = fontName.toLowerCase();
  const isSymbolFont = lower.includes('symbol') && !lower.includes('wingding') && !lower.includes('zapf');

  let result = '';
  for (const ch of str) {
    const cp = ch.codePointAt(0) ?? 0;

    if (isPrivateUse(cp)) {
      // Rule 1: private-use chars render correctly with the embedded font — keep.
      result += ch;
    } else if ((cp === 0xFFFD || cp === 0x25A1) && isSymbolFont) {
      // Rule 2: Symbol font fallback — recover via encoding table.
      // PDF.js Symbol fallback uses the low byte as the original char code.
      const mapped = SYMBOL_TO_UNICODE[cp & 0xFF];
      result += mapped ? String.fromCodePoint(mapped) : ch;
    } else {
      // Rule 3: keep all other characters (correct Unicode or irreversible).
      result += ch;
    }
  }
  return result;
}
