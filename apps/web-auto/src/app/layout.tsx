import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "CDP Auto-Repayment Demo",
  description: "Demo of CDP Smart Wallet auto-repayment with session keys",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Providers>
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
