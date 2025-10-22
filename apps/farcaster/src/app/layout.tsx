import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "../components/Navbar";

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
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: "https://placehold.co/1200x800/3B9B7F/white?text=LendFriend+%7C+Community+Loans",
      button: {
        title: "Open LendFriend",
        action: {
          type: "launch_frame",
          name: "LendFriend",
          url: appUrl,
          splashImageUrl: `${appUrl}/splash.png`,
          splashBackgroundColor: "#f5f0ec"
        }
      }
    }),
    // Backward compatibility
    "fc:frame": JSON.stringify({
      version: "1",
      imageUrl: "https://placehold.co/1200x800/3B9B7F/white?text=LendFriend+%7C+Community+Loans",
      button: {
        title: "Open LendFriend",
        action: {
          type: "launch_frame",
          name: "LendFriend",
          url: appUrl,
          splashImageUrl: `${appUrl}/splash.png`,
          splashBackgroundColor: "#f5f0ec"
        }
      }
    })
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
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
