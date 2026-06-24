'use client';

import { useState } from "react";
import { Receipt } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/formatters";
import { FaqSection } from "@/components/shared/FaqSection";
import { RelatedTools } from "@/components/shared/RelatedTools";
import { faqs } from "@/lib/data";

export default function GstCalculator() {
  const [amount, setAmount] = useState<string>("10000");
  const [rate, setRate] = useState<number>(18);
  const [mode, setMode] = useState<"add" | "remove">("add");

  const numAmount = parseFloat(amount) || 0;

  let baseAmount = 0;
  let gstAmount = 0;
  let totalAmount = 0;

  if (mode === "add") {
    baseAmount = numAmount;
    gstAmount = (numAmount * rate) / 100;
    totalAmount = baseAmount + gstAmount;
  } else {
    totalAmount = numAmount;
    baseAmount = numAmount / (1 + rate / 100);
    gstAmount = totalAmount - baseAmount;
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  const standardRates = [5, 12, 18, 28];

  return (
    <>
      <PageHeader
        title="GST Calculator"
        description="Quickly calculate Goods and Services Tax with standard Indian tax slabs."
        icon={Receipt}
        gradient="from-amber-500 to-orange-600"
        breadcrumbs={[{ name: "Tax & Payroll" }, { name: "GST Calculator" }]}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 mb-16">
        <AdSlot className="mb-8" />

        <Card className="shadow-xl shadow-amber-500/5 border-border/50 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 md:p-8 bg-card border-r">
              <Tabs defaultValue="add" onValueChange={(v) => setMode(v as "add" | "remove")} className="mb-8">
                <TabsList className="grid w-full grid-cols-2 p-1 bg-muted rounded-xl h-12">
                  <TabsTrigger value="add" className="rounded-lg font-medium text-base">Add GST (+)</TabsTrigger>
                  <TabsTrigger value="remove" className="rounded-lg font-medium text-base">Remove GST (-)</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-base font-medium">
                    {mode === "add" ? "Base Amount (₹)" : "Total Amount including GST (₹)"}
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-lg py-6 bg-background"
                    placeholder="Enter amount"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Select GST Slab</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {standardRates.map(r => (
                      <Button
                        key={r}
                        variant={rate === r ? "default" : "outline"}
                        className={rate === r ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}
                        onClick={() => setRate(r)}
                      >
                        {r}%
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="custom-rate" className="text-sm text-muted-foreground">Or custom rate (%)</Label>
                  <Input
                    id="custom-rate"
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                    className="bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-amber-50 dark:bg-amber-950/20 flex flex-col justify-center">
              <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-400 mb-6">Calculation Result</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-amber-200 dark:border-amber-900/50">
                  <span className="text-muted-foreground">Base Amount</span>
                  <span className="font-semibold">{formatCurrency(baseAmount)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-amber-200 dark:border-amber-900/50">
                  <span className="text-muted-foreground">Total GST ({rate}%)</span>
                  <span className="font-semibold">{formatCurrency(gstAmount)}</span>
                </div>

                <div className="pl-4 py-2 space-y-2 border-l-2 border-amber-300 dark:border-amber-800 ml-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">CGST ({rate / 2}%)</span>
                    <span className="font-medium">{formatCurrency(cgst)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">SGST ({rate / 2}%)</span>
                    <span className="font-medium">{formatCurrency(sgst)}</span>
                  </div>
                </div>

                <div className="pt-4 mt-2">
                  <p className="text-sm text-amber-800 dark:text-amber-500 mb-1 font-medium uppercase tracking-wider">Total Amount</p>
                  <p className="text-4xl font-black text-amber-600 dark:text-amber-400">{formatCurrency(totalAmount)}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <FaqSection faqs={faqs["gst-calculator"]} />
      </div>
      <RelatedTools currentSlug="gst-calculator" />
    </>
  );
}
