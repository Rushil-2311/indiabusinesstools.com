// Groups individual PDF.js text runs (one per word/glyph cluster) into
// visual line blocks — one editable box per line, matching PDFAid behaviour.
//
// Width note: we add a 1 em buffer to the raw PDF width because browser web
// fonts are typically wider than the embedded PDF font.  Without this, the
// overlay box is narrower than the actual text and words appear cut off.
//
// Bullet note: bullet/list markers (•, –, *, etc.) are kept in their own
// separate single-run group so they are never merged into the adjacent text
// run.  Benefits:
//   • The edit box for the text starts AFTER the marker — user never
//     accidentally edits the bullet character.
//   • The white cover for the text run doesn't erase the marker area —
//     the PDF-rendered bullet stays untouched.
//   • The text run's fontSize, fontFamily, and fontWeight are taken from
//     the actual text glyphs, not the marker's (often different) font.

import type { EditableTextRun } from "@/types/pdf-editor/EditableTextRun";

// Unicode-only fallback for runs that predate symbolKind tagging.
// Covers the most common bullet characters that still pass through as plain Unicode.
const BULLET_UNICODE_RE = /^[•·–—○◦▪▫►▶→*§\-]$/;

/**
 * True for runs that should be isolated from adjacent text.
 *
 * Priority:
 *   1. symbolKind set by SymbolClassifier (font-aware, handles Wingdings/ZapfDingbats/
 *      private-use area chars, checkboxes vs. bullets, etc.)
 *   2. Unicode-only fallback regex for correctly-mapped common bullets.
 */
function isMarkerRun(run: EditableTextRun): boolean {
  // Signal 1: font-aware classification from SymbolClassifier
  if (run.symbolKind !== undefined && run.symbolKind !== 'text') return true;

  // Signal 2: Unicode fallback for short bullet-like chars without symbolKind
  const t = run.text.trim();
  return t.length > 0 && t.length <= 2 && BULLET_UNICODE_RE.test(t);
}

export function groupRunsIntoLines(
  runs: EditableTextRun[],
  pageWidth: number,   // canvas pixels at RENDER_SCALE
): EditableTextRun[] {
  if (!runs.length) return [];

  const valid = runs.filter(r => r.text !== "");
  if (!valid.length) return [];

  // Sort top-to-bottom, then left-to-right
  const sorted = [...valid].sort((a, b) => a.y - b.y || a.x - b.x);

  // Group into same-baseline buckets.
  // Bullet markers are never merged with adjacent runs — they always get
  // their own single-run group.
  const groups: EditableTextRun[][] = [];
  let cur: EditableTextRun[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const run     = sorted[i];
    const refFont = cur[0].fontSize;
    const lastInCur = cur[cur.length - 1];

    // Keep symbol markers isolated — start a new group whenever the incoming
    // run OR the last accumulated run is a detected marker (bullet, checkbox,
    // dingbat).  This prevents the white-cover in PdfCanvas from erasing the
    // symbol when the adjacent text is edited.
    const merge =
      !isMarkerRun(run) &&
      !isMarkerRun(lastInCur) &&
      Math.abs(run.y - cur[0].y) < refFont * 0.4;

    if (merge) {
      cur.push(run);
    } else {
      groups.push(cur);
      cur = [run];
    }
  }
  if (cur.length) groups.push(cur);

  const lineRuns = groups.map((group, gi) => {
    const sg = [...group].sort((a, b) => a.x - b.x);

    // ── Build combined text ──────────────────────────────────────────────
    let text = sg[0].text;
    for (let i = 1; i < sg.length; i++) {
      const prev = sg[i - 1];
      const curr = sg[i];
      const gap  = curr.x - (prev.x + prev.width);
      if (
        gap > prev.fontSize * 0.15 &&
        !prev.text.endsWith(" ") &&
        !curr.text.startsWith(" ")
      ) {
        text += " ";
      }
      text += curr.text;
    }

    // ── Dominant run: the run with the most text characters ───────────────
    // Excludes any symbol markers so their font (Wingdings etc.) never drives
    // the font size, family, or weight reported for the whole line.
    const contentRuns = sg.filter(r => r.text.trim().length > 0 && !isMarkerRun(r));
    const dom = contentRuns.length
      ? contentRuns.reduce((best, r) => r.text.length > best.text.length ? r : best)
      : sg[0];

    // If ANY non-bullet run in the line is bold/italic, treat the line as such.
    const hasBold   = contentRuns.some(r => r.fontWeight === "bold");
    const hasItalic = contentRuns.some(r => r.fontStyle  === "italic");

    // ── Bounding box ──────────────────────────────────────────────────
    const baseline = Math.max(...group.map(r => r.y));
    const left     = sg[0].x;
    const rawRight = Math.max(...sg.map(r => r.x + r.width));

    // Add 1 em buffer so web-font text (wider than PDF fonts) still fits.
    // Hard-clamp at the page edge so the box never overflows the PDF canvas.
    const bufferedRight = rawRight + dom.fontSize * 1.0;
    const right         = Math.min(bufferedRight, pageWidth - 1);
    const width         = Math.max(right - left, dom.fontSize * 2);

    const maxAscent  = Math.max(...group.map(r => r.ascent ?? r.fontSize * 0.82));
    const maxDescent = Math.max(...group.map(r => {
      const h = r.height;
      const a = r.ascent ?? r.fontSize * 0.82;
      return h - a;
    }));

    return {
      id:           `line_${gi}_${group[0].id}`,
      page:         group[0].page,
      text,
      originalText: text,
      transform:    group[0].transform,
      x:            left,
      y:            baseline,
      width,
      height:       maxAscent + maxDescent,
      ascent:       maxAscent,
      // Use the dominant (most-content) run's fontSize — not maxFontSize.
      // maxFontSize is often inflated by the bullet glyph's font metrics and
      // causes the toolbar to display the wrong point size for the line.
      fontSize:     dom.fontSize,
      rotation:     0,
      fontName:     dom.fontName,
      fontFamily:   dom.fontFamily,
      fontWeight:   hasBold   ? "bold"   : dom.fontWeight,
      fontStyle:    hasItalic ? "italic" : dom.fontStyle,
      color:        dom.color,
      direction:    dom.direction,
      charSpacing:  0,
      wordSpacing:  0,
      // Preserve symbolKind for single-run groups (marker runs stay isolated).
      // Multi-run groups are regular text so symbolKind is omitted.
      ...(group.length === 1 && group[0].symbolKind !== undefined
        ? { symbolKind: group[0].symbolKind }
        : {}),
    };
  });

  // Second pass: merge hanging-indent continuation lines into their paragraph anchors.
  return mergeParagraphContinuations(lineRuns);
}

// ── Second pass: paragraph continuation merging ───────────────────────────────
//
// PDF.js emits continuation lines of a hanging-indent bullet item as separate
// text items on separate baselines.  groupRunsIntoLines produces one line group
// per baseline, so a two-line bullet item creates TWO separate groups:
//
//   line_0  "Mauris id ex erat. Nunc vulputate…"  y=100  x=92
//   line_1  "sagittis."                            y=115  x=92
//
// When the user activates line_0, the contenteditable only shows the first line.
// Typing causes the text to extend past the box bottom without the continuation.
//
// This pass detects such sequences (text run following a bullet on the same
// baseline, followed by runs on subsequent baselines at the same x) and merges
// them into a single paragraph group with isWrapped=true.  The canvas and
// export both word-wrap isWrapped runs at run.width, which is the paragraph
// column width derived from the original PDF bounding boxes.
//
// Safety: merging is restricted to anchors (text runs whose baseline has a
// bullet to the left).  Regular body text whose lines share the same left margin
// is NOT collapsed into one block.

function mergeParagraphContinuations(
  lineRuns: EditableTextRun[],
): EditableTextRun[] {
  if (lineRuns.length === 0) return lineRuns;

  const sorted = [...lineRuns].sort((a, b) => a.y - b.y || a.x - b.x);

  // Map rounded baseline-y → x of any bullet on that line.
  const bulletAtY = new Map<number, number>();
  for (const g of sorted) {
    if (g.symbolKind) bulletAtY.set(Math.round(g.y), g.x);
  }

  // Identify "anchor" groups — text runs on the same baseline as a bullet,
  // positioned to the right of that bullet.  Only anchors participate in merging.
  const anchorIds = new Set<string>();
  for (const g of sorted) {
    if (g.symbolKind) continue;
    const bulletX = bulletAtY.get(Math.round(g.y));
    if (bulletX !== undefined && g.x > bulletX) anchorIds.add(g.id);
  }

  if (anchorIds.size === 0) return sorted;

  const absorbed = new Set<string>();
  const result: EditableTextRun[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const anchor = sorted[i];
    if (absorbed.has(anchor.id)) { continue; }

    if (!anchorIds.has(anchor.id)) {
      result.push(anchor);
      continue;
    }

    // Greedily collect continuation runs that follow the anchor.
    const continuations: EditableTextRun[] = [];
    let   lastGroup:     EditableTextRun   = anchor;

    for (let j = i + 1; j < sorted.length; j++) {
      const next = sorted[j];
      if (absorbed.has(next.id)) continue;

      // A bullet on this line means a new paragraph starts — stop.
      if (next.symbolKind) break;
      if (bulletAtY.has(Math.round(next.y))) break;

      // x must align with the paragraph text column (within ~1.2 em).
      if (Math.abs(next.x - anchor.x) > anchor.fontSize * 1.2) break;

      // y must be on the very next line — not the same, not more than 2.5 line-heights away.
      const yGap = next.y - lastGroup.y;
      if (yGap <= 0)                        break; // same or earlier line
      if (yGap > lastGroup.height * 2.5)   break; // too far — new paragraph or section gap

      continuations.push(next);
      absorbed.add(next.id);
      lastGroup = next;
    }

    if (!continuations.length) {
      result.push(anchor);
      continue;
    }

    // ── Build merged paragraph ──────────────────────────────────────────────
    // Text: space-join all segments (fillTextWrapped re-flows to the column width).
    const mergedText = [anchor, ...continuations]
      .map(r => r.text.trim())
      .filter(Boolean)
      .join(' ');

    // Column width: the rightmost edge of any line in the paragraph minus anchor.x.
    // This is the wrap column the canvas and export will use.
    const maxRight = Math.max(
      anchor.x + anchor.width,
      ...continuations.map(c => c.x + c.width),
    );

    // Height: from anchor ascent-top to last continuation descent-bottom.
    const anchorAscent = anchor.ascent ?? anchor.fontSize * 0.82;
    const lastC        = continuations[continuations.length - 1];
    const lastAscent   = lastC.ascent ?? lastC.fontSize * 0.82;
    const anchorTop    = anchor.y - anchorAscent;
    const lastBottom   = lastC.y  - lastAscent + lastC.height;

    result.push({
      ...anchor,
      text:         mergedText,
      originalText: mergedText,
      width:        maxRight - anchor.x,
      height:       lastBottom - anchorTop,
      ascent:       anchorAscent,
      isWrapped:    true,
    });
  }

  return result.sort((a, b) => a.y - b.y || a.x - b.x);
}
