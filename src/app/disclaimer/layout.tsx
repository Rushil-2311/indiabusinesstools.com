import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Legal disclaimer for IndianBusinessTools. Our calculators and utilities are for informational purposes only and do not constitute professional financial or legal advice.",
  robots: { index: true, follow: false },
  alternates: { canonical: "/disclaimer" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
