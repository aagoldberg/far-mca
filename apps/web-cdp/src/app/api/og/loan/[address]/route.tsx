import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getLoanDataForMetadata } from '@/lib/loanMetadata';

export const runtime = 'edge';

// Cache OG images for 1 hour, revalidate every 5 minutes
export const revalidate = 300;

// Simple number formatter for edge runtime compatibility
function formatNumber(num: any): string {
  try {
    if (num === undefined || num === null || typeof num !== 'number' || isNaN(num)) return '0';
    const rounded = Math.round(num);
    const str = String(rounded);
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } catch (e) {
    console.error('[formatNumber] Error:', e, 'num:', num);
    return '0';
  }
}

// Validate image URL (Edge Runtime compatible - no Buffer needed)
async function validateAndFetchImage(imageUrl: string | undefined): Promise<string | null> {
  if (!imageUrl) return null;

  try {
    console.log('[OG] Validating image:', imageUrl);

    // Set timeout for image fetch (5 seconds max for IPFS)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(imageUrl, {
      signal: controller.signal,
      headers: { 'Accept': 'image/*' }
    });

    clearTimeout(timeoutId);

    // Validate response
    if (!response.ok) {
      console.log('[OG] Image fetch failed:', response.status, response.statusText);
      return null;
    }

    // Validate content type
    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      console.log('[OG] Invalid content type:', contentType);
      return null;
    }

    console.log('[OG] Image validated successfully');
    // Return the URL directly - ImageResponse can fetch it
    return imageUrl;
  } catch (error) {
    console.log('[OG] Image validation failed:', error);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    // Add timeout to prevent hanging (20s to allow for image fetch)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 20000)
    );

    const loan = await Promise.race([
      getLoanDataForMetadata(address),
      timeoutPromise
    ]) as Awaited<ReturnType<typeof getLoanDataForMetadata>>;

    console.log('[OG] Full loan data:', JSON.stringify(loan, null, 2));

    if (!loan) {
      console.error('[OG] Loan data is null/undefined');
      return new Response('Loan not found', { status: 404 });
    }

    // Safety checks for all values
    const principal = typeof loan.principal === 'number' ? loan.principal : 0;
    const totalFunded = typeof loan.totalFunded === 'number' ? loan.totalFunded : 0;
    const progressPercent = principal > 0 ? Math.round((totalFunded / principal) * 100) : 0;
    const title = loan.title || 'Community Loan';
    const borrower = loan.borrower || '';

    // Validate and fetch image (convert to base64 for reliability)
    const validatedImage = await validateAndFetchImage(loan.image);

    console.log('[OG] Processed values:', {
      principal,
      totalFunded,
      progressPercent,
      title,
      hasValidatedImage: !!validatedImage,
      borrower: borrower ? `${borrower.substring(0, 6)}...` : 'none'
    });

    // Format values as strings for ImageResponse
    const principalStr = formatNumber(principal);
    const totalFundedStr = formatNumber(totalFunded);
    const progressWidth = Math.min(progressPercent, 100);

    // Choose layout based on whether we have a valid image
    const hasImage = Boolean(validatedImage);

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            backgroundColor: 'white',
            padding: '0',
          }}
        >
          {/* Two-column layout */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              height: '100%',
              backgroundColor: 'white',
            }}
          >
            {/* Left: Image Section */}
            {hasImage && validatedImage && (
              <div
                style={{
                  display: 'flex',
                  width: '50%',
                  height: '100%',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#f3f4f6',
                }}
              >
                <img
                  src={validatedImage}
                  alt={title}
                  width={600}
                  height={630}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                />
                {/* Status badge overlay - only show if fully funded */}
                {progressPercent >= 100 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '24px',
                      right: '24px',
                      display: 'flex',
                    }}
                  >
                    <span
                      style={{
                        padding: '12px 24px',
                        borderRadius: '10px',
                        fontSize: '18px',
                        fontWeight: 700,
                        backgroundColor: '#dcfce7',
                        color: '#15803d',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      Funded ✓
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Right: Content Section */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                padding: '56px 60px',
                justifyContent: 'center',
                backgroundColor: 'white',
              }}
            >
              {/* All content centered vertically */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Title - larger and bold */}
                <h1
                  style={{
                    fontSize: '46px',
                    fontWeight: 600,
                    color: '#111827',
                    margin: 0,
                    lineHeight: '1.15',
                    display: 'flex',
                  }}
                >
                  {title}
                </h1>

                {/* Progress Bar - clean and trustworthy */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      position: 'relative',
                      width: '100%',
                      height: '28px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '100px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${progressWidth}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #3B9B7F 0%, #2C7DA0 100%)',
                        borderRadius: '100px',
                        display: 'flex',
                      }}
                    />
                  </div>

                  {/* Funding text - simplified */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '56px',
                        fontWeight: 800,
                        color: '#3B9B7F',
                        lineHeight: '1',
                      }}
                    >
                      ${totalFundedStr} raised
                    </span>
                    <span
                      style={{
                        fontSize: '24px',
                        color: '#6b7280',
                        fontWeight: 500,
                      }}
                    >
                      of ${principalStr} goal · {progressPercent}% funded
                    </span>
                  </div>
                </div>

                {/* Footer - simple and trustworthy */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: '24px',
                    borderTop: '2px solid #e5e7eb',
                  }}
                >
                  <span
                    style={{
                      fontSize: '24px',
                      color: '#2C7DA0',
                      fontWeight: 600,
                    }}
                  >
                    LendFriend · Community Capital for Creators
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
