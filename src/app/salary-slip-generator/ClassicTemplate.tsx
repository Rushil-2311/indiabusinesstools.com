import type { CSSProperties } from "react";
import type { SlipTemplateProps } from "./types";
import { fmtNum, parseAmt, numToWords, SHORT_MONTHS } from "./types";

export function ClassicTemplate(p: SlipTemplateProps) {
  const th: CSSProperties = { fontSize: 9, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", paddingBottom: 2 };
  const val: CSSProperties = { fontWeight: 600, color: "#111", fontSize: 11 };

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 11, color: "#111", lineHeight: 1.5, background: "#fff", padding: 32 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>
            PAYSLIP <span style={{ color: "#4b5563" }}>{SHORT_MONTHS[p.month]} {p.year}</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: 11, marginTop: 4 }}>{p.companyName}</div>
          {p.companyAddr.split("\n").map((l, i) => (
            <div key={i} style={{ fontSize: 10, color: "#6b7280" }}>{l}</div>
          ))}
          {p.companyGSTIN && <div style={{ fontSize: 10, color: "#6b7280" }}>GSTIN: {p.companyGSTIN}</div>}
        </div>
        {p.logo && <img src={p.logo} alt="logo" style={{ height: 52, objectFit: "contain" }} />}
      </div>

      <div style={{ borderBottom: "2px solid #111", margin: "12px 0" }} />

      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{p.empName}</div>

      {/* Employee detail grid */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 4 }}>
        <tbody>
          {[
            [
              { label: "Employee ID", v: p.empId }, { label: "Date of Joining", v: p.doj },
              { label: "Department", v: p.department }, { label: "Designation", v: p.designation },
            ],
            [
              { label: "Payment Mode", v: p.paymentMode }, { label: "Bank", v: p.bank },
              { label: "Bank IFSC", v: p.ifsc || "NA" }, { label: "Account No.", v: p.accountNo ? "••••" + p.accountNo.slice(-4) : "NA" },
            ],
            [
              { label: "PAN", v: p.pan || "NA" }, { label: "UAN", v: p.uan || "NA" },
              { label: "PF Number", v: p.pfNumber || "NA" }, { label: "", v: "" },
            ],
          ].map((row, ri) => (
            <tr key={ri} style={{ borderBottom: "1px solid #e5e7eb" }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ padding: "6px 8px 6px 0", width: "25%", verticalAlign: "top" }}>
                  {cell.label && (
                    <>
                      <div style={th}>{cell.label}</div>
                      <div style={val}>{cell.v || "—"}</div>
                    </>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ fontWeight: 800, fontSize: 11, letterSpacing: "0.08em", marginTop: 16, marginBottom: 4, textTransform: "uppercase" }}>SALARY DETAILS</div>
      <div style={{ borderBottom: "2px solid #111", marginBottom: 10 }} />

      {/* Attendance */}
      <table style={{ width: "100%", marginBottom: 14 }}>
        <tbody>
          <tr>
            {[
              { label: "Total Working Days", v: String(p.totalDays) },
              { label: "Actual Paid Days", v: p.paidDays },
              { label: "Loss of Pay Days", v: p.lopDays },
              { label: "Days Payable", v: p.paidDays },
            ].map((c) => (
              <td key={c.label} style={{ width: "25%" }}>
                <div style={th}>{c.label}</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{c.v}</div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {/* Earnings | Contributions + Deductions */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ width: "48%", verticalAlign: "top", paddingRight: 20, borderRight: "1px solid #e5e7eb" }}>
              <div style={{ fontWeight: 800, fontSize: 10, letterSpacing: "0.05em", marginBottom: 6, textTransform: "uppercase" }}>EARNINGS</div>
              {p.earnings.map((e, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <span style={{ color: "#374151" }}>{e.label}</span>
                  <span style={{ fontWeight: 600 }}>₹{fmtNum(parseAmt(e.amount))}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", marginTop: 4, borderTop: "2px solid #111", fontWeight: 800 }}>
                <span>Total Earnings (A)</span><span>₹{fmtNum(p.totalA)}</span>
              </div>
            </td>
            <td style={{ verticalAlign: "top", paddingLeft: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 10, letterSpacing: "0.05em", marginBottom: 6, textTransform: "uppercase" }}>CONTRIBUTIONS</div>
              {p.contributions.map((c, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <span style={{ color: "#374151" }}>{c.label}</span>
                  <span style={{ fontWeight: 600 }}>₹{fmtNum(parseAmt(c.amount))}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", marginTop: 2, borderTop: "1px solid #d1d5db", fontWeight: 700, fontSize: 10 }}>
                <span>Total (B)</span><span>₹{fmtNum(p.totalB)}</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: 10, letterSpacing: "0.05em", margin: "10px 0 6px", textTransform: "uppercase" }}>TAXES &amp; DEDUCTIONS</div>
              {p.deductions.map((d, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <span style={{ color: "#374151" }}>{d.label}</span>
                  <span style={{ fontWeight: 600 }}>₹{fmtNum(parseAmt(d.amount))}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", marginTop: 2, borderTop: "1px solid #d1d5db", fontWeight: 700, fontSize: 10 }}>
                <span>Total (C)</span><span>₹{fmtNum(p.totalC)}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Net Pay */}
      <div style={{ marginTop: 12, border: "1px solid #e5e7eb", borderRadius: 6, padding: "10px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Net Salary Payable (A − B − C)</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#111", marginTop: 2 }}>₹ {fmtNum(p.netPay)}</div>
          </div>
          <div style={{ fontSize: 10, color: "#6b7280", textAlign: "right" }}>
            <div>Gross (A): ₹{fmtNum(p.totalA)}</div>
            <div>Contributions (B): ₹{fmtNum(p.totalB)}</div>
            <div>Deductions (C): ₹{fmtNum(p.totalC)}</div>
          </div>
        </div>
        <div style={{ marginTop: 6, borderTop: "1px solid #e5e7eb", paddingTop: 6, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 10, color: "#6b7280" }}>Net salary in words</span>
          <span style={{ fontSize: 10, fontStyle: "italic", color: "#374151" }}>{numToWords(p.netPay)}</span>
        </div>
      </div>

      <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ fontSize: 9, color: "#9ca3af" }}>*System-generated. No signature required.</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ borderTop: "1px solid #9ca3af", paddingTop: 4, width: 140, fontSize: 9, color: "#6b7280" }}>Authorised Signatory</div>
        </div>
      </div>
    </div>
  );
}
