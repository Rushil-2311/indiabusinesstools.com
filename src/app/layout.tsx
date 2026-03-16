import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Head from 'next/head'
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Indian Business Tools",
  description: "Tools and resources for Indian businesses",
  verification: {
    google: "dtAsTsMu43DxbdyBaD_bZGhhrzGtC2ulqkT9DLUrcsg",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link
          rel="preload"
          as="image"
          href="/hero-image.webp"
          fetchPriority="high"
        />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
