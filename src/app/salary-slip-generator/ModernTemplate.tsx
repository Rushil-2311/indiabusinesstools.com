import type { SlipTemplateProps } from "./types";
import { fmtNum, parseAmt, numToWords, SHORT_MONTHS } from "./types";

export function ModernTemplate(p: SlipTemplateProps) {
  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 11, lineHeight: 1.5, display: "flex", background: "#fff", minHeight: 700 }}>
      {/* Left sidebar — white with right border */}
      <div style={{ width: 200, borderRight: "1px solid #e5e7eb", color: "#111", padding: "28px 20px", display: "flex", flexDirection: "column", gap: 20, flexShrink: 0 }}>
        {p.logo && (
          <img src={p.logo} alt="" style={{ height: 48, objectFit: "contain", border: "1px solid #e5e7eb", padding: 4, borderRadius: 4 }} />
        )}
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, lineHeight: 1.3 }}>{p.companyName || "Company Name"}</div>
          {p.companyAddr.split("\n").map((l, i) => (
            <div key={i} style={{ fontSize: 9, color: "#6b7280", marginTop: 2 }}>{l}</div>
          ))}
          {p.companyGSTIN && <div style={{ fontSize: 9, color: "#6b7280" }}>GSTIN: {p.companyGSTIN}</div>}
        </div>

        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 16 }}>
          <div style={{ fontSize: 9, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Pay Period</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#111" }}>{SHORT_MONTHS[p.month]}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#6b7280" }}>{p.year}</div>
        </div>

        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 16 }}>
          <div style={{ fontSize: 9, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Attendance</div>
          {[
            { label: "Working Days", v: String(p.totalDays) },
            { label: "Paid Days", v: p.paidDays },
            { label: "LOP Days", v: p.lopDays },
          ].map((c) => (
            <div key={c.label} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 9, color: "#9ca3af" }}>{c.label}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>{c.v}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "auto", fontSize: 9, color: "#d1d5db" }}>IndianBusinessTools.com</div>
      </div>

      {/* Right content */}
      <div style={{ flex: 1, padding: "28px 28px" }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 9, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Employee</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#111", marginTop: 2 }}>{p.empName}</div>
          <div style={{ color: "#4b5563", fontSize: 11 }}>{p.designation} &bull; {p.department}</div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
          <tbody>
            {[
              [{ label: "Employee ID", v: p.empId }, { label: "Date of Joining", v: p.doj }],
              [{ label: "Payment Mode", v: p.paymentMode }, { label: "Bank", v: p.bank }],
              [
                { label: "Account No.", v: p.accountNo ? "••••" + p.accountNo.slice(-4) : "NA" },
                { label: "IFSC", v: p.ifsc || "NA" },
              ],
              [
                { label: "PAN", v: p.pan || "NA" },
                { label: "UAN / PF", v: [p.uan, p.pfNumber].filter(Boolean).join(" / ") || "NA" },
              ],
            ].map((row, ri) => (
              <tr key={ri} style={{ borderBottom: "1px solid #f3f4f6" }}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{ padding: "5px 8px 5px 0", width: "50%", verticalAlign: "top" }}>
                    <div style={{ fontSize: 9, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.04em" }}>{cell.label}</div>
                    <div style={{ fontWeight: 600, fontSize: 11 }}>{cell.v || "—"}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Earnings + Deductions two-column */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ width: "48%", verticalAlign: "top", paddingRight: 16, borderRight: "1px solid #e5e7eb" }}>
                <div style={{ color: "#374151", fontWeight: 800, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Earnings</div>
                {p.earnings.map((e, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid #f3f4f6", fontSize: 10 }}>
                    <span style={{ color: "#374151" }}>{e.label}</span>
                    <span style={{ fontWeight: 600 }}>₹{fmtNum(parseAmt(e.amount))}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", marginTop: 4, borderTop: "2px solid #111", fontWeight: 800, fontSize: 10 }}>
                  <span>Total (A)</span><span>₹{fmtNum(p.totalA)}</span>
                </div>
              </td>
              <td style={{ verticalAlign: "top", paddingLeft: 16 }}>
                <div style={{ color: "#374151", fontWeight: 800, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Contributions</div>
                {p.contributions.map((c, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid #f3f4f6", fontSize: 10 }}>
                    <span style={{ color: "#374151" }}>{c.label}</span>
                    <span style={{ fontWeight: 600 }}>₹{fmtNum(parseAmt(c.amount))}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderTop: "1px solid #e5e7eb", fontWeight: 700, fontSize: 10, marginTop: 2, marginBottom: 10 }}>
                  <span>Total (B)</span><span>₹{fmtNum(p.totalB)}</span>
                </div>
                <div style={{ color: "#374151", fontWeight: 800, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Taxes &amp; Deductions</div>
                {p.deductions.map((d, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid #f3f4f6", fontSize: 10 }}>
                    <span style={{ color: "#374151" }}>{d.label}</span>
                    <span style={{ fontWeight: 600 }}>₹{fmtNum(parseAmt(d.amount))}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderTop: "1px solid #e5e7eb", fontWeight: 700, fontSize: 10, marginTop: 2 }}>
                  <span>Total (C)</span><span>₹{fmtNum(p.totalC)}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Net Pay */}
        <div style={{ marginTop: 16, border: "1px solid #e5e7eb", borderRadius: 8, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Net Salary Payable (A − B − C)</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#111", marginTop: 2 }}>₹ {fmtNum(p.netPay)}</div>
            <div style={{ fontSize: 9, color: "#6b7280", fontStyle: "italic", marginTop: 4 }}>{numToWords(p.netPay)}</div>
          </div>
          <div style={{ textAlign: "right", fontSize: 10, color: "#6b7280" }}>
            <div>Gross: ₹{fmtNum(p.totalA)}</div>
            <div>- Contributions: ₹{fmtNum(p.totalB)}</div>
            <div>- Deductions: ₹{fmtNum(p.totalC)}</div>
          </div>
        </div>

        <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: 9, color: "#9ca3af" }}>*System-generated. No signature required.</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ borderTop: "1px solid #d1d5db", paddingTop: 4, width: 140, fontSize: 9, color: "#6b7280" }}>Authorised Signatory</div>
          </div>
        </div>
      </div>
    </div>
  );
}
