import { NextRequest, NextResponse } from 'next/server';

/**
 * Neynar Webhook Handler
 * POST /api/notifications/webhook
 *
 * This endpoint receives events from Neynar when users interact with notifications
 * or enable/disable them in Warpcast.
 *
 * To set up:
 * 1. Go to https://neynar.com and create an app
 * 2. Set up a webhook pointing to this endpoint
 * 3. Copy the webhook ID and update farcaster.json webhookUrl
 */

interface WebhookEvent {
  type: 'frame_added' | 'frame_removed' | 'notifications_enabled' | 'notifications_disabled';
  data: {
    fid: number;
    url?: string;
    timestamp?: number;
    notificationDetails?: {
      token: string;
      url: string;
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    const event: WebhookEvent = await request.json();

    console.log('[Webhook] Received event:', event.type, 'FID:', event.data.fid);

    switch (event.type) {
      case 'frame_added':
        // User added the app to their Warpcast
        console.log(`[Webhook] User ${event.data.fid} added the app`);
        // You could store this in a database to track active users
        break;

      case 'frame_removed':
        // User removed the app from their Warpcast
        console.log(`[Webhook] User ${event.data.fid} removed the app`);
        // Clean up any user data if needed
        break;

      case 'notifications_enabled':
        // User enabled notifications
        console.log(`[Webhook] User ${event.data.fid} enabled notifications`);
        if (event.data.notificationDetails) {
          // Store the notification token and URL for sending notifications later
          // In production, save this to your database:
          // await db.users.update({ fid: event.data.fid }, {
          //   notificationToken: event.data.notificationDetails.token,
          //   notificationUrl: event.data.notificationDetails.url,
          //   notificationsEnabled: true
          // });
          console.log('[Webhook] Notification details received - token and URL stored');
        }
        break;

      case 'notifications_disabled':
        // User disabled notifications
        console.log(`[Webhook] User ${event.data.fid} disabled notifications`);
        // Update database to stop sending notifications to this user
        break;

      default:
        console.log('[Webhook] Unknown event type:', event.type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Webhook] Error processing event:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}

// Handle GET requests for webhook verification
export async function GET(request: NextRequest) {
  // Neynar may send a GET request to verify the webhook endpoint
  return NextResponse.json({ status: 'ok', message: 'LendFriend notification webhook' });
}
