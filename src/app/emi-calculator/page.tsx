"use client";

import { useState, lazy, Suspense } from "react";
import dynamic from "next/dynamic";
import { Landmark } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { AdSlot } from "@/components/shared/AdSlot";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { calculateEmi } from "@/lib/calculators";
import { formatCurrency } from "@/lib/formatters";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/data";
export default function EmiCalculator() {
  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(10);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const result = calculateEmi(principal, rate, years);

  const pieData = [
    { name: "Principal", value: principal, color: "hsl(var(--chart-1))" },
    {
      name: "Total Interest",
      value: result.totalInterest,
      color: "hsl(var(--chart-3))",
    },
  ];

  return (
    <PageLayout>
      <PageHeader
        title="EMI Calculator"
        description="Calculate your Equated Monthly Installment for home, car, or personal loans."
        icon={Landmark}
        gradient="from-emerald-500 to-teal-600"
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 mb-16">
        <AdSlot className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-6 shadow-lg border-border/50">
            <CardContent className="p-6 md:p-8 space-y-8">
              <div>
                <div className="flex justify-between mb-4">
                  <Label className="text-base text-muted-foreground">
                    Loan Amount
                  </Label>
                  <div className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-md">
                    {formatCurrency(principal)}
                  </div>
                </div>
                <Slider
                  value={[principal]}
                  min={10000}
                  max={50000000}
                  step={10000}
                  onValueChange={(val) => setPrincipal(val[0])}
                  className="py-2"
                />
              </div>

              <div>
                <div className="flex justify-between mb-4">
                  <Label className="text-base text-muted-foreground">
                    Interest Rate (p.a)
                  </Label>
                  <div className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-md">
                    {rate}%
                  </div>
                </div>
                <Slider
                  value={[rate]}
                  min={1}
                  max={30}
                  step={0.1}
                  onValueChange={(val) => setRate(val[0])}
                  className="py-2"
                />
              </div>

              <div>
                <div className="flex justify-between mb-4">
                  <Label className="text-base text-muted-foreground">
                    Loan Tenure
                  </Label>
                  <div className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-md">
                    {years} Years
                  </div>
                </div>
                <Slider
                  value={[years]}
                  min={1}
                  max={30}
                  step={1}
                  onValueChange={(val) => setYears(val[0])}
                  className="py-2"
                />
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-6 space-y-6">
            <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/20">
              <CardContent className="p-8 text-center">
                <p className="text-emerald-100 font-medium mb-2 uppercase tracking-wide">
                  Your Monthly EMI
                </p>
                <h3 className="text-5xl font-black mb-6">
                  {formatCurrency(result.emi)}
                </h3>
                <div className="grid grid-cols-2 gap-4 border-t border-emerald-400/30 pt-6">
                  <div>
                    <p className="text-emerald-100 text-sm mb-1">
                      Total Principal
                    </p>
                    <p className="font-bold text-lg">
                      {formatCurrency(principal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-emerald-100 text-sm mb-1">
                      Total Interest
                    </p>
                    <p className="font-bold text-lg">
                      {formatCurrency(result.totalInterest)}
                    </p>
                  </div>
                  <div className="col-span-2 mt-2">
                    <p className="text-emerald-100 text-sm mb-1">
                      Total Payment
                    </p>
                    <p className="font-bold text-xl">
                      {formatCurrency(result.totalPayment)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/50">
              <CardContent className="p-6 flex flex-col items-center">
                <h4 className="font-semibold mb-4 text-center w-full">
                  Payment Breakdown
                </h4>
                <div className="h-[200px] w-full">
                  <Suspense
                    fallback={
                      <div className="w-full h-full animate-pulse bg-muted/20 rounded-full" />
                    }
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value)}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Suspense>
                </div>
                <div className="flex gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))]" />
                    <span className="text-sm text-muted-foreground">
                      Principal
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-3))]" />
                    <span className="text-sm text-muted-foreground">
                      Interest
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Amortization Schedule */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-6">
            Yearly Amortization Schedule
          </h3>
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                  <tr>
                    <th className="px-6 py-4">Year</th>
                    <th className="px-6 py-4 text-right">Principal Paid</th>
                    <th className="px-6 py-4 text-right">Interest Paid</th>
                    <th className="px-6 py-4 text-right">Total Payment</th>
                    <th className="px-6 py-4 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {result.yearlySchedule
                    .slice(0, showFullSchedule ? undefined : 10)
                    .map((row) => (
                      <tr
                        key={row.year}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium">{row.year}</td>
                        <td className="px-6 py-4 text-right">
                          {formatCurrency(row.principal)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {formatCurrency(row.interest)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {formatCurrency(row.principal + row.interest)}
                        </td>
                        <td className="px-6 py-4 text-right font-medium">
                          {formatCurrency(row.balance)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {result.yearlySchedule.length > 10 && (
              <div className="p-4 border-t bg-muted/20 text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowFullSchedule(!showFullSchedule)}
                >
                  {showFullSchedule
                    ? "Show Less"
                    : `View Full Schedule (${result.yearlySchedule.length} Years)`}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs["emi-calculator"].map((faq, i) => (
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
    </PageLayout>
  );
}
