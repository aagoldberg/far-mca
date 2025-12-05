import type { Metadata } from "next";
import { Nunito, Figtree, Rubik, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AirdropToast } from "@/components/AirdropToast";
import { Analytics } from "@vercel/analytics/react";

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

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["600", "700", "800"],
});

// Auto-detect base URL from Vercel or use env variable
const appUrl = process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3004');

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "LendFriend | Community-Powered Interest-Free Loans",
  description: "Building reputation-based lending for the new economy",
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
    <html lang="en" className={`${nunito.variable} ${figtree.variable} ${rubik.variable} ${plusJakarta.variable}`}>
      <body className="bg-white">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <AirdropToast />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
