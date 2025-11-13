import { NextRequest, NextResponse } from 'next/server';
import { CreditScoringEngine } from '@/lib/credit-scoring/index';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shop, revenueInCents, businessData } = body;

    if (!shop || typeof revenueInCents !== 'number') {
      return NextResponse.json(
        { error: 'Shop and revenueInCents are required' },
        { status: 400 }
      );
    }

    // Calculate credit score using our engine
    const creditScore = CreditScoringEngine.calculateScore(
      revenueInCents,
      businessData?.factors
    );

    const riskLevel = CreditScoringEngine.getRiskLevel(creditScore);

    const result = {
      score: creditScore,
      revenueInCents,
      revenueInDollars: revenueInCents / 100,
      riskLevel,
      timestamp: new Date().toISOString(),
      shop,
      verifiable: true,
      verification: {
        contract: process.env.SCORER_CONTRACT_ADDRESS || 'not-configured',
        network: 'Base Sepolia',
        chainId: 84532,
        blockchainVerified: false // Will be true when Chainlink integration is active
      }
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Credit scoring error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate credit score' },
      { status: 500 }
    );
  }
}