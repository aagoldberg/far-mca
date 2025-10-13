import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://far-micro.ngrok.dev';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "LendFriend - Zero-Interest Community Loans",
  description: "Get zero-interest loans from your community. No interest, just 1.0x repayment.",
  openGraph: {
    title: "LendFriend - Zero-Interest Community Loans",
    description: "Get zero-interest loans from your community",
    images: ["https://placehold.co/1200x630/2E7D32/white?text=LendFriend"],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://placehold.co/1200x630/2E7D32/white?text=LendFriend",
    "fc:frame:button:1": "Open App",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": appUrl,
  },
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
