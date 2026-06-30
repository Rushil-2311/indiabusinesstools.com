import type { SlipTemplateProps } from "./types";
import { fmtNum, parseAmt, numToWords, MONTHS } from "./types";

export function MinimalTemplate(p: SlipTemplateProps) {
  const allItems = [
    ...p.earnings.map((r) => ({ ...r, cat: "earning" as const })),
    ...p.contributions.map((r) => ({ ...r, cat: "contribution" as const })),
    ...p.deductions.map((r) => ({ ...r, cat: "deduction" as const })),
  ];

  return (
    <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 11, color: "#111", lineHeight: 1.6, background: "#fff", padding: "36px 40px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
        <div>
          {p.logo && <img src={p.logo} alt="" style={{ height: 36, objectFit: "contain", marginBottom: 6, display: "block" }} />}
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 18, fontWeight: 900, letterSpacing: -0.5, color: "#111" }}>{p.companyName}</div>
          {p.companyAddr.split("\n").map((l, i) => (
            <div key={i} style={{ fontSize: 9, color: "#9ca3af" }}>{l}</div>
          ))}
          {p.companyGSTIN && <div style={{ fontSize: 9, color: "#9ca3af" }}>GSTIN: {p.companyGSTIN}</div>}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 10, color: "#9ca3af", letterSpacing: "0.2em", textTransform: "uppercase" }}>Salary Slip</div>
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 14, fontWeight: 700, color: "#374151" }}>{MONTHS[p.month]} {p.year}</div>
        </div>
      </div>

      <div style={{ borderTop: "2px solid #111", marginBottom: 16 }} />

      {/* Employee strip */}
      <div style={{ display: "flex", gap: 28, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 16, fontWeight: 900 }}>{p.empName}</div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{p.designation} · {p.department} · ID: {p.empId}</div>
          <div style={{ fontSize: 10, color: "#9ca3af" }}>Joined: {p.doj}</div>
        </div>
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 10, color: "#6b7280", textAlign: "right" }}>
          <div>Mode: {p.paymentMode}</div>
          <div>Bank: {p.bank}</div>
          {p.ifsc && <div>IFSC: {p.ifsc}</div>}
          {p.accountNo && <div>A/c: ••••{p.accountNo.slice(-4)}</div>}
        </div>
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 10, color: "#6b7280", textAlign: "right" }}>
          <div>Working Days: {p.totalDays}</div>
          <div>Paid Days: {p.paidDays}</div>
          <div>LOP: {p.lopDays}</div>
          {p.pan && <div>PAN: {p.pan}</div>}
        </div>
      </div>

      {/* Unified 4-column salary table: Component | Earnings | Contributions | Deductions */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Arial, sans-serif", marginBottom: 20 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #111" }}>
            <th style={{ padding: "4px 0", textAlign: "left", fontSize: 9, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", width: "34%" }}>Component</th>
            <th style={{ padding: "4px 8px", textAlign: "right", fontSize: 9, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Earnings (A)</th>
            <th style={{ padding: "4px 8px", textAlign: "right", fontSize: 9, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Contributions (B)</th>
            <th style={{ padding: "4px 0 4px 8px", textAlign: "right", fontSize: 9, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Deductions (C)</th>
          </tr>
        </thead>
        <tbody>
          {allItems.map((item, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "4px 0", fontSize: 10, color: "#374151" }}>{item.label}</td>
              <td style={{ padding: "4px 8px", textAlign: "right", fontSize: 10, fontWeight: 600 }}>
                {item.cat === "earning" ? `₹${fmtNum(parseAmt(item.amount))}` : ""}
              </td>
              <td style={{ padding: "4px 8px", textAlign: "right", fontSize: 10, fontWeight: 600 }}>
                {item.cat === "contribution" ? `₹${fmtNum(parseAmt(item.amount))}` : ""}
              </td>
              <td style={{ padding: "4px 0 4px 8px", textAlign: "right", fontSize: 10, fontWeight: 600 }}>
                {item.cat === "deduction" ? `₹${fmtNum(parseAmt(item.amount))}` : ""}
              </td>
            </tr>
          ))}
          <tr style={{ borderTop: "2px solid #111" }}>
            <td style={{ padding: "6px 0", fontWeight: 800, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>Total</td>
            <td style={{ padding: "6px 8px", textAlign: "right", fontWeight: 800, fontSize: 11 }}>₹{fmtNum(p.totalA)}</td>
            <td style={{ padding: "6px 8px", textAlign: "right", fontWeight: 800, fontSize: 11 }}>₹{fmtNum(p.totalB)}</td>
            <td style={{ padding: "6px 0 6px 8px", textAlign: "right", fontWeight: 800, fontSize: 11 }}>₹{fmtNum(p.totalC)}</td>
          </tr>
        </tbody>
      </table>

      {/* Net Pay — big number bottom right */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid #e5e7eb", paddingTop: 16 }}>
        <div style={{ fontSize: 10, color: "#6b7280", maxWidth: "55%" }}>
          <div style={{ marginBottom: 4, fontStyle: "italic" }}>{numToWords(p.netPay)}</div>
          <div style={{ fontSize: 9, color: "#9ca3af" }}>*System-generated. No signature required.</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 9, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>Net Salary (A − B − C)</div>
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 32, fontWeight: 900, color: "#111", letterSpacing: -1, marginTop: 2 }}>₹{fmtNum(p.netPay)}</div>
        </div>
      </div>

      <div style={{ marginTop: 24, textAlign: "right" }}>
        <div style={{ display: "inline-block", textAlign: "center" }}>
          <div style={{ borderTop: "1px solid #9ca3af", paddingTop: 4, width: 140, fontSize: 9, color: "#6b7280" }}>Authorised Signatory</div>
        </div>
      </div>
    </div>
  );
}
