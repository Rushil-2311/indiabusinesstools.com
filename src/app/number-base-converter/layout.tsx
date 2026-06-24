import type { Metadata } from "next";
import { ToolSchemas } from "@/components/seo/ToolSchemas";

export const metadata: Metadata = {
  title: "Number Base Converter — Binary, Octal, Decimal, Hex",
  description:
    "Convert numbers between binary, octal, decimal, and hexadecimal instantly. Includes bit visualization and quick reference table.",
  keywords: ["binary to decimal", "hex converter", "octal converter", "number base converter", "binary converter online"],
  openGraph: {
    title: "Number Base Converter | IndianBusinessTools",
    description: "Convert numbers between binary, octal, decimal, and hexadecimal with live bit visualization.",
    url: "https://www.indiabusinesstools.com/number-base-converter",
  },
  alternates: { canonical: "/number-base-converter" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><ToolSchemas slug="number-base-converter" name="Number Base Converter" category="Developer Tools" categorySlug="developer" />{children}</>;
}
