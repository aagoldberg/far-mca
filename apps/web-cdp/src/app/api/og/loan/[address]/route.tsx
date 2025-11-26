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
            backgroundColor: '#f9fafb',
            padding: '60px',
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
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Image Section (conditional) */}
            {hasImage && validatedImage && (
              <div
                style={{
                  display: 'flex',
                  width: '40%',
                  height: '100%',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={validatedImage}
                  alt={title}
                  width={480}
                  height={630}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
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
                padding: '50px',
                justifyContent: 'space-between',
              }}
            >
              {/* Title */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <h1
                  style={{
                    fontSize: hasImage ? '42px' : '56px',
                    fontWeight: 700,
                    color: '#111827',
                    margin: 0,
                    marginBottom: '20px',
                    lineHeight: '1.2',
                  }}
                >
                  {title}
                </h1>

                {/* Funding Amount */}
                <div
                  style={{
                    display: 'flex',
                    fontSize: hasImage ? '60px' : '72px',
                    fontWeight: 800,
                    color: '#10b981',
                    marginBottom: '10px',
                  }}
                >
                  ${totalFundedStr}
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontSize: '24px',
                    color: '#6b7280',
                    marginBottom: '30px',
                  }}
                >
                  raised of ${principalStr} goal
                </div>
              </div>

              {/* Bottom Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Borrower Info */}
                {borrower && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '18px', color: '#6b7280' }}>
                      Borrower:
                    </span>
                    <span style={{ fontSize: '18px', color: '#111827', fontWeight: 500 }}>
                      {borrower.substring(0, 6)}...{borrower.substring(borrower.length - 4)}
                    </span>
                  </div>
                )}

                {/* Progress Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '20px', color: '#6b7280' }}>
                      Progress:
                    </span>
                    <span style={{ fontSize: '32px', color: '#10b981', fontWeight: 700 }}>
                      {progressPercent}% funded
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '12px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      display: 'flex',
                    }}
                  >
                    <div
                      style={{
                        width: `${progressWidth}%`,
                        height: '100%',
                        backgroundColor: '#10b981',
                        borderRadius: '6px',
                      }}
                    />
                  </div>
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
