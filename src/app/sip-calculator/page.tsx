"use client";

import { Suspense, useState } from "react";
import { TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AdSlot } from "@/components/shared/AdSlot";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { calculateSip, calculateLumpsum } from "@/lib/calculators";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs, toolDescriptions } from "@/lib/data";
import { ToolDescription } from "@/components/shared/ToolDescription";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
} from "recharts";

export default function SipCalculator() {
  const [mode, setMode] = useState<"sip" | "lumpsum">("sip");
  const [investment, setInvestment] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [stepUp, setStepUp] = useState(0);
  const [inflationAdjusted, setInflationAdjusted] = useState(false);
  const inflationRate = 6; // Fixed assumed inflation

  const handleInvestmentChange = (val: number[]) => setInvestment(val[0]);
  const handleRateChange = (val: number[]) => setRate(val[0]);
  const handleYearsChange = (val: number[]) => setYears(val[0]);
  const handleStepUpChange = (val: number[]) => setStepUp(val[0]);

  // Adjust rate if inflation toggle is on (approximate formula: Real Return = Nominal - Inflation)
  const effectiveRate = inflationAdjusted
    ? Math.max(0.1, rate - inflationRate)
    : rate;

  const result =
    mode === "sip"
      ? calculateSip(investment, effectiveRate, years, stepUp)
      : calculateLumpsum(investment, effectiveRate, years);

  const pieData = [
    { name: "Invested", value: result.invested, color: "hsl(var(--chart-1))" },
    {
      name: "Est. Returns",
      value: result.returns,
      color: "hsl(var(--chart-2))",
    },
  ];

  return (
    <>
      <PageHeader
        title="SIP Calculator"
        description="Calculate the future value of your systematic investment plan with step-up options."
        icon={TrendingUp}
        gradient="from-blue-600 to-indigo-600"
        breadcrumbs={[{ name: "Finance & Investments" }, { name: "SIP Calculator" }]}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 mb-16">
        <AdSlot className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Section */}
          <Card className="lg:col-span-5 shadow-lg border-border/50">
            <CardContent className="p-6 md:p-8">
              <Tabs
                defaultValue="sip"
                onValueChange={(v) => setMode(v as "sip" | "lumpsum")}
                className="mb-8"
              >
                <TabsList className="grid w-full grid-cols-2 p-1 bg-muted rounded-xl h-12">
                  <TabsTrigger
                    value="sip"
                    className="rounded-lg font-medium text-base"
                  >
                    SIP
                  </TabsTrigger>
                  <TabsTrigger
                    value="lumpsum"
                    className="rounded-lg font-medium text-base"
                  >
                    Lumpsum
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-4">
                    <Label className="text-base text-muted-foreground">
                      {mode === "sip"
                        ? "Monthly Investment"
                        : "Total Investment"}
                    </Label>
                    <div className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-md">
                      {formatCurrency(investment)}
                    </div>
                  </div>
                  <Slider
                    value={[investment]}
                    min={500}
                    max={mode === "sip" ? 100000 : 5000000}
                    step={500}
                    onValueChange={handleInvestmentChange}
                    className="py-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-4">
                    <Label className="text-base text-muted-foreground">
                      Expected Return Rate (p.a)
                    </Label>
                    <div className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-md">
                      {rate}%
                    </div>
                  </div>
                  <Slider
                    value={[rate]}
                    min={1}
                    max={30}
                    step={0.5}
                    onValueChange={handleRateChange}
                    className="py-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-4">
                    <Label className="text-base text-muted-foreground">
                      Time Period
                    </Label>
                    <div className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-md">
                      {years} Yr
                    </div>
                  </div>
                  <Slider
                    value={[years]}
                    min={1}
                    max={40}
                    step={1}
                    onValueChange={handleYearsChange}
                    className="py-2"
                  />
                </div>

                {mode === "sip" && (
                  <div>
                    <div className="flex justify-between mb-4">
                      <Label className="text-base text-muted-foreground">
                        Annual Step-Up (Optional)
                      </Label>
                      <div className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-md">
                        {stepUp}%
                      </div>
                    </div>
                    <Slider
                      value={[stepUp]}
                      min={0}
                      max={50}
                      step={1}
                      onValueChange={handleStepUpChange}
                      className="py-2"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border/50">
                  <div className="space-y-0.5">
                    <Label className="text-base">Inflation Adjusted</Label>
                    <p className="text-xs text-muted-foreground">
                      Assumes {inflationRate}% avg inflation
                    </p>
                  </div>
                  <Switch
                    checked={inflationAdjusted}
                    onCheckedChange={setInflationAdjusted}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-blue-50/50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/50">
                <CardContent className="p-4 text-center">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                    Invested Amount
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrency(result.invested)}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/50">
                <CardContent className="p-4 text-center">
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">
                    Est. Returns
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrency(result.returns)}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50/50 border-purple-100 dark:bg-purple-950/20 dark:border-purple-900/50">
                <CardContent className="p-4 text-center">
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">
                    Total Value
                  </p>
                  <p className="text-2xl font-black text-foreground">
                    {formatCurrency(result.total)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm border-border/50">
              <CardContent className="p-6">
                <div className="h-[300px] w-full">
                  <Suspense
                    fallback={
                      <div className="w-full h-full flex items-center justify-center bg-muted/20 animate-pulse rounded-xl" />
                    }
                  >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={result.schedule}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorTotal"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(var(--chart-2))"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(var(--chart-2))"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorInvested"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(var(--chart-1))"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(var(--chart-1))"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="year"
                        tickFormatter={(v: number) => `${v}Y`}
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tickFormatter={(v: number) =>
                          `₹${(v / 100000).toFixed(0)}L`
                        }
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        labelFormatter={(label) => `Year ${label}`}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid hsl(var(--border))",
                          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        name="Total Value"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorTotal)"
                      />
                      <Area
                        type="monotone"
                        dataKey="invested"
                        name="Invested"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorInvested)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  </Suspense>

                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <ToolDescription toolName="SIP Calculator" data={toolDescriptions["sip-calculator"]} />

        {/* FAQs */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs["sip-calculator"].map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-card px-4 mb-2 rounded-lg border"
              >
                <AccordionTrigger className="font-semibold text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
}
