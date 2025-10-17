import { Metadata } from 'next';
import LoanDetails from '@/components/LoanDetails';
import { LoanErrorBoundary } from '@/components/ErrorBoundary';
import { use } from 'react';

interface PageProps {
  params: Promise<{ address: string }>;
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://far-micro.ngrok.dev';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { address } = await params;

  // Create loan-specific embed
  const embed = {
    version: "1",
    imageUrl: `${appUrl}/api/og/loan/${address}`,
    button: {
      title: "Support This Loan",
      action: {
        type: "launch_frame",
        name: "LendFriend",
        url: `${appUrl}/loan/${address}`,
        splashImageUrl: `${appUrl}/splash.png`,
        splashBackgroundColor: "#f5f0ec"
      }
    }
  };

  return {
    title: `Support a Community Loan | LendFriend`,
    description: "Help a community member with a zero-interest loan",
    openGraph: {
      title: `Support a Community Loan | LendFriend`,
      description: "Zero-interest community support",
      images: [`${appUrl}/api/og/loan/${address}`],
    },
    other: {
      "fc:miniapp": JSON.stringify(embed),
      // Backward compatibility
      "fc:frame": JSON.stringify(embed)
    }
  };
}

export default async function LoanDetailPage({ params }: PageProps) {
  const { address } = await params;

  return (
    <LoanErrorBoundary>
      <LoanDetails loanAddress={address as `0x${string}`} />
    </LoanErrorBoundary>
  );
}
