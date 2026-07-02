"use client";
import { memo } from "react";
import type { EditableTextRun } from "@/types/pdf-editor/EditableTextRun";
import type { EditOverride } from "@/types/pdf-editor/EditableTextRun";
import { EditableTextRunComponent } from "./EditableTextRun";

interface Props {
  runs:         EditableTextRun[];
  zoom:         number;
  width:        number;
  height:       number;
  activeId:     string | null;
  hoveredId:    string | null;
  edits:        Record<string, EditOverride>;
  customSizes:  Record<string, { w: number; h: number }>;
  onActivate:   (run: EditableTextRun) => void;
  onMouseEnter: (id: string) => void;
  onMouseLeave: () => void;
  onCommit:     (runId: string, text: string) => void;
  onResize:     (runId: string, w: number, h: number) => void;
  onMove:       (runId: string, x: number, y: number) => void;
}

function OverlayLayerInner({
  runs, zoom, width, height,
  activeId, hoveredId, edits, customSizes,
  onActivate, onMouseEnter, onMouseLeave, onCommit, onResize, onMove,
}: Props) {
  return (
    <div
      style={{
        position:      "absolute",
        inset:         0,
        width,
        height,
        overflow:      "visible",
        pointerEvents: "none",
      }}
    >
      {runs
        // Marker runs (bullets, checkboxes, dingbats) are drawn by the PDF
        // canvas and must never be activated for editing — skip their overlay.
        .filter(run => !run.symbolKind)
        .map(run => (
          <div key={run.id} style={{ pointerEvents: "auto" }}>
            <EditableTextRunComponent
              run={run}
              zoom={zoom}
              isActive={activeId  === run.id}
              isHovered={hoveredId === run.id && activeId !== run.id}
              hasEdit={!!edits[run.id]}
              override={edits[run.id] ?? null}
              customSize={customSizes[run.id]}
              onActivate={() => onActivate(run)}
              onMouseEnter={() => onMouseEnter(run.id)}
              onMouseLeave={onMouseLeave}
              onCommit={text => onCommit(run.id, text)}
              onResize={(w, h) => onResize(run.id, w, h)}
              onMove={(x, y) => onMove(run.id, x, y)}
            />
          </div>
        ))
      }
    </div>
  );
}

export const OverlayLayer = memo(OverlayLayerInner);
