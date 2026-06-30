export type Row = { label: string; amount: string };

export interface SlipTemplateProps {
  logo: string;
  companyName: string;
  companyAddr: string;
  companyGSTIN: string;
  empName: string;
  empId: string;
  designation: string;
  department: string;
  doj: string;
  pan: string;
  uan: string;
  pfNumber: string;
  bank: string;
  ifsc: string;
  accountNo: string;
  paymentMode: string;
  month: number;
  year: number;
  paidDays: string;
  lopDays: string;
  totalDays: number;
  earnings: Row[];
  contributions: Row[];
  deductions: Row[];
  totalA: number;
  totalB: number;
  totalC: number;
  netPay: number;
}

export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export const SHORT_MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

export function fmtNum(n: number) {
  return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export function parseAmt(val: string) {
  return parseFloat(val.replace(/,/g, "")) || 0;
}

export function numToWords(num: number): string {
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  if (num === 0) return "Zero Rupees Only";
  function h(n: number): string {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? " "+ones[n%10] : "");
    if (n < 1000) return ones[Math.floor(n/100)]+" Hundred"+(n%100 ? " "+h(n%100) : "");
    if (n < 100000) return h(Math.floor(n/1000))+" Thousand"+(n%1000 ? " "+h(n%1000) : "");
    if (n < 10000000) return h(Math.floor(n/100000))+" Lakh"+(n%100000 ? " "+h(n%100000) : "");
    return h(Math.floor(n/10000000))+" Crore"+(n%10000000 ? " "+h(n%10000000) : "");
  }
  const intPart = Math.floor(num);
  const dec = Math.round((num - intPart) * 100);
  return h(intPart) + " Rupees" + (dec > 0 ? " and " + h(dec) + " Paise" : "") + " Only";
}
