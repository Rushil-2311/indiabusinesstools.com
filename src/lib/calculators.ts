// SIP Calculator Logic
export interface SipResult {
  invested: number;
  returns: number;
  total: number;
  schedule: { year: number; invested: number; total: number }[];
}

export function calculateSip(
  monthlyInvestment: number,
  expectedReturnRate: number,
  years: number,
  stepUpPercent: number = 0
): SipResult {
  let totalInvested = 0;
  let currentTotal = 0;
  const monthlyRate = expectedReturnRate / 12 / 100;
  const schedule = [];

  let currentMonthlyInvestment = monthlyInvestment;

  for (let year = 1; year <= years; year++) {
    for (let month = 1; month <= 12; month++) {
      totalInvested += currentMonthlyInvestment;
      currentTotal = (currentTotal + currentMonthlyInvestment) * (1 + monthlyRate);
    }
    
    schedule.push({
      year,
      invested: Math.round(totalInvested),
      total: Math.round(currentTotal)
    });

    if (stepUpPercent > 0) {
      currentMonthlyInvestment = currentMonthlyInvestment * (1 + stepUpPercent / 100);
    }
  }

  return {
    invested: Math.round(totalInvested),
    returns: Math.round(currentTotal - totalInvested),
    total: Math.round(currentTotal),
    schedule
  };
}

export function calculateLumpsum(
  investment: number,
  expectedReturnRate: number,
  years: number
): SipResult {
  const schedule = [];
  let currentTotal = investment;

  for (let year = 1; year <= years; year++) {
    currentTotal = investment * Math.pow(1 + expectedReturnRate / 100, year);
    schedule.push({
      year,
      invested: investment,
      total: Math.round(currentTotal)
    });
  }

  return {
    invested: investment,
    returns: Math.round(currentTotal - investment),
    total: Math.round(currentTotal),
    schedule
  };
}

// EMI Calculator Logic
export interface EmiResult {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  schedule: { month: number; principal: number; interest: number; balance: number }[];
  yearlySchedule: { year: number; principal: number; interest: number; balance: number }[];
}

export function calculateEmi(principal: number, annualRate: number, years: number): EmiResult {
  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;
  
  let emi = 0;
  if (monthlyRate === 0) {
    emi = principal / months;
  } else {
    emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  }

  let balance = principal;
  let totalInterest = 0;
  const schedule = [];
  const yearlySchedule = [];
  
  let yearPrincipal = 0;
  let yearInterest = 0;

  for (let i = 1; i <= months; i++) {
    const interestForMonth = balance * monthlyRate;
    const principalForMonth = emi - interestForMonth;
    
    balance -= principalForMonth;
    totalInterest += interestForMonth;
    
    yearPrincipal += principalForMonth;
    yearInterest += interestForMonth;

    schedule.push({
      month: i,
      principal: principalForMonth,
      interest: interestForMonth,
      balance: Math.max(0, balance)
    });

    if (i % 12 === 0 || i === months) {
      yearlySchedule.push({
        year: Math.ceil(i / 12),
        principal: Math.round(yearPrincipal),
        interest: Math.round(yearInterest),
        balance: Math.round(Math.max(0, balance))
      });
      yearPrincipal = 0;
      yearInterest = 0;
    }
  }

  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(principal + totalInterest),
    schedule,
    yearlySchedule
  };
}

// JSON syntax highlighter
export function syntaxHighlightJson(json: string): string {
  if (!json) return "";
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    let cls = 'json-number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'json-key';
      } else {
        cls = 'json-string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'json-boolean';
    } else if (/null/.test(match)) {
      cls = 'json-null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}
