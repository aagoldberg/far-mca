import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getLoanDataForMetadata } from '@/lib/loanMetadata';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 8000)
    );

    const loan = await Promise.race([
      getLoanDataForMetadata(address),
      timeoutPromise
    ]) as Awaited<ReturnType<typeof getLoanDataForMetadata>>;

    if (!loan) {
      return new Response('Loan not found', { status: 404 });
    }

    const progressPercent = Math.round((loan.totalFunded / loan.principal) * 100);
    const remaining = loan.principal - loan.totalFunded;

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            backgroundColor: '#f3f4f6',
            padding: '0',
          }}
        >
          {/* Two Column Layout */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '100%',
              backgroundColor: 'white',
            }}
          >
            {/* Left Side - Image or Gradient */}
            <div
              style={{
                width: '50%',
                height: '100%',
                display: 'flex',
                position: 'relative',
                background: loan.image
                  ? undefined
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {loan.image ? (
                <img
                  src={loan.image}
                  alt={loan.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div style={{ fontSize: '120px', color: 'white', opacity: 0.9 }}>
                  💚
                </div>
              )}
              {/* Overlay Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '30px',
                  left: '30px',
                  backgroundColor: loan.image ? '#10b981' : 'rgba(255,255,255,0.95)',
                  color: loan.image ? 'white' : '#10b981',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '20px',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                Zero-Interest Loan
              </div>
            </div>

            {/* Right Side - Content */}
            <div
              style={{
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                padding: '60px 50px',
                justifyContent: 'space-between',
                backgroundColor: 'white',
              }}
            >
              {/* Top Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Title */}
                <h1
                  style={{
                    fontSize: '42px',
                    fontWeight: 700,
                    color: '#111827',
                    margin: '0',
                    lineHeight: '1.2',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {loan.title}
                </h1>

                {/* Borrower */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '20px',
                      backgroundColor: '#e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#6b7280',
                    }}
                  >
                    {loan.borrower.substring(2, 4).toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '14px', color: '#9ca3af' }}>Borrower</span>
                    <span style={{ fontSize: '18px', color: '#374151', fontWeight: 600 }}>
                      {loan.borrower.substring(0, 6)}...{loan.borrower.substring(loan.borrower.length - 4)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Amount Raised */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div
                    style={{
                      fontSize: '48px',
                      fontWeight: 800,
                      color: '#10b981',
                      lineHeight: '1',
                    }}
                  >
                    ${loan.totalFunded.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '20px', color: '#6b7280' }}>
                    raised of ${loan.principal.toLocaleString()} goal
                  </div>
                </div>

                {/* Progress Bar */}
                <div
                  style={{
                    width: '100%',
                    height: '16px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    display: 'flex',
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(progressPercent, 100)}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                    }}
                  />
                </div>

                {/* Stats Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '32px', fontWeight: 700, color: '#111827' }}>
                      {progressPercent}%
                    </span>
                    <span style={{ fontSize: '18px', color: '#6b7280' }}>funded</span>
                  </div>
                  {remaining > 0 && (
                    <div
                      style={{
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '16px',
                        fontWeight: 600,
                      }}
                    >
                      ${remaining.toLocaleString()} to go
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  paddingTop: '20px',
                  borderTop: '1px solid #e5e7eb',
                }}
              >
                <span style={{ fontSize: '16px', color: '#6b7280', fontWeight: 500 }}>
                  everybit • Community Microloans
                </span>
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
