"use client";

import { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import {
  format,
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  differenceInWeeks,
  differenceInHours,
  addYears,
  isAfter,
} from "date-fns";
import { PageHeader } from "@/components/shared/PageHeader";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AgeCalculator() {
  const [dob, setDob] = useState<string>("1995-05-15");
  const [asOf, setAsOf] = useState<string>(new Date().toISOString().split("T")[0]);

  const [results, setResults] = useState<{
    years: number;
    months: number;
    days: number;
    totalMonths: number;
    totalWeeks: number;
    totalDays: number;
    totalHours: number;
    nextBirthdayStr: string;
    dayOfWeek: string;
  } | null>(null);

  useEffect(() => {
    if (!dob || !asOf) return;

    const birthDate = new Date(dob);
    const targetDate = new Date(asOf);

    if (isNaN(birthDate.getTime()) || isNaN(targetDate.getTime())) return;
    if (isAfter(birthDate, targetDate)) {
      setResults(null);
      return;
    }

    const years = differenceInYears(targetDate, birthDate);
    const tempDate = addYears(birthDate, years);
    const months = differenceInMonths(targetDate, tempDate);

    const tempDate2 = new Date(tempDate);
    tempDate2.setMonth(tempDate2.getMonth() + months);
    const days = differenceInDays(targetDate, tempDate2);

    const totalMonths = differenceInMonths(targetDate, birthDate);
    const totalWeeks = differenceInWeeks(targetDate, birthDate);
    const totalDays = differenceInDays(targetDate, birthDate);
    const totalHours = differenceInHours(targetDate, birthDate);

    const currentYear = targetDate.getFullYear();
    let nextBday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
    if (
      isAfter(targetDate, nextBday) &&
      format(targetDate, "MM-dd") !== format(nextBday, "MM-dd")
    ) {
      nextBday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
    }
    const daysToNext = differenceInDays(nextBday, targetDate);
    const nextBirthdayStr =
      daysToNext === 0
        ? "Today! 🎂"
        : `in ${daysToNext} days (${format(nextBday, "EEEE, dd MMM yyyy")})`;

    setResults({
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      nextBirthdayStr,
      dayOfWeek: format(birthDate, "EEEE"),
    });
  }, [dob, asOf]);

  return (
    <>
      <PageHeader
        title="Age Calculator"
        description="Find out your exact age in years, months, and days down to the hour."
        icon={CalendarDays}
        gradient="from-rose-500 to-pink-600"
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 mb-16">
        <AdSlot className="mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-1 shadow-md border-border/50 h-max">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  type="date"
                  id="dob"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="bg-muted/50 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="asof">Age As Of</Label>
                <Input
                  type="date"
                  id="asof"
                  value={asOf}
                  onChange={(e) => setAsOf(e.target.value)}
                  className="bg-muted/50 h-12"
                />
              </div>
            </CardContent>
          </Card>

          <div className="col-span-1 md:col-span-2 space-y-6">
            {!results ? (
              <Card className="bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900">
                <CardContent className="p-8 text-center text-rose-600 dark:text-rose-400">
                  Please enter a valid date of birth. Target date must be after birth date.
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-xl shadow-rose-500/20 border-none overflow-hidden relative">
                  <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
                    <CalendarDays className="w-48 h-48 -mr-10 -mt-10" />
                  </div>
                  <CardContent className="p-8 relative z-10 text-center">
                    <h3 className="text-rose-100 uppercase tracking-widest text-sm font-semibold mb-6">
                      Your Age is Exactly
                    </h3>
                    <div className="flex justify-center items-baseline gap-4 md:gap-8">
                      <div className="text-center">
                        <span className="text-5xl md:text-7xl font-black">{results.years}</span>
                        <p className="text-rose-100 font-medium mt-1">Years</p>
                      </div>
                      <div className="text-center">
                        <span className="text-4xl md:text-6xl font-bold">{results.months}</span>
                        <p className="text-rose-100 font-medium mt-1">Months</p>
                      </div>
                      <div className="text-center">
                        <span className="text-4xl md:text-6xl font-bold">{results.days}</span>
                        <p className="text-rose-100 font-medium mt-1">Days</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Card className="text-center bg-muted/30">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-1">Total Months</p>
                      <p className="text-xl font-bold">{results.totalMonths.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center bg-muted/30">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-1">Total Weeks</p>
                      <p className="text-xl font-bold">{results.totalWeeks.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center bg-muted/30">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-1">Total Days</p>
                      <p className="text-xl font-bold">{results.totalDays.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center bg-muted/30">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-1">Total Hours</p>
                      <p className="text-xl font-bold">{results.totalHours.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-border/50">
                  <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-rose-500 uppercase tracking-wide mb-1">
                        Next Birthday
                      </p>
                      <p className="text-lg font-medium">{results.nextBirthdayStr}</p>
                    </div>
                    <div className="w-px h-12 bg-border hidden sm:block"></div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-rose-500 uppercase tracking-wide mb-1">
                        Born On A
                      </p>
                      <p className="text-lg font-medium">{results.dayOfWeek}</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
