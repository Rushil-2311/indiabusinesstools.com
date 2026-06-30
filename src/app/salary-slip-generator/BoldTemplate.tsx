import type { SlipTemplateProps } from "./types";
import { fmtNum, parseAmt, numToWords, MONTHS } from "./types";

export function BoldTemplate(p: SlipTemplateProps) {
  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 11, lineHeight: 1.5, background: "#fff" }}>
      {/* Header — white with bottom border */}
      <div style={{ padding: "28px 32px", borderBottom: "2px solid #111" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 4 }}>
              Salary Slip &middot; {MONTHS[p.month]} {p.year}
            </div>
            <div style={{ fontSize: 11, color: "#374151", fontWeight: 700 }}>{p.companyName}</div>
            {p.companyAddr.split("\n").map((l, i) => (
              <div key={i} style={{ fontSize: 9, color: "#9ca3af" }}>{l}</div>
            ))}
            {p.companyGSTIN && <div style={{ fontSize: 9, color: "#9ca3af" }}>GSTIN: {p.companyGSTIN}</div>}
          </div>
          {p.logo && (
            <img src={p.logo} alt="" style={{ height: 44, objectFit: "contain", border: "1px solid #e5e7eb", padding: 4, borderRadius: 4 }} />
          )}
        </div>

        {/* Employee + Net Pay */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 20 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5, color: "#111" }}>{p.empName}</div>
            <div style={{ color: "#6b7280", fontSize: 11 }}>{p.designation} &bull; {p.department}</div>
            <div style={{ color: "#9ca3af", fontSize: 10, marginTop: 4 }}>ID: {p.empId} &bull; Joined: {p.doj}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>Net Pay</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#111", letterSpacing: -1 }}>₹{fmtNum(p.netPay)}</div>
          </div>
        </div>

        {/* Attendance — bordered chips */}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          {[
            { l: "Working Days", v: String(p.totalDays) },
            { l: "Paid Days", v: p.paidDays },
            { l: "LOP", v: p.lopDays },
          ].map((c) => (
            <div key={c.l} style={{ border: "1px solid #e5e7eb", borderRadius: 6, padding: "6px 14px", fontSize: 10 }}>
              <div style={{ color: "#9ca3af" }}>{c.l}</div>
              <div style={{ fontWeight: 800, fontSize: 14, color: "#111" }}>{c.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "24px 32px" }}>
        {/* Bank & PAN details */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #e5e7eb" }}>
          {[
            { l: "Payment Mode", v: p.paymentMode }, { l: "Bank", v: p.bank },
            { l: "Account No.", v: p.accountNo ? "••••" + p.accountNo.slice(-4) : "NA" },
            { l: "IFSC", v: p.ifsc || "NA" },
            { l: "PAN", v: p.pan || "NA" }, { l: "UAN", v: p.uan || "NA" },
          ].map((f) => (
            <div key={f.l} style={{ minWidth: 90 }}>
              <div style={{ fontSize: 9, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.04em" }}>{f.l}</div>
              <div style={{ fontWeight: 600, fontSize: 11 }}>{f.v || "—"}</div>
            </div>
          ))}
        </div>

        {/* Earnings | Deductions */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ width: "48%", verticalAlign: "top", paddingRight: 20, borderRight: "1px solid #e5e7eb" }}>
                <div style={{ color: "#374151", fontWeight: 800, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Earnings</div>
                {p.earnings.map((e, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid #f9fafb", fontSize: 10 }}>
                    <span style={{ color: "#374151" }}>{e.label}</span>
                    <span style={{ fontWeight: 600 }}>₹{fmtNum(parseAmt(e.amount))}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", marginTop: 4, borderTop: "2px solid #111", fontWeight: 800, fontSize: 10 }}>
                  <span>Total (A)</span><span>₹{fmtNum(p.totalA)}</span>
                </div>
              </td>
              <td style={{ verticalAlign: "top", paddingLeft: 20 }}>
                <div style={{ color: "#374151", fontWeight: 800, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Contributions</div>
                {p.contributions.map((c, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid #f9fafb", fontSize: 10 }}>
                    <span style={{ color: "#374151" }}>{c.label}</span>
                    <span style={{ fontWeight: 600 }}>₹{fmtNum(parseAmt(c.amount))}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderTop: "1px solid #e5e7eb", fontWeight: 700, fontSize: 10, marginTop: 2, marginBottom: 12 }}>
                  <span>Total (B)</span><span>₹{fmtNum(p.totalB)}</span>
                </div>
                <div style={{ color: "#374151", fontWeight: 800, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Taxes &amp; Deductions</div>
                {p.deductions.map((d, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid #f9fafb", fontSize: 10 }}>
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

        {/* Net Pay — bordered */}
        <div style={{ marginTop: 16, border: "2px solid #111", borderRadius: 8, padding: "10px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 9, color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Net Salary (A − B − C)</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#111" }}>₹ {fmtNum(p.netPay)}</div>
            </div>
            <div style={{ fontSize: 10, color: "#6b7280", textAlign: "right" }}>
              <div>Gross: ₹{fmtNum(p.totalA)}</div>
              <div>- Contributions: ₹{fmtNum(p.totalB)}</div>
              <div>- Deductions: ₹{fmtNum(p.totalC)}</div>
            </div>
          </div>
          <div style={{ marginTop: 6, borderTop: "1px solid #e5e7eb", paddingTop: 6, fontSize: 9, fontStyle: "italic", color: "#6b7280" }}>
            {numToWords(p.netPay)}
          </div>
        </div>

        <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: 9, color: "#9ca3af" }}>*System-generated. No signature required.</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ borderTop: "1px solid #9ca3af", paddingTop: 4, width: 140, fontSize: 9, color: "#6b7280" }}>Authorised Signatory</div>
          </div>
        </div>
      </div>
    </div>
  );
}
