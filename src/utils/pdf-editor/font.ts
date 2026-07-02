// Font detection and CSS mapping for the PDF editor.
// Priority order:
//   1. PDF.js injected @font-face (embedded fonts — best quality)
//   2. PDF standard 14 font map (exact metric match)
//   3. Name-based heuristic fallback

// The 14 standard PDF fonts mapped to their CSS equivalents.
const STANDARD_14: Record<string, string> = {
  "helvetica":           "Helvetica, Arial, sans-serif",
  "helvetica-bold":      "Helvetica, Arial, sans-serif",
  "helvetica-oblique":   "Helvetica, Arial, sans-serif",
  "helvetica-boldoblique": "Helvetica, Arial, sans-serif",
  "times-roman":         "Times New Roman, Times, serif",
  "times-bold":          "Times New Roman, Times, serif",
  "times-italic":        "Times New Roman, Times, serif",
  "times-bolditalic":    "Times New Roman, Times, serif",
  "courier":             "Courier New, Courier, monospace",
  "courier-bold":        "Courier New, Courier, monospace",
  "courier-oblique":     "Courier New, Courier, monospace",
  "courier-boldoblique": "Courier New, Courier, monospace",
  "symbol":              "Symbol, serif",
  "zapfdingbats":        "ZapfDingbats, serif",
};

// After PDF.js renders a page it injects @font-face rules whose font-family
// names follow the pattern: "g_d<digits>_f<index>" or similar.
// PDF.js also stores the resolved font name on each text item's `fontName` field
// which matches the CSS font-family injected into the document.
// We cache the mapping: PDF fontName → CSS font-family string.
const fontFaceCache = new Map<string, string>();

// Call this once per page after PDF.js has rendered the text layer.
// It scans document.styleSheets for @font-face rules whose src is a data: URI
// (the pattern PDF.js uses for embedded fonts) and caches the family name.
export function indexPdfJsFontFaces(): void {
  try {
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList;
      try { rules = sheet.cssRules; } catch { continue; }
      for (const rule of Array.from(rules)) {
        if (rule instanceof CSSFontFaceRule) {
          const family = rule.style.getPropertyValue("font-family").replace(/['"]/g, "").trim();
          const src = rule.style.getPropertyValue("src");
          // PDF.js embeds fonts as data: URIs
          if (family && src.includes("data:")) {
            fontFaceCache.set(family.toLowerCase(), family);
          }
        }
      }
    }
  } catch {
    // StyleSheet access can fail in some CSP contexts — silently skip
  }
}

// Given the raw PDF fontName string (e.g. "ABCDEF+ArialMT"), return
// the best CSS font-family string.
export function resolveFontFamily(rawFontName: string): string {
  if (!rawFontName) return "Arial, sans-serif";

  // 1. PDF.js embedded font — the rawFontName IS the injected CSS family name
  const cached = fontFaceCache.get(rawFontName.toLowerCase());
  if (cached) return cached;

  // Strip subset prefix (e.g. "ABCDEF+ArialMT" → "ArialMT")
  const stripped = rawFontName.includes("+")
    ? rawFontName.split("+")[1]
    : rawFontName;

  const lower = stripped.toLowerCase().replace(/[^a-z0-9-]/g, "");

  // 2. Standard 14 map
  const std = STANDARD_14[lower];
  if (std) return std;

  // 3. Heuristic name matching
  if (lower.includes("times") || lower.includes("palatino") || lower.includes("garamond"))
    return "Times New Roman, Times, serif";
  if (lower.includes("georgia")) return "Georgia, serif";
  if (lower.includes("courier") || lower.includes("mono"))
    return "Courier New, Courier, monospace";
  if (lower.includes("calibri")) return "Calibri, Arial, sans-serif";
  if (lower.includes("cambria")) return "Cambria, Georgia, serif";
  if (lower.includes("verdana")) return "Verdana, sans-serif";
  if (lower.includes("tahoma")) return "Tahoma, sans-serif";
  if (lower.includes("trebuchet")) return "Trebuchet MS, sans-serif";
  if (lower.includes("arial") || lower.includes("helvetica") || lower.includes("sans"))
    return "Arial, sans-serif";
  if (lower.includes("symbol")) return "Symbol, serif";

  return "Arial, sans-serif";
}

// Determine font-weight from font name.
export function resolveFontWeight(rawFontName: string): string {
  const l = rawFontName.toLowerCase();
  if (
    l.includes("bold") || l.includes("heavy") || l.includes("black") ||
    l.includes("demi") || l.includes("extrabold") || l.includes("semibold") ||
    l.endsWith("bd") || l.includes(" bd ")
  ) return "bold";
  if (l.includes("thin") || l.includes("ultralight") || l.includes("extralight"))
    return "200";
  if (l.includes("light")) return "300";
  if (l.includes("medium")) return "500";
  return "normal";
}

// Determine font-style from font name.
export function resolveFontStyle(rawFontName: string): string {
  const l = rawFontName.toLowerCase();
  if (l.includes("italic") || l.includes("oblique") || l.includes("slant")) return "italic";
  return "normal";
}

// Build the complete CSS font shorthand for a run.
export function buildFontCss(opts: {
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  fontSize: number; // in CSS px (already zoom-adjusted by caller)
}): string {
  return [
    opts.fontStyle !== "normal" ? opts.fontStyle : "",
    opts.fontWeight !== "normal" ? opts.fontWeight : "",
    `${opts.fontSize}px`,
    opts.fontFamily,
  ].filter(Boolean).join(" ");
}

// System / standard fonts (always available, no network request)
export const SYSTEM_FONTS = [
  { label: "Arial",          value: "Arial, sans-serif" },
  { label: "Helvetica",      value: "Helvetica, Arial, sans-serif" },
  { label: "Times New Roman",value: "Times New Roman, serif" },
  { label: "Courier New",    value: "Courier New, monospace" },
  { label: "Georgia",        value: "Georgia, serif" },
  { label: "Verdana",        value: "Verdana, sans-serif" },
  { label: "Tahoma",         value: "Tahoma, sans-serif" },
  { label: "Trebuchet MS",   value: "Trebuchet MS, sans-serif" },
  { label: "Calibri",        value: "Calibri, Arial, sans-serif" },
  { label: "Garamond",       value: "Garamond, serif" },
];

// Google Fonts — loaded via a single <link> tag injected at editor mount.
// The `google` field is the URL-encoded family name for the Fonts API.
export const GOOGLE_FONTS: { label: string; value: string; google: string }[] = [
  // Sans-serif
  { label: "Inter",             value: "'Inter', sans-serif",             google: "Inter" },
  { label: "Roboto",            value: "'Roboto', sans-serif",            google: "Roboto" },
  { label: "Open Sans",         value: "'Open Sans', sans-serif",         google: "Open+Sans" },
  { label: "Lato",              value: "'Lato', sans-serif",              google: "Lato" },
  { label: "Montserrat",        value: "'Montserrat', sans-serif",        google: "Montserrat" },
  { label: "Poppins",           value: "'Poppins', sans-serif",           google: "Poppins" },
  { label: "Raleway",           value: "'Raleway', sans-serif",           google: "Raleway" },
  { label: "Nunito",            value: "'Nunito', sans-serif",            google: "Nunito" },
  { label: "Ubuntu",            value: "'Ubuntu', sans-serif",            google: "Ubuntu" },
  { label: "Noto Sans",         value: "'Noto Sans', sans-serif",         google: "Noto+Sans" },
  { label: "Fira Sans",         value: "'Fira Sans', sans-serif",         google: "Fira+Sans" },
  { label: "Work Sans",         value: "'Work Sans', sans-serif",         google: "Work+Sans" },
  { label: "Josefin Sans",      value: "'Josefin Sans', sans-serif",      google: "Josefin+Sans" },
  { label: "Oswald",            value: "'Oswald', sans-serif",            google: "Oswald" },
  { label: "Quicksand",         value: "'Quicksand', sans-serif",         google: "Quicksand" },
  { label: "Rubik",             value: "'Rubik', sans-serif",             google: "Rubik" },
  { label: "Exo 2",             value: "'Exo 2', sans-serif",             google: "Exo+2" },
  { label: "DM Sans",           value: "'DM Sans', sans-serif",           google: "DM+Sans" },
  { label: "Outfit",            value: "'Outfit', sans-serif",            google: "Outfit" },
  { label: "Mulish",            value: "'Mulish', sans-serif",            google: "Mulish" },
  // Serif
  { label: "Playfair Display",  value: "'Playfair Display', serif",       google: "Playfair+Display" },
  { label: "Merriweather",      value: "'Merriweather', serif",           google: "Merriweather" },
  { label: "Libre Baskerville", value: "'Libre Baskerville', serif",      google: "Libre+Baskerville" },
  { label: "PT Serif",          value: "'PT Serif', serif",               google: "PT+Serif" },
  { label: "Lora",              value: "'Lora', serif",                   google: "Lora" },
  { label: "Crimson Text",      value: "'Crimson Text', serif",           google: "Crimson+Text" },
  { label: "EB Garamond",       value: "'EB Garamond', serif",            google: "EB+Garamond" },
  { label: "Cormorant Garamond",value: "'Cormorant Garamond', serif",     google: "Cormorant+Garamond" },
  // Monospace
  { label: "Fira Code",         value: "'Fira Code', monospace",          google: "Fira+Code" },
  { label: "Source Code Pro",   value: "'Source Code Pro', monospace",    google: "Source+Code+Pro" },
  { label: "Space Mono",        value: "'Space Mono', monospace",         google: "Space+Mono" },
  { label: "JetBrains Mono",    value: "'JetBrains Mono', monospace",     google: "JetBrains+Mono" },
];

// Combined list kept for any code that iterates all user-selectable fonts
export const WEB_FONTS = [...SYSTEM_FONTS, ...GOOGLE_FONTS];

/** Build the Google Fonts stylesheet URL for all GOOGLE_FONTS entries. */
export function buildGoogleFontsUrl(): string {
  const params = GOOGLE_FONTS.map(
    f => `family=${f.google}:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700`,
  ).join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}
