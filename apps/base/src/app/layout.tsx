import type { Metadata } from "next";
import { Nunito, Figtree, Rubik } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import MiniAppNavbar from "@/components/MiniAppNavbar";
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

// Auto-detect base URL from Vercel or use env variable
const appUrl = process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3005');

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "LendFriend",
  description: "Community lending with 0% interest",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LendFriend',
  },
  other: {
    'fc:miniapp': `${appUrl}/.well-known/farcaster.json`,
    'apple-mobile-web-app-capable': 'yes',
    'mobile-web-app-capable': 'yes',
  },
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
          <div className="flex flex-col h-screen bg-gray-50">
            <MiniAppNavbar />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
