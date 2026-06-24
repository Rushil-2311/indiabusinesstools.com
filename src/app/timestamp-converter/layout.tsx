import type { Metadata } from "next";
import { ToolSchemas } from "@/components/seo/ToolSchemas";

export const metadata: Metadata = {
  title: "Timestamp Converter — Unix Epoch to Date & Time",
  description:
    "Convert Unix epoch timestamps to human-readable dates and back. Supports IST, UTC, and global timezones. Live current timestamp display.",
  keywords: ["unix timestamp converter", "epoch to date", "timestamp to date", "unix time converter", "epoch converter online"],
  openGraph: {
    title: "Timestamp Converter | IndianBusinessTools",
    description: "Convert Unix epoch timestamps to human-readable dates with timezone support.",
    url: "https://www.indiabusinesstools.com/timestamp-converter",
  },
  alternates: { canonical: "/timestamp-converter" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><ToolSchemas slug="timestamp-converter" name="Timestamp Converter" category="Developer Tools" categorySlug="developer" />{children}</>;
}
