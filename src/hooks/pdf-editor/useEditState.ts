"use client";
import { useState, useCallback, useRef } from "react";
import type { EditOverride } from "@/types/pdf-editor/EditableTextRun";

export function useEditState() {
  const [edits, setEdits]         = useState<Record<string, EditOverride>>({});
  const [activeId, setActiveId]   = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Stable ref so canvas repaint can read edits without stale closure
  const editsRef = useRef<Record<string, EditOverride>>({});

  // Undo/redo history — stored in a ref so mutations don't cause re-renders;
  // canUndo/canRedo are reactive state updated after each mutation.
  const historyRef    = useRef<Array<Record<string, EditOverride>>>([{}]);
  const historyIdxRef = useRef(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const syncRef = useCallback((next: Record<string, EditOverride>) => {
    editsRef.current = next;
  }, []);

  const activateRun = useCallback((runId: string, seed: EditOverride) => {
    setEdits(prev => {
      const next = prev[runId] ? prev : { ...prev, [runId]: seed };
      syncRef(next);
      return next;
    });
    setActiveId(runId);
  }, [syncRef]);

  const updateActive = useCallback((patch: Partial<EditOverride>) => {
    setActiveId(id => {
      if (!id) return id;
      setEdits(prev => {
        const next = { ...prev, [id]: { ...(prev[id] ?? {}), ...patch } };
        syncRef(next);
        return next;
      });
      return id;
    });
  }, [syncRef]);

  // commitRun uses editsRef (always current) to avoid the setEdits-callback form,
  // so we can push to history synchronously before setting state.
  const commitRun = useCallback((runId: string, text: string, w?: number) => {
    const current = editsRef.current[runId] ?? {};
    const next = {
      ...editsRef.current,
      [runId]: { ...current, text, ...(w != null ? { w } : {}) },
    };

    // Discard redo tree, push new snapshot
    historyRef.current = historyRef.current.slice(0, historyIdxRef.current + 1);
    historyRef.current.push(next);
    historyIdxRef.current = historyRef.current.length - 1;

    setEdits(next);
    syncRef(next);
    setActiveId(null);
    setCanUndo(historyIdxRef.current > 0);
    setCanRedo(false);
  }, [syncRef]);

  const undo = useCallback(() => {
    if (historyIdxRef.current <= 0) return;
    const newIdx = historyIdxRef.current - 1;
    const prev   = historyRef.current[newIdx];
    historyIdxRef.current = newIdx;
    setEdits(prev);
    syncRef(prev);
    setActiveId(null);
    setCanUndo(newIdx > 0);
    setCanRedo(true);
  }, [syncRef]);

  const redo = useCallback(() => {
    if (historyIdxRef.current >= historyRef.current.length - 1) return;
    const newIdx = historyIdxRef.current + 1;
    const next   = historyRef.current[newIdx];
    historyIdxRef.current = newIdx;
    setEdits(next);
    syncRef(next);
    setActiveId(null);
    setCanUndo(true);
    setCanRedo(newIdx < historyRef.current.length - 1);
  }, [syncRef]);

  const deactivate = useCallback(() => setActiveId(null), []);

  const reset = useCallback(() => {
    setEdits({});
    editsRef.current    = {};
    historyRef.current  = [{}];
    historyIdxRef.current = 0;
    setActiveId(null);
    setHoveredId(null);
    setCanUndo(false);
    setCanRedo(false);
  }, []);

  const activeOverride: EditOverride | null =
    activeId ? (edits[activeId] ?? null) : null;

  return {
    edits, editsRef, activeId, hoveredId,
    setHoveredId, activeOverride,
    activateRun, updateActive, commitRun, deactivate, reset,
    undo, redo, canUndo, canRedo,
  };
}
