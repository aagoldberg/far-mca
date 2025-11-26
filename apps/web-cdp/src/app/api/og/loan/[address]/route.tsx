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

// Validate and optionally convert image to base64 for reliability
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

    // For better reliability, convert to base64
    // This avoids I/O during ImageResponse rendering
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUri = `data:${contentType};base64,${base64}`;

    console.log('[OG] Image validated and converted to base64');
    return dataUri;
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
                {/* Status badge overlay */}
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
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: 600,
                      backgroundColor: progressPercent >= 100 ? '#dcfce7' : '#fef3c7',
                      color: progressPercent >= 100 ? '#15803d' : '#92400e',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    {progressPercent >= 100 ? 'Funded' : 'Fundraising'}
                  </span>
                </div>
              </div>
            )}

            {/* Right: Content Section */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                padding: '48px 52px',
                justifyContent: 'center',
                backgroundColor: 'white',
              }}
            >
              {/* All content centered vertically */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                {/* Title - larger and word-wrapped */}
                <h1
                  style={{
                    fontSize: '52px',
                    fontWeight: 500,
                    color: '#111827',
                    margin: 0,
                    lineHeight: '1.1',
                    display: 'flex',
                  }}
                >
                  {title}
                </h1>

                {/* Progress Bar - larger */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div
                    style={{
                      display: 'flex',
                      position: 'relative',
                      width: '100%',
                      height: '20px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '100px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${progressWidth}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #3B9B7F 0%, #2E7D68 100%)',
                        borderRadius: '100px',
                        display: 'flex',
                      }}
                    />
                  </div>

                  {/* Funding text - much larger */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '36px',
                        fontWeight: 700,
                        color: '#3B9B7F',
                      }}
                    >
                      ${totalFundedStr} raised
                    </span>
                    <span
                      style={{
                        fontSize: '28px',
                        color: '#6b7280',
                        fontWeight: 500,
                      }}
                    >
                      of ${principalStr}
                    </span>
                  </div>
                </div>

                {/* Borrower info - much larger */}
                {borrower && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      paddingTop: '32px',
                      borderTop: '1px solid #e5e7eb',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        width: '56px',
                        height: '56px',
                        backgroundColor: '#dcfce7',
                        borderRadius: '100px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '22px',
                        fontWeight: 600,
                        color: '#15803d',
                      }}
                    >
                      {borrower.substring(2, 4).toUpperCase()}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '16px', color: '#6b7280', fontWeight: 500 }}>
                        Borrower
                      </span>
                      <span style={{ fontSize: '22px', color: '#111827', fontWeight: 600, fontFamily: 'monospace' }}>
                        {borrower.substring(0, 6)}...{borrower.substring(borrower.length - 4)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Footer branding - much larger */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: '28px',
                    borderTop: '1px solid #e5e7eb',
                  }}
                >
                  <span
                    style={{
                      fontSize: '20px',
                      color: '#6b7280',
                      fontWeight: 500,
                    }}
                  >
                    lendfriend · Zero-interest community loans
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
