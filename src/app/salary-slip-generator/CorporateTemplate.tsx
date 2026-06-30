import type { SlipTemplateProps } from "./types";
import { fmtNum, parseAmt, numToWords, MONTHS } from "./types";

export function CorporateTemplate(p: SlipTemplateProps) {
  const maxRows = Math.max(p.earnings.length, p.contributions.length, p.deductions.length);

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 11, color: "#111", lineHeight: 1.5, background: "#fff" }}>
      {/* Centered letterhead */}
      <div style={{ textAlign: "center", padding: "24px 32px 16px", borderBottom: "3px solid #111" }}>
        {p.logo && <img src={p.logo} alt="" style={{ height: 52, objectFit: "contain", marginBottom: 8 }} />}
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "0.04em" }}>{p.companyName}</div>
        {p.companyAddr.split("\n").map((l, i) => (
          <div key={i} style={{ fontSize: 10, color: "#6b7280" }}>{l}</div>
        ))}
        {p.companyGSTIN && <div style={{ fontSize: 10, color: "#6b7280" }}>GSTIN: {p.companyGSTIN}</div>}
      </div>

      {/* Info strip — border only */}
      <div style={{ borderBottom: "1px solid #e5e7eb", padding: "8px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 800, letterSpacing: "0.1em", fontSize: 11 }}>SALARY SLIP</div>
        <div style={{ fontSize: 11, fontWeight: 700 }}>{MONTHS[p.month].toUpperCase()} {p.year}</div>
      </div>

      <div style={{ padding: "20px 32px" }}>
        {/* Employee + Payment two-column */}
        <div style={{ display: "flex", gap: 24, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 8 }}>Employee Details</div>
            <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>{p.empName}</div>
            {[
              { l: "Employee ID", v: p.empId }, { l: "Designation", v: p.designation },
              { l: "Department", v: p.department }, { l: "Date of Joining", v: p.doj },
              { l: "PAN", v: p.pan || "NA" }, { l: "UAN", v: p.uan || "NA" },
            ].map((f) => (
              <div key={f.l} style={{ display: "flex", fontSize: 10, marginBottom: 3 }}>
                <span style={{ width: 120, color: "#6b7280", flexShrink: 0 }}>{f.l}</span>
                <span style={{ fontWeight: 600 }}>{f.v || "—"}</span>
              </div>
            ))}
          </div>
          <div style={{ width: 220, flexShrink: 0 }}>
            <div style={{ fontSize: 9, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 8 }}>Payment Details</div>
            {[
              { l: "Payment Mode", v: p.paymentMode }, { l: "Bank", v: p.bank },
              { l: "IFSC", v: p.ifsc || "NA" },
              { l: "Account No.", v: p.accountNo ? "••••" + p.accountNo.slice(-4) : "NA" },
              { l: "PF Number", v: p.pfNumber || "NA" },
            ].map((f) => (
              <div key={f.l} style={{ display: "flex", fontSize: 10, marginBottom: 3 }}>
                <span style={{ width: 100, color: "#6b7280", flexShrink: 0 }}>{f.l}</span>
                <span style={{ fontWeight: 600 }}>{f.v || "—"}</span>
              </div>
            ))}
            <div style={{ marginTop: 12, border: "1px solid #e5e7eb", borderRadius: 4, padding: "8px 10px" }}>
              <div style={{ fontSize: 9, color: "#374151", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Attendance</div>
              {[
                { l: "Working Days", v: String(p.totalDays) }, { l: "Paid Days", v: p.paidDays }, { l: "LOP", v: p.lopDays },
              ].map((f) => (
                <div key={f.l} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 2 }}>
                  <span style={{ color: "#6b7280" }}>{f.l}</span>
                  <span style={{ fontWeight: 700 }}>{f.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3-column salary table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #111" }}>
              <th style={{ padding: "6px 8px", textAlign: "left", fontSize: 10, fontWeight: 700, width: "34%", color: "#374151" }}>EARNINGS</th>
              <th style={{ padding: "6px 8px", textAlign: "left", fontSize: 10, fontWeight: 700, width: "33%", color: "#374151" }}>CONTRIBUTIONS</th>
              <th style={{ padding: "6px 8px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#374151" }}>TAXES &amp; DEDUCTIONS</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxRows }).map((_, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "4px 8px", fontSize: 10 }}>
                  {p.earnings[i] && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#374151" }}>{p.earnings[i].label}</span>
                      <span style={{ fontWeight: 600 }}>₹{fmtNum(parseAmt(p.earnings[i].amount))}</span>
                    </div>
                  )}
                </td>
                <td style={{ padding: "4px 8px", fontSize: 10 }}>
                  {p.contributions[i] && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#374151" }}>{p.contributions[i].label}</span>
                      <span style={{ fontWeight: 600 }}>₹{fmtNum(parseAmt(p.contributions[i].amount))}</span>
                    </div>
                  )}
                </td>
                <td style={{ padding: "4px 8px", fontSize: 10 }}>
                  {p.deductions[i] && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#374151" }}>{p.deductions[i].label}</span>
                      <span style={{ fontWeight: 600 }}>₹{fmtNum(parseAmt(p.deductions[i].amount))}</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            <tr style={{ fontWeight: 700, borderTop: "2px solid #111" }}>
              <td style={{ padding: "6px 8px", fontSize: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Total (A)</span><span>₹{fmtNum(p.totalA)}</span>
                </div>
              </td>
              <td style={{ padding: "6px 8px", fontSize: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Total (B)</span><span>₹{fmtNum(p.totalB)}</span>
                </div>
              </td>
              <td style={{ padding: "6px 8px", fontSize: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Total (C)</span><span>₹{fmtNum(p.totalC)}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Net Pay — border only */}
        <div style={{ border: "2px solid #111", borderRadius: 6, padding: "12px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 9, color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Net Salary Payable (A − B − C)</div>
              <div style={{ fontSize: 24, fontWeight: 900, marginTop: 2 }}>₹ {fmtNum(p.netPay)}</div>
              <div style={{ fontSize: 9, color: "#6b7280", fontStyle: "italic", marginTop: 4 }}>{numToWords(p.netPay)}</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: 9, color: "#9ca3af" }}>*System-generated. No signature required.</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ borderTop: "1px solid #9ca3af", paddingTop: 4, width: 140, fontSize: 9, color: "#6b7280" }}>Authorised Signatory</div>
          </div>
        </div>
      </div>
    </div>
  );
}
