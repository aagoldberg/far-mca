import { NextRequest, NextResponse } from 'next/server';
import { verifyUSDCPayment, verifyLoanContribution } from '@/lib/paymentVerification';
import { parseUnits } from 'viem';

/**
 * Verify a USDC payment transaction
 * POST /api/verify-payment
 *
 * Body: {
 *   txHash: '0x123...',
 *   recipient: '0x456...',  // Expected recipient (loan address or user)
 *   amount: '100',          // Expected amount in USDC (human readable, e.g., "100" for $100)
 *   sender?: '0x789...',    // Optional expected sender
 *   type?: 'loan'           // 'loan' for loan contributions, 'generic' for general USDC transfers
 * }
 *
 * Response: {
 *   isValid: boolean,
 *   error?: string,
 *   details?: {
 *     from: string,
 *     to: string,
 *     amount: string,      // Human readable amount
 *     blockNumber: string,
 *     timestamp: number
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const {
      txHash,
      recipient,
      amount,
      sender,
      type = 'generic',
    } = await request.json();

    // Validation
    if (!txHash || !recipient || !amount) {
      return NextResponse.json(
        {
          isValid: false,
          error: 'Missing required parameters: txHash, recipient, amount'
        },
        { status: 400 }
      );
    }

    // Validate transaction hash format
    if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
      return NextResponse.json(
        {
          isValid: false,
          error: 'Invalid transaction hash format'
        },
        { status: 400 }
      );
    }

    // Validate recipient address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
      return NextResponse.json(
        {
          isValid: false,
          error: 'Invalid recipient address format'
        },
        { status: 400 }
      );
    }

    // Validate sender address if provided
    if (sender && !/^0x[a-fA-F0-9]{40}$/.test(sender)) {
      return NextResponse.json(
        {
          isValid: false,
          error: 'Invalid sender address format'
        },
        { status: 400 }
      );
    }

    // Parse amount (USDC has 6 decimals)
    let amountBigInt: bigint;
    try {
      amountBigInt = parseUnits(amount.toString(), 6);
    } catch (err) {
      return NextResponse.json(
        {
          isValid: false,
          error: 'Invalid amount format'
        },
        { status: 400 }
      );
    }

    console.log('[Payment Verification] Verifying payment:', {
      txHash,
      recipient,
      amount: amount.toString(),
      sender,
      type,
    });

    // Verify payment
    let result;
    if (type === 'loan' && sender) {
      // Use loan-specific verification
      result = await verifyLoanContribution(
        txHash,
        recipient,
        sender,
        amountBigInt
      );
    } else {
      // Generic USDC payment verification
      result = await verifyUSDCPayment(
        txHash,
        recipient,
        amountBigInt,
        sender
      );
    }

    if (!result.isValid) {
      console.warn('[Payment Verification] ✗ Payment verification failed:', result.error);
      return NextResponse.json(
        {
          isValid: false,
          error: result.error,
        },
        { status: 200 } // Still 200, not an error in the API call itself
      );
    }

    console.log('[Payment Verification] ✓ Payment verified successfully');

    // Return success with details
    return NextResponse.json({
      isValid: true,
      details: {
        transactionHash: result.transactionHash,
        from: result.from,
        to: result.to,
        amount: (Number(result.amount) / 1e6).toString(), // Convert to human readable
        blockNumber: result.blockNumber?.toString(),
        timestamp: result.timestamp,
      },
    });

  } catch (error: any) {
    console.error('[Payment Verification] Unexpected error:', error);
    return NextResponse.json(
      {
        isValid: false,
        error: error.message || 'Failed to verify payment',
      },
      { status: 500 }
    );
  }
}
