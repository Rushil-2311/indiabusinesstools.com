export type LineItem = { description: string; hsn: string; qty: string; rate: string; gst: string };
export type LineCalc = { subtotal: number; gstAmt: number; total: number; gst: number; taxable: number };

export type InvoiceTemplateProps = {
  sellerName: string;
  sellerAddress: string;
  sellerGSTIN: string;
  sellerState: string;
  sellerPhone: string;
  buyerName: string;
  buyerAddress: string;
  buyerGSTIN: string;
  buyerState: string;
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  notes: string;
  items: LineItem[];
  lineCalcs: LineCalc[];
  subtotal: number;
  totalGST: number;
  grandTotal: number;
  isIGST: boolean;
  updateItem: (i: number, field: keyof LineItem, val: string) => void;
  addItem: () => void;
  removeItem: (i: number) => void;
};

export const GST_RATES = ["0", "5", "12", "18", "28"];

export function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export function numToWords(num: number): string {
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  if (num === 0) return "Zero";
  function helper(n: number): string {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + helper(n % 100) : "");
    if (n < 100000) return helper(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + helper(n % 1000) : "");
    if (n < 10000000) return helper(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + helper(n % 100000) : "");
    return helper(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + helper(n % 10000000) : "");
  }
  const intPart = Math.floor(num);
  const decPart = Math.round((num - intPart) * 100);
  let result = helper(intPart) + " Rupees";
  if (decPart > 0) result += " and " + helper(decPart) + " Paise";
  return result + " Only";
}
