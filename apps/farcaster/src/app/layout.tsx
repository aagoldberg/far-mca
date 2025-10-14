import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://far-micro.ngrok.dev';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "LendFriend | Community-Powered Interest-Free Loans",
  description: "Support your community with interest-free loans. Help local businesses grow while getting your contribution back - no interest, just community support.",
  openGraph: {
    title: "LendFriend | Community-Powered Interest-Free Loans",
    description: "Support your community with interest-free loans",
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
