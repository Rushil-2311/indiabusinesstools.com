"use client";
import { useRef, useEffect, memo } from "react";
import type { EditableTextRun as RunData, EditOverride } from "@/types/pdf-editor/EditableTextRun";
import { buildFontCss } from "@/utils/pdf-editor/font";

interface Props {
  run:          RunData;
  zoom:         number;
  isActive:     boolean;
  isHovered:    boolean;
  hasEdit:      boolean;
  override:     EditOverride | null;
  customSize:   { w: number; h: number } | undefined;
  onActivate:   () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onCommit:     (text: string) => void;
  onResize:     (w: number, h: number) => void;
  onMove:       (x: number, y: number) => void;
}

function EditableTextRunInner({
  run, zoom,
  isActive, isHovered, hasEdit, override, customSize,
  onActivate, onMouseEnter, onMouseLeave, onCommit, onResize, onMove,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editRef      = useRef<HTMLDivElement>(null);

  const latestTextRef = useRef<string>(override?.text ?? run.originalText);
  const prevActiveRef = useRef<boolean>(false);

  // Commit on deactivation
  useEffect(() => {
    const wasActive = prevActiveRef.current;
    prevActiveRef.current = isActive;
    if (wasActive && !isActive) onCommit(latestTextRef.current);
  });

  // Seed DOM + track keystrokes
  useEffect(() => {
    if (!isActive || !editRef.current) return;
    const initialText = override?.text ?? run.originalText;
    editRef.current.textContent = initialText;
    latestTextRef.current = initialText;
    const el = editRef.current;
    const onInput = () => { latestTextRef.current = el.textContent ?? ""; };
    el.addEventListener("input", onInput);
    return () => el.removeEventListener("input", onInput);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  // Auto-focus
  useEffect(() => {
    if (!isActive || !editRef.current) return;
    const el = editRef.current;
    el.focus();
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
  }, [isActive]);

  // Report size changes (text wrapping changes height)
  useEffect(() => {
    if (!isActive || !editRef.current) return;
    const ro = new ResizeObserver(() => {
      if (!containerRef.current || !editRef.current) return;
      onResize(containerRef.current.offsetWidth, editRef.current.offsetHeight);
    });
    ro.observe(editRef.current);
    return () => ro.disconnect();
  }, [isActive, onResize]);

  // Resolved values
  const fontFamily = override?.fontFamily ?? run.fontFamily;
  const fontWeight = override?.fontWeight ?? run.fontWeight;
  const fontStyle  = override?.fontStyle  ?? run.fontStyle;
  const fontSizePx = (override?.fontSize  ?? run.fontSize) * zoom;
  const color      = override?.color      ?? run.color;

  const ascentPx = (run.ascent ?? run.fontSize * 0.82) * zoom;
  const origH    = run.height * zoom;
  const origW    = run.width  * zoom;

  // Width: prefer saved override.w, then customSize, then origW
  const dispW = override?.w != null
    ? Math.max(override.w * zoom, 30)
    : customSize
    ? Math.max(customSize.w, 30)
    : origW;

  const dispH = customSize ? Math.max(customSize.h, origH) : origH;

  // Position from drag-saved baseline coords when available
  const cssLeft = (override?.x ?? run.x) * zoom;
  const cssTop  = (override?.y != null ? override.y * zoom - ascentPx : run.y * zoom - ascentPx);

  const hasRot = Math.abs(run.rotation) > 0.5;
  const rotStyle: React.CSSProperties = hasRot
    ? { transform: `rotate(${run.rotation}deg)`, transformOrigin: `0px ${ascentPx}px` }
    : {};

  const fontCss = buildFontCss({ fontFamily, fontWeight, fontStyle, fontSize: fontSizePx });

  // ── Move drag via the border overlay ────────────────────────────────────────
  // The border overlay extends 4 px outside the contenteditable.
  // That rim is where cursor:move shows and drag-start fires — the
  // contenteditable's stopPropagation never reaches this outer rim.
  const handleMoveStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = containerRef.current;
    if (!el) return;
    const startX   = e.clientX;
    const startY   = e.clientY;
    const origLeft = el.offsetLeft;
    const origTop  = el.offsetTop;

    const onMouseMove = (me: MouseEvent) => {
      if (!containerRef.current) return;
      containerRef.current.style.left = `${origLeft + (me.clientX - startX)}px`;
      containerRef.current.style.top  = `${origTop  + (me.clientY - startY)}px`;
    };
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      if (!containerRef.current) return;
      const newLeft = parseFloat(containerRef.current.style.left);
      const newTop  = parseFloat(containerRef.current.style.top);
      onMove(newLeft / zoom, (newTop + ascentPx) / zoom);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // ── Right circle ─────────────────────────────────────────────────────────
  const handleRightResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = containerRef.current;
    if (!el) return;
    const startX   = e.clientX;
    const origW_el = el.offsetWidth;
    const onMouseMove = (me: MouseEvent) => {
      if (!containerRef.current) return;
      containerRef.current.style.width = `${Math.max(origW_el + (me.clientX - startX), 30)}px`;
    };
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      if (!containerRef.current) return;
      onResize(containerRef.current.offsetWidth, editRef.current?.offsetHeight ?? origH);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // ── Left circle ───────────────────────────────────────────────────────────
  const handleLeftResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = containerRef.current;
    if (!el) return;
    const startX    = e.clientX;
    const origLeft_ = el.offsetLeft;
    const origW_el  = el.offsetWidth;
    const onMouseMove = (me: MouseEvent) => {
      if (!containerRef.current) return;
      const dx   = me.clientX - startX;
      const newW = Math.max(origW_el - dx, 30);
      const newL = origLeft_ + (origW_el - newW);
      containerRef.current.style.left  = `${newL}px`;
      containerRef.current.style.width = `${newW}px`;
    };
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      if (!containerRef.current) return;
      const newLeft  = parseFloat(containerRef.current.style.left);
      const newTop   = containerRef.current.offsetTop;
      const newWidth = containerRef.current.offsetWidth;
      onMove(newLeft / zoom, (newTop + ascentPx) / zoom);
      onResize(newWidth, editRef.current?.offsetHeight ?? origH);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // ── Active: transparent editing box ──────────────────────────────────────
  if (isActive) {
    return (
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          left:     cssLeft,
          top:      cssTop,
          width:    dispW,
          zIndex:   20,
          ...rotStyle,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Border overlay: rim outside contenteditable — cursor:move zone.
            Extends 4px on top/left/right but NOT below, so the blue border
            line doesn't appear as a strikethrough on the next paragraph. */}
        <div
          style={{
            position:      "absolute",
            top:           -4,
            left:          -4,
            right:         -4,
            bottom:        0,
            border:        "1.5px solid #2563EB",
            borderRadius:  3,
            cursor:        "move",
            zIndex:        0,
            pointerEvents: "auto",
          }}
          onMouseDown={handleMoveStart}
        />

        <div style={{ position: "relative" }}>
          {/*
            Transparent contenteditable.
            Canvas already erased the original text with a white rectangle,
            so the page background shows through giving the "editing in place"
            appearance without a visible solid box.
          */}
          <div
            ref={editRef}
            contentEditable
            suppressContentEditableWarning
            style={{
              position:     "relative",
              zIndex:       1,
              width:        "100%",
              minHeight:    origH,
              padding:      0,
              margin:       0,
              border:       "none",
              outline:      "none",
              background:   "transparent",
              cursor:       "text",
              userSelect:   "text",
              boxSizing:    "border-box",
              font:         fontCss,
              color:        color || "#000000",
              whiteSpace:   "pre-wrap",
              overflowWrap: "break-word",
              wordBreak:    "break-word",
              lineHeight:   "1.35",
              letterSpacing: run.charSpacing * zoom > 0
                ? `${run.charSpacing * zoom}px`
                : undefined,
              direction:    run.direction as "ltr" | "rtl",
            }}
            onMouseDown={e => e.stopPropagation()}
            onKeyDown={e => {
              if (e.key === "Escape") {
                latestTextRef.current = e.currentTarget.textContent ?? latestTextRef.current;
                onCommit(latestTextRef.current);
              }
            }}
          />

          {/* Left dot */}
          <div
            style={{
              position:     "absolute",
              left:         -7,
              top:          "50%",
              transform:    "translateY(-50%)",
              width:        13,
              height:       13,
              borderRadius: "50%",
              background:   "#2563EB",
              cursor:       "ew-resize",
              zIndex:       2,
              boxShadow:    "0 0 0 2px #fff",
            }}
            onMouseDown={handleLeftResize}
          />

          {/* Right dot */}
          <div
            style={{
              position:     "absolute",
              right:        -7,
              top:          "50%",
              transform:    "translateY(-50%)",
              width:        13,
              height:       13,
              borderRadius: "50%",
              background:   "#2563EB",
              cursor:       "ew-resize",
              zIndex:       2,
              boxShadow:    "0 0 0 2px #fff",
            }}
            onMouseDown={handleRightResize}
          />
        </div>
      </div>
    );
  }

  // ── Inactive: transparent click-target ───────────────────────────────────
  // Canvas handles drawing the committed text — overlay is only a click target.
  return (
    <div
      title={run.originalText}
      onClick={e => { e.stopPropagation(); onActivate(); }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position:      "absolute",
        left:          cssLeft,
        top:           cssTop,
        width:         Math.max(dispW, 8),
        height:        dispH,
        cursor:        "text",
        zIndex:        2,
        background:    "transparent",
        outline: hasEdit
          ? "1px solid rgba(37,99,235,0.4)"
          : isHovered
          ? "1px dashed rgba(37,99,235,0.35)"
          : "none",
        outlineOffset: "1px",
        borderRadius:  1,
        ...rotStyle,
        boxSizing:     "border-box",
      }}
    />
  );
}

export const EditableTextRunComponent = memo(EditableTextRunInner);
