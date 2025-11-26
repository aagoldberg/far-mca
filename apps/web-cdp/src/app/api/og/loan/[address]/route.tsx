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
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            padding: '0',
          }}
        >
          {/* Card Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: hasImage ? 'row' : 'column',
              width: '100%',
              height: '100%',
              backgroundColor: 'white',
              borderRadius: '0',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Image Section with Gradient Overlay */}
            {hasImage && validatedImage && (
              <div
                style={{
                  display: 'flex',
                  width: '45%',
                  height: '100%',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <img
                  src={validatedImage}
                  alt={title}
                  width={540}
                  height={630}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                {/* Gradient overlay for depth */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,255,255,0.05) 100%)',
                    display: 'flex',
                  }}
                />
              </div>
            )}

            {/* Content Section */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                padding: hasImage ? '60px 60px 50px 60px' : '70px',
                background: hasImage
                  ? 'white'
                  : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                position: 'relative',
              }}
            >
              {/* Status Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: progressPercent >= 100 ? '#dcfce7' : '#f0fdf4',
                    color: progressPercent >= 100 ? '#15803d' : '#16a34a',
                    padding: '8px 16px',
                    borderRadius: '100px',
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                  }}
                >
                  {progressPercent >= 100 ? '✓ FULLY FUNDED' : '○ ACTIVE CAMPAIGN'}
                </div>
              </div>

              {/* Title with improved hierarchy */}
              <h1
                style={{
                  fontSize: hasImage ? '46px' : '64px',
                  fontWeight: 800,
                  color: '#0f172a',
                  margin: 0,
                  marginBottom: '32px',
                  lineHeight: '1.1',
                  letterSpacing: '-0.02em',
                }}
              >
                {title}
              </h1>

              {/* Funding Stats with Visual Hierarchy */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  marginBottom: '40px',
                }}
              >
                {/* Main Amount */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div
                    style={{
                      display: 'flex',
                      fontSize: hasImage ? '68px' : '88px',
                      fontWeight: 900,
                      color: '#10b981',
                      lineHeight: '1',
                    }}
                  >
                    ${totalFundedStr}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '22px',
                      color: '#64748b',
                      fontWeight: 500,
                    }}
                  >
                    of ${principalStr} goal
                  </div>
                </div>

                {/* Enhanced Progress Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                  <div
                    style={{
                      display: 'flex',
                      position: 'relative',
                      width: '100%',
                      height: '16px',
                      backgroundColor: '#e2e8f0',
                      borderRadius: '100px',
                      overflow: 'hidden',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <div
                      style={{
                        width: `${progressWidth}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #059669 0%, #10b981 50%, #34d399 100%)',
                        borderRadius: '100px',
                        display: 'flex',
                        boxShadow: progressWidth > 0 ? '0 0 20px rgba(16, 185, 129, 0.3)' : 'none',
                      }}
                    />
                  </div>
                  {/* Percentage Badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '38px',
                        fontWeight: 800,
                        color: '#10b981',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {progressPercent}%
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '16px',
                        color: '#94a3b8',
                        fontWeight: 500,
                      }}
                    >
                      funded
                    </div>
                  </div>
                </div>
              </div>

              {/* Borrower Info with Icon */}
              {borrower && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '20px 24px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    borderLeft: '4px solid #10b981',
                    marginTop: 'auto',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      width: '44px',
                      height: '44px',
                      backgroundColor: '#dcfce7',
                      borderRadius: '100px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#059669',
                    }}
                  >
                    {borrower.substring(2, 4).toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, letterSpacing: '0.5px' }}>
                      BORROWER
                    </span>
                    <span style={{ fontSize: '18px', color: '#0f172a', fontWeight: 600, fontFamily: 'monospace' }}>
                      {borrower.substring(0, 6)}...{borrower.substring(borrower.length - 4)}
                    </span>
                  </div>
                </div>
              )}

              {/* Footer Branding */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '32px',
                  paddingTop: '24px',
                  borderTop: '2px solid #e2e8f0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#10b981',
                    letterSpacing: '-0.01em',
                  }}
                >
                  lendfriend
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontSize: '14px',
                    color: '#94a3b8',
                    fontWeight: 500,
                  }}
                >
                  Zero-interest community loans
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
