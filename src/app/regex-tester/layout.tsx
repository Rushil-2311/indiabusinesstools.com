import type { Metadata } from "next";
import { ToolSchemas } from "@/components/seo/ToolSchemas";

export const metadata: Metadata = {
  title: "Regex Tester — Test Regular Expressions Online",
  description:
    "Test and debug regular expressions with live match highlighting. Includes flag toggles, capture groups, and quick patterns for email, mobile, PAN, PIN code, and more.",
  keywords: ["regex tester online", "regular expression tester", "regex debugger", "regex matcher", "javascript regex test"],
  openGraph: {
    title: "Regex Tester | IndianBusinessTools",
    description: "Test regular expressions with live match highlighting and common Indian pattern shortcuts.",
    url: "https://www.indiabusinesstools.com/regex-tester",
  },
  alternates: { canonical: "/regex-tester" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><ToolSchemas slug="regex-tester" name="Regex Tester" category="Developer Tools" categorySlug="developer" />{children}</>;
}
