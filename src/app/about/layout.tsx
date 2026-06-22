import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Free Tools for Indian Businesses",
  description:
    "Learn about IndianBusinessTools — our mission to provide free, fast, and privacy-first business tools for Indian professionals, entrepreneurs, and students.",
  openGraph: {
    title: "About IndianBusinessTools",
    description:
      "Our mission is to provide the highest quality free utilities for Indian businesses, with zero ads and complete privacy.",
    url: "https://www.indiabusinesstools.com/about",
  },
  alternates: { canonical: "/about" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
