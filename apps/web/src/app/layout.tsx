import type { Metadata } from "next";
import { Nunito, Figtree, Rubik } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800"],
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
});

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "Yunus | Revenue-Based Financing Platform",
  description: "Get growth capital for your business with revenue-based financing. Investors earn returns based on your revenue without taking equity.",
};

// Force dynamic rendering to prevent SSG conflicts
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${figtree.variable} ${rubik.variable}`}>
      <body>
        <Providers>
          <div>
            <Navbar />
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
