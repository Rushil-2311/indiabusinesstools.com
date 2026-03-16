export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return "₹0";
  
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  const formatted = formatter.format(amount);
  
  // Custom abbreviation for large Indian formats
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  
  return formatted;
}

export function formatNumber(num: number, decimals: number = 0): string {
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  }).format(num);
}
