import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  // For now, redirect to a placeholder
  // TODO: Implement dynamic OG image generation with @vercel/og or satori
  const imageUrl = `https://placehold.co/1200x800/3B9B7F/white?text=Support+This+Loan+%7C+LendFriend&font=roboto`;

  return Response.redirect(imageUrl);
}
