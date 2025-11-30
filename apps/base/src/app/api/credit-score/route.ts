import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateCreditScore, type BusinessConnection } from '@/lib/credit-score';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * POST /api/credit-score
 *
 * Calculate credit score for a wallet address based on all connected business platforms
 *
 * Body: { walletAddress: string }
 * Returns: { score, breakdown, factors, recommendations }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'walletAddress is required' },
        { status: 400 }
      );
    }

    // Fetch all active connections for this wallet
    const { data: connections, error } = await supabase
      .from('business_connections')
      .select('*')
      .eq('wallet_address', walletAddress.toLowerCase())
      .eq('is_active', true);

    if (error) {
      console.error('[Credit Score] Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch business connections' },
        { status: 500 }
      );
    }

    if (!connections || connections.length === 0) {
      return NextResponse.json({
        score: 0,
        breakdown: { revenueScore: 0, consistencyScore: 0, reliabilityScore: 0, growthScore: 0 },
        factors: ['No business connections'],
        recommendations: ['Connect your Shopify, Stripe, Square, or bank account'],
      });
    }

    // Transform database records to BusinessConnection format
    const businessConnections: BusinessConnection[] = connections.map(conn => ({
      platform: conn.platform,
      revenue_data: conn.revenue_data,
      connected_at: new Date(conn.connected_at),
      last_synced_at: conn.last_synced_at ? new Date(conn.last_synced_at) : undefined,
    }));

    // Calculate score
    const result = calculateCreditScore(businessConnections);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Credit Score] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/credit-score?walletAddress=0x...
 *
 * Get credit score for a wallet address (read-only)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'walletAddress query parameter is required' },
        { status: 400 }
      );
    }

    // Fetch all active connections for this wallet
    const { data: connections, error } = await supabase
      .from('business_connections')
      .select('*')
      .eq('wallet_address', walletAddress.toLowerCase())
      .eq('is_active', true);

    if (error) {
      console.error('[Credit Score] Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch business connections' },
        { status: 500 }
      );
    }

    if (!connections || connections.length === 0) {
      return NextResponse.json({
        score: 0,
        breakdown: { revenueScore: 0, consistencyScore: 0, reliabilityScore: 0, growthScore: 0 },
        factors: ['No business connections'],
        recommendations: ['Connect your Shopify, Stripe, Square, or bank account'],
        connections: [],
      });
    }

    // Transform database records to BusinessConnection format
    const businessConnections: BusinessConnection[] = connections.map(conn => ({
      platform: conn.platform,
      revenue_data: conn.revenue_data,
      connected_at: new Date(conn.connected_at),
      last_synced_at: conn.last_synced_at ? new Date(conn.last_synced_at) : undefined,
    }));

    // Calculate score
    const result = calculateCreditScore(businessConnections);

    // Include connection details (without sensitive tokens)
    const connectionsInfo = connections.map(conn => ({
      platform: conn.platform,
      platform_user_id: conn.platform_user_id,
      connected_at: conn.connected_at,
      last_synced_at: conn.last_synced_at,
      revenue_data: conn.revenue_data,
    }));

    return NextResponse.json({
      ...result,
      connections: connectionsInfo,
    });
  } catch (error) {
    console.error('[Credit Score] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
