import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "LendFriend - Farcaster Frame",
  description: "Revenue-based financing powered by Farcaster",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
