"use client";
import { useState, useRef, useCallback } from "react";
import type { EditableTextRun } from "@/types/pdf-editor/EditableTextRun";
import { extractTextRuns, RENDER_SCALE } from "@/core/pdf/TextExtractor";
import { groupRunsIntoLines } from "@/utils/pdf-editor/groupLines";

export { RENDER_SCALE };

export interface PageData {
  runs:   EditableTextRun[];
  width:  number;   // canvas pixels at RENDER_SCALE
  height: number;
  thumb:  string;   // data URL (JPEG thumbnail)
}

export interface PdfLoaderState {
  status: "idle" | "loading" | "ready" | "error";
  error:  string;
  pages:  PageData[];
  numPages: number;
  fileName: string;
  originalBytes: ArrayBuffer | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PdfJs = any;

export function usePdfLoader() {
  const pdfDocRef = useRef<PdfJs>(null);

  const [state, setState] = useState<PdfLoaderState>({
    status: "idle",
    error:  "",
    pages:  [],
    numPages: 0,
    fileName: "",
    originalBytes: null,
  });

  const loadFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setState(s => ({ ...s, error: "Please upload a PDF file." }));
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setState(s => ({ ...s, error: "File too large (max 20 MB)." }));
      return;
    }

    setState({ status: "loading", error: "", pages: [], numPages: 0, fileName: file.name, originalBytes: null });

    try {
      const originalBytes = await file.arrayBuffer();

      const pdfjs: PdfJs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc =
        `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

      const pdfDoc = await pdfjs.getDocument({ data: originalBytes.slice(0) }).promise;
      pdfDocRef.current = pdfDoc;

      const allPages: PageData[] = [];

      for (let i = 0; i < pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i + 1);
        // rotation: 0 normalises the viewport so the page always renders
        // right-side-up regardless of the PDF Rotate attribute. Both this
        // viewport and the PdfCanvas viewport must use the same value so that
        // overlay coordinates match the canvas render.
        const viewport = page.getViewport({ scale: RENDER_SCALE, rotation: 0 });

        const thumbScale = 0.18;
        const tv = page.getViewport({ scale: thumbScale, rotation: 0 });
        const tc = document.createElement("canvas");
        tc.width  = tv.width;
        tc.height = tv.height;
        await page.render({ canvasContext: tc.getContext("2d")!, viewport: tv }).promise;

        // Extract text runs using the new pipeline that leverages tc.styles
        const { runs: rawRuns } = await extractTextRuns(page, pdfjs, i, viewport);

        // Group individual word-level runs into visual line blocks.
        const lineRuns = groupRunsIntoLines(rawRuns, viewport.width);

        allPages.push({
          runs:   lineRuns,
          width:  viewport.width,
          height: viewport.height,
          thumb:  tc.toDataURL("image/jpeg", 0.75),
        });
      }

      setState({
        status:        "ready",
        error:         "",
        pages:         allPages,
        numPages:      pdfDoc.numPages,
        fileName:      file.name,
        originalBytes,
      });
    } catch (err) {
      console.error("[usePdfLoader]", err);
      setState(s => ({ ...s, status: "error", error: "Failed to load PDF." }));
    }
  }, []);

  const reset = useCallback(() => {
    pdfDocRef.current = null;
    setState({ status: "idle", error: "", pages: [], numPages: 0, fileName: "", originalBytes: null });
  }, []);

  return { state, pdfDocRef, loadFile, reset };
}
