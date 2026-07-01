"use client";

import { useState } from "react";
import { Percent } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatNumber } from "@/lib/formatters";
import { FaqSection } from "@/components/shared/FaqSection";
import { ToolDescription } from "@/components/shared/ToolDescription";
import { RelatedTools } from "@/components/shared/RelatedTools";
import { faqs, toolDescriptions } from "@/lib/data";

export default function PercentageCalculator() {
  const [t1X, setT1X] = useState("20");
  const [t1Y, setT1Y] = useState("150");
  const res1 = (parseFloat(t1X) / 100) * parseFloat(t1Y);

  const [t2X, setT2X] = useState("30");
  const [t2Y, setT2Y] = useState("150");
  const res2 = (parseFloat(t2X) / parseFloat(t2Y)) * 100;

  const [t3X, setT3X] = useState("100");
  const [t3Y, setT3Y] = useState("120");
  const res3 = ((parseFloat(t3Y) - parseFloat(t3X)) / parseFloat(t3X)) * 100;

  const [t4X, setT4X] = useState("120");
  const [t4Y, setT4Y] = useState("20");
  const [t4Mode, setT4Mode] = useState<"inc" | "dec">("inc");
  const res4 =
    t4Mode === "inc"
      ? parseFloat(t4X) / (1 + parseFloat(t4Y) / 100)
      : parseFloat(t4X) / (1 - parseFloat(t4Y) / 100);

  return (
    <>
      <PageHeader
        title="Percentage Calculator"
        description="Solve complex percentage math instantly without formulas."
        icon={Percent}
        gradient="from-violet-500 to-purple-600"
        breadcrumbs={[{ name: "Utility Tools" }, { name: "Percentage Calculator" }]}
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 mb-16">
        <AdSlot className="mb-8" />

        <Card className="shadow-lg border-border/50">
          <CardContent className="p-2 sm:p-4">
            <Tabs defaultValue="tab1" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 mb-6">
                <TabsTrigger value="tab1" className="py-3 text-xs sm:text-sm whitespace-normal h-full">
                  X% of Y
                </TabsTrigger>
                <TabsTrigger value="tab2" className="py-3 text-xs sm:text-sm whitespace-normal h-full">
                  X is what % of Y
                </TabsTrigger>
                <TabsTrigger value="tab3" className="py-3 text-xs sm:text-sm whitespace-normal h-full">
                  % Change
                </TabsTrigger>
                <TabsTrigger value="tab4" className="py-3 text-xs sm:text-sm whitespace-normal h-full">
                  Find Original
                </TabsTrigger>
              </TabsList>

              <div className="p-6 md:p-8 bg-muted/20 rounded-xl border border-border/50">
                <TabsContent value="tab1" className="mt-0 space-y-8 animate-in fade-in zoom-in duration-300">
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-xl font-medium">
                    <span className="w-full sm:w-auto text-center sm:text-right text-muted-foreground whitespace-nowrap">
                      What is
                    </span>
                    <Input
                      type="number"
                      value={t1X}
                      onChange={(e) => setT1X(e.target.value)}
                      className="w-full sm:w-32 text-center text-xl h-14"
                    />
                    <span className="text-muted-foreground">% of</span>
                    <Input
                      type="number"
                      value={t1Y}
                      onChange={(e) => setT1Y(e.target.value)}
                      className="w-full sm:w-40 text-center text-xl h-14"
                    />
                    <span className="text-muted-foreground hidden sm:block">?</span>
                  </div>
                  <div className="p-8 bg-violet-50 dark:bg-violet-950/20 rounded-xl text-center border border-violet-100 dark:border-violet-900/50">
                    <p className="text-sm text-violet-600 dark:text-violet-400 font-semibold uppercase tracking-wider mb-2">
                      Answer
                    </p>
                    <p className="text-5xl font-black text-foreground">
                      {!isNaN(res1) ? formatNumber(res1, 2) : "0"}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="tab2" className="mt-0 space-y-8 animate-in fade-in zoom-in duration-300">
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-xl font-medium">
                    <Input
                      type="number"
                      value={t2X}
                      onChange={(e) => setT2X(e.target.value)}
                      className="w-full sm:w-40 text-center text-xl h-14"
                    />
                    <span className="w-full sm:w-auto text-center text-muted-foreground whitespace-nowrap">
                      is what % of
                    </span>
                    <Input
                      type="number"
                      value={t2Y}
                      onChange={(e) => setT2Y(e.target.value)}
                      className="w-full sm:w-40 text-center text-xl h-14"
                    />
                    <span className="text-muted-foreground hidden sm:block">?</span>
                  </div>
                  <div className="p-8 bg-violet-50 dark:bg-violet-950/20 rounded-xl text-center border border-violet-100 dark:border-violet-900/50">
                    <p className="text-sm text-violet-600 dark:text-violet-400 font-semibold uppercase tracking-wider mb-2">
                      Answer
                    </p>
                    <p className="text-5xl font-black text-foreground">
                      {!isNaN(res2) ? `${formatNumber(res2, 2)}%` : "0%"}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="tab3" className="mt-0 space-y-8 animate-in fade-in zoom-in duration-300">
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-xl font-medium">
                    <span className="w-full sm:w-auto text-center sm:text-right text-muted-foreground whitespace-nowrap">
                      Change from
                    </span>
                    <Input
                      type="number"
                      value={t3X}
                      onChange={(e) => setT3X(e.target.value)}
                      className="w-full sm:w-40 text-center text-xl h-14"
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="number"
                      value={t3Y}
                      onChange={(e) => setT3Y(e.target.value)}
                      className="w-full sm:w-40 text-center text-xl h-14"
                    />
                  </div>
                  <div
                    className={`p-8 rounded-xl text-center border ${
                      res3 > 0
                        ? "bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/50"
                        : res3 < 0
                          ? "bg-rose-50 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/50"
                          : "bg-muted/50 border-border"
                    }`}
                  >
                    <p
                      className={`text-sm font-semibold uppercase tracking-wider mb-2 ${
                        res3 > 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : res3 < 0
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-muted-foreground"
                      }`}
                    >
                      {res3 > 0 ? "Increase" : res3 < 0 ? "Decrease" : "No Change"}
                    </p>
                    <p className="text-5xl font-black text-foreground">
                      {!isNaN(res3) ? `${formatNumber(Math.abs(res3), 2)}%` : "0%"}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="tab4" className="mt-0 space-y-8 animate-in fade-in zoom-in duration-300">
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-xl font-medium">
                    <span className="w-full sm:w-auto text-center sm:text-right text-muted-foreground whitespace-nowrap">
                      Value
                    </span>
                    <Input
                      type="number"
                      value={t4X}
                      onChange={(e) => setT4X(e.target.value)}
                      className="w-full sm:w-40 text-center text-xl h-14"
                    />
                    <span className="text-muted-foreground">is a</span>
                    <Input
                      type="number"
                      value={t4Y}
                      onChange={(e) => setT4Y(e.target.value)}
                      className="w-full sm:w-32 text-center text-xl h-14"
                    />
                    <span className="text-muted-foreground">%</span>
                    <select
                      className="h-14 rounded-md border border-input bg-background px-3 py-2 text-xl"
                      value={t4Mode}
                      onChange={(e) => setT4Mode(e.target.value as "inc" | "dec")}
                    >
                      <option value="inc">Increase</option>
                      <option value="dec">Decrease</option>
                    </select>
                  </div>
                  <div className="p-8 bg-violet-50 dark:bg-violet-950/20 rounded-xl text-center border border-violet-100 dark:border-violet-900/50">
                    <p className="text-sm text-violet-600 dark:text-violet-400 font-semibold uppercase tracking-wider mb-2">
                      Original Value
                    </p>
                    <p className="text-5xl font-black text-foreground">
                      {!isNaN(res4) && isFinite(res4) ? formatNumber(res4, 2) : "0"}
                    </p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
        <ToolDescription toolName="Percentage Calculator" data={toolDescriptions["percentage-calculator"]} />
        <FaqSection faqs={faqs["percentage-calculator"]} />
      </div>
      <RelatedTools currentSlug="percentage-calculator" />
    </>
  );
}
