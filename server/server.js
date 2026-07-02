/**
 * PDF API Server — IndianBusinessTools.com
 *
 * Runs on DigitalOcean Droplet with LibreOffice installed.
 * Two endpoints:
 *   POST /convert  — PDF  →  HTML  (LibreOffice converts, returns HTML string)
 *   POST /export   — HTML →  PDF   (LibreOffice converts, streams PDF back)
 *   GET  /health   — returns { status: "ok" }
 */

const express = require("express");
const multer  = require("multer");
const { exec } = require("child_process");
const fs   = require("fs");
const path = require("path");
const os   = require("os");
const cors = require("cors");

const app = express();

// ── CORS: only allow requests from your website ───────────────────────────────
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean)
  .concat([
    "https://www.indiabusinesstools.com",
    "https://indiabusinesstools.com",
    "http://localhost:3000",
    "http://localhost:3001",
  ]);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow server-to-server (no origin) or listed origins
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    methods: ["GET", "POST", "OPTIONS"],
  })
);

app.use(express.json({ limit: "15mb" }));

// ── Multer: save uploaded file to /tmp/uploads ────────────────────────────────
const upload = multer({
  dest: "/tmp/pdf-uploads/",
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are accepted"));
    }
  },
});

// ── Utility: run a shell command with a timeout ───────────────────────────────
function runCmd(cmd, timeoutMs = 90_000) {
  return new Promise((resolve, reject) => {
    exec(cmd, { timeout: timeoutMs, maxBuffer: 50 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) reject(new Error(stderr || err.message));
      else resolve(stdout);
    });
  });
}

// ── Utility: clean up temp files silently ────────────────────────────────────
function cleanup(...paths) {
  for (const p of paths) {
    try {
      if (!p) continue;
      const stat = fs.statSync(p);
      if (stat.isDirectory()) fs.rmSync(p, { recursive: true, force: true });
      else fs.unlinkSync(p);
    } catch {
      // ignore
    }
  }
}

// ── GET /health ───────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── POST /convert ─────────────────────────────────────────────────────────────
// Receives a PDF, converts it to HTML with LibreOffice, returns the HTML string.
// The browser loads this HTML into TipTap so the user can edit it.
app.post("/convert", upload.single("pdf"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // LibreOffice requires the file to have a .pdf extension to detect the format.
  const id        = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const inputPath = `/tmp/pdf_in_${id}.pdf`;
  const outputDir = `/tmp/pdf_out_${id}`;

  try {
    // Rename multer's hash-named temp file to one with .pdf extension
    fs.renameSync(req.file.path, inputPath);
    fs.mkdirSync(outputDir, { recursive: true });

    // Run LibreOffice headless conversion: PDF → HTML
    const cmd = `libreoffice --headless --convert-to html --outdir "${outputDir}" "${inputPath}"`;
    await runCmd(cmd);

    // LibreOffice names the output file: <basename>.html
    const baseName = path.basename(inputPath, ".pdf");
    const htmlPath = path.join(outputDir, `${baseName}.html`);

    if (!fs.existsSync(htmlPath)) {
      throw new Error(
        "LibreOffice produced no output. The PDF may be scanned (image-only) or corrupted."
      );
    }

    const html = fs.readFileSync(htmlPath, "utf8");
    res.json({ html });
  } catch (err) {
    console.error("[/convert]", err.message);
    res.status(500).json({ error: err.message || "Conversion failed" });
  } finally {
    cleanup(inputPath, outputDir);
  }
});

// ── POST /export ──────────────────────────────────────────────────────────────
// Receives edited HTML, converts it to PDF with LibreOffice, streams PDF back.
app.post("/export", async (req, res) => {
  const { html, fileName } = req.body;

  if (!html) {
    return res.status(400).json({ error: "No HTML content provided" });
  }

  const id      = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const tmpHtml = `/tmp/pdf_exp_${id}.html`;
  const tmpPdf  = `/tmp/pdf_exp_${id}.pdf`;

  try {
    fs.writeFileSync(tmpHtml, html, "utf8");

    // Run LibreOffice headless conversion: HTML → PDF
    const cmd = `libreoffice --headless --convert-to pdf --outdir /tmp "${tmpHtml}"`;
    await runCmd(cmd);

    if (!fs.existsSync(tmpPdf)) {
      throw new Error("LibreOffice did not produce a PDF output.");
    }

    // Sanitise the output filename
    const outName = (fileName || "document")
      .replace(/\.pdf$/i, "-edited.pdf")
      .replace(/[^\w.\-]/g, "_");

    res.setHeader("Content-Disposition", `attachment; filename="${outName}"`);
    res.setHeader("Content-Type", "application/pdf");

    const stream = fs.createReadStream(tmpPdf);
    stream.pipe(res);
    stream.on("close", () => cleanup(tmpHtml, tmpPdf));
    stream.on("error", (e) => {
      cleanup(tmpHtml, tmpPdf);
      console.error("[/export stream]", e.message);
    });
  } catch (err) {
    cleanup(tmpHtml, tmpPdf);
    console.error("[/export]", err.message);
    res.status(500).json({ error: err.message || "Export failed" });
  }
});

// ── POST /render-pdf ──────────────────────────────────────────────────────────
// Receives base64 JPEG page images, converts each to a single-page PDF with
// LibreOffice, then merges them all into one PDF and streams it back.
app.post("/render-pdf", async (req, res) => {
  const { images, fileName } = req.body;
  if (!Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: "No images provided" });
  }

  const id     = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const tmpDir = path.join(os.tmpdir(), `rpdf_${id}`);

  try {
    fs.mkdirSync(tmpDir, { recursive: true });

    // Write each base64 JPEG to disk
    const jpgPaths = images.map((b64, i) => {
      const p = path.join(tmpDir, `page${String(i).padStart(4, "0")}.jpg`);
      fs.writeFileSync(p, Buffer.from(b64, "base64"));
      return p;
    });

    // Convert each JPEG → PDF via LibreOffice
    const pdfPaths = [];
    for (const jpgPath of jpgPaths) {
      await runCmd(`libreoffice --headless --convert-to pdf --outdir "${tmpDir}" "${jpgPath}"`, 30_000);
      const pdfPath = jpgPath.replace(".jpg", ".pdf");
      if (fs.existsSync(pdfPath)) pdfPaths.push(pdfPath);
    }
    if (!pdfPaths.length) throw new Error("LibreOffice produced no PDF output");

    let outputPath = pdfPaths[0];
    if (pdfPaths.length > 1) {
      outputPath = path.join(tmpDir, "merged.pdf");
      // Try pdfunite (poppler-utils), then ghostscript
      try {
        await runCmd(`pdfunite ${pdfPaths.join(" ")} "${outputPath}"`);
      } catch {
        try {
          await runCmd(`gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -sOutputFile="${outputPath}" ${pdfPaths.join(" ")}`);
        } catch {
          outputPath = pdfPaths[0]; // fallback: return first page only
        }
      }
    }

    const outName = ((fileName || "document").replace(/\.pdf$/i, "") + "-edited.pdf")
      .replace(/[^\w.\-]/g, "_");

    res.setHeader("Content-Disposition", `attachment; filename="${outName}"`);
    res.setHeader("Content-Type", "application/pdf");
    const stream = fs.createReadStream(outputPath);
    stream.pipe(res);
    stream.on("close", () => setTimeout(() => cleanup(tmpDir), 8_000));
    stream.on("error", e => { cleanup(tmpDir); console.error("[/render-pdf stream]", e.message); });
  } catch (err) {
    cleanup(tmpDir);
    console.error("[/render-pdf]", err.message);
    res.status(500).json({ error: err.message || "PDF creation failed" });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`PDF API server listening on port ${PORT}`);
  console.log(`Allowed origins: ${ALLOWED_ORIGINS.join(", ")}`);
});
