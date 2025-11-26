import { Metadata } from 'next';
import LoanDetails from '@/components/LoanDetails';
import { getLoanDataForMetadata } from '@/lib/loanMetadata';

interface PageProps {
  params: Promise<{ address: string }>;
}

// Generate dynamic Open Graph metadata for each loan
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { address } = await params;

  // Fetch loan data for metadata (we'll create this helper)
  const loan = await getLoanDataForMetadata(address);

  if (!loan) {
    return {
      title: 'Loan Not Found',
      description: 'This loan could not be found.',
    };
  }

  const progressPercent = Math.round((loan.totalFunded / loan.principal) * 100);
  const progressEmoji = progressPercent >= 75 ? '🔥' : progressPercent >= 50 ? '🎯' : progressPercent >= 25 ? '✨' : '💚';

  const title = `${progressEmoji} ${loan.title}`;
  const description = `${progressPercent}% funded • $${loan.totalFunded.toLocaleString()} of $${loan.principal.toLocaleString()} raised. Zero-interest community loan. Every dollar makes a difference!`;

  // Auto-detect base URL from Vercel or use env variable
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3004');
  const loanUrl = `${baseUrl}/loan/${address}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: loanUrl,
      siteName: 'lendfriend',
      images: [
        {
          url: `${baseUrl}/api/og/loan/${address}`, // Always use dynamic OG image with formatted design
          width: 1200,
          height: 630,
          alt: loan.title,
          type: 'image/png',
        },
      ],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/api/og/loan/${address}`], // Dynamic formatted image
      site: '@lendfriend',
    },
  };
}

export default async function LoanDetailPage({ params }: PageProps) {
  const { address } = await params;

  return <LoanDetails loanAddress={address as `0x${string}`} />;
}
