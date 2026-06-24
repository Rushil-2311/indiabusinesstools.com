import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Decoder — Decode JSON Web Tokens Online",
  description:
    "Decode and inspect JWT tokens instantly. View header, payload, expiry status, issued-at time, and algorithm — no secret key required.",
  keywords: ["jwt decoder", "jwt token decoder", "json web token decoder", "jwt parser online", "decode jwt payload"],
  openGraph: {
    title: "JWT Decoder | IndianBusinessTools",
    description: "Decode JWT tokens and inspect header, payload, and expiry — no secret needed.",
    url: "https://www.indiabusinesstools.com/jwt-decoder",
  },
  alternates: { canonical: "/jwt-decoder" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
