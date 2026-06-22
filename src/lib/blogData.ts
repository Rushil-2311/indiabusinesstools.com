export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'callout'; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] };

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  gradient: string;
  date: string;
  author: string;
  content: ContentBlock[];
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'how-to-calculate-sip-returns',
    title: 'How to Calculate SIP Returns: A Complete Guide',
    excerpt:
      'Understand the math behind systematic investment plans and how compounding works in your favor over long periods.',
    category: 'Finance',
    readTime: '5 min read',
    gradient: 'from-blue-500 to-indigo-600',
    date: 'Oct 12, 2023',
    author: 'IndianBusinessTools Team',
    content: [
      {
        type: 'paragraph',
        text: 'Systematic Investment Plans (SIPs) have become one of the most popular ways for Indians to build long-term wealth. Whether you are saving for retirement, a home, or your child\'s education, understanding how SIP returns are calculated helps you plan with confidence and set realistic expectations.',
      },
      {
        type: 'heading',
        text: 'What is a SIP?',
      },
      {
        type: 'paragraph',
        text: 'A Systematic Investment Plan is a method of investing a fixed amount of money into a mutual fund at regular intervals — typically monthly. Instead of investing a lump sum, you spread your investment over time. This approach reduces the risk of investing at the wrong time and benefits from rupee cost averaging.',
      },
      {
        type: 'paragraph',
        text: 'When markets are low, your fixed monthly amount buys more units. When markets are high, it buys fewer units. Over time, this averaging effect can significantly improve your overall returns compared to trying to time the market.',
      },
      {
        type: 'heading',
        text: 'The SIP Return Formula',
      },
      {
        type: 'paragraph',
        text: 'SIP returns are calculated using a future value of annuity formula. The key variables are your monthly investment amount, the expected annual rate of return, and your investment duration.',
      },
      {
        type: 'callout',
        text: 'Formula: M = P × [{(1 + i)ⁿ – 1} / i] × (1 + i)\nWhere: M = Maturity amount | P = Monthly SIP amount | i = Monthly rate of return (Annual rate ÷ 12 ÷ 100) | n = Total number of months',
      },
      {
        type: 'heading',
        text: 'Step-by-Step Calculation Example',
      },
      {
        type: 'paragraph',
        text: 'Let\'s say you invest ₹5,000 every month for 10 years at an expected annual return of 12%.',
      },
      {
        type: 'bullets',
        items: [
          'Monthly investment (P) = ₹5,000',
          'Annual return = 12%, so monthly rate (i) = 12 ÷ 12 ÷ 100 = 0.01',
          'Duration = 10 years = 120 months (n)',
          'Total amount invested = ₹5,000 × 120 = ₹6,00,000',
          'Maturity value (M) ≈ ₹11,61,695',
          'Wealth gained = ₹11,61,695 – ₹6,00,000 = ₹5,61,695',
        ],
      },
      {
        type: 'paragraph',
        text: 'Your money nearly doubles in 10 years — and the gains accelerate dramatically if you extend the duration.',
      },
      {
        type: 'heading',
        text: 'How Duration Affects Your Corpus',
      },
      {
        type: 'table',
        headers: ['Duration', 'Monthly SIP', 'Total Invested', 'Maturity Value', 'Wealth Gained'],
        rows: [
          ['5 years', '₹5,000', '₹3,00,000', '₹4,12,432', '₹1,12,432'],
          ['10 years', '₹5,000', '₹6,00,000', '₹11,61,695', '₹5,61,695'],
          ['15 years', '₹5,000', '₹9,00,000', '₹25,22,880', '₹16,22,880'],
          ['20 years', '₹5,000', '₹12,00,000', '₹49,95,740', '₹37,95,740'],
        ],
      },
      {
        type: 'heading',
        text: 'The Power of Compounding',
      },
      {
        type: 'paragraph',
        text: 'Notice how the wealth gained jumps from ₹1.1 lakh (5 years) to ₹38 lakhs (20 years) — even though you only invested 4 times more money. This is the magic of compounding. Your returns earn their own returns. The longer you stay invested, the more powerful this effect becomes.',
      },
      {
        type: 'paragraph',
        text: 'Albert Einstein reportedly called compound interest the "eighth wonder of the world." In the context of SIPs, compounding works because your mutual fund units grow in value over time, and that growth is reinvested to generate even more growth.',
      },
      {
        type: 'heading',
        text: 'Tips to Maximize Your SIP Returns',
      },
      {
        type: 'bullets',
        items: [
          'Start early — even 3-5 years makes a massive difference',
          'Never stop SIP during market downturns — dips are opportunities to accumulate more units at lower prices',
          'Use a Step-Up SIP — increase your monthly amount by 10% each year as your income grows',
          'Choose funds with a consistent 5-10 year track record, not just last year\'s top performer',
          'Stay invested for at least 5 years to ride out market volatility',
        ],
      },
      {
        type: 'heading',
        text: 'Use Our SIP Calculator',
      },
      {
        type: 'paragraph',
        text: 'You don\'t need to do this math manually. Our free SIP Calculator lets you input your monthly amount, expected return, and duration — and instantly shows your projected corpus, total investment, and wealth gained. Try different scenarios to find the plan that fits your goals.',
      },
    ],
  },
  {
    id: 2,
    slug: 'understanding-gst-beginners-guide',
    title: 'Understanding GST: A Beginner\'s Guide',
    excerpt:
      'Everything you need to know about Goods and Services Tax, tax slabs, and how to calculate it accurately for your business.',
    category: 'Tax',
    readTime: '4 min read',
    gradient: 'from-amber-500 to-orange-600',
    date: 'Sep 28, 2023',
    author: 'IndianBusinessTools Team',
    content: [
      {
        type: 'paragraph',
        text: 'Goods and Services Tax (GST) is India\'s most significant tax reform since independence. Introduced on July 1, 2017, it replaced a complex web of over 17 central and state indirect taxes with a single, unified system. If you run a business in India — or even freelance — understanding GST is essential.',
      },
      {
        type: 'heading',
        text: 'What Exactly is GST?',
      },
      {
        type: 'paragraph',
        text: 'GST is a destination-based, multi-stage tax levied on the supply of goods and services. "Destination-based" means the tax goes to the state where the final consumer is located, not where the product was manufactured. "Multi-stage" means it is collected at every step of the supply chain — from manufacturer to retailer — but only on the value added at each stage.',
      },
      {
        type: 'paragraph',
        text: 'The key benefit of this system is the Input Tax Credit (ITC) mechanism, which eliminates the cascading effect of taxes. Businesses can offset the GST they pay on purchases against the GST they collect from their customers.',
      },
      {
        type: 'heading',
        text: 'GST Tax Slabs in India',
      },
      {
        type: 'table',
        headers: ['GST Rate', 'What it Covers'],
        rows: [
          ['0%', 'Essential items: fresh fruits, vegetables, milk, eggs, bread, salt, stamps'],
          ['5%', 'Common use items: packaged food, domestic LPG, fertilisers, economy hotels'],
          ['12%', 'Processed foods, computers, medicines, business hotels, non-AC restaurants'],
          ['18%', 'Most services (IT, telecom), capital goods, soaps, toothpaste, AC restaurants'],
          ['28%', 'Luxury & sin goods: cars, tobacco, aerated drinks, casinos, 5-star hotels'],
        ],
      },
      {
        type: 'heading',
        text: 'Types of GST: CGST, SGST, and IGST',
      },
      {
        type: 'paragraph',
        text: 'When a transaction happens within the same state (intra-state), the GST is split equally between the Centre and the State. For a transaction with an 18% GST rate, the buyer pays 9% CGST (Central GST) + 9% SGST (State GST). Both go on the same invoice but to different governments.',
      },
      {
        type: 'paragraph',
        text: 'When a transaction crosses state lines (inter-state), the entire GST is collected as IGST (Integrated GST) by the Centre, which then distributes the state\'s share. This is why you see IGST on e-commerce purchases from another state.',
      },
      {
        type: 'heading',
        text: 'How to Calculate GST (Step by Step)',
      },
      {
        type: 'callout',
        text: 'Adding GST to a price:\nGST Amount = Original Price × GST Rate ÷ 100\nFinal Price = Original Price + GST Amount\n\nExample: Product costs ₹1,000, GST = 18%\nGST = ₹1,000 × 18 ÷ 100 = ₹180 → Final price = ₹1,180',
      },
      {
        type: 'callout',
        text: 'Removing GST from a price (Reverse calculation):\nOriginal Price = GST-inclusive Price ÷ (1 + GST Rate ÷ 100)\nGST Amount = GST-inclusive Price − Original Price\n\nExample: You paid ₹1,180 inclusive of 18% GST\nOriginal = ₹1,180 ÷ 1.18 = ₹1,000 → GST = ₹180',
      },
      {
        type: 'heading',
        text: 'Who Needs GST Registration?',
      },
      {
        type: 'bullets',
        items: [
          'Businesses with annual turnover above ₹40 lakhs (for goods)',
          'Service providers with turnover above ₹20 lakhs',
          'Businesses in special category states: threshold is ₹10 lakhs',
          'All e-commerce sellers — regardless of turnover',
          'Anyone making inter-state supplies of goods',
          'Importers and exporters of goods/services',
        ],
      },
      {
        type: 'heading',
        text: 'Common GST Mistakes to Avoid',
      },
      {
        type: 'bullets',
        items: [
          'Not filing Nil returns — even with zero sales, you must file',
          'Missing the monthly/quarterly return deadlines (GSTR-1, GSTR-3B)',
          'Claiming ITC on ineligible purchases like personal use items',
          'Using wrong HSN/SAC codes for your products or services',
          'Not reconciling your purchase register with GSTR-2A',
        ],
      },
      {
        type: 'heading',
        text: 'Use Our GST Calculator',
      },
      {
        type: 'paragraph',
        text: 'Stop doing this math in your head or on a notepad. Our free GST Calculator instantly computes the tax amount and final price for any of the GST slabs — both for adding GST and removing it from an inclusive price. It also breaks down CGST and SGST for intra-state transactions.',
      },
    ],
  },
  {
    id: 3,
    slug: 'start-sip-investment-at-25',
    title: 'Why You Should Start SIP Investment at Age 25',
    excerpt:
      'The power of early investing is unmatched. See how starting just 5 years early can double your final retirement corpus.',
    category: 'Investment',
    readTime: '6 min read',
    gradient: 'from-emerald-500 to-teal-600',
    date: 'Sep 15, 2023',
    author: 'IndianBusinessTools Team',
    content: [
      {
        type: 'paragraph',
        text: '"The best time to plant a tree was 20 years ago. The second best time is now." This ancient proverb is the most accurate description of SIP investing. If you are 25 today, you are sitting on one of the most powerful financial advantages you will ever have: time.',
      },
      {
        type: 'heading',
        text: 'Why Age 25 is the Magic Number',
      },
      {
        type: 'paragraph',
        text: 'At 25, you likely just started earning. Your expenses are lower than they will ever be — no EMIs, no school fees, no large family responsibilities. This is your golden window to lock in a SIP habit that will compound silently in the background for the next 30-35 years.',
      },
      {
        type: 'paragraph',
        text: 'Most people in their 20s spend their first salary on lifestyle upgrades — a new phone, better clothes, eating out. There is nothing wrong with enjoying your income, but allocating even ₹2,000-₹5,000/month toward a SIP from day one sets the foundation for extraordinary wealth.',
      },
      {
        type: 'heading',
        text: 'The Numbers: Start at 25 vs 30 vs 35',
      },
      {
        type: 'paragraph',
        text: 'Let\'s compare three investors, all investing ₹5,000 per month in a mutual fund with a 12% annual return, and all planning to retire at 60.',
      },
      {
        type: 'table',
        headers: ['Start Age', 'Duration', 'Total Invested', 'Retirement Corpus', 'Wealth Gained'],
        rows: [
          ['25 years', '35 years', '₹21,00,000', '₹3,24,86,000', '₹3,03,86,000'],
          ['30 years', '30 years', '₹18,00,000', '₹1,76,49,000', '₹1,58,49,000'],
          ['35 years', '25 years', '₹15,00,000', '₹94,88,000', '₹79,88,000'],
        ],
      },
      {
        type: 'callout',
        text: 'Starting at 25 vs 35 — investing just ₹6 lakh more — gives you ₹2.3 CRORE extra at retirement. That is the price of waiting.',
      },
      {
        type: 'heading',
        text: 'The Rule of 72: Understanding Your Money\'s Doubling Time',
      },
      {
        type: 'paragraph',
        text: 'The Rule of 72 is a simple way to understand compounding. Divide 72 by your expected annual return to find how many years it takes your money to double. At 12% returns, your money doubles every 6 years.',
      },
      {
        type: 'bullets',
        items: [
          'Age 25 → 31: First doubling',
          'Age 31 → 37: Second doubling (now 4×)',
          'Age 37 → 43: Third doubling (now 8×)',
          'Age 43 → 49: Fourth doubling (now 16×)',
          'Age 49 → 55: Fifth doubling (now 32×)',
          'Age 55 → 60: Approaching sixth doubling',
        ],
      },
      {
        type: 'paragraph',
        text: 'Someone who starts at 35 only gets 4 doubling cycles before retirement. The person who started at 25 gets nearly 6. That extra two doublings (4× vs ~48× of the initial amount) is the entire difference between a comfortable retirement and a life-changing one.',
      },
      {
        type: 'heading',
        text: 'But I Can Only Afford ₹1,000 a Month',
      },
      {
        type: 'paragraph',
        text: 'That is completely fine. Starting small is infinitely better than not starting at all. A ₹1,000/month SIP at 12% for 35 years becomes ₹64,97,000 — nearly ₹65 lakhs. You would have invested only ₹4,20,000. The remaining ₹60 lakhs is pure compounding.',
      },
      {
        type: 'paragraph',
        text: 'The key insight: as your income grows, your SIP amount does not have to stay at ₹1,000. This is where the Step-Up SIP comes in.',
      },
      {
        type: 'heading',
        text: 'The Step-Up SIP Strategy',
      },
      {
        type: 'paragraph',
        text: 'A Step-Up SIP (also called Top-Up SIP) lets you automatically increase your monthly contribution by a fixed percentage each year. If you increase by just 10% per year, the results are dramatically better.',
      },
      {
        type: 'bullets',
        items: [
          'Start: ₹2,000/month at age 25',
          'Increase by 10% every year',
          'By year 10, you are investing ~₹5,187/month',
          'By year 20, you are investing ~₹13,455/month',
          'Retirement corpus at 60 (12% return): ~₹2.1 crore',
          'vs flat ₹2,000/month for 35 years: ₹1.3 crore',
        ],
      },
      {
        type: 'heading',
        text: 'What to Do Right Now',
      },
      {
        type: 'bullets',
        items: [
          'Complete your KYC online — takes 10 minutes via any mutual fund platform',
          'Choose a large-cap or index fund to start — lower risk, proven track record',
          'Set your SIP date to 2-3 days after salary credit so you never miss it',
          'Automate it — set up an auto-debit mandate and forget about it',
          'Review your portfolio once a year, not every day',
        ],
      },
      {
        type: 'heading',
        text: 'The Honest Truth',
      },
      {
        type: 'paragraph',
        text: 'No one ever regrets starting a SIP too early. Thousands of people regret starting too late. At 25, you have something no amount of money can buy in your 40s: time. Use it.',
      },
      {
        type: 'paragraph',
        text: 'Run your own numbers with our free SIP Calculator. Enter your monthly amount, your expected return, and how many years you plan to invest — and see exactly how much you will have.',
      },
    ],
  },
];
