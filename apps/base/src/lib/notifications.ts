/**
 * Neynar Notifications Service
 * Server-side only - handles sending push notifications to users via Neynar
 *
 * Setup required:
 * 1. Create a Neynar developer account at https://neynar.com
 * 2. Get your API key and webhook ID from the dashboard
 * 3. Set NEYNAR_API_KEY and NEYNAR_WEBHOOK_ID in environment variables
 * 4. Update farcaster.json manifest with the webhook URL
 */

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

// Base URL for the app
const APP_URL = process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3005');

interface NotificationPayload {
  targetFid: number;
  title: string;
  body: string;
  targetUrl?: string;
}

/**
 * Send a notification to a Farcaster user
 */
export async function sendNotification(payload: NotificationPayload): Promise<boolean> {
  if (!NEYNAR_API_KEY) {
    console.warn('[Notifications] NEYNAR_API_KEY not configured - skipping notification');
    return false;
  }

  try {
    const response = await fetch('https://api.neynar.com/v2/farcaster/frame/send_notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key': NEYNAR_API_KEY,
      },
      body: JSON.stringify({
        target_fids: [payload.targetFid],
        title: payload.title,
        body: payload.body,
        target_url: payload.targetUrl || APP_URL,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Notifications] Failed to send notification:', response.status, error);
      return false;
    }

    console.log('[Notifications] Successfully sent notification to FID:', payload.targetFid);
    return true;
  } catch (error) {
    console.error('[Notifications] Error sending notification:', error);
    return false;
  }
}

/**
 * Notify borrower that someone contributed to their loan
 */
export async function notifyContribution(params: {
  borrowerFid: number;
  contributorName: string;
  amount: string;
  loanAddress: string;
  loanTitle: string;
  newTotal: string;
  goal: string;
}): Promise<boolean> {
  const { borrowerFid, contributorName, amount, loanAddress, loanTitle, newTotal, goal } = params;

  const percentFunded = Math.round((parseFloat(newTotal) / parseFloat(goal)) * 100);

  return sendNotification({
    targetFid: borrowerFid,
    title: `$${amount} contribution received!`,
    body: `${contributorName} funded your loan "${loanTitle}" (${percentFunded}% funded)`,
    targetUrl: `${APP_URL}/loan/${loanAddress}`,
  });
}

/**
 * Notify borrower that their loan is fully funded
 */
export async function notifyFullyFunded(params: {
  borrowerFid: number;
  loanAddress: string;
  loanTitle: string;
  totalAmount: string;
}): Promise<boolean> {
  const { borrowerFid, loanAddress, loanTitle, totalAmount } = params;

  return sendNotification({
    targetFid: borrowerFid,
    title: 'Your loan is fully funded!',
    body: `"${loanTitle}" reached its $${totalAmount} goal. You can now claim the funds.`,
    targetUrl: `${APP_URL}/loan/${loanAddress}`,
  });
}

/**
 * Notify contributors that a loan they funded has started repayment
 */
export async function notifyRepaymentStarted(params: {
  contributorFids: number[];
  borrowerName: string;
  loanAddress: string;
  loanTitle: string;
}): Promise<void> {
  const { contributorFids, borrowerName, loanAddress, loanTitle } = params;

  for (const fid of contributorFids) {
    await sendNotification({
      targetFid: fid,
      title: 'Loan repayment started',
      body: `${borrowerName} has started repaying "${loanTitle}"`,
      targetUrl: `${APP_URL}/loan/${loanAddress}`,
    });
  }
}

/**
 * Notify contributors that a repayment was made
 */
export async function notifyRepayment(params: {
  contributorFids: number[];
  borrowerName: string;
  amount: string;
  loanAddress: string;
  loanTitle: string;
  percentRepaid: number;
}): Promise<void> {
  const { contributorFids, borrowerName, amount, loanAddress, loanTitle, percentRepaid } = params;

  for (const fid of contributorFids) {
    await sendNotification({
      targetFid: fid,
      title: `$${amount} repayment received`,
      body: `${borrowerName} repaid "${loanTitle}" (${percentRepaid}% complete)`,
      targetUrl: `${APP_URL}/loan/${loanAddress}`,
    });
  }
}

/**
 * Notify borrower about upcoming repayment due date
 */
export async function notifyUpcomingDueDate(params: {
  borrowerFid: number;
  loanAddress: string;
  loanTitle: string;
  daysUntilDue: number;
  amountDue: string;
}): Promise<boolean> {
  const { borrowerFid, loanAddress, loanTitle, daysUntilDue, amountDue } = params;

  return sendNotification({
    targetFid: borrowerFid,
    title: `Repayment due in ${daysUntilDue} days`,
    body: `$${amountDue} is due for "${loanTitle}"`,
    targetUrl: `${APP_URL}/loan/${loanAddress}`,
  });
}

/**
 * Notify contributors that a loan is fully repaid
 */
export async function notifyLoanCompleted(params: {
  contributorFids: number[];
  borrowerName: string;
  loanAddress: string;
  loanTitle: string;
}): Promise<void> {
  const { contributorFids, borrowerName, loanAddress, loanTitle } = params;

  for (const fid of contributorFids) {
    await sendNotification({
      targetFid: fid,
      title: 'Loan fully repaid!',
      body: `${borrowerName} has fully repaid "${loanTitle}". You can claim your funds.`,
      targetUrl: `${APP_URL}/loan/${loanAddress}`,
    });
  }
}

/**
 * Notify a user about a new loan from someone they follow
 */
export async function notifyNewLoanFromFollowing(params: {
  followerFid: number;
  borrowerName: string;
  loanAddress: string;
  loanTitle: string;
  amount: string;
}): Promise<boolean> {
  const { followerFid, borrowerName, loanAddress, loanTitle, amount } = params;

  return sendNotification({
    targetFid: followerFid,
    title: `${borrowerName} needs a loan`,
    body: `"${loanTitle}" - $${amount} at 0% interest`,
    targetUrl: `${APP_URL}/loan/${loanAddress}`,
  });
}

/**
 * Get FID from wallet address using Neynar
 */
export async function getFidFromAddress(address: string): Promise<number | null> {
  if (!NEYNAR_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${address.toLowerCase()}`,
      {
        headers: {
          'accept': 'application/json',
          'api_key': NEYNAR_API_KEY,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const users = data[address.toLowerCase()];

    if (users && users.length > 0) {
      return users[0].fid;
    }

    return null;
  } catch (error) {
    console.error('[Notifications] Error getting FID from address:', error);
    return null;
  }
}
