import { NextResponse } from 'next/server';

const COINBASE_COMMERCE_API_KEY = process.env.COINBASE_COMMERCE_API_KEY;
const COINBASE_COMMERCE_API_URL = 'https://api.commerce.coinbase.com/charges';

export async function POST(request: Request) {
  if (!COINBASE_COMMERCE_API_KEY) {
    return NextResponse.json({ error: 'Coinbase Commerce API key is not configured.' }, { status: 500 });
  }

  try {
    const { amount, currency = 'USD', campaignId, campaignName } = await request.json();

    if (!amount || !campaignId || !campaignName) {
      return NextResponse.json({ error: 'Missing required fields: amount, campaignId, campaignName' }, { status: 400 });
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CC-Api-Key': COINBASE_COMMERCE_API_KEY,
      },
      body: JSON.stringify({
        pricing_type: 'fixed_price',
        local_price: {
          amount: amount,
          currency: currency,
        },
        name: `Donation to ${campaignName}`,
        description: `Campaign ID: ${campaignId}`,
        metadata: {
            campaign_id: campaignId,
        },
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/campaign/${campaignId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/campaign/${campaignId}`,
      }),
    };

    const response = await fetch(COINBASE_COMMERCE_API_URL, options);
    const chargeData = await response.json();

    if (!response.ok) {
        console.error('Coinbase Commerce API Error:', chargeData);
        return NextResponse.json({ error: chargeData.error?.message || 'Failed to create charge.' }, { status: response.status });
    }

    return NextResponse.json({ chargeId: chargeData.data.id });

  } catch (error) {
    console.error('Error creating charge:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unknown error occurred.' }, { status: 500 });
  }
} 